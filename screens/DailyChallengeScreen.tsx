import React, { useState, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { allBillboard } from '../data/billboard'
import { calculateYearScore, calculateRankingScore } from '../utils/scoring'
import SongPlayer from '../components/SongPlayer'
import { useAudioStore } from '../store/audioStore'
import { useDailyStore, getTodayKey, getYearForDate } from '../store/dailyStore'

export default function DailyChallengeScreen({ navigation }: any) {
  const recordResult = useDailyStore(s => s.recordResult)
  const getResult = useDailyStore(s => s.getResult)

  // Determine today's challenge once on mount
  const todayKey = useMemo(() => getTodayKey(), [])
  const todayYear = useMemo(() => getYearForDate(todayKey), [todayKey])
  const todaySongs = useMemo(() => allBillboard[todayYear] ?? [], [todayYear])

  // Already played today?
  const existingResult = getResult(todayKey)

  // Shuffle songs once for ranking — stable across re-renders
  const initialRanking = useMemo(
    () => [...todaySongs].sort(() => Math.random() - 0.5),
    [todaySongs]
  )

  const [yearGuess, setYearGuess] = useState(1990)
  const [rankedSongs, setRankedSongs] = useState(initialRanking)

  // If already played today, navigate straight to result on mount
  React.useEffect(() => {
    if (existingResult?.completed) {
      navigation.replace('DailyResult', {
        score: existingResult.score,
        year: existingResult.year,
        yearGuess: existingResult.yearGuess ?? null,
        rankedSongs: existingResult.rankedSongs ?? [],
        actualSongs: todaySongs,
        alreadyPlayed: true,
      })
    }
  }, [])

  const moveSong = (index: number, direction: 'up' | 'down') => {
    const newList = [...rankedSongs]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newList.length) return
    const temp = newList[index]
    newList[index] = newList[swapIndex]
    newList[swapIndex] = temp
    setRankedSongs(newList)
  }

  const submit = async () => {
    if (todaySongs.length === 0) {
      Alert.alert('Error', 'Could not load today\'s challenge. Please try again later.')
      return
    }

    useAudioStore.getState().stopCurrent()

    // Daily challenge is always Hard difficulty (exact year)
    const yearScore = calculateYearScore(todayYear, yearGuess, 'hard')
    const rankScore = calculateRankingScore(todaySongs, rankedSongs)
    const total = yearScore + rankScore

    await recordResult(todayKey, total, todayYear, rankedSongs, yearGuess)

    navigation.replace('DailyResult', {
      score: total,
      year: todayYear,
      yearGuess,
      rankedSongs,
      actualSongs: todaySongs,
      alreadyPlayed: false,
    })
  }

  if (todaySongs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>Could not load today's challenge.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (existingResult?.completed) return null

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.dateLabel}>{formatDate(todayKey)}</Text>
          <View style={styles.backBtn} />
        </View>

        <Text style={styles.title}>Today's Challenge</Text>
        <Text style={styles.subtitle}>One try, one shot. Same songs for everyone today.</Text>

        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>🔴 Hard mode · Exact year</Text>
        </View>

        <Text style={styles.sectionLabel}>Songs</Text>
        {todaySongs.map((song, index) => (
          <SongPlayer
            key={index}
            title={song.title}
            artist={song.artist}
            searchQuery={song.searchQuery}
            deezerId={song.deezerId}
          />
        ))}

        <Text style={styles.sectionLabel}>Rank them #1 to #3</Text>
        <Text style={styles.rankHint}>Use the arrows to reorder</Text>
        {rankedSongs.map((song, index) => (
          <View key={song.title} style={styles.rankCard}>
            <Text style={styles.rankNum}>#{index + 1}</Text>
            <View style={styles.rankInfo}>
              <Text style={styles.rankTitle}>{song.title}</Text>
              <Text style={styles.rankArtist}>{song.artist}</Text>
            </View>
            <View style={styles.arrows}>
              <TouchableOpacity onPress={() => moveSong(index, 'up')} style={styles.arrowBtn}>
                <Text style={styles.arrowText}>▲</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveSong(index, 'down')} style={styles.arrowBtn}>
                <Text style={styles.arrowText}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Year guess: {yearGuess}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1958}
          maximumValue={2024}
          step={1}
          value={yearGuess}
          onValueChange={(val) => setYearGuess(Math.round(val))}
          minimumTrackTintColor="#2563eb"
          maximumTrackTintColor="#334155"
          thumbTintColor="#2563eb"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>1958</Text>
          <Text style={styles.sliderLabel}>2024</Text>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={submit}>
          <Text style={styles.submitBtnText}>Submit (one try only!)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function formatDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: { width: 60 },
  backText: { fontSize: 16, color: '#2563eb' },
  dateLabel: { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 26, fontWeight: '700', color: '#f1f5f9', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 16 },
  modeBadge: {
    backgroundColor: '#172554',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  modeBadgeText: { fontSize: 13, color: '#93c5fd', fontWeight: '600' },
  sectionLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 24,
  },
  rankHint: { fontSize: 13, color: '#475569', marginBottom: 10, marginTop: -4 },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#1e293b',
  },
  rankNum: { fontSize: 18, fontWeight: '700', color: '#2563eb', width: 32 },
  rankInfo: { flex: 1 },
  rankTitle: { fontSize: 15, fontWeight: '600', color: '#f1f5f9' },
  rankArtist: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  arrows: { flexDirection: 'column', gap: 4 },
  arrowBtn: { padding: 4 },
  arrowText: { fontSize: 14, color: '#2563eb' },
  slider: { width: '100%', height: 40, marginTop: 8 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  sliderLabel: { fontSize: 12, color: '#64748b' },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  submitBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { fontSize: 16, color: '#f1f5f9', textAlign: 'center', marginBottom: 24 },
  btn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, paddingHorizontal: 32 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})