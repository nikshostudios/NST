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
  - "Tab 2 — All Agents: 🟢 specced (FULL Agent creation pipeline captured 2026-04-29: Launch modal → setup → live parsing → calibration loop → sequence selection + creation + editor → daily volume → approval mode → start sourcing)"
  - "Tabs 3-11: 🔴 pending (Project root → Searches, Shortlist, Contacts, Sequences list+editor, Network, Analytics, Integrations, Settings sub-tabs, Support)"
  - "Side-effects of the Agent walkthrough: also captured Edit Filters modal (12 categories — answers Hidden Profile question partially), Edit Criteria modal (rank-ordered + pinnable), Review Profiles carousel, Create Sequence template chooser, Sequence editor with full toolbar, Skill Map (NEW feature confirmed), Why-we-matched citations pattern"
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

# 🆕 Walkthrough Capture Log — 2026-04-29 Session 2

The most important capture batch of the project so far. The complete Agent creation pipeline (Juicebox's flagship feature) was walked end-to-end with full narration. ~12 new UI surfaces captured in one batch. Key strategic findings live in this section.

## Strategic findings worth quoting verbatim for the build

**1. Calibration loop pattern (the most valuable UX insight).** Before an agent commits to autonomy, the user MUST approve/reject 3 profiles to teach the quality bar. UI footer text: *"This only calibrates the agent and does not send emails."* This is genuine UX wisdom — the human sets the threshold by example, not by parameters. **Replicate exactly.**

**2. Live NL query parsing with confirmation chips.** When you type a natural-language query, structured fields get extracted live and shown as ✓ chips (Location, Job Title, Years of Experience, Industry, Skills). Each chip starts grey and turns green/checked as it's confirmed. **This solves Bug #5 from the 04-27 punch list (Source Now passes 5 words).** Critical to replicate.

**3. Why-we-matched with numbered citations.** Each match criterion shows numbered citations [1] [2] linking to specific evidence in the profile (Skills tab, Experience entries). Trust-building UI for AI scoring. **Beroz currently shows numbers without provenance — this is the missing piece.**

**4. Criteria are rank-ordered + pinnable, not binary.** Most-Important → Least-Important continuum, drag-to-reorder, pin icon for mandatory. More nuanced than binary required/preferred. Update Niksho scoring model accordingly.

**5. Daily volume as Low/Balanced/High not number input.** Three preset cards (15/25/35) instead of asking for a number. Friendlier for non-power users.

**6. Confidence-building over-explanation.** The whole agent flow over-explains AI behaviour: calibration loop, citations, "doesn't send emails" reassurance, parsing chips, criteria visibility. Juicebox's playbook is: when AI is opaque, over-communicate. **Apply this everywhere.**

---

## Tab 2 — All Agents — FULL FLOW (specced)

### Launch New Agent Modal

Trigger: Click "+ Create Your First Agent" or "Create new agent +"
Layout: Centered modal, ~500-600px

| Field | Type | Default | Notes |
|---|---|---|---|
| Agent Title (required) | Text input | "New Agent N" auto-incremented | |
| Access Level (required) | Radio binary | Shared | Private adds 🔒 padlock to card |
| Collaborators (optional) | Multi-select dropdown | "No collaborators selected" | Subtitle has "project" copy bug — UX inconsistency, **don't perpetuate in clone** |

CTA: **Create Agent →** (purple). Close: ✕

**Note:** structurally identical to Edit Project modal. Reuse a single `EntityCreationForm` component for both Projects and Agents.

### Edit Agent Modal (post-creation)

Same as Launch but with one extra field:
- **Change Owner** dropdown (current owner: Nikhil Kumar) — "Transfer ownership of this agent to another team member"
- CTA changes to "Save Changes →"
- Window title: "Edit Agent" (correctly named — only Launch has the "project" copy bug)

### Agent Setup Screen (project-equivalent landing)

Route: `/agent/<id>` (parallel to `/project/<id>`)

**Sidebar context (changes when inside an Agent):**
- All Projects, All Agents (top, unchanged)
- Agent selector dropdown ("Nikhil Agent" with selector arrow)
- ✦ **Agent** (active, purple — replaces "Searches" in project mode)
- 👤 Shortlist
- ─── divider ───
- Standard global items: Contacts, Sequences, Network NEW, Analytics ▶, Integrations
- ─── divider ───
- Bottom utility items unchanged

**Project selector dropdown opened state (newly captured):**
- "Find projects" search input
- ✦ Nikhil Agent (current, with sparkle icon, highlighted)
- 👥 New Project (with people icon)
- ─── divider ───
- "View all projects →" link

**Page content:**
- Greeting: "Hi Nikhil, please **describe the profile** you're looking for."
- Subtitle: example NL query showing the format
- **Description input** "Describe who you're looking for..." with → submit arrow
- 5 example queries (same global pool as Searches page)

**Two visual states:**
- **Empty/blurred state:** when sidebar dropdown is open OR when navigating into the agent first time → no purple band, no examples shown (just input + submit)
- **Active/focused state:** when input is focused → purple ring around input + 5 example queries shown below

### Live Query Parsing State (CRITICAL — newly captured)

When user types and submits a NL query, the page transitions to a parsing state:

- Input retains the query text
- Below the input: **field extraction chips** showing what's being parsed
  - Each chip: small green checkmark icon + field name (Location, Job Title, Years of Experience, Industry, Skills)
  - Chips appear progressively as the LLM extracts each field — gives a sense of live processing
- Below chips: **"Processing your search criteria..."** loading text
- Submit arrow becomes purple loading indicator

This is the live parsing UX that solves Bug #5 from the 04-27 punch list. **Replicate exactly in Beroz Search.**

### Initial Matches Confirmation

After parsing, page transitions to:
- "I've found initial matches. Please **review these profiles** and share your feedback."
- "Approve all three profiles to continue."
- **Review Profiles ↗** (purple primary button)
- **Edit Filters** link (below)

This is the entry to the **calibration loop**. The agent has run a preliminary search but won't proceed to autonomous mode until user approves 3 profiles.

### Edit Filters Modal (deep filter editor — 12 categories)

Trigger: Click "Edit Filters" link
Layout: Centered modal ~1100px wide, with sidebar + main content

**Header:**
- Title: "Edit Your Search Filters"
- Right side: "**1.3k matches**" live counter + **Save Changes →** purple button

**Left sidebar — 12 category navigation:**
| Icon | Category | Has active filter (radio indicator) |
|---|---|---|
| ⚙️ | General | yes |
| 📍 | Locations | yes |
| 💼 | Job | yes |
| 🏢 | Company | no |
| 🏭 | Industry | no |
| 💲 | Funding & Revenue | yes |
| ➕ | Skills or Keywords | no |
| ⚡ | Power Filters | no |
| ⭐ | Likely to Switch | no |
| `</>` | Developer Data | no |
| 🎓 | Education | no |
| 🌐 | Languages | no |
| Tt | Boolean & Name | no |

Footer of sidebar: "☐ Hide inactive filters" checkbox

**Main content (showing General):**
- **Min Experience (Years)** input · **Max Experience (Years)** input
- **Required Contact Info** with "Match Any" dropdown · "Select contact info types" dropdown
- **Exclude Profiles** section with 4 checkboxes, each with two scope dropdowns:
  - ☑ **Hidden** by [anyone in this project ▼] [at any time ▼] ← **THIS IS WHERE HIDDEN PROFILES ARE EXCLUDED FROM SEARCH**
  - ☐ **Viewed** by [anyone in this project] [at any time]
  - ☐ **Shortlisted** by [anyone in this project] [at any time]
  - ☐ **Contacted** by [anyone in this project] [at any time]
- **Filter by Network** ⓘ — "None" dropdown
- **Location(s)** section:
  - "Within 25 miles" dropdown
  - "Clear all · Select Preset" links (top-right)
  - Input: "Examples: San Francisco / United States / NYC / California"
  - Already-added chip: "🌆 San Francisco ✕"

**Niksho-relevant insight:** the Exclude Profiles section is sophisticated dedup. Both **scope** (anyone vs me vs collaborators) AND **timing** (any time vs last 30 days etc.) are configurable. Mirror this in our SaaS Phase 4.

### Review Profiles Carousel (3-profile calibration)

Layout: Three-column full-page surface

**Top bar:**
- ← back arrow + "Review Profiles" title (left)
- Profile counter "Profile 1/3" with ← / → arrows (right)

**Left column (~50% — Full profile):**
- **Profile header:** Name + "Full profile" badge + LinkedIn / X icons
- Location string · Current company badge · Education badge
- **Profile tabs (5 captured):** Experience / Education / Skills (Skill Map confirmed as another tab from earlier Getting Started capture)
- **Experience header:** "Experience · N years total · M years average tenure"
- **Tenure tags** (chip-style insights extracted from profile):
  - 🚀 Early + Growth (Series A through B history)
  - ⏱ High Avg. Tenure
  - 💼 Top Investment Bank
  - 🗄 Backend
  - 🎓 Top 10 US Uni
- **Skills inline list:** comma-separated skills
- **3-column stat cards:** Avg tenure · Current tenure · Total experience
- **Job entries** (each):
  - Company logo + Job title bolded
  - Company name
  - Date range · duration calculated
  - Location
  - Inline action chips: [Unlock Compensation Estimate] [Series A through Series B] for the company stage
- **Education section** (each):
  - Institution logo + name
  - Degree + field
  - Date range
- **Skill Map** (the NEW tab confirmed):
  - Skills clustered by category: **Back-End** (Python, Vba, Java, Node.js, Express) · **Data Science** (Matlab, Data Analysis) · more categories below

**Middle column (~30% — Why we matched):**
- "Why we matched this profile" header + **Edit Criteria** link (top-right)
- For each criterion: Match-quality badge ("👍 Good Match" green / "👌 Potential Fit" amber / "👎 Not a Match" red) + criterion text + numbered citations [1] [2] + explanation paragraph
- **Citations link to specific evidence** in the left-column profile (Skills section, Experience entry, etc.)

**Right column (~20% — Approve/Reject):**
- **Approve A** button (green outline) + keyboard hint
- **Reject R** button (red outline) + keyboard hint
- Disclaimer: "This only calibrates the agent and does not send emails."
- Footer: "You can **pin criteria** if it is a mandatory requirement or **re-order** by importance using **Edit Criteria**."

**Workflow:** approve/reject 3 profiles in sequence → returned to next setup step (sequence selection)

### Edit Criteria Modal (rank-ordered + pinnable)

Trigger: "Edit Criteria" link in Review Profile (or other surfaces TBD)
Layout: Centered modal ~600px

**Header:**
- "Criteria" title
- Right side: "📋 Select Preset" · "💾 Save Preset" · ✕ close

**Body:**
- **MOST IMPORTANT** section header (purple text)
- Each criterion row: 📌 pin icon · ⋮⋮ drag handle · "1" rank number · criterion text input · ✕ remove icon
- Visual gradient/spectrum from MOST → LEAST IMPORTANT (criteria toward the bottom are weighted lower)
- **LEAST IMPORTANT** section header (grey text)
- "**+ Add Criterion**" button (left) · "**Update →**" purple button (right)

**Workflow:**
- Drag criteria to reorder (changes weighting)
- Click pin icon to mark as mandatory (must match)
- Add new criterion via button
- Save with Update — re-runs scoring on existing matches

### Sequence Selection Screen

After 3-profile approval:
- Heading: "Please select an **email sequence** to use for this project."
- **Sequence dropdown** (empty by default) + **Confirm** button (purple)
- Below: "**Don't use sequences, I just want to create a shortlist**" link (purple)

**Critical decoupling:** Agents can run with OR without email sequences. The "Don't use sequences" path makes the agent a pure shortlist generator — no outreach. Important escape hatch for compliance-strict use cases.

### Sequence Dropdown (opened state)

When clicked:
- Search input at top
- List of available sequences (each row: name + "Created [date] by [owner]")
- **"Incomplete" sequences** are tagged with ⓘ info icon and orange "Incomplete" label — partially saved sequences can be resumed
- Bottom: "✉ **Create new sequence**" link (purple)

### Create Sequence Modal — Template Chooser

Layout: Full-screen overlay
**Header:** "Create sequence" title + "Close" button (top right)

**Body:**
- Heading: "Choose a sequence template"
- Three creation options (cards with icons):
  - ✦ **Generate with AI**
  - ➕ **Start from scratch**
  - 📋 **Clone an existing sequence**
- Divider + "**Templates**" subheader
- Two pre-built templates:
  - 📧 **Focused outreach** — "3 steps · 6 days in sequence"
  - 📧 **Multi-channel outreach** — "4 steps · 8 days in sequence"

### Sequence Editor (full canvas)

After "Start from scratch" or template choice:

**Top banner (when active):** "Email drafts are now smarter with calendar integration!" + "Enable now" button + ✕ dismiss

**Top bar:**
- "Create sequence" title (or sequence name if editing)
- **Cancel** button + **Save** purple button (top-right)

**Sub-header:**
- Sequence name (editable inline): "Nikhil Agent - 04/29/2026" + ✏️ edit pencil
- Subtitle: "Created by [owner] [date]"
- **Settings** button (top-right) — TBD what's inside

**Layout: 2 columns**

**Left panel (~30% — Steps list):**
- Recommendation banner: "We recommend at least having 3 steps in your sequence"
- Drag handle ⋮⋮ for each step
- **Step 1: Email** card with:
  - Sender email
  - Scheduled time ("Apr 30, 12:18 AM (+08 +08:00)")
- **+ Add step** button at bottom

**Right panel (~70% — Step editor):**
- **Timing pill at top:** "Start [immediately ▼]"
- **Step header:** Step 1 / Email type / **Preview and test** button + 🗑 delete
- **From dropdown:** sender email (e.g. thenikhil0505@gmail.com)
- **Subject:** input field (e.g. "Let's stay in touch!") + Cc / Bcc links
- **AI Command** + **Snippets** action chips
- **Personalization tags** (comma-separated chips):
  - Spintax Greeting · First Name · Current Company · Job Title · Education · Sender First Name · More...
- **Rich text toolbar:** ↶ undo · ↷ redo · **B** · *I* · U · ☰ bullet list · 🔗 link · 🖼 image · Arial dropdown · 14px size dropdown · A̲ text colour · 🖍 highlight · ☰ list · ABC ✓ spell check
- **Body textarea:** "Start typing your email body here..."
- **Footer row:** Signature dropdown (None) · ☐ Include unsubscribe checkbox

### Daily Contact Volume Selection

After sequence selected/created:
- Heading: "How many profiles do you want to contact every day?"
- Three preset cards centered:
  - **15** / Low (white border)
  - **25** / Balanced (purple border — selected by default)
  - **35** / High (white border)

**Niksho note:** The framing is presets not number input. Three-point scale with friendly labels (Low/Balanced/High) is more accessible than asking for a numeric value.

### Approval Mode Selection

After volume:
- Heading: "Would you like to **manually approve** each profile, or let the agent reach out **automatically**?"
- Subtitle: "We will automatically exclude anyone you have previously shortlisted or contacted."
- Two buttons side-by-side:
  - **Review individually** (white)
  - **Reach out automatically** (white, purple border = current selection)

**Niksho note:** Explicit at agent setup, not buried in settings. Copy emphasises the auto-exclusion to reduce paranoia about double-contacts.

### Final Confirmation

- Heading: "We're all set! Would you like to **start sourcing**?"
- **Yes, start sourcing** (purple primary button)

After confirmation: agent transitions from Configuring → Active state, begins autonomous operation.

---

## Updated Status Lifecycle (clarified)

| Status | Meaning | Triggers |
|---|---|---|
| 🔵 **Configuring** | New agent in setup. Choosing sequence, cadence, manual-vs-auto. | Created but not yet "Yes, start sourcing" |
| 🟢 **Active** | Ready and running. Sourcing per cadence. | "Yes, start sourcing" clicked |
| 🟡 **Paused** | State preserved, no polling. | Requirement on hold; low tokens; manually paused |
| ⚫ **Finished** | Terminal. Run-once agents that completed. | Reached completion criteria; manually stopped |

---

## Resolved & New Open Questions

### Resolved this session:

| Q | Answer |
|---|---|
| Do Agents support 4 search modes? | No, NL only. |
| Padlock icon? | Private agent. |
| Status transitions? | See lifecycle table above. |
| Hidden profiles excluded where? | Edit Filters → Exclude Profiles → Hidden checkbox. |

### Still open:

20. **Where in UI does a recruiter MARK a profile as Hidden?** Excluding hidden profiles is via Edit Filters; *creating* a hidden profile is TBD. Likely on candidate row 3-dot menu or detail drawer — resolve when walking Search Results / Candidate Detail.
21. **Sequence editor "Settings" button** content — TBD.
22. **AI Command** action chip in sequence editor — what does it open?
23. **Agent → Search results** post-launch UI — what does the Active agent's main screen show? (Polling status? Latest profiles? Approval queue?)
24. **Agent ↔ Project relationship.** Can an agent's outputs be added to a Project's shortlist, or only to the agent's own shortlist?
25. **Agent's Shortlist tab** vs Project's Shortlist tab content scope.
26. **Per-agent 3-dot menu** items (parallel to Project menu — TBD).
27. **Skill Map full categories** — only saw Back-End and Data Science partial. Need a richer profile.
28. **Sequence Incomplete state** — what makes a sequence "incomplete"? Missing required field? Save button not pressed?

---

## Updated Component Inventory (additions from this session)

| Component | Variants | First seen |
|---|---|---|
| `LiveQueryChip` | grey (parsing), green (confirmed), with-icon | Agent setup live parsing |
| `MatchBadge` | Good Match (green), Potential Fit (amber), Not a Match (red) | Review Profile |
| `Citation` | numbered [1] [2] inline | Why we matched |
| `TenureTag` | with emoji + label | Profile experience header |
| `StatCard` | 3-up (Avg/Current/Total) | Profile experience |
| `JobEntry` | with company logo, dates, duration, location, action chips | Profile timeline |
| `SkillMap` | category cluster (Back-End, Data Science, etc.) | Profile bottom |
| `CriterionRow` | with pin, drag handle, rank, text, remove | Edit Criteria |
| `RankedList` | Most→Least Important spectrum | Edit Criteria |
| `FilterCategoryItem` | with active-state radio indicator | Edit Filters sidebar |
| `ExcludeRule` | checkbox + actor scope dropdown + timing scope dropdown | Edit Filters → Exclude |
| `LiveMatchCounter` | "1.3k matches" updating live | Edit Filters header |
| `PresetCard` | numeric + descriptor (15/Low) with selected state | Daily Volume |
| `ApprovalChoice` | binary card (Review individually / Reach out automatically) | Agent setup |
| `TemplateCard` | icon + title + meta ("3 steps · 6 days") | Create Sequence |
| `SequenceStep` | type + sender + scheduled time + drag handle | Sequence editor left panel |
| `PersonalizationTag` | inline chip with token name | Sequence editor |
| `RichTextToolbar` | full set with font/size/colour/highlight/list/spellcheck | Sequence editor |
| `ProjectSelectorOpenState` | search + list + create-new link | Sidebar dropdown |

---

## Walkthrough remaining (top-to-bottom from sidebar)

🔴 = not yet walked. After "Yes, start sourcing" we should resume with:

- **Tab 3** Project root → Searches view (the most-time-spent surface — biggest crawl gap)
  - Empty search state · Find Similar / JD / Boolean / Select Manually
  - Search results state (NEW from current session — agent's analog had similar match scoring; need Project version)
  - Filters editor, Criteria editor — likely shared with Agent flow already captured
  - Candidate detail drawer (partial from 04-28 — needs full walkthrough including Skill Map)
  - Shortlist tab
  - Status dropdown options
- **Tab 4** Shortlist (project-scoped)
- **Tab 5** Contacts
- **Tab 6** Sequences (list view + Pin/Star/3-dot menu — partial from earlier sessions)
- **Tab 7** Network
- **Tab 8** Analytics + sub-tabs
- **Tab 9** Integrations
- **Tab 10** Account / Settings sub-tabs (User / Team / Billing / Workspace / Notifications / API)
- **Tab 11** Support

---

# (continued — original feature map below)


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

| Token                  | Original guess                       | Corrected value                                                                                                                                                       | Notes                                                |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `--bg-primary`         | `#FCFCFC`                            | `rgb(255, 255, 255)` (white)                                                                                                                                          | Pure white, not near-white                           |
| `--bg-secondary`       | `#F8F8F8`                            | `lab(100 0 0)` ≈ white                                                                                                                                                | Same as primary in practice                          |
| `--accent-primary`     | `#7600bc`                            | **`rgb(107, 47, 141)` = `#6B2F8D`**                                                                                                                                   | Slightly different shade                             |
| `--accent-secondary`   | (not captured)                       | `rgb(118, 0, 188)`                                                                                                                                                    | Used for some accents                                |
| `--text-primary`       | `#000000`                            | `rgb(51, 51, 51)`                                                                                                                                                     | Near-black grey, NOT pure black (33 occurrences)     |
| `--text-strong`        | (n/a)                                | `rgb(0, 0, 0)`                                                                                                                                                        | True black for emphasis (9 occurrences)              |
| `--text-muted`         | `rgba(0,0,0,0.7)`                    | `rgba(0, 0, 0, 0.87)`                                                                                                                                                 | MUI default disabled state                           |
| `--border`             | `rgba(0,0,0,0.12)`                   | `lab(90.952 0 -0.0000119209)` ≈ near-white grey                                                                                                                       | 40 occurrences — dominant border colour              |
| `--shadow-sm`          | `0 1px 3px rgba(0,0,0,0.08)`         | mostly `none` (61×)                                                                                                                                                   | **Juicebox is largely shadowless** — flat design     |
| `--shadow-card`        | (n/a)                                | `rgba(0, 0, 0, 0.1) 0px 4px 20px 0px`                                                                                                                                 | Used rarely                                          |
| `--font-body`          | `Inter, system-ui, sans-serif`       | **`Helvetica, Arial, "Hiragino Sans GB", STXihei, "Microsoft YaHei", "WenQuanYi Micro Hei", Hind, "MS Gothic", "Apple SD Gothic Neo", NanumBarunGothic, sans-serif`** | System stack, NOT Inter (44 occurrences vs 3× Inter) |
| `--font-system`        | (n/a)                                | `-apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`                                  | 16 occurrences — secondary stack                     |
| `--font-base-size`     | implied 14px                         | **16px (56 occurrences)**                                                                                                                                             | Larger than typical SaaS                             |
| `--font-h1`            | (n/a)                                | `22px`                                                                                                                                                                | 2 occurrences                                        |
| `--font-h2`            | (n/a)                                | `20px`                                                                                                                                                                | 2 occurrences                                        |
| `--font-h3`            | (n/a)                                | `18px`                                                                                                                                                                | 2 occurrences                                        |
| `--font-small`         | (n/a)                                | `14px`                                                                                                                                                                | 1 occurrence                                         |
| `--font-weight-normal` | (n/a)                                | `400` (58×)                                                                                                                                                           | Dominant                                             |
| `--font-weight-medium` | (n/a)                                | `500` (2×)                                                                                                                                                            | Rare                                                 |
| `--font-weight-bold`   | (n/a)                                | `600` (3×)                                                                                                                                                            | Rare                                                 |
| `--radius-default`     | `4px`                                | **`0px` dominant (40×)**, `4px` secondary (10×)                                                                                                                       | **Juicebox uses sharp corners more than rounded**    |
| `--radius-circular`    | (n/a)                                | `50%` (11×)                                                                                                                                                           | Avatars and chips                                    |
| `--radius-large`       | (n/a)                                | `8px` (1×), `14px` (1×)                                                                                                                                               | Rare                                                 |
| `--transition-default` | `250ms cubic-bezier(0.4, 0, 0.2, 1)` | `transform 0.2s ease-out, color 0.2s ease-out, background-color 0.2s ease-out, stroke 0.2s ease-out, stroke-width 0.2s ease-out`                                      | Multi-property transitions are common (11×)          |
| `--transition-color`   | (n/a)                                | `color 0.2s ease-out`                                                                                                                                                 | 11 occurrences                                       |
| `--transition-all`     | (n/a)                                | `all`                                                                                                                                                                 | 39 occurrences                                       |
| `--sidebar-w`          | `220px`                              | **220px confirmed** (sidebar item width)                                                                                                                              | Fixed                                                |
| `--breakpoint-mobile`  | `600px`                              | TBD                                                                                                                                                                   | Not verified in this run                             |

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
