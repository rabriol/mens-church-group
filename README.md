# Conjunto Masculino — Repertório

Página estática que carrega o repertório de ensaio direto de uma planilha do Google Sheets.

## Configuração inicial

### 1. Criar a planilha

Crie uma planilha no Google Sheets com as seguintes colunas na primeira linha (exatamente assim):

```
title | scores_urls | scores_es_urls | scores_en_urls | tenor1 | tenor2 | baritone | bass
```

`scores_urls` são as partituras em português. Para espanhol e inglês, use `scores_es_urls` e `scores_en_urls`. Use `|` como separador para múltiplas URLs no mesmo idioma. Todas as partituras são exibidas como "PDF". Preencha apenas os idiomas disponíveis — quando há mais de um idioma, cada chip mostra a bandeira correspondente.

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
| `title` | Ainda Que a Figueira | Sim |
| `scores_urls` | https://drive.google.com/.../view | — |
| `scores_es_urls` | https://drive.google.com/.../view | — |
| `scores_en_urls` | https://drive.google.com/.../view | — |
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
