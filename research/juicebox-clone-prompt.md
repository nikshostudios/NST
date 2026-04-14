# Juicebox Clone — Claude Code Prompt

## How to use this

1. Open Claude Code in your terminal
2. Paste the **PROMPT** section below
3. Claude Code will build the entire app for you

---

## PROMPT

```
Build me a complete AI recruiting SaaS dashboard as a React + Vite + TypeScript app. The design must be a pixel-perfect clone of the Juicebox AI platform (app.juicebox.ai). I'm providing the full design spec and component structure below.

## Project Setup
Create a new Vite + React + TypeScript project. Use these dependencies:
- react, react-dom, react-router-dom (v7+)
- @mui/material, @mui/icons-material, @emotion/react, @emotion/styled
- lucide-react (icons)
- sonner (toast notifications)

Run: npm create vite@latest niksho-dashboard -- --template react-ts
Then: cd niksho-dashboard && npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-router-dom lucide-react sonner

## Design System (extract from Juicebox)

### Colors
- App background: #FCFCFC (warm near-white)
- Card/panel background: #FFFFFF
- Sidebar/secondary: #F8F8F8
- Primary text: #000000
- Secondary text: rgba(0,0,0,0.65)
- Brand accent: #7600bc (vibrant purple)
- Accent light: #f3e8ff (light purple for hover/active)
- Borders: rgba(0,0,0,0.12)
- Subtle borders: rgba(0,0,0,0.06)
- Shadows: 0 1px 3px rgba(0,0,0,0.08)
- Medium shadows: 0 4px 12px rgba(0,0,0,0.06)
- Button hover bg: #f5f5f5
- Success: #00c65a, Warning: #f69e00, Danger: #e40014, Info: #3280ff

### Typography
- Primary font: Inter (import from Google Fonts: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap)
- Headings: 20-22px, weight 500-600
- Body: 14px, weight 400
- Small/caption: 12-13px, weight 400
- Line height: 1.5 everywhere

### Layout
- Sidebar: 220px fixed width, white bg, docked left
- Main content: padding-left 220px, bg #FCFCFC
- Right drawer: 480px, slides in from right (hidden by default)
- Border radius: 8px (cards), 4px (buttons/inputs)
- Spacing: 4px base grid (4, 8, 12, 16, 24, 32)

### Transitions
- Standard: 250ms cubic-bezier(0.4, 0, 0.2, 1)
- Sidebar collapse: 0.3s
- Drawer slide: 0.5s

## App Structure — Build ALL of these pages and components

### Sidebar Navigation (220px, left, white)
Build a collapsible sidebar with these sections:

TOP:
- Logo: "Niksho" text with a small purple diamond icon, 18px height
- Collapse toggle button (square icon with arrow, rotates on collapse)

MAIN NAV (each item: 18px icon + 14px label, 8px vertical padding):
- Dashboard (LayoutDashboard icon)
- Agent (Sparkles icon, this is the AI chat page) — ACTIVE state: light purple bg #f3e8ff, purple text #7600bc
- Pipeline (GitBranch icon)
- Requirements (FileText icon) — with badge count "12"
- Candidates (User icon) — with badge count "847"
- Submissions (Send icon) — with badge count "5"
- Sequences (Mail icon)

Divider line (1px rgba(0,0,0,0.06))

MANAGE SECTION:
- AI Agents (Bot icon)
- Analytics (BarChart icon) — collapsible with chevron
- Integrations (Grid icon)

BOTTOM (pinned to bottom):
- "Getting Started" card: title "Getting Started", "50%" badge, thin progress bar (blue fill at 50%)
- Quick Find button: search icon + "Quick Find" + keyboard shortcut "⌘K"
- Settings (Settings icon)
- Support (MessageCircle icon)
- User profile: avatar image + "NikSho Studios" name + "NikSho's Workspace" subtitle

Nav item hover: bg #f5f5f5, 250ms transition
Nav item active: bg #f3e8ff, text #7600bc, icon stroke #7600bc
Dividers between sections

### Page: Agent Chat (main feature page, route: /agent)
This is the hero page — an AI chat interface:

Header: "Niksho Agent" title (20px, weight 600)

Chat area (scrollable, flex-grow):
- Messages displayed as cards with subtle shadow
- Assistant message: "We're all set! Would you like to start sourcing?"
- Below the message: purple CTA button "Yes, start sourcing" (bg #7600bc, white text, 14px, rounded 6px)
- Timestamp below messages in 12px gray text

### Page: Dashboard (route: /)
- Header: "Dashboard" title + market badges (IN, SG)
- 6 metric cards in auto-fit grid: each white card with border, shadow, showing label/value/delta
- Pipeline summary table: columns for requirement, sourced, screened, shortlisted, etc.
- Activity feed: timestamped entries with colored dots (success/warning/danger/info)

### Page: Search (route: /search)
- Search bar with sparkle icon and placeholder "Describe your ideal candidate..."
- Filter pills showing active search criteria
- Result cards: avatar, name, title, company, location, skills tags, match score percentage

### Page: Pipeline (route: /pipeline)
- Funnel visualization for each requirement
- 7 stages: Sourced → Matched → Screened → Shortlisted → Outreached → Replied → To TL
- Horizontal bars showing count and percentage at each stage

### Page: Requirements (route: /requirements)
- 2-column grid of requirement cards
- Each card: role title, client name, market badge, urgency indicator, skills list, salary range
- "+ New Requirement" button (purple outlined)

### Page: Candidates (route: /candidates)
- Table/list of candidates with columns: name, title, skills, status badge, source, match score
- Status badges: color-coded (sourced=blue, screened=purple, shortlisted=gold, etc.)

### Page: Submissions (route: /submissions)
- Cards for submissions pending review
- Status: pending_tl, approved, rejected
- Show candidate name, requirement, submitted date

### Page: Sequences (route: /sequences)
- Email sequence cards showing: name, status (active/paused), emails sent, open rate, reply rate

### Page: AI Agents (route: /agents)
- Cards for each agent: Sourcing Agent, Screening Agent, Outreach Agent, Follow-up Agent
- Show status (active/idle), last run time, actions processed

### Slide-over Panels (right drawer, 480px)
- CandidateDetail: shows full candidate profile when clicking a candidate row
- RequirementDetail: shows full requirement when clicking a requirement card
- White bg, shadow on left edge, close button top-right

### Mock Data
Create realistic recruitment mock data:
- 8-10 requirements (Software Engineer, DevOps Lead, QA Analyst, etc.)
- 20+ candidates with names, titles, companies, skills, match scores
- Activity feed entries
- Sequence stats

## Styling Rules
- NO dark theme. Everything is light, clean, warm
- White cards with 1px rgba(0,0,0,0.08) borders and subtle shadows
- Purple (#7600bc) is the ONLY accent color — used for active states, CTAs, links
- Inter font everywhere, no other fonts
- 4px spacing grid
- Smooth 250ms transitions on all interactive elements
- Sidebar items have 6px border-radius, 8px padding
- Cards have 8px border-radius
- The overall feel should be warm, organic, and inviting — NOT cold/clinical SaaS

## File Structure
```
src/
  main.tsx
  App.tsx (layout with sidebar + outlet)
  theme.ts (all color/spacing tokens)
  index.css (Inter font import, global styles, animations)
  pages/
    Dashboard.tsx
    Agent.tsx (chat interface)
    Search.tsx
    Pipeline.tsx
    Requirements.tsx
    Candidates.tsx
    Submissions.tsx
    Sequences.tsx
    Agents.tsx
  components/
    Sidebar.tsx (full sidebar with nav, project selector, user profile)
    MetricCard.tsx
    Badge.tsx (status + market badges)
    FunnelBar.tsx
    ScoreBar.tsx
    SlideOver.tsx
    CandidateDetail.tsx
    RequirementDetail.tsx
    ChatMessage.tsx
  data/
    mockData.ts
```

Build the COMPLETE app with all pages, components, routing, and mock data. Every page should be fully implemented with real UI — no placeholders or "coming soon" text. The app should look like a production SaaS product.
```

---

## Notes

- This prompt is self-contained — just paste it into Claude Code
- It will create a fresh project from scratch (not modify existing files)
- After Claude Code finishes, run `npm run dev` and open the localhost URL
- The result should look nearly identical to the Juicebox agent dashboard
