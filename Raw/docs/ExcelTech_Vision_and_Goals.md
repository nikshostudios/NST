# ExcelTech — Vision, Goals & Roadmap
*Document created: April 2026 | Authors: Shoham & Nikhil*

---

## Who We Are

Two co-founders — Shoham and Nikhil. Nikhil's father runs **ExcelTech Computers**, an IT recruitment agency based in Singapore with recruiters operating from India. We are using ExcelTech as our proving ground: real business, real data, real users, real revenue.

We are not consultants. We are building a product. ExcelTech is Phase 1.

---

## The Immediate Problem We're Solving

ExcelTech's 10 recruiters currently spend 6–8 hours per day on work that is entirely mechanical:
- Manually searching portals for candidates
- Downloading and uploading resumes one by one
- Drafting outreach emails from scratch
- Monitoring inboxes and chasing replies
- Reformatting profiles into client-specific submission documents

The result: a recruiter can realistically work 2–3 open requirements at a time. The ceiling is human attention.

**We are removing that ceiling.**

---

## What We Are Building (Phase 1)

A fully autonomous AI-powered recruitment system — built on top of ExcelTech's existing Railway web app, not replacing it. The architecture is already partially live:

**Already built:**
- Resume parsing into CRM
- AI screening (scored 1–10 vs job description)
- Personalised outreach via Outlook
- Email intelligence — classifies inbox, suggests replies

**Being added:**
- Supabase database (replacing all Excel tracking)
- Sourcing Agent — auto-searches Foundit, MyCareersFuture, Apollo.io
- Async pipeline — parse → screen → outreach chain runs automatically
- Follow-Up Agent — monitors replies, extracts fields, drafts chase emails
- Submission Formatter — generates client-ready .docx in each client's exact format
- Live recruiter dashboard — pipeline visibility across all 10 recruiters and all open requirements

**The outcome for a recruiter after automation:**
> From 6–8 hours of mechanical work per day → ~1.5–2 hours of decision-making and relationship work.

One recruiter handling 3–4x more requirements with no added headcount.

---

## The Business Strategy (Phase 2)

Once the system is running and producing results at ExcelTech, we have a credibility asset that most recruitment software companies don't have: **a live system inside a real agency, with placement numbers to prove it.**

The go-to-market plan Nikhil's father has laid out:

1. **Land anchor clients at near-zero margin** — ExcelTech already works with HCL, PersolKelly, Tech Mahindra, and others. Offer this system to a few key clients as a service at negligible cost to get them embedded.
2. **Collect testimonials and conversion data** — real placement numbers, time savings, cost-per-hire comparisons.
3. **Package and sell to other agencies** — Nikhil's father has direct relationships with other recruitment firms that do everything manually. We go to them with proof, not a pitch deck.
4. **Expand to internal HR teams** — any company that does its own hiring (which is every company above a certain size) has the same underlying problem. Their TA teams run the same manual workflows: sourcing, screening, outreach, chasing, formatting. The product logic is identical; the sales pitch shifts from "increase placement revenue" to "reduce cost-per-hire and time-to-fill."
5. **High-ticket licensing** — once testimonials exist, we price properly. The value is obvious to anyone running a manual hiring operation.

**The total addressable market:** Recruitment agencies are the beachhead — small, feel the pain acutely, fast to buy. Internal HR teams are the real scale — every business that hires people. That is not a niche. That is horizontal infrastructure.

The product is not just a tool. It becomes the operational backbone of whichever organisation adopts it.

---

## The Funding Path (Phase 3)

Once we have a working product inside one or more agencies and can show:
- Revenue generated or commission uplift per recruiter
- Reduction in time-per-placement
- Cost of running the system vs ROI

...we have a fundable story. Not a prototype. Not a demo. A live SaaS product with paying customers and measurable outcomes.

That story goes to VCs and angels with a very specific pitch: **hiring operations are one of the last large white-collar workflows still running almost entirely on manual labor and Excel — inside agencies and inside every company that hires. We've solved it. Here are the numbers.**

Funding unlocks a proper team, proper infrastructure, proper distribution.

---

## The Bigger Vision (Where This Is Going)

There is a longer arc here that is worth documenting even if it feels distant.

The observation: the next generation of successful companies will not be built with large headcounts. They will be small teams — or even single founders — operating armies of autonomous agents. Code doing the work of dozens of people.

Greg Eisenberg's framing resonates: *"the next unicorn will be a cult with code."* Not a company with 500 employees. A small group of people with the right systems running underneath them.

Recruitment is a perfect test case for this thesis because:
- The workflow is highly repetitive and structured
- The inputs and outputs are well-defined (JDs, resumes, emails, submissions)
- The human work is mostly mechanical, not relationship-based
- The industry has been resistant to automation — meaning the gap between current state and possible state is massive

If we can fully automate recruitment operations with a 10-person agency as the test bed, we have proven the model. That model is transferable — not just to other recruitment firms but to any industry with a similarly structured workflow.

The long-term goal is to build something that fundamentally changes how hiring works: not by replacing the human relationships at the top of the funnel, but by eliminating all the mechanical overhead underneath them.

---

## Current Milestones

| Phase | Goal | Status |
|---|---|---|
| 0 | Existing web app (parse, screen, outreach, inbox) | ✅ Live on Railway |
| 1a | Supabase migration (replace Excel) | 🔄 In progress |
| 1b | Sourcing Agent (Foundit + MyCareersFuture) | 🔜 Next |
| 1c | Async pipeline (auto parse → screen → outreach) | 🔜 Next |
| 1d | Follow-Up Agent | 🔜 Planned |
| 1e | Submission Formatter | 🔜 Planned |
| 1f | Recruiter dashboard | 🔜 Planned |
| 2 | ExcelTech fully running on system, metrics collected | 🔜 Target: Q3 2026 |
| 3 | First external agency client | 🔜 Target: Q4 2026 |
| 4 | Funding round | 🔜 2027 |

---

## What We Are Not Doing

- Not rebuilding from scratch — the Railway app is the foundation, we extend it
- Not using third-party agent platforms (OpenClaw, Paperclip, etc.) — we own the stack
- Not automating relationship work — WhatsApp, phone calls, client management stays human
- Not over-engineering before the core is working — ship the pipeline, then add sophistication

---

## Operating Costs (Current)

| Service | Monthly |
|---|---|
| Claude API (Sonnet + Haiku) | ~SGD 120–230 |
| Supabase Pro | ~SGD 34 |
| Firecrawl Standard | ~SGD 112 |
| Apollo.io Professional | ~SGD 107 |
| Railway | ~SGD 7–27 |
| **Total** | **~SGD 400–550/mo** |

Break-even: half a placement. Current placement rate: 62 confirmed over ~14 months. Target post-automation: 4–8 additional placements per month from recruiter throughput gains alone.

---

## The Founding Principle

We are treating ExcelTech as a playground with real stakes. Real users, real clients, real money changing hands. This is not a side project or a portfolio piece. It is a business that we are systematically making autonomous — and documenting every decision along the way so that the system can be transplanted into any other agency that needs it.

The goal is not to build software. The goal is to make human time worth more by making machines do the work humans shouldn't have to do.

---

*This document is a living record. Update it when the strategy shifts, when milestones are hit, or when the vision clarifies further.*
