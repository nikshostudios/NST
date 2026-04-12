---
type: concept
generated-by: ingest-source
sources: ["[[Raw/docs/sourcing-troubleshooting-2026-04-11]]", "[[Raw/docs/sourcing-architecture]]"]
updated: 2026-04-11
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

**Actually returns candidates:** Foundit Recruiter (SG only, cookie auth), Apollo.io (global, paid API), Internal DB (historical candidates), Naukri RMS (India, subscription required)

**Returns job postings only:** MyCareersFuture, Foundit Public, Scrape.do + Foundit

**Manual only:** LinkedIn (hard rule — no automation)

## Related
- [[Wiki/tools/Firecrawl]]
- [[Wiki/concepts/Bot-Detection-vs-Scraping]]
- [[Wiki/techniques/Direct-API-Interception]]
- [[Atlas/Product/Sourcing-Channels]]
- [[Raw/docs/sourcing-troubleshooting-2026-04-11]]
