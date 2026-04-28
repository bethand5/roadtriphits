import { create } from 'zustand'
import { Genre } from '../data/billboard_pre1958'

export interface Player {
  name: string
  score: number
}

export interface Song {
  rank: number
  title: string
  artist: string
  searchQuery?: string
  deezerId?: number
}

export interface Round {
  year: number
  songs: Song[]
}

export type GameMode = 'versus' | 'party'
export type Difficulty = 'easy' | 'medium' | 'hard'

interface GameState {
  players: Player[]
  currentPlayerIndex: number
  currentRound: Round | null
  totalRounds: number
  currentRoundNumber: number
  gameMode: GameMode
  difficulty: Difficulty
  decadeFilter: number[]
  genreFilter: Genre[]
  partyScore: number
  partyMaxScore: number
  // Per-player streaks (parallel array to players)
  streaks: number[]
  maxStreaksInGame: number[]
  setPlayers: (names: string[]) => void
  setTotalRounds: (n: number) => void
  setRound: (round: Round) => void
  addScore: (points: number) => void
  addScoreToPlayer: (playerIndex: number, points: number) => void
  addPartyScore: (points: number, maxPoints: number) => void
  nextPlayer: () => void
  nextPartyRound: () => void
  setGameMode: (mode: GameMode) => void
  setDifficulty: (difficulty: Difficulty) => void
  setDecadeFilter: (decades: number[]) => void
  setGenreFilter: (genres: Genre[]) => void
  incrementStreakForPlayer: (playerIndex: number) => void
  resetStreakForPlayer: (playerIndex: number) => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set) => ({
  players: [],
  currentPlayerIndex: 0,
  currentRound: null,
  totalRounds: 5,
  currentRoundNumber: 1,
  gameMode: 'versus',
  difficulty: 'hard',
  decadeFilter: [],
  genreFilter: [],
  partyScore: 0,
  partyMaxScore: 0,
  streaks: [],
  maxStreaksInGame: [],

  setPlayers: (names) =>
    set({
      players: names.map(name => ({ name, score: 0 })),
      streaks: names.map(() => 0),
      maxStreaksInGame: names.map(() => 0),
    }),

  setTotalRounds: (n) => set({ totalRounds: n }),

  setRound: (round) => set({ currentRound: round }),

  setGameMode: (mode) => set({ gameMode: mode }),

  setDifficulty: (difficulty) => set({ difficulty }),

  setDecadeFilter: (decades) => set({ decadeFilter: decades }),

  setGenreFilter: (genres) => set({ genreFilter: genres }),

  addScore: (points) =>
    set(state => {
      const players = [...state.players]
      players[state.currentPlayerIndex].score += points
      return { players }
    }),

  addScoreToPlayer: (playerIndex, points) =>
    set(state => {
      const players = [...state.players]
      if (players[playerIndex]) {
        players[playerIndex].score += points
      }
      return { players }
    }),

  addPartyScore: (points, maxPoints) =>
    set(state => ({
      partyScore: state.partyScore + points,
      partyMaxScore: state.partyMaxScore + maxPoints,
    })),

  incrementStreakForPlayer: (playerIndex) =>
    set(state => {
      const streaks = [...state.streaks]
      const maxStreaksInGame = [...state.maxStreaksInGame]
      if (streaks[playerIndex] !== undefined) {
        streaks[playerIndex] += 1
        maxStreaksInGame[playerIndex] = Math.max(
          maxStreaksInGame[playerIndex] ?? 0,
          streaks[playerIndex]
        )
      }
      return { streaks, maxStreaksInGame }
    }),

  resetStreakForPlayer: (playerIndex) =>
    set(state => {
      const streaks = [...state.streaks]
      if (streaks[playerIndex] !== undefined) {
        streaks[playerIndex] = 0
      }
      return { streaks }
    }),

  nextPlayer: () =>
    set(state => {
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length
      const nextRound = nextIndex === 0
        ? state.currentRoundNumber + 1
        : state.currentRoundNumber
      return { currentPlayerIndex: nextIndex, currentRoundNumber: nextRound }
    }),

  nextPartyRound: () =>
    set(state => ({
      currentRoundNumber: state.currentRoundNumber + 1,
    })),

  resetGame: () =>
    set({
      players: [],
      currentPlayerIndex: 0,
      currentRound: null,
      currentRoundNumber: 1,
      partyScore: 0,
      partyMaxScore: 0,
      streaks: [],
      maxStreaksInGame: [],
      decadeFilter: [],
      genreFilter: [],
    }),
}))