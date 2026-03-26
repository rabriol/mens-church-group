# UI Style Unification: Music Rehearsal → Church Calendar

**Date:** 2026-03-26
**Goal:** Restyle music-rehearsal to share the same visual language as church-calendar, making both apps appear as a single unified product.

---

## Context

- **music-rehearsal**: Vanilla HTML/JS, custom CSS, warm earthy browns, compact accordion layout
- **church-calendar**: React + Vite + Tailwind CSS v3, clean whites/cool grays, modern aesthetic
- Both are owned by the same user and should feel like one product

---

## Approach

**Option B: Add Vite + Tailwind build pipeline** to music-rehearsal, matching church-calendar's exact toolchain. The JS logic in `app.js` remains unchanged — only the project structure, CSS, and HTML classes are modified.

---

## Section 1 — Project Structure

```
music-rehearsal/
├── index.html              (Vite entry point — updated with Tailwind classes)
├── package.json            (add: vite, tailwindcss, postcss, autoprefixer)
├── vite.config.js          (same structure as church-calendar)
├── tailwind.config.js      (same structure, adapted for music-rehearsal content)
├── postcss.config.js       (same as church-calendar)
└── src/
    ├── main.js             (app.js renamed — zero logic changes)
    └── style.css           (Tailwind @tailwind directives + accordion/player animation overrides)
```

`index.html` references `src/main.js` and `src/style.css` as Vite module imports.

---

## Section 2 — Visual Design

### Color Palette

| Role | Value | Replaces |
|------|-------|---------|
| Page background | `bg-white` / `bg-gray-50` | `#f8f5f0` warm beige |
| Card background | `bg-white` | `#ffffff` |
| Open card background | `bg-blue-50` | `#fdf6ec` warm beige |
| Header background | `bg-white border-b border-gray-200` | `#2c1a0e` dark brown |
| Primary text | `text-gray-700` | `#2c1a0e` dark brown |
| Secondary text | `text-gray-500` | `#8b6040` medium brown |
| Muted text | `text-gray-400` | `#a09080` light brown |
| Borders (default) | `border-gray-100` / `border-gray-200` | `#e0d8cc` tan |
| Borders (open card) | `border-blue-200` | `#c8a878` golden tan |
| Primary accent | `bg-blue-600` | `#2c1a0e` dark brown |
| Active button | `bg-blue-600 text-white` | dark brown + cream |
| Hover backgrounds | `hover:bg-gray-100` | next-shade brown |

### Typography

| Element | Classes | Replaces |
|---------|---------|---------|
| Header title | `text-xl font-normal text-gray-700` | 15px 700 UPPERCASE |
| Song title | `text-sm font-medium text-gray-700` | 13px 600 weight |
| Song meta (key, bpm) | `text-xs text-gray-500` | 10px muted |
| Section labels | `text-xs font-medium uppercase tracking-wider text-gray-500` | 10px 700 UPPERCASE |
| Score chips / buttons | `text-xs` | 11px |

Font family: Tailwind default system sans-serif (same stack as church-calendar).

### Layout

- Max-width: `max-w-2xl mx-auto` (≈672px)
- Card list spacing: `space-y-2`
- Card inner padding: `p-3` / `px-4 py-3`
- Border radius: `rounded` (4px — Tailwind default)
- Responsive breakpoint: `sm:` at 640px (replaces 480px)

---

## Section 3 — Components

### Header

```
sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3
```
- App name left-aligned: `text-xl font-normal text-gray-700`
- Emoji icon replaced with plain text or inline SVG music note

### Search Bar

```
w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700
placeholder:text-gray-400 focus:outline-none focus:border-gray-300
```
Replaces pill-shaped brown input.

### Song Cards (Accordion)

- **Closed:** `bg-white border border-gray-100 rounded hover:bg-gray-50 transition-colors cursor-pointer`
- **Open:** `bg-white border border-blue-200 rounded shadow-sm`
- **Toggle chevron:** SVG chevron icon with `transition-transform` + `rotate-180` when open (replaces `+` text)
- **Accordion height animation:** kept in `style.css` as custom CSS (`max-height` transition — Tailwind CDN limitation doesn't apply here since we have a build pipeline, but `max-height` transition is cleaner as custom CSS)

### Score Chips (Partituras)

```
inline-flex items-center px-3 py-1 rounded text-xs text-gray-700
bg-gray-100 hover:bg-gray-200 transition-colors
```

### Voice Buttons (Kit de Voz)

- Grid: `grid grid-cols-2 gap-2`
- Default: `px-3 py-2 text-xs rounded border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors`
- Active: `bg-blue-600 text-white border-blue-600 hover:bg-blue-700`

### YouTube Player Container

```
rounded overflow-hidden mt-3 aspect-video
```
Player behavior (show/hide) unchanged — handled by existing JS.

### Section Labels

```
text-xs font-medium uppercase tracking-wider text-gray-500 mb-2
```

---

## Out of Scope

- JS logic changes (accordion, player, Google Sheets fetch)
- Converting to React
- Dark mode
- Any new features

---

## Success Criteria

- Both apps share the same white/gray/blue color palette
- Same Tailwind CSS toolchain (Vite + Tailwind v3 + PostCSS)
- All existing functionality works unchanged
- App is responsive at the `sm:` (640px) breakpoint
- No warm brown colors remain in the UI
