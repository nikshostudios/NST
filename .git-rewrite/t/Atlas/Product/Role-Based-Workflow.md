---
type: atlas-note
area: Product
updated: 2026-04-11
status: spec — build against this
sources: ["Nik + Shoham product feedback session April 11"]
generated-by: claude
---

# Role-Based Workflow Spec

> This spec defines who sees what, who can do what, and how work flows between
> recruiter → TL → client. This is the agency workflow layer that competitors don't have.

---

## Two Roles

### Recruiter
- Logs in with their own credentials
- Sees ONLY requirements assigned to them by default
- Can toggle "View all open requirements" to see the full team's board (read-only for unassigned ones) — transparency without clutter
- Can: search candidates, score, shortlist, generate outreach, submit candidates to TL
- Cannot: create requirements, approve submissions, send to client

### Team Lead (TL)
- Logs in with TL credentials
- Sees ALL requirements across all recruiters
- Can: create requirements, assign requirements to recruiters, review submissions, approve/reject, send to client, reassign
- Has a dedicated TL dashboard showing submissions grouped by recruiter, role, and client

---

## Requirement Flow

```
Client sends requirement to TL (email/call)
        ↓
TL creates requirement in system
  - Title, JD, skills, client, market, salary range
  - Assigns to one or more recruiters
        ↓
Requirement appears in assigned recruiter's dashboard
        ↓
Recruiter works the requirement (search, source, screen, outreach)
```

### Requirements View — Recruiter
- Default: "My Requirements" — only shows requirements assigned to this recruiter
- Toggle button: "All Open Requirements" — shows full team's requirements with:
  - Role, client, market, assigned recruiter name, status, days open
  - Read-only for requirements not assigned to them
  - Purpose: transparency — recruiter can see what the whole team is working on

### Requirements View — TL
- Sees all requirements grouped by status (active/paused/filled)
- Can filter by recruiter, client, market
- "Create Requirement" button (TL only)
- Can reassign requirements between recruiters

---

## Submission Flow

This is the critical differentiator. Two-step approval with full attribution.

```
Recruiter shortlists candidates
        ↓
Recruiter submits to TL
  - Submission includes: candidate profiles, match scores, recruiter's notes
  - Tagged with: recruiter name, requirement, client
        ↓
TL sees submission in "TL Approvals" queue
  - Grouped by: recruiter → requirement → client
  - TL can see exactly: which recruiter submitted which profiles for which role
        ↓
TL reviews each candidate
  - Options per candidate: Approve / Reject / Request changes
  - TL adds notes (visible to recruiter)
        ↓
TL selects approved candidates and chooses which client to send to
  - TL picks the client contact from a dropdown
  - System formats the submission with ExcelTech branding
        ↓
TL sends to client (or marks as ready-to-send for manual email)
```

### Example: The Raju Akula Scenario

TL Raju receives:
- 2 requirements from Client A (HCL Technologies):
  - Senior SWE → assigned to Priya
  - Network Engineer → assigned to Amit
- 1 requirement from Client B (Tech Mahindra):
  - System Engineer → assigned to Priya

Priya submits 2 candidates for Senior SWE and 2 for System Engineer.
Amit submits 2 candidates for Network Engineer.

**What Raju sees in TL Approvals:**

```
┌─────────────────────────────────────────────────────┐
│ TL Approvals (5 pending)                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ PRIYA S. (3 submissions)                            │
│ ├── Senior SWE → HCL Technologies                  │
│ │   ├── Rajesh Kumar (94% match) [Approve] [Reject] │
│ │   └── Arun Patel (87% match)  [Approve] [Reject] │
│ │                                                   │
│ ├── System Engineer → Tech Mahindra                 │
│ │   ├── Vikram Desai (92% match) [Approve] [Reject] │
│ │   └── Meera S. (78% match)    [Approve] [Reject] │
│                                                     │
│ AMIT K. (2 submissions)                             │
│ ├── Network Engineer → HCL Technologies             │
│ │   ├── Li Wei Chen (91% match) [Approve] [Reject]  │
│ │   └── Daniel Lim (85% match)  [Approve] [Reject]  │
│                                                     │
│ [Select approved → Send to Client]                  │
└─────────────────────────────────────────────────────┘
```

Raju approves Rajesh + Arun for Senior SWE, selects "HCL Technologies — Mr. Sharma" as recipient, and sends. Separately approves Vikram for System Engineer, selects "Tech Mahindra — Ms. Lee", and sends.

Clear attribution at every step: which recruiter found which candidate for which role going to which client.

---

## Authentication

### Current State (from Architecture.md)
The existing Railway app has `RECRUITER_LOGINS` dict with role flags (`TL` vs `recruiter`). Simple but functional.

### What We Need
- Login page with username/password
- Session-based auth (JWT or cookie session)
- Role stored in session: `recruiter` or `tl`
- Each recruiter has a `recruiter_id` that maps to the `assigned_to` field on requirements
- TL role bypasses the assignment filter (sees everything)

### Auth for the React Dashboard
- Login page → POST /api/auth/login → returns session token + role + recruiter_id
- All API calls include the session token
- Backend filters data based on role:
  - Recruiter: `WHERE assigned_to = current_user_id` (default) or all if toggle is on (read-only)
  - TL: no filter, sees everything

---

## Data Model Changes

### requirements table — add:
- `assigned_to` (UUID, references recruiters table) — which recruiter owns this
- `created_by` (UUID) — always the TL who created it

### submissions table — add:
- `submitted_by` (UUID) — the recruiter who submitted
- `reviewed_by` (UUID) — the TL who reviewed
- `sent_to_client_id` (UUID) — which client contact it was sent to
- `sent_to_client_at` (timestamp)
- Per-candidate status within submission: `candidate_statuses` (JSON array of {candidate_id, status: approved/rejected, tl_notes})

### recruiters table (new or extend users):
- `id`, `name`, `email`, `role` (recruiter/tl), `password_hash`, `active`

---

## Dashboard Changes

### Recruiter View
- Sidebar: same nav but no "Create Requirement" or "TL Approvals"
- Requirements page: default filtered to "My Requirements", toggle for "All Open"
- Submissions page: shows their own submissions and status (pending_tl / approved / sent / rejected)
- Search, Pipeline, Candidates, Sequences: filtered to their assigned requirements

### TL View
- Sidebar: includes "Create Requirement" and "TL Approvals"
- TL Approvals page: submissions grouped by recruiter → requirement → client (as shown above)
- Requirements page: all requirements with assignment controls
- Can view any recruiter's pipeline, candidates, sequences

---

## Related
- [[Atlas/Product/Architecture]]
- [[Atlas/Product/The-Fix-Plan]]
- [[Atlas/Product/Database-Schema]]
- [[Atlas/Business-Model/Steal-Their-Strategy]]
