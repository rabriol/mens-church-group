# Conjunto Masculino — Repertório

Página estática que carrega o repertório de ensaio direto de uma planilha do Google Sheets.

## Configuração inicial

### 1. Criar a planilha

Crie uma planilha no Google Sheets com as seguintes colunas na primeira linha (exatamente assim):

```
title | score_1_label | score_1_url | score_2_label | score_2_url | score_3_label | score_3_url | score_4_label | score_4_url | score_5_label | score_5_url | tenor1 | tenor2 | baritone | bass
```

Cada linha a seguir é uma música. Deixe vazia qualquer célula que não se aplique.

### 2. Publicar a planilha

1. No Google Sheets: **Compartilhar** → **Qualquer pessoa com o link** → **Leitor**
2. Copie o ID da URL: `docs.google.com/spreadsheets/d/**SEU_ID_AQUI**/edit`

### 3. Configurar o ID no código

Abra `app.js` e substitua na linha 2:

```javascript
const SHEET_ID = 'SEU_SHEET_ID_AQUI';
```

---

## Adicionar uma música

Na planilha, adicione uma linha:

| Coluna | Exemplo | Obrigatório? |
|--------|---------|-------------|
| `title` | Ainda Que a Figueira | ✅ |
| `score_1_label` | SATB Completo | — |
| `score_1_url` | https://drive.google.com/file/d/.../view | — |
| `score_2_label` | Vozes Masculinas | — |
| `score_2_url` | https://drive.google.com/file/d/.../view | — |
| *(até score_5)* | | — |
| `tenor1` | dQw4w9WgXcQ | — |
| `tenor2` | dQw4w9WgXcQ | — |
| `baritone` | dQw4w9WgXcQ | — |
| `bass` | dQw4w9WgXcQ | — |

**ID do YouTube:** extraia da URL `youtube.com/watch?v=XXXX` → use `XXXX`.

**Link do Google Drive:** Compartilhe o PDF → copie o link no formato `https://drive.google.com/file/d/ID/view`.

As alterações na planilha aparecem automaticamente na página (sem necessidade de novo deploy).

---

## Hospedagem

Qualquer serviço de arquivos estáticos:

- **Netlify:** arraste a pasta para [app.netlify.com/drop](https://app.netlify.com/drop)
- **GitHub Pages:** habilite nas configurações do repositório
- **Vercel:** `npx vercel`

## Desenvolvimento local

```bash
npx serve . -p 3000
```
