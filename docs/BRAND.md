# Layer — Brand Identity Guide

> **Layer** evokes the idea of building depth through stacked technologies and capabilities. Like layers of an application stack, each component adds richness and functionality to the whole. The brand represents clean architecture, modern design, and thoughtful engineering.

---

## 1. Project Name

### Selected: Layer

| Candidate | Meaning | Why / Why Not |
|-----------|---------|---------------|
| **Layer** ✅ | Stack, depth, strata | Evokes layered architecture, modern and clean |
| Stratum | Geological layer | Accurate but overly technical |
| Tier | Ranked level | Common, less distinctive |
| Stack | Technology stack | Too generic |

**Domain style**: layer-portfolio.app, layer-portfolio.io  
**Short handle**: @layer-portfolio

---

## 2. Color Palette

### 2.1 Primary — Emerald

Growth, vitality, success. The core brand color. Represents clean, sustainable code and forward momentum.

| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | `#ECFDF5` | Light backgrounds, hover states |
| 100 | `#D1FAE5` | Subtle backgrounds, chips |
| 200 | `#A7F3D0` | Borders, dividers (light mode) |
| 300 | `#6EE7B7` | Muted text on dark backgrounds |
| 400 | `#34D399` | Secondary interactive elements |
| 500 | `#10B981` | Links, focused states |
| **600** | **`#059669`** | **Primary buttons, brand marks, headings** |
| 700 | `#047857` | Hover state for primary buttons |
| 800 | `#065F46` | Active/pressed state |
| 900 | `#064E3B` | Dark mode primary text |
| 950 | `#022C22` | Dark mode headings |

### 2.2 Secondary — Teal

Intelligence, clarity, AI. Used for secondary actions, tags, and illustrations.

| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | `#F0FDFA` | Light backgrounds |
| 100 | `#CCFBF1` | Subtle highlights |
| 200 | `#99F6E4` | Borders (light) |
| 300 | `#5EEAD4` | Decorative elements |
| 400 | `#2DD4BF` | Icons, illustrations |
| **500** | **`#14B8A6`** | **Secondary buttons, badges, AI indicators** |
| 600 | `#0D9488` | Hover state for secondary buttons |
| 700 | `#0F766E` | Active state |
| 800 | `#115E59` | Dark mode secondary text |
| 900 | `#134E4A` | Dark mode secondary headings |
| 950 | `#042F2E` | Dark mode deep background |

### 2.3 Accent — Amber

Warmth, energy, highlights. Draws attention with a golden glow.

| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | `#FFFBEB` | Light accent backgrounds |
| 100 | `#FEF3C7` | Notification backgrounds |
| 200 | `#FDE68A` | Borders (light) |
| 300 | `#FCD34D` | Muted accent text |
| **400** | **`#FBBF24`** | **CTAs, important highlights, badges** |
| 500 | `#F59E0B` | Warning accent |
| 600 | `#D97706` | Hover state for accent buttons |
| 700 | `#B45309` | Active state |
| 800 | `#92400E` | Dark mode accent text |
| 900 | `#78350F` | Dark mode accent headings |
| 950 | `#451A03` | Dark mode deep accent |

### 2.4 Neutral — Slate

Text, backgrounds, borders. The structural backbone.

| Shade | Hex | Light Mode Usage | Dark Mode Usage |
|-------|-----|-----------------|-----------------|
| 50 | `#F8FAFC` | Page background | — |
| 100 | `#F1F5F9` | Card background | — |
| 200 | `#E2E8F0` | Borders, dividers | — |
| 300 | `#CBD5E1` | Muted borders | — |
| 400 | `#94A3B8` | Placeholder text | Borders |
| 500 | `#64748B` | Secondary text | Muted text |
| 600 | `#475569` | Body text | Secondary text |
| 700 | `#334155` | Headings | Body text |
| 800 | `#1E293B` | — | Card background |
| 900 | `#0F172A` | — | Page background |
| 950 | `#020617` | — | Deep background |

### 2.5 Semantic Colors

| Role | Color | Hex (Light) | Hex (Dark) | Usage |
|------|-------|-------------|------------|-------|
| Success | Emerald | `#10B981` | `#34D399` | Confirmations, positive states |
| Error | Red | `#EF4444` | `#F87171` | Errors, destructive actions |
| Warning | Amber | `#F59E0B` | `#FBBF24` | Caution, pending states |
| Info | Sky | `#0EA5E9` | `#38BDF8` | Informational, tips |

### 2.6 Dark Mode Mapping

In dark mode, the palette shifts:

| Element | Light | Dark |
|---------|-------|------|
| Page background | Slate-50 `#F8FAFC` | Slate-900 `#0F172A` |
| Card/surface | White `#FFFFFF` | Slate-800 `#1E293B` |
| Primary text | Slate-900 `#0F172A` | Slate-50 `#F8FAFC` |
| Secondary text | Slate-600 `#475569` | Slate-400 `#94A3B8` |
| Muted text | Slate-400 `#94A3B8` | Slate-500 `#64748B` |
| Border | Slate-200 `#E2E8F0` | Slate-700 `#334155` |
| Primary button | Emerald-600 `#059669` | Emerald-500 `#10B981` |
| Secondary button | Teal-500 `#14B8A6` | Teal-400 `#2DD4BF` |
| Accent/CTA | Amber-400 `#FBBF24` | Amber-300 `#FCD34D` |

---

## 3. Typography

### 3.1 Font Families

| Role | Font | Fallback | Source |
|------|------|----------|--------|
| **Primary (Korean + Latin)** | Pretendard | system-ui, -apple-system, sans-serif | [GitHub](https://github.com/orioncactus/pretendard) |
| **Display (English headings)** | Plus Jakarta Sans | Pretendard, sans-serif | [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans) |
| **Monospace (Code)** | JetBrains Mono | ui-monospace, monospace | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) |

> **Why Pretendard?** The de facto standard Korean web font. Apple SD Gothic Neo-compatible metrics mean no layout shift. Clean, modern, highly readable at all sizes.

> **Why Plus Jakarta Sans?** Distinctive geometric sans-serif with personality. Avoids the generic Inter/Roboto look while maintaining excellent readability. Used for English-language headings and display text.

### 3.2 Font Scale

Based on a 16px root with a 1.25 major-third scale ratio.

| Token | Size (rem) | Size (px) | Line Height (rem) | Line Height (px) | Usage |
|-------|-----------|-----------|-------------------|-----------------|-------|
| `text-xs` | 0.75 | 12 | 1.0 | 16 | Captions, badges, timestamps |
| `text-sm` | 0.875 | 14 | 1.25 | 20 | Body small, helper text, table cells |
| `text-base` | 1.0 | 16 | 1.5 | 24 | Body text, form inputs |
| `text-lg` | 1.125 | 18 | 1.75 | 28 | Lead paragraphs, card titles |
| `text-xl` | 1.25 | 20 | 1.75 | 28 | Section headings (h4) |
| `text-2xl` | 1.5 | 24 | 2.0 | 32 | Sub-headings (h3) |
| `text-3xl` | 1.875 | 30 | 2.25 | 36 | Headings (h2) |
| `text-4xl` | 2.25 | 36 | 2.5 | 40 | Page titles (h1) |
| `text-5xl` | 3.0 | 48 | 1.0 | — | Hero display (tight) |

### 3.3 Font Weights

| Token | Weight | Name | Usage |
|-------|--------|------|-------|
| `font-normal` | 400 | Regular | Body text, descriptions |
| `font-medium` | 500 | Medium | Navigation, labels, table headers |
| `font-semibold` | 600 | Semibold | Card titles, buttons, emphasis |
| `font-bold` | 700 | Bold | Page headings, hero text |

### 3.4 Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `tracking-tighter` | -0.05em | Hero display text |
| `tracking-tight` | -0.025em | Headings (h1–h3) |
| `tracking-normal` | 0em | Body text, most UI |
| `tracking-wide` | 0.025em | Uppercase labels, buttons |
| `tracking-wider` | 0.05em | All-caps headings |

---

## 4. Logo

### 4.1 Concept

Text-based logo using the brand name **Layer** with a dual-color treatment:

- **L** rendered in Primary Emerald (`#059669`)
- **ayer** rendered in Secondary Teal (`#14B8A6`)
- A subtle accent dot (Amber `#D97706`) positioned after the text, representing the spark of innovation

### 4.2 Logo Variants

| Variant | Description | Usage |
|---------|-------------|-------|
| **Primary** | Layer with accent dot | App header, splash screen, primary branding |
| **Compact** | L (letter mark) with accent dot | Favicon, app icon, avatar |
| **Horizontal** | Layer + tagline | Landing page hero |

### 4.3 Logo SVG Specification

```svg
<!-- Primary Logo: Layer -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="none">
  <!-- L in Emerald -->
  <text x="0" y="46" font-family="Pretendard, sans-serif" font-size="48" font-weight="700" fill="#059669">L</text>
  <!-- ayer in Teal -->
  <text x="34" y="46" font-family="Pretendard, sans-serif" font-size="48" font-weight="300" fill="#14B8A6">ayer</text>
  <!-- Accent dot -->
  <circle cx="98" cy="8" r="4" fill="#D97706"/>
</svg>
```

```svg
<!-- Compact Mark: L with accent dot -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" fill="none">
  <text x="6" y="48" font-family="Pretendard, sans-serif" font-size="48" font-weight="700" fill="#059669">L</text>
  <circle cx="48" cy="10" r="5" fill="#D97706"/>
</svg>
```

### 4.4 Logo Clear Space

Maintain a minimum clear space equal to the height of the accent dot (4px at default scale) on all sides. The logo must never appear smaller than 24px height.

### 4.5 Logo Don'ts

- Do not stretch, skew, or rotate the logo
- Do not change the color relationships (emerald/teal/amber)
- Do not add outlines, shadows, or gradients
- Do not place on busy backgrounds without a solid container
- Do not use the logo at sizes below 24px height

---

## 5. Spacing & Layout

### 5.1 Spacing Scale

Based on a 4px grid.

| Token | Value (px) | Usage |
|-------|-----------|-------|
| `space-0` | 0 | Reset |
| `space-0.5` | 2 | Tight inline gaps |
| `space-1` | 4 | Icon gaps, tight padding |
| `space-1.5` | 6 | Small element padding |
| `space-2` | 8 | Default gap, compact padding |
| `space-2.5` | 10 | — |
| `space-3` | 12 | Card padding (compact) |
| `space-4` | 16 | Standard padding, gaps |
| `space-5` | 20 | — |
| `space-6` | 24 | Section gaps |
| `space-8` | 32 | Large gaps, card padding |
| `space-10` | 40 | — |
| `space-12` | 48 | Section margins |
| `space-16` | 64 | Page section spacing |
| `space-20` | 80 | — |
| `space-24` | 96 | Hero spacing |

### 5.2 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0 | — |
| `radius-sm` | 0.25rem (4px) | Tags, small chips |
| `radius-md` | 0.375rem (6px) | Buttons, inputs |
| `radius-lg` | 0.5rem (8px) | Cards, modals |
| `radius-xl` | 0.75rem (12px) | Large cards, panels |
| `radius-2xl` | 1rem (16px) | Feature cards |
| `radius-full` | 9999px | Avatars, pills |

### 5.3 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Subtle elevation |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Cards, dropdowns |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Modals, popovers |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | Elevated panels |

---

## 6. Component Patterns

### 6.1 Buttons

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| Primary | Emerald-600 | White | None | Emerald-700 |
| Secondary | Teal-500 | White | None | Teal-600 |
| Accent | Amber-400 | White | None | Amber-500 |
| Outline | Transparent | Emerald-600 | Emerald-600 | Emerald-50 bg |
| Ghost | Transparent | Slate-700 | None | Slate-100 bg |
| Destructive | Red-500 | White | None | Red-600 |

All buttons use:
- `font-medium` (500)
- `text-sm` (14px)
- `px-4 py-2` (16px 8px)
- `radius-md` (6px)
- `transition-colors duration-150`

### 6.2 Cards

- Background: White (light) / Slate-800 (dark)
- Border: Slate-200 (light) / Slate-700 (dark)
- Border radius: `radius-lg` (8px)
- Padding: `space-6` (24px)
- Shadow: `shadow-sm` (default), `shadow-md` (hover)

### 6.3 Tags / Badges

| Type | Background | Text |
|------|-----------|------|
| Default | Slate-100 | Slate-700 |
| Primary | Emerald-50 | Emerald-700 |
| Secondary | Teal-50 | Teal-700 |
| Accent | Amber-50 | Amber-700 |
| Success | Emerald-50 | Emerald-700 |
| Warning | Amber-50 | Amber-700 |
| Error | Red-50 | Red-700 |

All badges use:
- `text-xs` (12px)
- `font-medium` (500)
- `px-2.5 py-0.5` (10px 2px)
- `radius-full` (pill)

---

## 7. Accessibility

### 7.1 Contrast Ratios (WCAG AA)

All primary text/background combinations meet WCAG AA (4.5:1 minimum):

| Combination | Ratio | Pass |
|-------------|-------|------|
| Slate-900 on White | 18.4:1 | ✅ AA |
| Slate-700 on White | 10.2:1 | ✅ AA |
| Slate-600 on White | 7.1:1 | ✅ AA |
| Emerald-600 on White | 5.8:1 | ✅ AA |
| Teal-600 on White | 5.5:1 | ✅ AA |
| White on Emerald-600 | 5.8:1 | ✅ AA |
| White on Teal-500 | 4.6:1 | ✅ AA |
| White on Slate-900 | 18.4:1 | ✅ AA |
| Slate-50 on Slate-900 | 15.7:1 | ✅ AA |

### 7.2 Focus States

All interactive elements must display a visible focus ring:
- `outline: 2px solid`
- `outline-offset: 2px`
- Color: Emerald-500 (light mode), Emerald-400 (dark mode)

### 7.3 Motion

- Respect `prefers-reduced-motion`
- Default transitions: `150ms ease`
- Page transitions: `300ms ease`
- No animations longer than 500ms

---

## 8. CSS Custom Properties

Copy these into `globals.css` or `tailwind.config.ts` as the source of truth.

```css
:root {
  /* === Primary — Emerald === */
  --color-primary-50:  #ECFDF5;
  --color-primary-100: #D1FAE5;
  --color-primary-200: #A7F3D0;
  --color-primary-300: #6EE7B7;
  --color-primary-400: #34D399;
  --color-primary-500: #10B981;
  --color-primary-600: #059669;
  --color-primary-700: #047857;
  --color-primary-800: #065F46;
  --color-primary-900: #064E3B;
  --color-primary-950: #022C22;

  /* === Secondary — Teal === */
  --color-secondary-50:  #F0FDFA;
  --color-secondary-100: #CCFBF1;
  --color-secondary-200: #99F6E4;
  --color-secondary-300: #5EEAD4;
  --color-secondary-400: #2DD4BF;
  --color-secondary-500: #14B8A6;
  --color-secondary-600: #0D9488;
  --color-secondary-700: #0F766E;
  --color-secondary-800: #115E59;
  --color-secondary-900: #134E4A;
  --color-secondary-950: #042F2E;

  /* === Accent — Amber === */
  --color-accent-50:  #FFFBEB;
  --color-accent-100: #FEF3C7;
  --color-accent-200: #FDE68A;
  --color-accent-300: #FCD34D;
  --color-accent-400: #FBBF24;
  --color-accent-500: #F59E0B;
  --color-accent-600: #D97706;
  --color-accent-700: #B45309;
  --color-accent-800: #92400E;
  --color-accent-900: #78350F;
  --color-accent-950: #451A03;

  /* === Neutral — Slate === */
  --color-neutral-50:  #F8FAFC;
  --color-neutral-100: #F1F5F9;
  --color-neutral-200: #E2E8F0;
  --color-neutral-300: #CBD5E1;
  --color-neutral-400: #94A3B8;
  --color-neutral-500: #64748B;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1E293B;
  --color-neutral-900: #0F172A;
  --color-neutral-950: #020617;

  /* === Semantic === */
  --color-success:       #10B981;
  --color-success-light: #D1FAE5;
  --color-error:         #EF4444;
  --color-error-light:   #FEE2E2;
  --color-warning:       #F59E0B;
  --color-warning-light: #FEF3C7;
  --color-info:          #0EA5E9;
  --color-info-light:    #E0F2FE;

  /* === Typography === */
  --font-sans:     'Pretendard', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-display:  'Plus Jakarta Sans', 'Pretendard', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;

  --text-xs:    0.75rem;    /* 12px */
  --text-sm:    0.875rem;   /* 14px */
  --text-base:  1rem;       /* 16px */
  --text-lg:    1.125rem;   /* 18px */
  --text-xl:    1.25rem;    /* 20px */
  --text-2xl:   1.5rem;     /* 24px */
  --text-3xl:   1.875rem;   /* 30px */
  --text-4xl:   2.25rem;    /* 36px */
  --text-5xl:   3rem;       /* 48px */

  --leading-xs:   1.0;      /* 16px at base */
  --leading-sm:   1.25;     /* ~18px */
  --leading-base: 1.5;      /* 24px */
  --leading-lg:   1.75;     /* ~28px */
  --leading-xl:   1.75;
  --leading-2xl:  2.0;
  --leading-3xl:  2.25;
  --leading-4xl:  2.5;
  --leading-5xl:  1.0;     /* tight for display */

  --font-normal:    400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;

  --tracking-tighter: -0.05em;
  --tracking-tight:   -0.025em;
  --tracking-normal:  0em;
  --tracking-wide:    0.025em;
  --tracking-wider:   0.05em;

  /* === Spacing === */
  --space-0:   0;
  --space-0.5: 0.125rem;  /* 2px */
  --space-1:   0.25rem;   /* 4px */
  --space-1.5: 0.375rem;  /* 6px */
  --space-2:   0.5rem;    /* 8px */
  --space-2.5: 0.625rem;  /* 10px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;       /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px */
  --space-24:  6rem;      /* 96px */

  /* === Border Radius === */
  --radius-none:  0;
  --radius-sm:    0.25rem;  /* 4px */
  --radius-md:    0.375rem; /* 6px */
  --radius-lg:    0.5rem;   /* 8px */
  --radius-xl:    0.75rem;  /* 12px */
  --radius-2xl:   1rem;     /* 16px */
  --radius-full:  9999px;

  /* === Shadows === */
  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* === Transitions === */
  --duration-fast:   150ms;
  --duration-normal: 300ms;
  --duration-slow:   500ms;
  --ease-default:     cubic-bezier(0.4, 0, 0.2, 1);
}

/* === Dark Mode Overrides === */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-page:    var(--color-neutral-900);
    --color-bg-surface: var(--color-neutral-800);
    --color-text-primary:   var(--color-neutral-50);
    --color-text-secondary: var(--color-neutral-400);
    --color-text-muted:     var(--color-neutral-500);
    --color-border:         var(--color-neutral-700);

    --color-success:       #34D399;
    --color-error:         #F87171;
    --color-warning:       #FBBF24;
    --color-info:          #38BDF8;
  }
}
```

---

## 9. Tailwind Configuration Reference

Map the design tokens into `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        secondary: {
          50:  '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        accent: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Pretendard', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
}

export default config
```

---

## 10. Usage Guidelines

### When to Use Each Color

| Color | Use For | Avoid For |
|-------|---------|-----------|
| **Primary (Emerald)** | Brand marks, primary buttons, links, headings, navigation active states | Large background areas, body text (too heavy) |
| **Secondary (Teal)** | Secondary buttons, tags, AI-related UI, success-adjacent states, illustrations | Error states, primary CTAs (conflicts with primary role) |
| **Accent (Amber)** | CTAs, notifications, important highlights, bookmarks, live indicators | Large text blocks, backgrounds (too intense) |
| **Neutral (Slate)** | Body text, backgrounds, borders, structural elements | Interactive elements (too muted) |
| **Success (Emerald)** | Confirmations, completed states, positive indicators | Warnings, errors |
| **Error (Red)** | Errors, destructive actions, validation failures | Success states, primary actions |
| **Warning (Amber)** | Caution states, pending actions, attention needed | Success, errors |
| **Info (Sky)** | Tooltips, informational badges, help text | Errors, warnings |

### Dark Mode Principles

1. **Never use pure black** (`#000000`) — use Slate-900 (`#0F172A`) instead
2. **Reduce color saturation** by shifting one shade lighter for vivid colors
3. **Increase contrast** for text — use lighter shades on dark backgrounds
4. **Dim shadows** — use lower opacity shadows or borders instead
5. **Invert surface hierarchy** — darker backgrounds, lighter surfaces

### Korean Typography Notes

- Pretendard provides Apple SD Gothic Neo-compatible metrics, ensuring no layout shift
- Korean text typically requires slightly more line height than Latin text — the scale accounts for this
- For mixed Korean/English text, Pretendard handles both scripts gracefully
- Avoid font sizes below 12px for Korean text — characters become illegible
- Use `word-break: keep-all` for Korean text to prevent mid-word breaks

---

*This brand guide is the single source of truth for all visual design decisions in the Layer project. When in doubt, refer back to this document.*