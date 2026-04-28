---
type: effort-note
area: ExcelTech-Automation
generated-by: claude-sonnet-4-6
created: 2026-04-19
status: active
tags: [webapp, redesign, brainstorm, submissions, requirements, ux]
---

# WebApp Redesign — Brainstorm Log

> This document captures everything from the 2026-04-19 co-founder brainstorm call.
> It is organised into three sections: **why**, **what was decided**, and **what still needs to be confirmed**.
> Nothing here should be built until the knowledge gaps are cleared.

---

## Why We Are Doing This

The current webapp has the structural bones but does not support the real-world workflow that ExcelTech actually runs. Right now, the recruiter → TL → client submission chain happens mostly over email: recruiters email a filled-out table to the TL, the TL reviews manually, and then sends a separate email to the client. There is no visibility, no status tracking, and no performance data.

The redesign exists to bring that entire loop inside the app so that:
- Recruiters submit structured data instead of free-form emails
- The TL can review, annotate, approve, and reject inside one view
- Rejected candidates are retained in the database, not lost
- Recruiter performance becomes measurable (and manageable)
- The pipeline funnel — from sourced to placed — becomes visible globally
- Inbound leads can be driven via automated campaign posts to LinkedIn and Reddit

The secondary purpose is that everything we build here becomes a feature of the SaaS product sold to other agencies in Phase 2.

---

## Design Workflow (How We'll Approach This)

Before any development starts, we work through this sequence:

1. **Visualise first.** Mock up each page — either as a Claude-generated design artefact, a Figma wireframe, or even a quick HTML prototype. The goal is to see it before committing to building it. Nothing is final until we've looked at it on screen.

2. **Confirm the gaps.** There are specific things in the brainstorm that are still undefined (see the Knowledge Gaps section below). We do not start building a feature until those gaps are closed.

3. **Spec per page.** Once a page's design is agreed and its gaps are filled, write a tight spec: what the page shows, what actions are possible, what it writes to the database. Reference [[Atlas/Product/Database-Schema]] to verify the data already exists before designing new columns.

4. **Build incrementally.** One page or workflow at a time. Recruiter submissions first, TL review second, performance tab third. Campaigns and integrations are later-phase work.

---

## Features — What Was Decided

### 1. Requirements Tab Overhaul

The current requirements/projects tab is weak. Rename "Projects" to "Requirements" throughout the app — in the UI, in the codebase, in all labels. The tab should take inspiration from the Juicebox projects page structure. Concretely:

- Each requirement gets a table view (shortlist view and search results both become proper tables, not just lists)
- The existing card view may be kept as a toggle but the table view is the primary one
- Requirements are still TL-only to create; recruiters are assigned, not creators

This maps to the existing `requirements` table in Supabase — no new columns needed. The overhaul is purely a UI/UX change.

---

### 2. Submissions Page — Full Dual-Role Workflow

This is the centrepiece of the redesign. The submissions page becomes two distinct experiences depending on the user's role.

**Recruiter side:**

- When a recruiter opens submissions, they see cards for each requirement they have been assigned to.
- They click a card to enter that requirement's submission view.
- Inside, they upload resumes and fill in a structured table alongside them. The table captures: candidate name, current salary, expected salary, notice period (exact columns TBC — see Knowledge Gaps).
- They hit submit. The row populates immediately with a **Pending** status badge.
- That status later flips to **Approved** or **Rejected** based on the TL's action, closing the feedback loop for the recruiter.
- Recruiter cannot see other recruiters' submissions — only their own.

**TL side:**

- The TL sees all open requirements as cards/boxes. Same card metaphor as the recruiter, but covers all requirements, not just assigned ones.
- Clicking a requirement opens a unified table of all candidate submissions across every recruiter assigned to that requirement.
- Table columns include: candidate name, current salary, expected salary, notice period, submitted by (recruiter name), date added.
- Table is filterable by date added (most recent first) and groupable by recruiter.
- Clicking any row opens a side panel on the right where the TL can: read the submission details, add a note, and reject with a written reason.
- On rejection: the candidate is removed from the active submission pool but retained in the `candidates` table with the rejection reason stored. Not deleted.
- On approval: the candidate moves forward to the client submission queue (how this flows out is TBC — see Knowledge Gaps).

**Key permission rule:** Only TLs can create requirements. Consistent with how it works today. Recruiters are assigned; they cannot create.

---

### 3. Candidate Retention on Rejection

Rejected candidates are not deleted. They are retained in the database with:
- All their details (salary, notice period, CV)
- The rejection reason the TL typed
- A flag indicating which requirement they were rejected from

The intent is reusability: a candidate who was over-budget for role A today might be a good fit for role B next month.

This will likely require a minor schema extension — a `rejection_reason` column and a `rejected_from_requirement_id` on the candidates or submissions table. Cross-reference [[Atlas/Product/Database-Schema#submissions]] — `status: rejected` already exists; we need the reason text to be stored alongside it.

---

### 4. Analytics → Performance Rename

The "Analytics" tab for recruiters should be renamed "Performance". The content shifts from generic analytics to recruiter-specific productivity tracking:

- Daily submission counts
- Submission trends over time (graphed — e.g., submissions per day over the past 30 days)
- Approval vs rejection rate per recruiter
- Active requirements vs closed requirements

The explicit framing is: this becomes a performance management tool in disguise. It lets Nikhil and Raja see who is consistently submitting and who is underperforming without having to chase for updates.

---

### 5. Global Pipeline Funnel

A global funnel view showing the full pipeline as an inverse pyramid:

**Sourced → Shortlisted → Submitted → Approved → Placed**

This funnel is global (across all requirements), not per-requirement. It should be filterable by requirement so you can drill down, but the default view is the full picture.

Lives in the analytics/performance section. This is what the analytics tab currently gestures at but does not properly implement.

---

### 6. Campaign Feature (Inbound Lead Generation)

A new "Campaigns" section. Recruiters or TLs can create a campaign tied to a specific requirement. The system auto-generates a job post and pushes it to LinkedIn, Reddit, and similar platforms via integrations.

The purpose is driving inbound candidate leads to complement the existing outbound sourcing stack. Inbound candidates who apply flow into the same submissions pipeline.

This is a larger feature — it requires platform API integrations (LinkedIn, Reddit at minimum). Not for the immediate build sprint. Flag for Phase 1.5 or Phase 2.

---

### 7. Integrations Page (Future)

An integrations page where users can see and manage their connected tools. Juicebox's integrations page was cited as the design reference.

Near-term connections:
- Microsoft Outlook (already exists via MS Graph)
- Future: Gmail account connections
- Future: ATS connections (so external ATS systems can pipe data directly into the app)

The ATS integration is particularly relevant because Supabase is the internal database but it cannot be exposed to users directly — a human-readable ATS layer needs to sit on top. This is also the home for tracking inbound applicants.

Not needed for ExcelTech Phase 1 but the page should be designed with this roadmap in mind.

---

### 8. Usage Tab — Needs a Proper Definition

The usage tab currently shows API calls, token counts, and estimated cost (pulled in conceptually from Juicebox but not properly wired up on the backend). The backend has `agent_runs` with full cost data — this can actually be surfaced accurately.

Short-term: wire the usage tab to `agent_runs` so it shows real numbers (calls, tokens, cost) for the ExcelTech instance. This makes unit economics visible internally.

Long-term (Phase 2 SaaS): this becomes a billing view for external customers.

---

## Knowledge Gaps — Things to Confirm Before Building

These are open questions from the call. Nothing in sections 2 and 6 should be built until the relevant gaps below are closed.

### Gap 1 — Exact submission table columns
**Status: CLOSED** — source: HCL outreach email forwarded by Nikhil (2026-04-19).

The email Devesh sends to candidates contains a mandatory fill-in table. When the candidate returns it, Devesh compiles those responses and submits to the TL. That table defines the webapp's submission form fields.

**Full field list from the email template:**

| Field | Universal? | Notes |
|---|---|---|
| First Name (as per 10th Marksheet) | ✅ Universal | |
| Last Name (as per 10th Marksheet) | ✅ Universal | |
| DOB (YYYY/MM/DD) | ✅ Universal | Not in Supabase `candidates` yet — needs new column |
| Contact Number | ✅ Universal | Maps to `candidates.phone` |
| Email ID | ✅ Universal | Maps to `candidates.email` |
| Total Experience (in months) | ✅ Universal | Maps to `candidates.total_experience_years` (convert) |
| Relevant Experience (in months) | ✅ Universal | Maps to `candidates.relevant_experience_years` (convert) |
| Complete Address (City, State, Pin) | ✅ Universal | Not in Supabase yet — needs new column `address_full` |
| Current CTC | ✅ Universal | Maps to `candidates.current_ctc` |
| Expected CTC | ✅ Universal | Maps to `candidates.expected_ctc` |
| Current Location | ✅ Universal | Maps to `candidates.current_location` |
| Preferred Location | ✅ Universal | Maps to `candidates.preferred_location` |
| Notice Period or LWD | ✅ Universal | Maps to `candidates.notice_period_days` |
| Current Company | ✅ Universal | Not in Supabase yet — needs new column `current_company` |
| Hire Block | ❌ HCL-specific | Internal HCL hiring approval flag — exclude from generic template |
| Passport Number / SSC Marksheet Number | ❌ HCL-specific | Identity verification for HCL — exclude |
| Rehire + old SAP ID | ❌ HCL-specific | SAP = HCL internal system — exclude |

**Schema delta required** — 3 new columns needed on `candidates`:
- `date_of_birth` (date)
- `address_full` (text — City, State, Pin)
- `current_company` (text)

The HCL-specific fields (Hire Block, Passport/SSC, SAP ID) should not appear in the generic submission form. They could be surfaced as optional custom fields on a per-client basis in a future version.

---

### Gap 2 — Does the TL view keep cards or go straight to table?
**What we know:** The TL sees requirement cards on landing. When they click in, they see a table of submissions.
**What we don't know:** Does the card view stay as the landing for the TL's requirements, or does it shift to a table-of-requirements view at that level too? We discussed both but did not resolve it.
**How to close it:** Wireframe both options and show to Raja/Nikhil for a decision.

---

### Gap 3 — How does client submission actually work from the TL side?
**What we know:** After the TL approves candidates, they go "forward to the client."
**What we don't know:** Does the app generate a client-facing email (like step 9 in [[Atlas/ExcelTech/New-Flow]])? Or does the TL export/download the approved table and send it manually? This is the last mile of the workflow and it's unspecified.
**How to close it:** Confirm with Raja how he currently sends to clients and what format the client expects.

---

### Gap 4 — Performance tab: exact metrics and scope
**What we know:** Track daily submission counts, trends over time, plot graphs.
**What we don't know:** Is this visible only to TL/management, or can recruiters see their own stats? What is the time window default (last 7 days, 30 days, quarter)? Are approval/rejection rates shown to the recruiter or kept private?
**How to close it:** Ask Nikhil/Raja — this is a management call, not a design call.

---

### Gap 5 — Rejected candidate UX
**What we know:** Rejected candidates are retained in the DB with a reason and removed from the active submission pool.
**What we don't know:** Is there a visible "candidate pool" or "rejected" tab in the app for the TL to browse? Or does it just live in the database with no UI yet?
**How to close it:** Decide in the wireframe phase. Low priority for v1 — the data retention is more important than the UI for now.

---

### Gap 6 — Campaign feature: which platforms first, and who creates them?
**What we know:** LinkedIn and Reddit are the target platforms. The campaign is tied to a requirement.
**What we don't know:** Which platform's API is most viable (LinkedIn has strict API restrictions)? Does the recruiter create campaigns or only the TL? What does the generated post template look like?
**How to close it:** Do a quick feasibility check on LinkedIn's API access (it is notoriously restricted for posting). Reddit's API is more open. This gates whether the feature is even buildable in the near term.

---

### Gap 7 — Usage tab backend wiring
**What we know:** `agent_runs` in Supabase has the real cost and token data.
**What we don't know:** The frontend currently shows mocked/copied data from Juicebox with no real backend connection. What does the wired-up version need to show? Per-agent breakdown? Daily totals? Rolling 30-day?
**How to close it:** Shoham to define the query and decide on the display format before wiring.

---

## Related Files

- [[Atlas/ExcelTech/New-Flow]] — the automated workflow this redesign sits inside
- [[Atlas/Product/Database-Schema]] — existing schema; cross-reference before adding new columns
- [[Atlas/ExcelTech/Team]] — recruiter roles and TL identity (Raja)
- [[Efforts/Niksho-SaaS-Product/Overview]] — Phase 2 SaaS context; everything built here should be designed for multi-tenancy
