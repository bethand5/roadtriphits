import { create } from 'zustand'
import type { AudioPlayer } from 'expo-audio'

interface AudioState {
  currentPlayer: AudioPlayer | null
  setCurrentPlayer: (player: AudioPlayer | null) => void
  stopCurrent: () => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentPlayer: null,

  setCurrentPlayer: (player) => {
    // Stop whatever was playing before, if it's different
    const existing = get().currentPlayer
    if (existing && existing !== player) {
      try {
        existing.pause()
      } catch {
        // Player may have been released already; safe to ignore
      }
    }
    set({ currentPlayer: player })
  },

  stopCurrent: () => {
    const existing = get().currentPlayer
    if (existing) {
      try {
        existing.pause()
      } catch {
        // Safe to ignore
      }
    }
    set({ currentPlayer: null })
  },
}))