import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@roadtriphits:stats'

export interface Stats {
  highestVersusScore: number
  bestPartyPercentage: number
  totalGamesPlayed: number
  longestStreak: number
}

const defaultStats: Stats = {
  highestVersusScore: 0,
  bestPartyPercentage: 0,
  totalGamesPlayed: 0,
  longestStreak: 0,
}

interface StatsState extends Stats {
  isLoaded: boolean
  loadStats: () => Promise<void>
  recordVersusGame: (winnerScore: number, maxStreakInGame: number) => Promise<void>
  recordPartyGame: (percentage: number, maxStreakInGame: number) => Promise<void>
  resetStats: () => Promise<void>
}

export const useStatsStore = create<StatsState>((set, get) => ({
  ...defaultStats,
  isLoaded: false,

  loadStats: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Stats>
        set({
          highestVersusScore: parsed.highestVersusScore ?? 0,
          bestPartyPercentage: parsed.bestPartyPercentage ?? 0,
          totalGamesPlayed: parsed.totalGamesPlayed ?? 0,
          longestStreak: parsed.longestStreak ?? 0,
          isLoaded: true,
        })
      } else {
        set({ isLoaded: true })
      }
    } catch (e) {
      console.log('Stats load error:', e)
      set({ isLoaded: true })
    }
  },

  recordVersusGame: async (winnerScore, maxStreakInGame) => {
    const state = get()
    const updated: Stats = {
      highestVersusScore: Math.max(state.highestVersusScore, winnerScore),
      bestPartyPercentage: state.bestPartyPercentage,
      totalGamesPlayed: state.totalGamesPlayed + 1,
      longestStreak: Math.max(state.longestStreak, maxStreakInGame),
    }
    set(updated)
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.log('Stats save error:', e)
    }
  },

  recordPartyGame: async (percentage, maxStreakInGame) => {
    const state = get()
    const updated: Stats = {
      highestVersusScore: state.highestVersusScore,
      bestPartyPercentage: Math.max(state.bestPartyPercentage, percentage),
      totalGamesPlayed: state.totalGamesPlayed + 1,
      longestStreak: Math.max(state.longestStreak, maxStreakInGame),
    }
    set(updated)
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.log('Stats save error:', e)
    }
  },

  resetStats: async () => {
    set({ ...defaultStats, isLoaded: true })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStats))
    } catch (e) {
      console.log('Stats reset error:', e)
    }
  },
}))