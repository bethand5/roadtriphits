import { Audio } from 'expo-av'

const soundFiles = {
  bigWin: require('../assets/BigWin.wav'),
  mediumWin: require('../assets/MediumWin.wav'),
  smallWin: require('../assets/SmallWin.wav'),
  wrong: require('../assets/Wrong.wav'),
}

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

  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
    const { sound } = await Audio.Sound.createAsync(soundFiles[soundKey])
    await sound.playAsync()
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync()
      }
    })
  } catch (e) {
    console.log('Sound error:', e)
  }
}