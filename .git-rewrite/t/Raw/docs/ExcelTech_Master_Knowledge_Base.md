# ExcelTech Master Knowledge Base
*Last updated: April 2026 — Complete context for the AI recruitment automation system*

---

## 1. Who ExcelTech Is

ExcelTech Computers is an IT recruitment agency operating as a middleman between companies that need tech talent (clients) and professionals looking for jobs (candidates). The founder/operator is **Nik**.

**How they make money:**
- Permanent roles: 8–15% of candidate's annual salary paid by client on placement
- Contract roles: margin taken on contractor's daily/monthly rate

**Headquarters:** Singapore-based agency with recruiters operating from India

---

## 2. The Team

### Team Lead (TL)
- **Name:** Raja
- **Role:** Receives requirements from clients, shares all open requirements to the recruitment team via email, reviews candidate shortlists from recruiters, approves submissions, sends formatted profiles to clients. Only person who interacts with clients directly. Also does sourcing himself.
- **Access:** Full web app access including TL-only screens (Submission Queue, Create Requirement, Approve + Send to Client)

### Recruiters (10 people)
**Names:** Raja (TL), Rakesh, Bhuwan, Irfan B, Gobind, Manoj, Isha, Ashish, Tilak, Toshi, Raghav, Atul

**Their daily job:**
- Receive requirements assigned by TL via email
- Source candidates (manual portal search + inbound from LinkedIn posts/direct emails)
- Screen resumes against JD
- WhatsApp candidates first to check interest
- Send email outreach with candidate details table
- Chase candidate replies for missing information
- Send shortlisted candidates to TL via email
- TL forwards to client

**Each recruiter has their own individual Outlook account.** Outreach emails go from their personal inbox. 10 individual Microsoft Graph API connections required.

**Multiple recruiters can work the same requirement simultaneously.** Assignment is informal — TL emails requirements to the group, recruiters pick up what they can handle.

---

## 3. Two Separate Markets

### India Market
- **Clients:** HCL India, NCR IN, Tech Mahindra, Paytm, Flipkart, Keva, 360F, Motherson, various others
- **Roles:** ServiceNow Developer, Snow Developer/Admin, Cyber Security, GCP Data Engineer, Cloud Platform Engineer, Angular Developer, DevOps Engineer, PeopleSoft HCM, BMC Remedy, HRSD, CMDB, ITOM, Solution Architect, Automation Engineer, Field Sales, Customer Support Associate, and more
- **Salary format:** LPA (Lakhs Per Annum) or monthly in INR (e.g., 25k/month, 13 LPA)
- **Sourcing portals:** Foundit (3 shared company accounts), LinkedIn (manual)
- **Candidate nationality:** No restriction typically
- **Volume:** High — HCL alone has 14,000+ submissions in the tracker

### Singapore Market
- **Clients:** GeBIZ (MOE school tenders), LGT Bank, OWIS, BCS, and others
- **Roles:** ICT Trainer, AV Technician, Audio Visual Multimedia Executive, Administrative Assistant, Receptionist cum Admin, IT Engineer, Field Desk Admin
- **Salary format:** SGD monthly (e.g., SGD 3,000/month)
- **Sourcing portals:** MyCareersFuture (free government API), Foundit, LinkedIn (manual)
- **Candidate nationality:** Must be Singaporean or PR for most GeBIZ/government roles
- **Special workflow:** GeBIZ tender system — one candidate can be submitted to **multiple school tenders simultaneously** using MOESCHETQ tender numbers
- **Tender number format:** MOESCHETQ25002372 (example)
- **Volume:** Lower but growing — Raghav is the primary SG-focused recruiter

---

## 4. Current Daily Flow (Before Automation)

**Morning:**
1. TL emails open requirements to recruitment team
2. Recruiters open Foundit/LinkedIn/MyCareersFuture manually
3. Build boolean search queries by hand (30–60 mins per requirement)
4. Scroll through 50–200 results, download promising resumes one by one (1–2 hours)
5. Inbound resumes arrive via LinkedIn DMs or direct emails → recruiter WhatsApps immediately

**Mid-morning:**
6. Upload downloaded resumes to web app → AI parses into CRM → AI scores vs JD
7. Recruiter reviews scores, decides who to contact
8. For portal candidates already WhatsApp'd and confirmed interested: sends outreach email from web app with details table
9. For inbound candidates who replied positively on WhatsApp: same outreach email

**Afternoon:**
10. Candidates reply with filled details table
11. Recruiter reads each reply manually, copies info into CRM or Excel
12. Chases missing fields with another email (manual)
13. Recruiter compiles shortlist, reformats profiles into client's required format
14. Emails formatted profiles to TL

**TL:**
15. Reviews profiles from recruiters
16. Forwards to client from his own Outlook email
17. Manages client relationship and feedback

**Time cost per recruiter per day:**
- Sourcing: 2–3 hours
- Reading/uploading/screening: 1–2 hours
- Outreach drafting: 30–60 mins
- Inbox monitoring + chasing: 1–2 hours scattered
- Submission formatting: 30–60 mins
- **Total manual mechanical work: ~6–8 hours out of 8**

---

## 5. What Was Already Built (Existing Web App)

A custom Python/HTML web app hosted on **Railway** with 4 working features:

1. **Resume Upload / Profile Processing** — Recruiters drop resumes, AI parses into CRM. No manual data entry.
2. **AI Screening Tab** — Upload resume + JD, AI scores candidate 1–10 with explanation of match/mismatch.
3. **Outreach Tab** — Send personalised emails to screened candidates from recruiter's own Outlook inbox. Template includes JD, asks for candidate details.
4. **Email Intelligence / Inbox View** — Connect Outlook inbox to app. AI reads emails, classifies into categories (new requirements, candidate replies, actions needed), suggests replies.

**What the web app does NOT do yet:**
- Auto-source candidates from portals
- Auto-scan inboxes on a schedule
- Parse candidate replies and extract filled table fields
- Auto-generate submission documents per client format
- Track pipeline across all requirements and all recruiters
- Separate TL view from recruiter view
- Handle GeBIZ tender workflow

**Tech stack:**
- Backend: Python
- Frontend: HTML
- Hosting: Railway
- Email: Microsoft Graph API (Outlook)
- AI: Claude API (Sonnet for screening/drafting, Haiku for classification)

---

## 6. The Automation System Being Built

### Architecture: 9 Claude Code Prompts

The new system adds an `/ai-agents/` layer alongside the existing Railway app. It does NOT rewrite the existing app — it extends it.

**New infrastructure:**
- **Database:** Supabase (PostgreSQL) — replaces all Excel tracking. Shared by all 10 recruiters, TL, and the Railway web app simultaneously
- **Agent layer:** FastAPI app running alongside existing app on Railway
- **Scheduler:** APScheduler running inbox scans every 15 minutes automatically
- **Sourcing:** Firecrawl (Foundit scraping), MyCareersFuture public API, Apollo.io Professional API
- **Documents:** python-docx + Jinja2 for client submission formatting

---

## 7. The Five Agents

### Screener Agent
- **What it does:** Scores a candidate against a job requirement 1–10
- **Output:** score, skills_match_pct, experience_match (yes/partial/no), salary_fit (yes/no/unknown), recommendation (shortlist/maybe/reject), one-line reasoning
- **Model:** Claude Sonnet 4
- **Autonomy:** Fully automatic — runs every time a resume is uploaded or candidate is sourced
- **India nuance:** Match IT skills like ServiceNow, Snow Developer, Cyber Security, GCP, Angular, DevOps, PeopleSoft, BMC Remedy
- **SG nuance:** Also checks nationality (Singaporean/PR required for most GeBIZ roles), preferred location vs school location

### Outreach Agent
- **What it does:** Drafts personalised outreach email with pre-filled candidate details table
- **Output:** {subject, body} — draft only, NEVER sends automatically
- **Model:** Claude Haiku 4.5
- **Email structure:** Personalised opening (one specific skill from resume) → role pitch (no client name, salary range, contract type) → candidate details table (pre-filled from resume, candidate fills gaps) → call to action → recruiter signature
- **Details table fields:** Full Name, Nationality, Work Pass Type, Highest Education, Certifications, Current Employer, Current Role, Total Experience, Relevant Experience, Notice Period, Current CTC/Salary, Expected CTC/Salary, Availability Date, Preferred Location, Work Experience rows (Company, Role, Duration, Key Responsibilities)
- **Rules:** Max 200 words excluding table. Never "I hope this email finds you well." SGD for SG, LPA for India.

### Follow-up Agent
- **What it does:** Parses candidate reply email, extracts filled table fields, updates Supabase, generates chase message for missing fields
- **Output:** {fields_filled, fields_missing, chase_draft, status}
- **Model:** Haiku 4.5 for extraction, Sonnet 4 if reply is ambiguous
- **Rules:** Extract only what candidate explicitly wrote. Chase draft shown to recruiter for approval — never auto-sends. GeBIZ: also note which school locations candidate willing to work in.

### Formatter Agent
- **What it does:** Builds client-ready .docx submission document from completed candidate profile
- **Output:** Formatted file at /submissions/[client]/[name]_[date].docx
- **Model:** Claude Sonnet 4
- **Rules:** Only triggered when candidate_details status = ready_for_review. Highlights missing required fields in red rather than guessing. SG: nationality + work pass type prominent. GeBIZ: tender number + school name in header.

### Sourcing Agent
- **What it does:** Queries three channels simultaneously to find matching candidates
- **Channels:**
  - MyCareersFuture API (SG only, free, no auth needed)
  - Foundit via Firecrawl (two-step: search results page → individual profile pages, click "View Contact" only for candidates passing skills filter, rotates between 3 shared company accounts stored in Supabase portal_credentials)
  - Apollo.io Professional API (passive candidates, both markets)
- **Also generates:** LinkedIn boolean search string for recruiter to run manually (never scrapes LinkedIn)
- **Output:** sourced count per channel, total unique candidates added to Supabase, linkedin_search_string
- **Rules:** Rotate Foundit accounts to avoid rate limits. Flag non-Singaporean candidates for SG market. Log every run. Cap Foundit credit usage at 20 profile clicks per sourcing run.

---

## 8. The Five Skills (Workflow Chains)

### source-and-screen
- **Trigger:** TL creates requirement OR recruiter clicks Source Now
- **Does:** Runs all sourcing channels in parallel → screens every candidate found → returns ranked shortlist to web app
- **Result:** Within 20–30 mins of creating a requirement, recruiter sees a ranked shortlist — without touching any portal

### prepare-outreach
- **Trigger:** Recruiter clicks Prepare Outreach on a candidate card
- **Does:** Loads candidate + requirement → runs outreach agent → returns draft with pre-filled table → when recruiter clicks Send, fires from their individual Outlook

### process-inbox
- **Trigger:** APScheduler cron every 15 minutes, all 10 recruiter inboxes simultaneously
- **Does:** Classifies every unread email (candidate reply / new requirement / other) → for candidate replies: runs followup agent, updates Supabase, flags complete/incomplete in web app → for new requirements: flags for TL review

### submit-to-tl
- **Trigger:** Recruiter clicks Submit to TL
- **Does:** Runs formatter agent → generates .docx → moves candidate to TL's Submission Queue in Supabase

### tl-send-to-client
- **Trigger:** TL clicks Approve + Send to Client
- **Does:** Attaches formatted doc → sends email from TL's own Outlook to client → updates submission status → for GeBIZ: updates tender submission record

---

## 9. Web App Changes

### Existing screens — modified, not replaced:

**Resume Upload / CRM:**
- Added: Market selector (India/Singapore) tags each candidate
- Added: "Select Requirement" dropdown appears after upload
- Added: Auto-runs screening when requirement selected
- Added: AI score badge (green/yellow/red) with reasoning
- Added: Nationality flag for SG market (non-Singaporean/PR flagged)

**Screening Tab:**
- Now: Shows sourced + uploaded candidates together, ranked by AI score
- Added: Source tag per candidate (Foundit/MyCareersFuture/Apollo/Manual/Inbound)
- Added: "Source More" button
- Added: LinkedIn search string button (copy-paste modal)
- Removed: Manual score entry

**Outreach Tab:**
- Now: Pre-drafted email with details table shown in editable textarea
- Added: Candidate status badge (Outreached/Replied/Details complete/Ready for TL)
- Added: WhatsApp note field (logged to candidate record, not automated)

**Inbox View:**
- Now: Shows parsed candidate replies with fields extracted and highlighted
- Green card = all details complete
- Yellow card = fields missing + chase draft shown inline with Approve & Send button
- New section: "New Requirements Flagged" for TL review

### New screens added as tabs:

**Requirements Board (all users, new default landing tab):**
- Tab: India | Tab: Singapore
- Cards per open requirement: client, role, assigned recruiters, pipeline progress bar
- TL only: Create Requirement button (paste JD → auto-parses → triggers sourcing)
- Recruiter: Source Now button per requirement card
- Click card → drill into candidate list for that requirement (existing Recruiter Hub, now requirement-scoped)

**Submission Queue (TL only):**
- All candidates submitted by recruiters, grouped by requirement
- Candidate card: name, role, score, recruiter who submitted, Download Profile button
- Approve + Send to Client button → email composer pre-filled with client email
- Send Back to Recruiter button → feedback note field
- Status filter: Pending review / Approved / Sent to client / Rejected

**Notification Bell (top navbar, all users):**
- Polling every 60 seconds
- Shows: "Raj Kumar replied — details complete", "Sourcing complete — 23 found, 8 shortlisted", "TL rejected John Tan — [feedback]", "New requirement email flagged"

### Role system:
- Raja = TL role (sees Submission Queue, Create Requirement, Approve buttons)
- All others = recruiter role
- Implemented via role field in RECRUITER_LOGINS dict
- Passed via X-User-Role and X-User-Email headers

---

## 10. Database Schema (Supabase PostgreSQL)

### Tables:

**requirements** — Every job requirement received from clients
- Fields: market (IN/SG), client_name, client_manager, role_title, skillset, skills_required[], experience_min, salary_budget, location, contract_type (FTE/TP/C2H/Contract), notice_period, br_sf_id, tender_number, jd_file_path, status (open/closed/on_hold), assigned_recruiters[], bd_owner

**candidates** — Every candidate ever sourced or uploaded
- Fields: name, email, phone, nationality, work_pass_type, current_location, preferred_location, skills[], total_experience, relevant_experience, highest_education, certifications[], current_employer, current_role, current_ctc, expected_ctc, notice_period, availability_date, source, cv_id, linkedin_url, resume_file_path, market (IN/SG)

**screenings** — AI screening results per candidate per requirement
- Fields: candidate_id, requirement_id, recruiter_email, score (1-10), skills_match_pct, experience_match, salary_fit, recommendation, reasoning

**candidate_details** — Filled details table from candidate replies
- Fields: candidate_id, requirement_id, all personal/professional fields, status (awaiting_candidate/details_received/ready_for_review/approved_by_tl/submitted_to_client/rejected_by_tl), tl_feedback

**outreach_log** — Every outreach email sent
- Fields: candidate_id, requirement_id, recruiter_email, outlook_message_id, outlook_thread_id, channel, email_subject, sent_at, reply_received, replied_at

**submissions** — Every profile submitted to TL/client
- Fields: candidate_id, requirement_id, client_name, tender_number, market, formatted_doc_path, submitted_by_recruiter, tl_approved, sent_to_client_at, final_status, placement_type (FTE/TP/C2H), doj, package, sap_id, remarks

**interview_tracker** — Candidates who reached interview stage
- Fields: recruiter, interview_date, interview_time, status, end_client, placement_type, doj, package, sap_id, remarks

**gebiz_submissions** — Singapore tender-specific records
- Fields: candidate_id, tender_number, school_name, submission_date, rechecking_date, status, remarks

**client_contacts** — TL's BD CRM (1,007 contacts with outreach history)
- Fields: name, company, region (IN/SG/MY), contact_number, email, last_outreach_date, outreach_history (JSON), notes

**portal_credentials** — Foundit login accounts (not visible to recruiters)
- Fields: portal, username, password_encrypted, assigned_recruiter, active
- 3 Foundit accounts: xExcelTech_Cominx01/02/03 (Rakesh/Devesh/Bhuwan)

### Status vocabulary (exact values used):
- Submission: Submitted, Shortlisted, KIV, Not Shortlisted
- Interview: Selected-Joined, Selected, Backed out, Rejected, Selected-Backed out
- Placement type: FTE, TP, C2H
- Candidate details: awaiting_candidate, details_received, ready_for_review, approved_by_tl, submitted_to_client, rejected_by_tl

---

## 11. Sourcing Channels

### Foundit
- 3 shared company accounts stored in Supabase portal_credentials
- Two-step Firecrawl flow: search results page → individual profile pages
- Search results: name, title, experience, location visible (no contact details)
- Must click "View Contact" on each profile to get phone/email (costs 1 Foundit credit)
- Only click View Contact for candidates passing basic skills keyword match
- Cap: 20 profile clicks per sourcing run per requirement
- Rotate between 3 accounts to avoid rate limits
- Used for both India and Singapore markets

### MyCareersFuture
- Singapore government portal — free public API, no authentication needed
- API endpoint: https://api.mycareersfuture.gov.sg/v2/jobs
- Used for SG market only
- Returns: title, company, salary, description, job_url

### Apollo.io
- **Plan:** Professional at $79/month (annual billing) — 4,000 credits/month
- 1 credit per email reveal, 8 credits per phone number
- 4,000 emails/month available
- Used for passive candidates not actively on job portals
- API queries: skills + location filter (Singapore or India)
- Both markets
- Confirmed: API access available on Professional tier

### LinkedIn
- **Never scraped** — violates ToS, account ban risk
- AI generates optimal boolean search string for recruiter to paste manually
- Format: ("skill1" OR "skill2") AND "Singapore" AND ("5+ years" OR "senior")
- Recruiter copies string, runs search manually, downloads results, uploads to web app

---

## 12. Microsoft Graph API Setup

- Every team member (all recruiters + TL) has individual Outlook account
- App-level OAuth2 client credentials flow (not per-user auth)
- Scope: Mail.ReadWrite, Mail.Send
- Token cached in memory per email address with 1-hour TTL
- Env vars: AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID
- Inbox scanning: reads last 24 hours of unread emails per recruiter
- Sending: always from the specific recruiter's email address, never a shared inbox

---

## 13. What the Excel Tracker Told Us

The original Excel file had 15 sheets tracking everything. Key insights:

- **14,000+ submissions** in Master sheet going back to Feb 2024
- **2,300+ candidates** who reached interview stage
- **62 confirmed placements** (onboarded candidates)
- **633 requirements** received from clients
- **1,007 client contacts** in TL's BD CRM with outreach history
- **Recruiter assignment was informal** — Requirements sheet had Recruiter column mostly blank
- **Final status tracking was inconsistent** — mostly blank in Master sheet, better in Interview Tracker
- **Backed out is very common** — candidates accepting other offers, not responding, or backing out after selection
- **GeBIZ has 384 rows** — one candidate matched to multiple tenders creates 668 DB records
- **Login credentials were stored in plaintext** in the Excel — migrated manually to Supabase with encryption

**Migration completed:** All sheets migrated to Supabase via migration script. Dry run showed zero errors across all sheets.

---

## 14. Pricing Summary

| Service | Plan | Monthly Cost | Key Limits |
|---|---|---|---|
| Claude Sonnet 4 API | Pay per token | ~$80–150 | $3/M input, $15/M output |
| Claude Haiku 4.5 API | Pay per token | ~$10–20 | $1/M input, $5/M output |
| Supabase | Pro | $25 | 8GB DB, 100GB storage, shared by all users |
| Firecrawl | Standard | $83 | 100k credits/month, ~11k pages with JSON+Enhanced |
| Apollo.io | Professional | $79 | 4,000 credits/month, 1 seat |
| Microsoft Graph | Included in M365 | $0 | Already paying |
| Railway | Existing | $5–20 | Already running |
| Twilio WhatsApp | Optional later | $25–40 | ~500 msgs/month |
| **Total** | | **~SGD 400–550/mo** | |

**ROI:** One mid-level IT placement = SGD 1,000 commission. System costs ~SGD 500/month. Break-even is half a placement. With 10 recruiters each handling 3–4x more requirements, realistic upside is 4–8 additional placements per month.

---

## 15. What Stays Manual (Intentionally)

- **WhatsApp conversations** — relationship-based, stays human
- **Phone calls** to candidates — stays human
- **LinkedIn sourcing** — AI generates search strings, human runs them
- **Client relationship management** — TL's domain, no automation
- **Foundit portal credentials** maintenance — updated manually in Supabase if accounts change

---

## 16. The New Recruiter Daily Flow (After Automation)

**Morning (20–30 mins instead of 3–4 hours):**
1. Log into web app → Requirements Board shows open requirements
2. Each requirement already has a ranked shortlist waiting (sourcing ran automatically when TL created it)
3. Recruiter reviews ranked list — reads AI score and reasoning per candidate
4. Also sees inbound resumes uploaded manually, scored and ranked alongside sourced candidates
5. Selects candidates worth contacting

**Outreach (5–10 mins per candidate instead of 30–60 mins total):**
6. Clicks Prepare Outreach — draft email with pre-filled details table appears
7. Reviews, edits if needed, clicks Send
8. For inbound candidates already WhatsApp'd: clicks Send after confirming interest on WhatsApp

**Through the day (notification-driven instead of inbox monitoring):**
9. Notification bell shows candidate replies
10. Clicks notification → sees extracted fields, which are complete, which are missing
11. Chase email draft already prepared — clicks Approve & Send if happy
12. When candidate details are complete → clicks Submit to TL

**Total manual work: ~1.5–2 hours/day**

---

## 17. The New TL Daily Flow (After Automation)

**Morning:**
1. Emails open requirements to team (same as before)
2. Creates requirements in web app by pasting JD → sourcing starts automatically

**Through the day:**
3. Checks Submission Queue tab
4. Reviews candidate cards submitted by recruiters
5. Downloads formatted profile, reviews it
6. Clicks Approve + Send to Client → email goes from TL's own Outlook to client
7. Or clicks Send Back to Recruiter with feedback note

**No more:** Manual formatting, copy-pasting between Excel sheets, emailing back and forth with recruiters to chase submissions

---

## 18. Key Technical Decisions and Why

| Decision | Reason |
|---|---|
| Supabase not SQLite | Multiple recruiters + TL + Railway web app need simultaneous shared access |
| Haiku for classification, Sonnet for reasoning | Token cost efficiency — Haiku is 5x cheaper, classification doesn't need Sonnet |
| Agent files loaded at startup, not per request | Prevents re-reading files on every API call — major token saving |
| Foundit via Firecrawl two-step | Foundit hides contact details behind a click — one API call can't get everything |
| Rotate Foundit accounts | 3 accounts available, rotating avoids rate limits and account flags |
| LinkedIn search strings only | ToS violation risk too high, account ban would break sourcing entirely |
| WhatsApp stays manual | Personal/relationship channel, automation would feel robotic and harm trust |
| TL sends to client from own Outlook | Client relationship is personal — email must come from Raja, not a system |
| APScheduler not webhooks for inbox | More reliable than Outlook webhooks which can drop; 15-min polling is sufficient |
| One Apollo seat | Sourcing agent uses one API key, not per-recruiter — no need for multiple seats |

---

## 19. Potential Future Additions (Not Built Yet)

- **WhatsApp Business API via Twilio** — for initial outreach to inbound candidates (currently manual)
- **Interview Coordinator Agent** — auto-schedule interviews based on client/candidate availability via Calendar API
- **Candidate re-engagement** — when new requirement matches a previously placed/rejected candidate from DB
- **Feedback loop / learning** — track which scoring thresholds actually lead to placements, adjust screener over time
- **NCR Portal sourcing** — credentials exist (KUMDEV33294), can be added to portal_credentials
- **Productisation** — packaging this entire system for other recruitment agencies to license
- **Naukri, JobStreet sourcing** — additional portals for India market
- **Client portal** — let clients submit requirements directly via a simple form

---

## 20. Files and Their Locations

```
/ai-agents/
├── claude.md                 ← Master context file for all agents
├── main.py                   ← FastAPI app, all endpoints, APScheduler
├── DEPLOY.md                 ← Deployment checklist
├── agents/
│   ├── screener.md
│   ├── outreach.md
│   ├── followup.md
│   ├── formatter.md
│   └── sourcing.md
├── skills/
│   ├── source-and-screen.md
│   ├── prepare-outreach.md
│   ├── process-inbox.md
│   ├── submit-to-tl.md
│   └── tl-send-to-client.md
├── config/
│   ├── db.py                 ← All Supabase operations
│   ├── outlook.py            ← Microsoft Graph API
│   ├── sourcing.py           ← Firecrawl, MyCareersFuture, Apollo
│   ├── cron.py               ← APScheduler inbox scan
│   └── context_rules.md      ← Token and model routing rules
├── data/
│   ├── schema.sql            ← Full Supabase schema
│   └── migrate.py            ← One-time Excel migration script
├── templates/                ← Client-specific .docx templates
├── submissions/              ← Generated submission documents
└── logs/                     ← Daily logs per agent/skill
```

---

*This document contains the complete context for the ExcelTech AI recruitment automation system. Use it to onboard new Claude Code sessions, brief new developers, or restart work after any gap.*
