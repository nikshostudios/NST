---
type: shared-todo
generated-by: claude
updated: 2026-04-16
owner: Nik + Nikhil
---

# Shared To-Do — Niksho

This is the active task board for Nikhil. It is maintained by Claude after each session report. Tasks carry enough context that you should not need to ask why something is here.

**Tags:** 👤 Nikhil = needs ExcelTech-side context or access (recruiter workflows, credentials, internal comms, understanding what the team actually needs — his dad's company) · 👥 Either = any technical work, can be picked up by whoever is available

---

## ExcelTech Automation

### 🔥 Immediate 

- [ ] **Debug and fix Create Requirement silent failure** — 👤 Nikhil
  > The "New Requirement" modal submits, modal closes, but NO row is written to Supabase. Most recent DB row is still dated 2026-04-12. No toast, no error shown to user. This breaks Raju's core workflow.
  > **Debug path:** Open DevTools → Network tab → reproduce the flow → inspect the POST response to `/api/requirements`. If the POST never fires, the bug is in the frontend JS. If it fires and returns 4xx/5xx, check Railway logs. Four root-cause suspects: (1) missing `.catch()` on the `fetch()` call, (2) Flask→FastAPI proxy rejecting the POST, (3) Supabase RLS blocking inserts for TL role, (4) backend returning 422 with frontend ignoring it.
  > Ref: [[Wiki/digests/Session-Beroz-E2E-Testing-2026-04-15]] · [[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]]

- [ ] **Fix Source Now silent failure (same session as above)** — 👤 Nikhil
  > "Source Now" button click produces no visible feedback. API appears to time out with no toast or status update. Likely the same silent-failure pattern as Create Requirement — fix together. Check if the sourcing POST is also missing error surfacing.
  > Ref: [[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]]

### 🗂 Housekeeping

- [ ] **Push 3 pending commits to GitHub** — 👥 Either
  > Three changes are live on Railway but NOT pushed to the GitHub repo: `upsert_candidate_by_name`, pipeline count fix, pipeline query limit. If Railway redeploys from GitHub (or Nikhil clones the repo), these changes will be lost. Push them now.
  > Ref: [[Wiki/hot]]

- [ ] **Follow up with Prayag for Foundit EDGE API key** — 👤 Nikhil
  > Phase 1 of the v2 architecture (replacing cookie-based Foundit scraping with the official EDGE API) is blocked until we have this key. No code work needed — this is a business/relationship task. Chase Prayag directly.
  > Ref: [[Raw/docs/sourcing-architecture]] · [[Wiki/hot]]

---

## Niksho SaaS Product

### 🔥 Immediate — unblocks hybrid UI build

- [ ] **Run `crawl-missing.js` to capture Juicebox search page + candidate details** — 👤 Nikhil
  > The first Playwright crawl captured 43 Juicebox pages. The #1 missing page is the search results view — this is the core UI pattern (search-first, not dashboard-first) that the hybrid Niksho UI must replicate. Script is already written at `recruitment-agents/juicebox-crawler/crawl-missing.js`. Just run it while logged into Juicebox. Also need: candidate details modal, agent chat conversation view.
  > Ref: [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]] · [[Wiki/concepts/Search-First-SaaS-UI]]

- [ ] **Build hybrid Juicebox + Niksho UI** — 👤 Nikhil
  > Once crawl-missing.js runs and the search page HTML is captured, feed the full HTML capture set to Claude Code and build the hybrid UI in `recruitment-agents/niksho-ui/`. Strategy: take Juicebox's UI patterns (search-first, candidate cards, sidebar nav, filter pills) and combine with Niksho-specific features (multi-agent dashboard, screening pipeline, outreach sequences, submission formatting). Do NOT do a pure clone.
  > **Depends on:** crawl-missing.js task above being done first.
  > Ref: [[Wiki/hot]] · [[Wiki/concepts/Search-First-SaaS-UI]] · [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]]

---

## How this list works

- Claude updates this file after each session report from Nik
- If you finish a task, check it off (`- [x]`) and leave it for one session before removing it so Nik can see what moved
- If you're blocked or discover something new, add a note under the task (indent with `>`) and flag it to Nik
- Tasks with **Depends on:** must be done in order

_Last updated: 2026-04-16 — seeded from Playwright E2E report (30/31 pass) + hot.md blockers_
