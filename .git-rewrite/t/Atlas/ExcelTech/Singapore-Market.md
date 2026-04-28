---
type: atlas-note
area: ExcelTech
market: Singapore
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# ExcelTech — Singapore Market

## What it is
The smaller but strategically important second market. Singapore is where ExcelTech is HQ'd, where Nik is based, and where the Niksho entity will eventually be booked. Lower volume than India, but higher average margin and tighter compliance.

## Clients
- **GeBIZ / MOE** — the big one. GeBIZ is the Singapore government e-procurement system; MOE (Ministry of Education) publishes tenders for school-based roles (ICT Trainer, AV Technician, etc.) that ExcelTech bids on. One candidate can be submitted against multiple tenders simultaneously — this is why the `gebiz_submissions` table joins through a tender table. See [[Atlas/Product/Database-Schema]].
- **LGT Bank** — private banking, corporate roles.
- **OWIS** — One World International School. Admin, facilities, IT.
- **BCS**

## Role types
- ICT Trainer (classroom tech support in schools)
- AV Technician
- Audio Visual Multimedia Executive
- Administrative Assistant
- IT Engineer
- Field Desk Admin

Very different shape from India. Fewer "developer" roles, more operational/support roles tied to physical locations (schools, banks, campuses).

## Salary conventions
- Always **SGD**, always **monthly**. No LPA, no daily contract rates.
- Ranges typically S$2,500 – S$6,000 monthly for ops roles; higher for IT engineer and banking.

## The nationality rule
**Most GeBIZ and government-adjacent roles require the candidate to be a Singapore Citizen or Permanent Resident.** This is a hard filter, not a preference. The Screener agent rejects non-SC/PR candidates at the first pass for any SG government role.

Exceptions: some LGT / private sector roles accept EP (Employment Pass) holders. Rule lives in the requirement record, not the agent.

## Sourcing
- **MyCareersFuture** — Singapore government's free careers portal. Has a **public API** we can use without scraping or terms-of-service risk. Primary sourcing channel for SG. See [[Atlas/Product/Sourcing-Channels#MyCareersFuture]].
- **Foundit (Singapore)** — same three shared accounts but SG search context.
- **LinkedIn** — manual only.

## The GeBIZ tender workflow
This is the one part of the SG business that doesn't look like the India flow at all:

1. MOE publishes a tender on GeBIZ (e.g. "ICT Trainer — Primary School Cluster West") with a **MOESCHETQ** tender number.
2. ExcelTech can submit the **same candidate** against multiple tender numbers simultaneously — if the candidate matches the ICT Trainer spec, they can be proposed to five schools at once.
3. Each (candidate × tender) pair is a separate submission record. 384 unique tender rows in the historical sheet produced **668 submission records** because of this fan-out.
4. Tenders have hard deadlines. Missing a deadline = losing the opportunity entirely, no extensions.

The database models this as `gebiz_tenders` (one row per tender) and `gebiz_submissions` (join table: candidate + tender + status). Never collapse this back into a single table.

## Volume
- 384 tender rows historically.
- 668 submission records after the candidate-to-tender fan-out.
- Lower absolute count than India but growing quarterly.

## Who runs it
**Raghav** is the primary SG-focused recruiter. Other India-based recruiters occasionally support with sourcing but Raghav owns client communication, tender tracking, and submission formatting for the SG market.

See [[Atlas/ExcelTech/Team]].

## What makes Singapore different
- **Compliance-heavy.** Nationality rule, data residency expectations, PDPA (Singapore's data privacy law).
- **Tender-based, not requirement-based.** The "req" construct we use for India doesn't map cleanly — we have tenders with deadlines and scoring criteria.
- **Government is a real buyer.** Relationships with MOE cluster leads matter as much as sourcing speed.
- **Smaller candidate pool.** SC/PR constraint means there's no amount of volume sourcing that fixes a shortage — have to go to networks and referrals.

## Related
- [[Atlas/ExcelTech/ExcelTech-Overview]]
- [[Atlas/ExcelTech/India-Market]]
- [[Atlas/Product/Database-Schema]] — GeBIZ tender/submission model
- [[Atlas/Product/Sourcing-Channels]] — MyCareersFuture API
- [[Atlas/People/Raja-TL]] — client relationship
