---
title: Stitch Prompt — Apple Premium Minimalist (ExcelTech, Light-First)
generated-by: Claude (Cowork)
date: 2026-04-17
purpose: Reusable Google Stitch style foundation — paste above any screen-specific request or alongside reference screenshots
---

# How to use this prompt

Paste **the entire "STITCH PROMPT" block below** into Google Stitch as the first message, then attach your reference screenshot(s) and add a one-line follow-up like *"Design the candidate pipeline view in this style"* or *"Re-skin this screen using the rules above."*

The prompt commits Stitch to a fixed design language so iterations stay consistent across screens. If Stitch drifts, paste the `## Iteration guardrails` section again as a correction.

---

# STITCH PROMPT — copy from here

You are designing the frontend UI for **ExcelTech**, an AI recruitment automation product. ExcelTech lets recruiting teams deploy autonomous agents that source candidates, screen resumes, run outreach, schedule interviews, and maintain a candidate pipeline — all through a single workspace. The user persona is a recruiter or talent leader who expects their tooling to feel as considered as the hiring decisions they make with it.

The design language is **Apple premium minimalist, light-first.** Think apple.com and the macOS System Settings app fused into a SaaS workspace — the product is the hero, the interface retreats until it is invisible, every pixel serves a purpose. This is minimalism as *reverence for the object*, not minimalism as aesthetic preference.

## Non-negotiable design tokens

### Color
- **Primary canvas:** `#f5f5f7` (the signature Apple off-white — never pure white)
- **Elevated surfaces / cards:** `#ffffff` on the `#f5f5f7` canvas
- **Primary text:** `#1d1d1f` (near-black, slightly warm)
- **Secondary text:** `rgba(0, 0, 0, 0.8)`
- **Tertiary / muted text:** `rgba(0, 0, 0, 0.48)`
- **Primary CTA / interactive accent:** `#0071e3` (Apple Blue) — this is the **only** chromatic color allowed in the interface
- **Inline links:** `#0066cc`
- **Focus ring:** `2px solid #0071e3` on all interactive elements
- **Divider / hairline:** `rgba(0, 0, 0, 0.08)` — used extremely sparingly
- **Soft shadow (only for floating elements):** `rgba(0, 0, 0, 0.22) 3px 5px 30px 0px`

Do not introduce any other accent color. No purples, teals, oranges, gradients, or brand-color second-acts. The entire chromatic budget of this product is spent on Apple Blue.

### Typography
- **Display font (20px and above):** SF Pro Display — fallback: `-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif`
- **Text font (below 20px):** SF Pro Text — same fallback stack
- **Negative letter-spacing at every size.** Not just headlines. Apply:
  - 56px → -0.28px
  - 40px → -0.2px
  - 28px → 0.196px (slight positive, per Apple tile-heading spec)
  - 21px → 0.231px
  - 17px body → -0.374px
  - 14px caption → -0.224px
  - 12px micro → -0.12px
- **Line-height range is dramatic.** Headlines compress to 1.07–1.14. Body opens to 1.47. Use this range deliberately — it is how hierarchy is built, not through weight alone.
- **Weight restraint.** 95% of text sits at 400 (regular) or 600 (semibold). Use 300 only on large decorative text. Use 700 only on bold card titles. Never use 800 or 900.

Type scale to respect:

| Role | Size | Weight | Line-height |
|---|---|---|---|
| Hero headline | 56px | 600 | 1.07 |
| Section heading | 40px | 600 | 1.10 |
| Card title | 28px | 400 | 1.14 |
| Sub-heading | 21px | 400 | 1.19 |
| Body | 17px | 400 | 1.47 |
| Body emphasis | 17px | 600 | 1.24 |
| Link / caption | 14px | 400 | 1.43 |
| Micro | 12px | 400 | 1.33 |

### Spacing & layout
- Base unit: **8px.** Dense scale: 2, 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Max content width for narrative sections: **980px**, centered.
- App workspace layouts use the full viewport width with a left sidebar (240–280px) and a flexible content area.
- **Whitespace is cinematic.** Sections breathe. A dashboard card should have at least 24px of internal padding. Stacked sections separate by 48–96px of vertical space.

### Border radius
- Small elements (buttons, inputs, cards): **8px**
- Search / filter inputs: **11px**
- Large panels / modals: **12px**
- Pill CTAs ("Learn more", "Add agent", inline link-style actions): **980px** (the signature Apple capsule)
- Avatars, media controls: **50%**
- Never use radii larger than 12px on rectangular elements. The only "very round" shape is a pill.

### Depth
Shadow is rare. Elevation is almost always signaled by *background contrast* — a white card on a `#f5f5f7` canvas — not by a shadow layer.

When shadow is used, use exactly one recipe: `rgba(0, 0, 0, 0.22) 3px 5px 30px 0px`. Never stack shadows.

The only "glass" in the product is the sticky top navigation: `rgba(255, 255, 255, 0.72)` with `backdrop-filter: saturate(180%) blur(20px)` and a hairline bottom border at `rgba(0, 0, 0, 0.08)`. (We're inverting the apple.com dark glass to a light glass because this is a light-first product UI.)

## Component conventions

**Primary CTA button**
- Background `#0071e3`, text `#ffffff`, 8px radius, 17px SF Pro Text weight 400, 8px vertical × 15px horizontal padding.
- Hover: background brightens ~5%. Active: scale(0.98). Focus: 2px solid `#0071e3` outline, 2px offset.

**Secondary / pill CTA ("Learn more", "Configure", "View all")**
- Transparent background, text `#0066cc`, 1px solid `#0066cc` border, 980px radius, 14px SF Pro Text.
- Inline text variant: same color, no border, chevron glyph `›` after text.

**Input / search field**
- Background `#ffffff` on the `#f5f5f7` canvas (or `#fafafc` if nested on white), 11px radius, 1px solid `rgba(0, 0, 0, 0.08)`.
- 17px SF Pro Text. Focus: border becomes `#0071e3`, 2px outer outline of `#0071e3` at 20% opacity.

**Card / panel**
- Background `#ffffff`, 12px radius, no border, no shadow (unless floating). 24–32px internal padding.
- Cards sit on the `#f5f5f7` canvas and are differentiated by color contrast alone.

**Sidebar navigation (app shell)**
- 260px wide, background `#f5f5f7` (same as canvas — the sidebar is not a separate visual object, it's a *region*).
- 1px right-side hairline divider at `rgba(0, 0, 0, 0.08)`.
- Nav items: 14px SF Pro Text, weight 400, color `rgba(0, 0, 0, 0.8)`. Active item: background `rgba(0, 113, 227, 0.08)`, text `#0071e3`, 8px radius, weight 500.
- Section labels (all-caps group headers): 11px SF Pro Text weight 600, letter-spacing 0.6px, color `rgba(0, 0, 0, 0.48)`.

**Top navigation bar**
- Sticky, 56px height, light glass `rgba(255, 255, 255, 0.72)` + `backdrop-filter: saturate(180%) blur(20px)`, hairline bottom divider.
- Product mark on the left, contextual breadcrumb centered, user avatar + primary action button on the right.

**Table / list (for candidate pipelines, agent runs, etc.)**
- No vertical grid lines. Horizontal hairline dividers at `rgba(0, 0, 0, 0.06)` only.
- Row height 56px minimum. 17px body text. Hover row: background shifts to `rgba(0, 0, 0, 0.02)`.
- Column headers: 12px SF Pro Text weight 600, letter-spacing 0.4px, color `rgba(0, 0, 0, 0.48)`.

**Status badges (agent status, candidate stage, etc.)**
- Pill shape (980px radius), 12px SF Pro Text weight 600, padding 4px × 10px.
- Neutral: background `rgba(0, 0, 0, 0.06)`, text `rgba(0, 0, 0, 0.8)`.
- Active: background `rgba(0, 113, 227, 0.1)`, text `#0071e3`.
- Success: subtle green `#30d158` on a `rgba(48, 209, 88, 0.12)` pill.
- Warning: subtle amber `#ff9f0a` on a `rgba(255, 159, 10, 0.12)` pill.
- Never use saturated fills — the color carries meaning, the pill carries calm.

**Agent cards (recurring ExcelTech pattern)**
- White card, 12px radius, 24px padding. Agent avatar/icon top-left (40×40, 8px radius, subtle gradient allowed only here and only in grayscale tones). Agent name at 17px weight 600. One-line role description at 14px muted. Status pill bottom-right. Small metrics row at the bottom: "42 candidates sourced · 8 screens today" at 12px muted.

## ExcelTech-specific content patterns

When generating screens, use real recruitment language, not lorem ipsum. Sample content to draw from:

- Agent names: *Sourcer*, *Screener*, *Outreach*, *Scheduler*, *Pipeline Keeper*
- Job roles in candidate lists: *Senior Backend Engineer*, *Staff ML Engineer*, *Product Designer*, *VP Engineering*
- Candidate stages: *Sourced → Screened → Contacted → Responded → Interviewing → Offer → Hired*
- Metric labels: *Candidates sourced*, *Screen pass rate*, *Response rate*, *Time-to-first-interview*, *Pipeline velocity*
- Empty states: *"No agents running yet. Deploy your first Sourcer to start populating the pipeline."*

## Iteration guardrails

Hold these rules firm across every iteration. If you find yourself breaking them, stop and restate the rule before continuing.

1. **One accent color only.** Apple Blue `#0071e3`. Everything else is grayscale.
2. **No gradients on backgrounds, cards, or buttons.** Solid fills everywhere. (Tiny, grayscale, product-icon-level gradients are the only exception.)
3. **No heavy shadows, no layered shadows.** Either the one soft shadow recipe or nothing.
4. **No visible borders on cards.** Elevation is color contrast, not outlines.
5. **Left-align body copy.** Center-align only hero headlines.
6. **Respect the optical-sizing boundary:** SF Pro Display at 20px+, SF Pro Text below 20px. Do not mix.
7. **Negative letter-spacing at every size.** Never loose-track SF Pro.
8. **Whitespace is the feature.** If a screen feels crowded, remove content before shrinking spacing.
9. **Pill radius (980px) is reserved for capsule CTAs and status badges only.** Do not apply it to cards or panels.
10. **The product data is the hero.** The chrome around it should fade.

## Output expectations

When I attach a reference screenshot, re-skin its layout using the rules above. Preserve the information architecture of the screenshot but replace every visual treatment with this system. If the screenshot shows a pattern not covered in the component conventions above, invent one that is consistent with the rules — do not borrow from any other design system.

Generate screens at 1440×900 desktop by default. Mobile variants should collapse the sidebar into a tab bar or hamburger and reduce hero type by ~40%, preserving tight line-heights.

# STITCH PROMPT — copy ends here

---

# Notes for you (not for Stitch)

**Why light-first works here even though the source ref is apple.com:** apple.com uses dark sections for cinematic product hero moments and light sections for informational rhythm. A SaaS *workspace* lives in the informational register 90% of the time — recruiters looking at candidate data all day want calm, open, readable. Dark-first reads more like a consumer app (Spotify, Linear's default). Light-first is closer to the macOS System Settings / App Store / Mail feel, which is the correct anchor for ExcelTech.

**What to attach alongside this prompt:**
1. A screenshot of any screen in your current UI you want re-skinned (or a rough wireframe sketch).
2. Optional: one apple.com or macOS screenshot whose *layout pattern* resembles what you want Stitch to produce.

**If Stitch ignores a rule:** paste only the `## Iteration guardrails` section plus "Rule #X was violated in the last output. Regenerate with that rule enforced."

**If you want to compare against the nature-first direction later:** save the Stitch output from this prompt, then generate a second pass replacing the "non-negotiable design tokens" section with the organic/nature-first tokens. A side-by-side will tell you which direction is right far faster than arguing it in the abstract.
