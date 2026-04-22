import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native'
import { useGameStore } from '../store/gameStore'
import { getScoreMessage } from '../utils/scoring'
import { playResultSound } from '../utils/sounds'
import { getTriviaForYear } from '../data/trivia'

const FLIP_DURATION = 700
const STAGGER_DELAY = 300
const TICKER_DURATION = 800

function FlipCard({
  song,
  guessedSong,
  index,
  onFlipped,
}: {
  song: { title: string; artist: string }
  guessedSong: { title: string } | undefined
  index: number
  onFlipped: () => void
}) {
  const correct = guessedSong?.title === song.title
  const flipAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: FLIP_DURATION,
        useNativeDriver: true,
      }).start(() => {
        onFlipped()
      })
    }, index * STAGGER_DELAY)
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

function AnimatedNumber({ target, startAnimating, style }: { target: number; startAnimating: boolean; style: any }) {
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

  return <Text style={style}>{displayed}</Text>
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

export default function PartyResultScreen({ navigation, route }: any) {
  const { yearScore, rankScore, yearGuess, rankedSongs } = route.params
  const {
    currentRound,
    currentRoundNumber,
    totalRounds,
    partyScore,
    partyMaxScore,
    nextPartyRound,
  } = useGameStore()

  const flipsCompleted = useRef(0)
  const [scoresVisible, setScoresVisible] = useState(false)

  useEffect(() => {
    playResultSound(rankScore, yearScore)
  }, [])

  if (!currentRound) return null

  const total = yearScore + rankScore
  const isLastRound = currentRoundNumber === totalRounds
  const yearDiff = Math.abs(
    currentRound.year - (typeof yearGuess === 'number' ? yearGuess : parseInt(yearGuess))
  )
  const totalSongs = currentRound.songs.length

  const handleFlipped = () => {
    flipsCompleted.current += 1
    if (flipsCompleted.current >= totalSongs) {
      setScoresVisible(true)
    }
  }

  const handleNext = () => {
    nextPartyRound()
    if (isLastRound) {
      navigation.navigate('PartyFinal')
    } else {
      navigation.navigate('PartyGame')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.roundLabel}>Round {currentRoundNumber} of {totalRounds}</Text>
        <Text style={styles.scoreMessage}>{getScoreMessage(total)}</Text>
        <AnimatedNumber target={total} startAnimating={scoresVisible} style={styles.totalScore} />
        <Text style={styles.totalLabel}>points this round</Text>

        <View style={styles.runningScore}>
          <Text style={styles.runningLabel}>Running total</Text>
          <Text style={styles.runningValue}>
            {scoresVisible ? partyScore : partyScore - total} / {partyMaxScore} pts
          </Text>
        </View>

        <View style={styles.breakdown}>
          <View style={styles.yearBlock}>
            <View style={styles.yearTopRow}>
              <Text style={styles.breakdownLabel}>Year guess</Text>
              <Text style={styles.breakdownScore}>+{yearScore} pts</Text>
            </View>
            <Text style={styles.yearDetail}>
              You said {yearGuess} · Actual {currentRound.year} · off by {yearDiff}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Song ranking</Text>
            <Text style={styles.breakdownScore}>+{rankScore} pts</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Correct order</Text>
        {currentRound.songs.map((song, index) => {
          const guessedSong = rankedSongs[index]
          return (
            <FlipCard
              key={index}
              song={song}
              guessedSong={guessedSong}
              index={index}
              onFlipped={handleFlipped}
            />
          )
        })}

        <TriviaCard year={currentRound.year} visible={scoresVisible} />

        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>
            {isLastRound ? 'See final score 🏆' : 'Next round →'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 24 },
  roundLabel: { fontSize: 13, color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8 },
  scoreMessage: { fontSize: 20, fontWeight: '600', color: '#f1f5f9', textAlign: 'center', marginTop: 4 },
  totalScore: { fontSize: 64, fontWeight: '700', color: '#2563eb', textAlign: 'center', marginTop: 8 },
  totalLabel: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 16 },
  runningScore: { backgroundColor: '#172554', borderRadius: 12, padding: 16, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  runningLabel: { fontSize: 14, color: '#94a3b8' },
  runningValue: { fontSize: 16, fontWeight: '700', color: '#2563eb' },
  breakdown: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 24 },
  yearBlock: { flexDirection: 'column', paddingVertical: 8 },
  yearTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  yearDetail: { fontSize: 12, color: '#64748b' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  breakdownLabel: { fontSize: 14, color: '#94a3b8' },
  breakdownScore: { fontSize: 15, fontWeight: '600', color: '#2563eb' },
  divider: { height: 1, backgroundColor: '#334155' },
  sectionLabel: { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  resultRow: { height: 72, borderWidth: 1, borderColor: '#334155', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  flipFace: { borderRadius: 12 },
  flipFront: { backgroundColor: '#172554', flex: 1 },
  flipBack: { backgroundColor: '#1e293b', padding: 14 },
  rankBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  correct: { backgroundColor: '#14532d' },
  wrong: { backgroundColor: '#450a0a' },
  rankBadgeText: { fontSize: 13, fontWeight: '600' },
  correctText: { color: '#86efac' },
  wrongText: { color: '#fca5a5' },
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 15, fontWeight: '600', color: '#f1f5f9' },
  resultArtist: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  yourGuess: { fontSize: 12, color: '#f87171', marginTop: 4 },
  checkmark: { fontSize: 18, color: '#86efac', marginLeft: 8 },
  cross: { fontSize: 18, color: '#fca5a5', marginLeft: 8 },
  triviaCard: { backgroundColor: '#172554', borderRadius: 12, padding: 16, marginTop: 8, marginBottom: 16 },
  triviaLabel: { fontSize: 12, fontWeight: '600', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  triviaText: { fontSize: 14, color: '#cbd5e1', lineHeight: 20 },
  btn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
})