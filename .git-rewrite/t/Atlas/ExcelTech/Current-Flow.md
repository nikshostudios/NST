---
type: atlas-note
area: ExcelTech
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# ExcelTech — Current Flow (Pre-Automation)

This is what a recruiter's day looked like **before** the automation layer. Documenting it in detail because we measure success against this baseline. Every hour we remove from this flow is an hour the recruiter can spend on the 20% that humans actually need to do.

## The end-to-end path

### 1. Requirement intake
- **TL (Raja)** receives a requirement from a client over email, WhatsApp, or phone call.
- Raja manually rewrites or forwards the JD into a group email to the recruiter team.
- No structured capture. The JD lives in inbox threads, possibly copy-pasted into an Excel tracker.

### 2. Informal assignment
- Recruiters read the group email and **self-assign**. Multiple recruiters may pick up the same requirement and compete to be the first with a strong profile.
- No deduplication. Two recruiters might reach out to the same candidate from different accounts on the same day.

### 3. Sourcing
- Recruiter logs into **Foundit** (one of the three shared accounts).
- Runs keyword searches against the JD — often the wrong keywords, because JDs are verbose and the real "must-haves" are buried.
- Scrolls through hundreds of profiles. Opens each one. Reads the resume. Decides visually if it matches.
- Downloads the CV, one by one, into a folder on their laptop.
- Also: LinkedIn manual search, personal network, inbound referrals.

**Time cost:** ~2 hours of screen time per requirement, per recruiter. Mostly scrolling and deciding.

### 4. Screening
- Opens each downloaded CV. Reads it against the JD in another tab.
- Eyeballs: skills match? years of experience? location? notice period? salary expectation (often not on the CV)?
- Manually rejects the obvious no's. Shortlists the maybes.

**Time cost:** ~1.5 hours per requirement. Fatigue is a real variable here — by the 20th CV, quality of screening drops.

### 5. First contact (WhatsApp)
- Before any formal outreach, recruiters usually WhatsApp the candidate to check if they're interested and available. Three messages back and forth.
- If interested, move to email. If not, mark the CV and move on.

### 6. Email outreach
- Recruiter opens their **personal Outlook** (every recruiter has their own inbox).
- Writes an email from scratch (or copy-pastes from a template doc).
- Attaches a small table of requested fields: current CTC, expected CTC, notice period, current location, preferred location, reason for change, total experience, relevant experience.
- Sends.

**Time cost:** 3–5 minutes per candidate × dozens of candidates per day.

### 7. Chasing replies
- Candidates often don't reply. Or reply with half the fields missing.
- Recruiter re-reads the thread, types a follow-up asking for the missing fields.
- This loop runs 2–4 times per candidate before the info is complete or the candidate goes dark.

**Time cost:** Enormous in aggregate. This is the single biggest drain on the day.

### 8. Profile compilation
- Once info is in, recruiter manually copies values into the **ExcelTech profile format** (a specific table the client expects).
- Formats the CV if the client wants a particular layout.
- Emails the completed profile to the **TL**.

### 9. TL review and client submission
- Raja reads the submitted profile.
- Approves or sends back for changes.
- Forwards to the client with Raja's own formatting and commentary.

### 10. Interview coordination and placement
- Client replies with interview slots.
- Recruiter coordinates with candidate over WhatsApp.
- Multi-round interviews happen. Feedback loops.
- If the candidate is selected, offer → acceptance → onboarding → placement fee invoice.

## Total time per recruiter per day
**6–8 hours** of mechanical work (sourcing, screening, outreach, chasing) before any strategic or relational work happens.

## Where it leaks
- **Screening is the biggest time sink.** Humans can't read CVs as fast as machines can compare them against JDs.
- **Chasing replies is the most demoralising.** Recruiters end up babysitting candidates through a form-fill workflow.
- **Profile compilation is error-prone.** Copy-paste mistakes, inconsistent formatting, occasional data fields missing when sent to client.
- **Informal assignment wastes effort.** Two recruiters doing the same search is not additive — it's duplicated work plus reputational risk with the candidate.

## What can't be automated
- WhatsApp first contact (candidates need to hear from a human voice).
- Phone calls with hesitant candidates.
- Client politics (what Raja actually does with the TL relationship).
- Negotiating offers.
- Judgment calls on edge cases (career changers, overqualified applicants, etc.).

## Related
- [[Atlas/ExcelTech/New-Flow]] — the post-automation version
- [[Atlas/ExcelTech/Team]]
- [[Atlas/Product/Agents]]
- [[Atlas/Product/Skills]]
