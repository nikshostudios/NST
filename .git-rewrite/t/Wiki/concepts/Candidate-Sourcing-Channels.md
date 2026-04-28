---
type: wiki-concept
generated-by: ingest-source
sources:
  - "[[Raw/docs/sourcing-troubleshooting-2026-04-11]]"
  - "[[Raw/docs/sourcing-architecture]]"
  - "[[Raw/docs/Beroz-Session-2026-04-25]]"
updated: 2026-04-28
---

# Candidate Sourcing Channels

The distinction between a **candidate sourcing** channel and a **job posting** channel is the single most important thing to validate before writing any pipeline code.

A candidate sourcing channel returns **people** — names, skills, experience, contact info. A job posting channel returns **jobs** — titles, companies, salary ranges. They look similar in search results but are fundamentally different data types.

## Why it matters to Niksho

The April 11 production test revealed that 3 of 4 channels in the ExcelTech pipeline were job-posting channels, not candidate-sourcing channels. MyCareersFuture, Foundit Public, and Scrape.do all return job listings. Only one channel — Foundit Recruiter (authenticated) — returns actual candidate profiles, and it's behind bot detection and expiring cookies.

> "The validation was purely technical ('did the code run without errors?') rather than business-level ('is this data actually candidates we can recruit?')." — [[Raw/docs/sourcing-troubleshooting-2026-04-11]]

## The lesson

Always answer these questions **before** writing pipeline code for a new channel:
1. Does it return candidate profiles (name, skills, experience, contact)?
2. Does it require authentication? If so, can auth be automated or does it need manual refresh?
3. What bot-detection measures are in place?
4. What market/geography does it cover?

## Channel categories for ExcelTech

**Active in production (as of 2026-04-25):** 7 channels, each independently env-gated and failure-isolated in the agentic-boost pipeline:

| Channel | Auth | Coverage | Notes |
|---|---|---|---|
| Internal DB | — | historical candidates | Always queried first |
| Apollo.io | API key | global; India ~95% email coverage | Adaptive search + pre-reveal quality flags |
| GitHub | token (optional) | technical roles globally | Searches by language + skill |
| Hugging Face | none / `HF_TOKEN` | ML/AI practitioners globally | Upserts by name (no email at search tier) |
| LinkedIn via Apify | `APIFY_TOKEN` | global; India well-covered | ⚠️ LinkedIn ToS risk; swap for Naukri if needed |
| YC directory via Apify | `APIFY_TOKEN` | founder/early-stage roles | Only fires on keyword match |
| Web Agent | Brave/SerpAPI key | unconstrained; AI-native | Claude Haiku query gen → Sonnet extraction |

**Returns job postings only (not candidates):** MyCareersFuture, Foundit Public, Scrape.do + Foundit

**Manual only (hard rule — no automation ever):** LinkedIn direct

**Planned / blocked:** Foundit Recruiter (SG only, cookie auth — bot-detection issues), Naukri RMS (India, subscription required — pending Prayag's API key), Apollo paid plan upgrade ($49 Basic, code ready)

## Related
- [[Wiki/concepts/Apollo-Pre-Reveal-Quality-Signals]] — two-phase flag-inspect-then-reveal pattern
- [[Wiki/concepts/Adaptive-Search-Progressive-Loosening]] — progressive query broadening for Apollo
- [[Wiki/tools/Firecrawl]]
- [[Wiki/concepts/Bot-Detection-vs-Scraping]]
- [[Wiki/techniques/Direct-API-Interception]]
- [[Atlas/Product/Sourcing-Channels]]
- [[Raw/docs/sourcing-troubleshooting-2026-04-11]]
- [[Wiki/digests/Session-Beroz-Apollo-MultiSource-2026-04-25]]
