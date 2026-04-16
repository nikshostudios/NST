---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/docs/Beroz-Playwright-Test-Report-2026-04-15]]", "[[Raw/docs/Beroz-Testing-Guide-2026-04-15]]"]
date: 2026-04-15
updated: 2026-04-16
tags: [beroz, playwright, testing, exceltech, qa]
---

# Beroz E2E Test Session — 2026-04-15

## Core finding

Playwright E2E suite run against the live production deployment at `https://exceltechcomputers.up.railway.app`. **30 of 31 tests passed.** The entire Flask → FastAPI → Supabase chain is confirmed healthy, role-based access control works correctly for both TL and Recruiter roles, and all 10 pages load cleanly. One reproducible bug found: creating a new requirement fails silently — the modal closes but no row is written to Supabase and no error surfaces to the user.

## What the tests confirmed

**Infrastructure is solid.** The full chain works: Flask receives requests, proxies to FastAPI, FastAPI reads/writes Supabase, and the response makes it back to the frontend. 667 requirement cards loaded in Phase 3, confirming the DB has real data and the read path is healthy. The pipeline API also responded cleanly (returning 0 candidates — a valid empty state, not an error).

**Role-based UI is airtight.** Login as `raju` (TL) shows the Submissions nav item and "New Requirement" button. Login as `devesh` (Recruiter) correctly hides both. The `/submissions` route actively blocks non-TL users. This matches the expected permission model documented in [[Raw/docs/Beroz-Features-Guide-2026-04-15]].

**Graceful degradation works.** The Outlook "Check Inbox" flow surfaces the expected Azure credentials error rather than crashing. This is the correct behavior for a service that isn't configured yet — the app fails informatively, not silently.

**Search and analytics are functional.** Natural-language query parsing works ("Python developers in Singapore with 3+ years" returns structured results). Analytics Pipeline renders stats cards and a funnel chart. Usage tab shows token cost data. These are the most complex frontend components and they passed cleanly.

## The bug — silent failure on Create Requirement

```
phase3-requirements.spec.js › Phase 3 › create requirement saves to DB  ❌ FAIL
```

**What happens:** Fill the New Requirement modal, click "Create & Source", modal closes (or freezes) — but no new row appears in Supabase. Most recent row in the `requirements` table is still dated 2026-04-12. No toast, no console error, no user feedback of any kind.

**Secondary symptom:** "Source Now" button also produces no feedback and appears to time out — same silent-failure pattern, possibly the same root cause.

**Four suspected causes, in order of likelihood:**
1. Missing `await` or absent `.catch()` on the `fetch()` call in the Create modal JS — the error is swallowed before it reaches the UI
2. Flask → FastAPI proxy failing on the POST route (`/api/requirements`) — auth token mismatch, payload shape issue, or CORS
3. Supabase RLS policy blocking inserts for the `tl` role, but the 403/error not surfaced by the frontend
4. Backend returning 422 (payload validation failure) with the frontend ignoring non-2xx responses

**How to debug:** DevTools → Network tab → reproduce the flow → inspect the POST response body and status code. If the POST never fires at all, the bug is in the frontend JS before the fetch. If it fires and returns 4xx/5xx, the bug is the backend or the frontend's error handling. Railway logs will confirm which side is failing.

## Relevance to Niksho

This test run closes the "Beroz is deployed but untested" gap. The production platform is now validated with a repeatable suite. Before the hybrid Juicebox UI described in [[Wiki/hot]] replaces Beroz, the Create Requirement bug needs to be fixed — it blocks the core TL workflow (create req → auto-source candidates). See [[Efforts/ExcelTech-Automation/Overview]] for the active build context.

The test structure (7 spec files, one per phase, matching the test checklist in [[Raw/docs/Beroz-Testing-Guide-2026-04-15]]) is a reusable pattern for future platform versions. When the new UI ships, the same suite can be adapted with minimal changes since the API routes won't change.

## See also
- [[Raw/docs/Beroz-Testing-Guide-2026-04-15]] — the test checklist this suite was built from
- [[Raw/docs/Beroz-Features-Guide-2026-04-15]] — canonical reference for what each page does
- [[Raw/docs/Beroz-Build-Session-2026-04-15]] — build session log for Beroz
- [[Wiki/techniques/Playwright-DOM-Crawling]] — related Playwright work (DOM capture vs E2E testing)
- [[Efforts/ExcelTech-Automation/Overview]] — active effort context
