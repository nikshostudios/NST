---
type: atlas-note
area: Business-Model
phase: 2
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Vision_and_Goals]]"]
---

# Phase 2 — Productise & Go To Market

## The thesis in one sentence
Once the system is live inside ExcelTech with measurable placement uplift, we have something most recruitment software companies don't: a credibility asset. We trade that for distribution.

## The five-step GTM plan (Nikhil's father's framing)

### 1. Land anchor clients at near-zero margin
ExcelTech already works with **HCL, PersolKelly, Tech Mahindra**, and others. Offer the system to a few key clients as a service at negligible cost to get them embedded.

### 2. Collect testimonials and conversion data
Real placement numbers, time-saving deltas, cost-per-hire comparisons. Not pitch-deck claims — audited data from live deployments.

### 3. Package and sell to other agencies
Nikhil's father has direct relationships with other recruitment firms that do everything manually. We go to them with **proof, not a pitch deck**. Existing trust is the wedge.

### 4. Expand to internal HR / TA teams
Any company above a certain size runs its own hiring. TA teams run the same manual workflows: sourcing, screening, outreach, chasing, formatting. The **product logic is identical** — the sales pitch shifts from "increase placement revenue" to "reduce cost-per-hire and time-to-fill."

### 5. High-ticket licensing
Once testimonials exist, price properly. Value is obvious to anyone running a manual hiring operation.

---

## Why this works (and where it might not)

**Why it works:**
- Agencies feel pain acutely → fast to buy
- Nikhil's father's network lowers CAC to near-zero for the first 5–10 clients
- The product is horizontal — every business that hires is a prospect eventually
- We're selling **operational backbone**, not a tool. Stickiness is high.

**Where it might not:**
- Agencies are notoriously cheap and slow to change
- Each agency has quirks (client formats, portal accounts, compliance) — productisation is non-trivial. Detail → [[Atlas/Product/Architecture]] "multi-tenant" considerations.
- Internal HR teams buy differently than agencies — slower, more committee-driven
- Pricing inflation past a certain point invites enterprise procurement friction

See [[Efforts/Niksho-SaaS-Product/Overview]] for the current productisation work.

---

## Target addressable market framing

> Recruitment agencies are the beachhead — small, feel the pain acutely, fast to buy. Internal HR teams are the real scale — every business that hires people. That is not a niche. That is horizontal infrastructure.

The product is not just a tool. It becomes the **operational backbone** of whichever organisation adopts it.

---

## What needs to be true before we start Phase 2 seriously
- [ ] ExcelTech metrics collected for at least 3 months on the full system
- [ ] Placement uplift measurable and defensible
- [ ] One case study written in the voice of a happy end-user (a recruiter or a TL)
- [ ] Multi-tenant architecture at least sketched — can we onboard a second agency without rebuilding?
- [ ] Pricing model decided (per-seat, per-placement, flat, hybrid)
- [ ] Sales motion defined — who pitches, what's the demo, what's the trial

## Related
- [[Atlas/Business-Model/Phase-1-ExcelTech]] — what has to ship first
- [[Atlas/Business-Model/Phase-3-Funding]] — what this enables
- [[Efforts/Niksho-SaaS-Product/Overview]] — current productisation (includes the Insforge migration plan)
