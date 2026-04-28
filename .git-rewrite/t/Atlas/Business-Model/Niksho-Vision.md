---
type: atlas-note
area: Business-Model
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Vision_and_Goals]]"]
---

# Niksho — Vision & The Three-Phase Plan

> Niksho is the parent venture. ExcelTech is the proving ground. The second brain is the operating system. All three work together.

## Who we are

Two co-founders — **Shoham** and **Nikhil**. Nikhil's father runs **ExcelTech Computers**, an IT recruitment agency based in Singapore with recruiters operating from India. We're using ExcelTech as our proving ground: real business, real data, real users, real revenue.

We are **not consultants**. We are building a **product**. ExcelTech is Phase 1.

Full context on the people: [[Atlas/People/Shoham]], [[Atlas/People/Nikhil]].

---

## The problem in one paragraph

ExcelTech's 10 recruiters spend 6–8 hours per day on entirely mechanical work: searching portals, downloading CVs, writing outreach emails, chasing replies, reformatting profiles. A recruiter can realistically work 2–3 open requirements at a time. **The ceiling is human attention.** We are removing that ceiling.

---

## The three phases

### Phase 1 — Build it inside ExcelTech
Turn ExcelTech into a living test of the system. Automate sourcing, screening, outreach, follow-up, submission formatting. Full detail → [[Atlas/Business-Model/Phase-1-ExcelTech]] and the active build → [[Efforts/ExcelTech-Automation/Overview]].

### Phase 2 — Productise and sell
Once the system is running and producing results at ExcelTech, we have a credibility asset that most recruitment software companies don't have: a live system inside a real agency with placement numbers to prove it. Full detail → [[Atlas/Business-Model/Phase-2-GTM]].

### Phase 3 — Fundraise
With paying customers and placement metrics, raise a proper round in 2027. Full detail → [[Atlas/Business-Model/Phase-3-Funding]].

---

## The bigger vision

The observation that frames all of this: **the next generation of successful companies will not be built with large headcounts.** They will be small teams — or even single founders — operating armies of autonomous agents. Code doing the work of dozens of people. Greg Eisenberg's framing: *"the next unicorn will be a cult with code."*

Recruitment is a perfect test case because:
- The workflow is highly repetitive and structured
- The inputs and outputs are well-defined (JDs, resumes, emails, submissions)
- The human work is mostly mechanical, not relationship-based
- The industry has been resistant to automation — the gap between current state and possible state is massive

If we can fully automate recruitment operations with a 10-person agency as the test bed, we have proven the model. That model is transferable — not just to other recruitment firms but to any industry with a similarly structured workflow.

→ See [[Atlas/Business-Model/Product-Thesis]] for the deeper version of this argument.

---

## What we are NOT doing

- Not rebuilding from scratch — the Railway app is the foundation, we extend it. See [[Atlas/Product/Architecture]].
- Not using third-party agent platforms (OpenClaw, Paperclip, etc.) — we own the stack.
- Not automating relationship work — WhatsApp, phone calls, client management stays human.
- Not over-engineering before the core is working — ship the pipeline, then add sophistication.

---

## Current milestones

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

Live tracking → [[Calendar/Quarterly/2026-Q2]] and [[Efforts/ExcelTech-Automation/Overview#Milestones]].

---

## Founding principle

> We are treating ExcelTech as a playground with real stakes. Real users, real clients, real money changing hands. This is not a side project or a portfolio piece. It is a business that we are systematically making autonomous — and documenting every decision along the way so that the system can be transplanted into any other agency that needs it.
>
> The goal is not to build software. The goal is to make human time worth more by making machines do the work humans shouldn't have to do.

---

## Related
- [[Raw/docs/ExcelTech_Vision_and_Goals]] — the original canonical vision doc
- [[Atlas/Product/Architecture]] — how we're building it
- [[Efforts/ExcelTech-Automation/Overview]] — what's in motion right now
- [[Wiki/concepts/AI-OS]] — the operating-system framing for how we organise thinking
