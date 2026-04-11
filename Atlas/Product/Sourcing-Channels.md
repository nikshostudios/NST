---
type: atlas-note
area: Product
updated: 2026-04-10
sources: ["[[Raw/docs/sourcing-architecture]]", "[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# Product — Sourcing Channels

How we actually get candidates into the system. Four active channels, each with different mechanics, costs, and constraints.

## Channel matrix

| Channel | Market | Method | Cost | Constraint |
|---|---|---|---|---|
| **Foundit** | India + SG | Firecrawl + credentialed sessions, 3 shared accounts | Per-credit | Rate limits, account lockouts |
| **MyCareersFuture** | SG only | Public government API | Free | SG candidates only |
| **Internal DB** | Both | Direct Postgres query | Free | Only as big as our history |
| **LinkedIn** | Both | **Manual only** | Time | Hard rule: no scraping |

## Foundit

The workhorse for India. Three shared company accounts:

| Account | Login | Holder |
|---|---|---|
| 01 | `xExcelTech_Cominx01` | Rakesh |
| 02 | `xExcelTech_Cominx02` | Devesh |
| 03 | `xExcelTech_Cominx03` | Bhuwan |

### How the rotation works
- The Sourcing agent picks the least-recently-used account for a given search.
- If an account hits a Foundit rate limit (429-like response), it's marked `cooldown` for 30 minutes and the next call routes to another account.
- If all three are in cooldown, the skill queues the search for retry on the next scheduler tick.
- Credentials are stored encrypted in Supabase (see [[AIOS/skills/ship-check|ship-check]] for the pre-deploy verification).

### Search construction
The agent doesn't just dump the JD into the Foundit search bar. It:
1. Extracts must-have skills from `requirements.jd_structured`.
2. Maps JD terms to Foundit's taxonomy (e.g. "Snow Developer" → "ServiceNow Developer").
3. Constructs boolean queries with location + experience filters.
4. Paginates through results, pulls each profile, stores CVs.

See [[Raw/docs/sourcing-architecture]] for the original architecture doc.

### Firecrawl budget caps
Firecrawl credits are the operational cost floor for sourcing. A runaway loop would be expensive. Caps:
- Per-day hard cap (configurable env var)
- Per-requirement cap (prevents one JD from burning the whole day's budget)
- Alert when 80% of daily cap consumed

## MyCareersFuture (SG only)

Free **public API** from Singapore's government careers portal. This is a gift and we should use it heavily for SG reqs.

- No scraping required. Proper paginated JSON endpoints.
- No terms-of-service risk.
- Candidate records include work authorisation (SC/PR/EP), which feeds directly into the nationality filter for GeBIZ reqs.
- Rate limits are generous for API usage.

The SG Sourcing flow hits MyCareersFuture first, Foundit second, internal DB third.

## Internal database

Our own candidate history — 2,300+ candidates who reached interview stage, plus thousands of others who didn't. This is cheap gold:
- Zero marginal cost to query.
- Candidates we've already talked to = lower friction to re-engage.
- Match scoring uses the same Screener agent as external channels.

The Sourcing agent always checks the internal DB before going external. Saves money and speeds up time-to-shortlist.

## LinkedIn — manual only

**Hard rule, non-negotiable.** Reasons:
1. LinkedIn's Terms of Service explicitly forbid automated scraping. We don't want the litigation risk when we pitch this as SaaS.
2. Scraping LinkedIn at any scale gets IPs banned and accounts suspended — not a sustainable pipeline.
3. The credibility story for Phase 2 GTM depends on us being the agency that **didn't** cut corners. See [[Atlas/Business-Model/Phase-2-GTM]].

**What IS allowed:**
- Recruiters manually searching LinkedIn and copy-pasting candidate info into the web app.
- Recruiters receiving candidate CVs from LinkedIn messages.
- Posting JDs on recruiters' personal LinkedIn feeds to generate inbound.

**What is NOT allowed:**
- Any automated scraping, crawling, or API hitting of LinkedIn.
- Any agent that "reads" LinkedIn profiles in the background.
- Any Firecrawl job pointed at LinkedIn URLs.

This rule is echoed in [[mi]] NOT-to-do list and [[AIOS/skills/ship-check|ship-check]] verifies it on every deploy.

## Deduping across channels
Candidates are deduped by `(email || phone || name+city)` hash. When the Sourcing agent pulls a CV that already exists:
- Don't create a new candidate record.
- Update the existing record's `last_seen_on` and `source` array.
- Link the candidate to the new requirement via `submissions`.

This prevents the same person getting 3 outreach emails from 3 recruiters because they appeared in 3 channels.

## Related
- [[Atlas/Product/Agents#Sourcing-agent]]
- [[Atlas/Product/Skills#source-and-screen]]
- [[Atlas/Product/Database-Schema]]
- [[Atlas/ExcelTech/India-Market]]
- [[Atlas/ExcelTech/Singapore-Market]]
- [[Raw/docs/sourcing-architecture]]
