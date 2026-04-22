import { Difficulty } from '../store/gameStore'

export function calculateYearScore(
  actualYear: number,
  guess: number | string,
  difficulty: Difficulty
): number {
  if (difficulty === 'easy') {
    const actualDecade = Math.floor(actualYear / 10) * 10
    const guessedDecade = typeof guess === 'number' ? guess : parseInt(guess)
    return actualDecade === guessedDecade ? 10 : 0
  }

  if (difficulty === 'medium') {
    const diff = Math.abs(actualYear - (guess as number))
    if (diff === 0) return 10
    if (diff <= 1) return 9
    if (diff <= 2) return 7
    if (diff <= 3) return 5
    if (diff <= 5) return 3
    return 0
  }

  // hard — exact year
  const diff = Math.abs(actualYear - (guess as number))
  if (diff === 0) return 10
  if (diff === 1) return 9
  if (diff === 2) return 8
  if (diff === 3) return 7
  if (diff === 4) return 6
  if (diff === 5) return 5
  if (diff === 6) return 4
  if (diff === 7) return 3
  if (diff === 8) return 2
  if (diff === 9) return 1
  return 0
}

export function calculateRankingScore(
  actualSongs: { rank: number; title: string }[],
  guessedOrder: { rank: number; title: string }[]
): number {
  let points = 0
  guessedOrder.forEach((song, index) => {
    const correctSong = actualSongs.find(s => s.rank === index + 1)
    if (correctSong && correctSong.title === song.title) {
      points += 3
    }
  })
  return points
}

export function getScoreMessage(total: number): string {
  if (total === 19) return 'Perfect round! 🎉'
  if (total >= 15) return 'Amazing! 🔥'
  if (total >= 10) return 'Nice work! 👍'
  if (total >= 5) return 'Not bad! 🎵'
  return 'Better luck next round! 😅'
}

export function getReactionMessage(
  actualYear: number,
  guessedYear: number,
  difficulty: Difficulty
): string {
  if (difficulty === 'easy') {
    const actualDecade = Math.floor(actualYear / 10) * 10
    const guessedDecade = typeof guessedYear === 'number' ? guessedYear : parseInt(guessedYear as any)
    if (actualDecade === guessedDecade) return "Nailed the decade! 🎯"
    return `It was the ${actualDecade}s, not the ${guessedDecade}s! 😅`
  }

  const diff = Math.abs(actualYear - guessedYear)
  if (diff === 0) return "Exact year! You're a legend! 🏆"
  if (diff <= 2) return `So close! Only ${diff} year${diff === 1 ? '' : 's'} off! 🔥`
  if (diff <= 5) return `Not bad! ${diff} years off 👍`
  if (diff <= 10) return `${diff} years off... getting warmer! 🎵`
  if (guessedYear < actualYear) return `${diff} years too early! This was way later 😂`
  return `${diff} years too late! This was way earlier 😂`
}

export function getStreakBonus(streak: number): number {
  if (streak >= 5) return 5
  if (streak >= 3) return 3
  if (streak >= 2) return 1
  return 0
}

export function getStreakMessage(streak: number): string {
  if (streak >= 5) return `${streak} streak! +5 bonus points 🔥🔥🔥`
  if (streak >= 3) return `${streak} streak! +3 bonus points 🔥🔥`
  if (streak >= 2) return `${streak} streak! +1 bonus point 🔥`
  return ''
}

export const DECADES = [
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