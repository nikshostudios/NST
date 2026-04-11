# Sourcing Pipeline Troubleshooting — 2026-04-11

## Session Summary

Deployed the AI agent layer to Railway production and attempted end-to-end testing of the full sourcing pipeline via the webapp. Multiple issues discovered and partially fixed.

---

## Issue 1: Web service cannot reach ai-agents service on Railway

**Symptom:** Creating a requirement via the webapp returned `Connection refused` error.

**Root cause:** `AI_AGENT_URL` env var on the web service was set incorrectly. The ai-agents service binds to port 8080 (Railway's `PORT` env var), not the default 8001.

**Fix:** Set `AI_AGENT_URL=http://ai-agents.railway.internal:8080` on the web service in Railway Variables. Also had to delete and re-create the variable to remove invisible characters that caused a URL parse error.

**Status:** RESOLVED

---

## Issue 2: Pipeline endpoint returning 500 Internal Server Error

**Symptom:** Requirements Board cards all showed Sourced: 0, Screened: 0. The `/pipeline` endpoint returned HTTP 500.

**Root cause:** The `requirements` table in Supabase has 638 open requirements (from legacy migration data). The pipeline endpoint used `.in_("requirement_id", req_ids)` with all 638 UUIDs, which exceeded PostgREST's maximum query string length, returning a 400 error that FastAPI surfaced as 500.

**Fix:**
- Limited pipeline query to most recent 50 requirements (`reqs = reqs[:50]`)
- Wrapped each table query in try/except so one failing table doesn't crash the whole endpoint

**Status:** RESOLVED

---

## Issue 3: Sourced candidates not saved to database (email-only upsert)

**Symptom:** Foundit recruiter search returned 50+ candidates (shown in popup), but the candidates table only had 1 Foundit candidate.

**Root cause:** The `run_all_sources()` function only upserted candidates that had an email address:
```python
if candidate.get("email"):
    upsert_candidate_by_email(clean)
```
Foundit recruiter search returns candidates WITHOUT email (just name, title, skills, experience). All 50 candidates were silently skipped.

**Fix:**
- Added `upsert_candidate_by_name()` function to `config/db.py` — checks for existing record by name + source to avoid duplicates, then inserts or updates
- Updated `run_all_sources()` to use `upsert_candidate_by_name()` as fallback when no email present
- Added import in `config/sourcing.py`

**Status:** FIXED IN CODE, but couldn't verify because Firecrawl stopped working before re-test (see Issue 5)

---

## Issue 4: Pipeline "sourced" count always shows 0

**Symptom:** Even after sourcing returned 50+ candidates, the Requirements Board cards showed Sourced: 0.

**Root cause:** The pipeline endpoint counted "sourced" from the `screenings` table (`len(screenings)`), not from actual sourced candidates. Sourcing upserts to `candidates` table, but the pipeline never queried it.

**Fix:** Updated pipeline endpoint to count sourced candidates by querying the `candidates` table with `.overlaps("skills", req_skills)` matching the requirement's skills against the candidate's market.

**Status:** PARTIALLY FIXED — the count logic is correct, but Foundit candidates have composite skill strings (e.g., "ServiceNow JavaScript ITSM" as one skill) that don't overlap with individual skills (e.g., "ServiceNow"). Skill normalization needed.

---

## Issue 5: Firecrawl blocked by Foundit bot detection (CRITICAL — CURRENT BLOCKER)

**Symptom:** Firecrawl returns HTTP 500 with `SCRAPE_SITE_ERROR` / `ERR_ABORTED` when trying to scrape `recruiter.foundit.sg`. Even simple scrapes without browser actions fail.

**Root cause:** Foundit's recruiter portal has bot detection (Akamai `_abck` cookie visible in session). After multiple Firecrawl requests in one session, the site blocks the headless browser entirely. This is rate limiting / bot fingerprinting, not a cookie expiry issue (cookie was confirmed valid — page loads in markdown format initially, then starts blocking).

**Impact:** The entire Foundit recruiter sourcing channel is down. This is the ONLY channel that returns real candidate profiles with names, titles, skills, and experience.

**Status:** UNRESOLVED — Firecrawl approach is fundamentally unreliable for this use case

---

## Issue 6: Foundit session cookie expires every 24-48 hours

**Symptom:** Cookie obtained on April 10 stopped working by April 11. New cookie had to be manually extracted from Chrome DevTools.

**Root cause:** Foundit's session cookies (`C=<hash>`) have a short TTL. There is no API-based login — the recruiter portal has CAPTCHA on the login page, blocking any automated re-authentication.

**Manual cookie refresh process:**
1. Open `recruiter.foundit.sg` in Chrome (must be logged in)
2. DevTools → Network tab → click any request to `recruiter.foundit.sg`
3. Scroll to Request Headers → copy full `Cookie:` value
4. Update `FOUNDIT_SESSION_COOKIE` in Railway ai-agents Variables
5. Service auto-redeploys

**Status:** UNRESOLVED — inherent limitation, no automated fix possible with current approach

---

## Issue 7: MyCareersFuture returns job postings, not candidate profiles

**Symptom:** MCF API (`/v2/jobs`) returns job listings (company, salary, skills required) — NOT candidate profiles (name, experience, contact info).

**Root cause:** MCF is a job board, not a candidate database. The API was always designed to return job postings. It was incorrectly included as a "candidate sourcing" channel.

**Impact:** MCF data cannot be upserted into the `candidates` table in any useful way. It's effectively useless for candidate sourcing.

**Status:** BY DESIGN — MCF is not a candidate sourcing channel

---

## Issue 8: Scrape.do + Foundit public search returns job postings, not candidates

**Symptom:** Same as MCF — `www.foundit.in/srp/results` shows job postings, not candidate profiles.

**Root cause:** The public-facing Foundit website is a job board for job seekers. Only the recruiter portal (`recruiter.foundit.sg`) has access to the candidate resume database.

**Impact:** Scrape.do channel provides no value for candidate sourcing.

**Status:** BY DESIGN — public Foundit is not a candidate database

---

## Issue 9: Skills not extracted from JD text on requirement creation

**Symptom:** Requirements created via the webapp had empty `skills_required: []` even when JD text was provided.

**Root cause:** The JD text was provided in the form, and the Claude Haiku extraction was supposed to parse skills from it. The extraction may have failed silently (JSON parse failure from LLM response) or the JD text wasn't passed through from the webapp frontend.

**Status:** NOT FULLY INVESTIGATED — masked by other issues

---

## Issue 10: Foundit .sg subscription only covers Singapore market

**Symptom:** Sourcing for India market requirements returns 0 candidates from Foundit.

**Root cause:** ExcelTech's Foundit subscription is on the `.sg` domain, which only has Singapore candidate profiles. India candidates would require a separate `recruiter.foundit.in` subscription.

**Impact:** Foundit sourcing only works for Singapore market requirements.

**Status:** BY DESIGN — business limitation, not a code issue

---

## Current State of Each Sourcing Channel

| Channel | Status | What it returns | Useful? |
|---------|--------|----------------|---------|
| Foundit Recruiter (Firecrawl + cookie) | BLOCKED by bot detection | Real candidate profiles (SG only) | Yes, but unreliable |
| Foundit Public (Scrape.do) | Working | Job postings, NOT candidates | No |
| Foundit Public (Firecrawl) | Working | Job postings, NOT candidates | No |
| MyCareersFuture API | Working | Job postings, NOT candidates | No |
| Apollo.io | Requires paid plan | Candidate profiles | Not tested |

---

## Proposed Fix: Direct Foundit Recruiter API

The recruiter portal at `recruiter.foundit.sg` is a Next.js SPA. When the user performs a search, the frontend makes XHR/fetch API calls to a backend endpoint that returns structured JSON candidate data.

**If we find and call that API endpoint directly** (with the session cookie via simple HTTP requests), we bypass:
- Firecrawl entirely (no cost, no browser rendering)
- Bot detection (direct API calls look identical to the real frontend)
- Browser action flakiness (no SPA interaction needed)
- Akamai fingerprinting (no headless browser fingerprint)

**Next step:** User needs to open Chrome DevTools Network tab (Fetch/XHR filter), perform a search on recruiter.foundit.sg, and identify the API endpoint URL + request/response format. Then we replace the Firecrawl-based `source_foundit_with_cookie()` with a direct `httpx` call to that endpoint.

---

## Retrospective: What Went Wrong and Why

### The core mistake

The sourcing pipeline was built without properly validating what each channel actually returns before writing the code. Hundreds of lines of parsing, upsert, and pipeline logic were written around the assumption that MCF, Foundit Public, and Foundit Recruiter all return candidate profiles. A 5-minute manual test of each API/page would have revealed that only one of these (Foundit Recruiter) returns actual candidate data — and that one requires authenticated access through a bot-detection-heavy SPA.

### Channel-by-channel breakdown

**MCF & Foundit Public (Scrape.do/Firecrawl):** The actual API responses and HTML pages should have been inspected FIRST. MyCareersFuture is a government job board — it returns job postings. Foundit's public site (`www.foundit.in/srp/results`) is a job board for job seekers — also job postings. The site names were misleading ("Foundit" sounds like it has candidates, "MyCareersFuture" sounds like it has candidate profiles), but the assumption should have been verified before building the full pipeline. This was an AI execution failure, not a prompting issue.

**Firecrawl + Foundit Recruiter:** The cookie + browser actions approach was a workaround for the CAPTCHA-blocked login, and it worked during initial testing. But it should have been flagged upfront as an inherently fragile temporary hack, not a production solution. Headless browsers get fingerprinted and blocked by bot detection (Akamai), cookies expire every 24-48 hours with no way to auto-refresh, and browser actions on SPAs break unpredictably. One successful test was treated as validation instead of being treated as a proof-of-concept that needed a proper replacement.

**Why it wasn't caught earlier:** During testing on April 9-10, each channel returned *something* — MCF returned results, Scrape.do returned results, Firecrawl returned results. The validation was purely technical ("did the code run without errors?") rather than business-level ("is this data actually candidates we can recruit?"). The data mismatch was only discovered during production testing on April 11 when the pipeline produced zero useful candidates despite reporting 50+ "sourced" results.

### What should have happened

1. **Data validation first:** Test each API/page manually, inspect the actual response, and confirm it contains candidate names, skills, and contact info — not job postings
2. **Validate before building:** Only write pipeline code for channels confirmed to return candidate data
3. **Flag fragility:** Explicitly mark Firecrawl browser automation as a temporary workaround with known reliability risks, not a production-ready solution
4. **Business-level testing:** Test the full pipeline with the question "can a recruiter use this output?" rather than "did the code execute?"

### Responsibility

The user's prompts and requirements were clear — source candidates from these channels. The failure was in AI execution: assumptions were made about data formats without verification, and technical success ("code runs") was conflated with business success ("data is useful"). The troubleshooting time spent fixing HTML selectors, browser actions, and cookie extraction was wasted effort on channels that were fundamentally returning the wrong type of data.

---

## Deployment Notes

- ai-agents service deployed via `railway up` CLI (not GitHub-connected)
- Web service deploys from `main` branch on GitHub
- Branch `nikshostudios/ai-agent-layer` was merged to `main` on 2026-04-11
- All code fixes from this session are deployed but NOT yet committed/pushed to GitHub
- Pending commit needed for: `upsert_candidate_by_name`, pipeline count fix, pipeline query limit
