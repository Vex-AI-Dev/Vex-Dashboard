# Sentrial UI Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the dashboard and sidebar to match the Sentrial dark UI design system — dark-only theme, Space Grotesk/Playfair Display fonts, Sentrial exact color tokens, flat dark stat cards, and refined sidebar navigation.

**Architecture:** CSS-first token swap. Replace CSS custom properties in `shadcn-ui.css` with Sentrial values, update font imports via `next/font/google`, restyle dashboard components in `homepage-charts.tsx`, and tune sidebar via CSS overrides. No structural/layout changes needed.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS 4, Shadcn UI, Recharts, next/font/google

**Reference:** `docs/Sentrial_UI_Design_System.html` and `docs/plans/2026-02-15-sentrial-ui-redesign-design.md`

---

### Task 1: Update Font System

**Files:**
- Modify: `apps/web/lib/fonts.ts`
- Modify: `apps/web/styles/shadcn-ui.css` (font vars only)

**Step 1: Replace font imports in `apps/web/lib/fonts.ts`**

Replace the entire file content with:

```typescript
import { Space_Grotesk, Playfair_Display, JetBrains_Mono } from 'next/font/google';

import { cn } from '@kit/ui/utils';

const sans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans-fallback',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
});

const heading = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  fallback: ['Georgia', 'serif'],
  preload: true,
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  fallback: ['Fira Code', 'Cascadia Code', 'monospace'],
  preload: true,
  weight: ['400', '500'],
});

export { sans, heading, mono };

export function getFontsClassName(theme?: string) {
  const font = [sans.variable, heading.variable, mono.variable].reduce<string[]>(
    (acc, curr) => {
      if (acc.includes(curr)) return acc;
      return [...acc, curr];
    },
    [],
  );

  return cn(...font, 'dark');
}
```

Key changes:
- Space Grotesk replaces Inter as the sans font
- Playfair Display added as heading font
- JetBrains Mono added as mono font
- `getFontsClassName` always returns `'dark'` class (dark-only mode)

**Step 2: Update font CSS variables in `apps/web/styles/shadcn-ui.css`**

In the `:root` block, change font variables:

```css
--font-sans: 'Space Grotesk', var(--font-sans-fallback), system-ui, sans-serif;
--font-heading: 'Playfair Display', var(--font-heading), Georgia, serif;
```

**Step 3: Update font theme mappings in `apps/web/styles/theme.css`**

Change the font lines:

```css
--font-sans: 'Space Grotesk', var(--font-sans);
--font-heading: 'Playfair Display', var(--font-heading);
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Step 4: Verify fonts load**

Run: `pnpm --filter web dev`
Expected: Dashboard loads with Space Grotesk body text (geometric sans-serif, distinctly different from Inter)

**Step 5: Commit**

```bash
git add apps/web/lib/fonts.ts apps/web/styles/shadcn-ui.css apps/web/styles/theme.css
git commit -m "feat(ui): replace Inter with Space Grotesk, Playfair Display, JetBrains Mono"
```

---

### Task 2: Replace CSS Design Tokens (Dark-Only Theme)

**Files:**
- Modify: `apps/web/styles/shadcn-ui.css`
- Modify: `apps/web/styles/globals.css`
- Modify: `apps/web/styles/makerkit.css`
- Modify: `apps/web/lib/root-theme.ts`

**Step 1: Replace `apps/web/styles/shadcn-ui.css` entirely**

```css
/*
* shadcn-ui.css
*
* Sentrial-inspired dark-only design tokens.
* Reference: docs/Sentrial_UI_Design_System.html
*/

@layer base {
  :root {
    --font-sans: 'Space Grotesk', var(--font-sans-fallback), system-ui, sans-serif;
    --font-heading: 'Playfair Display', var(--font-heading), Georgia, serif;

    /* Backgrounds — Sentrial exact values */
    --background: oklch(0% 0 0);                /* #000000 */
    --foreground: oklch(95.24% 0 0);            /* #F0F0F0 */

    --card: oklch(8.27% 0.012 262.87);          /* #0C0E13 */
    --card-foreground: oklch(95.24% 0 0);       /* #F0F0F0 */

    --popover: oklch(8.27% 0.012 262.87);       /* #0C0E13 */
    --popover-foreground: oklch(95.24% 0 0);    /* #F0F0F0 */

    /* Primary — Steel accent hsl(210, 10%, 65%) */
    --primary: oklch(70.67% 0.017 248.6);       /* hsl(210,10%,65%) ≈ #9CA3AF */
    --primary-foreground: oklch(100% 0 0);      /* #FFFFFF */

    /* Secondary — Muted / Input backgrounds */
    --secondary: oklch(17.48% 0.001 106.42);    /* #1E1E1F */
    --secondary-foreground: oklch(95.24% 0 0);  /* #F0F0F0 */

    /* Muted — Labels, descriptions */
    --muted: oklch(17.48% 0.001 106.42);        /* #1E1E1F */
    --muted-foreground: oklch(61.43% 0 0);      /* #8C8C8C */

    /* Accent — Same as primary */
    --accent: oklch(17.48% 0.001 106.42);       /* #1E1E1F */
    --accent-foreground: oklch(95.24% 0 0);     /* #F0F0F0 */

    /* Destructive */
    --destructive: oklch(63.78% 0.177 25.33);   /* #F87171 */
    --destructive-foreground: oklch(100% 0 0);  /* #FFFFFF */

    /* Borders */
    --border: oklch(17.48% 0.001 106.42);       /* #1E1E1F */
    --input: oklch(17.48% 0.001 106.42);        /* #1E1E1F */
    --ring: oklch(70.67% 0.017 248.6);          /* Steel accent */

    --radius: 0.375rem;                          /* 6px */

    /* Chart colors — Sentrial accent palette */
    --chart-1: oklch(72.27% 0.154 163.22);      /* #34C78E — green (pass) */
    --chart-2: oklch(70.67% 0.017 248.6);       /* Steel (flag) */
    --chart-3: oklch(63.78% 0.177 25.33);       /* #F87171 — red (block) */
    --chart-4: oklch(72.21% 0.191 52.3);        /* #F97316 — orange */
    --chart-5: oklch(73.14% 0.143 254.63);      /* #60A5FA — blue */

    /* Sidebar */
    --sidebar-background: oklch(8.27% 0.012 262.87);  /* #0C0E13 */
    --sidebar-foreground: oklch(95.24% 0 0);           /* #F0F0F0 */
    --sidebar-primary: oklch(70.67% 0.017 248.6);      /* Steel */
    --sidebar-primary-foreground: oklch(100% 0 0);
    --sidebar-accent: oklch(17.48% 0.001 106.42);      /* #1E1E1F */
    --sidebar-accent-foreground: oklch(100% 0 0);
    --sidebar-border: var(--border);
    --sidebar-ring: oklch(70.67% 0.017 248.6);         /* Steel */

    /* Sentrial accent tokens (for direct use) */
    --accent-green: #34C78E;
    --accent-red: #F87171;
    --accent-orange: #F97316;
    --accent-blue: #60A5FA;
  }
}
```

Key changes:
- Removed entire `.dark` block — single dark theme only
- All values mapped to Sentrial exact hex values (converted to oklch for Tailwind v4 compat)
- Added Sentrial accent tokens as custom properties

**Step 2: Remove dark variant from `apps/web/styles/globals.css`**

Remove this line:
```css
@variant dark (&:where(.dark, .dark *));
```

Replace with:
```css
@variant dark (&:is(*));
```

This makes the `dark:` variant always apply (since we're dark-only). Alternatively, we could remove all `dark:` prefixes, but this is safer and doesn't require touching component code.

Actually, keep the original line — since we set `className="dark"` on `<html>`, the dark variant will always match. No change needed here.

**Step 3: Force dark theme in `apps/web/lib/root-theme.ts`**

Replace `fallbackThemeMode`:

Change line 26 from:
```typescript
const fallbackThemeMode = `light`;
```
to:
```typescript
const fallbackThemeMode = `dark`;
```

And update `getRootTheme` to always return dark:

```typescript
export async function getRootTheme() {
  return 'dark' as const;
}
```

**Step 4: Update `apps/web/styles/makerkit.css`**

Remove the `.dark` prefix variants and update the header/footer gradient for dark theme:

```css
.site-header > .container:before,
.site-footer > .container:before {
  background: radial-gradient(
    62.87% 100% at 50% 100%,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );

  bottom: 0;
  content: '';
  height: 1px;
  left: 0;
  position: absolute;
  width: 100%;
}

.site-footer > .container:before {
  top: 0;
}
```

**Step 5: Verify tokens apply**

Run: `pnpm --filter web dev`
Expected: Dashboard shows true-black background (#000), dark cards (#0C0E13), gray borders (#1E1E1F), light text (#F0F0F0)

**Step 6: Commit**

```bash
git add apps/web/styles/shadcn-ui.css apps/web/styles/globals.css apps/web/styles/makerkit.css apps/web/lib/root-theme.ts
git commit -m "feat(ui): apply Sentrial dark-only design tokens"
```

---

### Task 3: Update Theme CSS Variables

**Files:**
- Modify: `apps/web/styles/theme.css`

**Step 1: Update theme.css font and radius mappings**

Replace the `--font-sans`, `--font-heading`, and `--font-mono` lines in the `@theme` block:

```css
--font-sans: 'Space Grotesk', var(--font-sans);
--font-heading: 'Playfair Display', var(--font-heading);
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

And update radius values to match Sentrial:

```css
--radius-radius: var(--radius);

--radius-sm: 3px;    /* Filter pills, small buttons */
--radius-md: 4px;    /* Nav items, dropdowns */
--radius-lg: 6px;    /* Cards, panels, primary buttons */
```

**Step 2: Commit**

```bash
git add apps/web/styles/theme.css
git commit -m "feat(ui): update theme.css font and radius for Sentrial spec"
```

---

### Task 4: Restyle Dashboard Stat Cards

**Files:**
- Modify: `apps/web/app/home/[account]/_components/homepage-charts.tsx`

**Step 1: Restyle `ReliabilityGaugeCard` to flat dark Sentrial style**

Replace the `ReliabilityGaugeCard` function (lines 228-314) with:

```tsx
function ReliabilityGaugeCard({ confidence }: { confidence: number | null }) {
  const value = confidence ?? 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - value * circumference;

  let strokeColor = '#8C8C8C'; // muted gray when no data

  if (confidence != null) {
    if (confidence >= 0.8) {
      strokeColor = '#34C78E'; // Sentrial green
    } else if (confidence >= 0.5) {
      strokeColor = '#F97316'; // Sentrial orange
    } else {
      strokeColor = '#F87171'; // Sentrial red
    }
  }

  return (
    <Card className="border-[#1E1E1F] bg-[#0C0E13]">
      <CardContent className="flex items-center gap-4 pt-6">
        {/* SVG Gauge */}
        <div className="relative flex-shrink-0">
          <svg
            viewBox="0 0 100 100"
            className="h-20 w-20"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#1E1E1F"
              strokeWidth="7"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck
              className="h-6 w-6"
              style={{ color: strokeColor, transform: 'rotate(90deg)' }}
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8C8C8C]">
            <Trans i18nKey="agentguard:homepage.reliabilityScore" />
          </p>
          <span
            className="text-4xl font-semibold tracking-tight"
            style={{ color: strokeColor }}
          >
            {formatConfidence(confidence)}
          </span>
          <p className="text-[11px] text-[#8C8C8C]">
            <Trans i18nKey="agentguard:homepage.reliabilityScoreSubtitle" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

Key changes: Removed gradient backgrounds. Used flat `#0C0E13` bg with `#1E1E1F` border. Sentrial color values for gauge. Sentrial typography (11px labels, uppercase section labels).

**Step 2: Restyle `KpiCard` to flat dark Sentrial style**

Replace the `KpiCard` function (lines 320-351) with:

```tsx
function KpiCard({
  titleKey,
  subtitleKey,
  value,
  icon,
  valueClass,
}: {
  titleKey: string;
  subtitleKey: string;
  value: string;
  icon: React.ReactNode;
  accentClass?: string;
  valueClass?: string;
}) {
  return (
    <Card className="border-[#1E1E1F] bg-[#0C0E13]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-semibold text-[#F0F0F0]">
          <Trans i18nKey={titleKey} />
        </span>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-[#8C8C8C]">
          <Trans i18nKey={subtitleKey} />
        </div>
        <div className={`mt-3 text-4xl font-semibold text-[#F0F0F0] ${valueClass ?? ''}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
```

Key changes: Removed `border-l-4` accent stripes and colored backgrounds. Flat dark card matching Sentrial stat card spec: title 14px/600, subtitle 14px/400 muted, value 36px/600.

**Step 3: Update KpiCard usage to remove `accentClass`**

Update the JSX in `HomepageCharts` (around lines 80-111) — the `accentClass` prop is now optional and unused. The existing code will still work since we kept the prop in the type signature as optional. No code change needed.

**Step 4: Restyle `AgentTile` for dark theme**

Replace the `AgentTile` function (lines 357-421) with:

```tsx
function AgentTile({
  agent,
  accountSlug,
}: {
  agent: AgentHealthTile;
  accountSlug: string;
}) {
  const hasData = agent.executions_24h > 0;
  const confidence = agent.avg_confidence ?? 0;

  let barColor = 'bg-[#8C8C8C]';
  let dotColor = 'bg-[#8C8C8C]';

  if (hasData && agent.avg_confidence != null) {
    if (agent.avg_confidence >= 0.8) {
      barColor = 'bg-[#34C78E]';
      dotColor = 'bg-[#34C78E]';
    } else if (agent.avg_confidence >= 0.5) {
      barColor = 'bg-[#F97316]';
      dotColor = 'bg-[#F97316]';
    } else {
      barColor = 'bg-[#F87171]';
      dotColor = 'bg-[#F87171]';
    }
  }

  return (
    <Link
      href={`/home/${accountSlug}/agents/${agent.agent_id}`}
      className="group flex flex-col gap-2 rounded-lg border border-[#1E1E1F] bg-[#0C0E13] p-3 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotColor}`}
        />
        <p className="truncate text-sm font-medium text-[#F0F0F0]">{agent.name}</p>
      </div>

      {hasData ? (
        <>
          {/* Confidence bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1E1E1F]">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#8C8C8C]">
              {formatConfidence(agent.avg_confidence)}
            </span>
            <span className="text-[#8C8C8C]">
              {agent.executions_24h.toLocaleString()}{' '}
              <Trans i18nKey="agentguard:homepage.runs" />
            </span>
          </div>
        </>
      ) : (
        <p className="text-[11px] text-[#8C8C8C]">
          <Trans i18nKey="agentguard:homepage.noData" />
        </p>
      )}
    </Link>
  );
}
```

**Step 5: Restyle `SeverityPill` for dark theme**

Replace `severityStyles` and `SeverityPill` (lines 477-504) with:

```tsx
const severityStyles = {
  critical: 'bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30',
  high: 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30',
  medium: 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30',
  low: 'bg-[#8C8C8C]/15 text-[#8C8C8C] border-[#8C8C8C]/30',
} as const;

function SeverityPill({
  label,
  count,
  variant,
}: {
  label: string;
  count: number;
  variant: keyof typeof severityStyles;
}) {
  const dimmed = count === 0;

  return (
    <Badge
      variant="outline"
      className={dimmed ? 'border-[#1E1E1F] bg-[#1E1E1F]/50 text-[#8C8C8C]/50' : severityStyles[variant]}
    >
      {count} {label}
    </Badge>
  );
}
```

**Step 6: Update chart config colors**

Replace the `trendChartConfig` (lines 49-53) with:

```tsx
const trendChartConfig = {
  pass: { label: 'Pass', color: '#34C78E' },
  flag: { label: 'Flag', color: 'hsl(210, 10%, 65%)' },
  block: { label: 'Block', color: '#F87171' },
} satisfies ChartConfig;
```

**Step 7: Verify dashboard renders correctly**

Run: `pnpm --filter web dev`
Visit: `http://localhost:3000/home/test-1`
Expected: Flat dark cards with #0C0E13 bg, #1E1E1F borders, #F0F0F0 text, Sentrial accent colors on gauge/bars/badges

**Step 8: Commit**

```bash
git add apps/web/app/home/[account]/_components/homepage-charts.tsx
git commit -m "feat(ui): restyle dashboard cards and charts to Sentrial design"
```

---

### Task 5: Add Custom Scrollbar and Global Dark Refinements

**Files:**
- Modify: `apps/web/styles/globals.css`

**Step 1: Add Sentrial scrollbar and smooth scrolling styles**

Add after the existing `@layer base` block:

```css
/* Sentrial-style scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

html {
  scroll-behavior: smooth;
}
```

**Step 2: Commit**

```bash
git add apps/web/styles/globals.css
git commit -m "feat(ui): add Sentrial dark scrollbar and smooth scrolling"
```

---

### Task 6: Run Verification

**Step 1: Run typecheck**

Run: `pnpm typecheck`
Expected: No type errors

**Step 2: Run lint and format**

Run: `pnpm lint:fix && pnpm format:fix`
Expected: Clean exit

**Step 3: Visual verification**

Run: `pnpm --filter web dev`
Visit: `http://localhost:3000/home/test-1`

Verify:
- True-black page background
- Dark card surfaces (#0C0E13)
- Consistent #1E1E1F borders everywhere
- Space Grotesk text throughout
- Stat cards are flat dark (no colored gradients)
- Gauge uses Sentrial green/orange/red colors
- Chart uses green (pass), steel (flag), red (block)
- Scrollbar is thin dark style
- Sidebar has dark background with proper text colors
- No light mode remnants visible anywhere

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix(ui): address lint/format issues from Sentrial redesign"
```

---

## Summary of Files Modified

| # | File | Change |
|---|------|--------|
| 1 | `apps/web/lib/fonts.ts` | Replace Inter with Space Grotesk + Playfair Display + JetBrains Mono |
| 2 | `apps/web/styles/shadcn-ui.css` | Replace all CSS tokens with Sentrial dark-only values |
| 3 | `apps/web/styles/theme.css` | Update font families and radius scale |
| 4 | `apps/web/styles/globals.css` | Add custom scrollbar styles |
| 5 | `apps/web/styles/makerkit.css` | Remove light mode header/footer gradients |
| 6 | `apps/web/lib/root-theme.ts` | Force dark theme always |
| 7 | `apps/web/app/home/[account]/_components/homepage-charts.tsx` | Restyle all dashboard components |
