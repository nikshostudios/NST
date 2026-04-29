---
type: wiki-hot-cache
generated-by: claude
updated: 2026-04-29
max-words: 1500
---

# Wiki — Hot Cache

Small recency buffer. Rewritten by [[AIOS/skills/ingest-source]] whenever it runs. If you're an AI reading this first, this is the current state of what matters most.

---

## Right now — 2026-04-29 (mid-session)

### 🔴 ACTIVE TASK: Live walkthrough of Juicebox in Cowork — checkpoint 2 just saved

Nikhil is performing a structured screen-by-screen walkthrough of Juicebox while Claude (this session) screenshots his real Chrome via computer-use, asks questions per the question template, and writes the *Workflow why* into [[Efforts/Niksho-SaaS-Product/JUICEBOX-FEATURE-MAP]] in real time.

**Pickup signal for next session:** Nikhil says "let's continue the walkthrough" → Claude re-requests Chrome access → screenshots → continues from **Tab 3 (Project root → Searches)** which is the next major surface to walk.

**Current state of the agent Nikhil just configured:** "Nikhil Agent" is at the **"Yes, start sourcing"** confirmation step. Hasn't been started yet. When walkthrough resumes, the next click is Yes → see what the running-agent state looks like → then move to Tab 3.

### What's been captured (across both sessions)

**🟢 specced:**
- Sidebar (full structure, 17 elements, collapsed icon-only state)
- Logo behaviour (no-op)
- Getting Started Checklist Modal (all 6 steps with images + CTAs)
- All Projects (full button inventory, 3-dot menu, Edit Project modal, hover tooltips, Hidden vs Rejected concept)
- Connect Mailbox sequencing gate
- **All Agents — FULL Agent creation pipeline** (just captured this session):
  - Launch New Agent modal
  - Edit Agent modal
  - Agent setup screen (with focused vs unfocused states)
  - **Live query parsing with field extraction chips** (Bug #5 fix candidate)
  - Initial matches confirmation
  - **Edit Filters modal — 12 categories** (answers Hidden Profile exclusion question)
  - **Review Profiles 3-up calibration carousel** with citations
  - **Edit Criteria modal** (rank-ordered + pinnable)
  - Sequence selection (with "Don't use sequences" escape hatch)
  - Sequence dropdown with Incomplete state
  - Create Sequence template chooser
  - Sequence editor (full toolbar + features)
  - Daily volume preset (15/25/35 Low/Balanced/High)
  - Manual vs auto reach-out
  - Final confirmation
- Sidebar transformation when inside Agent (Agent + Shortlist instead of Searches + Shortlist)

**🟡 partial:**
- Candidate detail drawer (one screenshot from 04-28 — full walkthrough needed)
- Skill Map (referenced but partial — only Back-End and Data Science seen)
- Sequence editor (captured but Settings button content TBD)

**🔴 not walked yet:**
- Project root → Searches (THE biggest gap — most-time-spent surface)
- Shortlist (project-scoped, with populated state)
- Contacts
- Sequences (list view, 3-dot menu, populated editor)
- Network (gated — may be limited)
- Analytics + sub-tabs (Talent Insights specifically)
- Integrations
- Account / Settings (all sub-tabs: User, Team, Billing, Workspace, Notifications, API)
- Support

### Strategic findings worth recalling on next session start

**1. Calibration loop pattern (Juicebox's most clever UX).** Before agent commits to autonomy, user must approve/reject 3 profiles. Trains the quality bar by example. Replicate exactly.

**2. Live NL query parsing with chips** — solves Bug #5 from 04-27 punch list. NL → structured fields shown as ✓ chips in real time. **Highest-priority replication for our Search.**

**3. Why-we-matched citations** — numbered [1] [2] linking to specific evidence in profile. Trust-building UI for AI scoring. Beroz lacks this; needs replicating.

**4. Criteria are rank-ordered + pinnable**, not binary required/preferred. Most-Important → Least-Important spectrum. Update Niksho scoring model.

**5. Daily volume = preset cards** (15 Low / 25 Balanced / 35 High), not number input.

**6. Confidence-building over-explanation pattern.** Calibration + citations + "doesn't send emails" reassurance + parsing chips. When AI is opaque, over-communicate.

**7. Agents and Projects are siblings in IA.** Both are top-level routing primitives. Sidebar transforms to Agent-mode (Agent tab + Shortlist) vs Project-mode (Searches tab + Shortlist). Phase 4 multi-client extension applies to both equally.

**8. Hidden profiles concept — partially answered.** Edit Filters → Exclude Profiles → Hidden checkbox is *where excluded*, but where a profile gets *marked* hidden in UI is still TBD (likely candidate row 3-dot or detail drawer — resolve in Tab 3 walkthrough).

### Niksho-relevance of agent flow captures

The agent flow effectively gives us **a complete spec for the most differentiating feature in Juicebox** that Beroz currently doesn't have a full-fledged equivalent of. Three things this maps to:

1. **Beroz Bug #5 fix:** the live query parsing chips pattern is the visual treatment that fixes "Source Now passes 5 words." Build this.
2. **Phase 4 Niksho Agent feature:** the entire Agent pipeline gives us the spec. Status lifecycle (Configuring/Active/Paused/Finished), criteria management, calibration loop, sequence-or-no-sequence choice.
3. **Agency-flavoured agent:** when we add this in our SaaS, the "Reach out automatically" path needs an extra step asking which TL approves before sending — that's the Niksho moat layered on top.

---

### Strategic decisions still active

**Pivot to pure clone (visual + IA), then differentiate Phase 4** — ADR at [[Efforts/Niksho-SaaS-Product/decisions/2026-04-28-pivot-to-pure-clone]]. Still pending Shoham confirmation.

**IA: Project + Agent as siblings, both top-level.** Updated this session to reflect that Agent has its own sidebar context, not a sub-feature of Project.

**Frontend rebuild only.** Backend/agents/data layer all stay (mi.md hard rule).

---

### Carried from previous hot.md (still active)

**04-27 feature test punch list** — three demo-blockers (Bug #5 Source Now passes 5 words; Bug #6 three Searches tabs are same component; Bug #8 Apollo page-size too small). Pure-clone rebuild supersedes; don't fix in old Beroz.

**Sequences engagement trifecta** (pixel + click + bounce + AI intent) — code shipped to repo on 04-26, end-to-end verification still pending. See [[Wiki/digests/Session-Beroz-Sequences-Redesign-2026-04-26]].

**7-channel sourcing** live on main as of 04-25 — awaiting Railway deploy with schema migration `2a9bf84`, `APIFY_TOKEN`, Anthropic top-up.

**Haiku 4.5 for candidate scoring** ✅ shipped — ~12× cheaper, 2-3× faster.

---

### Open questions parked for resolution in remaining walkthrough

20. Where in UI does a recruiter MARK a profile as Hidden? (likely Tab 3 candidate detail)
21. Sequence editor Settings button content
22. AI Command chip in sequence editor
23. Active agent's main screen UI
24. Agent ↔ Project shortlist scope relationship
25. Per-agent 3-dot menu items
26. Skill Map full taxonomy
27. Sequence "Incomplete" state trigger
28. Settings sub-tabs (User/Team/Billing/Workspace/Notifications/API)
29. Talent Insights full layout (referenced from Getting Started modal but not walked)
30. Network gated content
31. Quick Find ⌘K palette content

---

### Open follow-ups (priority ordered)

| Priority | Item |
|---|---|
| 🔴 | **Resume walkthrough next session** — Tab 3 (Project root → Searches), then Tabs 4-11 |
| 🔴 | Shoham confirms pivot ADR before any further build |
| 🟠 | After walkthrough completes: targeted capture flow for ~10-15 high-value missing surfaces |
| 🟠 | Build tokens.css + ~10 primitive components before any page-build PR (drift prevention) |
| 🟠 | Per-page visual diff gate before merge |
| 🟡 | Cross-link pivot ADR from Niksho-SaaS Overview |
| 🟡 | Diff 102-endpoint API manifest against Beroz's existing FastAPI routes → backend extension list |
| 🟡 | Run Supabase schema migration `2a9bf84`, set Railway env vars |
| 🟡 | Foundit EDGE API key (chase Prayag) |

### Recently resolved this session 2

- ✅ Tab 1 (All Projects) fully specced
- ✅ Sidebar fully specced including collapsed state
- ✅ Getting Started checklist (all 6 steps) specced
- ✅ Edit Project modal specced
- ✅ Tab 2 (All Agents) FULL Agent creation pipeline specced — ~12 new UI surfaces in one batch
- ✅ Open questions 13, 14, 15 (agent search modes, padlock, status transitions) resolved
- ✅ Open question 1 (hidden profile exclusion mechanism) partially resolved
- ✅ Live query parsing pattern documented (Bug #5 fix candidate)
- ✅ Calibration loop pattern documented (most valuable UX insight)
- ✅ Citations pattern documented (trust-building for AI scoring)
- ✅ 12-category Edit Filters captured comprehensively
- ✅ Rank-ordered Criteria pattern captured
- ✅ Daily volume preset pattern captured
- ✅ Niksho-Agents-vs-Projects sibling IA insight

### Guardrails for the AI reading this

- Do not edit anything in `Raw/`. It is sacred.
- The pivot to pure clone is the active strategy as of 2026-04-28. Do NOT extend the 04-15 hybrid plan — it has been superseded. Read the ADR before suggesting changes.
- The clone code lives at `/Users/nikhilkumar/Claude Workspace/exceltech-ai/Brand New Website/beroz/Clone/` (outside vault).
- `auth-session/chrome-profile/` keeps Nikhil's Juicebox session — re-auth only if Firebase Auth expires (typically ~24h).
- Frontend rebuild only; backend stays. mi.md hard rule.
- The walkthrough is the primary mechanism for filling sub-surface gaps. Don't propose alternative discovery methods that bypass it.
- Read [[Efforts/Niksho-SaaS-Product/JUICEBOX-FEATURE-MAP]] (the canonical feature map) for the full spec before answering any question about Juicebox structure.
- Always `generated-by:` frontmatter on AI-authored files.

See [[mi]] for the full guardrail set.

### How to resume the walkthrough on a fresh Cowork session

1. Read this hot.md
2. Read [[Efforts/Niksho-SaaS-Product/JUICEBOX-FEATURE-MAP]] — the "Walkthrough Capture Log — 2026-04-29 Session 2" section is the latest
3. Re-request Chrome access via computer-use
4. Take screenshot to confirm Nikhil's Juicebox state
5. Resume at: Nikhil clicks "Yes, start sourcing" → see active-agent UI → then move to Tab 3 (Project root → Searches)
6. Use the question template (identity, workflow, per-button, connection, edge cases, inventory) per tab
7. Update feature map every 2-3 tabs

---

_Updated 2026-04-29 (mid walkthrough session 2) — full ingest of agent creation pipeline, ~12 new UI surfaces captured, walkthrough ~30% complete (Tabs 1-2 done, Tabs 3-11 pending). Next session resumes at "Yes, start sourcing" → Tab 3._
