import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { usePurchaseStore } from '../store/purchaseStore'

const FEATURES = [
  { emoji: '🎯', title: 'Medium & Hard difficulty', desc: 'Guess the exact year, not just the decade' },
  { emoji: '🎉', title: 'Party mode', desc: 'Cooperative play for the whole group' },
  { emoji: '🎚️', title: 'Decade & genre filters', desc: 'Pick the era and style you want' },
  { emoji: '🎵', title: 'Songs from 1935–1989', desc: 'The full library, not just the modern era' },
  { emoji: '💡', title: 'Hint system', desc: 'Reveal the decade when you\'re stuck' },
]

export default function PaywallScreen({ navigation }: any) {
  const setPro = usePurchaseStore(s => s.setPro)
  const [purchasing, setPurchasing] = useState(false)
  const [restoring, setRestoring] = useState(false)

  const handlePurchase = async () => {
    // STUB: When RevenueCat is plugged in, this will trigger the real Apple purchase flow.
    // For now, we just flip the local entitlement after a short fake delay so the
    // loading state is visible during testing.
    setPurchasing(true)
    await new Promise(r => setTimeout(r, 800))
    await setPro(true)
    setPurchasing(false)
    Alert.alert(
      'Welcome to Pro!',
      'All features unlocked. Enjoy the full game.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    )
  }

  const handleRestore = async () => {
    // STUB: When RevenueCat is plugged in, this will check Apple for prior purchases.
    // For now, just flips the local entitlement.
    setRestoring(true)
    await new Promise(r => setTimeout(r, 600))
    await setPro(true)
    setRestoring(false)
    Alert.alert(
      'Purchases restored',
      'Welcome back! All Pro features are unlocked.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    )
  }

  const busy = purchasing || restoring

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn} disabled={busy}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heroTitle}>Road Trip Hits Pro</Text>
        <Text style={styles.heroSub}>Unlock everything. Forever. One time.</Text>

        <View style={styles.featuresList}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>One-time purchase</Text>
          <Text style={styles.price}>$2.99</Text>
          <Text style={styles.priceSub}>No subscription. No ads. Yours forever.</Text>
        </View>

        <TouchableOpacity
          style={[styles.buyBtn, busy && styles.buyBtnDisabled]}
          onPress={handlePurchase}
          disabled={busy}
        >
          {purchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buyBtnText}>Unlock Pro — $2.99</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreBtn}
          onPress={handleRestore}
          disabled={busy}
        >
          {restoring ? (
            <ActivityIndicator color="#94a3b8" size="small" />
          ) : (
            <Text style={styles.restoreText}>Restore previous purchase</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.legalText}>
          Payment will be charged to your Apple ID. This is a one-time purchase, not a subscription.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 22, color: '#94a3b8' },
  scroll: { padding: 24, paddingTop: 8 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#f1f5f9', textAlign: 'center', marginBottom: 8 },
  heroSub: { fontSize: 15, color: '#94a3b8', textAlign: 'center', marginBottom: 28 },
  featuresList: { marginBottom: 28 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureEmoji: { fontSize: 24, marginRight: 14, marginTop: 2 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '600', color: '#f1f5f9', marginBottom: 3 },
  featureDesc: { fontSize: 13, color: '#94a3b8' },
  priceBox: {
    backgroundColor: '#172554',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: { fontSize: 12, color: '#93c5fd', letterSpacing: 1, marginBottom: 4 },
  price: { fontSize: 44, fontWeight: '800', color: '#f1f5f9', marginBottom: 4 },
  priceSub: { fontSize: 12, color: '#93c5fd' },
  buyBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 60,
    justifyContent: 'center',
  },
  buyBtnDisabled: { opacity: 0.7 },
  buyBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  restoreBtn: {
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  restoreText: { color: '#94a3b8', fontSize: 14, textDecorationLine: 'underline' },
  legalText: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 24,
  },
})