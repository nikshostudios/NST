---
type: atlas-note
area: Product
updated: 2026-04-14
generated-by: claude-opus-4-6
sources: ["[[Raw/docs/sourcing-architecture]]", "[[Atlas/Product/Sourcing-Channels]]"]
---

# Product — Foundit EDGE API Integration

> Reference document for the official Foundit EDGE ATS Search Integration.
> This replaced the cookie-based reverse-engineered SPA API as of 2026-04-13.
> Decision record: [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-foundit-edge-api]]

## Overview

Foundit (formerly Monster) provides an official ATS EDGE Integration kit with five HTTP endpoints. The kit was provided by Prayag Sanghvi (Sr Manager APAC, Foundit). It gives us programmatic search, candidate profile data, and master data — all with API key + token auth instead of browser cookie scraping.

## Authentication

**Endpoint:** `POST {baseUrl}/generate/api/token`

Requires: `apiKey` (provided by Foundit on onboarding), `username`, `password`, `corpId`, `channelId`, `subChannelId`.

Returns a token string. Token expires after **45 minutes of inactivity** (not 45 minutes from creation — inactivity-based). On 401, regenerate the token and retry. This is fully automatable with zero human intervention.

## Endpoints

### 1. Search API

**Endpoint:** `POST {baseUrl}/search`
**Headers:** `apiKey`, `token`, `Content-Type: application/json`
**Max results:** 160 per request (via `size` param)
**Pagination:** `from` offset + `size` limit

**Request body structure:**
```json
{
  "reqParam": {
    "corp_id": 560219,
    "login_id": 1347319,
    "channel_id": 4,
    "sub_channel_id": 6,
    "search_version": 2.0,
    "candidate_profile_flag": 1,
    "is_srp_filter_revamp": 1,
    "size": 40,
    "from": 0,
    "express_resumes": { "size": 10, "from": 0 },
    "queries": {
      "search_scope_id": 1,
      "skills": { "any": "Java, Python", "all": "Spring Boot" },
      "boolean": "(Java) AND (Spring Boot) NOT (Python)"
    },
    "filters": { ... },
    "refine_search": { "sort_by": "relevance" }
  }
}
```

**Key filter categories:**
- `company` — CTC range (min/max with currency), notice period (0/15/30/45/60/90 days), immediate joiner flag, serving notice period, company include/exclude with scope (current/past/both), designations
- `experience` — min_exp / max_exp (float, e.g. "1.09" = 1 year 9 months)
- `location` — current_locations, preferred_locations, AND/OR condition between them
- `education` — any_ug/any_pg/any_ppg with year ranges, specific degrees with institutions and specializations, condition AND/OR
- `nationality` — nationalities list, include_permanent_residents, include_work_auth, us_work_auth list
- `additional` — job_type (fulltime/parttime/contract), gender, verified email/mobile only, active days, age range, disability type, company funding status, company employee count range
- `industry` — industries list with scope (current/past/both)
- `personal_insight` — dozens of top-100/500 college flags for Asia, India, US, global, by country
- `education_insight` — prestigious college, recent grad, IIT/IIM flags
- `experience_insight` — not a job hopper, startup experience
- `work_experience_insights` — early startup employee, founded a company, seen IPO/exit, internally promoted

**Search modes:**
- **Simple:** `queries.skills.any` / `queries.skills.all` / `queries.exclude`
- **Boolean:** `queries.boolean` with AND/OR/NOT operators, e.g. `"(Java) AND (Spring boot) NOT (Python)"`
- **search_scope_id:** 1=profile, 2=resume, 3=skills, 4=title/designation, 5=title/designation/skill

**Sort options:** relevance, freshness, experience, most_viewed, least_viewed

**Response structure:** Returns `express_resumes` (premium candidates) + `all_resumes` (standard). Each resume contains: name, skills, experience, current_employment (with CTC, designation, employer), education, location, notice_period, social_urls (LinkedIn), p_uuid, and dozens of other fields. Does NOT include structured email/phone in the search response — those require the Candidate Profile API.

### 2. Candidate Profile API

**Endpoint:** `POST {baseUrl}/candidate-profile-data`
**Required params:** `channelId`, `subChannelId`, `corpId`, `login_id`, `p_uuid`

Returns the full candidate record including:
- **`email`** — list of `{"id": "user@gmail.com", "is_verified": true/false}`
- **`mobile_details`** — list of phone numbers
- **`resume_file_download_url`** — direct link to download the CV (or text saying "Candidate has not uploaded the resume")
- All fields from search plus: headline, work_auth, passport, actual_enriched_date, and more

**Critical for enrichment:** This is where we get structured contact data. The two-step pattern (search → screen → fetch profile for passing candidates) saves API calls.

### 3. Master Data API

**Endpoint:** `POST {baseUrl}/master-data`
**Returns:** Valid values for all search filters — locations (topCities, regionAndStates, internationalLocations), industries (topIndustryClusters), designations, degrees, specializations, institutions, languages, citizenships.

Cache this on startup or daily. Used to construct valid search requests.

### 4. Master Data V2 API

**Endpoint:** `POST {baseUrl}/master-data-v2`
Enhanced version with company names and designations for autocomplete.

## Market Configuration

| Market | Base URL | ChannelId | SubChannelId | SiteContext | CorpId |
|--------|----------|-----------|-------------|-------------|--------|
| Singapore | `https://recruiter.foundit.sg/recruiter-ats` | 4 | 6 | monstersingapore | 560219 |
| India | `https://recruiter.foundit.in/recruiter-ats` | 1 | 1 | rexmonster | 560219 |
| Hong Kong | `https://recruiter.foundit.hk/recruiter-ats` | 4 | 5 | monsterhongkong | — |
| Malaysia | `https://recruiter.foundit.my/recruiter-ats` | 4 | 11 | monstermalaysia | — |

ExcelTech currently uses Singapore and India. Other markets available if the SaaS product expands.

## Migration from Cookie-Based

The old approach called `recruiter.foundit.sg/edge/recruiter-search/api/search-middleware/v2/search` with a browser session cookie that expired every 24-48 hours. The EDGE API payload is nearly identical in structure — the migration is primarily:

1. Replace cookie auth with apiKey + token headers
2. Change endpoint URL to `/recruiter-ats/search`
3. Remove frontend-specific fields (appName, is_v2_request, sub_source, search_source)
4. Add `search_version: 2.0` and `is_srp_filter_revamp: 1` (required)
5. Add token management: generate on startup, cache, auto-refresh on 401
6. Add Candidate Profile API call for contact enrichment after screening

**Estimated effort:** 1-2 days.

## Action Items

- [ ] Obtain EDGE API key from Prayag Sanghvi (Foundit)
- [ ] Implement token generation + caching + auto-refresh
- [ ] Rewrite `source_foundit_with_cookie()` → `source_foundit_edge()`
- [ ] Add Candidate Profile API call for contact enrichment
- [ ] Fetch and cache master data for filter construction
- [ ] Test both SG and India markets

## Related

- [[Atlas/Product/Sourcing-Channels]] — channel lineup overview
- [[Atlas/Product/Enrichment-Strategy]] — phone-first enrichment waterfall
- [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-foundit-edge-api]] — the decision to switch
- [[Efforts/ExcelTech-Automation/Overview]] — production system this feeds into

---
*Template: Atlas note · Home: [[Home]]*
