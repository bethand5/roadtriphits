import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Purchases, { CustomerInfo } from 'react-native-purchases'

const STORAGE_KEY = '@roadtriphits:purchase'
const ENTITLEMENT_ID = 'pro'

interface PurchaseState {
  isPro: boolean
  isLoaded: boolean
  loadPurchase: () => Promise<void>
  syncFromCustomerInfo: (info: CustomerInfo) => Promise<void>
  refreshFromRevenueCat: () => Promise<void>
  // Dev-only: forces local Pro state without going through Apple/RevenueCat.
  // Useful while testing free vs pro UX in the simulator.
  setProDev: (isPro: boolean) => Promise<void>
}

export const usePurchaseStore = create<PurchaseState>((set, get) => ({
  isPro: false,
  isLoaded: false,

  loadPurchase: async () => {
    // 1) Hydrate from cache so the UI doesn't flicker while RevenueCat loads.
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      if (raw !== null) {
        set({ isPro: raw === 'true' })
      }
    } catch (e) {
      console.log('Purchase load error:', e)
    } finally {
      set({ isLoaded: true })
    }

    // 2) Subscribe to RevenueCat updates (purchases, restores, expiration, etc.).
    Purchases.addCustomerInfoUpdateListener((info) => {
      get().syncFromCustomerInfo(info)
    })

    // 3) Fetch the current truth from RevenueCat.
    get().refreshFromRevenueCat()
  },

  syncFromCustomerInfo: async (info) => {
    const isPro = info.entitlements.active[ENTITLEMENT_ID] !== undefined
    set({ isPro })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, isPro ? 'true' : 'false')
    } catch (e) {
      console.log('Purchase save error:', e)
    }
  },

  refreshFromRevenueCat: async () => {
    try {
      const info = await Purchases.getCustomerInfo()
      await get().syncFromCustomerInfo(info)
    } catch (e) {
      console.log('getCustomerInfo failed:', e)
    }
  },

  setProDev: async (isPro: boolean) => {
    set({ isPro })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, isPro ? 'true' : 'false')
    } catch (e) {
      console.log('Purchase save error:', e)
    }
  },
}))

// Convenience hook — most components only care about isPro, not the whole store.
export const useIsPro = () => usePurchaseStore((s) => s.isPro)