---
type: atlas-note
area: Product
updated: 2026-04-11
status: draft — pending Shoham review
sources: ["[[Raw/docs/sourcing-troubleshooting-2026-04-11]]", "[[Raw/docs/sourcing-architecture]]", "[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# Sourcing Strategy v2 — Post-Production-Test Revision

## What happened

On April 11, 2026 we ran the first end-to-end production test of the ExcelTech sourcing pipeline. Result: **zero usable candidates** despite the code reporting 50+ sourced. Three of four channels return job postings, not candidate profiles. The one channel that returns real candidates (Foundit Recruiter) is blocked by Akamai bot detection and requires manual cookie refresh every 24-48 hours.

Full post-mortem: [[Raw/docs/sourcing-troubleshooting-2026-04-11]]

## The real state of play

### What we actually have right now

| Channel | Returns candidates? | Works? | Market |
|---|---|---|---|
| Internal DB (2,300+ historical candidates) | Yes | Yes | IN + SG |
| Foundit Recruiter (cookie auth) | Yes | Blocked by Akamai | SG only |
| Apollo.io (free plan) | Yes | People Search locked behind paid plan | Global |
| MyCareersFuture | No — job postings | N/A | SG |
| Foundit Public / Scrape.do | No — job postings | N/A | IN + SG |

**The Internal DB is the only reliably working candidate source right now.**

### What we need

India market: a candidate resume database with API or scrapeable access. Currently we have **zero** automated channels for India candidates.

Singapore market: Foundit Recruiter (once unblocked via direct API) + MyCareersFuture for market intelligence + Internal DB.

---

## The revised channel strategy

### Tier 1 — Fix immediately (this week)

**1a. Foundit Recruiter → Direct API interception**

The recruiter portal at `recruiter.foundit.sg` is a Next.js SPA. When a recruiter searches, the frontend makes XHR/fetch calls to a backend API that returns structured JSON candidate data.

**Action:** Open Chrome DevTools → Network → Fetch/XHR filter → perform a search → capture the API endpoint URL, headers, request body, and response format. Replace `source_foundit_with_cookie()` in `config/sourcing.py` with a direct `httpx` call to that endpoint using the session cookie.

This bypasses Firecrawl entirely (no cost, no rendering, no fingerprinting). The cookie still expires every 24-48h but that's manageable — one manual refresh per day is acceptable for now.

**Owner:** Shoham
**Estimated time:** 2-3 hours once the API endpoint is captured

**1b. Internal DB — already working, just surface it properly**

2,300+ candidates already in Supabase. The pipeline should check Internal DB FIRST before going external. Matching logic needs the same skill-overlap query, but with proper skill normalisation (composite strings like "ServiceNow JavaScript ITSM" need splitting).

**Action:** Fix the `.overlaps()` query to normalise skills before matching. This also fixes Issue 4 from the troubleshooting doc.

**Owner:** Shoham
**Estimated time:** 1 hour

### Tier 2 — Add this quarter (before Phase 2 GTM)

**2a. Apollo.io — upgrade to Basic plan ($49/user/month)**

Apollo has 210M+ contacts, works globally (India + SG), and has a proper REST API. On Basic plan you get 900 credits/year. On Professional ($79/mo) you get unlimited credits (fair use). The People Search endpoint lets you filter by title, skills, location, company — exactly what a sourcing agent needs.

You already have the Apollo MCP connected from the Cowork session. The `apollo_mixed_people_api_search` tool is there — it just needs a paid plan to unlock.

**Cost:** $49-79/mo per user
**Value:** The only channel that gives you both India AND Singapore candidates with verified email addresses through a stable, documented API with zero bot-detection risk.

**Action:** Upgrade Apollo plan. Test the People Search API against a real ExcelTech requirement. If it returns usable candidates, build it into `run_all_sources()` as the primary external channel.

**2b. Naukri RMS — India's largest resume database (69M+ jobseekers)**

Naukri (Info Edge India) is the dominant job + candidate platform for India. Their RMS product has API access and a 69M+ resume database. ExcelTech's recruiters almost certainly already use Naukri manually for India sourcing.

**Action:** Check with Nik's dad / the team — does ExcelTech already have a Naukri RMS subscription? If yes, get API access. If no, evaluate the cost vs. the India market revenue it enables.

**2c. MyCareersFuture — repurpose as market intelligence, not sourcing**

MCF returns job postings, not candidates. But that data IS useful: it tells us which companies are hiring for which roles in Singapore, salary benchmarks, and skills in demand. Repurpose the MCF pipeline to feed a "market demand" dashboard rather than the candidate sourcing pipeline.

**Action:** Move MCF from `run_all_sources()` to a separate `market_intelligence()` function. Use the data to prioritise which requirements to source first (higher demand = more placements to win).

### Tier 3 — Evaluate later

**Foundit official API partnership**

Monster/Foundit has a partner ecosystem of 500+ integrations. They may offer an official API for recruiter search to integration partners. Contact: cr@foundit.in.

**Benefit:** Stable, sanctioned access to the candidate database without cookie hacks.
**Risk:** May require a larger subscription tier or partnership agreement.
**Action:** Nik should email cr@foundit.in asking about API/integration access for recruitment agencies.

**hireEZ — AI sourcing platform**

Scans 40+ sources across the open web for candidate profiles. $169-250/user/month. Has an API. Overkill for our current stage but worth evaluating if Apollo doesn't cover the India market well enough.

**Jobin.cloud — free tier for small agencies**

Free plan with sourcing, outreach, and CRM. Worth testing as a supplementary channel.

---

## What to do with Firecrawl

Don't kill it. Redirect it.

Firecrawl is bad at scraping behind authentication on bot-protected portals. It's good at:

1. **Scraping job descriptions from client career pages** — when a client sends a requirement, auto-fetch the full JD from their careers site and feed it to the Haiku extraction.
2. **Company research** — scrape a company's "About" page before outreach to personalise emails.
3. **Content capture for the vault** — web articles → markdown → Raw/clippings.

Keep the Firecrawl subscription but stop pointing it at Foundit Recruiter. Use it where it actually adds value.

---

## Revised sourcing priority order

When a new requirement comes in, the sourcing agent should query channels in this order:

1. **Internal DB** — free, instant, candidates we've already vetted
2. **Apollo.io** — stable API, global coverage, verified contacts (once on paid plan)
3. **Foundit Recruiter direct API** — SG candidates with real profiles (once intercepted)
4. **Naukri RMS** — India candidates (once API access is confirmed)
5. **LinkedIn** — manual only, recruiter posts + DMs

If none of the above return enough candidates, flag the requirement for manual sourcing by the recruitment team.

---

## Cost comparison

| Channel | Monthly cost | Credits/candidates | Bot risk | Market |
|---|---|---|---|---|
| Internal DB | $0 | Unlimited | None | IN + SG |
| Apollo Basic | $49/mo | ~75 enrichments/mo | None | Global |
| Foundit direct API | $0 (existing subscription) | Unlimited searches | None (direct API) | SG |
| Naukri RMS | TBD (check existing sub) | TBD | None (official API) | India |
| Firecrawl (repurposed) | Existing plan | ~100 scrapes/day | Low (public pages) | N/A |
| **Total** | **~$49-79/mo new spend** | | | |

Compare to hireEZ at $169-250/user/month or LinkedIn Recruiter at $170+/month.

---

## Next actions (ordered)

1. **Today:** Capture the Foundit Recruiter XHR endpoint (Shoham — Chrome DevTools)
2. **Today:** Fix skill normalisation for Internal DB matching (Shoham — code)
3. **Today:** Push pending commits to GitHub before they get lost (Shoham — git)
4. **This week:** Upgrade Apollo to Basic, test People Search against a real req
5. **This week:** Ask ExcelTech team about Naukri RMS subscription status (Nik)
6. **This week:** Email cr@foundit.in about API partnership (Nik)
7. **This week:** Move MCF to market intelligence function, out of sourcing pipeline (Shoham)
8. **This week:** Repurpose Firecrawl for JD scraping and company research (Shoham)

## Related
- [[Raw/docs/sourcing-troubleshooting-2026-04-11]]
- [[Raw/docs/sourcing-architecture]]
- [[Atlas/Product/Sourcing-Channels]]
- [[Atlas/Product/Agents]]
- [[Wiki/concepts/Candidate-Sourcing-Channels]]
- [[Wiki/tools/Firecrawl]]
- [[Wiki/techniques/Direct-API-Interception]]
- [[Efforts/ExcelTech-Automation/Overview]]
