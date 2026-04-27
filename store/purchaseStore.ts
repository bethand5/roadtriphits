import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@roadtriphits:purchase'

interface PurchaseState {
  isPro: boolean
  isLoaded: boolean
  loadPurchase: () => Promise<void>
  // Sets Pro state and persists to disk. Will eventually be called by RevenueCat,
  // but for now we expose it for the dev toggle and the (stubbed) buy/restore buttons.
  setPro: (isPro: boolean) => Promise<void>
}

export const usePurchaseStore = create<PurchaseState>((set) => ({
  isPro: false,
  isLoaded: false,

  loadPurchase: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      const isPro = raw === 'true'
      set({ isPro, isLoaded: true })
    } catch (e) {
      console.log('Purchase load error:', e)
      set({ isLoaded: true })
    }
  },

  setPro: async (isPro: boolean) => {
    set({ isPro })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, isPro ? 'true' : 'false')
    } catch (e) {
      console.log('Purchase save error:', e)
    }
  },
}))

// Convenience hook — most components only care about isPro, not the whole store
export const useIsPro = () => usePurchaseStore((s) => s.isPro)