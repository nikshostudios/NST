---
type: atlas-note
area: Business-Model
phase: 1
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Vision_and_Goals]]", "[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# Phase 1 — ExcelTech As The Proving Ground

## The one-sentence version
Automate ExcelTech's recruitment operations end-to-end so a 10-person team does the work of 30-40 people, and use those placement numbers as the credibility asset for Phase 2.

## What's already built (before automation)
A custom Python/HTML web app hosted on **Railway** with four working features:
1. **Resume upload / profile processing** — recruiters drop CVs, AI parses into CRM
2. **AI screening** — upload CV + JD, AI scores 1–10 with reasoning
3. **Outreach** — personalised emails from each recruiter's own Outlook
4. **Email intelligence** — reads Outlook, classifies, suggests replies

Full detail → [[Atlas/Product/Architecture]] and the source of truth → [[Raw/docs/ExcelTech_Pipeline_Developer_Reference]].

## What's being added
- **Supabase database** replacing all Excel tracking — see [[Atlas/Product/Database-Schema]]
- **Sourcing Agent** — auto-searches Foundit, MyCareersFuture, Apollo.io
- **Async pipeline** — parse → screen → outreach runs automatically
- **Follow-Up Agent** — monitors replies, extracts fields, drafts chase emails
- **Submission Formatter** — generates client-ready `.docx` in each client's exact format
- **Live recruiter dashboard** — pipeline visibility across all 10 recruiters

All five new pieces → [[Atlas/Product/Agents]]

## The before/after for one recruiter

| | Before automation | After automation |
|---|---|---|
| Sourcing | 2–3 hours | ~15 mins (review ranked shortlist) |
| Screening | 1–2 hours | 0 (automatic) |
| Outreach drafting | 30–60 mins | 5–10 mins (edit & send) |
| Inbox chasing | 1–2 hours scattered | notification-driven |
| Submission formatting | 30–60 mins | click → auto-generated |
| **Total mechanical work** | **6–8 hours** | **~1.5–2 hours** |

→ Detailed flow comparison in [[Atlas/ExcelTech/Current-Flow]] and [[Atlas/ExcelTech/New-Flow]].

## Success criteria for Phase 1

- [ ] All 10 recruiters on the Supabase-backed system
- [ ] Sourcing agent running against Foundit + MyCareersFuture + Apollo
- [ ] Async pipeline converting any new resume into a scored, ranked candidate automatically
- [ ] Follow-up agent handling replies end-to-end with recruiter approval
- [ ] TL submission queue replacing Excel-based tracking
- [ ] Measurable uplift: 4–8 additional placements per month attributable to throughput gains

Target: **Q3 2026** (aggressive; see [[Calendar/Quarterly/2026-Q2]] for the current sprint).

## What stays manual (intentionally)
- WhatsApp conversations — relationship-based
- Phone calls to candidates
- LinkedIn sourcing (AI generates search strings; humans run them)
- Client relationship management (TL's domain)
- Foundit portal credential maintenance

See the rules in [[mi.md]] — these are off-limits for automation.

## Operating cost sanity check
~SGD 400–550/month all in. Break-even is half a placement. Current rate: 62 placements over ~14 months. Target uplift post-automation: 4–8 extra placements per month from throughput alone. ROI is not the question — execution risk is.

Full pricing → [[Raw/docs/ExcelTech_Vision_and_Goals]] Section "Operating Costs".

## Related
- [[Atlas/Business-Model/Niksho-Vision]]
- [[Atlas/Business-Model/Phase-2-GTM]]
- [[Efforts/ExcelTech-Automation/Overview]] — active build
- [[Atlas/Product/Architecture]]
