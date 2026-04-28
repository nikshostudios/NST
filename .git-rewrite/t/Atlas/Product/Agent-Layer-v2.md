---
type: atlas-note
area: Product
updated: 2026-04-12
generated-by: claude-opus-4-6
sources: ["[[Atlas/Product/Agents]]", "[[Atlas/Product/Architecture]]", "[[Atlas/Product/Sourcing-Architecture-v2]]"]
status: design
---

# Product — Agent Layer v2

> This document describes the proposed expansion of ExcelTech's agent layer.
> v1 shipped 5 agents (see [[Atlas/Product/Agents]]). v2 keeps all 5, enhances 2, and adds 3 new agents.
> The sourcing architecture that feeds these agents is described in [[Atlas/Product/Sourcing-Architecture-v2]].

---

## Summary of changes

| Agent | Status | Key change |
|---|---|---|
| Sourcing | ENHANCED | 8-channel mesh, adaptive query generation, channel router |
| Screener | ENHANCED | Market-aware salary scoring (Adzuna), multi-requirement cross-matching |
| Outreach | No change | Per-recruiter voice tuning in progress (May 2026) |
| Follow-up | No change | Biggest time-saver, running well |
| Formatter | No change | Auto-generates profile docs on "ready for submission" |
| **JD Parser** | **NEW** | Extracts structured skills, salary, experience from raw JD text |
| **Reactivation** | **NEW** | Weekly scan of dormant candidates against open requirements |
| **Market Intelligence** | **NEW** | Nightly market analysis, demand spikes, salary drift, new client leads |

---

## Enhanced agents

### Sourcing Agent (ENHANCED)

**v1:** 3 channels (Foundit, MCF, Internal DB). Single-channel per search.

**v2:** 8-channel sourcing mesh with a channel router that selects which channels to activate based on requirement type, market, and channel health. Parallel execution across channels. Results normalized into unified candidate schema. Dedup across channels via `(email || phone || name+city)` hash.

**New capability — adaptive query generation:** When initial Foundit/Naukri search returns <10 results, the agent automatically broadens search terms (e.g., "ServiceNow ITSM" → "ServiceNow OR ITSM OR IT Service Management"). When it returns 200+, it narrows (adds salary range, location, experience filters). This prevents both empty shortlists and overwhelming noise.

Full channel details: [[Atlas/Product/Sourcing-Architecture-v2]].

### Screener Agent (ENHANCED)

**Enhancement 1 — market-aware scoring:** Ingests salary benchmarks from Adzuna's API (stored in `market_salary_benchmarks` table). When a candidate asks 22 LPA for a role where the India market median is 18 LPA, the flag says "Above market by 22%" with the benchmark source, instead of just "salary mismatch." This gives recruiters concrete negotiation data.

**Enhancement 2 — multi-requirement cross-matching:** When a new candidate enters the system (via any sourcing channel), the Screener runs against ALL open requirements, not just the one being sourced. Output: "This candidate was sourced for Req #45 but also matches Req #62 at 87% and Req #71 at 74%." Surfaces cross-selling opportunities that v1 misses because scoring is currently one-requirement-at-a-time.

---

## New agents

### JD Parser Agent (NEW)

**Problem it solves:** Skills are not being reliably extracted from JD text on requirement creation (current bug — possibly silent JSON parse failure). Recruiters paste JDs in wildly different formats. The skill normalization gap means composite strings like "ServiceNow JavaScript ITSM" don't decompose into individual skills for matching.

**What it does:** Runs on every new requirement. Extracts:
- Required skills (normalized to canonical `skill_taxonomy` table)
- Experience range (min-max years)
- Salary range (LPA for India, SGD for SG)
- Location (city, remote/hybrid/onsite)
- Notice period tolerance
- Must-have vs nice-to-have skills
- Red flags (unrealistic combos like "10 years ServiceNow with 3 LPA")

Outputs structured JSON that seeds the requirement record in Supabase. Every downstream agent (Sourcing, Screener, Outreach) benefits from clean, structured input.

**Model:** Sonnet 4 (quality matters — a badly parsed JD poisons the entire pipeline).

**Trigger:** Auto on requirement creation. Also available for manual re-parse when JD is updated.

**Cost:** ~$0.01-0.03 per JD. 50 new reqs/month = ~$1.50/month.

### Reactivation Agent (NEW)

**Problem it solves:** ExcelTech has 2,300+ candidates in the database but most are "cold" — sourced months ago, not contacted recently. Meanwhile, new requirements come in daily that might match these dormant candidates.

**What it does:** Runs weekly (Sunday night via APScheduler). For each open requirement, performs a vector search across the full internal DB for candidates who:
1. Were sourced 30+ days ago
2. Were never submitted for THIS requirement (may have been submitted for others)
3. Were never explicitly rejected by this client
4. Match the current requirement at ≥70% confidence (via Screener agent)

Generates a "Reactivation Queue" in the web app. Recruiters see: "These 8 candidates from your old pipeline might fit Req #67."

**Why this matters:** Reactivation is a $0 sourcing cost channel. These candidates already have CVs parsed, contact info confirmed, sometimes even field data from prior outreach. The fastest path to a placement is often someone already in the system who was sourced for a different role months ago.

**Model:** Haiku 4.5 (vector search + basic filtering, not heavy reasoning).

**Trigger:** APScheduler weekly. Also on-demand when a new high-priority requirement is created.

### Market Intelligence Agent (NEW)

**Problem it solves:** ExcelTech is purely reactive — they wait for clients (HCL, TechM) to send JDs. Zero visibility into broader market demand, competitor moves, or new client opportunities.

**What it does:** Consumes data from TheirStack, SerpApi, and Adzuna. Runs nightly analysis and produces:

1. **Demand spikes** — "ServiceNow hiring in Bangalore is up 40% this month." → Signal for Raja to pitch ExcelTech's ServiceNow bench to clients proactively.
2. **New client leads** — "Infosys posted 12 ServiceNow roles this week but isn't an ExcelTech client." → BD opportunity for Nikhil's dad's network.
3. **Salary drift** — "GCP Data Engineer salaries in India trending up 15% QoQ." → Adjust candidate salary expectations and client budgets.
4. **Candidate-job matching** — Cross-reference ExcelTech's idle candidates against market jobs → "You have 5 candidates who match roles at companies that are actively hiring but aren't your clients."

**Output:** Weekly "Market Brief" delivered to Raja + Nikhil's dad via email (generated by Outreach agent's email infrastructure). Actionable, not noisy — top 5 insights only. Also stored in `market_briefs` table for historical reference.

**Model:** Sonnet 4 (synthesis and reasoning over market data).

**Cost:** TheirStack ($59/mo) + Sonnet 4 analysis (~$2-5/month in tokens) = ~$65/month for intelligence that no 10-person agency has.

---

## End-to-end flow (v2)

```
CLIENT SENDS JD (email to Raja)
  │
  ▼
JD Parser Agent → structured requirement → Supabase
  │
  ▼
Sourcing Agent → 8-channel mesh → candidate profiles
  │
  ▼
Screener Agent → ranked shortlist (market-aware, multi-req)
  │
  ▼
[ RECRUITER REVIEWS SHORTLIST ]         ← human decision
  │
  ▼
[ RECRUITER WHATSAPPS CANDIDATES ]      ← human touch
  │
  ▼
Outreach Agent → draft email → recruiter's Outlook
  │
  ▼
[ RECRUITER REVIEWS + SENDS ]           ← human approval
  │
  ▼
Follow-up Agent → parse replies → extract fields → chase
  │
  ▼
Formatter Agent → ExcelTech-format profile doc
  │
  ▼
[ TL APPROVES + SENDS TO CLIENT ]       ← human quality gate

BACKGROUND PROCESSES (always running):
- Reactivation Agent: weekly dormant candidate scan
- Intelligence Agent: nightly market analysis
- Inbound Portal: 24/7 candidate self-submission
- Follow-up Agent: every 15 min inbox scan
```

**Human touchpoints: 4.** Everything else is automated. Total human time per requirement: ~30-45 minutes (down from 6-8 hours in pre-automation, down from ~1.5-2 hours in v1).

---

## Implementation roadmap

### Phase 1 — Weeks 1-2: Fix Foundit + Add Naukri
- Reverse-engineer Foundit SPA API via Chrome DevTools
- Replace Firecrawl with direct httpx calls
- Build cookie refresh automation (Playwright, daily, `scraper_sessions` table)
- Add Naukri channel (Apify actor first, enterprise API application in parallel)
- Ship JD Parser Agent
- **Impact:** Sourcing goes from 1 unreliable channel → 3 reliable channels

### Phase 2 — Weeks 3-4: Vector Search + Reactivation
- Enable pgvector on Supabase
- Generate embeddings for all 2,300+ candidates
- Upgrade internal DB search to semantic vector matching
- Ship Reactivation Agent (weekly APScheduler job)
- **Impact:** Internal DB becomes the smartest search in the stack. Dormant candidates re-enter pipeline at $0 cost.

### Phase 3 — Weeks 5-6: Market Intelligence Layer
- Integrate TheirStack ($59/mo)
- Integrate SerpApi (Google Jobs, ~$5/mo)
- Integrate Adzuna (free tier, salary benchmarks)
- Ship Intelligence Agent (nightly run, weekly brief)
- Enhance Screener with market-aware salary scoring
- **Impact:** ExcelTech goes from reactive to proactive. First-mover on market opportunities.

### Phase 4 — Weeks 7-8: Inbound + Polish
- Build candidate portal on excelt.ai ("Submit Your CV")
- Add Google for Jobs JSON-LD structured data to career pages
- LinkedIn Boolean search generator (AI-assisted manual sourcing)
- Screener multi-requirement cross-matching
- **Impact:** Passive inbound channel. LinkedIn sourcing gets faster. Cross-selling opportunities surfaced.

---

## Cost summary

| Item | Monthly |
|---|---|
| Existing v1 costs | ~SGD 400-550 |
| TheirStack | +$59 |
| SerpApi | +$5 |
| Adzuna | $0 |
| Naukri (Apify) | +$20 |
| Claude API (3 new agents) | +$30-50 |
| Bright Data (contingency) | +$50 |
| **v2 total (optimistic)** | **~SGD 520-650** |
| **v2 total (with contingencies)** | **~SGD 650-800** |

One placement pays for the entire v2 upgrade 4-10x over.

---

## Related

- [[Atlas/Product/Sourcing-Architecture-v2]]
- [[Atlas/Product/Agents]] — v1 agent documentation (still accurate for current production)
- [[Atlas/Product/Architecture]]
- [[Atlas/Product/Skills]]
- [[Atlas/Product/Database-Schema]]
- [[Efforts/ExcelTech-Automation/Overview]]
