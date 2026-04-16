---
type: raw-doc
source: internal
date: 2026-04-15
project: Beroz
companion-to: "[[Raw/docs/Beroz-Testing-Guide-2026-04-15]]"
related:
  - "[[Efforts/ExcelTech-Automation/Overview]]"
  - "[[Raw/docs/Beroz-Build-Session-2026-04-15]]"
---

# Playwright E2E Test Report — ExcelTech Recruitment Platform

**Test Date:** 2026-04-15
**Environment:** Production (https://exceltechcomputers.up.railway.app)
**Framework:** Playwright v1.59.1 (Chromium)
**Test Suite Location:** `tests/`
**Overall Result:** ✅ **30 / 31 PASSED** (1 known bug)

---

## Project Overview

- **Stack:** Flask (port 5001) + FastAPI AI agents (port 8001) + Supabase PostgreSQL
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
| 3 | `phase3-requirements.spec.js` | Requirements CRUD | ⚠️ 1 BUG |
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

### Phase 3 — Requirements (partial)
- View requirements: ✅ 667 cards loaded
- Filter by India: ✅ only India-tagged cards shown
- Filter by Singapore: ✅ only Singapore-tagged cards shown

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

## ❌ The Bug — Create Requirement Fails Silently

**Test:** `phase3-requirements.spec.js › Phase 3 › create requirement saves to DB`
**Status:** ❌ FAIL (reproducible)

### Reproduction Steps
1. Login as `raju / raju18`
2. Navigate to Requirements page
3. Click **"New Requirement"**
4. Fill the modal:
   - Title: `Senior Java Developer`
   - Client: `Test Corp`
   - Location: `India`
   - Skills, experience, description filled
5. Click **"Create & Source"**

### Expected
- New requirement card appears on the board
- DB `requirements` table gets a new row dated 2026-04-15
- Toast/success message shown

### Actual
- Modal closes (or stays open with no feedback)
- **No new row in Supabase** — most recent row still dated 2026-04-12
- No toast, no console error surfaced to user
- Network tab shows the POST either never fires or returns non-2xx silently

### Secondary Issue — Source Now
- "Source Now" button click produces no visible feedback
- API call appears to time out without toast/status update
- Suggests the same silent-failure pattern as Create Requirement

### Suspected Root Cause
Based on the silent failure pattern, likely candidates:
1. **Form submit handler** — missing `await`/error handling on `fetch()` in the Create modal JS
2. **Flask → FastAPI routing** — POST `/api/requirements` may be hitting Flask but the FastAPI forward is failing (auth token, payload shape, or CORS)
3. **Supabase RLS policy** — insert blocked by row-level security but response swallowed on the frontend
4. **Payload validation** — backend rejects with 422 but frontend never surfaces the error

### Recommended Next Steps
1. Open browser DevTools → Network tab, repro the flow, inspect the POST response
2. Check Railway logs for 4xx/5xx on `/api/requirements` around time of submit
3. Grep frontend for the form submit handler and confirm `.catch()` surfaces errors to UI
4. Verify Supabase RLS policy allows inserts for role `tl`

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
