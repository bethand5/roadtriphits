import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native'
import { Audio } from 'expo-av'
import { getPreviewUrl } from '../utils/deezer'

export let currentlyPlayingSound: Audio.Sound | null = null
export let setCurrentlyPlayingState: ((v: boolean) => void) | null = null

interface Props {
  title: string
  artist: string
  searchQuery?: string
  deezerId?: number
}

export default function SongPlayer({ title, artist, searchQuery, deezerId }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [noPreview, setNoPreview] = useState(false)
  const soundRef = useRef<Audio.Sound | null>(null)

  useEffect(() => {
    setIsPlaying(false)
    loadPreview()
    return () => {
      if (soundRef.current) {
        if (currentlyPlayingSound === soundRef.current) {
          currentlyPlayingSound = null
          setCurrentlyPlayingState = null
        }
        soundRef.current.unloadAsync()
        soundRef.current = null
      }
    }
  }, [title, artist])

  const loadPreview = async () => {
    setIsLoading(true)
    setNoPreview(false)
    const url = await getPreviewUrl(title, artist, searchQuery, deezerId)
    if (url) {
      setPreviewUrl(url)
    } else {
      setNoPreview(true)
    }
    setIsLoading(false)
  }

  const togglePlay = async () => {
    if (!previewUrl) return

    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync()
        setIsPlaying(false)
      } else {
        if (currentlyPlayingSound && currentlyPlayingSound !== soundRef.current) {
          await currentlyPlayingSound.stopAsync()
          if (setCurrentlyPlayingState) setCurrentlyPlayingState(false)
        }
        currentlyPlayingSound = soundRef.current
        setCurrentlyPlayingState = setIsPlaying
        await soundRef.current.playAsync()
        setIsPlaying(true)
      }
      return
    }

    setIsLoading(true)
    try {
      if (currentlyPlayingSound) {
        await currentlyPlayingSound.stopAsync()
        if (setCurrentlyPlayingState) setCurrentlyPlayingState(false)
        currentlyPlayingSound = null
        setCurrentlyPlayingState = null
      }

      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: previewUrl },
        { shouldPlay: true }
      )
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false)
          currentlyPlayingSound = null
          setCurrentlyPlayingState = null
        }
      })
      soundRef.current = newSound
      currentlyPlayingSound = newSound
      setCurrentlyPlayingState = setIsPlaying
      setIsPlaying(true)
    } catch (e) {
      console.log('Audio error:', e)
    }
    setIsLoading(false)
  }

  const openInMusic = () => {
    const appleQuery = encodeURIComponent(title)
    const spotifyQuery = encodeURIComponent(`${title} ${artist}`)
    Alert.alert(
      'Listen to full song',
      'Choose where to listen:',
      [
        {
          text: 'Apple Music',
          onPress: () =>
            Linking.openURL(`music://search?term=${appleQuery}`).catch(() =>
              Linking.openURL(`https://music.apple.com/search?term=${appleQuery}`)
            ),
        },
        {
          text: 'Spotify',
          onPress: () =>
            Linking.openURL(`https://open.spotify.com/search/${spotifyQuery}`),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artist}</Text>
        <View style={styles.previewRow}>
          <Text style={styles.previewNote}>30 sec preview · </Text>
          <TouchableOpacity onPress={openInMusic}>
            <Text style={styles.fullSongLink}>Full song ↗</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator size="small" color="#2563eb" />
      ) : noPreview ? (
        <TouchableOpacity onPress={openInMusic} style={styles.noPreviewBtn}>
          <Text style={styles.noPreviewText}>Listen ↗</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 14, marginBottom: 10, backgroundColor: '#1e293b' },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#f1f5f9' },
  artist: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  previewRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  previewNote: { fontSize: 11, color: '#475569' },
  fullSongLink: { fontSize: 11, color: '#2563eb', textDecorationLine: 'underline' },
  playBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' },
  playIcon: { fontSize: 16, color: '#2563eb' },
  noPreviewBtn: { padding: 8 },
  noPreviewText: { fontSize: 13, color: '#2563eb', textDecorationLine: 'underline' },
})