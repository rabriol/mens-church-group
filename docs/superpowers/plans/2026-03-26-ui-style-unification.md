# UI Style Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle music-rehearsal to share the same visual language as church-calendar by adding a Vite + Tailwind CSS build pipeline and rewriting styles.

**Architecture:** Add Vite + Tailwind v3 + PostCSS (identical to church-calendar's toolchain). JS logic in `app.js` is preserved as `src/main.js` with only a CSS import added at the top. All styling moves from custom CSS variables to Tailwind utility classes — static HTML elements get utility classes directly; dynamic JS-generated elements use `@apply` in `src/style.css`.

**Tech Stack:** Vite 7, Tailwind CSS 3.4, PostCSS 8, Autoprefixer — all matching church-calendar's versions.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `package.json` | Vite + Tailwind dev dependencies |
| Create | `vite.config.js` | Vite config (no plugins needed — vanilla JS) |
| Create | `tailwind.config.js` | Content paths for class scanning |
| Create | `postcss.config.js` | Tailwind + Autoprefixer |
| Create | `src/style.css` | `@tailwind` directives + `@apply` rules for JS-generated classes |
| Create | `src/main.js` | Copy of `app.js` + `import './style.css'` at top |
| Modify | `index.html` | Tailwind classes on static elements; Vite script reference |
| Delete | `style.css` | Replaced by `src/style.css` |
| Delete | `app.js` | Replaced by `src/main.js` |

---

## Task 1: Create feature branch

**Files:** none

- [ ] **Step 1: Create and switch to feature branch**

```bash
git checkout -b feat/ui-style-unification
```

Expected output: `Switched to a new branch 'feat/ui-style-unification'`

---

## Task 2: Add build toolchain config files

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "music-rehearsal",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.22",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.18",
    "vite": "^7.2.4"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/music-rehearsal/',
})
```

- [ ] **Step 3: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 4: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, `package-lock.json` created. No errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.js tailwind.config.js postcss.config.js
git commit -m "feat: add vite + tailwind build pipeline"
```

---

## Task 3: Create `src/style.css`

**Files:**
- Create: `src/style.css`

- [ ] **Step 1: Create `src/` directory and `src/style.css`**

Full content of `src/style.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS variable kept for inline style in renderSongList (no-results message) */
:root {
  --text-muted: #9ca3af;
}

/* ── Song card (JS adds/removes .is-open) ── */
.song-card {
  @apply bg-white border border-gray-100 rounded overflow-hidden;
}
.song-card:hover:not(.is-open) {
  @apply bg-gray-50;
}
.song-card.is-open {
  @apply border-blue-200 shadow-sm;
}

/* ── Card toggle button ── */
.song-toggle {
  @apply w-full bg-transparent border-0 px-4 py-3 flex justify-between items-center text-left cursor-pointer;
}
.song-card.is-open .song-toggle {
  @apply bg-blue-50;
}
.song-toggle-left {
  @apply flex items-center gap-2;
}
.song-icon {
  @apply text-base text-gray-400;
}
.song-title {
  @apply text-sm font-medium text-gray-700 block;
}
.song-meta {
  @apply text-xs text-gray-400 block mt-0.5;
}
.song-chevron {
  @apply text-gray-400 text-xl font-light leading-none transition-transform duration-200;
}
.song-card.is-open .song-chevron {
  @apply rotate-45;
}

/* ── Expanded body ── */
.song-body {
  @apply px-4 pb-4;
}

/* ── Section labels ── */
.section-label {
  @apply text-xs font-medium uppercase tracking-wider text-gray-500 mb-2;
}
.scores-section {
  @apply mb-4;
}
.score-chips {
  @apply flex gap-2 flex-wrap;
}
.score-chip {
  @apply inline-flex items-center px-3 py-1 rounded text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors;
}

/* ── Voice kit ── */
.voice-buttons {
  @apply grid grid-cols-2 gap-2 mb-3;
}
.voice-btn {
  @apply px-3 py-2 text-xs rounded border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center gap-1.5 cursor-pointer font-sans;
}
.voice-btn.is-active {
  @apply bg-blue-600 text-white border-blue-600 font-medium;
}
.voice-btn.is-active:hover {
  @apply bg-blue-700;
}

/* ── YouTube player ── */
.player-container {
  @apply hidden rounded overflow-hidden bg-black;
  aspect-ratio: 16 / 9;
}
.player-container.is-visible {
  @apply block;
}
.player-container iframe {
  @apply w-full h-full block;
  border: none;
}

/* ── Error message ── */
.error-message {
  @apply max-w-2xl mx-auto my-5 p-4 bg-yellow-50 border border-yellow-200 rounded text-center text-sm text-yellow-800;
}
```

- [ ] **Step 2: Verify the file was created**

```bash
ls src/
```

Expected: `style.css`

---

## Task 4: Create `src/main.js`

**Files:**
- Create: `src/main.js`

- [ ] **Step 1: Create `src/main.js`**

Copy `app.js` content exactly, adding only one `import` line at the very top:

```js
import './style.css';

// ── Configuração do Google Sheets ─────────────────────────────
// Substitua pelo ID da sua planilha (compartilhada como "qualquer pessoa com o link")
const SHEET_ID = '1K9IXxplxKbjXlGNGjSZKtUzMP-Jj5GJqUE7FGXe9z-k';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

// ── Estado global ──────────────────────────────────────────────
let currentOpenId = null; // ID da música atualmente expandida

const VOICE_LABELS = {
  tenor1:   '1º Tenor',
  tenor2:   '2º Tenor',
  baritone: 'Barítono',
  bass:     'Baixo',
};

// ── Entry point ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadSongs();

  document.getElementById('search-input')
    .addEventListener('input', (e) => filterSongs(e.target.value.trim()));
});

// ── Carregamento de dados ──────────────────────────────────────
async function loadSongs() {
  try {
    const res = await fetch(SHEET_CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();
    const songs = parseSheetCSV(csv);
    renderSongList(songs);
    storeSongs(songs);
  } catch (err) {
    console.error('Falha ao carregar planilha:', err);
    showError();
  }
}

// ── Parser CSV do Google Sheets ────────────────────────────────
function parseSheetCSV(csv) {
  const lines = csv.split('\n').filter(l => l.trim() !== '');
  if (lines.length < 2) return [];

  const headers = parseCSVRow(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i]);
    if (values.every(v => v.trim() === '')) continue; // pula linha vazia
    const row = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] ?? '').trim(); });
    rows.push(row);
  }

  return rows.map(rowToSong).filter(s => s.title !== '');
}

function parseCSVRow(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

function rowToSong(row) {
  const labels = (row.scores_labels ?? '').split('|').map(s => s.trim()).filter(Boolean);
  const urls   = (row.scores_urls   ?? '').split('|').map(s => s.trim()).filter(Boolean);
  const scores = labels.map((label, i) => ({ label, url: urls[i] ?? '' }))
                       .filter(s => s.url !== '');

  const voiceKits = {};
  if (row.tenor1)   voiceKits.tenor1   = extractYouTubeId(row.tenor1);
  if (row.tenor2)   voiceKits.tenor2   = extractYouTubeId(row.tenor2);
  if (row.baritone) voiceKits.baritone = extractYouTubeId(row.baritone);
  if (row.bass)     voiceKits.bass     = extractYouTubeId(row.bass);

  return {
    id:        slugify(row.title ?? ''),
    title:     row.title ?? '',
    scores,
    voiceKits,
  };
}

function extractYouTubeId(value) {
  try {
    const url = new URL(value);
    // youtube.com/watch?v=ID
    if (url.searchParams.get('v')) return url.searchParams.get('v');
    // youtu.be/ID
    if (url.hostname === 'youtu.be') return url.pathname.slice(1);
    // youtube.com/embed/ID
    const embedMatch = url.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
  } catch {
    // não é URL — assume que já é o ID
  }
  return value;
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function storeSongs(songs) {
  // Armazena no DOM para filtragem sem novo fetch
  document.getElementById('song-list').dataset.songs = JSON.stringify(songs);
}

function showError() {
  document.getElementById('error-message').hidden = false;
}

// ── Renderização da lista ──────────────────────────────────────
function renderSongList(songs) {
  const list = document.getElementById('song-list');
  list.innerHTML = '';

  if (songs.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:24px">Nenhuma música encontrada.</p>';
    return;
  }

  songs.forEach(song => list.appendChild(createSongCard(song)));
}

function createSongCard(song) {
  const scoreCount = song.scores?.length ?? 0;
  const kitCount   = Object.keys(song.voiceKits ?? {}).length;
  const metaParts  = [];
  if (scoreCount > 0) metaParts.push(`${scoreCount} partitura${scoreCount > 1 ? 's' : ''}`);
  if (kitCount   > 0) metaParts.push(`${kitCount} kit${kitCount > 1 ? 's' : ''} de voz`);

  const card = document.createElement('div');
  card.className = 'song-card';
  card.id = `song-${song.id}`;
  card.setAttribute('role', 'listitem');
  card.dataset.title = song.title.toLowerCase();

  card.innerHTML = `
    <button class="song-toggle" aria-expanded="false" aria-controls="body-${song.id}">
      <span class="song-toggle-left">
        <span class="song-icon">🎵</span>
        <span>
          <span class="song-title">${escapeHtml(song.title)}</span>
          <span class="song-meta">${metaParts.join(' · ') || 'Sem conteúdo'}</span>
        </span>
      </span>
      <span class="song-chevron" aria-hidden="true">+</span>
    </button>
    <div class="song-body" id="body-${song.id}" hidden>
      ${renderScores(song.scores)}
      ${renderVoiceKit(song.id, song.voiceKits)}
    </div>
  `;

  card.querySelector('.song-toggle')
      .addEventListener('click', () => toggleAccordion(song.id));

  return card;
}

function renderScores(scores) {
  if (!scores || scores.length === 0) return '';
  const chips = scores.map(s =>
    `<a class="score-chip" href="${escapeAttr(s.url)}" target="_blank" rel="noopener">📄 ${escapeHtml(s.label)}</a>`
  ).join('');
  return `
    <div class="scores-section">
      <div class="section-label">Partituras</div>
      <div class="score-chips">${chips}</div>
    </div>
  `;
}

function renderVoiceKit(songId, voiceKits) {
  if (!voiceKits || Object.keys(voiceKits).length === 0) return '';
  const buttons = Object.entries(voiceKits).map(([key, videoId]) =>
    `<button class="voice-btn" data-song="${escapeAttr(songId)}" data-voice="${escapeAttr(key)}" data-video="${escapeAttr(videoId)}">
      ▶ ${VOICE_LABELS[key] ?? key}
    </button>`
  ).join('');
  return `
    <div class="voice-kit-section">
      <div class="section-label">Kit de Voz</div>
      <div class="voice-buttons">${buttons}</div>
      <div class="player-container" id="player-${escapeAttr(songId)}"></div>
    </div>
  `;
}

// ── Utilitários de escape ──────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}

// ── Accordion ─────────────────────────────────────────────────
function toggleAccordion(songId) {
  const isAlreadyOpen = currentOpenId === songId;

  // Fechar card atual (se houver)
  if (currentOpenId !== null) {
    closeCard(currentOpenId);
  }

  // Abrir o novo, se era diferente
  if (!isAlreadyOpen) {
    openCard(songId);
    currentOpenId = songId;
  } else {
    currentOpenId = null;
  }
}

function openCard(songId) {
  const card = document.getElementById(`song-${songId}`);
  if (!card) return;
  const body   = document.getElementById(`body-${songId}`);
  const toggle = card.querySelector('.song-toggle');

  card.classList.add('is-open');
  body.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');

  // Delegação: cliques nos botões de voz
  body.addEventListener('click', handleVoiceClick);
}

function closeCard(songId) {
  const card   = document.getElementById(`song-${songId}`);
  const body   = document.getElementById(`body-${songId}`);
  const toggle = card?.querySelector('.song-toggle');
  if (!card) return;

  card.classList.remove('is-open');
  body.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');

  // Destruir player para parar o vídeo
  destroyPlayer(songId);

  // Remover listener de voz
  body.removeEventListener('click', handleVoiceClick);
}

// ── Player de Kit de Voz ───────────────────────────────────────
function handleVoiceClick(e) {
  const btn = e.target.closest('.voice-btn');
  if (!btn) return;

  const songId  = btn.dataset.song;
  const videoId = btn.dataset.video;

  // Atualizar botão ativo
  const allButtons = document.querySelectorAll(`#body-${songId} .voice-btn`);
  allButtons.forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');

  loadPlayer(songId, videoId);
}

function loadPlayer(songId, videoId) {
  const container = document.getElementById(`player-${songId}`);
  if (!container) return;

  container.classList.add('is-visible');
  container.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${escapeAttr(videoId)}?rel=0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
}

function destroyPlayer(songId) {
  const container = document.getElementById(`player-${songId}`);
  if (!container) return;
  container.classList.remove('is-visible');
  container.innerHTML = '';

  // Remover estado ativo dos botões de voz
  document.querySelectorAll(`#body-${songId} .voice-btn`)
    .forEach(b => b.classList.remove('is-active'));
}

// ── Filtro de busca ────────────────────────────────────────────
function filterSongs(query) {
  const raw = document.getElementById('song-list').dataset.songs;
  if (!raw) return;

  const songs = JSON.parse(raw);
  const lower = query.toLowerCase();
  const filtered = lower
    ? songs.filter(s => s.title.toLowerCase().includes(lower))
    : songs;

  // Fechar qualquer card aberto antes de re-renderizar
  if (currentOpenId !== null) {
    closeCard(currentOpenId);
    currentOpenId = null;
  }

  renderSongList(filtered);
}
```

Note: the only difference from `app.js` is:
1. `import './style.css';` added at line 1
2. Emoji removed from section labels in `renderScores` and `renderVoiceKit` (label strings `"📄 Partituras"` → `"Partituras"`, `"🎧 Kit de Voz"` → `"Kit de Voz"`)

- [ ] **Step 2: Verify src/ structure**

```bash
ls src/
```

Expected: `main.js  style.css`

---

## Task 5: Rewrite `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace `index.html` with new content**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conjunto Masculino — Repertório</title>
</head>
<body class="bg-white text-gray-700 min-h-screen">

  <header class="sticky top-0 z-10 bg-white border-b border-gray-200">
    <div class="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
      <span class="text-2xl">🎼</span>
      <div>
        <h1 class="text-xl font-normal text-gray-700">Conjunto Masculino</h1>
        <p class="text-xs text-gray-500 mt-0.5">Repertório de Ensaio</p>
      </div>
    </div>
  </header>

  <div class="bg-gray-50 border-b border-gray-200 px-4 py-3">
    <input
      type="search"
      id="search-input"
      class="w-full max-w-2xl block mx-auto bg-white border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
      placeholder="Buscar música..."
      aria-label="Buscar música"
    >
  </div>

  <main class="px-4 py-3">
    <div id="song-list" class="max-w-2xl mx-auto space-y-2" role="list">
      <!-- preenchido por main.js -->
    </div>

    <div id="error-message" class="error-message" hidden>
      <p>Não foi possível carregar o repertório. Tente novamente.</p>
    </div>
  </main>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

---

## Task 6: Delete old files

**Files:**
- Delete: `style.css`
- Delete: `app.js`

- [ ] **Step 1: Delete old files**

```bash
rm style.css app.js
```

---

## Task 7: Verify the build works

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

Expected: Vite starts on `http://localhost:5173` (or similar). No errors in terminal.

- [ ] **Step 2: Open in browser and verify**

Open `http://localhost:5173` in a browser and check:
- Header is white with gray border (not dark brown)
- Song cards are white with light gray borders
- Open card shows blue border and blue-tinted header
- Voice buttons turn blue when active
- Search bar is clean gray-on-white style
- YouTube player shows in 16:9 ratio when voice button clicked
- No brown/tan colors anywhere

- [ ] **Step 3: Stop dev server**

Press `Ctrl+C` in the terminal.

- [ ] **Step 4: Run build to verify no compilation errors**

```bash
npm run build
```

Expected: `dist/` created, no errors.

---

## Task 8: Commit final result

- [ ] **Step 1: Stage all changes**

```bash
git add index.html src/main.js src/style.css
git rm style.css app.js
```

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: restyle UI to match church-calendar (Vite + Tailwind)"
```
