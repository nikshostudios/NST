---
type: source
generated-by: ingest-source
source-file: "[[Raw/docs/sourcing-troubleshooting-2026-04-11]]"
updated: 2026-04-11
---

# Source: Sourcing Pipeline Troubleshooting — 2026-04-11

Post-mortem from the first end-to-end production test of the ExcelTech AI sourcing pipeline.

## What it covers

Ten issues discovered during Railway production deployment: service connectivity (resolved), PostgREST query limits (resolved), email-only upsert missing name-based fallback (fixed), pipeline count mismatch (partially fixed), Firecrawl blocked by Akamai on Foundit (critical blocker), cookie expiry (unresolved), MCF returning jobs not candidates (by design), Foundit public returning jobs not candidates (by design), skills extraction failure (not investigated), and Foundit SG-only geographic limit (by design).

## Key findings

3 of 4 sourcing channels return job postings, not candidate profiles. Only Foundit Recruiter returns real candidates, and it's blocked by bot detection. Apollo.io was listed but not tested (requires paid plan).

## Retrospective lesson

Validate what each channel actually returns BEFORE writing code. Technical success ("code runs") ≠ business success ("data is useful").

## Wiki notes created from this source
- [[Wiki/concepts/Candidate-Sourcing-Channels]]
- [[Wiki/concepts/Bot-Detection-vs-Scraping]]
- [[Wiki/tools/Firecrawl]]
- [[Wiki/techniques/Direct-API-Interception]]

## Related
- [[Atlas/Product/Sourcing-Channels]]
- [[Raw/docs/sourcing-architecture]]
- [[Raw/docs/ExcelTech_Master_Knowledge_Base]]
