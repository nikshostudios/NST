# Sourcing Architecture Reference

**Last updated:** 9 April 2026

---

## Channel Overview

| Channel | Market | Type | Auth | Cost | Status |
|---|---|---|---|---|---|
| MyCareersFuture | SG only | Job postings | None (public API) | Free | Working |
| Foundit public (Firecrawl) | IN/SG | Job postings | None | ~$0.01/scrape | Working |
| Foundit public (Scrape.do) | IN/SG | Job postings | None | ~$0.005/scrape | Working |
| Foundit recruiter (cookie) | SG (subscription) | Candidate profiles | Session cookie | ~$0.01/scrape + credits for View Contact | Working |
| Apollo.io | IN/SG | Candidate profiles | API key | Per-credit | Needs paid plan |
| LinkedIn | IN/SG | Manual only | N/A | N/A | Search string generator only |

---

## MyCareersFuture

**Endpoint:** `GET https://api.mycareersfuture.gov.sg/v2/jobs`
**Auth:** None required
**Rate limits:** Unknown, appears unrestricted for reasonable usage
**Returns:** Job postings (not candidate profiles)

Key response fields:
- `title` — job title
- `postedCompany.name` — hiring company
- `salary.minimum/maximum` + `salary.type.salaryType` — salary range
- `skills[].skill` — tagged skills
- `minimumYearsExperience` — experience requirement
- `uuid` — job ID (for building URL)

**Limitations:** SG market only. Returns job listings, not people. Useful for understanding market demand and identifying hiring companies, not for direct candidate sourcing.

---

## Foundit Public Search

Two scraper backends available, toggled by `SCRAPER_BACKEND` env var:

### Firecrawl backend
- Uses Firecrawl extract API with JSON schema
- Returns structured data directly (no HTML parsing needed)
- More expensive per call (~$0.01)
- More reliable extraction

### Scrape.do backend
- Returns raw HTML, parsed with BeautifulSoup
- Cheaper per call (~$0.005)
- Fragile — CSS selectors break when Foundit updates their frontend

### HTML selectors (as of April 2026)
```
Card container:  .srpResultCardContainer
Job title:       .jobTitle
Company:         .companyName p
Experience:      .experienceSalary .details
Location:        .details.location
Posted date:     .timeText
Job ID:          .cardContainer[id]
```

**Limitations:** Public search shows job postings only. No candidate names, no skills breakdown, no contact info.

---

## Foundit Recruiter Search (Cookie Auth)

**This is the primary sourcing channel for real candidate data.**

### How it works
1. Human logs into `recruiter.foundit.sg` in Chrome
2. Copy the full Cookie header from DevTools Network tab
3. Firecrawl renders the search page with cookie injected
4. Browser actions fill the search form and click Search
5. Firecrawl extracts candidate data from the results page

### Domain
`recruiter.foundit.sg` (NOT `.in` — ExcelTech's subscription is Singapore)

### Search form selectors (as of April 2026)
```
Keyword input:   #Foundit_TagInput__inputcombined
Location input:  input[placeholder="Enter current location"]
Experience min:  input[placeholder="Min"] (inside range dropdown)
Experience max:  input[placeholder="Max"] (inside range dropdown)
Search button:   .Search_LeftStickyFoot-SearchCTA
```

### Firecrawl action sequence
```json
[
  {"type": "wait", "milliseconds": 3000},
  {"type": "click", "selector": "#Foundit_TagInput__inputcombined"},
  {"type": "write", "text": "<search query>"},
  {"type": "press", "key": "Enter"},
  {"type": "wait", "milliseconds": 500},
  {"type": "click", "selector": ".Search_LeftStickyFoot-SearchCTA"},
  {"type": "wait", "milliseconds": 8000}
]
```

### Candidate data returned
- Name (real person name)
- Current title/designation
- Current company
- Experience (years + months)
- Location
- Skills snippet (comma-separated)
- Last active date
- CV ID (for profile URL construction)

### Cookie details
- Key cookies: `C=<session hash>`, `csrftoken=<token>`, `django_language=en`
- The `C` cookie is the session identifier — httpOnly, not accessible via JavaScript
- Cookie expires in ~24-48 hours
- Must be refreshed by manual re-login

### Credit system
- Search results page: FREE (no credits spent)
- View Contact click: 1 Foundit credit per candidate (reveals email + phone)
- Current policy: do NOT auto-click View Contact; only when recruiter approves

### Why headless login fails
The login page at `recruiter.foundit.in` (and `.sg`) has an image CAPTCHA field (`input[name='login_captcha']`). Firecrawl and other headless browsers cannot solve CAPTCHAs, so username/password login is permanently blocked for automation.

---

## Apollo.io

**Endpoint:** `POST https://api.apollo.io/v1/mixed_people/search`
**Auth:** API key (`X-Api-Key` header) or OAuth (MCP)
**Status:** Free plan — People Search returns `API_INACCESSIBLE`

Requires paid plan for:
- People Search (find candidates in Apollo's 275M+ database)
- Email enrichment
- Phone number enrichment

Contacts Search (searching your own added contacts) works on free plan but returns 0 since no contacts have been added.

---

## A/B Testing (Firecrawl vs Scrape.do)

Controlled by `SCRAPER_BACKEND` env var in `.env`:
- `"firecrawl"` — Firecrawl only (default)
- `"scrape_do"` — Scrape.do only
- `"both"` — run both in parallel, compare results

When set to `"both"`, `run_all_sources()` in `sourcing.py` launches both backends via `asyncio.gather` and deduplicates results by email before upserting to Supabase.

---

## File Locations

| File | Purpose |
|---|---|
| `ai-agents/config/sourcing.py` | All sourcing logic — channel functions, parsers, credential rotation, A/B toggle |
| `ai-agents/test_sourcing.py` | Standalone test script — hits all channels, prints parsed results, no DB writes |
| `ai-agents/.env` (parent dir) | API keys: `FIRECRAWL_API_KEY`, `SCRAPE_DO_API_KEY`, `SCRAPER_BACKEND` |
| Supabase `portal_credentials` | Foundit login credentials (username, password, active flag) |
