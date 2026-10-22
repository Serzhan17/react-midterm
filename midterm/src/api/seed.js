// Deterministic generator: always produces the same 120 players on first launch.
const FIRST = [
  'Aibek', 'Nurlan', 'Dias', 'Yerzhan', 'Arman', 'Timur', 'Daniyar', 'Askar',
  'Marat', 'Ruslan', 'Alikhan', 'Bauyrzhan', 'Luca', 'Mateo', 'Jonas', 'Felix',
  'Rafael', 'Andrei', 'Pavel', 'Viktor', 'Emil', 'Carlos', 'Omar', 'Ivan',
  'Sergio', 'Hugo', 'Leon', 'Kamil',
];
const LAST = [
  'Abenov', 'Serikov', 'Zhaksylykov', 'Kenzhebek', 'Tursynov', 'Mukhametov',
  'Orazov', 'Kasymov', 'Bekov', 'Sadykov', 'Rossi', 'Moreau', 'Keller',
  'Santos', 'Novak', 'Petrov', 'Lindgren', 'Duarte', 'Haddad', 'Volkov',
  'Fischer', 'Costa', 'Marin', 'Sokolov', 'Almeida', 'Nowak', 'Ivanov', 'Torres',
];
export const CLUBS = [
  'Almaty Falcons', 'Astana Wolves', 'Shymkent Eagles', 'Aktobe Bears',
  'Karaganda Miners', 'Atyrau Oilers', 'Taraz Lions', 'Pavlodar Storm',
  'Turkistan Knights', 'Kostanay Stallions', 'Oral Hawks', 'Aktau Seals',
];
const NATIONS = [
  'Kazakhstan', 'Kazakhstan', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan',
  'Brazil', 'Spain', 'Serbia', 'Portugal', 'Germany', 'Nigeria', 'Poland',
];
const POS = ['GK', 'DF', 'DF', 'MF', 'MF', 'FW'];

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generatePlayers(count = 120) {
  const rnd = mulberry32(2026);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const used = new Set();
  const players = [];

  while (players.length < count) {
    const name = `${pick(FIRST)} ${pick(LAST)}`;
    if (used.has(name)) continue;
    used.add(name);

    const position = pick(POS);
    const age = 17 + Math.floor(rnd() * 21);
    const rating = Math.round(55 + rnd() * 37);
    const matches = Math.max(3, Math.round((age - 16) * (6 + rnd() * 10)));
    const goalRate = { GK: 0, DF: 0.04, MF: 0.12, FW: 0.4 }[position];
    const assistRate = { GK: 0.01, DF: 0.06, MF: 0.18, FW: 0.2 }[position];
    const ageFactor = age < 24 ? 1.4 : age > 31 ? 0.6 : 1;

    players.push({
      id: players.length + 1,
      name,
      age,
      position,
      club: pick(CLUBS),
      nationality: pick(NATIONS),
      foot: rnd() < 0.75 ? 'Right' : 'Left',
      rating,
      marketValue: Math.round(((rating - 50) ** 2) * 8 * ageFactor),
      matches,
      goals: Math.round(matches * goalRate * (0.6 + rnd() * 0.8)),
      assists: Math.round(matches * assistRate * (0.6 + rnd() * 0.8)),
      shortlisted: false,
    });
  }
  return players;
}
