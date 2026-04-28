---
type: decision
date: 2026-04-13
effort: Niksho-SaaS-Product
owners: Nikhil & Shoham
status: decided
generated-by: claude-opus-4-6
---

# Decision — Channel Restructure (Core vs BD Add-on)

## Context

The v2 architecture originally proposed 8 sourcing channels including TheirStack (job postings), SerpApi/Google Jobs (job postings), and Adzuna (salary data + job postings). These don't return candidate profiles — they return job market intelligence. Mixing them into the core product confused the purpose: the core product finds candidates for known requirements, not new business opportunities.

## Options considered

### Option A — Keep all 8 channels in core product
- Pros: One integrated system, market intelligence baked in
- Cons: Muddies the product identity, three channels return wrong data type (job postings not candidates), confuses the user about what "sourcing" means

### Option B — Split: candidate channels in core, job intelligence in BD add-on
- Pros: Core product has a clear purpose (find candidates), BD module is a separate revenue stream ($200/mo premium), cleaner architecture, each part can ship independently
- Cons: Two things to build instead of one

## Decision

**We chose: Option B.**

**Removed from core:** TheirStack, SerpApi/Google Jobs, Adzuna job data (but Adzuna salary benchmarks stay in Screener, free tier).

**Added to core:** Apollo.io (already live), GitHub (tech roles), Lusha (phone enrichment), Hunter.io (email last resort).

**Moved to BD add-on ($200/mo):** TheirStack ($59/mo) + SerpApi ($5/mo) + Market Intelligence Agent. Proactive track: harvest open jobs → match against internal pool → recruiter pitches candidate to hiring company. Margin: ~$130/tenant.

**Also removed:** The "sourcing inversion" concept (agents continuously harvest jobs to pitch candidates proactively) was moved entirely into the BD add-on. The core product is reactive: client sends JD → system finds candidates.

## Why

The core pain for a 10-person agency is NOT "we don't know who's hiring." They know — clients send JDs daily. The pain is the 6-8 hours of mechanical work per JD. The core product solves that pain. Business development is a different pain that a different customer segment cares about.

## Reversibility

- [x] Easy to reverse (< 1 day)

The channels are modular. Moving TheirStack back into core is a config change, not an architecture change.

## How we'll know if this was wrong

If early SaaS customers consistently ask "can your product also find me new clients?" during onboarding, the BD module should be promoted from add-on to core or bundled into higher tiers.

## Linked notes

- Effort: [[Efforts/Niksho-SaaS-Product/Overview]]
- Atlas: [[Atlas/Product/Sourcing-Channels]]

---
*Template: [[Templates/Decision]] · Home: [[Home]]*
