import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { useGameStore } from '../store/gameStore'
import { calculateYearScore, calculateRankingScore, getStreakBonus, DECADES } from '../utils/scoring'
import SongPlayer from '../components/SongPlayer'
import { useAudioStore } from '../store/audioStore'

export default function GameScreen({ navigation }: any) {
  const { currentRound, players, difficulty, streak, incrementStreak, resetStreak, addScore } = useGameStore()

  const [playerGuesses, setPlayerGuesses] = useState<any[]>([])

  useEffect(() => {
    if (!currentRound) return
    setPlayerGuesses(
      players.map(() => ({
        yearGuess: 1990,
        decadeGuess: null as number | null,
        rankedSongs: [...currentRound.songs].sort(() => Math.random() - 0.5),
        hintUsed: false,
        hintText: '',
      }))
    )
  }, [currentRound, players])

  if (!currentRound || playerGuesses.length === 0) return null

  const updateGuess = (playerIndex: number, key: string, value: any) => {
    setPlayerGuesses(prev => {
      const updated = [...prev]
      updated[playerIndex] = { ...updated[playerIndex], [key]: value }
      return updated
    })
  }

  const moveSong = (playerIndex: number, songIndex: number, direction: 'up' | 'down') => {
    setPlayerGuesses(prev => {
      const updated = [...prev]
      const songs = [...updated[playerIndex].rankedSongs]
      const swapIndex = direction === 'up' ? songIndex - 1 : songIndex + 1
      if (swapIndex < 0 || swapIndex >= songs.length) return prev
      const temp = songs[songIndex]
      songs[songIndex] = songs[swapIndex]
      songs[swapIndex] = temp
      updated[playerIndex] = { ...updated[playerIndex], rankedSongs: songs }
      return updated
    })
  }

  const useHint = (playerIndex: number) => {
    Alert.alert(
      'Use hint? (-3 points)',
      'This will reveal the decade but cost you 3 points.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use hint',
          onPress: () => {
            const decade = Math.floor(currentRound.year / 10) * 10
            updateGuess(playerIndex, 'hintUsed', true)
            updateGuess(playerIndex, 'hintText', `This song is from the ${decade}s`)
          },
        },
      ]
    )
  }

  const submitAll = async () => {
    for (const guess of playerGuesses) {
      if (difficulty === 'easy' && guess.decadeGuess === null) {
        Alert.alert('Missing answer', 'All players need to pick a decade before submitting.')
        return
      }
    }

    useAudioStore.getState().stopCurrent()

    const results = playerGuesses.map((guess) => {
      const yearVal = difficulty === 'easy' ? guess.decadeGuess! : guess.yearGuess
      const yearScore = calculateYearScore(currentRound.year, yearVal, difficulty)
      const rankScore = calculateRankingScore(currentRound.songs, guess.rankedSongs)
      const streakBonus = yearScore > 0 ? getStreakBonus(streak + 1) : 0
      const hintPenalty = guess.hintUsed ? 3 : 0
      const total = Math.max(0, yearScore + rankScore + streakBonus - hintPenalty)
      return { yearScore, rankScore, streakBonus, hintUsed: guess.hintUsed, yearGuess: yearVal, rankedSongs: guess.rankedSongs, total }
    })

    results.forEach(r => {
      if (r.yearScore > 0) incrementStreak()
      else resetStreak()
      addScore(r.total)
    })

    navigation.navigate('RoundResult', { results })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>What year are these from?</Text>
        <Text style={styles.subtitle}>Listen to the songs, then each player fills in their answers below</Text>

        <Text style={styles.sectionLabel}>Songs</Text>
        {currentRound.songs.map((song, index) => (
          <SongPlayer key={index} title={song.title} artist={song.artist} searchQuery={song.searchQuery} deezerId={song.deezerId} />
        ))}

        {players.map((player, playerIndex) => (
          <View key={playerIndex} style={styles.playerSection}>
            <View style={styles.playerHeader}>
              <Text style={styles.playerName}>{player.name}</Text>
            </View>

            {streak >= 2 && playerIndex === 0 && (
              <View style={styles.streakBanner}>
                <Text style={styles.streakText}>🔥 {streak} round streak!</Text>
              </View>
            )}

            <Text style={styles.subLabel}>Rank the songs</Text>
            {playerGuesses[playerIndex].rankedSongs.map((song: any, songIndex: number) => (
              <View key={song.title} style={styles.rankCard}>
                <Text style={styles.rankNum}>#{songIndex + 1}</Text>
                <View style={styles.rankInfo}>
                  <Text style={styles.rankTitle}>{song.title}</Text>
                  <Text style={styles.rankArtist}>{song.artist}</Text>
                </View>
                <View style={styles.arrows}>
                  <TouchableOpacity onPress={() => moveSong(playerIndex, songIndex, 'up')} style={styles.arrowBtn}>
                    <Text style={styles.arrowText}>▲</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => moveSong(playerIndex, songIndex, 'down')} style={styles.arrowBtn}>
                    <Text style={styles.arrowText}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {!playerGuesses[playerIndex].hintUsed && difficulty !== 'easy' && (
              <TouchableOpacity style={styles.hintBtn} onPress={() => useHint(playerIndex)}>
                <Text style={styles.hintBtnText}>💡 Use hint (-3 pts)</Text>
              </TouchableOpacity>
            )}

            {playerGuesses[playerIndex].hintUsed && (
              <View style={styles.hintBox}>
                <Text style={styles.hintBoxText}>💡 {playerGuesses[playerIndex].hintText}</Text>
              </View>
            )}

            {difficulty === 'easy' ? (
              <>
                <Text style={styles.subLabel}>Pick a decade</Text>
                <View style={styles.decadeGrid}>
                  {DECADES.map(d => (
                    <TouchableOpacity
                      key={d.value}
                      style={[styles.decadeBtn, playerGuesses[playerIndex].decadeGuess === d.value && styles.decadeBtnActive]}
                      onPress={() => updateGuess(playerIndex, 'decadeGuess', d.value)}
                    >
                      <Text style={[styles.decadeBtnText, playerGuesses[playerIndex].decadeGuess === d.value && styles.decadeBtnTextActive]}>
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.subLabel}>
                  Year guess: {playerGuesses[playerIndex].yearGuess}
                  {difficulty === 'medium' ? ' (within 5 years)' : ''}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1935}
                  maximumValue={2024}
                  step={1}
                  value={playerGuesses[playerIndex].yearGuess}
                  onValueChange={(val) => updateGuess(playerIndex, 'yearGuess', Math.round(val))}
                  minimumTrackTintColor="#2563eb"
                  maximumTrackTintColor="#334155"
                  thumbTintColor="#2563eb"
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>1935</Text>
                  <Text style={styles.sliderLabel}>2024</Text>
                </View>
              </>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.submitBtn} onPress={submitAll}>
          <Text style={styles.submitBtnText}>Submit all answers</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#f1f5f9', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 16 },
  sectionLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 24 },
  playerSection: { marginTop: 24, borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 8, backgroundColor: '#1e293b' },
  playerHeader: { marginBottom: 12 },
  playerName: { fontSize: 18, fontWeight: '700', color: '#f1f5f9' },
  streakBanner: { backgroundColor: '#2d1f00', borderRadius: 10, padding: 10, marginBottom: 12, alignItems: 'center' },
  streakText: { fontSize: 14, fontWeight: '600', color: '#f59e0b' },
  subLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 12 },
  rankCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 12, marginBottom: 8, backgroundColor: '#0f172a' },
  rankNum: { fontSize: 18, fontWeight: '700', color: '#2563eb', width: 36 },
  rankInfo: { flex: 1 },
  rankTitle: { fontSize: 14, fontWeight: '600', color: '#f1f5f9' },
  rankArtist: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  arrows: { flexDirection: 'column', gap: 4 },
  arrowBtn: { padding: 4 },
  arrowText: { fontSize: 14, color: '#2563eb' },
  hintBtn: { marginTop: 8, padding: 10, borderWidth: 1, borderColor: '#2563eb', borderRadius: 10, alignItems: 'center' },
  hintBtnText: { fontSize: 13, color: '#2563eb' },
  hintBox: { marginTop: 8, padding: 10, backgroundColor: '#172554', borderRadius: 10 },
  hintBoxText: { fontSize: 13, color: '#93c5fd', fontWeight: '500' },
  decadeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  decadeBtn: { paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: '#334155', borderRadius: 10, backgroundColor: '#0f172a' },
  decadeBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  decadeBtnText: { fontSize: 14, color: '#94a3b8' },
  decadeBtnTextActive: { color: '#fff', fontWeight: '600' },
  slider: { width: '100%', height: 40, marginTop: 4 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  sliderLabel: { fontSize: 12, color: '#64748b' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24, marginBottom: 16 },
  submitBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
})