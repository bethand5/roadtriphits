Road Trip Hits — Project Handoff
What it is
A React Native Expo iOS app where players listen to 30-second previews of Billboard top songs and guess the year + ranking. Two modes: Versus (competitive) and Party (cooperative).
Tech Stack

React Native + Expo
TypeScript
Zustand (state management)
Deezer API (free song previews, no key needed)
expo-av (audio playback)
@react-native-community/slider
@react-navigation/native + @react-navigation/stack

Project Location
/Users/bethand05/roadtriphits
File Structure
App.tsx
screens/
  HomeScreen.tsx
  TurnIntroScreen.tsx
  GameScreen.tsx
  RoundResultScreen.tsx
  LeaderboardScreen.tsx
  PartyGameScreen.tsx
  PartyResultScreen.tsx
  PartyFinalScreen.tsx
  PrivacyPolicyScreen.tsx
components/
  SongPlayer.tsx
store/
  gameStore.ts
utils/
  scoring.ts
  deezer.ts
  sounds.ts
data/
  billboard.ts
  billboard_pre1958.ts
  genreBillboard.ts
  trivia.ts
assets/
  BigWin.wav
  MediumWin.wav
  SmallWin.wav
  Wrong.wav
How to Run
bashcd /Users/bethand05/roadtriphits
npx expo start --tunnel --clear
Scan QR code with iPhone camera, opens in Expo Go.

Features Built

✅ Versus mode — all players on same screen, same songs, scroll down to your section
✅ Party mode — group plays together, running total score
✅ Difficulty settings — Easy (pick decade), Medium (within 5 years), Hard (exact year)
✅ Multi-decade filter — pick one or more specific decades on home screen
✅ Genre filter — Country, Jazz, R&B, Rock, Pop, Standards — works across all years
✅ Decade + genre filters work together simultaneously
✅ Song previews via Deezer (30 sec, free, no API key)
✅ Deezer track IDs hardcoded for pre-1958 songs (no wrong song plays)
✅ Full song links — tap to open Apple Music or Spotify
✅ Only one song plays at a time
✅ Song stops when answer is submitted
✅ Song ranking with arrows
✅ Year slider or decade picker depending on difficulty
✅ Hint button — reveals decade, costs 3 pts
✅ Streak bonus — get year right multiple rounds in a row
✅ Sound effects — BigWin, MediumWin, SmallWin, Wrong
✅ Reaction messages — funny messages based on how far off you were
✅ Player avatars — pick from music/car emojis
✅ Rematch button — same players, new game
✅ Back button disabled during game
✅ Billboard data 1958–2024
✅ Pre-1958 data 1935–1957 (Your Hit Parade historical chart)
✅ Genre data — top 3 songs per genre per year across all eras:

Standards: 1935–2024
Jazz: 1935–2024
Pop: 1935–2024
Country: 1940–2024
R&B: 1945–2024
Rock: 1954–2024


✅ Flip card animations on result screens (staggered, 700ms per card)
✅ Score ticker animation (counts up from 0 after all cards flip)
✅ Trivia facts about the #1 song, fade in after score ticker (1958–2024)
✅ Privacy policy screen (linked from home screen footer)
✅ Dark navy theme (#0f172a background, #2563eb blue accents)

Scoring

Year: 10pts exact, slides down to 0 at 10+ years off (Hard). Medium: within 5 years. Easy: correct decade = 10pts.
Ranking: 3pts per correct song position (max 9pts)
Streak bonus: 2 streak = +1pt, 3 streak = +3pts, 5 streak = +5pts
Hint penalty: -3pts
Max per round: 19pts + streak bonus


Data Architecture
Billboard data (1958–2024)
data/billboard.ts — keyed by year, top 3 songs each year from Billboard Hot 100. No genre tags.
Pre-1958 data (1935–1957)
data/billboard_pre1958.ts — Your Hit Parade historical chart. Has genre tags + Deezer track IDs hardcoded for accurate preview lookup.
Genre data (all eras)
data/genreBillboard.ts — top 3 songs per genre per year. When a genre filter is active, the game pulls exclusively from this file instead of billboard.ts. Structure:
typescriptgenreBillboard['Country'][1975] // returns top 3 Country songs from 1975
Song selection logic
Both TurnIntroScreen.tsx and PartyGameScreen.tsx contain identical loadRound / startRound logic:

If genre filter active → build year pool from genreBillboard for selected genres
If no genre filter → use all Billboard years + pre-1958 years
Apply decade filter on top of whatever pool was built
Pick random year, fetch songs from correct data source


Audio Architecture
SongPlayer.tsx exports two module-level globals:

currentlyPlayingSound — the currently playing Audio.Sound instance
setCurrentlyPlayingState — the setter to reset that component's play button UI

For pre-1958 songs, getPreviewUrl in utils/spotify.ts fetches by Deezer track ID directly (https://api.deezer.com/track/ID) when a deezerId is available, bypassing search entirely. Falls back to search for songs without an ID.
Both GameScreen.tsx and PartyGameScreen.tsx stop audio on submit:
typescriptif (currentlyPlayingSound) {
  await currentlyPlayingSound.stopAsync()
  if (setCurrentlyPlayingState) setCurrentlyPlayingState(false)
}

Color Palette
TokenHexUsageBackground#0f172aAll screen backgroundsCard/Section#1e293bCards, player sections, rank cardsDeep card#172554Hint boxes, trivia cards, filter tagsBorder#334155All bordersPrimary blue#2563ebButtons, active states, scores, accentsLight blue text#93c5fdHint text, filter tag textPrimary text#f1f5f9Headings, song titlesSecondary text#94a3b8Artists, subtitlesMuted text#64748bSection labels, round labelsFaint text#475569Hints, rank hints

Still To Do

App icon + splash screen (girlfriend designed it — 1024x1024 PNG, add to Expo config)
Submit to App Store ($99 Apple Developer account needed)


Known Issues / Notes

expo-av is deprecated — future update should migrate to expo-audio + expo-video
SafeAreaView deprecation warning — future update should use react-native-safe-area-context
Files are case sensitive — VS Code sometimes saves with wrong capitalization, use mv in terminal to 
~15 pre-1958 songs have no Deezer preview available — these show "Listen ↗" instead of a play button, which is correct behavior
find_deezer_ids.mjs script is in the project root — safe to delete, it was a one-time utility

Contact
briones05ethan@gmail.com