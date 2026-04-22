import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { useGameStore } from '../store/gameStore'
import { allBillboard } from '../data/billboard'
import { preBillboardData } from '../data/billboard_pre1958'
import { genreBillboard, getGenreYears } from '../data/genreBillboard'

export default function TurnIntroScreen({ navigation }: any) {
  const { players, currentRoundNumber, totalRounds, setRound, decadeFilter, genreFilter } = useGameStore()

  const startRound = () => {
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

    if (genreFilter.length > 0) {
      const availableGenres = genreFilter.filter(g => genreBillboard[g]?.[randomYear])
      if (availableGenres.length > 0) {
        const randomGenre = availableGenres[Math.floor(Math.random() * availableGenres.length)]
        const songs = genreBillboard[randomGenre][randomYear].map(s => ({
          rank: s.rank,
          title: s.title,
          artist: s.artist,
        }))
        setRound({ year: randomYear, songs })
      } else {
        setRound({ year: randomYear, songs: allBillboard[randomYear] ?? [] })
      }
    } else if (randomYear >= 1958) {
      setRound({ year: randomYear, songs: allBillboard[randomYear] })
    } else {
      const songs = preBillboardData
        .filter(s => s.year === randomYear)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 3)
        .map(s => ({ rank: s.rank, title: s.title, artist: s.artist, searchQuery: s.searchQuery, deezerId: s.deezerId }))
      setRound({ year: randomYear, songs })
    }

    navigation.navigate('Game')
  }

  const filterParts: string[] = []
  if (decadeFilter.length > 0) filterParts.push(decadeFilter.map(d => `${d}s`).join(', '))
  if (genreFilter.length > 0) filterParts.push(genreFilter.join(', '))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.roundLabel}>Round {currentRoundNumber} of {totalRounds}</Text>

        <View style={styles.card}>
          <Text style={styles.emoji}>🎵</Text>
          <Text style={styles.title}>Get ready!</Text>
          <Text style={styles.subtitle}>Everyone plays this round together</Text>
          {filterParts.length > 0 && (
            <Text style={styles.filterTag}>📅 {filterParts.join(' · ')}</Text>
          )}
        </View>

        <View style={styles.scoreBoard}>
          <Text style={styles.scoreBoardTitle}>Scores</Text>
          {players.map((player, index) => (
            <View key={index} style={styles.scoreRow}>
              <Text style={styles.scoreName}>{player.name}</Text>
              <Text style={styles.scoreValue}>{player.score} pts</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={startRound}>
          <Text style={styles.btnText}>Start round 🎵</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  roundLabel: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 24, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 32 },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#f1f5f9', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
  filterTag: { fontSize: 13, color: '#2563eb', marginTop: 8, textAlign: 'center', fontWeight: '600' },
  scoreBoard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 32 },
  scoreBoardTitle: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  scoreName: { fontSize: 15, color: '#f1f5f9' },
  scoreValue: { fontSize: 15, fontWeight: '600', color: '#2563eb' },
  btn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
})