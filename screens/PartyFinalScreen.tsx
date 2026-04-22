import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import { useGameStore } from '../store/gameStore'

export default function PartyFinalScreen({ navigation }: any) {
  const { partyScore, partyMaxScore, totalRounds, resetGame } = useGameStore()

  const percentage = Math.round((partyScore / partyMaxScore) * 100)

  const getMessage = () => {
    if (percentage === 100) return "Perfect score! You're music legends! 🎉"
    if (percentage >= 80) return "Incredible! You really know your hits! 🔥"
    if (percentage >= 60) return "Solid effort! Not bad for a road trip! 👍"
    if (percentage >= 40) return "Room to improve — blame the driver! 😄"
    return "Better luck next road trip! 🚗"
  }

  const playAgain = () => {
    resetGame()
    navigation.navigate('Home')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.message}>{getMessage()}</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Final group score</Text>
          <Text style={styles.score}>{partyScore}</Text>
          <Text style={styles.maxScore}>out of {partyMaxScore} possible points</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalRounds}</Text>
            <Text style={styles.statLabel}>Rounds played</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{percentage}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{Math.round(partyScore / totalRounds)}</Text>
            <Text style={styles.statLabel}>Avg per round</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={playAgain}>
          <Text style={styles.btnText}>Play again 🚗</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 24, alignItems: 'center' },
  emoji: { fontSize: 64, textAlign: 'center', marginTop: 24 },
  message: { fontSize: 20, fontWeight: '600', color: '#f1f5f9', textAlign: 'center', marginTop: 12, marginBottom: 32, lineHeight: 28 },
  scoreCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 32, alignItems: 'center', width: '100%', marginBottom: 24 },
  scoreLabel: { fontSize: 14, color: '#94a3b8', marginBottom: 8 },
  score: { fontSize: 72, fontWeight: '700', color: '#2563eb' },
  maxScore: { fontSize: 15, color: '#94a3b8', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 32 },
  statBox: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 16, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#2563eb' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 4, textAlign: 'center' },
  btn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', width: '100%' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
})