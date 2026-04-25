import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
} from 'react-native'
import { useDailyStore } from '../store/dailyStore'
import { playResultSound } from '../utils/sounds'

export default function DailyResultScreen({ navigation, route }: any) {
  const { score, year, yearGuess, rankedSongs, actualSongs, alreadyPlayed } = route.params
  const currentStreak = useDailyStore(s => s.currentStreak)
  const bestScore = useDailyStore(s => s.bestScore)

  // Play sound only on a fresh result, not when revisiting a played day
  useEffect(() => {
    if (alreadyPlayed) return
    // Approximate the score split for the sound effect
    const yearOnlyScore = yearGuess !== null
      ? Math.max(0, Math.min(10, score - (rankedSongs?.length ? 0 : 0)))
      : 0
    const rankOnlyScore = score - yearOnlyScore
    playResultSound(rankOnlyScore, yearOnlyScore)
  }, [])

  const yearDiff = yearGuess !== null
    ? Math.abs(year - (typeof yearGuess === 'number' ? yearGuess : parseInt(yearGuess)))
    : null

  const getMessage = () => {
    if (score === 19) return "Perfect daily! 🎯"
    if (score >= 15) return "Excellent run! 🔥"
    if (score >= 10) return "Solid daily! 👍"
    if (score >= 5) return "Tough one today 🎵"
    return "Better luck tomorrow 😅"
  }

  // Spoiler-free share text — no song titles, no exact year
  const buildShareText = () => {
    const todayLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const scoreEmoji = score === 19 ? '🎯' : score >= 15 ? '🔥' : score >= 10 ? '👍' : score >= 5 ? '🎵' : '😅'
    const streakLine = currentStreak >= 2 ? `\n🔥 ${currentStreak} day streak` : ''
    return `🎵 Road Trip Hits Daily — ${todayLabel}\n${score}/19 pts ${scoreEmoji}${streakLine}\n\nCan you beat me?`
  }

  const handleShare = async () => {
    try {
      await Share.share({ message: buildShareText() })
    } catch (e) {
      console.log('Share error:', e)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.dateLabel}>
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
        <Text style={styles.title}>{alreadyPlayed ? "You've played today" : "Daily Result"}</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Your score</Text>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.scoreMax}>out of 19</Text>
          <Text style={styles.message}>{getMessage()}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day streak 🔥</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{bestScore}</Text>
            <Text style={styles.statLabel}>Best ever</Text>
          </View>
        </View>

        {!alreadyPlayed && yearGuess !== null && (
          <View style={styles.detailsCard}>
            <Text style={styles.detailsLabel}>The answer</Text>
            <Text style={styles.detailsValue}>{year}</Text>
            <Text style={styles.detailsSub}>
              You guessed {yearGuess} — off by {yearDiff}
            </Text>
          </View>
        )}

        <View style={styles.songsCard}>
          <Text style={styles.songsLabel}>Songs from {year}</Text>
          {actualSongs?.map((song: any, index: number) => (
            <View key={index} style={styles.songRow}>
              <Text style={styles.songRank}>#{song.rank}</Text>
              <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{song.title}</Text>
                <Text style={styles.songArtist}>{song.artist}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>📤 Share your score</Text>
        </TouchableOpacity>

        <View style={styles.tomorrowBox}>
          <Text style={styles.tomorrowText}>🌙 Come back tomorrow for a new challenge</Text>
        </View>

        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeBtnText}>Back to home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 24 },
  dateLabel: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  scoreCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  scoreLabel: { fontSize: 13, color: '#94a3b8', marginBottom: 4 },
  score: { fontSize: 72, fontWeight: '700', color: '#2563eb' },
  scoreMax: { fontSize: 14, color: '#94a3b8', marginTop: 2 },
  message: { fontSize: 17, color: '#f1f5f9', fontWeight: '600', marginTop: 12 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statBox: {
    flex: 1,
    backgroundColor: '#172554',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '700', color: '#2563eb' },
  statLabel: { fontSize: 12, color: '#93c5fd', marginTop: 4 },
  detailsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  detailsLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailsValue: { fontSize: 36, fontWeight: '700', color: '#f1f5f9', marginTop: 4 },
  detailsSub: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  songsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  songsLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  songRank: { fontSize: 14, fontWeight: '700', color: '#2563eb', width: 32 },
  songInfo: { flex: 1 },
  songTitle: { fontSize: 14, fontWeight: '600', color: '#f1f5f9' },
  songArtist: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  shareBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  shareBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  tomorrowBox: {
    backgroundColor: '#172554',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  tomorrowText: { fontSize: 14, color: '#93c5fd', fontWeight: '500' },
  homeBtn: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  homeBtnText: { fontSize: 15, color: '#94a3b8' },
})