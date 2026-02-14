# Sentrial-Inspired UI Redesign — Design Document

**Date**: 2026-02-15
**Approach**: CSS-First Token Swap (Approach A)
**Scope**: Full dashboard + sidebar at `/home/[account]`

## Decisions

- **Dark-only** theme (no light mode toggle)
- **Adopt Sentrial fonts**: Space Grotesk, Playfair Display, JetBrains Mono
- **CSS variable swap** — minimal structural changes, maximum visual impact

## 1. Design Tokens

Replace all light/dark CSS vars in `shadcn-ui.css` with single dark theme:

```css
:root {
  --background: 0 0% 0%;           /* #000000 */
  --card: 220 24% 6%;              /* #0C0E13 */
  --sidebar: 220 24% 6%;           /* #0C0E13 */
  --popover: 220 24% 6%;
  --muted: 60 1% 12%;              /* #1E1E1F */
  --secondary: 60 1% 12%;

  --foreground: 0 0% 94%;          /* #F0F0F0 */
  --card-foreground: 0 0% 94%;
  --muted-foreground: 0 0% 55%;    /* #8C8C8C */
  --secondary-foreground: 0 0% 94%;

  --primary: 210 10% 65%;          /* Steel */
  --primary-foreground: 0 0% 100%;
  --accent: 210 10% 65%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 63% 45%;        /* #F87171 */

  --border: 240 2% 12%;            /* #1E1E1F */
  --input: 60 1% 12%;
  --ring: 210 10% 65%;
  --sidebar-border: 240 2% 12%;

  --radius: 0.375rem;              /* 6px */

  /* Sentrial accent extras */
  --accent-green: #34C78E;
  --accent-red: #F87171;
  --accent-orange: #F97316;
  --accent-blue: #60A5FA;
}
```

Remove `.dark` class and dark media query entirely.

## 2. Typography

**Fonts** (Google Fonts or next/font):
- Space Grotesk (300-700) — product UI
- Playfair Display (400-700, italic) — marketing/display
- JetBrains Mono (400-500) — code

**Tailwind config**:
```ts
fontFamily: {
  sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
  display: ['Playfair Display', 'Georgia', 'serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
}
```

**Scale**: Page headers 14px/500, section labels 11px/600 uppercase, metrics 36px/600, card titles 14px/600, nav 13px/400, table headers 10px/600 uppercase, cells 11px/400.

## 3. Sidebar

- Width: 180px expanded / 44px collapsed
- Background: `#0C0E13`, border-right `#1E1E1F`
- Nav items: 13px, `rgba(255,255,255,0.8)`, 4px radius
- Active: `rgba(157,166,175,0.12)` bg, white text
- Hover: `rgba(157,166,175,0.08)` bg
- Section labels: 11px semibold uppercase `#8C8C8C` tracking-wide
- Icons: 16px, 0.7 opacity default, 1.0 active
- 150ms ease transitions on all interactive elements

## 4. Dashboard

**Stat cards** (4-column grid):
- `#0C0E13` bg, 1px `#1E1E1F` border, 8px radius, 20px padding
- Title: 14px/600 `#F0F0F0`
- Subtitle: 14px/400 `#8C8C8C`
- Metric: 36px/600 `#F0F0F0`
- Flat dark style — remove colored gradient backgrounds

**Activity chart**:
- Recharts area chart stays
- Colors: green (#34C78E) pass, red (#F87171) block, steel for flag
- Dark grid, dark axis text

**Agent health grid**: Dark tiles, green (#34C78E) confidence bars

**Alert summary**: Red/orange/yellow/gray pills using Sentrial accent values

## 5. Shared Components

- **Buttons**: Ghost with 1px `#1E1E1F` border, 6px radius, 12px/500 text, hover `rgba(255,255,255,0.05)`
- **Filter pills**: 11px/500, 3px radius, active `#1F1F1E` bg
- **Search**: Transparent bg, `#1E1E1F` border, steel focus ring
- **Tables**: 10px uppercase headers, 11px cells, `#1E1E1F` borders, `rgba(255,255,255,0.02)` hover

## Files to Modify

| File | Changes |
|------|---------|
| `apps/web/styles/shadcn-ui.css` | Replace all CSS variables with Sentrial tokens |
| `apps/web/styles/theme.css` | Remove dark mode variants, update animations |
| `apps/web/styles/globals.css` | Add Google Font imports |
| `apps/web/app/layout.tsx` | Remove dark mode class logic, force dark |
| `apps/web/app/home/[account]/_components/team-account-layout-sidebar.tsx` | Sidebar styling |
| `apps/web/app/home/[account]/_components/team-account-layout-sidebar-navigation.tsx` | Nav item classes |
| `apps/web/app/home/[account]/page.tsx` | Dashboard stat cards |
| `apps/web/app/home/[account]/_components/homepage-charts.tsx` | Chart colors |
| Tailwind config (if separate file exists, or CSS layer) | Font families, extended colors |

## Reference

Source: `docs/Sentrial_UI_Design_System.html` — extracted from sentrial.com Feb 14, 2026.
