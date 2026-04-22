import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useGameStore } from '../store/gameStore'

export default function LeaderboardScreen({ navigation }: any) {
  const { players, resetGame, totalRounds, difficulty, setTotalRounds, setGameMode, setDifficulty } = useGameStore()

  const sorted = [...players].sort((a, b) => b.score - a.score)
  const winner = sorted[0]
  const medals = ['🥇', '🥈', '🥉']

  const playAgain = () => {
    resetGame()
    navigation.navigate('Home')
  }

  const rematch = () => {
    const names = players.map(p => p.name)
    resetGame()
    const { setPlayers } = useGameStore.getState()
    setPlayers(names)
    setTotalRounds(totalRounds)
    setGameMode('versus')
    setDifficulty(difficulty)
    navigation.navigate('TurnIntro')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.winnerLabel}>Winner</Text>
        <Text style={styles.winnerName}>{winner?.name}</Text>
        <Text style={styles.winnerScore}>{winner?.score} pts</Text>

        <Text style={styles.sectionLabel}>Final scores</Text>

        {sorted.map((player, index) => (
          <View key={index} style={[styles.scoreCard, index === 0 && styles.winnerCard]}>
            <Text style={styles.medal}>{medals[index] || `${index + 1}.`}</Text>
            <Text style={[styles.playerName, index === 0 && styles.winnerPlayerName]}>
              {player.name}
            </Text>
            <Text style={[styles.score, index === 0 && styles.winnerScoreText]}>
              {player.score} pts
            </Text>
          </View>
        ))}

        <TouchableOpacity style={styles.rematchBtn} onPress={rematch}>
          <Text style={styles.rematchBtnText}>🔄 Rematch</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={playAgain}>
          <Text style={styles.btnText}>New game 🚗</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 24 },
  trophy: { fontSize: 64, textAlign: 'center', marginTop: 16 },
  winnerLabel: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 8 },
  winnerName: { fontSize: 36, fontWeight: '700', color: '#f1f5f9', textAlign: 'center', marginTop: 4 },
  winnerScore: { fontSize: 18, color: '#2563eb', fontWeight: '600', textAlign: 'center', marginBottom: 32 },
  sectionLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  scoreCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 10, backgroundColor: '#1e293b' },
  winnerCard: { borderColor: '#2563eb', borderWidth: 2, backgroundColor: '#172554' },
  medal: { fontSize: 24, marginRight: 12 },
  playerName: { flex: 1, fontSize: 17, color: '#cbd5e1' },
  winnerPlayerName: { fontWeight: '700', color: '#f1f5f9' },
  score: { fontSize: 17, color: '#64748b' },
  winnerScoreText: { fontWeight: '700', color: '#2563eb' },
  rematchBtn: { borderWidth: 1, borderColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 10 },
  rematchBtnText: { fontSize: 17, color: '#2563eb' },
  btn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
})