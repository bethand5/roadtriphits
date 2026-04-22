export const getPreviewUrl = async (
  title: string,
  artist: string,
  searchQuery?: string,
  deezerId?: number
): Promise<string | null> => {
  try {
    // Direct ID lookup — always the right song
    if (deezerId) {
      const res = await fetch(`https://api.deezer.com/track/${deezerId}`)
      const data = await res.json()
      if (data?.preview) return data.preview
    }

    // Fall back to search
    const query = searchQuery
      ? encodeURIComponent(searchQuery)
      : encodeURIComponent(`${title} ${artist}`)

    const response = await fetch(
      `https://api.deezer.com/search?q=${query}&limit=10`
    )
    const data = await response.json()
    if (!data?.data?.length) return null

    const titleLower = title.toLowerCase()
    const artistLower = artist.toLowerCase().split('&')[0].trim()

    const exactMatch = data.data.find(
      (track: any) =>
        track.title?.toLowerCase().includes(titleLower) &&
        track.artist?.name?.toLowerCase().includes(artistLower) &&
        track.preview
    )
    if (exactMatch?.preview) return exactMatch.preview

    const titleMatch = data.data.find(
      (track: any) => track.title?.toLowerCase().includes(titleLower) && track.preview
    )
    if (titleMatch?.preview) return titleMatch.preview

    return null
  } catch (e) {
    return null
  }
}