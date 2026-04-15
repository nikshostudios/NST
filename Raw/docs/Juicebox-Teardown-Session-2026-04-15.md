---
type: raw-session-log
source: cowork-session
date: 2026-04-15
topics:
  - "Juicebox AI site teardown"
  - "Playwright DOM crawler"
  - "Hybrid UI strategy"
  - "Niksho dashboard restyle attempt"
---

# Juicebox Teardown & UI Clone Session — 2026-04-15

## Session summary

Multi-hour Cowork session focused on reverse-engineering the Juicebox AI recruiting platform (app.juicebox.ai) to inform the Niksho/ExcelTech frontend design. Session evolved through several phases.

## Phase 1: Site Teardown

Used the `site-teardown` skill to analyze Juicebox's authenticated app. Challenge: the page is behind Google OAuth, so WebFetch couldn't access it. Workaround: user pasted raw HTML from Chrome DevTools (`copy(document.documentElement.outerHTML)` with DevTools undocked to prevent responsive layout shift).

Multiple attempts were needed:
- First paste: login/signup page (unauthenticated View Source)
- Second paste: still login page (Ctrl+U makes a fresh unauthenticated request)
- Third paste: authenticated DOM but mobile fallback (DevTools narrowed the viewport)
- Fourth paste: authenticated DOM, mobile fallback again (same viewport issue)
- Solution: undock DevTools into separate window, then copy

Successfully captured the full authenticated Juicebox agent dashboard DOM.

## Phase 2: Teardown Document

Produced comprehensive teardown at `NST/research/2026-04-14-juicebox-agent-teardown.md`:

### Tech Stack Confirmed
- Next.js (Pages Router) + MUI v6+ + Emotion CSS-in-JS
- Inter font (primary), Nunito (secondary), Geist/Geist Mono (variable)
- Firebase Auth (Google sign-in)
- Stripe + Churnkey (billing/retention)
- PostHog + GTM via Stape proxy (analytics)
- Sentry (error tracking)
- Pylon (chat widget)
- Sonner (toast notifications)
- TinyMCE + TipTap (rich text)
- Hosted on Vercel

### Design System Extracted
- Colors: #FCFCFC (bg), #FFFFFF (cards), #F8F8F8 (secondary), #7600bc (brand purple)
- Borders: rgba(0,0,0,0.12), shadows: 0 1px 3px rgba(0,0,0,0.08)
- Typography: Inter 14px body, 22px headings, weight 400-500
- Layout: 220px sidebar, 480px right drawer, 600px responsive breakpoint
- Transitions: 250ms cubic-bezier(0.4, 0, 0.2, 1)

### Component Structure
- Sidebar: logo, collapse toggle, nav items (active = purple bg), project selector dropdown, Getting Started checklist, Quick Find (⌘K), user profile
- Agent chat: message cards, CTA buttons, scrollable area
- Right drawer: 500px, slides in for detail panels

## Phase 3: Dashboard Restyle (first attempt)

Attempted to restyle existing `recruitment-agents/dashboard` (React+Vite+Tailwind) to match Juicebox aesthetic:
- Updated theme.ts: dark/gold → light/purple
- Updated App.tsx: sidebar 260px→220px, dark→white, gold→purple
- Updated all 8 pages + 7 components
- TypeScript compiled clean (0 errors)
- Problem: rolldown native binary incompatible with sandbox (build couldn't run locally)

## Phase 4: Claude Code Prompt Approach

Created a standalone prompt for Claude Code at `NST/research/juicebox-clone-prompt.md`. User ran it in Claude Code, which produced a working dashboard. But the result looked like a generic SaaS dashboard (metric cards, pipeline tables) rather than a Juicebox clone.

**Key learning:** The prompt described our own product's pages, not the actual Juicebox UI patterns. The search-first interface, candidate cards with LinkedIn links, filter/criteria pills, status dropdowns — none of these were captured in the prompt.

## Phase 5: Playwright Crawler

Built a Playwright script to systematically crawl every page in Juicebox:

### Crawler features
- Manual login pause (user logs in with Google, presses Enter)
- Session persistence (saves cookies to `auth-session/cookies.json`, reuses on next run)
- Crawls all sidebar nav items
- Clicks into projects, tabs, expandable sections
- Finds and clicks "Create new" / "Add" buttons to capture modals
- Captures settings sub-tabs (user, team, billing)
- Saves DOM + metadata (URL, timestamp, page name) as HTML files
- Generates INDEX.md with all captures

### First crawl results: 43 HTML files
Covered: Agent, All Projects, All Agents, Shortlist, Contacts (with column sorts), Sequences, Analytics, Integrations (all sub-tabs), Settings (user/team/billing), Create modals, Quick Find, Getting Started

### Missing (needs second crawl)
- Search page (THE most important — candidate results, filters, criteria)
- Candidate detail view
- Agent chat conversation (after "start sourcing")
- Analytics sub-tabs
- Sequence detail view
- Contact detail view
- Status dropdown states
- Share modal
- Project selector dropdown open state

Created `crawl-missing.js` for round 2 targeting all missing pages.

### File locations
- Crawler: `recruitment-agents/juicebox-crawler/`
- HTML captures: `recruitment-agents/juicebox-crawler/html-captures/`
- Session cookies: `recruitment-agents/juicebox-crawler/auth-session/`

## Phase 6: Hybrid Strategy Decision

User decided NOT to do a pure Juicebox clone. Instead: take the best of Juicebox's UI patterns and combine with Niksho's actual product features (sourcing agents, screening, pipeline stages, submission formatting, recruiter-specific workflows).

Next step: complete the Playwright crawl (round 2), then use the full HTML capture set as reference material for Claude Code to build a hybrid UI.

## Key decisions made this session
1. **Site teardown approach:** DevTools copy (undocked) for authenticated SPAs behind OAuth
2. **Frontend strategy:** Hybrid Juicebox UI + Niksho features (not pure clone)
3. **Crawler approach:** Playwright with manual login + session persistence
4. **Build tool:** Claude Code with HTML reference files as input
5. **Project location:** `recruitment-agents/niksho-ui/` (new folder alongside existing dashboard)
