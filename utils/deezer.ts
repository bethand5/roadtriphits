// Possible outcomes of a preview lookup
export type PreviewResult =
  | { status: 'ok'; url: string }
  | { status: 'no-preview' } // confirmed no preview exists for this song
  | { status: 'network-error' } // couldn't reach Deezer

export const getPreviewUrl = async (
  title: string,
  artist: string,
  searchQuery?: string,
  deezerId?: number
): Promise<PreviewResult> => {
  // Direct ID lookup — always the right song
  if (deezerId) {
    try {
      const res = await fetch(`https://api.deezer.com/track/${deezerId}`)
      if (!res.ok) return { status: 'network-error' }
      const data = await res.json()
      if (data?.preview) return { status: 'ok', url: data.preview }
      // ID resolved but Deezer has no preview clip
      return { status: 'no-preview' }
    } catch {
      return { status: 'network-error' }
    }
  }

  // Fall back to search
  const query = searchQuery
    ? encodeURIComponent(searchQuery)
    : encodeURIComponent(`${title} ${artist}`)

  try {
    const response = await fetch(`https://api.deezer.com/search?q=${query}&limit=10`)
    if (!response.ok) return { status: 'network-error' }
    const data = await response.json()
    if (!data?.data?.length) return { status: 'no-preview' }

    const titleLower = title.toLowerCase()
    const artistLower = artist.toLowerCase().split('&')[0].trim()

    const exactMatch = data.data.find(
      (track: any) =>
        track.title?.toLowerCase().includes(titleLower) &&
        track.artist?.name?.toLowerCase().includes(artistLower) &&
        track.preview
    )
    if (exactMatch?.preview) return { status: 'ok', url: exactMatch.preview }

    const titleMatch = data.data.find(
      (track: any) => track.title?.toLowerCase().includes(titleLower) && track.preview
    )
    if (titleMatch?.preview) return { status: 'ok', url: titleMatch.preview }

    return { status: 'no-preview' }
  } catch {
    return { status: 'network-error' }
  }
}