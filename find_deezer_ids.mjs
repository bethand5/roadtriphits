const songs = [
  { year: 1935, rank: 1, title: 'Cheek to Cheek', artist: 'Fred Astaire', query: 'Cheek to Cheek Fred Astaire' },
  { year: 1935, rank: 2, title: "I'm in the Mood for Love", artist: 'Little Jack Little', query: "I'm in the Mood for Love" },
  { year: 1935, rank: 3, title: 'Red Sails in the Sunset', artist: 'Guy Lombardo', query: 'Red Sails in the Sunset Guy Lombardo' },
  { year: 1936, rank: 1, title: 'The Way You Look Tonight', artist: 'Fred Astaire', query: 'The Way You Look Tonight Fred Astaire' },
  { year: 1936, rank: 2, title: 'Did I Remember', artist: 'Shep Fields', query: 'Did I Remember Shep Fields' },
  { year: 1936, rank: 3, title: 'Pennies from Heaven', artist: 'Bing Crosby', query: 'Pennies from Heaven Bing Crosby' },
  { year: 1937, rank: 1, title: 'Once in a While', artist: 'Tommy Dorsey', query: 'Once in a While Tommy Dorsey' },
  { year: 1937, rank: 2, title: 'Boo-Hoo', artist: 'Guy Lombardo', query: 'Boo Hoo Guy Lombardo' },
  { year: 1937, rank: 3, title: 'September in the Rain', artist: 'Guy Lombardo', query: 'September in the Rain Guy Lombardo' },
  { year: 1938, rank: 1, title: 'My Reverie', artist: 'Larry Clinton', query: 'My Reverie Larry Clinton' },
  { year: 1938, rank: 2, title: 'A-Tisket A-Tasket', artist: 'Ella Fitzgerald', query: 'A Tisket A Tasket Ella Fitzgerald' },
  { year: 1938, rank: 3, title: 'Bei Mir Bist Du Schoen', artist: 'The Andrews Sisters', query: 'Bei Mir Bist Du Schoen Andrews Sisters' },
  { year: 1939, rank: 1, title: 'Over the Rainbow', artist: 'Judy Garland', query: 'Over the Rainbow Judy Garland' },
  { year: 1939, rank: 2, title: 'Deep Purple', artist: 'Larry Clinton', query: 'Deep Purple Larry Clinton' },
  { year: 1939, rank: 3, title: 'Wishing Will Make It So', artist: 'Glenn Miller', query: 'Wishing Will Make It So Glenn Miller' },
  { year: 1940, rank: 1, title: 'When You Wish Upon a Star', artist: 'Cliff Edwards', query: 'When You Wish Upon a Star Cliff Edwards' },
  { year: 1940, rank: 2, title: 'Careless', artist: 'Glenn Miller', query: 'Careless Glenn Miller' },
  { year: 1940, rank: 3, title: 'The Woodpecker Song', artist: 'Glenn Miller', query: 'Woodpecker Song Glenn Miller' },
  { year: 1941, rank: 1, title: 'Chattanooga Choo Choo', artist: 'Glenn Miller', query: 'Chattanooga Choo Choo Glenn Miller' },
  { year: 1941, rank: 2, title: 'Green Eyes', artist: 'Jimmy Dorsey', query: 'Green Eyes Jimmy Dorsey' },
  { year: 1941, rank: 3, title: 'Amapola', artist: 'Jimmy Dorsey', query: 'Amapola Jimmy Dorsey' },
  { year: 1942, rank: 1, title: 'White Christmas', artist: 'Bing Crosby', query: 'White Christmas Bing Crosby' },
  { year: 1942, rank: 2, title: 'Blues in the Night', artist: 'Woody Herman', query: 'Blues in the Night Woody Herman' },
  { year: 1942, rank: 3, title: 'That Old Black Magic', artist: 'Glenn Miller', query: 'That Old Black Magic Glenn Miller' },
  { year: 1943, rank: 1, title: "You'll Never Know", artist: 'Frank Sinatra', query: "Youll Never Know Frank Sinatra" },
  { year: 1943, rank: 2, title: 'Paper Doll', artist: 'The Mills Brothers', query: 'Paper Doll Mills Brothers' },
  { year: 1943, rank: 3, title: 'Sunday Monday or Always', artist: 'Bing Crosby', query: 'Sunday Monday or Always Bing Crosby' },
  { year: 1944, rank: 1, title: "I'll Be Seeing You", artist: 'Bing Crosby', query: "Ill Be Seeing You Bing Crosby" },
  { year: 1944, rank: 2, title: 'Swinging on a Star', artist: 'Bing Crosby', query: 'Swinging on a Star Bing Crosby' },
  { year: 1944, rank: 3, title: 'Besame Mucho', artist: 'Jimmy Dorsey', query: 'Besame Mucho Jimmy Dorsey' },
  { year: 1945, rank: 1, title: 'Rum and Coca-Cola', artist: 'The Andrews Sisters', query: 'Rum and Coca Cola Andrews Sisters' },
  { year: 1945, rank: 2, title: 'Till the End of Time', artist: 'Perry Como', query: 'Till the End of Time Perry Como' },
  { year: 1945, rank: 3, title: 'Atchison Topeka Santa Fe', artist: 'Johnny Mercer', query: 'Atchison Topeka Santa Fe Johnny Mercer' },
  { year: 1946, rank: 1, title: 'The Gypsy', artist: 'The Ink Spots', query: 'The Gypsy Ink Spots' },
  { year: 1946, rank: 2, title: 'To Each His Own', artist: 'Eddy Howard', query: 'To Each His Own Eddy Howard' },
  { year: 1946, rank: 3, title: 'Five Minutes More', artist: 'Frank Sinatra', query: 'Five Minutes More Frank Sinatra' },
  { year: 1947, rank: 1, title: 'Near You', artist: 'Francis Craig', query: 'Near You Francis Craig' },
  { year: 1947, rank: 2, title: 'Peg O My Heart', artist: 'The Harmonicats', query: 'Peg O My Heart Harmonicats' },
  { year: 1947, rank: 3, title: 'Mamselle', artist: 'Art Lund', query: 'Mamselle Art Lund' },
  { year: 1948, rank: 1, title: 'Nature Boy', artist: 'Nat King Cole', query: 'Nature Boy Nat King Cole' },
  { year: 1948, rank: 2, title: 'Buttons and Bows', artist: 'Dinah Shore', query: 'Buttons and Bows Dinah Shore' },
  { year: 1948, rank: 3, title: 'Taint Nobodys Business', artist: 'Billie Holiday', query: 'Taint Nobodys Business Billie Holiday' },
  { year: 1949, rank: 1, title: 'Riders in the Sky', artist: 'Vaughn Monroe', query: 'Ghost Riders in the Sky Vaughn Monroe' },
  { year: 1949, rank: 2, title: 'Some Enchanted Evening', artist: 'Perry Como', query: 'Some Enchanted Evening Perry Como' },
  { year: 1949, rank: 3, title: 'Slipping Around', artist: 'Margaret Whiting', query: 'Slipping Around Margaret Whiting Jimmy Wakely' },
  { year: 1950, rank: 1, title: 'Goodnight Irene', artist: 'Gordon Jenkins', query: 'Goodnight Irene Gordon Jenkins Weavers' },
  { year: 1950, rank: 2, title: 'Mona Lisa', artist: 'Nat King Cole', query: 'Mona Lisa Nat King Cole' },
  { year: 1950, rank: 3, title: 'Third Man Theme', artist: 'Anton Karas', query: 'Third Man Theme Anton Karas' },
  { year: 1951, rank: 1, title: 'Too Young', artist: 'Nat King Cole', query: 'Too Young Nat King Cole' },
  { year: 1951, rank: 2, title: 'Come On-a My House', artist: 'Rosemary Clooney', query: 'Come On a My House Rosemary Clooney' },
  { year: 1951, rank: 3, title: 'How High the Moon', artist: 'Les Paul', query: 'How High the Moon Les Paul Mary Ford' },
  { year: 1952, rank: 1, title: 'Blue Tango', artist: 'Leroy Anderson', query: 'Blue Tango Leroy Anderson' },
  { year: 1952, rank: 2, title: 'Wheel of Fortune', artist: 'Kay Starr', query: 'Wheel of Fortune Kay Starr' },
  { year: 1952, rank: 3, title: 'Cry', artist: 'Johnnie Ray', query: 'Cry Johnnie Ray' },
  { year: 1953, rank: 1, title: 'Vaya Con Dios', artist: 'Les Paul', query: 'Vaya Con Dios Les Paul Mary Ford' },
  { year: 1953, rank: 2, title: 'Song from Moulin Rouge', artist: 'Percy Faith', query: 'Song from Moulin Rouge Percy Faith' },
  { year: 1953, rank: 3, title: 'You You You', artist: 'The Ames Brothers', query: 'You You You Ames Brothers' },
  { year: 1954, rank: 1, title: 'Little Things Mean a Lot', artist: 'Kitty Kallen', query: 'Little Things Mean a Lot Kitty Kallen' },
  { year: 1954, rank: 2, title: 'Three Coins in the Fountain', artist: 'The Four Aces', query: 'Three Coins in the Fountain Four Aces' },
  { year: 1954, rank: 3, title: 'Sh-Boom', artist: 'The Crew-Cuts', query: 'Sh Boom Life Could Be a Dream Crew Cuts' },
  { year: 1955, rank: 1, title: 'Rock Around the Clock', artist: 'Bill Haley', query: 'Rock Around the Clock Bill Haley Comets' },
  { year: 1955, rank: 2, title: 'Cherry Pink and Apple Blossom White', artist: 'Perez Prado', query: 'Cherry Pink Apple Blossom White Perez Prado' },
  { year: 1955, rank: 3, title: 'Sixteen Tons', artist: 'Tennessee Ernie Ford', query: 'Sixteen Tons Tennessee Ernie Ford' },
  { year: 1956, rank: 1, title: 'Heartbreak Hotel', artist: 'Elvis Presley', query: 'Heartbreak Hotel Elvis Presley' },
  { year: 1956, rank: 2, title: "Don't Be Cruel", artist: 'Elvis Presley', query: "Dont Be Cruel Elvis Presley" },
  { year: 1956, rank: 3, title: 'Hound Dog', artist: 'Elvis Presley', query: 'Hound Dog Elvis Presley' },
  { year: 1957, rank: 1, title: 'All Shook Up', artist: 'Elvis Presley', query: 'All Shook Up Elvis Presley' },
  { year: 1957, rank: 2, title: 'Jailhouse Rock', artist: 'Elvis Presley', query: 'Jailhouse Rock Elvis Presley' },
  { year: 1957, rank: 3, title: 'Bye Bye Love', artist: 'Everly Brothers', query: 'Bye Bye Love Everly Brothers' },
]

async function findBestMatch(song) {
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(song.query)}&limit=10`
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!data?.data?.length) return null
    const titleLower = song.title.toLowerCase()
    const artistLower = song.artist.toLowerCase().split('&')[0].trim()
    const exact = data.data.find(t =>
      t.title?.toLowerCase().includes(titleLower) &&
      t.artist?.name?.toLowerCase().includes(artistLower) &&
      t.preview
    )
    if (exact) return { id: exact.id, title: exact.title, artist: exact.artist.name, hasPreview: true }
    const titleMatch = data.data.find(t => t.title?.toLowerCase().includes(titleLower) && t.preview)
    if (titleMatch) return { id: titleMatch.id, title: titleMatch.title, artist: titleMatch.artist.name, hasPreview: true }
    const anyMatch = data.data.find(t => t.title?.toLowerCase().includes(titleLower))
    if (anyMatch) return { id: anyMatch.id, title: anyMatch.title, artist: anyMatch.artist.name, hasPreview: false }
    return null
  } catch (e) {
    return null
  }
}

async function main() {
  console.log('Looking up Deezer IDs...\n')
  const results = []
  for (const song of songs) {
    await new Promise(r => setTimeout(r, 200))
    const match = await findBestMatch(song)
    const status = !match ? '❌' : match.hasPreview ? '✅' : '⚠️ '
    console.log(`${status} ${song.year} #${song.rank} "${song.title}" — ${song.artist}`)
    if (match) console.log(`   → id: ${match.id} | "${match.title}" by ${match.artist}`)
    results.push({ song, match })
  }
  console.log('\n\n=== RESULTS (paste back to Claude) ===\n')
  for (const { song, match } of results) {
    console.log(`${song.year}|${song.rank}|${match?.hasPreview ? match.id : 'null'}|${match ? match.title + ' by ' + match.artist : 'NOT FOUND'}`)
  }
}

main()
