# Music Rehearsal Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Página web estática para organizar músicas de ensaio do Conjunto Masculino, com partituras (links externos) e Kits de Voz (YouTube embeds) por naipe.

**Architecture:** HTML + CSS + JS puros sem dependências externas. Dados em `songs.json` carregado via `fetch()`. Três arquivos de código (`index.html`, `style.css`, `app.js`) com responsabilidades separadas.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), YouTube IFrame API (embed via `<iframe>`)

---

## File Structure

| Arquivo | Responsabilidade |
|---------|-----------------|
| `index.html` | Estrutura HTML: header, busca, container da lista |
| `style.css` | Tema visual (papel/partitura), layout responsivo, accordion, player |
| `app.js` | Lógica: fetch de dados, render da lista, accordion, kit de voz |
| `songs.json` | Dados das músicas: título, PDFs, IDs de vídeo por naipe |
| `.gitignore` | Ignorar `.superpowers/` e arquivos do sistema |

---

## Chunk 1: Estrutura Base

### Task 1: .gitignore e songs.json com dados de exemplo

**Files:**
- Create: `.gitignore`
- Create: `songs.json`

- [ ] **Step 1: Criar `.gitignore`**

```
.superpowers/
.DS_Store
```

- [ ] **Step 2: Criar `songs.json` com duas músicas de exemplo**

```json
[
  {
    "id": "ainda-que-a-figueira",
    "title": "Ainda Que a Figueira",
    "scores": [
      { "label": "SATB Completo", "url": "https://drive.google.com/file/d/EXEMPLO1/view" },
      { "label": "Vozes Masculinas", "url": "https://drive.google.com/file/d/EXEMPLO2/view" }
    ],
    "voiceKits": {
      "tenor1": "dQw4w9WgXcQ",
      "tenor2": "dQw4w9WgXcQ",
      "baritone": "dQw4w9WgXcQ",
      "bass": "dQw4w9WgXcQ"
    }
  },
  {
    "id": "grandes-e-maravilhosas",
    "title": "Grandes e Maravilhosas",
    "scores": [
      { "label": "Partitura Geral", "url": "https://drive.google.com/file/d/EXEMPLO3/view" }
    ],
    "voiceKits": {
      "tenor1": "dQw4w9WgXcQ",
      "baritone": "dQw4w9WgXcQ",
      "bass": "dQw4w9WgXcQ"
    }
  },
  {
    "id": "louvai-ao-senhor",
    "title": "Louvai ao Senhor",
    "scores": [],
    "voiceKits": {
      "tenor1": "dQw4w9WgXcQ",
      "tenor2": "dQw4w9WgXcQ",
      "baritone": "dQw4w9WgXcQ",
      "bass": "dQw4w9WgXcQ"
    }
  }
]
```

- [ ] **Step 3: Verificar JSON é válido**

```bash
node -e "JSON.parse(require('fs').readFileSync('songs.json','utf8')); console.log('OK')"
```

Esperado: `OK`

- [ ] **Step 4: Commit**

```bash
git add .gitignore songs.json
git commit -m "feat: add songs.json with sample data and gitignore"
```

---

### Task 2: index.html — estrutura base

**Files:**
- Create: `index.html`

- [ ] **Step 1: Criar `index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Conjunto Masculino — Repertório</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <header class="site-header">
    <div class="header-inner">
      <span class="header-icon">🎼</span>
      <div class="header-text">
        <h1 class="header-title">Conjunto Masculino</h1>
        <p class="header-subtitle">Repertório de Ensaio</p>
      </div>
    </div>
  </header>

  <main class="main-content">

    <div class="search-bar">
      <input
        type="search"
        id="search-input"
        class="search-input"
        placeholder="🔍 Buscar música..."
        aria-label="Buscar música"
      >
    </div>

    <div id="song-list" class="song-list" role="list">
      <!-- preenchido por app.js -->
    </div>

    <div id="error-message" class="error-message" hidden>
      <p>Não foi possível carregar o repertório. Tente novamente.</p>
    </div>

  </main>

  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verificar o HTML abre no browser sem erros**

Abra `index.html` no browser (File → Open ou `open index.html`).
Esperado: página em branco com apenas o header renderizado (sem erros no console).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add index.html base structure"
```

---

## Chunk 2: Estilos (style.css)

### Task 3: Variáveis, reset, header e busca

**Files:**
- Create: `style.css`

- [ ] **Step 1: Criar `style.css` com reset, variáveis e header**

```css
/* ── Variáveis ── */
:root {
  --bg: #f8f5f0;
  --bg-card: #ffffff;
  --bg-card-open: #fdf6ec;
  --bg-header: #2c1a0e;
  --bg-search: #f0ebe3;
  --border: #e0d8cc;
  --border-open: #c8a878;
  --text-primary: #2c1a0e;
  --text-secondary: #8b6040;
  --text-muted: #a09080;
  --text-header: #f5e6d0;
  --btn-primary-bg: #2c1a0e;
  --btn-primary-text: #f5e6d0;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-card-open: 0 2px 8px rgba(0,0,0,0.10);
  --radius: 8px;
  --radius-pill: 20px;
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  min-height: 100vh;
}
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: inherit; }

/* ── Header ── */
.site-header {
  background: var(--bg-header);
  padding: 18px 20px;
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-inner {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-icon { font-size: 28px; }
.header-title {
  color: var(--text-header);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.header-subtitle {
  color: var(--text-secondary);
  font-size: 11px;
  letter-spacing: 1px;
  margin-top: 2px;
}

/* ── Busca ── */
.search-bar {
  background: var(--bg-search);
  border-bottom: 1px solid var(--border);
  padding: 12px 16px;
}
.search-input {
  width: 100%;
  max-width: 680px;
  display: block;
  margin: 0 auto;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 8px 16px;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s;
}
.search-input:focus { border-color: var(--text-secondary); }
.search-input::placeholder { color: var(--text-muted); }
```

- [ ] **Step 2: Verificar visual do header e busca no browser**

Recarregar `index.html`. Esperado: header marrom escuro com texto creme, barra de busca em creme claro abaixo.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add CSS variables, reset, header and search bar styles"
```

---

### Task 4: Estilos do accordion e conteúdo expandido

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Adicionar estilos da lista e dos cards**

Adicione ao final de `style.css`:

```css
/* ── Lista de músicas ── */
.main-content { padding: 14px 16px; }
.song-list {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Card (fechado) ── */
.song-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.song-card.is-open {
  border: 2px solid var(--border-open);
  box-shadow: var(--shadow-card-open);
}

/* ── Cabeçalho do card (botão) ── */
.song-toggle {
  width: 100%;
  background: none;
  border: none;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  cursor: pointer;
}
.song-card.is-open .song-toggle { background: var(--bg-card-open); }
.song-toggle-left { display: flex; align-items: center; gap: 10px; }
.song-icon { font-size: 16px; color: var(--text-secondary); }
.song-title { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.song-meta { font-size: 10px; color: var(--text-muted); margin-top: 2px; }
.song-chevron {
  color: var(--text-secondary);
  font-size: 20px;
  font-weight: 300;
  line-height: 1;
  transition: transform 0.2s;
}
.song-card.is-open .song-chevron { transform: rotate(45deg); }

/* ── Corpo expandido ── */
.song-body { padding: 14px 16px; display: none; }
.song-card.is-open .song-body { display: block; }

/* ── Seção de partituras ── */
.section-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.scores-section { margin-bottom: 14px; }
.score-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.score-chip {
  background: var(--bg-search);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 11px;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: background 0.15s;
}
.score-chip:hover { background: var(--border); }

/* ── Kit de voz ── */
.voice-kit-section {}
.voice-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}
.voice-btn {
  background: var(--bg-search);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 10px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
  transition: background 0.15s, border-color 0.15s;
}
.voice-btn:hover { background: var(--border); }
.voice-btn.is-active {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border-color: var(--btn-primary-bg);
  font-weight: 600;
}

/* ── Player do YouTube ── */
.player-container {
  display: none;
  border-radius: var(--radius);
  overflow: hidden;
  background: #000;
  aspect-ratio: 16 / 9;
}
.player-container.is-visible { display: block; }
.player-container iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}

/* ── Mensagem de erro ── */
.error-message {
  max-width: 680px;
  margin: 20px auto;
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: var(--radius);
  text-align: center;
  font-size: 13px;
  color: #856404;
}
```

- [ ] **Step 2: Verificar estilos no browser**

Adicione temporariamente ao `index.html` (dentro de `#song-list`) para testar os estilos:

```html
<div class="song-card is-open" role="listitem">
  <button class="song-toggle">
    <span class="song-toggle-left">
      <span class="song-icon">🎵</span>
      <span>
        <span class="song-title">Teste Visual</span>
        <span class="song-meta">2 partituras · 4 kits de voz</span>
      </span>
    </span>
    <span class="song-chevron">+</span>
  </button>
  <div class="song-body">
    <div class="scores-section">
      <div class="section-label">📄 Partituras</div>
      <div class="score-chips">
        <a class="score-chip" href="#">📄 SATB</a>
      </div>
    </div>
    <div class="voice-kit-section">
      <div class="section-label">🎧 Kit de Voz</div>
      <div class="voice-buttons">
        <button class="voice-btn is-active">▶ 1º Tenor</button>
        <button class="voice-btn">▶ 2º Tenor</button>
        <button class="voice-btn">▶ Barítono</button>
        <button class="voice-btn">▶ Baixo</button>
      </div>
      <div class="player-container is-visible">
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>
      </div>
    </div>
  </div>
</div>
```

Esperado: card expandido com visual "papel", botão de voz ativo em marrom escuro, iframe renderizado.

Remova o HTML de teste depois.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add accordion, voice kit and player styles"
```

---

## Chunk 3: Lógica da Aplicação (app.js)

### Task 5: Carregar dados e renderizar lista

**Files:**
- Create: `app.js`

- [ ] **Step 1: Criar `app.js` com carregamento de dados e render da lista**

```javascript
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
    const res = await fetch('songs.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const songs = await res.json();
    renderSongList(songs);
    storeSongs(songs);
  } catch (err) {
    console.error('Falha ao carregar songs.json:', err);
    showError();
  }
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
      <div class="section-label">📄 Partituras</div>
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
      <div class="section-label">🎧 Kit de Voz</div>
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
```

- [ ] **Step 2: Verificar no browser**

Abra `index.html` via servidor local (para o `fetch` funcionar):

```bash
npx serve . -p 3000
# ou: python3 -m http.server 3000
```

Abra `http://localhost:3000`. Esperado: lista com 3 músicas renderizadas, cada uma com nome e contagem correta. Console sem erros.

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat: add data loading and song list render"
```

---

### Task 6: Accordion e player de Kit de Voz

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Adicionar funções de accordion e player ao final de `app.js`**

```javascript
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
  const card   = document.getElementById(`song-${songId}`);
  const body   = document.getElementById(`body-${songId}`);
  const toggle = card.querySelector('.song-toggle');
  if (!card) return;

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
      src="https://www.youtube.com/embed/${escapeAttr(videoId)}?autoplay=1&rel=0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

- [ ] **Step 2: Verificar accordion no browser**

Em `http://localhost:3000`:
1. Clicar em uma música → card expande, mostra partituras e botões de voz
2. Clicar em outro → o primeiro fecha, o segundo abre
3. Clicar no mesmo aberto → fecha sem abrir outro

Esperado: comportamento correto em todos os casos, sem erros no console.

- [ ] **Step 3: Verificar player no browser**

1. Expandir uma música
2. Clicar em "1º Tenor" → player aparece, vídeo começa a tocar, botão fica destacado
3. Clicar em "Barítono" → player troca de vídeo, botão ativo muda
4. Fechar o card → vídeo para, player some

Esperado: comportamento correto em todos os casos.

- [ ] **Step 4: Verificar busca**

1. Digitar parte do nome de uma música → lista filtra em tempo real
2. Apagar a busca → lista volta completa

- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "feat: add accordion toggle and YouTube voice kit player"
```

---

## Chunk 4: Responsividade e Polimento Final

### Task 7: Ajustes responsivos e mobile

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Adicionar media queries ao final de `style.css`**

```css
/* ── Responsividade ── */
@media (max-width: 480px) {
  .header-title { font-size: 13px; letter-spacing: 1px; }
  .header-icon  { font-size: 22px; }
  .main-content { padding: 10px 10px; }
  .search-bar   { padding: 10px 10px; }
  .voice-buttons { grid-template-columns: 1fr 1fr; gap: 6px; }
  .voice-btn    { font-size: 10px; padding: 7px 8px; }
  .score-chip   { font-size: 10px; padding: 4px 10px; }
}
```

- [ ] **Step 2: Verificar em viewport mobile**

No DevTools do browser, simular iPhone SE (375px). Verificar:
- Header não quebra linha
- Botões de voz cabem na grade 2×2
- Player 16:9 não sai do card

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add responsive styles for mobile"
```

---

### Task 8: Verificação final e README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Testar todos os edge cases**

| Cenário | Esperado |
|---------|----------|
| Música sem partituras (`scores: []`) | Seção de partituras não aparece |
| Música sem kit de voz parcial (ex: sem `tenor2`) | Botão "2º Tenor" não aparece |
| Busca sem resultado | Mensagem "Nenhuma música encontrada." |
| `songs.json` inacessível (renomear temporariamente) | Mensagem de erro amigável |

- [ ] **Step 2: Criar `README.md` com instruções de uso**

```markdown
# Conjunto Masculino — Repertório

Página estática para organizar músicas de ensaio.

## Adicionar uma música

Edite `songs.json` e adicione um objeto seguindo o modelo:

\`\`\`json
{
  "id": "nome-da-musica",
  "title": "Nome da Música",
  "scores": [
    { "label": "Nome da Partitura", "url": "https://drive.google.com/..." }
  ],
  "voiceKits": {
    "tenor1":   "ID_DO_VIDEO_YOUTUBE",
    "tenor2":   "ID_DO_VIDEO_YOUTUBE",
    "baritone": "ID_DO_VIDEO_YOUTUBE",
    "bass":     "ID_DO_VIDEO_YOUTUBE"
  }
}
\`\`\`

**Campos opcionais:** `scores` pode ser `[]` e qualquer naipe de `voiceKits` pode ser omitido.

**ID do YouTube:** extraia da URL `youtube.com/watch?v=XXXX` → use `XXXX`.

## Hospedagem

Faça deploy de qualquer forma que sirva arquivos estáticos:

- **Netlify:** arraste a pasta para [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages:** habilite nas configurações do repositório
- **Vercel:** `npx vercel`

## Desenvolvimento local

\`\`\`bash
npx serve . -p 3000
\`\`\`
```

- [ ] **Step 3: Commit final**

```bash
git add README.md
git commit -m "docs: add README with usage instructions"
```
