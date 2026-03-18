# Conjunto Masculino — Repertório

Página estática para organizar músicas de ensaio.

## Adicionar uma música

Edite `songs.json` e adicione um objeto seguindo o modelo:

```json
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
```

**Campos opcionais:** `scores` pode ser `[]` e qualquer naipe de `voiceKits` pode ser omitido.

**ID do YouTube:** extraia da URL `youtube.com/watch?v=XXXX` → use `XXXX`.

## Hospedagem

Faça deploy de qualquer forma que sirva arquivos estáticos:

- **Netlify:** arraste a pasta para [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages:** habilite nas configurações do repositório
- **Vercel:** `npx vercel`

## Desenvolvimento local

```bash
npx serve . -p 3000
```
