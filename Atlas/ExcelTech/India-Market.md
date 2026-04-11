---
type: atlas-note
area: ExcelTech
market: India
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# ExcelTech — India Market

## What it is
The bigger of ExcelTech's two markets by volume. High-throughput IT recruitment for Indian enterprises and their captive centres, serviced out of the India-based recruiter team.

## Clients
Active and historical client set (non-exhaustive):

- **HCL India** — the dominant account. 14,000+ historical submissions, many concurrent requirements.
- **NCR IN**
- **Tech Mahindra**
- **Paytm**
- **Flipkart**
- **Keva**
- **360F**
- **Motherson**
- Plus long tail of smaller tech employers seen in the historical tracker.

The full 1,007-contact BD CRM lives in [[Raw/docs/ExcelTech_Master_Knowledge_Base]] and is being migrated into Supabase as the `clients` and `client_contacts` tables.

## Role types we fill
Consistently recurring:

- ServiceNow (Developer, Admin, HRSD, CMDB, ITOM, Solution Architect)
- Snow Developer / Snow Admin
- Cyber Security
- GCP Data Engineer
- Angular (front-end)
- DevOps
- PeopleSoft HCM
- BMC Remedy
- Automation Engineer
- Solution Architect (cross-stack)

Roles are dense around the ServiceNow ecosystem because HCL is our anchor and HCL is a ServiceNow-heavy account.

## Salary conventions
- **Permanent:** expressed in **LPA** (lakhs per annum, INR). E.g. "18 LPA" = ₹1,800,000 per year.
- **Contract:** monthly INR rate, sometimes daily for short assignments.

The product must parse both formats and normalise to a common numeric field for filtering. See [[Atlas/Product/Database-Schema]] for how `expected_ctc` is stored.

## Sourcing
- **Foundit** — three shared accounts (`xExcelTech_Cominx01`, `02`, `03`), rotated across recruiters. Primary active-search portal. See [[Atlas/Product/Sourcing-Channels]] for rotation logic.
- **LinkedIn** — **manual only**. No scraping, ever. See [[Atlas/Concepts/File-over-AI]] and the NOT-to-do list in [[mi]].
- **Inbound email** — candidates responding to outreach or referral.
- **Direct WhatsApp** — recruiters have candidate networks from prior placements.

## Volume and throughput
From the historical Excel tracker migrated in April 2026:

| Metric | Count |
|---|---|
| Total submissions logged | **14,000+** |
| Candidates reaching interview stage | **2,300+** |
| Confirmed placements | **62** |
| Requirements received | **633** |
| BD CRM contacts | **1,007** |

HCL alone accounts for the majority of submissions. Placement rate is the north-star metric the automation has to move.

## Commercials
- **Permanent:** 8–15% of the candidate's annual CTC, billed to client on joining (plus replacement guarantee window, typically 90 days).
- **Contract:** margin on the contractor's monthly rate, billed monthly for the duration of the engagement.

## What makes India hard
- **Signal-to-noise is terrible.** Foundit returns hundreds of resumes per search, most of which don't match intent. Screening has been the single biggest time sink.
- **Candidate availability is volatile.** People take counter-offers, ghost after shortlisting, drop out between interview rounds.
- **Client JDs are often vague.** The Screener agent has to infer "real" requirements from "listed" requirements — this is where [[Atlas/Product/Agents#Screener]] earns its keep.
- **Multiple agencies compete for the same req.** First-to-submit with a strong profile wins. Speed matters.

## Related
- [[Atlas/ExcelTech/ExcelTech-Overview]]
- [[Atlas/ExcelTech/Singapore-Market]]
- [[Atlas/ExcelTech/Current-Flow]]
- [[Atlas/ExcelTech/New-Flow]]
- [[Atlas/Product/Sourcing-Channels]]
- [[Atlas/Product/Database-Schema]]
