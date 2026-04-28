---
type: atlas-note
area: ExcelTech
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# ExcelTech — New Flow (With Automation)

This is what a recruiter's day looks like **after** the agents and skills layer is live. The goal is simple: remove everything mechanical so the recruiter spends their day on the 20% that actually needs a human.

Before automation: [[Atlas/ExcelTech/Current-Flow]].

## The end-to-end path

### 1. Requirement intake — structured capture
- Raja logs into the web app and clicks **Create Requirement**.
- Pastes the JD. The Screener agent extracts structured fields: must-have skills, nice-to-have, years of experience, location, salary range, client, deadline.
- Raja confirms or edits the extracted fields. One click to publish to the team.
- The requirement is now queryable, filterable, and assigned a unique ID.

No more group emails. Structured from minute zero.

### 2. Automatic sourcing pass
- The **Sourcing agent** runs against Foundit, MyCareersFuture (for SG), and the existing candidate database.
- Uses the structured requirement fields to build targeted queries.
- Pulls candidate CVs, stores them in Supabase, and produces a ranked shortlist.
- Foundit account rotation is handled automatically (see [[Atlas/Product/Sourcing-Channels]]).

**Recruiter time on this step: zero.** They come in and the shortlist is already there.

### 3. Automatic screening
- The **Screener agent** scores each sourced candidate against the JD.
- Output is a ranked list with: match score, strengths, gaps, risk flags, salary/location fit.
- Rejects at the nationality filter (for SG GeBIZ) happen here automatically.
- Recruiter reviews the top 20 instead of 200.

**Time saved: ~2 hours per requirement.**

### 4. Recruiter does the human layer
- Recruiter opens the ranked list in the web app.
- Clicks through the top candidates. Reads the AI's reasoning.
- Marks interesting ones for outreach.
- Flags mis-scores for the lint job (see [[AIOS/skills/lint-wiki]] for the pattern; product equivalent is a feedback loop to improve agent prompts).

This is the first point in the day where the recruiter is actually making judgement calls.

### 5. WhatsApp first contact (still human)
- Recruiter WhatsApps the candidate. Still a human touch. Deliberately not automated.
- Confirms interest, availability, basic salary expectation.
- Marks the candidate as "ready for outreach" in the app.

### 6. Outreach email — generated, approved, sent
- The **Outreach agent** drafts a personalised email for each approved candidate from **the recruiter's own Outlook account** (10 individual Microsoft Graph API connections — see [[Atlas/ExcelTech/Team]]).
- Email uses the structured requirement + candidate fields to produce a natural, non-template-y message.
- Recruiter reviews the drafts in a queue. Approves or edits. Hits send.
- Email sends from the recruiter's real inbox. Candidate sees the recruiter's name, not "noreply@excelt.ai".

**Hard rule: no auto-send without approval.** See [[mi]] NOT-to-do list.

### 7. Inbox scanning and reply parsing
- APScheduler runs every 15 minutes, scanning each recruiter's inbox.
- The **Follow-up agent** reads candidate replies, extracts the structured fields (CTC, notice, location, etc.), and updates the candidate record.
- If fields are missing, the agent drafts a follow-up chase email. Recruiter approves.
- If all fields are present, the candidate is auto-promoted to the submission queue.

**The chase loop is now automated.** This is the single biggest time saving in the day.

### 8. Profile compilation — automatic
- The **Formatter agent** generates the ExcelTech-format profile document for each complete candidate.
- Uses the approved template. No copy-paste. No errors.
- Output lands in the TL's **Submission Queue** screen.

### 9. TL review and client submission
- Raja opens the Submission Queue. Sees ready-to-send profiles with a preview.
- Approves → the web app generates the final client-facing email (from Raja's inbox) with profiles attached.
- Raja clicks send. Requirement status moves to "submitted".

### 10. Post-submission tracking
- Interview coordination stays on WhatsApp (human).
- Status updates flow back into the web app — interview scheduled, feedback received, offer made, placed.
- Placement data feeds into the dashboard that becomes the pitch for Phase 2.

## Total time per recruiter per day
**~1.5–2 hours** of actual decision-making and relationship work. Down from 6–8.

## What each agent replaces
| Human task | Replaced by |
|---|---|
| Reading 200 CVs | [[Atlas/Product/Agents#Screener]] |
| Searching Foundit manually | [[Atlas/Product/Agents#Sourcing-Agent]] |
| Writing outreach emails | [[Atlas/Product/Agents#Outreach]] |
| Chasing candidates for missing fields | [[Atlas/Product/Agents#Follow-up]] |
| Formatting profiles for client | [[Atlas/Product/Agents#Formatter]] |

## What we deliberately kept human
- WhatsApp first contact
- Phone calls
- Client conversations (Raja only)
- Final approval on every outbound email
- Judgment on edge-case candidates
- Offer negotiation

## The pitch to Raja and the team
"You'll still do the recruiting work that actually matters. We're taking the Excel and copy-paste out, not the job."

See [[Atlas/Business-Model/Phase-1-ExcelTech]] for the success criteria.

## Related
- [[Atlas/ExcelTech/Current-Flow]]
- [[Atlas/Product/Agents]]
- [[Atlas/Product/Skills]]
- [[Atlas/Product/Architecture]]
- [[Efforts/ExcelTech-Automation/Overview]]
