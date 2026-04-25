import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio'
import * as Haptics from 'expo-haptics'

const soundFiles = {
  bigWin: require('../assets/BigWin.wav'),
  mediumWin: require('../assets/MediumWin.wav'),
  smallWin: require('../assets/SmallWin.wav'),
  wrong: require('../assets/Wrong.wav'),
}

// Pre-create players once at module load — playback is instant after this
const players: Record<keyof typeof soundFiles, AudioPlayer> = {
  bigWin: createAudioPlayer(soundFiles.bigWin),
  mediumWin: createAudioPlayer(soundFiles.mediumWin),
  smallWin: createAudioPlayer(soundFiles.smallWin),
  wrong: createAudioPlayer(soundFiles.wrong),
}

// Force volume to max on all players
players.bigWin.volume = 1.0
players.mediumWin.volume = 1.0
players.smallWin.volume = 1.0
players.wrong.volume = 1.0

let audioModeConfigured = false

export async function playResultSound(rankScore: number, yearScore: number) {
  let soundKey: keyof typeof soundFiles

  if (rankScore === 9 || yearScore === 10) {
    soundKey = 'bigWin'
  } else if (rankScore === 6 || yearScore >= 7) {
    soundKey = 'mediumWin'
  } else if (rankScore === 3 || yearScore >= 3) {
    soundKey = 'smallWin'
  } else {
    soundKey = 'wrong'
  }

  // Fire haptic alongside the sound
  try {
    if (soundKey === 'bigWin') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else if (soundKey === 'mediumWin') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } else if (soundKey === 'smallWin') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }
  } catch (e) {
    // Haptics not supported — fail silent
  }

  try {
    if (!audioModeConfigured) {
      await setAudioModeAsync({ playsInSilentMode: true })
      audioModeConfigured = true
    }

    const player = players[soundKey]
    player.seekTo(0)
    player.play()
  } catch (e) {
    console.log('Sound error:', e)
  }
}