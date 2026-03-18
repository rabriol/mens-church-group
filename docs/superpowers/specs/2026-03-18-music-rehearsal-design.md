# Music Rehearsal — Design Spec

**Date:** 2026-03-18
**Status:** Approved

---

## Overview

Página web para organizar o repertório de ensaio do Conjunto Masculino da igreja. Cada música possui partituras (PDFs via links externos) e Kits de Voz (vídeos do YouTube) para cada naipe: 1º Tenor, 2º Tenor, Barítono e Baixo.

---

## Goals

- Centralizar partituras e kits de voz em um lugar acessível online
- Interface simples para membros do conjunto acessarem no celular ou desktop
- Fácil manutenção pelo responsável via edição de arquivo JSON

---

## Architecture

**Stack:** HTML + CSS + JavaScript puro (sem frameworks, sem backend)
**Dados:** `songs.json` — arquivo estático com lista de músicas, links de PDFs e IDs de vídeo do YouTube
**Hospedagem:** Qualquer serviço de hosting estático (Netlify, GitHub Pages, Vercel)

```
music-rehearsal/
├── index.html        # Página principal
├── style.css         # Estilos
├── app.js            # Lógica da aplicação
├── songs.json        # Dados das músicas (editado pelo responsável)
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-03-18-music-rehearsal-design.md
```

### songs.json — estrutura

```json
[
  {
    "id": "ainda-que-a-figueira",
    "title": "Ainda Que a Figueira",
    "scores": [
      { "label": "SATB Completo", "url": "https://drive.google.com/..." },
      { "label": "Vozes Masculinas", "url": "https://drive.google.com/..." }
    ],
    "voiceKits": {
      "tenor1": "youtube-video-id",
      "tenor2": "youtube-video-id",
      "baritone": "youtube-video-id",
      "bass": "youtube-video-id"
    }
  }
]
```

Campos de `voiceKits` são opcionais — se um naipe não tiver kit, o botão não aparece.
O campo `id` é usado como chave para o atributo `id` do elemento DOM do card (ex: `song-ainda-que-a-figueira`), permitindo referências únicas no DOM.

---

## UI Design

### Visual Identity

- **Tema:** Claro, inspirado em papel de partitura
- **Cores:** Fundo creme `#f8f5f0`, marrom escuro `#2c1a0e`, tons de marrom médio `#8b6040`
- **Tipografia:** Sans-serif do sistema, limpa e legível

### Layout — Header

Fundo escuro (`#2c1a0e`) com ícone de clave de sol, nome "CONJUNTO MASCULINO" e subtítulo "REPERTÓRIO DE ENSAIO".

### Layout — Busca

Barra de busca logo abaixo do header. Filtra músicas por nome em tempo real (client-side).

### Layout — Lista de Músicas (Accordion)

Cada música é um card colapsável:

**Estado fechado:**
- Nome da música + contagem resumida ("2 partituras · 4 kits de voz")
- Ícone `+` à direita
- Sombra suave, borda leve

**Estado aberto:**
- Borda destacada em dourado `#c8a878`
- Seção **Partituras**: tags/chips clicáveis que abrem o PDF no Google Drive (nova aba)
- Seção **Kit de Voz**: grade 2×2 com botões para cada naipe (1º Tenor, 2º Tenor, Barítono, Baixo)
- Player do YouTube embutido abaixo dos botões, carregado ao clicar no naipe

### Kit de Voz — Interação

- Ao clicar num botão de naipe, o player do YouTube aparece abaixo com o vídeo correspondente
- O botão ativo fica visualmente destacado (fundo escuro)
- Se outro naipe for clicado, o player troca o vídeo
- O iframe do YouTube só é injetado quando o usuário interage (lazy load) para não sobrecarregar a página

### Accordion — Comportamento

- Apenas uma música pode estar expandida por vez (fechar a anterior ao abrir outra)
- O controle de qual card está aberto é mantido por uma variável de estado (`currentOpenId`) em `app.js`
- Ao fechar uma música, o player do YouTube é destruído para parar o vídeo automaticamente
- Se o usuário expandir um card sem clicar em nenhum botão de voz e depois fechar, nenhum iframe é criado

---

## Data Flow

```
songs.json
    └── fetch() no carregamento da página
        └── renderSongList()
            └── Para cada música: cria card accordion
                └── Ao clicar no card: toggleAccordion()
                    ├── Renderiza chips de PDF
                    ├── Renderiza botões de voz
                    └── Ao clicar em botão de voz: loadYouTubePlayer(videoId)
                        └── Injeta <iframe> com embed do YouTube
```

---

## Error Handling

- Se `songs.json` falhar ao carregar: exibir mensagem de erro centralizada no lugar da lista de músicas (ex: "Não foi possível carregar o repertório. Tente novamente.")
- Se um campo de `voiceKits` estiver ausente ou nulo: não renderizar o botão correspondente
- Se `scores` estiver vazio ou ausente: não renderizar a seção de partituras

---

## Responsividade

- Mobile-first: página deve funcionar bem em celular (tela pequena)
- Grade de botões de voz: 2×2 em mobile, pode expandir em desktop
- Player do YouTube: 16:9, largura 100% do card

---

## Manutenção

Para adicionar uma música, o responsável edita apenas `songs.json`:
1. Adicionar objeto com `id`, `title`, `scores` e `voiceKits`
2. Salvar e fazer deploy (push para o repositório)

Não é necessário editar HTML ou CSS.

---

## Out of Scope

- Autenticação / área administrativa
- Organização por ensaio / data
- Upload de arquivos (PDFs ficam no Google Drive)
- Notificações ou lembretes de ensaio
