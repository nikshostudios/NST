---
type: atlas-note
area: Product
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# Product — Skills

**Skills** are the orchestration layer. They chain individual agents into complete workflows the recruiter can trigger with a single click (or that APScheduler triggers on a schedule).

Agents do one thing. Skills do the whole job.

Not to be confused with [[AIOS/skills-map|AIOS skills]] — those are recurring vault operations (ingest-source, lint-wiki, etc.). Product skills are recruitment workflows.

## Five core skills

### 1. source-and-screen
**Trigger:** TL publishes a new requirement → button click from the recruiter's dashboard, or an automatic kickoff when the requirement is created.

**Flow:**
1. Call [[Atlas/Product/Agents#Sourcing-agent]] against Foundit (and MyCareersFuture for SG reqs).
2. For each new CV returned, store in Supabase, extract text, link to the requirement.
3. For each CV, call [[Atlas/Product/Agents#Screener]] → produce match score + reasoning.
4. Produce a ranked list in the "Sourced" tab of the requirement page.
5. Notify the assigned recruiter(s).

**Output:** Ranked shortlist ready for recruiter review.

**Time saved vs current flow:** ~3 hours per requirement.

### 2. prepare-outreach
**Trigger:** Recruiter marks candidates "ready for outreach" after WhatsApp first contact.

**Flow:**
1. For each approved candidate, call [[Atlas/Product/Agents#Outreach]] to draft a personalised email.
2. Draft goes into the recruiter's Outlook as a real MS Graph draft (not a copy).
3. Draft also appears in the web app's Outreach Queue for review.
4. Recruiter edits (if needed) and clicks send from the web app (which sends via MS Graph).

**Output:** Pre-drafted, per-candidate outreach emails ready to send.

**Time saved:** ~3–5 minutes per email × dozens per day.

### 3. process-inbox
**Trigger:** APScheduler, every 15 minutes, per recruiter inbox.

**Flow:**
1. For each recruiter, call MS Graph to pull new messages since last run.
2. For each candidate reply, call [[Atlas/Product/Agents#Follow-up]] to extract fields + draft chase-or-confirm reply.
3. Update the candidate record in Supabase with newly extracted fields.
4. Re-score the candidate against open requirements (fields may change fit).
5. If all 8 fields are present → auto-promote to "ready for submission" queue.
6. Stack draft replies in the recruiter's approval queue.

**Output:** Candidate records get populated automatically. Recruiter wakes up to a pre-drafted inbox.

**Time saved:** the biggest single saving. This is the "chasing replies" loop from the old flow.

### 4. submit-to-tl
**Trigger:** A candidate reaches "ready for submission" status (all fields present, match score above threshold, recruiter hasn't marked as held).

**Flow:**
1. Call [[Atlas/Product/Agents#Formatter]] to generate the ExcelTech profile document.
2. Store the formatted doc in Supabase Storage.
3. Push the submission onto the TL's Submission Queue screen.
4. Notify Raja (in-app badge; email if configured).

**Output:** Submission candidates arrive on Raja's screen pre-formatted, pre-vetted.

### 5. tl-send-to-client
**Trigger:** Raja approves a submission from the Submission Queue.

**Flow:**
1. Generate the final client-facing email (from Raja's Outlook) with the formatted profile attached.
2. Insert the client contact (pulled from `client_contacts`), the requirement reference, and a brief cover paragraph.
3. Place the draft in Raja's outbox (via MS Graph draft creation).
4. Raja reviews and clicks send.
5. Mark the submission as `sent_to_client` with timestamp. Move the requirement status forward.

**Output:** Candidate is in front of the client with zero manual formatting by Raja.

## Skills are where the savings compound
One skill = one button. One button = what used to take 2 hours. This is the difference between "we built some AI features" and "we rewrote the day".

## Design rules for skills
1. **Idempotent.** Running a skill twice on the same input must not double-send, double-charge, or double-score.
2. **Failure-tolerant.** If one candidate in a batch fails (e.g. CV can't be parsed), the skill logs the failure and continues with the rest.
3. **Audit-logged.** Every skill invocation writes a row to `skill_runs` with inputs, outputs, agent calls, token cost, and duration.
4. **Human checkpoints where it matters.** Outreach approval, submission approval, send-to-client — always human click.
5. **Reversible where possible.** A mis-sent email can't be undone, but a mis-formatted submission can be regenerated before send.

## Related
- [[Atlas/Product/Agents]]
- [[Atlas/Product/Architecture]]
- [[Atlas/ExcelTech/New-Flow]]
- [[AIOS/skills-map]] — the vault-side skills (not these)
- [[Atlas/Concepts/Agents-vs-Tools]]
