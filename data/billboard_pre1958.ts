// Pre-1958 Historical Chart Data
// Source: Your Hit Parade (1935–1957) — America's #1 radio/TV chart before Billboard Hot 100
// Songs selected are the biggest hits of each year by weeks at #1 / cultural impact
// Genre tags added for future genre filter feature

export type Genre = 'Pop' | 'Jazz' | 'Country' | 'RnB' | 'Rock' | 'Standards';

export interface PreBillboardSong {
  title: string;
  artist: string;
  year: number;
  rank: number;
  genre: Genre;
  deezerId?: number;
  searchQuery?: string;
}

export const preBillboardData: PreBillboardSong[] = [

  // ── 1935 ──────────────────────────────────────────────────────────────────
  { year: 1935, rank: 1, title: 'Cheek to Cheek',              artist: 'Fred Astaire',           genre: 'Standards',  deezerId: 13234767 },
  { year: 1935, rank: 2, title: "I'm in the Mood for Love",    artist: 'Little Jack Little',     genre: 'Standards' },
  { year: 1935, rank: 3, title: 'Red Sails in the Sunset',     artist: 'Guy Lombardo',           genre: 'Pop',        deezerId: 853902832 },

  // ── 1936 ──────────────────────────────────────────────────────────────────
  { year: 1936, rank: 1, title: 'The Way You Look Tonight',    artist: 'Fred Astaire',           genre: 'Standards',  deezerId: 1030018 },
  { year: 1936, rank: 2, title: 'Did I Remember',              artist: 'Shep Fields',            genre: 'Pop' },
  { year: 1936, rank: 3, title: 'Pennies from Heaven',         artist: 'Bing Crosby',            genre: 'Standards',  deezerId: 119081700 },

  // ── 1937 ──────────────────────────────────────────────────────────────────
  { year: 1937, rank: 1, title: 'Once in a While',             artist: 'Tommy Dorsey',           genre: 'Standards',  deezerId: 1075704 },
  { year: 1937, rank: 2, title: 'Boo-Hoo',                     artist: 'Guy Lombardo',           genre: 'Pop' },
  { year: 1937, rank: 3, title: 'September in the Rain',       artist: 'Guy Lombardo',           genre: 'Standards' },

  // ── 1938 ──────────────────────────────────────────────────────────────────
  { year: 1938, rank: 1, title: 'My Reverie',                  artist: 'Larry Clinton',          genre: 'Standards',  deezerId: 110021286 },
  { year: 1938, rank: 2, title: 'A-Tisket, A-Tasket',          artist: 'Ella Fitzgerald',        genre: 'Jazz' },
  { year: 1938, rank: 3, title: 'Bei Mir Bist Du Schön',       artist: 'The Andrews Sisters',    genre: 'Pop',        deezerId: 549277072 },

  // ── 1939 ──────────────────────────────────────────────────────────────────
  { year: 1939, rank: 1, title: 'Over the Rainbow',            artist: 'Judy Garland',           genre: 'Standards',  deezerId: 647350552 },
  { year: 1939, rank: 2, title: 'Deep Purple',                 artist: 'Larry Clinton',          genre: 'Standards',  deezerId: 12419504 },
  { year: 1939, rank: 3, title: 'Wishing (Will Make It So)',   artist: 'Glenn Miller',           genre: 'Standards',  deezerId: 969763 },

  // ── 1940 ──────────────────────────────────────────────────────────────────
  { year: 1940, rank: 1, title: 'When You Wish Upon a Star',   artist: 'Cliff Edwards',          genre: 'Standards',  deezerId: 677778432 },
  { year: 1940, rank: 2, title: 'Careless',                    artist: 'Glenn Miller',           genre: 'Standards',  deezerId: 3369082461 },
  { year: 1940, rank: 3, title: 'The Woodpecker Song',         artist: 'Glenn Miller',           genre: 'Pop',        deezerId: 570216 },

  // ── 1941 ──────────────────────────────────────────────────────────────────
  { year: 1941, rank: 1, title: 'Chattanooga Choo Choo',       artist: 'Glenn Miller',           genre: 'Jazz',       deezerId: 570280 },
  { year: 1941, rank: 2, title: 'Green Eyes',                  artist: 'Jimmy Dorsey',           genre: 'Standards',  deezerId: 571068172 },
  { year: 1941, rank: 3, title: 'Amapola',                     artist: 'Jimmy Dorsey',           genre: 'Standards',  deezerId: 571068112 },

  // ── 1942 ──────────────────────────────────────────────────────────────────
  { year: 1942, rank: 1, title: 'White Christmas',             artist: 'Bing Crosby',            genre: 'Standards',  deezerId: 788295 },
  { year: 1942, rank: 2, title: 'Blues in the Night',          artist: 'Woody Herman',           genre: 'Jazz',       deezerId: 118564146 },
  { year: 1942, rank: 3, title: 'That Old Black Magic',        artist: 'Glenn Miller',           genre: 'Standards',  deezerId: 13181512 },

  // ── 1943 ──────────────────────────────────────────────────────────────────
  { year: 1943, rank: 1, title: "You'll Never Know",           artist: 'Frank Sinatra',          genre: 'Standards',  deezerId: 719252 },
  { year: 1943, rank: 2, title: 'Paper Doll',                  artist: 'The Mills Brothers',     genre: 'Pop',        deezerId: 1421640132 },
  { year: 1943, rank: 3, title: 'Sunday, Monday or Always',    artist: 'Bing Crosby',            genre: 'Standards' },

  // ── 1944 ──────────────────────────────────────────────────────────────────
  { year: 1944, rank: 1, title: "I'll Be Seeing You",          artist: 'Bing Crosby',            genre: 'Standards',  deezerId: 2952785 },
  { year: 1944, rank: 2, title: 'Swinging on a Star',          artist: 'Bing Crosby',            genre: 'Standards' },
  { year: 1944, rank: 3, title: 'Besame Mucho',                artist: 'Jimmy Dorsey',           genre: 'Standards' },

  // ── 1945 ──────────────────────────────────────────────────────────────────
  { year: 1945, rank: 1, title: 'Rum and Coca-Cola',           artist: 'The Andrews Sisters',    genre: 'Pop' },
  { year: 1945, rank: 2, title: 'Till the End of Time',        artist: 'Perry Como',             genre: 'Standards',  deezerId: 365111731 },
  { year: 1945, rank: 3, title: 'On the Atchison, Topeka and the Santa Fe', artist: 'Johnny Mercer', genre: 'Standards' },

  // ── 1946 ──────────────────────────────────────────────────────────────────
  { year: 1946, rank: 1, title: 'The Gypsy',                   artist: 'The Ink Spots',          genre: 'Pop',        deezerId: 798894592 },
  { year: 1946, rank: 2, title: 'To Each His Own',             artist: 'Eddy Howard',            genre: 'Standards',  deezerId: 6219289 },
  { year: 1946, rank: 3, title: 'Five Minutes More',           artist: 'Frank Sinatra',          genre: 'Standards',  deezerId: 3231867 },

  // ── 1947 ──────────────────────────────────────────────────────────────────
  { year: 1947, rank: 1, title: 'Near You',                    artist: 'Francis Craig',          genre: 'Pop' },
  { year: 1947, rank: 2, title: "Peg o' My Heart",             artist: 'The Harmonicats',        genre: 'Pop' },
  { year: 1947, rank: 3, title: "Mam'selle",                   artist: 'Art Lund',               genre: 'Standards' },

  // ── 1948 ──────────────────────────────────────────────────────────────────
  { year: 1948, rank: 1, title: 'Nature Boy',                  artist: 'Nat King Cole',          genre: 'Standards',  deezerId: 646266072 },
  { year: 1948, rank: 2, title: 'Buttons and Bows',            artist: 'Dinah Shore',            genre: 'Pop',        deezerId: 725625892 },
  { year: 1948, rank: 3, title: "T'ain't Nobody's Bizness If I Do", artist: 'Billie Holiday',   genre: 'Jazz' },

  // ── 1949 ──────────────────────────────────────────────────────────────────
  { year: 1949, rank: 1, title: 'Riders in the Sky',           artist: 'Vaughn Monroe',          genre: 'Country' },
  { year: 1949, rank: 2, title: 'Some Enchanted Evening',      artist: 'Perry Como',             genre: 'Standards',  deezerId: 2485851 },
  { year: 1949, rank: 3, title: 'Slipping Around',             artist: 'Margaret Whiting',       genre: 'Country',    deezerId: 2286454737 },

  // ── 1950 ──────────────────────────────────────────────────────────────────
  { year: 1950, rank: 1, title: 'Goodnight Irene',             artist: 'Gordon Jenkins',         genre: 'Pop',        deezerId: 10210628 },
  { year: 1950, rank: 2, title: 'Mona Lisa',                   artist: 'Nat King Cole',          genre: 'Standards',  deezerId: 3095162 },
  { year: 1950, rank: 3, title: 'Third Man Theme',             artist: 'Anton Karas',            genre: 'Pop',        deezerId: 1248863272 },

  // ── 1951 ──────────────────────────────────────────────────────────────────
  { year: 1951, rank: 1, title: 'Too Young',                   artist: 'Nat King Cole',          genre: 'Standards',  deezerId: 3240269 },
  { year: 1951, rank: 2, title: 'Come On-a My House',          artist: 'Rosemary Clooney',       genre: 'Pop',        deezerId: 586332 },
  { year: 1951, rank: 3, title: 'How High the Moon',           artist: 'Les Paul & Mary Ford',   genre: 'Jazz',       deezerId: 3532589 },

  // ── 1952 ──────────────────────────────────────────────────────────────────
  { year: 1952, rank: 1, title: 'Blue Tango',                  artist: 'Leroy Anderson',         genre: 'Pop',        deezerId: 407134662 },
  { year: 1952, rank: 2, title: 'Wheel of Fortune',            artist: 'Kay Starr',              genre: 'Pop',        deezerId: 3109533 },
  { year: 1952, rank: 3, title: 'Cry',                         artist: 'Johnnie Ray',            genre: 'Pop',        deezerId: 1068564 },

  // ── 1953 ──────────────────────────────────────────────────────────────────
  { year: 1953, rank: 1, title: 'Vaya Con Dios',               artist: 'Les Paul & Mary Ford',   genre: 'Pop',        deezerId: 2457538675 },
  { year: 1953, rank: 2, title: 'Song from Moulin Rouge (Where Is Your Heart)', artist: 'Percy Faith', genre: 'Standards' },
  { year: 1953, rank: 3, title: 'You, You, You',               artist: 'The Ames Brothers',      genre: 'Pop' },

  // ── 1954 ──────────────────────────────────────────────────────────────────
  { year: 1954, rank: 1, title: 'Little Things Mean a Lot',    artist: 'Kitty Kallen',           genre: 'Pop',        deezerId: 1555561892 },
  { year: 1954, rank: 2, title: 'Three Coins in the Fountain', artist: 'The Four Aces',          genre: 'Standards',  deezerId: 111305392 },
  { year: 1954, rank: 3, title: 'Sh-Boom (Life Could Be a Dream)', artist: 'The Crew-Cuts',     genre: 'RnB',        deezerId: 124916200 },

  // ── 1955 ──────────────────────────────────────────────────────────────────
  { year: 1955, rank: 1, title: 'Rock Around the Clock',       artist: 'Bill Haley & His Comets', genre: 'Rock',      deezerId: 602444242 },
  { year: 1955, rank: 2, title: 'Cherry Pink and Apple Blossom White', artist: 'Pérez Prado',   genre: 'Pop',        deezerId: 11859302 },
  { year: 1955, rank: 3, title: 'Sixteen Tons',                artist: 'Tennessee Ernie Ford',   genre: 'Country',    deezerId: 438849982 },

  // ── 1956 ──────────────────────────────────────────────────────────────────
  { year: 1956, rank: 1, title: 'Heartbreak Hotel',            artist: 'Elvis Presley',          genre: 'Rock',       deezerId: 7675085 },
  { year: 1956, rank: 2, title: "Don't Be Cruel",              artist: 'Elvis Presley',          genre: 'Rock',       deezerId: 7675086 },
  { year: 1956, rank: 3, title: 'Hound Dog',                   artist: 'Elvis Presley',          genre: 'Rock',       deezerId: 17479889 },

  // ── 1957 ──────────────────────────────────────────────────────────────────
  { year: 1957, rank: 1, title: 'All Shook Up',                artist: 'Elvis Presley',          genre: 'Rock',       deezerId: 13210872 },
  { year: 1957, rank: 2, title: 'Jailhouse Rock',              artist: 'Elvis Presley',          genre: 'Rock',       deezerId: 1045565 },
  { year: 1957, rank: 3, title: 'Bye Bye Love',                artist: 'Everly Brothers',        genre: 'Rock',       deezerId: 691212 },
]

export function getSongsForYear(year: number): PreBillboardSong[] {
  return preBillboardData.filter(s => s.year === year)
}

export const PRE_BILLBOARD_YEARS = [...new Set(preBillboardData.map(s => s.year))].sort()