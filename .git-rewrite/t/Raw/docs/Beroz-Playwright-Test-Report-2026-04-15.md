---
type: raw-doc
source: internal
date: 2026-04-15
updated: 2026-04-16
project: Beroz
companion-to: "[[Raw/docs/Beroz-Testing-Guide-2026-04-15]]"
related:
  - "[[Efforts/ExcelTech-Automation/Overview]]"
  - "[[Raw/docs/Beroz-Build-Session-2026-04-15]]"
  - "[[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]]"
---

# Playwright E2E Test Report — ExcelTech Recruitment Platform

**Initial Test Date:** 2026-04-15
**Fix Verified:** 2026-04-16
**Environment:** Production (https://exceltechcomputers.up.railway.app)
**Framework:** Playwright v1.59.1 (Chromium)
**Test Suite Location:** `tests/`
**Overall Result:** ✅ **31 / 31 PASSED** (all bugs resolved)

---

## Project Overview

- **Stack:** Flask (single process) + Supabase PostgreSQL — AI agent layer merged into Flask (see fix)
- **Frontend:** Juicebox HTML
- **Deployment:** Railway (gunicorn + wsgi.py)
- **Integrations:** Microsoft Graph (Outlook), Google Sheets, Apollo.io, Anthropic Claude
- **Test Credentials:**
  - Team Lead: `raju / raju18`
  - Recruiter: `devesh / devesh27`

---

## Test Suites

| Phase | Spec File | Tests | Status |
|-------|-----------|-------|--------|
| 1 | `phase1-auth.spec.js` | Auth & Navigation | ✅ PASS |
| 2 | `phase2-backend.spec.js` | Backend API Health | ✅ PASS |
| 3 | `phase3-requirements.spec.js` | Requirements CRUD | ✅ PASS |
| 4 | `phase4-outreach.spec.js` | Outreach & Email | ✅ PASS |
| 5 | `phase5-submissions.spec.js` | Submissions Workflow | ✅ PASS |
| 6 | `phase6-analytics.spec.js` | Analytics | ✅ PASS |
| 7 | `phase7-settings.spec.js` | Integrations & Settings | ✅ PASS |

---

## ✅ What Passed

### Phase 1 — Auth & Navigation
- Login as `raju/raju18` → redirects to Agent Home
- Session API returns `{logged_in: true, name: "Raju Akula", role: "tl"}`
- All 10 pages load without JS errors:
  Agent Home · Requirements · Shortlist · Contacts · Sequences/Outreach · Submissions · Analytics Pipeline · Analytics Usage · Integrations · Search · Settings
- TL-only features visible as Raju (Submissions nav + "New Requirement" button)
- Logout returns to login page
- Recruiter (`devesh/devesh27`) correctly sees Submissions nav hidden and "New Requirement" button hidden
- Landing page `/home` displays both SaaS Platform and ExcelTech product cards

### Phase 2 — Backend API Health
- Requirements API loaded — Flask → FastAPI → Supabase chain working
- Pipeline API responded (Shortlist 0 candidates, clean empty state)
- Session API returns correct name, email, role on Settings page

### Phase 3 — Requirements
- View requirements: ✅ 667 cards loaded
- Filter by India: ✅ only India-tagged cards shown
- Filter by Singapore: ✅ only Singapore-tagged cards shown
- **Create requirement saves to DB: ✅ FIXED & VERIFIED** (2026-04-16)

### Phase 4 — Outreach & Email
- Inbox Monitor selector populated with recruiters
- "Check Inbox" handles Azure unconfigured state gracefully (expected error surfaced)
- Upload Resume + JD flow opens screening modal

### Phase 5 — Submissions
- TL Queue loads for Raju (TL)
- Approve / Reject buttons render with confirmation modal
- Recruiter correctly blocked from /submissions

### Phase 6 — Search & Analytics
- Search parses natural-language query ("Python developers in Singapore with 3+ years")
- Analytics Pipeline stats cards render (Open Reqs, Sourced, Shortlisted, Submitted) + funnel chart
- Analytics Usage shows token usage/cost cards

### Phase 7 — Integrations & Settings
- All 6 integration cards show Connected status
- Settings profile shows correct name, email, role

---

## ✅ Bug Fixed — Create Requirement (was failing silently)

**Test:** `phase3-requirements.spec.js › Phase 3 › create requirement saves to DB`
**Original Status:** ❌ FAIL
**Final Status:** ✅ PASS (verified 2026-04-16, commit `f2f0c0d`)

**Root cause:** Three compounding issues — see `[[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]]` for full breakdown.

| # | Issue | Fix |
|---|-------|-----|
| 1 | FastAPI never deployed on Railway — only Flask ran, localhost:8001 had nothing listening | Merged FastAPI routes into Flask as `backend/ai_agents/core.py`; eliminated inter-service hop |
| 2 | Frontend `api()` helper didn't check `resp.ok` — swallowed every HTTP error silently | Added `if (!resp.ok) throw new Error(...)` so errors surface to the UI |
| 3 | `experience_min` type mismatch — frontend sent `int`, Pydantic expected `str` | Changed field to `int \| None` in the new core module |

**Deployment:** Connected Railway `web` service to `nikshostudios/beroz` (was wrongly pointing at `nikshostudios/recruitment-agents`). Auto-deploy now triggers on every push to `main`.

---

## Running the Tests

```bash
cd tests
npm test                          # run all phases
npx playwright test phase3        # single phase
npx playwright test --headed      # watch in browser
npx playwright show-report        # view HTML report
```

Config: `tests/playwright.config.js` — baseURL `https://exceltechcomputers.up.railway.app`, 30s timeout, 1 retry, screenshots on failure.
