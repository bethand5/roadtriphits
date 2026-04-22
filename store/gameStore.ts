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
  streak: number
  setPlayers: (names: string[]) => void
  setTotalRounds: (n: number) => void
  setRound: (round: Round) => void
  addScore: (points: number) => void
  addPartyScore: (points: number, maxPoints: number) => void
  nextPlayer: () => void
  nextPartyRound: () => void
  setGameMode: (mode: GameMode) => void
  setDifficulty: (difficulty: Difficulty) => void
  setDecadeFilter: (decades: number[]) => void
  setGenreFilter: (genres: Genre[]) => void
  incrementStreak: () => void
  resetStreak: () => void
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
  streak: 0,

  setPlayers: (names) =>
    set({ players: names.map(name => ({ name, score: 0 })) }),

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

  addPartyScore: (points, maxPoints) =>
    set(state => ({
      partyScore: state.partyScore + points,
      partyMaxScore: state.partyMaxScore + maxPoints,
    })),

  incrementStreak: () =>
    set(state => ({ streak: state.streak + 1 })),

  resetStreak: () => set({ streak: 0 }),

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
      streak: 0,
      decadeFilter: [],
      genreFilter: [],
    }),
}))