import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native'
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio'
import { getPreviewUrl } from '../utils/deezer'
import { useAudioStore } from '../store/audioStore'

interface Props {
  title: string
  artist: string
  searchQuery?: string
  deezerId?: number
}

export default function SongPlayer({ title, artist, searchQuery, deezerId }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)
  const [noPreview, setNoPreview] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Create the player with a null source — we'll swap in the URL once fetched.
  const player = useAudioPlayer(previewUrl)
  const status = useAudioPlayerStatus(player)
  const setCurrentPlayer = useAudioStore(s => s.setCurrentPlayer)

  // Fetch the preview URL whenever the song or retry counter changes
  useEffect(() => {
    let cancelled = false
    const loadPreview = async () => {
      setIsLoadingUrl(true)
      setNoPreview(false)
      setNetworkError(false)
      setPreviewUrl(null)
      const result = await getPreviewUrl(title, artist, searchQuery, deezerId)
      if (cancelled) return
      if (result.status === 'ok') {
        setPreviewUrl(result.url)
      } else if (result.status === 'no-preview') {
        setNoPreview(true)
      } else {
        setNetworkError(true)
      }
      setIsLoadingUrl(false)
    }
    loadPreview()
    return () => {
      cancelled = true
    }
  }, [title, artist, searchQuery, deezerId, retryCount])

  // Configure the audio session once on mount
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {})
  }, [])

  const togglePlay = () => {
    if (!previewUrl || !status.isLoaded) return

    if (status.playing) {
      player.pause()
    } else {
      setCurrentPlayer(player)
      player.play()
    }
  }

  const retryFetch = () => {
    setRetryCount(c => c + 1)
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

  const isLoading = isLoadingUrl || (previewUrl !== null && !status.isLoaded)

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{artist}</Text>
        <View style={styles.previewRow}>
          {networkError ? (
            <Text style={styles.errorNote}>Connection issue · </Text>
          ) : (
            <Text style={styles.previewNote}>30 sec preview · </Text>
          )}
          <TouchableOpacity onPress={openInMusic}>
            <Text style={styles.fullSongLink}>Full song ↗</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator size="small" color="#2563eb" />
      ) : networkError ? (
        <TouchableOpacity onPress={retryFetch} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      ) : noPreview ? (
        <TouchableOpacity onPress={openInMusic} style={styles.noPreviewBtn}>
          <Text style={styles.noPreviewText}>Listen ↗</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
          <Text style={styles.playIcon}>{status.playing ? '⏸' : '▶'}</Text>
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
  errorNote: { fontSize: 11, color: '#f59e0b' },
  fullSongLink: { fontSize: 11, color: '#2563eb', textDecorationLine: 'underline' },
  playBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' },
  playIcon: { fontSize: 16, color: '#2563eb' },
  noPreviewBtn: { padding: 8 },
  noPreviewText: { fontSize: 13, color: '#2563eb', textDecorationLine: 'underline' },
  retryBtn: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#f59e0b', borderRadius: 8 },
  retryText: { fontSize: 12, color: '#f59e0b', fontWeight: '600' },
})