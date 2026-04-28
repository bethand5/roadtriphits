import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { allBillboard } from '../data/billboard'

const STORAGE_KEY = '@roadtriphits:daily'

// One result per day
export interface DailyResult {
  score: number
  year: number
  completed: boolean
  // Added in v1.0 — older results may not have these
  rankedSongs?: { rank: number; title: string; artist: string }[]
  yearGuess?: number
}

// Map of "YYYY-MM-DD" → result
type DailyHistory = Record<string, DailyResult>

interface DailyState {
  history: DailyHistory
  currentStreak: number
  bestScore: number
  isLoaded: boolean
  loadDaily: () => Promise<void>
  recordResult: (
    dateKey: string,
    score: number,
    year: number,
    rankedSongs: { rank: number; title: string; artist: string }[],
    yearGuess: number
  ) => Promise<void>
  getResult: (dateKey: string) => DailyResult | null
}

// Format a Date object as YYYY-MM-DD using LOCAL time
export function getTodayKey(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Deterministic hash: same input string always produces same number
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0 // force 32-bit int
  }
  return Math.abs(hash)
}

// Pick a year deterministically based on the date.
// Same date → same year for every player on Earth.
// Pool: 1958–2024 only (pre-1958 has Deezer gaps).
export function getYearForDate(dateKey: string): number {
  const eligibleYears = Object.keys(allBillboard)
    .map(Number)
    .filter(y => y >= 1958 && y <= 2024)
    .sort((a, b) => a - b)

  if (eligibleYears.length === 0) {
    return 2000 // safety fallback, should never happen
  }

  const seed = hashString(`roadtriphits-${dateKey}`)
  const index = seed % eligibleYears.length
  return eligibleYears[index]
}

// Compute streak: how many consecutive days, ending today or yesterday, were completed.
function computeStreak(history: DailyHistory): number {
  const today = new Date()
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const key = `${y}-${m}-${day}`
    if (history[key]?.completed) {
      streak++
    } else if (i === 0) {
      continue
    } else {
      break
    }
  }
  return streak
}

function computeBestScore(history: DailyHistory): number {
  let best = 0
  for (const k of Object.keys(history)) {
    if (history[k].score > best) best = history[k].score
  }
  return best
}

export const useDailyStore = create<DailyState>((set, get) => ({
  history: {},
  currentStreak: 0,
  bestScore: 0,
  isLoaded: false,

  loadDaily: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      if (raw) {
        const history = JSON.parse(raw) as DailyHistory
        set({
          history,
          currentStreak: computeStreak(history),
          bestScore: computeBestScore(history),
          isLoaded: true,
        })
      } else {
        set({ isLoaded: true })
      }
    } catch (e) {
      console.log('Daily load error:', e)
      set({ isLoaded: true })
    }
  },

  recordResult: async (dateKey, score, year, rankedSongs, yearGuess) => {
    const state = get()
    if (state.history[dateKey]?.completed) return

    // Strip rankedSongs to just what we need for comparison
    const slimRankedSongs = rankedSongs.map(s => ({
      rank: s.rank,
      title: s.title,
      artist: s.artist,
    }))

    const newHistory = {
      ...state.history,
      [dateKey]: {
        score,
        year,
        completed: true,
        rankedSongs: slimRankedSongs,
        yearGuess,
      },
    }
    set({
      history: newHistory,
      currentStreak: computeStreak(newHistory),
      bestScore: computeBestScore(newHistory),
    })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    } catch (e) {
      console.log('Daily save error:', e)
    }
  },

  getResult: (dateKey) => {
    return get().history[dateKey] ?? null
  },
}))