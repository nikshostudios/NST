---
title: Beroz Design System — The Observatory
generated-by: claude (cowork-session 2026-04-17)
status: v0.1 — living document
---

# Beroz Design System — The Observatory

> The product is a quiet, warm, attentive instrument. Recruiters come to it the way an astronomer returns to the dome at dusk — with care, patience, and the expectation that something is worth seeing. The interface is the telescope, not the sky.

## Brand concept

**Name direction:** Beroz (working codename).
**Identity:** The Observatory — a warm, handcrafted, painterly space for focused work. Not a cosmic-dark techy product. The emotional register is "private study at golden hour", not "spaceship cockpit".
**Signature motif:** The domed observatory silhouette against a swirling painterly atmosphere — amber, cream, deep teal-navy. The dome is the logo mark, the hero image, the empty-state illustration, the loading screen.
**Why this and not dark mode:** Our users are 35-45-year-old recruiters who live in Gmail, Excel, LinkedIn — bright interfaces. A pitch-black product feels alien. The Observatory identity stays warm and legible while keeping the cinematic, premium atmosphere of the cosmic direction.

## Palette

### Surfaces (use for 95% of the UI)

- **Canvas** `#F5EFE2` — warm parchment cream, the dominant working surface
- **Surface** `#FFFFFF` — card backgrounds, modals, inputs
- **Surface elevated** `#FAF6EE` — hover states, subtle section blocks
- **Border** `#E5DDC9` — dividers, card outlines (1px, 20% opacity often better than solid)

### Ink (text)

- **Ink primary** `#1A1D26` — deep navy, never pure black. Headlines, body copy.
- **Ink secondary** `#4A5060` — secondary labels, metadata
- **Ink muted** `#7A7466` — placeholders, disabled, timestamp text

### Accents (signature colours — use sparingly)

- **Amber** `#E89050` — the soul of the brand. Primary highlights, active state, progress fills, brand glow.
- **Copper** `#C17A3E` — CTA buttons, primary actions
- **Teal** `#4A9FA8` — secondary data viz, info states, cool contrast
- **Rust** `#A54A28` — alert, overdue, critical

### Semantic

- **Success** `#5A7A5A` (sage, not neon)
- **Warning** `#D4A02A` (warm ochre)
- **Error** `#C84A3A` (terracotta, not pure red)

**Rule:** No pure `#000000`, no pure `#FFFFFF` in atmospheric areas. Shadows are navy, highlights are cream.

## Typography

- **Primary typeface:** Inter (system fallback: -apple-system, Segoe UI, Roboto)
- **Display:** Inter Tight 600 (for dashboard headlines)
- **Body:** Inter 400/500 at 14–15px
- **Numeric data:** Inter with `font-variant-numeric: tabular-nums`
- **Scale:**
  - Display 32/40
  - H1 24/32
  - H2 18/26
  - Body 14/22
  - Caption 12/18
  - Metric (huge numbers on cards) 36/44, weight 500

**Character:** We are not a display-font product. Inter throughout. Weight and size carry hierarchy, not typeface variation.

## Layout

**Conventional SaaS anatomy. Do not experiment.** The users are recruiters who need the navigation where recruiters expect navigation.

- **Left sidebar:** 240px wide, `#FAF6EE`, vertical nav with Material Symbols Outlined icons + labels, 16px icon, 14px label
- **Top bar:** 56px tall, contains search (pill input, 40% width), notifications bell, profile avatar
- **Content area:** 24px padding, 1440px max-content-width, centred
- **Cards:** `#FFFFFF` on canvas, 12px radius, 1px `#E5DDC9` border, 24px inner padding, subtle `box-shadow: 0 1px 2px rgba(26,29,38,0.04)`
- **Grid:** 8px base unit. Gaps of 16px between cards, 24px between sections.

## Component language

- **Buttons primary:** Copper `#C17A3E` background, white text, 10px radius, 40px tall, 16px horizontal padding. Hover: darken 8%.
- **Buttons secondary:** Transparent background, 1px `#E5DDC9` border, ink primary text.
- **Inputs:** White background, 1px `#E5DDC9` border, 10px radius, 40px tall. Focus: 2px amber ring `rgba(232,144,80,0.25)`.
- **Badges / pills:** 12px radius (full stadium), 6px vertical padding, 10px horizontal. Use tint-of-accent: `rgba(90,122,90,0.15)` background + sage text for Active, etc.
- **Progress bars:** 6px tall, 3px radius, copper fill on `#E5DDC9` track.
- **Data tables:** No vertical rules. 1px `#E5DDC9` horizontal dividers. Row height 48px. Hover row: `#FAF6EE`.

## Signature elements (use sparingly — these carry the identity)

1. **Observatory dome silhouette** — logo mark, empty states, login/onboarding hero. Single colour (ink primary or copper), graphic/flat.
2. **Painterly swirl texture** — used only on marketing, login, onboarding, and a single hero card on the dashboard landing. Never behind working data.
3. **Amber lamp-glow radial gradient** — a soft `radial-gradient(circle at top right, rgba(232,144,80,0.08), transparent 40%)` on the dashboard canvas. Subtle. Barely there. It's the warmth, not the decoration.

## Iconography

- **Library:** Material Symbols Outlined, 20px standard, stroke weight 300 (light).
- **Never:** filled icons, emoji, generic Font Awesome.
- **Custom icons:** only for the dome mark and telescope motif. Drawn as single-path SVG, 1.5px stroke, rounded caps.

## Motion

- **Durations:** 150ms for hover/focus, 250ms for expand/collapse, 400ms for route transitions.
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) for everything except brand moments.
- **Brand moments** (login hero, empty states): slower 800ms ease-out. The swirl *breathes*.

## Data visualisation

- **Line charts:** copper for primary series, teal for secondary, sage for tertiary. 2px stroke, rounded caps.
- **Bar charts:** solid copper or amber fills. No gradients on data bars (reserved for brand atmosphere only).
- **Donut/pie:** four-tone — copper, teal, sage, muted ink. Never more than five segments.
- **Empty charts:** show a faint dome silhouette watermark at 5% opacity where the data would be.

## The "do not" list

- No glassmorphism inside the working dashboard. Glass is reserved for the login/hero cosmic portal moment only.
- No neon or electric accents. Our palette is earthy, not electric.
- No dark mode as default. Dark mode may ship later as an opt-in user preference.
- No decorative illustrations inside data views. The swirl lives on marketing and login, never behind KPIs.
- No round avatars with coloured backgrounds. Avatars are photos or monogram on neutral beige.
- No Inter at weight 700 or above for body copy. 500 is the ceiling. We are warm, not shouty.

## Inspiration anchors (for AI generation tools)

When prompting Stitch, Midjourney, ChatGPT, or any generative tool, reference these by name:

- **App feel:** Linear (structure), Notion (calm), Stripe dashboard (clarity), Arc browser (warmth)
- **Illustration feel:** Simon Stålenhag, Syd Mead, Beeple (for the painterly swirl only)
- **Typography feel:** Stripe.com, Linear.app
- **Never reference:** generic "SaaS dashboard", "clean modern UI", "minimalist app" — these trigger house-style generic output.
