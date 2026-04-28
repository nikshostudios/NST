---
type: spec
effort: Niksho-SaaS-Product
phase: clone-rebuild
status: scaffold-only
generated-by: claude-opus-4-7
updated: 2026-04-28
canonical-path-on-disk: /Users/nikhilkumar/Claude Workspace/exceltech-ai/Brand New Website/beroz/clone/JUICEBOX-FEATURE-MAP.md
related:
  - "[[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone]]"
  - "[[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]]"
  - "[[Efforts/Niksho-SaaS-Product/Submissions-Page-Spec]]"
---

# Juicebox Feature Map

> **Source of truth for the Beroz clone build.**
> Every page, button, modal, state, and flow that Claude Code must replicate.
>
> **Filling this in is Phase 2 of the pivot ADR.** Phase 1 (Playwright capture) feeds the *what*. The live walkthrough or Loom narration feeds the *why*.
>
> Status legend per section:
> - 🔴 not started — no captures, no notes
> - 🟡 captured — DOM/screenshots/styles in `captures/`, no workflow narrative yet
> - 🟢 specced — both captures and workflow why are documented; ready for Claude Code to implement
> - 🔵 built — Claude Code has implemented; pending verification
> - ✅ verified — built, tested end-to-end, matches Juicebox

---

## How to read this document

Each page or flow section has the same structure:

1. **Route** — Juicebox URL pattern (and the corresponding Beroz route once built)
2. **Layout** — sidebar / main / drawer dimensions, breakpoint behaviour
3. **Components** — every distinct UI piece on the page, with variants
4. **Buttons & actions** — every interactive element, what it does, what it calls
5. **States** — empty / loading / hover / focus / active / disabled / error / populated
6. **Modals & overlays** — every dialog or drawer this page can open
7. **API calls** — every backend request this page fires
8. **Workflow why** — the recruiter's mental model on this page; why it's structured the way it is. **This is the section that requires live narration; the crawler cannot fill it in.**
9. **Screenshots** — embedded ground truth from `captures/<page>/`

---

## Global

### Design tokens

*(Pre-filled from the 2026-04-15 teardown — verify in Phase 1 capture and update if Juicebox has changed.)*

| Token | Value | Notes |
|---|---|---|
| `--bg-primary` | `#FCFCFC` | Near-white app background |
| `--bg-secondary` | `#F8F8F8` | Slightly darker zone |
| `--bg-card` | `#FFFFFF` | White cards on the near-white background |
| `--accent-primary` | `#7600bc` | Juicebox purple |
| `--text-primary` | `#000000` | Black text |
| `--text-muted` | `rgba(0,0,0,0.7)` | Muted black |
| `--border` | `rgba(0,0,0,0.12)` | Card borders, dividers |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Card shadow |
| `--font-body` | `Inter, system-ui, sans-serif` | Primary UI |
| `--font-mono` | `Geist Mono, ui-monospace` | Data-dense |
| `--radius-sm` | `4px` | Buttons, inputs |
| `--radius-md` | `8px` | Cards |
| `--transition` | `250ms cubic-bezier(0.4, 0, 0.2, 1)` | Standard |
| `--sidebar-w` | `220px` | Fixed |
| `--drawer-w` | `480–500px` | Right drawer |
| `--breakpoint-mobile` | `600px` | Mobile fallback threshold |

### Sidebar (persistent global navigation)

Status: 🔴

**Route:** present on every authenticated page
**Layout:** 220px fixed width, full height, scrollable
**Components:** *(populate from capture)*
**Buttons & actions:** *(populate from capture: collapse toggle, nav items, project selector, Quick Find ⌘K, Getting Started checklist, user avatar)*
**States:** *(populate)*
**Workflow why:** *(populate from live walkthrough — why is the project selector in the sidebar vs. the header? Why is Getting Started persistent?)*

---

## Authentication

### Login page

Status: 🔴

**Route:** `/` (unauthenticated) or `/login`
**Layout:** Split-screen on desktop (left = marketing, right = OAuth form). Single-column on mobile (≤600px).
**Components:** *(populate)*
**Buttons & actions:**
- Continue with Google → Firebase Auth → redirects to `/project/<id>` or onboarding
- Continue with Email
- SSO / SAML
- *(populate)*

**Workflow why:** *(populate)*

### Signup / onboarding flow

Status: 🔴 *(May be the same page as login with conditional UI; verify in capture)*

**Steps:**
1. *(populate from `interact.ts` trace)*

---

## Core App Pages

### Agent Home / Dashboard landing
Status: 🔴

### All Projects
Status: 🔴

### Project Overview
Status: 🔴

### Search
Status: 🔴

*(THE most important page — the search-first interface that defines Juicebox's UX. Highest priority for capture and narration.)*

**Sub-modes:**
- Find Similar (NL profile description → similar people)
- Job Description (raw JD → parsed filters → results)
- Select Manually (structured form input)
- *(verify these are actually three distinct components in Juicebox; the 04-27 Beroz test found we'd collapsed them into one — that was the bug)*

### Search Results
Status: 🔴

**Components:** *(populate: result row layout, candidate avatar, name, current title/company, match score badge, criteria breakdown, status dropdown, action buttons)*

**Workflow why:** *(populate — this is where the recruiter spends most of their time. Why is criteria scoring inline vs in a drawer? Why this status set? Why this filter pill UX?)*

### Candidate Detail
Status: 🔴 *(Drawer or full page — verify which)*

### Shortlist
Status: 🔴

### Sequences (list)
Status: 🔴

### Sequence Detail / Editor
Status: 🔴

### Outreach Composer
Status: 🔴

### Contacts
Status: 🔴

### Analytics
Status: 🔴

**Sub-tabs:** *(populate from capture)*

### Talent Insights
Status: 🔴

### Integrations
Status: 🔴

### Agent Chat
Status: 🔴 *(The conversational AI surface — start sourcing, review profiles, refine criteria)*

---

## Settings

### User Profile
Status: 🔴

### Team Management
Status: 🔴

### Billing
Status: 🔴

### Workspace / Organisation
Status: 🔴

### Notifications
Status: 🔴

### API Keys / Developer
Status: 🔴

---

## Modals & overlays (cross-page)

### Quick Find (⌘K)
Status: 🔴

### Create Project
Status: 🔴

### Create Sequence
Status: 🔴

### Add Contact
Status: 🔴

### Share / Invite
Status: 🔴

### Status Dropdown (candidate)
Status: 🔴 *(The Shortlisted / Contacted / Interviewing / etc. control)*

### Filter / Criteria editor
Status: 🔴

---

## Critical flows (end-to-end)

### Flow 1 — First-time signup to first search
Status: 🔴

**Steps:**
1. Land on login page
2. Continue with Google
3. *(populate from `interact.ts` trace — onboarding steps, first project creation, first search prompt)*

**Side effects:** *(API calls, localStorage writes, Firebase Auth tokens, etc.)*

**Workflow why:** *(populate — what does Juicebox push the new user toward first? What's the activation event?)*

### Flow 2 — Run a search and shortlist candidates
Status: 🔴

### Flow 3 — Build a sequence and send personalised outreach
Status: 🔴

### Flow 4 — Approve / forward a candidate to a hiring manager
Status: 🔴

*(Juicebox's equivalent of Beroz's Submit-to-TL. May not exist as a first-class flow since Juicebox is built for internal TA, not agencies — verify and document the gap. This is exactly where the Niksho moat starts to live.)*

### Flow 5 — Set up a 24/7 agent
Status: 🔴

### Flow 6 — Connect an ATS / integration
Status: 🔴

---

## Component inventory

A flat list of every reusable component observed across pages, with variants.

| Component | Variants observed | First seen on |
|---|---|---|
| `CandidateCard` | *(default, shortlisted, contacted, hovered)* | *(page)* |
| `MatchScoreBadge` | *(populate)* | |
| `FilterPill` | | |
| `SidebarNavItem` | *(default, active, with-badge)* | |
| `ButtonPrimary` | *(default, hover, disabled, loading)* | |
| `Drawer` | *(candidate detail, sequence editor)* | |
| *(populate)* | | |

---

## Open questions for the live walkthrough

These are things the crawler cannot answer. We need narration / answers from someone who uses Juicebox.

1. *(populate as we discover them — the existence of this list is the signal we're capturing the **why**, not just the **what**)*

---

## Capture index

Mirror of `captures/` folder. One row per page captured.

| Page | DOM | Screenshots | Computed styles | Trace | Date |
|---|---|---|---|---|---|
| *(populated by `analyze.ts`)* | | | | | |

---

## Cross-references

- Pivot ADR: [[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone]]
- Earlier teardown: `NST/research/2026-04-14-juicebox-teardown.md` (design tokens already extracted)
- Earlier crawl session: [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]] (43 pages captured)
- Niksho proprietary layer (Phase 4): [[Efforts/Niksho-SaaS-Product/Submissions-Page-Spec]]
- Beroz current state: [[Efforts/ExcelTech-Automation/Overview]] (milestone 5b)
