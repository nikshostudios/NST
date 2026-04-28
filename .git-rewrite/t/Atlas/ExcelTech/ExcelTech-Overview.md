---
type: atlas-note
area: ExcelTech
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# ExcelTech — Overview

## What it is
**ExcelTech Computers** is an IT recruitment agency that acts as the middleman between companies that need tech talent (clients) and professionals looking for jobs (candidates).

- **HQ:** Singapore
- **Recruitment operations:** India
- **Founder/operator:** Nik (Nikhil's father)
- **Team size:** 10 recruiters + 1 team lead

## How they make money
- **Permanent roles:** 8–15% of candidate's annual salary, paid by client on placement
- **Contract roles:** margin taken on the contractor's daily or monthly rate

## Two markets, one agency
ExcelTech operates in **two separate markets** with different clients, roles, portals, and rules:

### India
- Clients: HCL India, NCR IN, Tech Mahindra, Paytm, Flipkart, Keva, 360F, Motherson, and others
- Roles: ServiceNow, Snow Developer/Admin, Cyber Security, GCP Data Engineer, Angular, DevOps, PeopleSoft HCM, BMC Remedy, HRSD, CMDB, ITOM, Solution Architect, Automation Engineer, and more
- Salary format: LPA (Lakhs Per Annum) or monthly INR
- Sourcing portals: Foundit (3 shared accounts), LinkedIn (manual)
- Volume: **high** — HCL alone has 14,000+ historical submissions

Full detail → [[Atlas/ExcelTech/India-Market]]

### Singapore
- Clients: GeBIZ (MOE school tenders), LGT Bank, OWIS, BCS, and others
- Roles: ICT Trainer, AV Technician, Audio Visual Multimedia Executive, Administrative Assistant, IT Engineer, Field Desk Admin
- Salary format: SGD monthly
- Sourcing portals: MyCareersFuture (free gov API), Foundit, LinkedIn (manual)
- **Nationality rule:** must be Singaporean or PR for most GeBIZ/government roles
- **Special workflow:** GeBIZ tender system — one candidate can be submitted to multiple school tenders simultaneously via MOESCHETQ tender numbers
- Volume: lower but growing; Raghav is the primary SG-focused recruiter

Full detail → [[Atlas/ExcelTech/Singapore-Market]]

## The team
**TL:** Raja — the only person who interacts with clients directly. Receives requirements, reviews shortlists, approves submissions, sends profiles to clients. Also does sourcing himself.

**Recruiters (10):** Raja (TL), Rakesh, Bhuwan, Irfan B, Gobind, Manoj, Isha, Ashish, Tilak, Toshi, Raghav, Atul.

Each recruiter has their **own individual Outlook account** — 10 individual Microsoft Graph API connections, not a shared mailbox. Outreach emails always go from the individual recruiter's inbox.

Full detail → [[Atlas/ExcelTech/Team]]

## Historical context (what the Excel tracker told us)
- **14,000+** submissions going back to Feb 2024
- **2,300+** candidates who reached interview stage
- **62** confirmed placements (onboarded candidates)
- **633** requirements received from clients
- **1,007** client contacts in the TL's BD CRM
- Recruiter assignment was informal — TL emails reqs to the group, recruiters pick up what they can handle
- GeBIZ has 384 rows, but one candidate matched to multiple tenders creates 668 DB records

Migration from Excel → Supabase completed in April 2026. Dry run: zero errors across all sheets.

## Current vs new daily flow
Before automation: 6–8 hours of mechanical work per recruiter per day.
After automation: ~1.5–2 hours of decision-making and relationship work.

Side-by-side detail → [[Atlas/ExcelTech/Current-Flow]] and [[Atlas/ExcelTech/New-Flow]].

## Related
- [[Raw/docs/ExcelTech_Master_Knowledge_Base]] — canonical source
- [[Atlas/Business-Model/Phase-1-ExcelTech]] — why ExcelTech is the proving ground
- [[Atlas/Product/Architecture]] — the system being built on top
- [[Efforts/ExcelTech-Automation/Overview]] — live build
