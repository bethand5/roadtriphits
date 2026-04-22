import React, { useState, useEffect } from 'react'
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
import { useGameStore } from '../store/gameStore'
import { allBillboard } from '../data/billboard'
import { preBillboardData } from '../data/billboard_pre1958'
import { genreBillboard, getGenreYears } from '../data/genreBillboard'
import { calculateYearScore, calculateRankingScore, DECADES } from '../utils/scoring'
import SongPlayer from '../components/SongPlayer'
import { useAudioStore } from '../store/audioStore'

export default function PartyGameScreen({ navigation }: any) {
  const {
    totalRounds,
    currentRoundNumber,
    setRound,
    currentRound,
    addPartyScore,
    difficulty,
    decadeFilter,
    genreFilter,
  } = useGameStore()

  const [yearGuess, setYearGuess] = useState(1990)
  const [decadeGuess, setDecadeGuess] = useState<number | null>(null)
  const [rankedSongs, setRankedSongs] = useState<any[]>([])
  const [roundReady, setRoundReady] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [hintText, setHintText] = useState('')

  useEffect(() => {
    loadRound()
  }, [])

  const loadRound = () => {
    let allYears: number[] = []

    if (genreFilter.length > 0) {
      const genreYearSets = genreFilter.map(g => getGenreYears(g))
      const genreYears = [...new Set(genreYearSets.flat())]
      allYears = genreYears
    } else {
      const billboardYears = Object.keys(allBillboard).map(Number)
      const preYears = [...new Set(preBillboardData.map(s => s.year))]
      allYears = [...billboardYears, ...preYears]
    }

    if (decadeFilter.length > 0) {
      allYears = allYears.filter(y =>
        decadeFilter.some(d => y >= d && y < d + 10)
      )
    }

    if (allYears.length === 0) {
      allYears = Object.keys(allBillboard).map(Number)
    }

    const randomYear = allYears[Math.floor(Math.random() * allYears.length)]

    let songs: { rank: number; title: string; artist: string; searchQuery?: string; deezerId?: number }[]

    if (genreFilter.length > 0) {
      const availableGenres = genreFilter.filter(g => genreBillboard[g]?.[randomYear])
      if (availableGenres.length > 0) {
        const randomGenre = availableGenres[Math.floor(Math.random() * availableGenres.length)]
        songs = genreBillboard[randomGenre][randomYear].map(s => ({
          rank: s.rank,
          title: s.title,
          artist: s.artist,
        }))
      } else {
        songs = allBillboard[randomYear] ?? []
      }
    } else if (randomYear >= 1958) {
      songs = allBillboard[randomYear]
    } else {
      songs = preBillboardData
        .filter(s => s.year === randomYear)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 3)
        .map(s => ({ rank: s.rank, title: s.title, artist: s.artist, searchQuery: s.searchQuery, deezerId: s.deezerId }))
    }

    setRound({ year: randomYear, songs })
    setRankedSongs([...songs].sort(() => Math.random() - 0.5))
    setYearGuess(1990)
    setDecadeGuess(null)
    setHintUsed(false)
    setHintText('')
    setRoundReady(true)
  }

  const useHint = () => {
    if (!currentRound) return
    Alert.alert(
      'Use hint? (-3 points)',
      'This will reveal the decade but cost you 3 points.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use hint',
          onPress: () => {
            const decade = Math.floor(currentRound.year / 10) * 10
            setHintText(`This song is from the ${decade}s`)
            setHintUsed(true)
          },
        },
      ]
    )
  }

  const moveSong = (index: number, direction: 'up' | 'down') => {
    const newList = [...rankedSongs]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newList.length) return
    const temp = newList[index]
    newList[index] = newList[swapIndex]
    newList[swapIndex] = temp
    setRankedSongs(newList)
  }

  const submitGuess = async () => {
    if (!currentRound) return
    if (difficulty === 'easy' && decadeGuess === null) {
      Alert.alert('Pick a decade', 'Please select a decade before submitting.')
      return
    }

    useAudioStore.getState().stopCurrent()

    const guess = difficulty === 'easy' ? decadeGuess! : yearGuess
    const yearScore = calculateYearScore(currentRound.year, guess, difficulty)
    const rankScore = calculateRankingScore(currentRound.songs, rankedSongs)
    const hintPenalty = hintUsed ? 3 : 0
    const total = Math.max(0, yearScore + rankScore - hintPenalty)
    addPartyScore(total, 19)
    navigation.navigate('PartyResult', {
      yearScore,
      rankScore,
      yearGuess: guess,
      rankedSongs,
      hintUsed,
    })
  }

  if (!roundReady || !currentRound) return null

  const filterParts: string[] = []
  if (decadeFilter.length > 0) filterParts.push(decadeFilter.map(d => `${d}s`).join(', '))
  if (genreFilter.length > 0) filterParts.push(genreFilter.join(', '))

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.roundLabel}>Round {currentRoundNumber} of {totalRounds}</Text>
          <Text style={styles.partyBadge}>🎉 Party</Text>
        </View>

        <Text style={styles.title}>What year are these from?</Text>
        <Text style={styles.subtitle}>Discuss as a group then submit your answer</Text>

        {filterParts.length > 0 && (
          <View style={styles.filterTag}>
            <Text style={styles.filterTagText}>📅 {filterParts.join(' · ')}</Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Songs</Text>
        {currentRound.songs.map((song, index) => (
          <SongPlayer
            key={index}
            title={song.title}
            artist={song.artist}
            searchQuery={song.searchQuery}
            deezerId={song.deezerId}
          />
        ))}

        {!hintUsed && difficulty !== 'easy' && (
          <TouchableOpacity style={styles.hintBtn} onPress={useHint}>
            <Text style={styles.hintBtnText}>💡 Use hint (-3 pts)</Text>
          </TouchableOpacity>
        )}

        {hintUsed && (
          <View style={styles.hintBox}>
            <Text style={styles.hintBoxText}>💡 {hintText}</Text>
          </View>
        )}

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

        {difficulty === 'easy' ? (
          <>
            <Text style={styles.sectionLabel}>Pick a decade</Text>
            <View style={styles.decadeGrid}>
              {DECADES.map(d => (
                <TouchableOpacity
                  key={d.value}
                  style={[styles.decadeBtn, decadeGuess === d.value && styles.decadeBtnActive]}
                  onPress={() => setDecadeGuess(d.value)}
                >
                  <Text style={[styles.decadeBtnText, decadeGuess === d.value && styles.decadeBtnTextActive]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>
              Your year guess: {yearGuess}
              {difficulty === 'medium' ? ' (within 5 years)' : ''}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1935}
              maximumValue={2024}
              step={1}
              value={yearGuess}
              onValueChange={(val) => setYearGuess(Math.round(val))}
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

        <TouchableOpacity style={styles.submitBtn} onPress={submitGuess}>
          <Text style={styles.submitBtnText}>Submit group answer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  roundLabel: { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  partyBadge: { fontSize: 13, color: '#2563eb', fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '700', color: '#f1f5f9', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 8 },
  filterTag: { backgroundColor: '#172554', borderRadius: 8, padding: 8, marginBottom: 16, alignSelf: 'flex-start' },
  filterTagText: { fontSize: 13, color: '#93c5fd', fontWeight: '600' },
  sectionLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 24 },
  rankHint: { fontSize: 13, color: '#475569', marginBottom: 10, marginTop: -4 },
  hintBtn: { marginTop: 12, padding: 12, borderWidth: 1, borderColor: '#2563eb', borderRadius: 10, alignItems: 'center' },
  hintBtnText: { fontSize: 14, color: '#2563eb' },
  hintBox: { marginTop: 12, padding: 12, backgroundColor: '#172554', borderRadius: 10 },
  hintBoxText: { fontSize: 14, color: '#93c5fd', fontWeight: '500' },
  rankCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 14, marginBottom: 10, backgroundColor: '#1e293b' },
  rankNum: { fontSize: 18, fontWeight: '700', color: '#2563eb', width: 36 },
  rankInfo: { flex: 1 },
  rankTitle: { fontSize: 15, fontWeight: '600', color: '#f1f5f9' },
  rankArtist: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  arrows: { flexDirection: 'column', gap: 4 },
  arrowBtn: { padding: 4 },
  arrowText: { fontSize: 14, color: '#2563eb' },
  decadeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  decadeBtn: { paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1, borderColor: '#334155', borderRadius: 10, backgroundColor: '#1e293b' },
  decadeBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  decadeBtnText: { fontSize: 15, color: '#94a3b8' },
  decadeBtnTextActive: { color: '#fff', fontWeight: '600' },
  slider: { width: '100%', height: 40, marginTop: 8 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  sliderLabel: { fontSize: 12, color: '#64748b' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 32, marginBottom: 16 },
  submitBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
})