---
type: effort-spec
area: Niksho-SaaS-Product
owner: Shoham & Nikhil
updated: 2026-04-19
generated-by: claude-cowork
sources: ["cofounder conversation 2026-04-19"]
status: draft
---

# Executable Items — Submissions Page + Analytics + Integrations

> Captured from the founder/cofounder walk-through of the Submissions page, Analytics rework, and Integrations thinking. Everything here is something we need to actually build. Non-executable framing is kept out.

## 1. Submissions Page — two role-based views

The Submissions page must split into two different views depending on who is logged in.

### 1.1 Recruiter view
- Landing screen is a grid of **cards ("proprietary flashcards")**, one per open requirement the recruiter is assigned to.
- Clicking a card opens the requirement's submission screen for that recruiter.
- Inside a requirement the recruiter can **submit a candidate** (existing flow).
- After submission, a new row appears in the recruiter's **"sent items" table** for that requirement, with status `Pending`.
- Status updates in real time:
  - `Pending` → `Approved` when the TL approves and forwards to the client.
  - `Pending` → `Rejected` when the TL rejects (with reason).
- The table closes the loop so the recruiter can see the outcome of what they submitted.

### 1.2 TL view
- Landing screen is a grid of **cards**, one per open requirement owned by that TL (e.g. `Software Engineer`, `Network Engineer`, `System Engineer`).
- Clicking a requirement card opens the **requirement detail screen**, which lists every recruiter assigned to that requirement and the **submission count next to each recruiter** (e.g. "Person A — 4 submissions", "Person B — 3 submissions").
- From here, the TL can drill into a recruiter's submissions **or** switch to a flat table view of all submissions on that requirement.

## 2. Submissions table (TL drill-in)

Replace the per-candidate card layout on the TL side with a **table view** for submitted candidates.

### 2.1 Columns (minimum)
- Candidate name
- Role / requirement
- Submitted by (recruiter)
- Date added / submitted time
- Salary / CTC
- Status (`Pending`, `Approved`, `Rejected`)
- Any other structured fields already extracted by the Screener agent

### 2.2 Filtering and grouping
- Filter by **date added** / recent.
- Filter + **group by recruiter** ("submitted by") so the TL can collapse the table into per-recruiter clusters.
- Filter by status, requirement, and other structured fields.
- Persist the user's last view where feasible.

## 3. Candidate row detail + TL actions

Clicking a row in the submissions table opens a **right-side detail panel** for that candidate. Inside this panel the TL can:

- **Add a comment** (free text, e.g. "salary 10k, budget is 8k").
- **Reject** the candidate with a **required reason**.
- **Approve** and forward the candidate to the next step (client submission).

### 3.1 On reject
- Candidate is **removed from the open requirement's active submission list**.
- Candidate record + rejection reason is **written to the database** (kept for future re-use / analytics / re-surfacing on other requirements).
- Recruiter's row status flips from `Pending` → `Rejected` in their sent-items table.

### 3.2 On approve
- Candidate is added to the **final client submission batch** for that requirement.
- Recruiter's row status flips `Pending` → `Approved`.

## 4. Recruiter performance tracking

The Submissions data must feed a **performance view**, not just a closed loop.

- Track per-recruiter: total submissions, approved submissions, rejection rate, submissions per day.
- Show submissions-per-day over time as a **graph** (per recruiter, and in aggregate).
- This is the signal the TL uses to see who is consistently underperforming.

Business reason (quoting the call): *"it's like a performance tracker in disguise."*

## 5. Rename Analytics → Performance (recruiter side)

- On the recruiter's own dashboard, the **Analytics tab is renamed to Performance**.
- It shows that recruiter's own submission metrics + the pipeline funnel filtered to their work.
- Removes the "what does Analytics actually do for me" ambiguity we flagged on the call.

## 6. Pipeline / funnel analytics

Keep the pipeline view **global** (not attached per-requirement), but make it **filterable by requirement**.

### 6.1 Funnel stages
- Sourced (e.g. 1,000)
- Shortlisted (e.g. 100)
- Submitted (e.g. 10)
- Approved (e.g. 1)

### 6.2 Requirements
- Global view by default.
- Dropdown / filter to **scope the funnel to one or more requirements**.
- Funnel numbers must be computed from live DB state, not hardcoded.

## 7. Usage tab

Keep the Usage tab but make it actually mean something.

- Show **API calls**, **tokens consumed**, and **estimated cost**.
- Needs a real backend feed (today it's a front-end stub).
- In the future: surface this per tenant when we sell the SaaS externally, as billing / credits.

## 8. Integrations tab

### 8.1 Short-term (ExcelTech internal)
- Today, use Integrations purely to **display which agents / services are active** (which agents are running, where tokens are being spent, where API calls originate).
- Remove or clearly mark integrations that are **not actually wired up** (e.g. Firecrawl, Apollo currently showing without a backend).

### 8.2 Future (SaaS tenants)
- Allow tenants to connect:
  - **Gmail** accounts
  - **Microsoft / Outlook** accounts
  - **External ATS** (Applicant Tracking System) of their choice
- Every connection should appear in the Integrations tab with status + last sync.
- Benchmark how Juicebox surfaces integrations in their UI and borrow patterns where they fit.

## 9. ATS clarification (architecture note that affects the build)

- Supabase is our **internal data store**, not the user-facing ATS.
- The user-facing ATS is a **separate, human-readable layer** that we still need to build — we can't hand tenants raw Supabase access.
- Any Submissions / candidate screen the TL or recruiter sees **is effectively the ATS surface**, so this spec is directly on the critical path for the SaaS-facing ATS.

## 10. Open follow-ups

Tracked here so they don't drop:

- Sit down and spec the **Juicebox integrations audit** (what to steal, what to skip).
- Decide the exact **schema** for rejected candidates in the DB (reason enum vs. free text, visibility across requirements, re-surfacing rules).
- Decide **permissions model** for the ATS layer — what does a recruiter see vs. a TL vs. a future tenant admin.
- Confirm whether the pipeline funnel needs a **per-requirement mini-funnel** on the requirement detail page in addition to the global one (current decision: no, filter globally).

---

## Build order (suggested)

1. TL requirement cards → requirement detail → submissions table (sections 1.2 + 2).
2. Row detail panel with comment / approve / reject (section 3).
3. Recruiter cards + sent-items table with live status (section 1.1).
4. Performance view + per-recruiter graphs (sections 4 + 5).
5. Global pipeline funnel with requirement filter (section 6).
6. Usage tab real backend (section 7).
7. Integrations cleanup + future connection surfaces (section 8).

## Related
- [[Atlas/ExcelTech/New-Flow]]
- [[Atlas/Product/Architecture]]
- [[Efforts/Niksho-SaaS-Product/Overview]]
- [[Atlas/People/Raja-TL]]
- [[Atlas/People/Recruiters]]
