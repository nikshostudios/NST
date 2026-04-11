---
type: atlas-note
area: ExcelTech
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# ExcelTech — Team

## Team Lead (TL)

### Raja
- **Role:** Sole client-facing person. Receives requirements from clients, shares all open requirements to the team via email, reviews candidate shortlists, approves submissions, sends formatted profiles to clients. Also does sourcing himself.
- **Web app access:** Full — including TL-only screens (Submission Queue, Create Requirement, Approve + Send to Client)
- **Role flag:** `role = TL` in `RECRUITER_LOGINS` dict. All others are `recruiter`.

Dedicated page → [[Atlas/People/Raja-TL]]

## Recruiters (10)

| Name | Notes |
|---|---|
| **Raja** | Also the TL. Wears both hats. |
| **Rakesh** | India. Assigned Foundit account 01 (`xExcelTech_Cominx01`) |
| **Bhuwan** | India. Assigned Foundit account 03 (`xExcelTech_Cominx03`) |
| **Devesh** | Assigned Foundit account 02 (`xExcelTech_Cominx02`) |
| **Irfan B** | India |
| **Gobind** | India |
| **Manoj** | India |
| **Isha** | India |
| **Ashish** | India |
| **Tilak** | India |
| **Toshi** | India |
| **Raghav** | **Singapore-focused** — primary SG recruiter |
| **Atul** | India |

Note: the list above includes Devesh (who holds one of the three Foundit credentials) even though only 10–11 of these are active at any time. The team composition can shift — verify before assigning anything.

## What each recruiter's day looks like
1. Receive requirements assigned by TL via email
2. Source candidates (manual portal search + inbound from LinkedIn posts / direct emails)
3. Screen resumes against JD
4. WhatsApp candidates first to check interest
5. Send email outreach with candidate details table
6. Chase candidate replies for missing information
7. Send shortlisted candidates to TL via email
8. TL forwards to client

Full current-state walkthrough → [[Atlas/ExcelTech/Current-Flow]]

## Key technical fact: individual Outlook accounts
**Every recruiter has their own Outlook account.** Outreach emails go from their personal inbox. This means:
- 10 individual Microsoft Graph API connections required
- Email sending always from the specific recruiter's address, never a shared inbox
- Token caching is per email address with 1-hour TTL
- Inbox scanning runs against each recruiter's inbox independently every 15 minutes (APScheduler)

## Assignment convention
**Multiple recruiters can work the same requirement simultaneously.** Assignment is informal — TL emails requirements to the group, recruiters pick up what they can handle. The web app surfaces each requirement's "assigned recruiters" as a list, but it's descriptive (who actually worked it), not prescriptive.

## Related
- [[Atlas/ExcelTech/ExcelTech-Overview]]
- [[Atlas/People/Raja-TL]]
- [[Atlas/Product/Architecture]] — role-based UI
- [[Atlas/Product/Sourcing-Channels]] — Foundit account rotation
