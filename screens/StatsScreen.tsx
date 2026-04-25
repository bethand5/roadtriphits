import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import { useStatsStore } from '../store/statsStore'
import { useDailyStore } from '../store/dailyStore'

export default function StatsScreen({ navigation }: any) {
  const {
    highestVersusScore,
    bestPartyPercentage,
    totalGamesPlayed,
    longestStreak,
    isLoaded,
    resetStats,
  } = useStatsStore()

  const {
    history: dailyHistory,
    currentStreak: dailyStreak,
    bestScore: dailyBest,
    isLoaded: dailyLoaded,
  } = useDailyStore()

  const totalDailyPlayed = Object.keys(dailyHistory).length

  const confirmReset = () => {
    Alert.alert(
      'Reset all stats?',
      'This will permanently erase your high scores, games played, and streak records. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetStats(),
        },
      ]
    )
  }

  const hasPlayedAnyGames = totalGamesPlayed > 0
  const hasPlayedDaily = totalDailyPlayed > 0
  const hasAnyStats = hasPlayedAnyGames || hasPlayedDaily

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Stats</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {!isLoaded || !dailyLoaded ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : !hasAnyStats ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>No games yet</Text>
            <Text style={styles.emptyText}>Play a game to start tracking your stats!</Text>
          </View>
        ) : (
          <>
            {hasPlayedAnyGames && (
              <>
                <Text style={styles.sectionLabel}>VERSUS & PARTY</Text>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>🏆 Highest Versus score</Text>
                  <Text style={styles.statValue}>{highestVersusScore}</Text>
                  <Text style={styles.statSub}>Best single-player score in Versus mode</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>🎉 Best Party percentage</Text>
                  <Text style={styles.statValue}>{bestPartyPercentage}%</Text>
                  <Text style={styles.statSub}>Best group accuracy in Party mode</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>🎮 Total games played</Text>
                  <Text style={styles.statValue}>{totalGamesPlayed}</Text>
                  <Text style={styles.statSub}>Versus + Party combined</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>🔥 Longest streak</Text>
                  <Text style={styles.statValue}>{longestStreak}</Text>
                  <Text style={styles.statSub}>Most correct years in a row</Text>
                </View>
              </>
            )}

            {hasPlayedDaily && (
              <>
                <Text style={styles.sectionLabel}>DAILY CHALLENGE</Text>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>📅 Current day streak</Text>
                  <Text style={styles.statValue}>{dailyStreak}</Text>
                  <Text style={styles.statSub}>Consecutive days completed</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>⭐ Best daily score</Text>
                  <Text style={styles.statValue}>{dailyBest}</Text>
                  <Text style={styles.statSub}>Highest single-day score</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>✅ Days played</Text>
                  <Text style={styles.statValue}>{totalDailyPlayed}</Text>
                  <Text style={styles.statSub}>Total daily challenges completed</Text>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.resetBtn} onPress={confirmReset}>
              <Text style={styles.resetBtnText}>Reset all stats</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backBtn: { width: 60 },
  backText: { fontSize: 16, color: '#2563eb' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#f1f5f9' },
  scroll: { padding: 24 },
  loadingText: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 40 },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#f1f5f9', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: { fontSize: 13, color: '#94a3b8', marginBottom: 4 },
  statValue: { fontSize: 40, fontWeight: '700', color: '#2563eb', marginBottom: 4 },
  statSub: { fontSize: 12, color: '#64748b' },
  resetBtn: {
    marginTop: 24,
    marginBottom: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#450a0a',
    borderRadius: 10,
    alignItems: 'center',
  },
  resetBtnText: { fontSize: 14, color: '#f87171' },
})