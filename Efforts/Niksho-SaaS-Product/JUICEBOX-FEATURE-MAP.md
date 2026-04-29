---
type: spec
effort: Niksho-SaaS-Product
phase: clone-rebuild
status: walkthrough-in-progress
generated-by: claude-opus-4-7
updated: 2026-04-29
canonical-path-on-disk: /Users/nikhilkumar/Claude Workspace/exceltech-ai/Brand New Website/beroz/Clone/JUICEBOX-FEATURE-MAP.md
related:
  - "[[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone]]"
  - "[[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]]"
  - "[[Wiki/digests/Session-Beroz-Clone-Capture-2026-04-28]]"
  - "[[Efforts/Niksho-SaaS-Product/Submissions-Page-Spec]]"
walkthrough-progress:
  - "Tab 1 — All Projects: 🟢 specced (full button + workflow capture)"
  - "Tab 2 — All Agents: 🟡 partially captured (empty state only; Create Agent flow next)"
  - "Tabs 3-11: 🔴 pending (Project root, Search, Shortlist, Contacts, Sequences, Network, Analytics, Integrations, Settings, Support)"
---

# Juicebox Feature Map

> **Source of truth for the Beroz clone build.**
> Every page, button, modal, state, and flow that Claude Code must replicate.
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
8. **Workflow why** — the recruiter's mental model on this page
9. **Screenshots** — embedded ground truth from `captures/<page>/`

---

## Global

### Design tokens — CORRECTED from real captures (2026-04-28 REPORT.md)

The 2026-04-15 teardown got several values wrong. These are the **real computed-style values** captured from Juicebox by the crawler:

| Token | Original guess | Corrected value | Notes |
|---|---|---|---|
| `--bg-primary` | `#FCFCFC` | `rgb(255, 255, 255)` (white) | Pure white, not near-white |
| `--bg-secondary` | `#F8F8F8` | `lab(100 0 0)` ≈ white | Same as primary in practice |
| `--accent-primary` | `#7600bc` | **`rgb(107, 47, 141)` = `#6B2F8D`** | Slightly different shade |
| `--accent-secondary` | (not captured) | `rgb(118, 0, 188)` | Used for some accents |
| `--text-primary` | `#000000` | `rgb(51, 51, 51)` | Near-black grey, NOT pure black (33 occurrences) |
| `--text-strong` | (n/a) | `rgb(0, 0, 0)` | True black for emphasis (9 occurrences) |
| `--text-muted` | `rgba(0,0,0,0.7)` | `rgba(0, 0, 0, 0.87)` | MUI default disabled state |
| `--border` | `rgba(0,0,0,0.12)` | `lab(90.952 0 -0.0000119209)` ≈ near-white grey | 40 occurrences — dominant border colour |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | mostly `none` (61×) | **Juicebox is largely shadowless** — flat design |
| `--shadow-card` | (n/a) | `rgba(0, 0, 0, 0.1) 0px 4px 20px 0px` | Used rarely |
| `--font-body` | `Inter, system-ui, sans-serif` | **`Helvetica, Arial, "Hiragino Sans GB", STXihei, "Microsoft YaHei", "WenQuanYi Micro Hei", Hind, "MS Gothic", "Apple SD Gothic Neo", NanumBarunGothic, sans-serif`** | System stack, NOT Inter (44 occurrences vs 3× Inter) |
| `--font-system` | (n/a) | `-apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif` | 16 occurrences — secondary stack |
| `--font-base-size` | implied 14px | **16px (56 occurrences)** | Larger than typical SaaS |
| `--font-h1` | (n/a) | `22px` | 2 occurrences |
| `--font-h2` | (n/a) | `20px` | 2 occurrences |
| `--font-h3` | (n/a) | `18px` | 2 occurrences |
| `--font-small` | (n/a) | `14px` | 1 occurrence |
| `--font-weight-normal` | (n/a) | `400` (58×) | Dominant |
| `--font-weight-medium` | (n/a) | `500` (2×) | Rare |
| `--font-weight-bold` | (n/a) | `600` (3×) | Rare |
| `--radius-default` | `4px` | **`0px` dominant (40×)**, `4px` secondary (10×) | **Juicebox uses sharp corners more than rounded** |
| `--radius-circular` | (n/a) | `50%` (11×) | Avatars and chips |
| `--radius-large` | (n/a) | `8px` (1×), `14px` (1×) | Rare |
| `--transition-default` | `250ms cubic-bezier(0.4, 0, 0.2, 1)` | `transform 0.2s ease-out, color 0.2s ease-out, background-color 0.2s ease-out, stroke 0.2s ease-out, stroke-width 0.2s ease-out` | Multi-property transitions are common (11×) |
| `--transition-color` | (n/a) | `color 0.2s ease-out` | 11 occurrences |
| `--transition-all` | (n/a) | `all` | 39 occurrences |
| `--sidebar-w` | `220px` | **220px confirmed** (sidebar item width) | Fixed |
| `--breakpoint-mobile` | `600px` | TBD | Not verified in this run |

**Implications for the clone:**
- Build with **Helvetica/Arial system stack**, NOT Inter. Inter is wrong.
- Brand purple is `#6B2F8D`, not `#7600bc`.
- **Mostly shadowless** — flat design with borders, not card shadows.
- **Sharp corners (0px) are the default**, not rounded — only avatars/chips use 50%.
- 16px base font, larger than typical SaaS — recruiter-friendly.

### Sidebar (persistent global navigation)

Status: 🟢 specced (2026-04-29)

**Route:** present on every authenticated page
**Layout:** ~220px fixed width left rail, full height, scrollable. Has 3 zones (top global / project card / bottom global) and a collapsed icon-only state.

**Components (top to bottom in expanded state):**

| # | Item | Type | Behaviour |
|---|---|---|---|
| 1 | Juicebox logo | Static graphic | **Click does nothing.** Pure branding. |
| 2 | Sidebar collapse toggle | Icon button | Collapses sidebar to icon-only state |
| 3 | All Projects | Nav link | → All Projects view (workspace-level) |
| 4 | All Agents | Nav link | → All Agents view (workspace-level, separate from per-project agents) |
| 5 | Project selector dropdown | Dropdown combobox | Shows active project ("New Project" / "First Project" etc.) — clickable to switch |
| 6 | Searches header + ➕ button | Section header with action | + button creates new search |
| 6a | Searches list (sub-items) | Sub-nav links | Each saved search becomes a clickable sub-item under Searches |
| 7 | Shortlist | Nav link | Project-scoped shortlist |
| 8 | Contacts | Nav link | Project-scoped contacts |
| 9 | Sequences | Nav link | Project-scoped sequences |
| 10 | Network | Nav link with `NEW` badge | Project-scoped network graph |
| 11 | Analytics | Nav link with chevron | Expandable — has sub-items (TBD what) |
| 12 | Integrations | Nav link | Project-scoped integrations |
| — | (gap / spacer) | — | Pushes bottom items to bottom |
| 13 | Getting Started checklist | Card with progress bar | Shows X% — clickable to open onboarding modal |
| 14 | Quick Find ⌘K | Search input pill | Opens command palette |
| 15 | Settings | Nav link | → `/account?tab=user` |
| 16 | Support | Nav link | Opens chat/help (TBD) |
| 17 | User avatar + workspace name | Avatar with subtitle | Opens user menu (TBD what's in it) |

**Collapsed icon-only state (captured):** when toggled, sidebar shows only icons. Vocabulary captured (top to bottom): toggle, hamburger lines, agents-bot, sparkle (Searches), person (Shortlist), people (Contacts), envelope (Sequences), globe (Network), bar-chart (Analytics), grid (Integrations), search (Quick Find), gear (Settings), chat (Support), avatar (N).

**States captured:**
- Default expanded
- Collapsed (icon-only)
- Searches section expanded with saved searches as children
- Active item highlighted (purple text + light background)

**States not yet captured:**
- Analytics expanded (chevron clicked) — TBD when we get to Analytics
- User avatar dropdown opened — TBD
- Support clicked — TBD
- Project selector dropdown opened — TBD

**Workflow why (from Nikhil 2026-04-29):**
- The sidebar is the **primary navigation primitive** — recruiters live here
- Project context is sidebar-level, not header-level, because everything inside is project-scoped
- Top-zone items (All Projects, All Agents) are workspace-level escape hatches; everything else is project-scoped
- Bottom zone is for utility/admin (Settings, Support, profile) — not active work

**Niksho mapping:** Beroz already shipped a 3-zone sidebar in commit `423a01e` (2026-04-17) — structure is broadly compatible. Differences: Beroz uses Project as a parent over Requirements, Juicebox uses Project as the routing primitive. Per the [[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone|pivot ADR]] we adopt Juicebox's IA wholesale.

### Logo

Status: 🟢 (single behaviour confirmed)

**Behaviour:** No-op. Click does nothing. Branding only.
**Niksho impact:** in our clone the logo can either be no-op (matches Juicebox) or link to All Projects (slightly more useful). Recommend matching Juicebox's no-op.

### Getting Started Checklist Modal

Status: 🟢 specced

**Trigger:** Click the "Getting Started X%" card at bottom of sidebar
**Layout:** Centered modal overlay, ~600px wide, vertically scrolling

**Header:**
- Title: "Getting started with PeopleGPT"
- Subtitle: "Complete the following steps and learn how to harness the power of AI people search."
- Progress: "3/6" + horizontal blue progress bar

**Six steps (each is an expandable accordion):**

| # | Step | Status icon | Visual demo when expanded | CTA button |
|---|---|---|---|---|
| 1 | Run your first search | ✅ green check / ⬜ empty circle | "PeopleGPT 2.0 by Juicebox" search interface mock with example query | **Start searching** (purple) |
| 2 | View a profile | ✅ / ⬜ | Search results + right-side profile drawer (John Doe with **Spotlight / Experience / Education / Skill Map** tabs — **Skill Map has NEW badge**) | **View profiles** (purple) |
| 3 | Open talent insights | ✅ / ⬜ | **Talent Insights map** showing Top Locations: San Francisco 509, San Mateo 33, Berkeley 26 + Bay Area map view | **Let's do it** (purple) |
| 4 | Create email sequence | ✅ / ⬜ | Rich text editor with formatting toolbar (B I U bullets link), recipient with ✓ verified badge, sender card (Raquel Carlos), **purple-highlighted personalisation block in body** | **Create sequence** (purple) |
| 5 | Connect your email | ✅ / ⬜ | Gmail / Microsoft Outlook OAuth + Greenhouse / Lever / Ashby ATS integration cards | **Go to integrations** (purple) |
| 6 | Create an agent | ✅ / ⬜ | (no preview image) Copy: *"Automate your search with a smart agent. Set criteria once and let your agent keep working in the background—no need to repeat yourself."* | **Create agent** (purple) |

**Lifecycle:** When user hits 6/6, the entire Getting Started card vanishes from the sidebar permanently. If any item remains incomplete, the card persists.

**Workflow why (from Nikhil):**
- For new users — onboarding driver to ensure they touch every major feature
- Persists indefinitely until 100%, then disappears
- Each step links to its respective feature with a CTA — turns tutorial into action

**High-value insights from this modal:**

1. **Talent Insights is real and important.** Has a Top Locations map. This is the "market intelligence pre-search" pattern from [[Atlas/Business-Model/Steal-Their-Strategy]]. Confirmed shipped, not vapourware. **Capture in detail when we get to Analytics tab.**
2. **Skill Map has a NEW badge** — recently shipped feature. Tab on candidate detail. We haven't seen it; capture during candidate-detail walkthrough.
3. **Email composer uses purple-highlighted personalisation blocks inline.** Visual treatment for AI-generated text. Worth replicating.
4. **Empty-state-as-tutorial** is a strong UX pattern — show the user what the feature does via mock screenshots, then CTA to try it. Apply to all our empty states.

### API endpoint manifest (from REPORT.md)

102 unique endpoints captured. Top product routes:
- `GET /api/user/org` (58 calls — workspace org info)
- `GET, PATCH /api/user` (53 calls — user profile)
- `GET, PATCH /api/search` (40 calls — search CRUD)
- `GET, PATCH /api/contact` (25 calls — contact CRUD)
- `GET /api/sequence/list` (36 calls — sequences listing)
- `GET /api/user/org/team` (36 calls — team members)
- `GET /api/invites/pending` (25 calls — pending invitations)
- `GET, POST /api/integration` (19 calls — integrations CRUD)
- `GET, POST /api/activities` (23 calls — activity log)
- `GET /api/tags` (21 calls — tags)
- `GET /api/app/params` (36 calls — app config)
- `GET /_next/data/<hash>/<route>.json` (Next.js Pages Router SSR data per page)

**Backend extension list for Beroz:** the routes above need equivalents in Beroz's FastAPI layer. Diff this manifest against existing Beroz routes to produce the extension ticket list.

---

## Authentication

### Login page

Status: 🔴 *(not yet walked through — defer to next session)*

### Signup / onboarding flow

Status: 🔴 *(observation: Getting Started checklist is the primary onboarding mechanism, persists post-signup)*

---

## Core App Pages

### All Projects (workspace-level)

Status: 🟢 specced (2026-04-29)

**Route:** Currently URL is `/project/<id>` (which displays workspace-level All Projects view, despite the path). May redirect from a workspace-level path. Verify in next session.

**Identity (from Nikhil):**
> "Cockpit-style interface to oversee and execute various project-related tasks. Create new projects, modify existing ones, track their progress."
>
> "Centralised page allowing recruiters to conveniently view all projects in one place. They visit to view past projects, commence new ones, or edit existing."

**Layout:**
- Top: Page title "Projects" + **Create new project +** button (top-right, purple)
- Below: tabs (currently only "My Projects" visible — there may be other tabs for collaborator-shared projects, TBD)
- Search bar across project title, owner name, collaborator name
- Section heading "My Projects"
- Projects table (main content, ~70% width)
- Right column promo cards (~30% width):
  - Introducing Agent card
  - Connect your ATS card

**Projects table columns (left to right):**

| Column | Content | Sortable | Notes |
|---|---|---|---|
| Title | Project icon (people-group) + project name + **SELECTED** badge if active + owner name subtitle | **Yes — alphabetical asc/desc** | SELECTED badge marks the currently-active project (= where new searches go by default) |
| Progress | 👥 N + ✉️ M counters | (?) | 👥 hover = "Shortlisted" / ✉️ hover = "Contacted" |
| Created on | Date (e.g. "April 29") | **Yes — date asc/desc** with arrow indicator | |
| Collaborators | Number or "-" if none | (?) | |
| Status | Green "Active" badge | (?) | Other states: Inactive, Closed (TBD via Close Project action) |
| (no header) | ⋯ 3-dot menu icon | n/a | Per-row actions menu |

**Sortable column behaviour:** Clicking a column header toggles asc/desc. Active sort shows ↑ or ↓ arrow next to the column name.

**Per-row 3-dot menu (4 items in this exact order):**

| # | Item | Icon | Action |
|---|---|---|---|
| 1 | Edit Project | ✏️ pencil | Opens Edit Project modal |
| 2 | View Hidden Profiles | 👁️🚫 eye-slash | Opens list of hidden candidates for this project |
| 3 | Close Project | ⊟→ box-arrow | Status transition Active → Closed (project archived but viewable). **Behaviour TBD — don't click in walkthrough.** |
| 4 | Delete Project | 🗑️ trash | Permanent removal. **Destructive — never click in walkthrough.** |

**UX note:** Edit/View are non-destructive (top), Close/Delete are state-changing (bottom). Delete in last position protects against fat-finger mistakes. Worth replicating in clone.

**Edit Project modal — 4 fields:**

| Field | Type | Notes |
|---|---|---|
| Project Title | Text input (required) | Free-form rename |
| Access Level | Radio (required, binary) | **Shared** (visible to everyone in your organization) vs **Private** (only visible to you, your collaborators, and admin) |
| Collaborators | Multi-select dropdown (optional) | "These team members will be assigned to this project with you" — populated with workspace team members |
| Change Owner | Single-select dropdown | "Transfer ownership of this project to another team member" — populated with workspace team members |

Modal chrome: title "Edit Project" + ✕ close. Bottom-right: **Save Changes →** (purple primary button).

**Click-into-project behaviour (state-restoration!):**
- Clicking a project row navigates to `/project/<id>/search/<search_id>` — the **most recent search you ran in that project, with its results state hydrated**
- If no searches exist yet, lands on empty Searches state
- This is a real UX behaviour worth replicating: project remembers state

**Right column — Introducing Agent card:**
- Mock candidate preview: "Is Sarah's profile a good fit?" → Sarah Markowitz, Product Manager at Waymo, with skill badges OpenCV / Hadoop / Research, plus a flag: "Not enough JS experience, we need 3+ years"
- Title: "Introducing Agent"
- Subtitle: "Meet your smart AI recruiting partner"
- Action: **Learn more** link

**Right column — Connect your ATS card:**
- Title: "Connect your ATS"
- Subtitle: "Import jobs from 42 platforms."
- 15 ATS logos in 3×5 grid: Greenhouse, Workable, Lever, JobVite, ICIMS, Bullhorn, Salesforce, JazzHR, Ashby, Recruiterflow, and more (full list TBD on Integrations tab)
- Action: **Connect ATS →** link
- Each logo individually (?) — TBD whether each is clickable to start that integration's OAuth, or whether the card is one CTA

**Empty state:** when no projects exist, table area is empty. Right column promos still show. CTA is **Create new project +**.

**Workflow why (Niksho mapping):**
- **Project = flexible grouping primitive** in Juicebox. Can be named after a Requirement, a Client, a Hiring Manager, or anything else. Recruiters choose their own organising convention
- **For Niksho's agency context:** Project most naturally maps to **Requirement / new role** (e.g. "Software Engineer", "Network Engineer"), but agencies COULD use it for Client (one project per client engagement) or Manager
- **First action varies by user intent:** create new, edit existing, search collaborator by name, browse projects — this page serves all four

**Hidden vs Rejected — important Niksho design distinction:**

| Concept | Owner | Formality | Persistence | Reason text | UI cost to undo |
|---|---|---|---|---|---|
| **Hidden** (Juicebox) | Recruiter | Soft / informal | Per-user view filter | None | Easy (View Hidden Profiles list) |
| **Rejected** (Niksho-existing per Submissions-Page-Spec) | TL | Formal | Database, all users see | Required text | Hard (re-surface on different requirement) |

**Both should exist** in the SaaS multi-tenant build: Hidden for declutter, Rejected for formal placement decisions.

**Open questions parked for later:**
1. Where in the UI does a recruiter actually hide a profile? Nikhil couldn't find the action in Juicebox's UI. (TBD on search results / candidate detail walkthrough)
2. What does "Close Project" do exactly? Status transition to Inactive/Closed — what's the UI consequence? (don't click in walkthrough; capture from spec or test in dev account)
3. View Hidden Profiles list when populated — what's its layout? (TBD)
4. Are the 15 ATS logos individually clickable, or is "Connect ATS →" the only entry point? (TBD on Integrations tab)
5. Are there other tabs alongside "My Projects" (e.g., "Shared with me", "Archived")? (TBD when more projects exist or on dev account)

**Captured screenshots:** see this Cowork session 2026-04-29 (chat history) — workflow doctor results, 3-dot menu open, Edit Project modal, Getting Started accordion expansion states.

### All Agents (workspace-level)

Status: 🟡 partial — empty state captured, Create Agent flow pending

**Route:** `/agents` (workspace-level — distinct from `/project/<id>/agents` which is project-scoped) — **verify in next session**

**Identity:** workspace-level agent management. Lists every autonomous agent across all projects in the workspace.

**Empty state captured (new account, 0 agents):**

- **Title:** "Welcome to Agents on Juicebox"
- **Subtitle:** "Automate your recruiting workflow with AI. Learn more about agents [here ↗]"
- **Visual demo block** (mock data, not real):
  - "Profiles Ready for Review (35)" review queue panel with sample candidate rows (Dean Wiegand — Senior Software Engineer at Acme.xyz — 100% match, plus more)
  - Two floating agent badges:
    - Pink/purple "**Project manager agent**" — "35 profiles ready for review"
    - Blue "**Software engineer agent**" — "35 profiles ready for review"
  - Sub-panel: "What do you think about this profile?" with sample candidate (Tonya Rempel — Senior Data Analyst at Garner Series B) + 👍 / 👎 reaction buttons
- **CTA:** Purple "**+ Create Your First Agent**" button (centered)

**UX patterns to replicate:**
1. **Teach via mockup** — show what agents look like when populated, not just describe them in text
2. **Two named example agents** — "Project manager agent" + "Software engineer agent" — teaches that agents are role-specific
3. **👍/👎 thumbs feedback** on profiles — agent training mechanism. Maps to Niksho's existing TL approve/reject, but at a different layer (training agents, not deciding placements)

**Populated state:** TBD — we're about to capture by creating the first agent

**Create Agent flow:** TBD — about to walk

**API:** `/api/agent/list`, `/api/agent` (POST, GET, PATCH) — TBD verify in walkthrough

### Agent Home / Dashboard landing
Status: 🔴 *(no separate dashboard page exists — clicking a project goes directly to its Searches view; All Projects acts as the workspace-level landing)*

### Project root / Project Overview
Status: 🔴 *(observation from walkthrough: clicking a project row redirects to `/project/<id>/search/<last-search-id>` — there is NO separate "project overview" page. The Searches view IS the project landing.)*

**Implication for the clone:** we don't need to design a separate Project Dashboard. Saves a page in the spec.

### Search
Status: 🔴 *(next priority — biggest gap from crawl)*

**Sub-modes (confirmed 4 not 3):**
- Find Similar (NL profile description → similar people)
- Job Description (raw JD → parsed filters → results)
- Boolean (Boolean string syntax → results) — this is the 4th mode, missing from earlier teardowns
- Select Manually (structured form input)

### Search Results
Status: 🔴 *(critical — most-time-spent surface for recruiters)*

### Candidate Detail
Status: 🟡 *(partial — captured during 04-28 walkthrough kickoff)*

**From single screenshot of Dan Kaplun's drawer (2026-04-28):**
- Drawer chrome: ← back, → forward, ⤡ expand, ⋯ menu, ✕ close
- Header: name + LinkedIn / GitHub / Stack Overflow / X icons
- Location, current company badge, education badge
- **Profile tabs:** Overview / Experience / Education / **Skills** / *(Skill Map — NEW badge per Getting Started modal)*
- Skills tab content: GitHub repos with star counts (jsonresume/resume-cli ⭐6, JaneaSystems/nodejs-mobile ⭐4, etc.) — **GitHub-derived skills inference**
- Owned Repositories section (in Skills tab)
- Bottom action bar: **Shortlisted** status dropdown + purple **Create First Sequence** button
- Right-side panel tabs: Notes / Sequences / Activity / Projects / Tasks
- Notes tab empty state: "Type your note here" + Attach files / drag-drop + Add note button + "No notes added yet"

**Pending:** full walkthrough with all profile tabs explored, Skill Map captured, status dropdown options enumerated, right-panel tab content walked.

### Shortlist
Status: 🔴

### Sequences (list)
Status: 🟡 partial — gating modal captured (Connect Mailbox)

### Sequence Detail / Editor
Status: 🔴

### Outreach Composer
Status: 🔴

### Contacts
Status: 🔴

### Analytics
Status: 🔴

**Sub-tabs:** TBD — sidebar item has chevron suggesting it's expandable

### Talent Insights
Status: 🔴 *(visible in Getting Started modal — Top Locations map is the centrepiece. Niksho-relevant for client-pitch UX.)*

### Network
Status: 🔴

### Integrations
Status: 🔴

### Agent Chat
Status: 🔴 *(may not be a separate surface — Juicebox may use the search bar as the chat surface)*

---

## Settings (under `/account?tab=<sub>`)

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

### Getting Started Checklist
Status: 🟢 (see Global section above)

### Edit Project
Status: 🟢 (see All Projects section above)

### Connect Mailbox (sequencing gate)
Status: 🟢 (captured 2026-04-28)

**Trigger:** Click "Add to Sequence" / "New Sequence" / similar without connected mailbox
**Layout:** Centered modal, ~500px

**Content:**
- Title: "Create sequence" (top left)
- ✕ Close (top right)
- Centered card with:
  - Heading: "Connect your mailbox to start sequencing"
  - Three OAuth buttons stacked vertically:
    - **Connect Gmail** (with Google G icon)
    - **Connect Outlook** (with Microsoft icon)
    - **Connect IMAP** (with envelope icon)
  - Link: "Having trouble connecting?" → docs
  - Link: "Do this later" → dismisses modal
  - Subtitle: "Manage mailbox settings in the **Integrations** page"

**Behaviour:** completing OAuth dismisses the modal and proceeds to actual sequence editor. "Do this later" dismisses but doesn't proceed (sequence creation cancelled).

**Niksho relevance:** Beroz already has Microsoft Graph integration for ExcelTech's 10 inboxes — the gate is reversed. SaaS multi-tenant Phase 4 needs equivalent gate for tenants without connected mailbox.

### Quick Find (⌘K)
Status: 🔴

### Create Project
Status: 🔴

### Create Sequence (post-mailbox)
Status: 🔴

### Add Contact
Status: 🔴

### Share / Invite
Status: 🔴

### Status Dropdown (candidate)
Status: 🟡 *(confirmed exists at bottom of candidate detail drawer; option set TBD)*

### Filter / Criteria editor
Status: 🔴

---

## Critical flows (end-to-end)

### Flow 1 — First-time signup to first search
Status: 🔴

### Flow 2 — Run a search and shortlist candidates
Status: 🔴 *(next walkthrough priority)*

### Flow 3 — Build a sequence and send personalised outreach
Status: 🔴 *(post-mailbox-gate)*

### Flow 4 — Approve / forward a candidate to a hiring manager
Status: 🔴

*(Juicebox's equivalent of Beroz's Submit-to-TL. May not exist as a first-class flow since Juicebox is built for internal TA, not agencies. The Niksho moat lives here.)*

### Flow 5 — Set up a 24/7 agent
Status: 🟡 *(empty state captured; Create Agent flow about to walk)*

### Flow 6 — Connect an ATS / integration
Status: 🔴

---

## Component inventory

| Component | Variants observed | First seen on |
|---|---|---|
| `SidebarNavItem` | default, active (purple text + light bg), with-badge (NEW) | Sidebar |
| `SidebarSection` | expanded, collapsed, with-children | Sidebar (Searches, Analytics) |
| `ProjectSelectorDropdown` | closed, open (TBD) | Sidebar |
| `IconOnlyButton` | sidebar collapse, ⋯ row menu, ➕ create | Sidebar, table rows |
| `Button (Primary)` | default, hover, disabled, loading TBD | "Create new project", "Create agent" |
| `Button (Link)` | "Learn more", "Connect ATS →" | All Projects right column |
| `TableHeader` | sortable (asc/desc with arrow), non-sortable | All Projects table |
| `TableRow` | default, selected (with SELECTED badge), hovered | All Projects |
| `Badge` | SELECTED (purple), Active (green), NEW (purple/pink) | Projects table, sidebar |
| `IconCounter` | with hover tooltip (single-word label) | Progress column |
| `RowActionMenu (3-dot)` | 4 items, top non-destructive / bottom destructive | All Projects |
| `Modal` | centered, ~500-600px wide, ✕ close | Edit Project, Connect Mailbox, Getting Started |
| `RadioGroup` | binary (Shared/Private) | Edit Project |
| `MultiSelectDropdown` | empty state ("No collaborators selected") | Edit Project |
| `SingleSelectDropdown` | with current value | Edit Project (Change Owner) |
| `OAuthButton` | with provider logo + "Connect X" label | Connect Mailbox modal |
| `EmptyStateMockup` | hero text + visual demo + CTA | All Agents empty state |
| `OnboardingChecklist` | with progress bar + expandable accordions + step CTAs | Getting Started modal |
| `PromoCard` | with mockup preview + heading + CTA | All Projects right column (Introducing Agent, Connect your ATS) |
| `Drawer (right)` | candidate detail (TBD: width, scroll behaviour) | Search results |

---

## Open questions parked for later

1. **Hidden profile creation UI:** Where in Juicebox's UI does a recruiter mark a profile as hidden? Nikhil couldn't find the action. TBD on search results / candidate detail walkthrough.
2. **Close Project consequence:** What's the UI state after Active → Closed transition? Don't click in walkthrough; verify on dev account or from spec.
3. **View Hidden Profiles populated state:** Layout when there's something to show.
4. **ATS logos clickability:** Are the 15 logos in the right-column ATS card individually clickable, or only "Connect ATS →"?
5. **All Projects additional tabs:** Are there hidden tabs alongside "My Projects" (Archived, Shared with me, etc.)?
6. **Project selector dropdown opened state:** what does it look like — a list of projects? With search?
7. **User avatar dropdown:** what menu items are inside?
8. **Support sidebar item:** chat widget? help center? both?
9. **Skill Map (NEW):** entire feature TBD — confirmed exists as 5th profile tab via Getting Started modal preview, but content not seen.
10. **Analytics expandable:** sub-items under chevron — TBD when we walk Analytics.
11. **All Agents vs project-scoped agents:** does the same agent appear in both views, or are they different concepts?
12. **Agent-training thumbs:** captured in mockup, but actual workflow TBD.

---

## Capture index

Crawl captures from 2026-04-28 in `/Brand New Website/beroz/Clone/captures/`:

| Page | Slug |
|---|---|
| Workspace landing (`/`) | `root` |
| All Projects (workspace) | `root` (same — but note: routes through `/project/<id>` paradoxically) |
| Account (Settings) | `account` |
| Project root | `project_sbw05wbolu0g41clbuee` |
| `/project/<id>/agents` | `project_sbw05wbolu0g41clbuee_agents` |
| `/project/<id>/analytics` | `project_sbw05wbolu0g41clbuee_analytics` |
| `/project/<id>/contacts` | `project_sbw05wbolu0g41clbuee_contacts` |
| `/project/<id>/integrations` | `project_sbw05wbolu0g41clbuee_integrations` |
| `/project/<id>/network` | `project_sbw05wbolu0g41clbuee_network` |
| `/project/<id>/search/` | `project_sbw05wbolu0g41clbuee_search` |
| `/project/<id>/sequences` | `project_sbw05wbolu0g41clbuee_sequences` |
| `/project/<id>/shortlist` | `project_sbw05wbolu0g41clbuee_shortlist` |

**Not captured by crawl, captured by walkthrough so far:**
- `/agents` (workspace-level All Agents) — empty state only
- Getting Started modal (Sidebar overlay)
- Edit Project modal
- Sidebar collapsed state
- Candidate detail drawer (partial — single screenshot)

**Major gaps to fill in remaining walkthrough:** Search results state, Sequence editor (post-mailbox), Settings sub-tabs, Network graph, Analytics drill-down, Talent Insights, Quick Find palette, Project selector dropdown, User avatar dropdown, Status dropdown, Filter/Criteria editor.

---

## Cross-references

- Pivot ADR: [[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone]]
- 2026-04-28 Capture session digest: [[Wiki/digests/Session-Beroz-Clone-Capture-2026-04-28]]
- Earlier teardown: [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]]
- Niksho proprietary layer (Phase 4): [[Efforts/Niksho-SaaS-Product/Submissions-Page-Spec]]
- Beroz current state: [[Efforts/ExcelTech-Automation/Overview]]
- Self-Diagnosing Crawler concept: [[Wiki/concepts/Self-Diagnosing-Crawler]]
- Crawl-Walkthrough-Capture Pipeline concept: [[Wiki/concepts/Crawl-Walkthrough-Capture-Pipeline]]
