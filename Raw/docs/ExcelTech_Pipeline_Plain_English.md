# ExcelTech AI Recruitment Pipeline — How It Works
*Plain English. No technical background needed.*

---

## The Two-Sentence Version

We built an AI system that does the mechanical parts of recruitment automatically — finding candidates, scoring them, drafting emails, and monitoring replies. Recruiters now spend their time making decisions and building relationships, not copying and pasting.

---

## The Setup

There are two applications running behind the scenes:

**The Website** — what recruiters log into. They see candidates, requirements, scores, and inbox replies here. Buttons to send emails, submit candidates, and approve profiles.

**The AI Brain** — invisible to users. It does all the thinking: scraping job portals, scoring candidates, writing emails, reading replies. The website talks to it in the background.

Both connect to a shared database where everything is stored — candidates, job requirements, emails sent, replies received, and submission history.

---

## The Pipeline, Step by Step

### Step 1 — Team Lead Creates a Requirement

Raju (Team Lead) logs in and creates a new job requirement. He pastes in the job description — for example: *"ServiceNow Developer, Tech Mahindra, Bangalore, 5+ years, 8–12 LPA."*

The AI reads the JD, extracts the key skills automatically, saves the requirement, and immediately kicks off candidate sourcing in the background.

---

### Step 2 — AI Searches for Candidates

Without anyone clicking anything, the AI goes looking for candidates across multiple platforms simultaneously:

- **Foundit** — logs into ExcelTech's recruiter account, searches for matching profiles, opens promising ones to get contact details
- **Apollo.io** — professional database, searched by skills and location
- **MyCareersFuture** — Singapore government portal (used for SG roles)

All candidates found are saved to the database, deduplicated so no one appears twice.

---

### Step 3 — AI Scores Every Candidate

For every candidate found, the AI compares them against the requirement and gives them a score from 1 to 10 with a one-line explanation:

> *"Score: 8/10 — Strong ServiceNow and ITSM experience, 6 years, Bangalore-based. Salary expectation within budget."*

Candidates scoring 7 or above are flagged as shortlisted. Recruiters see the ranked list when they log in — no manual reading of 80 resumes.

---

### Step 4 — Recruiter Reviews and Sends Outreach

The recruiter reviews the shortlisted candidates, picks who to contact, and clicks "Prepare Outreach."

The AI drafts a personalised email — referencing a specific skill from the candidate's resume, pitching the role, and including a table for the candidate to fill in their details (notice period, current salary, expected salary, etc.).

**The AI never sends emails on its own.** The recruiter reads the draft, edits if needed, and clicks Send. It goes from their own Outlook address — the candidate sees a real email from a real person.

---

### Step 5 — AI Monitors Replies

Every 15 minutes, the system automatically checks every recruiter's inbox.

When a candidate replies, the AI reads it, classifies it (interested / not interested / needs follow-up), extracts whatever details the candidate filled in, and flags it for the recruiter. The recruiter opens the app and sees a clean summary — no inbox-diving required.

If details are missing, a chase email draft is already prepared. Recruiter clicks approve, it sends.

---

### Step 6 — Recruiter Submits to Team Lead

Once a candidate's details are complete and the recruiter is happy, they click "Submit to TL." The candidate moves into Raju's review queue.

---

### Step 7 — Team Lead Sends to Client

Raju sees the candidate in his queue with everything he needs: AI score, skills match percentage, all filled-in details, and which recruiter sourced them.

He reviews, approves, and clicks "Send to Client." A professionally formatted profile email goes from his Outlook to the client's HR team.

---

## What the Pipeline Looks Like at Any Point

For any open requirement, the system shows a live funnel:

```
ServiceNow Developer @ Tech Mahindra
├── Sourced:          83 candidates found
├── Screened:         83 scored by AI
├── Shortlisted:      12 scored 7 or above
├── Outreached:       10 emails sent
├── Replied:           3 candidates responded
├── Details Complete:  2 ready for review
├── Submitted to TL:   1 sent to Raju
└── Sent to Client:    0 (waiting for Raju to approve)
```

Every recruiter and the TL can see this in real time.

---

## What's Automatic vs What Stays Human

| Step | Who does it |
|---|---|
| Searching portals for candidates | AI — automatic |
| Scoring candidates against the JD | AI — automatic |
| Drafting outreach emails | AI — automatic draft |
| **Reviewing and sending outreach** | **Recruiter — always manual** |
| Monitoring inbox for replies | AI — automatic, every 15 minutes |
| Chasing missing candidate details | AI draft — recruiter approves |
| **Submitting candidate to TL** | **Recruiter — always manual** |
| **Approving and sending to client** | **TL — always manual** |

The AI handles the mechanical work. Every decision that affects a candidate relationship or a client relationship stays with a human.

---

## The Before and After

**Before:** A recruiter spent 6–8 hours per day on sourcing, screening, drafting emails, monitoring inboxes, and formatting submissions. Realistic capacity: 2–3 open requirements at a time.

**After:** The same recruiter spends 1.5–2 hours per day reviewing what the AI has prepared and making calls. Realistic capacity: 3–4x more requirements, same headcount.

---

## What It Costs to Run

A full sourcing and screening run for one job requirement — finding and scoring around 80 candidates — costs roughly **SGD 1–2 in AI and API fees**.

One placement generates **SGD 1,000+ in commission**.

The entire system runs for approximately **SGD 400–550 per month** across all tools and services combined.

---

*This document is for anyone who wants to understand what the system does and why. For the technical architecture, see the Developer Reference.*
