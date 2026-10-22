# FootScout — football player scouting board

Midterm project (React SPA). A scout can browse 120 players, search, filter, sort,
open a player profile, add a new player and keep a shortlist.

**Live demo:** _paste your deployed link here_

## Features
- List view (cards + pagination) and detail view (modal profile with stat bars)
- Search (debounced), filters (position, club, shortlist only), sorting (8 options), pagination (12 per page)
- Controlled form for adding a player, with validation
- Shortlist toggle saved through the API
- Loading, error (with retry), empty and success states
- Simulated async API: Promises, random delays, JSON, `localStorage` persistence, 120 generated initial records

## Tech
React 18 + Vite, plain CSS. Only `useState` / `useEffect` (+ `useCallback`, one custom hook `useDebounce`).

## Structure
```
src/
  api/         seed.js (120 players), fakeApi.js (async API on localStorage)
  hooks/       useDebounce.js
  utils/       format.js (labels, formatters)
  components/  PlayersPage (state + data fetching), Filters, SearchBar, SelectField,
               PlayerList, PlayerCard, Avatar, Pagination, Modal, PlayerDetail,
               StatBar, AddPlayerForm, StatusMessage, Header
```

## Run locally
```bash
npm install
npm run dev
```

## Build & deploy
```bash
npm run build   # output in dist/
```
Deploy on Vercel / Netlify (build command `npm run build`, output `dist`) or GitHub Pages.
To reset demo data, clear the `footscout_players_v1` key in the browser's localStorage.
