import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native'
import { useGameStore } from '../store/gameStore'
import { getReactionMessage } from '../utils/scoring'
import { playResultSound } from '../utils/sounds'
import { getTriviaForYear } from '../data/trivia'

const FLIP_DURATION = 700
const STAGGER_DELAY = 300
const TICKER_DURATION = 800

function FlipCard({
  song,
  guessedSong,
  index,
  playerIndex,
  totalCards,
  onAllFlipped,
}: {
  song: { title: string; artist: string }
  guessedSong: { title: string } | undefined
  index: number
  playerIndex: number
  totalCards: number
  onAllFlipped: () => void
}) {
  const correct = guessedSong?.title === song.title
  const flipAnim = useRef(new Animated.Value(0)).current
  const delay = (playerIndex * totalCards + index) * STAGGER_DELAY

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: FLIP_DURATION,
        useNativeDriver: true,
      }).start(() => {
        onAllFlipped()
      })
    }, delay)
    return () => clearTimeout(timer)
  }, [])

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '90deg'],
  })
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['90deg', '90deg', '0deg'],
  })
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5],
    outputRange: [1, 1, 0],
  })
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5],
    outputRange: [0, 0, 1],
  })

  return (
    <View style={styles.resultRow}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.flipFace,
          styles.flipFront,
          { opacity: frontOpacity, transform: [{ rotateY: frontRotate }] },
        ]}
      />
      <Animated.View
        style={[
          styles.flipFace,
          styles.flipBack,
          { opacity: backOpacity, transform: [{ rotateY: backRotate }] },
          { flexDirection: 'row', alignItems: 'center', flex: 1 },
        ]}
      >
        <View style={[styles.rankBadge, correct ? styles.correct : styles.wrong]}>
          <Text style={[styles.rankBadgeText, correct ? styles.correctText : styles.wrongText]}>
            #{index + 1}
          </Text>
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>{song.title}</Text>
          <Text style={styles.resultArtist}>{song.artist}</Text>
          {!correct && guessedSong && (
            <Text style={styles.yourGuess}>You had: {guessedSong.title}</Text>
          )}
        </View>
        <Text style={correct ? styles.checkmark : styles.cross}>
          {correct ? '✓' : '✗'}
        </Text>
      </Animated.View>
    </View>
  )
}

function AnimatedScore({ target, startAnimating }: { target: number; startAnimating: boolean }) {
  const [displayed, setDisplayed] = useState(0)
  const animRef = useRef<any>(null)

  useEffect(() => {
    if (!startAnimating) return
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / TICKER_DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * target))
      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick)
      }
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [startAnimating, target])

  return <Text style={styles.playerTotal}>{displayed} pts</Text>
}

function TriviaCard({ year, visible }: { year: number; visible: boolean }) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const fact = getTriviaForYear(year)

  useEffect(() => {
    if (!visible || !fact) return
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [visible])

  if (!fact) return null

  return (
    <Animated.View style={[styles.triviaCard, { opacity: fadeAnim }]}>
      <Text style={styles.triviaLabel}>💡 Did you know?</Text>
      <Text style={styles.triviaText}>{fact}</Text>
    </Animated.View>
  )
}

export default function RoundResultScreen({ navigation, route }: any) {
  const { results } = route.params
  const {
    currentRound,
    players,
    currentRoundNumber,
    totalRounds,
    nextPlayer,
    difficulty,
    resetGame,
    setTotalRounds,
    setGameMode,
    setDifficulty,
  } = useGameStore()

  // Declare ALL hooks before any early returns
  const flipsCompleted = useRef(0)
  const [scoresVisible, setScoresVisible] = useState(false)

  useEffect(() => {
    if (!currentRound) return
    const totalRankScore = results.reduce((sum: number, r: any) => sum + r.rankScore, 0)
    const totalYearScore = results.reduce((sum: number, r: any) => sum + r.yearScore, 0)
    playResultSound(totalRankScore / results.length, totalYearScore / results.length)
  }, [])

  // Now safe to early-return
  if (!currentRound) return null

  const isLastRound = currentRoundNumber === totalRounds
  const totalSongsPerPlayer = currentRound.songs.length
  const totalFlipCount = results.length * totalSongsPerPlayer

  const handleFlipComplete = () => {
    flipsCompleted.current += 1
    if (flipsCompleted.current >= totalFlipCount) {
      setScoresVisible(true)
    }
  }

  const handleNext = () => {
    players.forEach(() => nextPlayer())
    if (isLastRound) {
      navigation.navigate('Leaderboard')
    } else {
      navigation.navigate('TurnIntro')
    }
  }

  const handleRematch = () => {
    const names = players.map((p: any) => p.name)
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
        <Text style={styles.roundLabel}>Round {currentRoundNumber} of {totalRounds}</Text>
        <Text style={styles.title}>Results</Text>

        {results.map((result: any, playerIndex: number) => {
          const player = players[playerIndex]
          const yearDiff = Math.abs(
            currentRound.year -
            (typeof result.yearGuess === 'number' ? result.yearGuess : parseInt(result.yearGuess))
          )
          const reactionMessage = getReactionMessage(currentRound.year, result.yearGuess, difficulty)

          return (
            <View key={playerIndex} style={styles.playerCard}>
              <View style={styles.playerHeader}>
                <Text style={styles.playerName}>{player?.name}</Text>
                <AnimatedScore target={result.total} startAnimating={scoresVisible} />
              </View>

              <Text style={styles.reactionMessage}>{reactionMessage}</Text>

              <View style={styles.breakdown}>
                <View style={styles.yearBlock}>
                  <View style={styles.yearTopRow}>
                    <Text style={styles.breakdownLabel}>Year guess</Text>
                    <Text style={styles.breakdownScore}>+{result.yearScore} pts</Text>
                  </View>
                  <Text style={styles.yearDetail}>
                    You said {result.yearGuess} · Actual {currentRound.year} · off by {yearDiff}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Song ranking</Text>
                  <Text style={styles.breakdownScore}>+{result.rankScore} pts</Text>
                </View>

                {result.streakBonus > 0 && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>🔥 Streak bonus</Text>
                      <Text style={styles.breakdownScore}>+{result.streakBonus} pts</Text>
                    </View>
                  </>
                )}

                {result.hintUsed && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>💡 Hint penalty</Text>
                      <Text style={[styles.breakdownScore, { color: '#f87171' }]}>-3 pts</Text>
                    </View>
                  </>
                )}
              </View>

              <Text style={styles.subLabel}>Correct order</Text>
              {currentRound.songs.map((song: any, index: number) => {
                const guessedSong = result.rankedSongs[index]
                return (
                  <FlipCard
                    key={index}
                    song={song}
                    guessedSong={guessedSong}
                    index={index}
                    playerIndex={playerIndex}
                    totalCards={totalSongsPerPlayer}
                    onAllFlipped={handleFlipComplete}
                  />
                )
              })}
            </View>
          )
        })}

        <TriviaCard year={currentRound.year} visible={scoresVisible} />

        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>
            {isLastRound ? 'See final scores 🏆' : 'Next round →'}
          </Text>
        </TouchableOpacity>

        {isLastRound && (
          <TouchableOpacity style={styles.rematchBtn} onPress={handleRematch}>
            <Text style={styles.rematchBtnText}>🔄 Rematch</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 24 },
  roundLabel: { fontSize: 13, color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#f1f5f9', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  playerCard: { borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 16, backgroundColor: '#1e293b' },
  playerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  playerName: { fontSize: 18, fontWeight: '700', color: '#f1f5f9' },
  playerTotal: { fontSize: 24, fontWeight: '700', color: '#2563eb' },
  reactionMessage: { fontSize: 14, color: '#94a3b8', marginBottom: 12 },
  breakdown: { backgroundColor: '#0f172a', borderRadius: 12, padding: 12, marginBottom: 12 },
  yearBlock: { flexDirection: 'column', paddingVertical: 6 },
  yearTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  yearDetail: { fontSize: 12, color: '#64748b' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  breakdownLabel: { fontSize: 13, color: '#94a3b8' },
  breakdownScore: { fontSize: 14, fontWeight: '600', color: '#2563eb' },
  divider: { height: 1, backgroundColor: '#334155' },
  subLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  resultRow: { height: 72, borderWidth: 1, borderColor: '#334155', borderRadius: 12, marginBottom: 8, overflow: 'hidden' },
  flipFace: { borderRadius: 12 },
  flipFront: { backgroundColor: '#172554', flex: 1 },
  flipBack: { backgroundColor: '#1e293b', padding: 12 },
  rankBadge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  correct: { backgroundColor: '#14532d' },
  wrong: { backgroundColor: '#450a0a' },
  rankBadgeText: { fontSize: 12, fontWeight: '600' },
  correctText: { color: '#86efac' },
  wrongText: { color: '#fca5a5' },
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 14, fontWeight: '600', color: '#f1f5f9' },
  resultArtist: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  yourGuess: { fontSize: 11, color: '#f87171', marginTop: 4 },
  checkmark: { fontSize: 16, color: '#86efac', marginLeft: 8 },
  cross: { fontSize: 16, color: '#fca5a5', marginLeft: 8 },
  triviaCard: { backgroundColor: '#172554', borderRadius: 12, padding: 16, marginBottom: 16 },
  triviaLabel: { fontSize: 12, fontWeight: '600', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  triviaText: { fontSize: 14, color: '#cbd5e1', lineHeight: 20 },
  btn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 10 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  rematchBtn: { borderWidth: 1, borderColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  rematchBtnText: { fontSize: 17, color: '#2563eb' },
})