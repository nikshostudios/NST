---
type: atlas-note
area: Product
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# Product — Database Schema

Single source of truth: **Supabase Postgres**. Migrated from an Excel tracker in April 2026 with zero errors across all sheets on the dry run.

Not exhaustive — this is the mental-model view. The canonical schema lives in the Supabase migrations folder and in [[Raw/docs/ExcelTech_Master_Knowledge_Base]].

## Core entities and their relationships

```
clients ──┬── client_contacts
          │
          └── requirements ──┬── submissions ── candidates ── cvs
                             │                      │
                             │                      └── recruiter_actions (audit)
                             │
                             └── gebiz_tenders ── gebiz_submissions
                                                   │
                                                   └── candidates

recruiters ──┬── recruiter_logins (auth + role)
             ├── requirements (assigned_recruiters)
             ├── submissions (owner)
             └── email_tokens (MS Graph per-inbox cache)

agent_runs (token usage / cost per agent call)
skill_runs (orchestration audit, links to agent_runs)
```

## Key tables

### `clients`
One row per hiring company. Imported from the 1,007-row BD CRM sheet.
- `id`, `name`, `market` (`india` | `singapore`), `notes`, `bd_owner` (usually Raja), timestamps.

### `client_contacts`
Many per client. These are the actual named humans Raja corresponds with.
- `id`, `client_id`, `name`, `title`, `email`, `phone`, `last_contacted_at`.

### `requirements`
The core work unit. One row per job.
- `id`, `client_id`, `title`, `market`, `jd_raw` (full JD text), `jd_structured` (JSONB of extracted must-haves, nice-to-haves, YOE, location, salary range, nationality rule)
- `status` (`open` | `on_hold` | `filled` | `cancelled`)
- `assigned_recruiters` (array of recruiter IDs — descriptive, not prescriptive; see [[Atlas/ExcelTech/Team#Assignment-convention]])
- `created_by`, `created_at`, `deadline_at`
- `priority` (set by TL)

### `candidates`
One row per real human candidate. Deduped by email + phone + name.
- `id`, `name`, `email`, `phone`, `current_location`, `preferred_location`
- `total_experience_years`, `relevant_experience_years`
- `current_ctc`, `expected_ctc` (normalised: INR LPA for India, SGD monthly for SG)
- `notice_period_days`
- `nationality` (critical for SG gov roles)
- `source` (`foundit` | `mycareersfuture` | `referral` | `direct` | `linkedin_manual`)
- `last_seen_in_inbox_at` (reply activity)

### `cvs`
One-to-many with candidates — a candidate may have multiple CV versions over time.
- `id`, `candidate_id`, `storage_url` (Supabase Storage), `parsed_text`, `parsed_structured` (JSONB), `uploaded_at`.

### `submissions`
A candidate being proposed for a requirement. The historical sheet had 14,000+ of these.
- `id`, `requirement_id`, `candidate_id`, `recruiter_id`, `status` (`draft` | `ready` | `sent_to_client` | `interview` | `offered` | `placed` | `rejected`)
- `match_score` (from the Screener), `screening_notes`, `submitted_at`, `client_feedback`.

### `gebiz_tenders`
SG-specific. One row per MOE/GeBIZ tender.
- `id`, `tender_number` (MOESCHETQ...), `role_title`, `school_or_cluster`, `deadline`, `status`.

### `gebiz_submissions`
Join table — one candidate submitted against one tender. This is the fan-out that produced 668 rows from 384 tenders historically.
- `id`, `tender_id`, `candidate_id`, `submission_status`, `submitted_at`.

### `recruiter_logins`
Auth + role flags.
- `email`, `name`, `role` (`TL` | `recruiter`), `market_focus` (`india` | `singapore` | `both`), `foundit_account_slot` (nullable — only Rakesh/Devesh/Bhuwan have one), `is_active`.

### `email_tokens`
Per-recruiter MS Graph OAuth cache. 1-hour TTL.
- `recruiter_email`, `access_token`, `refresh_token`, `expires_at`.

### `agent_runs`
Every call to an agent gets a row here. This is the operational backbone.
- `id`, `agent_name`, `model`, `input_tokens`, `output_tokens`, `cost_usd`, `latency_ms`, `status`, `error`, `triggered_by` (human or scheduler), `skill_run_id` (if part of a skill).

### `skill_runs`
One row per skill invocation, linking to its child agent_runs.
- `id`, `skill_name`, `triggered_by`, `inputs`, `outputs`, `status`, `started_at`, `finished_at`.

### `recruiter_actions`
Audit log of human actions. Who approved which outreach, who sent which submission.
- `id`, `recruiter_id`, `action_type`, `target_type`, `target_id`, `timestamp`, `notes`.

## Why this shape
- **Every mechanical output is a row.** You can replay a full day of work from the tables alone. No hidden state in a human's head.
- **Cost is first-class.** `agent_runs` and `skill_runs` make the unit economics of the system queryable. Critical for [[Atlas/Business-Model/Phase-3-Funding]].
- **Audit is first-class.** `recruiter_actions` means we can prove who did what if a client dispute ever happens.
- **SG tender workflow is modelled honestly.** Not crammed into the `submissions` table. Fan-out is explicit.
- **Recruiter identity is first-class.** Outreach from a named human inbox, not a shared alias.

## Multi-tenancy (future)
Row-level security will scope everything by `tenant_id` for Phase 2 SaaS. Not enforced yet — ExcelTech is a single tenant. Migration plan: add `tenant_id` columns nullable, backfill to "exceltech", enable RLS, make NOT NULL. See [[Efforts/Niksho-SaaS-Product/Overview]].

## Related
- [[Atlas/Product/Architecture]]
- [[Atlas/Product/Agents]]
- [[Atlas/Product/Skills]]
- [[Atlas/ExcelTech/Singapore-Market#The-GeBIZ-tender-workflow]]
