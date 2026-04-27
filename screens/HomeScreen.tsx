import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native'
import { useGameStore, GameMode, Difficulty } from '../store/gameStore'
import { Genre } from '../data/billboard_pre1958'
import { useDailyStore, getTodayKey } from '../store/dailyStore'
import { useIsPro } from '../store/purchaseStore'

const AVATARS = ['🎸', '🚗', '🎤', '🏎️', '🥁', '🚕', '🎹', '🛻', '🎺', '🚙', '🎻', '🎧']

const DECADES = [
  { label: '1930s', value: 1930 },
  { label: '1940s', value: 1940 },
  { label: '1950s', value: 1950 },
  { label: '1960s', value: 1960 },
  { label: '1970s', value: 1970 },
  { label: '1980s', value: 1980 },
  { label: '1990s', value: 1990 },
  { label: '2000s', value: 2000 },
  { label: '2010s', value: 2010 },
  { label: '2020s', value: 2020 },
]

const GENRES: { label: string; value: Genre }[] = [
  { label: '🎷 Jazz',       value: 'Jazz' },
  { label: '🤠 Country',    value: 'Country' },
  { label: '🎙️ Standards',  value: 'Standards' },
  { label: '🎵 Pop',        value: 'Pop' },
  { label: '🎸 Rock',       value: 'Rock' },
  { label: '🎤 R&B',        value: 'RnB' },
]

export default function HomeScreen({ navigation }: any) {
  const isPro = useIsPro()

  const [players, setPlayers] = useState([
    { name: '', avatar: '🎸' },
    { name: '', avatar: '🚗' },
  ])
  const [rounds, setRounds] = useState(5)
  const {
    setPlayers: storePlayers,
    setTotalRounds,
    setGameMode,
    setDifficulty,
    setDecadeFilter,
    setGenreFilter,
    resetGame,
  } = useGameStore()

  // Daily challenge status
  const dailyHistory = useDailyStore(s => s.history)
  const dailyStreak = useDailyStore(s => s.currentStreak)
  const todayKey = getTodayKey()
  const todayResult = dailyHistory[todayKey]

  // Free users default to easy + versus, no filters
  const [selectedMode, setSelectedMode] = useState<GameMode>('versus')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(isPro ? 'hard' : 'easy')
  const [selectedDecades, setSelectedDecades] = useState<number[]>([])
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [pickingAvatarFor, setPickingAvatarFor] = useState<number | null>(null)

  const goToPaywall = () => navigation.navigate('Paywall')

  const handleModeSelect = (mode: GameMode) => {
    if (mode === 'party' && !isPro) {
      goToPaywall()
      return
    }
    setSelectedMode(mode)
  }

  const handleDifficultySelect = (key: Difficulty) => {
    if ((key === 'medium' || key === 'hard') && !isPro) {
      goToPaywall()
      return
    }
    setSelectedDifficulty(key)
  }

  const toggleDecade = (value: number) => {
    if (!isPro) {
      goToPaywall()
      return
    }
    setSelectedDecades(prev =>
      prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]
    )
  }

  const toggleGenre = (value: Genre) => {
    if (!isPro) {
      goToPaywall()
      return
    }
    setSelectedGenres(prev =>
      prev.includes(value) ? prev.filter(g => g !== value) : [...prev, value]
    )
  }

  const addPlayer = () => {
    if (players.length < 6) {
      setPlayers([...players, { name: '', avatar: AVATARS[players.length % AVATARS.length] }])
    }
  }

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index))
    }
  }

  const updateName = (index: number, value: string) => {
    const updated = [...players]
    updated[index].name = value
    setPlayers(updated)
  }

  const updateAvatar = (index: number, avatar: string) => {
    const updated = [...players]
    updated[index].avatar = avatar
    setPlayers(updated)
    setPickingAvatarFor(null)
  }

  const startGame = () => {
    const validPlayers = players.filter(p => p.name.trim() !== '')
    if (selectedMode === 'versus' && validPlayers.length < 2) return
    resetGame()
    storePlayers(validPlayers.map(p => `${p.avatar} ${p.name}`))
    setTotalRounds(rounds)
    setGameMode(selectedMode)
    setDifficulty(selectedDifficulty)
    setDecadeFilter(selectedDecades)
    setGenreFilter(selectedGenres)
    if (selectedMode === 'party') {
      navigation.navigate('PartyGame')
    } else {
      navigation.navigate('TurnIntro')
    }
  }

  const validPlayers = players.filter(p => p.name.trim() !== '')
  const canStart = selectedMode === 'party' ? true : validPlayers.length >= 2

  const difficulties: { key: Difficulty; label: string; desc: string; locked: boolean }[] = [
    { key: 'easy',   label: '🟢 Easy',   desc: 'Guess the decade',  locked: false },
    { key: 'medium', label: '🟡 Medium', desc: 'Within 5 years',    locked: !isPro },
    { key: 'hard',   label: '🔴 Hard',   desc: 'Exact year',        locked: !isPro },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.emoji}>🚗</Text>
        <Text style={styles.title}>Road Trip Hits</Text>
        <Text style={styles.subtitle}>Guess the year, rank the songs</Text>

        {!isPro && (
          <TouchableOpacity style={styles.upgradeCard} onPress={goToPaywall}>
            <Text style={styles.upgradeBadge}>✨ UPGRADE TO PRO</Text>
            <Text style={styles.upgradeTitle}>Unlock everything for $2.99</Text>
            <Text style={styles.upgradeSub}>Party mode, hard difficulty, all eras, filters & more</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.dailyCard}
          onPress={() => navigation.navigate('DailyChallenge')}
        >
          <View style={styles.dailyTopRow}>
            <Text style={styles.dailyBadge}>⭐ DAILY CHALLENGE</Text>
            {dailyStreak >= 2 && (
              <Text style={styles.dailyStreak}>🔥 {dailyStreak} day streak</Text>
            )}
          </View>
          {todayResult?.completed ? (
            <>
              <Text style={styles.dailyTitle}>You scored {todayResult.score}/19 today</Text>
              <Text style={styles.dailySubtitle}>Tap to see your result · Come back tomorrow</Text>
            </>
          ) : (
            <>
              <Text style={styles.dailyTitle}>Today's challenge is ready</Text>
              <Text style={styles.dailySubtitle}>Same songs for everyone · One try only</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Mode</Text>
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeBtn, selectedMode === 'versus' && styles.modeBtnActive]}
            onPress={() => handleModeSelect('versus')}
          >
            <Text style={[styles.modeBtnText, selectedMode === 'versus' && styles.modeBtnTextActive]}>⚔️ Versus</Text>
            <Text style={[styles.modeDesc, selectedMode === 'versus' && styles.modeDescActive]}>Compete for the high score</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, selectedMode === 'party' && styles.modeBtnActive, !isPro && styles.modeBtnLocked]}
            onPress={() => handleModeSelect('party')}
          >
            <Text style={[styles.modeBtnText, selectedMode === 'party' && styles.modeBtnTextActive]}>
              {!isPro && '🔒 '}🎉 Party
            </Text>
            <Text style={[styles.modeDesc, selectedMode === 'party' && styles.modeDescActive]}>
              {!isPro ? 'Pro only — tap to unlock' : 'Play together as a group'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Difficulty</Text>
        {difficulties.map(d => (
          <TouchableOpacity
            key={d.key}
            style={[
              styles.diffBtn,
              selectedDifficulty === d.key && styles.diffBtnActive,
              d.locked && styles.diffBtnLocked,
            ]}
            onPress={() => handleDifficultySelect(d.key)}
          >
            <Text style={[styles.diffLabel, selectedDifficulty === d.key && styles.diffLabelActive]}>
              {d.locked && '🔒 '}{d.label}
            </Text>
            <Text style={[styles.diffDesc, selectedDifficulty === d.key && styles.diffDescActive]}>
              {d.locked ? 'Pro only' : d.desc}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>
          Decades{!isPro ? ' 🔒' : selectedDecades.length === 0 ? ' (all)' : ` (${selectedDecades.length} selected)`}
        </Text>
        <Text style={styles.filterHint}>
          {!isPro ? 'Pro only — tap to unlock filters' : 'Tap to select — leave all unselected for every era'}
        </Text>
        <View style={styles.pillGrid}>
          {DECADES.map(d => (
            <TouchableOpacity
              key={d.value}
              style={[
                styles.pill,
                selectedDecades.includes(d.value) && styles.pillActive,
                !isPro && styles.pillLocked,
              ]}
              onPress={() => toggleDecade(d.value)}
            >
              <Text style={[styles.pillText, selectedDecades.includes(d.value) && styles.pillTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>
          Genres{!isPro ? ' 🔒' : selectedGenres.length === 0 ? ' (all)' : ` (${selectedGenres.length} selected)`}
        </Text>
        <Text style={styles.filterHint}>
          {!isPro ? 'Pro only — tap to unlock filters' : 'Leave all unselected for every genre'}
        </Text>
        <View style={styles.pillGrid}>
          {GENRES.map(g => (
            <TouchableOpacity
              key={g.value}
              style={[
                styles.pill,
                selectedGenres.includes(g.value) && styles.pillActive,
                !isPro && styles.pillLocked,
              ]}
              onPress={() => toggleGenre(g.value)}
            >
              <Text style={[styles.pillText, selectedGenres.includes(g.value) && styles.pillTextActive]}>
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMode === 'versus' && (
          <>
            <Text style={styles.sectionLabel}>Players</Text>
            {players.map((player, index) => (
              <View key={index} style={styles.inputRow}>
                <TouchableOpacity
                  style={styles.avatarBtn}
                  onPress={() => setPickingAvatarFor(index)}
                >
                  <Text style={styles.avatarText}>{player.avatar}</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder={`Player ${index + 1}`}
                  placeholderTextColor="#64748b"
                  value={player.name}
                  onChangeText={(val) => updateName(index, val)}
                  autoCapitalize="words"
                />
                {players.length > 2 && (
                  <TouchableOpacity onPress={() => removePlayer(index)} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {players.length < 6 && (
              <TouchableOpacity onPress={addPlayer} style={styles.addBtn}>
                <Text style={styles.addBtnText}>+ Add player</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <Text style={styles.sectionLabel}>Rounds</Text>
        <View style={styles.roundsRow}>
          {[3, 5, 7, 10].map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.roundBtn, rounds === n && styles.roundBtnActive]}
              onPress={() => setRounds(n)}
            >
              <Text style={[styles.roundBtnText, rounds === n && styles.roundBtnTextActive]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
          onPress={startGame}
          disabled={!canStart}
        >
          <Text style={styles.startBtnText}>Let's go 🎵</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.privacyBtn}
          onPress={() => navigation.navigate('Stats')}
        >
          <Text style={styles.privacyBtnText}>📊 Your Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.privacyBtn}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <Text style={styles.privacyBtnText}>Privacy Policy</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal
        visible={pickingAvatarFor !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickingAvatarFor(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setPickingAvatarFor(null)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Pick an avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map(avatar => (
                <TouchableOpacity
                  key={avatar}
                  style={styles.avatarOption}
                  onPress={() => updateAvatar(pickingAvatarFor!, avatar)}
                >
                  <Text style={styles.avatarOptionText}>{avatar}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 24 },
  emoji: { fontSize: 48, textAlign: 'center', marginTop: 20 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginTop: 8, color: '#f1f5f9' },
  subtitle: { fontSize: 15, color: '#94a3b8', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  upgradeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  upgradeBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f59e0b',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  upgradeSub: {
    fontSize: 13,
    color: '#94a3b8',
  },
  dailyCard: {
    backgroundColor: '#172554',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  dailyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dailyBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93c5fd',
    letterSpacing: 0.8,
  },
  dailyStreak: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  dailyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  dailySubtitle: {
    fontSize: 13,
    color: '#93c5fd',
  },
  sectionLabel: { fontSize: 12, color: '#64748b', marginBottom: 4, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 },
  filterHint: { fontSize: 12, color: '#475569', marginBottom: 10 },
  modeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  modeBtn: { flex: 1, padding: 14, borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, alignItems: 'center', backgroundColor: '#1e293b' },
  modeBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  modeBtnLocked: { opacity: 0.6 },
  modeBtnText: { fontSize: 15, fontWeight: '600', color: '#94a3b8' },
  modeBtnTextActive: { color: '#fff' },
  modeDesc: { fontSize: 12, color: '#475569', marginTop: 4, textAlign: 'center' },
  modeDescActive: { color: '#bcd4f7' },
  diffBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, marginBottom: 8, backgroundColor: '#1e293b' },
  diffBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  diffBtnLocked: { opacity: 0.6 },
  diffLabel: { fontSize: 15, fontWeight: '600', color: '#94a3b8' },
  diffLabelActive: { color: '#fff' },
  diffDesc: { fontSize: 13, color: '#475569' },
  diffDescActive: { color: '#bcd4f7' },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  pill: { paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, backgroundColor: '#1e293b' },
  pillActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  pillLocked: { opacity: 0.5 },
  pillText: { fontSize: 14, color: '#94a3b8' },
  pillTextActive: { color: '#fff', fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatarBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center', marginRight: 10, backgroundColor: '#1e293b' },
  avatarText: { fontSize: 22 },
  input: { flex: 1, borderWidth: 1, borderColor: '#334155', borderRadius: 10, padding: 12, fontSize: 16, color: '#f1f5f9', backgroundColor: '#1e293b' },
  removeBtn: { marginLeft: 10, padding: 8 },
  removeBtnText: { fontSize: 16, color: '#475569' },
  addBtn: { marginTop: 4, marginBottom: 8, padding: 12, borderWidth: 1, borderColor: '#2563eb', borderRadius: 10, alignItems: 'center' },
  addBtnText: { fontSize: 15, color: '#2563eb' },
  roundsRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  roundBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, alignItems: 'center', backgroundColor: '#1e293b' },
  roundBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  roundBtnText: { fontSize: 16, color: '#94a3b8' },
  roundBtnTextActive: { color: '#fff', fontWeight: '600' },
  startBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center' },
  startBtnDisabled: { backgroundColor: '#1e3a6e' },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  privacyBtn: { alignItems: 'center', marginTop: 20, marginBottom: 8 },
  privacyBtnText: { fontSize: 13, color: '#475569', textDecorationLine: 'underline' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  modalBox: { backgroundColor: '#1e293b', borderRadius: 16, padding: 24, width: '80%' },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#f1f5f9', marginBottom: 16, textAlign: 'center' },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  avatarOption: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' },
  avatarOptionText: { fontSize: 26 },
})