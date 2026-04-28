---
title: Sourcing Pipeline Troubleshooting — 2026-04-12
date: 2026-04-12
effort: ExcelTech-Automation
tags: [exceltech, recruitment-agents, troubleshooting, foundit, supabase, railway]
generated-by: claude-sonnet-4-6
---

# Sourcing Pipeline Troubleshooting — 2026-04-12

## Session Summary

Multi-session (04-11 carried into 04-12) focused on replacing the broken Firecrawl-based Foundit sourcing with direct API calls, adding TheirStack and Adzuna as market intelligence channels, and fully validating the Foundit recruiter API request/response shape. All three channels are now wired up with real credentials and production-ready code.

---

## Major Step 1: Switch Foundit from Firecrawl to Direct API (the big unlock)

**Context:** The previous session ended with Firecrawl permanently blocked by Foundit's bot detection (Akamai `_abck`). The proposal at the end of that session was to call the recruiter portal's internal API directly with the session cookie — bypassing headless browsers entirely.

**How we found the API:**
1. Opened `recruiter.foundit.sg/edge/recruiter-search/search?cn=sea` in Chrome while logged in as ExcelTech recruiter (Bhuwaneshwar account)
2. Claude in Chrome used `read_network_requests` MCP tool (intercepts XHR/fetch at the extension level) to capture requests on page load
3. Page load revealed the API base: `recruiter.foundit.sg/edge/recruiter-search/api/search-middleware/`
4. Also captured from page-load calls: `corpId=560219` and `subuid=1347319` (ExcelTech's Foundit account identifiers — required in every API request body)

**Finding the candidate search endpoint:**
- Typed "Python Django" in the search form, but pressing Enter didn't submit (Next.js form requires button click)
- Clicked "Search Candidates" button — this caused a full page navigation to `/search-results?sid=...` instead of an XHR call, so the Chrome extension's network tracker reset
- Workaround: clicked a "Recent Search" entry from the right sidebar ("Python Django REST API") — this also opened a new tab, again resetting the tracker for that tab
- Solution: once the results tab was open (`search-results?sid=254992646`), initialized the tracker on THAT tab with `read_network_requests`, then clicked pagination (page 2 → page 3 → page 4) which DOES fire XHR/fetch on the existing page without navigation
- Captured: `POST /api/search-middleware/v2/search` and `POST /api/search-middleware/v1/search-aggregation-count`

**Getting the request body (non-trivial):**
- `read_network_requests` only returns URL + method + status, not body
- Injected a JS fetch interceptor via `javascript_tool` to capture `window.fetch` calls
- First attempt: `options.body` came back as empty (length 0) because Next.js passes the body as a `Request` object, not a plain string
- Second attempt: wrapped with `input instanceof Request ? input.clone().text() : ...` to clone and read the body
- This worked — captured the full 2KB+ JSON request body

**Key fields discovered in the real request body:**
```json
{
  "appName": "recSRP",
  "reqParam": {
    "corp_id": 560219,
    "subuid": 1347319,
    "site_context": "monstersingapore",
    "service_filter": { "location": ["Singapore", "Singapore"] },
    "queries": { "all": "Python Django REST API", ... },
    "filters": { "company": { "currency": "INR", ... }, ... },
    "size": 40,
    "from": 0,
    "express_resumes": { "from": 0, "size": 4 },
    "sub_source": "search",
    "use_synonyms_fields": true
  }
}
```

**Bugs fixed vs real API:**

| Field | Our code (wrong) | Real API |
|-------|-----------------|---------|
| `service_filter.location` | `["Singapore"]` (one entry) | `["Singapore", "Singapore"]` (two entries) |
| `filters.company.currency` | `"SGD"` for SG market | `"INR"` always |
| `queries.use_synonyms_fields` | Inside `queries` dict | Only at `reqParam` level |
| `express_resumes` | Missing | `{"from": 0, "size": 4}` required |
| `sub_source` | Missing | `"search"` required |

**Status:** RESOLVED ✅

---

## Major Step 2: TheirStack — Market Intelligence

TheirStack is a job postings intelligence API. Used to identify companies hiring for specific skills. NOT candidate profiles.

- **Endpoint:** `POST https://api.theirstack.com/v1/jobs/search`
- **Bug fixed:** Location filter used wrong field name — real API uses `job_location_or` with internal IDs (`SG = 1880251`, `IN = 1269750`), not ISO country codes
- **Credentials:** `THEIRSTACK_API_KEY` in `.env`

**Status:** RESOLVED ✅

---

## Major Step 3: Adzuna — Salary Benchmarking

Adzuna provides salary data and job market stats. Used to benchmark expected salary during screening.

- **Credentials:** `ADZUNA_APP_ID=ba6240a6`, `ADZUNA_APP_KEY=9a64f64dda80ae2b7e67f3e1e77be51b`

**Status:** RESOLVED ✅

---

## Major Step 4: SerpApi — Google Jobs

- **Account:** nikshostudios@gmail.com, free tier (250 searches/month)
- Already fully coded, just needed the API key wired in
- `SERPAPI_API_KEY` in `.env`

**Naukri Resdex:** Parked — paid subscription, needs Nikhil's budget approval.

---

## Major Step 5: Foundit Cookie Refresh Script

**Problem:** The `C=` Foundit session cookie expires in **< 1 hour** (not 24-48h as assumed). It's a short-lived Django session token. Manually refreshing via DevTools was 3-5 minutes of friction.

**Solution:** `scripts/refresh_foundit_cookie.py` — reads Chrome's local encrypted SQLite cookie store via `browser_cookie3`, builds the cookie header, writes to `.env`, optionally pushes to Railway.

```bash
cd /Users/shohamshree/conductor/workspaces/recruitment-agents/el-paso
python3 scripts/refresh_foundit_cookie.py --railway
```

Common mistakes: use `python3` not `python`; run from `el-paso/` not `el-paso/ai-agents/`.

**Status:** RESOLVED ✅ (superseded by Major Step 8 below)

---

## Major Step 6: PR #8 Merge Conflict Resolution

Two files conflicted when merging `nikshostudios/ai-agent-layer` into `main`: `db.py` and `main.py`.

**Resolution:** Kept branch versions in both cases — they represent the intended production architecture (LLM semantic matching) vs main's older keyword-overlap interim code. Resolved via GitHub's browser editor using Claude-in-Chrome MCP.

**Status:** RESOLVED — PR #8 merged ✅

---

## Major Step 7: `match_scores` Table + End-to-End Test

**Problem:** Both `/match` and `/source` returned 500 after PR #8 deployed. Root cause: `match_scores` table was defined in code but **never created in production Supabase**.

**Fix:** Created table + 2 indexes via Supabase SQL editor:

```sql
CREATE TABLE IF NOT EXISTS match_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  requirement_id text NOT NULL,
  candidate_id text NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  reasoning text,
  scored_at timestamptz DEFAULT now(),
  UNIQUE (candidate_id, requirement_id)
);
CREATE INDEX IF NOT EXISTS idx_match_scores_requirement ON match_scores(requirement_id);
CREATE INDEX IF NOT EXISTS idx_match_scores_score ON match_scores(requirement_id, score DESC);
```

**Result:** Both endpoints returned 200 OK. LLM pipeline writing to DB. ✅

---

## Major Step 8: Local Foundit Agent — The Real Fix

**Root cause:** Foundit's Django backend ties the `C=` session cookie to the originating IP. Railway's IP ≠ Mac's IP → instant 401 every time. Cannot be fixed by refreshing the cookie.

**Solution:** `scripts/local_foundit_agent.py` — runs on the Mac, sources from Foundit using the Mac's own IP, writes candidates directly to Supabase. Railway never touches Foundit.

### The stale cookie rabbit hole

First run: HTTP 401. Added interactive retry — reload Chrome, re-read cookie, retry. Still 401. Cookie value `C=83E88E17` was identical every single read.

Tried: copying the SQLite WAL file to a temp dir so sqlite3 would merge in-memory state. Still same stale value. Tried adding `X-CSRFToken` header. Still 401.

**Root cause of THAT problem:** Chrome's `C=` cookie is `httpOnly` and lives purely in memory. The on-disk SQLite file is stale. `browser_cookie3` can only read disk — it will never see Chrome's live session. No file-based approach can work.

**The real fix:** Stop trying to extract the cookie. Make the API call **from inside Chrome** using AppleScript.

- Request body base64-encoded → written to `/tmp/foundit_chrome_request.js`
- AppleScript finds the open `recruiter.foundit.sg` tab, loads and executes the JS file
- JS runs a synchronous XHR **from within the page** — Chrome attaches all cookies natively including httpOnly `C=`
- Response parsed in JS, returns only `resumes` array (full response >120KB caused AppleScript string truncation)
- One more snag: Chrome requires **View → Developer → Allow JavaScript from Apple Events** (one-time toggle, off by default)

**Result:** 80 ServiceNow candidates sourced in ~26 seconds, both pages, all written to Supabase cleanly.

### LLM Matching Result

Triggered `POST /requirements/c8e44291.../match` with recruiter headers. 73/80 candidates scored. Top 5:

| Score | Candidate profile |
|-------|------------------|
| 98 | ServiceNow dev, 10yr, Singapore |
| 95 | ServiceNow dev, 8yr, Singapore |
| 95 | ServiceNow architect, 11yr, Singapore (IBM) |
| 95 | ServiceNow architect, 13yr, Singapore |
| 95 | Senior ServiceNow dev, 14yr, Singapore |

**Status:** Fully working end-to-end ✅

---

## Pending Items

- [ ] **Skill normalization** — composite skill strings (e.g. "Python Django REST API") don't match individual skill filters. `_normalise_skills()` exists — validate end-to-end.
- [ ] **Naukri Resdex** — parked, needs budget approval from Nikhil.
- [ ] **Railway internal networking** — `/pipeline` times out on `ai-agents.railway.internal:8080`. Point `AI_AGENT_URL` to public Railway URL instead.
- [ ] **Pin Railway custom domain** — URL changed from `b4ef` to `50e8` mid-session. Set a custom domain so it never drifts.

---

## Next Session Quick Start

```bash
cd /Users/shohamshree/conductor/workspaces/recruitment-agents/el-paso

# Source candidates from Foundit AND trigger LLM matching in one command
python3 scripts/local_foundit_agent.py --once --req-id <uuid> --and-match
```

**Prerequisites each time:**
- Chrome open with `recruiter.foundit.sg` loaded (Bhuwaneshwar account)
- View → Developer → Allow JavaScript from Apple Events ✓ (one-time, already done)

**If Railway URL changes:** update `RAILWAY_AGENT_URL` in `el-paso/.env`

**Find open requirement UUIDs:**
```bash
curl -s https://ai-agents-production-50e8.up.railway.app/requirements \
  -H "x-user-role: recruiter" -H "x-user-email: nikshostudios@gmail.com" | python3 -m json.tool
```
