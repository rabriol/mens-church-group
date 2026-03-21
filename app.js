// ── Configuração do Google Sheets ─────────────────────────────
// Substitua pelo ID da sua planilha (compartilhada como "qualquer pessoa com o link")
const SHEET_ID = 'SEU_SHEET_ID_AQUI';
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
  if (row.tenor1)   voiceKits.tenor1   = row.tenor1;
  if (row.tenor2)   voiceKits.tenor2   = row.tenor2;
  if (row.baritone) voiceKits.baritone = row.baritone;
  if (row.bass)     voiceKits.bass     = row.bass;

  return {
    id:        slugify(row.title ?? ''),
    title:     row.title ?? '',
    scores,
    voiceKits,
  };
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
