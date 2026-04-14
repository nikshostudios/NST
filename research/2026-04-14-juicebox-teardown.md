# Site Teardown: Juicebox AI (PeopleGPT)

**URL (app):** https://app.juicebox.ai/project/IWbN1QS0jOFhYAEE1w6c
**URL (marketing):** https://juicebox.ai
**Company:** Juicebox ($80M Series B, $850M valuation)
**Date analyzed:** 2026-04-14

---

## Tech Stack (Confirmed from Source)

### App (app.juicebox.ai)

| Technology | Evidence | Purpose |
|---|---|---|
| **Next.js** | `/_next/static/chunks/` paths, `data-sdkv="1.3.1"` Vercel Speed Insights, `data-route="/project/[project_id]"` | React SSR/SSG framework — dynamic routing per project |
| **Material UI (MUI) v5+** | `MuiBox-root`, `MuiButton-root`, `MuiGrid-root`, `MuiTypography-root` classes throughout | Component library — buttons, grids, typography, layout |
| **Emotion CSS-in-JS** | `data-emotion="css"` on ~30+ `<style>` tags, hashed class names like `css-jfizxa`, `css-1oobz39` | Runtime styling — scoped, generated CSS per component |
| **Vercel** | `/_vercel/speed-insights/script.js`, Vercel Speed Insights SDK | Hosting + analytics |
| **Stripe** | `<script src="https://js.stripe.com/clover/stripe.is">` | Billing integration — likely checkout/subscription flows |
| **Geist Font** | `geist_527311b9-module__sNNGWG__variable`, `geist_mono_27b0e833-module__gttSBq__variable` | Vercel's Geist font — sans + mono variants |
| **Turbopack** | `turbopack-c2524ca5f6809739.js` chunk reference | Next.js bundler (dev/prod) |

### Marketing site (juicebox.ai)

| Technology | Evidence | Purpose |
|---|---|---|
| **Framer** | All assets from `framerusercontent.com`, Framer page structure | No-code site builder — marketing pages only |
| **Framer Motion** | Scroll-triggered section reveals, tab switching animations | Animation library built into Framer |

---

## Design System

### Colors (extracted from app + marketing)

| Usage | Value | Notes |
|---|---|---|
| Primary background | `#FFFFFF` | Clean white — both app and marketing |
| Primary text | `#000000` | Pure black text, high contrast |
| Secondary text | `#000000` at `opacity: 0.7` | Muted black for supporting copy |
| Button primary | Black fill with white text | `MuiButton-containedPrimary` — inverted CTA pattern |
| Accent / link underline | `#00000050` (50% black) | Subtle underline decoration on links |
| Match score: 100% | Green badge | "Good Match" indicators |
| Match score: 80-90% | Amber/yellow badge | "Potential Fit" indicators |
| Not a match | Red badge | "Not a Match" indicators |
| Card backgrounds | White with subtle shadow | Clean card containment |

**Key insight:** Juicebox uses an almost entirely **monochrome palette** — black, white, and greens/reds only for semantic data (match scores). This is the opposite of the nature-first direction you want. The *structure* is worth cloning; the *color system* should be completely replaced.

### Typography

| Role | Font Family | Weight | Details |
|---|---|---|---|
| **UI text (app)** | Geist Sans (Vercel) | 400, 500, 700 | System-grade clarity, tight letterspacing |
| **Mono/code** | Geist Mono | 400 | Used for data-dense elements |
| **Marketing headlines** | Custom display face | 700+ | Large, bold, high-impact |
| **Body copy** | 15px, `line-height: 1.5` | 400 | Confirmed from inline styles |
| **Labels/badges** | 13px | Bold | Trust badges, fine print |
| **Section headers** | 22px | 500 | "Welcome to PeopleGPT" level |

### Spacing & Layout

| Pattern | Value | Used in |
|---|---|---|
| Card internal padding | ~20px left/right | Login form, feature cards |
| Section margin bottom | 50px | Between major sections |
| Component gap | 12px (margin-bottom) | Between stacked elements |
| Top margin (sections) | 24px | Section spacing rhythm |
| Grid system | MUI Grid — 12-column, `sm-6 / md-6` | Two-column split layout on login |
| Trust badge row | Flex, `object-fit: contain`, 72.5% width | Logos + compliance badges |

### Responsive Strategy

- **MUI Grid breakpoints** — `sm` (600px) and `md` (900px) confirmed from class names
- **Two layouts for auth:** single-column (mobile) and split-screen (desktop) — both rendered in HTML, visibility toggled by breakpoint
- **Image sizing:** `object-fit: contain` with percentage widths, not fixed pixels
- **Inline styles used extensively** — font sizes, colors, margins set directly on elements, not through CSS classes (this is a Juicebox-specific pattern, not best practice)

---

## Component Architecture

### 1. Auth / Login Page

**Structure:** Split-screen layout on desktop, single-column on mobile.

- **Left panel (desktop):** Marketing message + hero image (`/images/main.png`) + trust badges
- **Right panel:** Logo → tagline → CTA text → OAuth buttons (Google, Email, SSO/SAML) → ToS link → trust badges
- **Mobile:** Right panel content only, stacked vertically

**Key components:**
- `css-1lv8qu1` — outer wrapper, likely max-width container
- `css-13jebj1` — content area with centered alignment
- `css-5hfp98` — card/form container
- `css-ch9tpx` — inner form layout
- `css-17ztu8x` — button group container
- `css-1oobz39` — primary button (MUI contained, elevation disabled)
- `css-cveorv` — button icon container (Google logo)

**Button pattern:**
- Full-width contained buttons
- `disableElevation` — flat, no box-shadow (clean look)
- Icon + text layout (`startIcon` slot)
- Stacked vertically with consistent gap

### 2. Candidate Search Results (from marketing mockup)

**Structure:** Search bar → filter pills → results list with match scores

- **Search input:** Natural language ("Software Engineer in San Francisco")
- **Filter pills:** Location, +5 more filters, expandable
- **Result rows:** Avatar → Name → Title → Company → Match % (color-coded)
- **Match badges:** "Good Match", "Potential Fit", "Not a Match" — each with distinct color + icon

### 3. Candidate Profile Cards

**Structure:** Photo → Name → Title → Company → AI Summary → Skill tags

- **Summary:** 2-3 lines of AI-generated context about the candidate
- **Tags:** Pill-shaped badges ("Development", "Agile", "Cloud") — categorized skills
- **Layout:** Card-based, likely in a grid or list view

### 4. Outreach Composer

**Structure:** Recipients count → template editor with merge fields

- **Merge fields:** Highlighted inline (First Name, Last Name, Current Company, Current Job Title)
- **AI commands:** "Smart AI Command" button for generating personalized copy
- **Template:** Full email body with placeholder tokens

### 5. AI Agent Dashboard

**Structure:** Agent cards → status indicators → review queue

- **Agent cards:** Name + role ("Data analyst agent") + status ("Running 24/7 in background" or "35 profiles ready for review")
- **Review queue:** Same candidate list format as search results
- **Chat interface:** AI conversational element ("What do you think about this profile?")

---

## Effects Breakdown

| Effect | Implementation | Complexity | Cloneable? |
|---|---|---|---|
| **Split-screen auth** | MUI Grid `sm-6/md-6` with conditional visibility | Low | Yes — standard responsive pattern |
| **Candidate card scroll** | Framer-hosted marketing animation, likely Framer Motion | Med | Yes — CSS scroll or Framer Motion |
| **Match score badges** | Static color-coded chips, likely MUI Chip variant | Low | Yes — trivial CSS |
| **Tab switching (features)** | Framer tabs with content swap animation | Med | Yes — CSS transitions or Framer Motion |
| **Integration logo carousel** | Horizontal scroll/marquee of ATS logos | Low | Yes — CSS marquee or Swiper |
| **FAQ accordion** | Click-to-expand, likely MUI Accordion | Low | Yes — standard component |
| **Candidate profile reveal** | Scroll-triggered card entrance | Med | Yes — IntersectionObserver + CSS transition |

---

## Assets Needed to Recreate (Adapted for Niksho)

1. **Logo** — Niksho wordmark + icon. Current Juicebox uses simple SVG wordmark
2. **Hero image** — Instead of `/images/main.png` (product screenshot), use **nature-themed** hero: aerial forest/meadow with glassmorphism cards floating. Midjourney prompt: "aerial view of lush green meadow with morning light, soft fog, photorealistic, wide angle, warm tones --ar 16:9"
3. **Trust/compliance badges** — SOC2, GDPR, CCPA SVGs (standard compliance icons)
4. **ATS integration logos** — SVGs for Greenhouse, Lever, Bullhorn, etc. (from official brand assets pages)
5. **Candidate avatars** — AI-generated or stock headshots for demo/placeholder data
6. **Match indicator icons** — Custom SVG icons for Good Match / Potential Fit / Not a Match

---

## Build Plan — Adapted for Niksho

### Why This Architecture Matters for You

Juicebox's app is a **Next.js + MUI + Emotion** stack deployed on Vercel. Your current ExcelTech app is **FastAPI + Jinja2** on Railway. The SaaS overview says "Jinja2 now → Next.js later." This teardown gives you the target architecture for that Next.js rebuild.

### Recommended Stack (for Niksho SaaS)

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | Same as Juicebox. SSR for SEO on marketing, client components for app dashboard |
| **UI Library** | **Tailwind CSS + shadcn/ui** (NOT MUI) | MUI gives you Juicebox's exact corporate look. Tailwind + shadcn gives you the flexibility to implement the nature-first aesthetic without fighting a component library's opinions |
| **Animation** | Framer Motion | Used on Juicebox marketing. Handles page transitions, scroll reveals, card entrances |
| **Fonts** | Inter or Instrument Sans (not Geist) | Geist = Vercel brand. You want a warm, slightly rounded sans-serif for the nature vibe |
| **Icons** | Lucide React | Clean, consistent, open-source |
| **State** | Zustand or Jotai | Lightweight, no Redux overhead |
| **Backend** | FastAPI (existing) | Keep the existing agent layer, just serve a Next.js frontend instead of Jinja2 |
| **Deploy** | Vercel (frontend) + Railway (API) | Split deploy, same as Juicebox's model |

### NPM Packages

```bash
npm install next react react-dom tailwindcss @tailwindcss/forms framer-motion lucide-react zustand clsx
npx shadcn@latest init
```

### Section-by-Section Build Order

**Section 1: Auth / Onboarding (clone Juicebox pattern, retheme)**
- Split-screen: left = nature hero with glassmorphism product preview cards, right = auth form
- OAuth buttons: Google + Email + SSO (same pattern as Juicebox)
- Trust badges at bottom
- **Niksho twist:** Background is a full-bleed nature photograph, cards have `backdrop-filter: blur(16px)` + `background: rgba(255,255,255,0.7)`, warm green accent for CTAs instead of black

**Section 2: Dashboard / Home (after login)**
- Agent status cards (same layout as Juicebox's "Data analyst agent" cards)
- Pipeline summary: open requirements, candidates in progress, outreach pending
- **Niksho twist:** Cards have subtle leaf/vine border accents, green progress indicators, nature-toned status colors (forest green = active, amber = pending, earth brown = closed)

**Section 3: Search / Quick Screen**
- Natural language search bar (identical pattern to Juicebox)
- Filter pills below search
- Results list with match scores (100%, 90%, 85% pattern)
- Candidate cards with AI summary
- **Niksho twist:** Search bar has organic rounded corners (20px+), match badges use leaf/seed iconography, card hover lifts with soft green shadow

**Section 4: Candidate Profile**
- Full profile view: contact info, work history, AI screening notes
- Skill tags as pills
- Outreach draft panel
- **Niksho twist:** Profile header has a subtle gradient from white to pale green, skill tags are leaf-green pills

**Section 5: Outreach Queue**
- Email template editor with merge fields
- Recipient list with status
- Send/schedule controls
- **Niksho twist:** Template editor has warm background, merge field highlights are green instead of blue

**Section 6: Submission Queue (TL view)**
- Approval workflow: review candidate → approve → format → send to client
- Batch actions
- **Niksho twist:** Approval flow uses nature metaphors (plant → grow → harvest for pipeline stages)

---

## Juicebox Patterns to Steal vs Adapt

### Steal directly:
- **Split-screen auth layout** — proven, clean, professional
- **Natural language search bar** — "Who are you looking for?" prompt pattern
- **Match score percentage badges** — recruiters love quantified fit
- **Agent status cards** — "Running 24/7 in background" pattern
- **Merge field highlighting in outreach** — visual distinction between static and dynamic text
- **Trust badges on auth screen** — instant credibility

### Adapt (retheme for nature-first):
- **Color system** — replace black/white monochrome with greens, warm whites, earth tones
- **Font** — swap Geist for something warmer (Instrument Sans, Satoshi, or General Sans)
- **Shadows** — swap MUI's grey shadows for tinted green/warm shadows
- **Borders** — swap sharp 4px radius for organic 12-20px radius
- **Backgrounds** — swap flat white for subtle nature textures, gradients, or photography
- **Icons** — swap generic icons for nature-themed ones where it makes sense (without being cheesy)

### Don't copy:
- **MUI as the component library** — it fights you on custom aesthetics. Use Tailwind + shadcn
- **Emotion CSS-in-JS** — Tailwind is simpler and more maintainable for a small team
- **Inline styles everywhere** — Juicebox's code has a lot of inline `style=` tags, which is messy. Use Tailwind classes
- **Framer for marketing** — you can build a better, more custom marketing page with Next.js directly

---

## Notes

- **The app is behind auth.** The internal dashboard UI isn't publicly accessible. The marketing site shows *mockups* of the product (not real screenshots of the authenticated app). The component patterns from the login page + marketing mockups are still highly useful for structure.
- **Juicebox uses MUI heavily.** Every component is a MUI primitive. This means their design is constrained to MUI's visual language — which is why they look "corporate clean" but not distinctive. Your nature-first approach with Tailwind will look fundamentally different even with the same layout patterns.
- **Their $850M valuation validates the UX patterns.** The search-results-as-cards, match-scoring, agent-status-dashboard patterns are proven at scale with 25,000+ recruiters. Clone the patterns, retheme the aesthetics.
- **Stripe is already in your plan.** Juicebox uses Stripe too (confirmed from their script tags). Your Phase C billing integration aligns.
