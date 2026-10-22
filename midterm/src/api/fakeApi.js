import { generatePlayers, CLUBS } from './seed.js';

// Simulated async API: Promises + delays + JSON + localStorage persistence.
const STORAGE_KEY = 'footscout_players_v1';
const wait = (min = 350, max = 800) =>
  new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted storage: fall through and regenerate
  }
  const initial = generatePlayers(120);
  save(initial);
  return initial;
}

function save(players) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

export async function getClubs() {
  await wait(150, 300);
  return CLUBS;
}

export async function getPlayers({
  search = '',
  position = '',
  club = '',
  shortlistOnly = false,
  sort = 'rating',
  order = 'desc',
  page = 1,
  pageSize = 12,
} = {}) {
  await wait();
  let list = load();

  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter((p) =>
      [p.name, p.club, p.nationality].some((field) => field.toLowerCase().includes(q))
    );
  }
  if (position) list = list.filter((p) => p.position === position);
  if (club) list = list.filter((p) => p.club === club);
  if (shortlistOnly) list = list.filter((p) => p.shortlisted);

  const dir = order === 'asc' ? 1 : -1;
  list = [...list].sort((a, b) => {
    const av = a[sort];
    const bv = b[sort];
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
    return cmp * dir || a.id - b.id;
  });

  const total = list.length;
  const start = (page - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), total };
}

export async function getPlayer(id) {
  await wait(250, 600);
  const player = load().find((p) => p.id === id);
  if (!player) throw new Error(`Player #${id} was not found.`);
  return player;
}

export async function addPlayer(data) {
  await wait(500, 900);
  const players = load();
  if (players.some((p) => p.name.toLowerCase() === data.name.trim().toLowerCase())) {
    throw new Error('A player with this name already exists.');
  }
  const player = {
    id: Math.max(0, ...players.map((p) => p.id)) + 1,
    foot: 'Right',
    matches: 0,
    goals: 0,
    assists: 0,
    shortlisted: false,
    ...data,
    name: data.name.trim(),
    nationality: data.nationality.trim(),
  };
  save([...players, player]);
  return player;
}

export async function toggleShortlist(id) {
  await wait(150, 350);
  const players = load();
  const updated = players.map((p) =>
    p.id === id ? { ...p, shortlisted: !p.shortlisted } : p
  );
  save(updated);
  return updated.find((p) => p.id === id);
}
