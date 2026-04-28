---
type: shared-todo
generated-by: claude
updated: 2026-04-16
owner: Shoham + Nikhil
---

# Shared To-Do — Niksho

This is the active task board for Nikhil. It is maintained by Claude after each session report. Tasks carry enough context that you should not need to ask why something is here.

**Tags:** 👤 Nikhil = needs ExcelTech-side context or access (recruiter workflows, credentials, internal comms, understanding what the team actually needs — his dad's company) · 👥 Either = any technical work, can be picked up by whoever is available

---

## ExcelTech Automation

### 🔥 Immediate 

- [ ] **Fix Create Requirement + Source Now — run the Claude Code prompt (4 steps)** — 👥 Either
  > Root cause found: FastAPI was never deployed on Railway (only Flask starts), so all write routes hit localhost:8001 which has nothing listening → 502. The frontend `api()` helper has no `resp.ok` check so the 502 was swallowed silently. A type mismatch on `experience_min` (int sent, str expected) is queued behind that. Fix is Path A: merge FastAPI into Flask, one process, no inter-service hop.
  > **Run the Claude Code prompt** (copied below or in the companion doc). It covers all 4 steps in order.
  > **Step 1** — Fix `api()` error handling in `frontend-exceltech/index.html:1110` so errors surface to the user.
  > **Step 2** — Merge all routes from `backend/ai-agents/main.py` into `backend/app.py`. Bring Pydantic validation logic — rewrite as Flask type coercion, don't just copy-paste raw handlers. Update `Procfile`, `nixpacks.toml`, and `run.py` so local and prod run the same entrypoint.
  > **Step 3** — Fix `experience_min: str | None` → `experience_min: int | None` in the Pydantic model. Audit other numeric-ish fields in the same model.
  > **Step 4** — Add startup healthcheck: ping `AI_AGENT_URL/health` at Flask startup and log loudly if unreachable.
  > **Verify:** `cd tests && npx playwright test phase3-requirements` → all green → then full suite → 31/31.
  > Ref: [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]] · [[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]]

### 🗂 Housekeeping

- [x] **Push 3 pending commits to GitHub** — 👥 Either
  > Three changes are live on Railway but NOT pushed to the GitHub repo: `upsert_candidate_by_name`, pipeline count fix, pipeline query limit. If Railway redeploys from GitHub (or Nikhil clones the repo), these changes will be lost. Push them now.
  > Ref: [[Wiki/hot]]

- [ ] **Follow up with Prayag for Foundit EDGE API key** — 👤 Nikhil
  > Phase 1 of the v2 architecture (replacing cookie-based Foundit scraping with the official EDGE API) is blocked until we have this key. No code work needed — this is a business/relationship task. Chase Prayag directly.
  > Ref: [[Raw/docs/sourcing-architecture]] · [[Wiki/hot]]

---

## Niksho SaaS Product

### 🔥 Immediate — unblocks hybrid UI build

- [x] **Run `crawl-missing.js` to capture Juicebox search page + candidate details** — 👤 Nikhil
  > The first Playwright crawl captured 43 Juicebox pages. The #1 missing page is the search results view — this is the core UI pattern (search-first, not dashboard-first) that the hybrid Niksho UI must replicate. Script is already written at `recruitment-agents/juicebox-crawler/crawl-missing.js`. Just run it while logged into Juicebox. Also need: candidate details modal, agent chat conversation view.
  > Ref: [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]] · [[Wiki/concepts/Search-First-SaaS-UI]]

- [x] **Build hybrid Juicebox + Niksho UI** — 👤 Nikhil
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
