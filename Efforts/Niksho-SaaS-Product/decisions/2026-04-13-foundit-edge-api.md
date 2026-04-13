---
type: decision
date: 2026-04-13
effort: Niksho-SaaS-Product
owners: Nikhil & Shoham
status: decided
generated-by: claude-opus-4-6
---

# Decision — Switch Foundit to Official EDGE API

## Context

Foundit's Sourcing channel was the single biggest reliability risk in the product. The existing approach reverse-engineered the recruiter portal SPA's internal REST API and authenticated with browser cookies that expired every 24-48 hours. When the cookie died, sourcing stopped until someone manually logged into Chrome and copied a new cookie.

Prayag Sanghvi (Sr Manager APAC, Foundit) sent ExcelTech an official ATS EDGE Integration kit with full API documentation: 5 endpoints, API key auth, 50-page search documentation with every filter supported.

## Options considered

### Option A — Keep cookie-based approach, automate refresh with Playwright
- Pros: Already works, no code rewrite, known payload structure
- Cons: Cookie expires every 24-48h, Playwright can be detected, needs residential proxies, Akamai might block the IP, fragile long-term, not SaaS-ready (each tenant would need their own Playwright instance)

### Option B — Switch to official EDGE API (token auth)
- Pros: API key auth (no cookies ever), documented endpoints, token auto-refreshes on 401, structured contact data via Candidate Profile API, covers India + SG + 7 other markets from same codebase, SaaS-ready (each tenant provides their own API key), Foundit supports this officially
- Cons: Need to obtain API key from Foundit (requires onboarding), migration effort ~1-2 days, search payload slightly different from current code

### Option C — Abandon Foundit, go all-in on Apollo
- Pros: Apollo already works, no auth headaches, global coverage
- Cons: Apollo doesn't have the depth of the Foundit resume database for India/SG active job seekers, different candidate pools (Apollo = passive, Foundit = active), losing India's #2 job board is a significant sourcing gap

## Decision

**We chose: Option B — official EDGE API.**

## Why

The migration is straightforward (payload is nearly identical), and it permanently solves the two biggest operational headaches (cookie expiry + Akamai bot detection). It also makes the product SaaS-ready — each tenant provides their own Foundit API key via the onboarding flow, no shared cookies or Playwright scripts.

## What we're giving up by choosing this

Nothing meaningful. The cookie-based approach offered no advantages over the official API. The only cost is ~1-2 days of migration work and needing to get the API key from Foundit.

## Reversibility

- [x] Easy to reverse (< 1 day)

The old cookie-based code stays in git history. If the EDGE API has issues, we can revert.

## How we'll know if this was wrong

If Foundit's EDGE API has undocumented rate limits that are tighter than the cookie-based approach, or if the API key onboarding process takes more than 2 weeks. In either case, fall back to cookie-based with Playwright automation.

## Linked notes

- Effort: [[Efforts/Niksho-SaaS-Product/Overview]]
- Atlas: [[Atlas/Product/Foundit-EDGE-Integration]]
- Atlas: [[Atlas/Product/Sourcing-Channels]]

---
*Template: [[Templates/Decision]] · Home: [[Home]]*
