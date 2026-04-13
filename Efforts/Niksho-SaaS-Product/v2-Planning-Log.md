---
type: effort-log
effort: Niksho-SaaS-Product
status: active
created: 2026-04-13
updated: 2026-04-13
generated-by: claude
owner: Nikhil & Shoham
related:
  - "[[Efforts/ExcelTech-Automation/Overview]]"
  - "[[Atlas/Product/Architecture]]"
  - "[[Atlas/Product/Sourcing-Architecture-v2]]"
  - "[[Atlas/Business-Model/Phase-2-GTM]]"
---

# v2 Architecture Planning Log

> Running log of all planning decisions made during the v2 system architecture redesign.
> Source HTML document: `ExcelTech-Recruitment-Agent-Architecture.html` in vault root.
> This log captures the *reasoning* behind decisions. The HTML doc is the *spec*.

---

## Core Product Vision (Decided 2026-04-13)

**Mission:** Double or triple recruiter throughput — from ~6 submissions/day to 12-20.

**What the product IS:** A recruiter multiplier. Takes existing requirements from existing clients and automates the grunt work (sourcing, screening, outreach, follow-up, formatting) so recruiters can submit more profiles per day.

**What the product IS NOT (for now):** A business development tool. Finding new clients and new JDs is a separate product sold as a premium add-on.

---

## Decision Log (Reverse Chronological)

### 2026-04-13 — Foundit API Assessment

**Context:** Received email from Prayag Sanghvi (Sr Manager APAC, Foundit) with "complete kit for Search & Job Postings." Two attachments: ATS-EDGE-Integration doc and ATS 2.0 API kit.

**Critical flag:** The email describes two methods (FTP and RTP) that are specifically about **pushing job postings TO Foundit**, not pulling candidate resumes FROM Foundit. The "Search" component may be in the attachments but needs verification.

**Decision:** Use **RTP (Real-Time Posting)** method if we proceed — it's HTTP POST-based, integrates directly with our FastAPI backend, and goes live in ~1 minute (vs 3-5 hour FTP lag).

**Action needed:** Nikhil to upload the two API doc attachments so Shoham can verify whether the search/resume API endpoints are included.

**Current Foundit integration:** `sourcing.py` already has a working direct API call to `recruiter.foundit.sg/edge/recruiter-search/api/search-middleware/v2/search` using cookie auth. This may remain the primary search method even if the official API is for job posting only.

---

### 2026-04-13 — Enrichment Strategy: Phone-First, Skip Email

**Context:** Nikhil proposed skipping Hunter.io email enrichment if we already have a phone number. Reasoning: WhatsApp is how Indian/SG recruiters actually communicate. Email is secondary.

**Challenge raised:** The Outreach Agent currently runs on Outlook emails. Skipping email means phone-only candidates bypass the entire automated outreach pipeline (draft → review → send → follow-up → inbox scan). Recruiter handles those manually via WhatsApp.

**Counterpoint from Nikhil:** That matches how ExcelTech works today. MVP should reflect reality, not aspirational workflow.

**Decision:** Phone-first for MVP. Skip email enrichment entirely if phone number exists.
- Candidates with email (from Foundit/Apollo directly) → automated Outreach Agent pipeline
- Candidates with phone only → recruiter WhatsApps manually (human touch)
- Hunter.io reserved as "last resort" option — only used when recruiter clicks "Find Email" button for mass email campaigns when desperate to fill a role

**Future data point:** Track what % of sourced candidates come with email vs phone-only. If >40% are phone-only, reconsider adding smart enrichment in Phase 2.

---

### 2026-04-13 — Naukri Paused

**Reason:** ExcelTech does not have a Naukri subscription. No access to Resdex recruiter API.

**Decision:** Pause Naukri integration entirely. Code exists in `sourcing.py` but won't be activated.

**Future plan:** Naukri becomes a selling point when going to market — "connect your Naukri account and we'll auto-source from India's #1 resume database." Part of the SaaS channel marketplace. Each tenant brings their own Naukri credentials.

---

### 2026-04-13 — Sourcing Inversion Removed

**What it was:** v2 originally proposed "agents continuously harvest open jobs across India/SG, then match against ExcelTech's candidate pool to proactively pitch placements." Essentially a BD engine.

**Why removed:** The core pain for a 10-person agency is NOT "we don't know who's hiring." They know — clients send JDs. The pain is the 6-8 hours of mechanical work per JD. Solving the wrong problem.

**Where it went:** Moved to BD Add-on Module (Section 09 of the HTML doc). Sold as a premium subscription add-on for $200/month extra. Uses TheirStack ($59/mo) + SerpApi ($5/mo) + Intelligence Agent. Margin: ~$130/tenant.

---

### 2026-04-13 — Channel Restructure

**Removed from core product:**
- TheirStack (job postings, not candidates) → moved to BD add-on
- SerpApi / Google Jobs (job postings) → moved to BD add-on
- Adzuna job data → moved to BD add-on (but salary benchmarks stay in core, free tier)

**Added to core product:**
- Apollo.io — **already live** in `sourcing.py`. Proven: Nikhil used it to find 30 fresh candidates for a Singapore senior sourcing manager role when Foundit/MCF were exhausted.
- GitHub — for tech roles only (DevOps, Data Eng, Full Stack). Free API.
- Lusha — phone number enrichment (primary). Not yet implemented.
- Hunter.io — email enrichment (last resort only, per decision above). Not yet implemented.

**Final core channel list:**
1. Internal DB (vector search, $0, always first)
2. Foundit API (India + SG)
3. Apollo.io (global, passive candidates — already live)
4. GitHub (tech roles only — to build)
5. Inbound Portal (candidates self-submit — to build)
6. LinkedIn (manual + AI boolean strings — already live)

---

### 2026-04-13 — Agent Layer Restructure

**Core agents (7):**
1. Sourcing Agent — enhanced with 6-channel mesh + built-in enrichment
2. Screener Agent — salary logic fixed (client budget primary, market data secondary)
3. Outreach Agent — unchanged, working well
4. Follow-up Agent — unchanged, biggest time saver
5. Formatter Agent — unchanged
6. JD Parser Agent — new, quality gate for requirement intake
7. Reactivation Agent — new, context-aware with rejection tracking

**Moved to BD add-on (1):**
8. Market Intelligence Agent — consumes TheirStack/SerpApi data

**Removed:**
- Separate Enrichment Agent — merged into Sourcing Agent

---

### 2026-04-13 — Screener Salary Logic

**Old behavior:** Simple yes/no/unknown for salary_fit. Could penalize a candidate for asking above market even if within client budget.

**New behavior:**
- Rule 1: If client gave budget and candidate is within it → NO penalty, ever
- Rule 2: If candidate exceeds client budget → penalty scales (5-10% over = minor, 10-20% = moderate, 20%+ = major)
- Rule 3: If no client budget → use Adzuna market data as informational flag only, not a penalty

---

### 2026-04-13 — Reactivation Agent Enhanced

**Enhancement:** Context-aware rejection tracking.
- New columns: `rejection_reason TEXT`, `rejection_category TEXT` on `screenings` table
- Agent checks if the rejection reason still applies to the new requirement
- Example: Rejected for salary (25 LPA vs 18 LPA budget) → new req has 28 LPA → RESURFACE
- Example: Rejected for skills gap in Kubernetes → new req also needs Kubernetes → SKIP

---

### 2026-04-13 — Revised Build Order

| Phase | What | Status |
|-------|------|--------|
| 1 | Fix Foundit direct API | Waiting for API docs |
| 2 | Quick Screen page + CV Parser + JD Parser + Screener fix | Not started |
| 3 | Excel CRM tracking sheet + dedup + availability tracker | Waiting for tracking sheet |
| 4 | Vector search + Reactivation Agent | Not started |
| 5 | Lusha enrichment + recruiter dashboard + Adzuna | Not started |
| 6 | Naukri + GitHub + Inbound + BD add-on | Future |

---

## Competitive Intelligence

### Juicebox AI ($375-950/month)
- 800M+ profiles across 30+ data sources
- Verified email + phone enrichment baked into search results
- Smart enrichment: only enriches matched candidates, no over-enrichment
- Integrates with 41 ATS and 21 CRM platforms
- Optional "Juicebox Agents" ($300/mo) for 24/7 autonomous sourcing
- **Takeaway:** They charge $375/mo minimum. Our product at even $200/mo is competitive. Their enrichment-baked-in approach validates our strategy.

### Greenhouse (Enterprise ATS)
- Applicant management, not sourcing/prospecting
- No built-in contact enrichment
- Integrates with AI Screened for resume screening
- Custom enterprise pricing (per-seat)
- **Takeaway:** Greenhouse is an ATS we'd integrate WITH, not compete against. Our product fills the gap Greenhouse doesn't — active sourcing + enrichment.

---

## Open Items

- [ ] Nikhil to upload Foundit API attachments (ATS-EDGE doc + ATS 2.0 API kit)
- [ ] Nikhil to upload ExcelTech tracking sheet (Excel CRM format reference)
- [ ] Decide on Lusha subscription tier (Free: 50 credits/mo, Pro: $49/mo)
- [ ] Pricing model discussion (deferred — build working product first)
