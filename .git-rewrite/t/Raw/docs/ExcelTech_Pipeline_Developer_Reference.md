# ExcelTech AI Recruitment Pipeline — Developer Reference
*Full architecture, layer-by-layer breakdown, and extension points.*

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    RAILWAY (Cloud)                       │
│                                                         │
│  ┌──────────────┐         ┌──────────────────────────┐  │
│  │  Flask App    │ ──────▶ │  FastAPI Agent Layer      │  │
│  │  (app.py)     │  HTTP   │  (ai-agents/main.py)      │  │
│  │  Port: $PORT  │         │  Port: 8080               │  │
│  │  Public URL   │         │  Internal only             │  │
│  └──────┬───────┘         └──────┬──────┬────────────┘  │
│         │                        │      │                │
└─────────┼────────────────────────┼──────┼────────────────┘
          │                        │      │
          ▼                        ▼      ▼
   ┌────────────┐          ┌──────────┐  ┌──────────────┐
   │  Browser    │          │ Supabase │  │ External APIs│
   │  (Users)    │          │ Postgres │  │              │
   └────────────┘          │ + RLS    │  │ • Anthropic  │
                           └──────────┘  │ • Graph API  │
                                         │ • Firecrawl  │
                                         │ • Scrape.do  │
                                         │ • Apollo.io  │
                                         │ • MCF API    │
                                         └──────────────┘
```

Two Railway services. Flask serves the UI and proxies to the FastAPI agent layer. FastAPI handles all AI logic, external integrations, and scheduled jobs. Supabase is the shared database.

---

## Layer 1: Flask Web App (`app.py`, ~3400 lines)

Serves HTML to recruiters, handles file uploads, proxies API calls to the agent layer.

**Auth model:** Session-based login. Credentials hardcoded in `RECRUITER_LOGINS` dict. Session cookie with version check — bump `SESSION_VERSION` to force re-login for all users.

```python
RECRUITER_LOGINS = {
    "devesh": {"password": "devesh27", "name": "Devesh Jhinga", 
               "email": "dev@exceltechcomputers.com", "role": "recruiter"},
    "raju":   {"password": "raju18", ..., "role": "tl"},
    ...
}
```

**Role-based access:** Two roles — `recruiter` and `tl`. Submissions tab only renders for TL role (`submissions_tab_display` CSS toggle). Role stored in `session["recruiter_role"]`.

**Key routes:**

| Route | What it does | Notes |
|---|---|---|
| `GET /` | Login page | Redirects to `/dashboard` if session valid |
| `GET /dashboard` | Main SPA-like page | Single HTML blob (~2000 lines) with tabs |
| `POST /upload` | Resume upload (PDF/DOCX) | PyMuPDF/python-docx extraction, saves to `resumes/` |
| `POST /run` | Screen resumes against JD | Legacy path, calls Claude directly (not via agent layer) |
| `GET /api/requirements` | Proxy → agent layer | Injects auth headers from session |
| `POST /api/requirements/create` | Proxy → agent layer | TL only |
| `POST /api/tl/approve-and-send` | Proxy → agent layer | TL only |
| `GET /api/pipeline` | Proxy → agent layer | Pipeline funnel view |
| `POST /source/upload` | Upload resumes for sourcing flow | Separate from main screening |
| `POST /source/send-emails` | Send outreach emails | MSAL (legacy) or proxies to agent layer |
| `POST /download-zip` | ZIP candidate resumes | AI-renames files using extracted candidate names |

**Proxy pattern:** Flask routes under `/api/*` forward to the agent layer with injected auth headers:

```python
AI_AGENT_URL = os.environ.get("AI_AGENT_URL", "http://localhost:8001")
# Headers injected: X-User-Role, X-User-Email
```

**Extension points:**
- New UI tab → edit `DASHBOARD_HTML` string, look for the tab-switching JS at the bottom
- New proxy route → follow `/api/requirements` pattern
- New file processing → add to upload handlers

---

## Layer 2: FastAPI Agent Layer (`ai-agents/main.py`, ~700 lines)

All AI logic, external integrations, scheduled jobs. Stateless except for in-memory agent/skill prompt caches loaded at startup.

**Startup sequence (`lifespan` context manager):**
1. Load all `.md` files from `agents/` → `AGENTS` dict (5 system prompts)
2. Load all `.md` files from `skills/` → `SKILLS` dict (5 skill prompts)
3. Initialise Anthropic client (global `claude` var)
4. Initialise Supabase client (singleton in `db.py`)
5. Verify Graph API connectivity (optional, non-blocking)
6. Start APScheduler — inbox cron every 15 min

**Critical design decisions:**
- Agent `.md` files loaded **once at startup** into memory dicts. Never re-read per request. Editing a prompt file requires a service restart.
- `_call_claude()` is the single chokepoint for all LLM calls. Every call goes through it, gets token-logged, uses the appropriate model.
- `_parse_llm_json()` strips markdown fences before parsing. Claude frequently wraps JSON in ` ```json ``` ` blocks — this handles that silently.

**Model routing:**

| Task | Model | Rationale |
|---|---|---|
| JD parsing, email classification, outreach drafting, reply parsing | `claude-haiku-4-5-20251001` | ~$0.001/call — good enough for structured extraction |
| Candidate screening, client submission formatting | `claude-sonnet-4-20250514` | ~$0.01/call — needed for scoring judgment and complex reasoning |

**Full endpoint reference:**

```
POST /requirements/create
  Auth: TL only
  Body: {client_name, market, role_title, skillset, jd_text, ...}
  Flow: Parse JD → extract skills (Haiku) → insert Supabase → trigger background sourcing
  Returns: {requirement_id, sourcing_started: true}

POST /requirements/{id}/source
  Auth: recruiter or TL
  Flow: run_all_sources() → parallel scraping → screen each candidate (Sonnet)
  Returns: {sourced_from: {apollo: N, foundit: N, ...}, total_unique: N}

GET /requirements
  Auth: any role
  Query: ?market=IN&status=open
  Returns: {requirements: [...], count: N}

POST /candidates/screen
  Auth: recruiter or TL
  Body: {candidate_id, requirement_id}
  Flow: Fetch candidate + requirement → Sonnet scores → insert screening
  Returns: {score, recommendation, reasoning, skills_match_pct, outreach_ready}

POST /candidates/prepare-outreach
  Auth: recruiter only
  Body: {candidate_id, requirement_id, recruiter_name, recruiter_email}
  Flow: Fetch data → Haiku drafts email with HTML details table
  Returns: {draft_subject, draft_body}  ← DRAFT ONLY, never auto-sends

POST /candidates/send-outreach
  Auth: recruiter only
  Body: {candidate_id, requirement_id, recruiter_email, final_subject, final_body}
  Flow: Graph API sends from recruiter's Outlook → log to outreach_log
  Returns: {message_id, thread_id, sent_at}

POST /inbox/process
  Body: {recruiter_email: optional — omit to scan all}
  Flow: Per recruiter → Graph API fetch unread → match to outreach threads
        → Haiku classifies reply → extract details → update DB
  Trigger: APScheduler every 15min OR manual call
  Returns: {processed: N, replies: [...]}

POST /candidates/submit-to-tl
  Auth: recruiter
  Body: {candidate_id, requirement_id, recruiter_email}
  Flow: Insert into submissions table with status pending
  Returns: {submission_id}

GET /tl/queue
  Auth: TL only
  Returns: list of pending submissions with screening scores

POST /tl/approve-and-send
  Auth: TL only
  Body: {submission_id, tl_email, client_email, email_subject, email_body_notes}
  Flow: Sonnet formats submission → Graph API sends to client → update submission
  Returns: {sent: true, sent_at}

GET /pipeline
  Auth: any role
  Query: ?market=IN
  Flow: 4 batch queries (screenings, outreach_log, submissions, candidate_details)
  Returns: funnel counts per requirement

GET /token-report
  Auth: none
  Flow: Reads /logs/tokens_YYYYMMDD.log, calculates costs
  Returns: {entries: [...], total_cost_usd}

GET /health
  Auth: none
  Returns: {status, supabase: bool, scheduler: bool, graph_api: bool}
```

---

## Layer 3: Config Modules (`ai-agents/config/`)

### `db.py` — Supabase CRUD

Singleton client pattern. All DB access through typed helper functions:

```python
get_client()
insert_candidate(data)
get_candidate_by_id(id)
upsert_candidate_by_email(data)      # dedup key — UNIQUE constraint on email
search_candidates_by_skill(skills, market)   # array overlap query
insert_requirement(data)
get_open_requirements(market)
get_requirement_by_id(id)
insert_screening(data)
insert_outreach_log(data)
insert_submission(data)
```

**Dedup strategy:** Candidates upserted by email. Same person found by multiple sources → later upsert updates the existing record, no duplicate rows. `email` column has a UNIQUE constraint.

**Extension:** Add new helper functions here per operation, no business logic in `db.py`.

---

### `outlook.py` — Microsoft Graph API

OAuth2 client credentials flow (app-level, not user-level):

```python
get_access_token(user_email)
send_email(from_email, to_email, subject, body_html)
get_unread_emails(user_email, folder="Inbox")
mark_as_read(user_email, message_id)
get_thread(user_email, thread_id)
```

**Auth:** Requires `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`. Azure app registration needs Application permissions (not Delegated): `Mail.Read`, `Mail.ReadWrite`, `Mail.Send`.

**Important:** Sends as the recruiter's actual mailbox (`dev@exceltechcomputers.com`), not a generic system address. Candidate sees a real person's email.

---

### `sourcing.py` — Candidate Discovery

Three channels running in parallel via `asyncio.gather`:

**Foundit via Firecrawl — two-step:**
```
Step 1: Scrape search results (free)
  → name, title, experience, location, skills snippet, profile URL
  → filter with _basic_skills_match before step 2

Step 2: Scrape individual profiles (1 Firecrawl credit each, max 20/run)
  → Firecrawl browser actions: login → navigate → click "View Contact"
  → email, phone, full work history, education, certifications
```

**Foundit via Scrape.do — same two-step, different scraper:**
```
Step 1: scrape.do proxy → raw HTML → BeautifulSoup parsing
Step 2: No login capability → public data only, no email/phone
```

**Apollo.io:**
```
POST /v1/mixed_people/search → name, email, linkedin_url, title, company
```

**MyCareersFuture (SG only):**
```
GET /v2/search → Singapore government free API
```

**A/B scraper toggle:**
```python
SCRAPER_BACKEND = os.environ.get("SCRAPER_BACKEND", "firecrawl")
# "firecrawl" | "scrape_do" | "both"
```

**Credential rotation:** Foundit accounts stored in `portal_credentials` table. Each sourcing run picks a random account to distribute click budget across the three available accounts.

---

### `cron.py` — Scheduled Jobs

```python
setup_scheduler()   # APScheduler, 15-min interval
run_inbox_scan()    # asyncio.gather across all recruiter inboxes
```

Recruiter emails from `RECRUITER_EMAILS` env var (comma-separated) or fallback to `portal_credentials` table. Per-recruiter error isolation — one failing inbox doesn't block the others.

Logs: `/logs/cron_YYYYMMDD.log`

---

## Layer 4: Agent and Skill Prompts (`agents/`, `skills/`)

`.md` files loaded at startup as Claude system prompts.

**Agents** (personas + behavioral rules):
```
agents/screener.md    — scoring rubric, what to weight, output schema
agents/outreach.md    — email tone, HTML table format, signature rules
agents/sourcing.md    — how to parse and normalise sourcing results
agents/formatter.md   — client submission formatting rules per client
agents/followup.md    — reply classification logic, chase cadence rules
```

**Skills** (step-by-step task instructions):
```
skills/process-inbox.md       — inbox scanning workflow
skills/source-and-screen.md   — full sourcing + screening pipeline
skills/prepare-outreach.md    — outreach drafting steps
skills/submit-to-tl.md        — submission preparation
skills/tl-send-to-client.md   — client email formatting
```

**How they're called:**
```python
result = _call_claude(
    model="claude-haiku-4-5-20251001",
    system=AGENTS["screener"],          # system prompt
    user_msg="Score this candidate...", # task data
    max_tokens=1024,
    endpoint="/candidates/screen",      # for token logging
)
```

**Extension:** Drop a new `.md` file in `agents/` or `skills/` — it auto-loads at startup. Reference via `AGENTS["your_new_agent"]` in the endpoint.

---

## Layer 5: Database Schema

```
candidates
  id (uuid PK), name, email (UNIQUE), phone
  skills (text[]), total_experience, current_location
  current_job_title, current_employer, highest_education
  market (IN/SG), source (foundit/apollo/mycareersfuture)
  created_at

requirements
  id (uuid PK), client_name, market (CHECK: IN/SG)
  role_title, skillset, skills_required (text[])
  experience_min, salary_budget, location, contract_type
  notice_period, tender_number (SG GeBIZ only)
  status (CHECK: open/closed/on_hold)
  assigned_recruiters (text[]), created_at

screenings
  id (uuid PK), candidate_id (FK), requirement_id (FK)
  recruiter_email, score (CHECK: 1-10)
  recommendation (shortlist/reject), reasoning
  skills_match_pct, experience_match, salary_fit
  created_at

outreach_log
  id (uuid PK), candidate_id, requirement_id, recruiter_email
  subject, body, message_id, thread_id (Graph API refs)
  sent_at, reply_received (bool), replied_at
  reply_classification (interested/not_interested/needs_followup)

candidate_details
  id (uuid PK), candidate_id, requirement_id
  status (new/contacted/replied/ready_for_review/submitted)
  nationality, work_pass_type, highest_education, certifications
  current_employer, current_role, total_experience
  relevant_experience, notice_period, current_ctc, expected_ctc
  availability_date, preferred_location, work_history (jsonb)
  last_contacted

submissions
  id (uuid PK), candidate_id, requirement_id, recruiter_email
  tl_approved (bool), tl_approved_at, sent_to_client_at
  final_status, client_email, notes, created_at

gebiz_submissions (SG only)
  id (uuid PK), candidate_id, requirement_id
  tender_number, school_name, status, created_at

portal_credentials
  id, portal (foundit/outlook), username, password_encrypted, active (bool)

client_contacts
  id, client_name, contact_name, email, market
```

**RLS:** Supabase Row Level Security enabled but service role key bypasses it. All access through backend — no direct client-to-DB connections.

---

## Token Logging and Cost Tracking

Every `_call_claude()` call appends to `/logs/tokens_YYYYMMDD.log`:

```
2026-04-08T20:50:04|/requirements/create|claude-haiku-4-5-20251001|659|55
```

Format: `timestamp|endpoint|model|input_tokens|output_tokens`

Costs at `/token-report`:
```python
COST_PER_1K = {
    "claude-haiku-4-5-20251001": {"input": 0.001, "output": 0.005},
    "claude-sonnet-4-20250514":  {"input": 0.003, "output": 0.015},
}
```

---

## Data Flow

```
JD Text ──▶ Haiku extracts skills ──▶ requirements table
                                           │
                          ┌────────────────┘
                          ▼
              ┌─── asyncio.gather ───────────────────┐
              │                │           │          │
         Firecrawl         Scrape.do    Apollo.io    MCF
         (Foundit)         (Foundit)     (both)      (SG)
              │                │           │          │
              └────────────────┴─────┬─────┘          │
                                     ▼                 ▼
                         candidates table (upsert by email)
                                     │
                                     ▼
                         Sonnet scores each candidate
                                     │
                                     ▼
                             screenings table
                                     │
                                score >= 7?
                                ┌────┴────┐
                               YES        NO
                                │       (reject)
                                ▼
                         Haiku drafts email
                                │
                                ▼
                    Recruiter reviews ◀── HUMAN IN LOOP
                                │
                                ▼
                      Graph API sends email
                                │
                                ▼
                          outreach_log table
                                │
                       ┌────────┴────────┐
                       │   every 15 min  │
                       │   cron scan     │
                       └────────┬────────┘
                                ▼
                     Haiku classifies reply
                                │
                                ▼
                     candidate_details table
                                │
                                ▼
                    Recruiter submits to TL ◀── HUMAN IN LOOP
                                │
                                ▼
                          submissions table
                                │
                                ▼
                TL approves and sends to client ◀── HUMAN IN LOOP
                                │
                                ▼
                    Graph API sends to client email
```

---

## Extension Reference

| Want to add | Where to do it |
|---|---|
| New sourcing channel (Naukri, Indeed, JobStreet) | `config/sourcing.py` — add `async def source_naukri(...)`, add to `run_all_sources()` task list |
| New AI capability (e.g. salary negotiation coach) | New agent `.md` + new endpoint in `main.py` |
| New database table | Supabase SQL editor + new helpers in `config/db.py` |
| New UI tab | Edit `DASHBOARD_HTML` in `app.py` (~line 865) |
| New scheduled job | Add to `lifespan()` in `main.py` where scheduler is configured |
| New email template | Edit `agents/outreach.md` |
| Different screening criteria | Edit `agents/screener.md` |
| WhatsApp integration | New `config/whatsapp.py` + new endpoint |
| Interview scheduling | New `interviews` table + endpoint + Calendar API |
| Client portal | New Flask blueprint with separate auth |
| Analytics dashboard | Query `screenings`, `outreach_log`, `submissions` + new UI tab |
| Rate limiting | Add middleware to FastAPI app in `main.py` |

---

## Known Weaknesses and Improvement Areas

### Auth
Hardcoded credentials in `app.py` is a security liability. Should be migrated to Supabase Auth or a secrets manager before any external deployment. Especially important if the product is sold to other agencies — no customer should share a codebase that has another customer's credentials in it.

### Legacy Code Path
`POST /run` in Flask calls Claude directly, bypassing the agent layer entirely. This means those calls aren't token-logged and don't go through `_call_claude()`. Either migrate it to the agent layer or add logging inline.

### Scrape.do vs Firecrawl
Currently A/B testing both. Scrape.do can't retrieve email/phone (no login capability). Unless Scrape.do provides better search result quality than Firecrawl step 1, it may not be worth maintaining two scrapers. Measure and cut the underperformer.

### Foundit Credit Budget
Max 20 profile clicks per sourcing run is conservative. With 3 rotating accounts and 11,000 Firecrawl credits/month, the actual ceiling is much higher. The 20-click limit should be a tunable env var, not hardcoded.

### `app.py` Size
~3400 lines is too large for a single file. `DASHBOARD_HTML` as a string inside Python is particularly hard to maintain. Long-term this should be split into Jinja2 templates + a proper frontend build.

### Inbox Scan Coverage
`RECRUITER_EMAILS` env var or fallback to `portal_credentials` is fragile. If a new recruiter is added and the env var isn't updated, their inbox never gets scanned. Should pull recruiter emails from the `RECRUITER_LOGINS` dict as the single source of truth.

### No Retry Logic
If a Firecrawl call fails mid-sourcing-run, the run silently skips. For production reliability, `run_all_sources()` should have per-source retry with exponential backoff and a dead-letter log.

---

## Environment Variables

```bash
# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Email (Microsoft Graph)
AZURE_TENANT_ID=xxx
AZURE_CLIENT_ID=xxx
AZURE_CLIENT_SECRET=xxx

# Scraping
FIRECRAWL_API_KEY=fc-xxx
SCRAPE_DO_API_KEY=xxx
SCRAPER_BACKEND=both          # firecrawl | scrape_do | both

# Optional
APOLLO_API_KEY=xxx
RECRUITER_EMAILS=a@co.com,b@co.com
AI_AGENT_URL=http://ai-agents.railway.internal
```

---

*For the plain English version of this document, see the Pipeline Plain English explainer.*
