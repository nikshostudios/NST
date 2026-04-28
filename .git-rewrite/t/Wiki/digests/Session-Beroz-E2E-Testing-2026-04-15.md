---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]]", "[[Raw/docs/Beroz-Testing-Guide-2026-04-15]]", "[[Raw/docs/Beroz-Playwright-Fix-Analysis-2026-04-16]]"]
date: 2026-04-15
updated: 2026-04-16
tags: [beroz, playwright, testing, exceltech, qa]
---

# Beroz E2E Test Session — 2026-04-15

## Core finding

Playwright E2E suite run against the live production deployment at `https://exceltechcomputers.up.railway.app`. **31 of 31 tests passed** (initial run on 2026-04-15 was 30/31; the Create Requirement bug was identified, root-caused, fixed, and verified on 2026-04-16 — see [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]]). The entire Flask → Supabase chain is confirmed healthy (FastAPI AI layer merged into Flask as part of the fix), role-based access control works correctly for both TL and Recruiter roles, and all 10 pages load cleanly.

## What the tests confirmed

**Infrastructure is solid.** The full chain works: Flask receives requests, proxies to FastAPI, FastAPI reads/writes Supabase, and the response makes it back to the frontend. 667 requirement cards loaded in Phase 3, confirming the DB has real data and the read path is healthy. The pipeline API also responded cleanly (returning 0 candidates — a valid empty state, not an error).

**Role-based UI is airtight.** Login as `raju` (TL) shows the Submissions nav item and "New Requirement" button. Login as `devesh` (Recruiter) correctly hides both. The `/submissions` route actively blocks non-TL users. This matches the expected permission model documented in [[Raw/docs/Beroz-Features-Guide-2026-04-15]].

**Graceful degradation works.** The Outlook "Check Inbox" flow surfaces the expected Azure credentials error rather than crashing. This is the correct behavior for a service that isn't configured yet — the app fails informatively, not silently.

**Search and analytics are functional.** Natural-language query parsing works ("Python developers in Singapore with 3+ years" returns structured results). Analytics Pipeline renders stats cards and a funnel chart. Usage tab shows token cost data. These are the most complex frontend components and they passed cleanly.

## The bug — silent failure on Create Requirement (✅ resolved 2026-04-16)

```
phase3-requirements.spec.js › Phase 3 › create requirement saves to DB  ✅ PASS
```

**What was happening:** Fill the New Requirement modal, click "Create & Source", modal closed — but no new row appeared in Supabase, no toast, no error of any kind. Three compounding issues were hiding each other. Full root cause is in [[Wiki/digests/Session-Beroz-Fix-Analysis-2026-04-16]].

**Fix (commit `f2f0c0d`, deployed 2026-04-16):** FastAPI routes merged into Flask as `backend/ai_agents/core.py`, eliminating the `localhost:8001` dependency that was never running on Railway. Frontend `api()` helper updated to throw on non-2xx responses. `experience_min` type changed from `str | None` to `int | None`. Railway web service reconnected to the correct repo (`nikshostudios/beroz`). Auto-deploy now active on every push to `main`.

**Post-fix result:** `npx playwright test phase3-requirements` — 1 passed (12.1s). Full suite: 31/31.

## Relevance to Niksho

This test run validated the production platform end-to-end and surfaced the one remaining blocker (Create Requirement). That blocker is now resolved. The full TL workflow — create req → auto-source → shortlist — is unblocked on the live deployment. See [[Efforts/ExcelTech-Automation/Overview]] for the active build context.

The test structure (7 spec files, one per phase, matching the test checklist in [[Raw/docs/Beroz-Testing-Guide-2026-04-15]]) is a reusable pattern for future platform versions. When the hybrid Juicebox UI ships, the same suite can be adapted with minimal changes since the API routes are stable.

## See also
- [[Raw/docs/Beroz-Testing-Guide-2026-04-15]] — the test checklist this suite was built from
- [[Raw/docs/Beroz-Features-Guide-2026-04-15]] — canonical reference for what each page does
- [[Raw/docs/Beroz-Build-Session-2026-04-15]] — build session log for Beroz
- [[Wiki/techniques/Playwright-DOM-Crawling]] — related Playwright work (DOM capture vs E2E testing)
- [[Efforts/ExcelTech-Automation/Overview]] — active effort context
