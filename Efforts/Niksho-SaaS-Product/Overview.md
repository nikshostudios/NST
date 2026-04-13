---
type: effort
effort: Niksho-SaaS-Product
status: planning
intensity: active
started: 2026-04-10
updated: 2026-04-10
owner: Shoham & Nikhil
---

# Niksho SaaS Product — Overview

## Goal
Take the working ExcelTech codebase and wrap it into a multi-tenant SaaS product that other recruitment agencies (and eventually internal HR/TA teams) can sign up for and run their own automation on. Launched on the back of the ExcelTech proof.

This is **Task 2** from the original user brief. Vault (Task 1) is shipped.

## Status
**Planning.** Architecture decided (Option A — see decision note). Ready to begin Phase A.

## Architecture decision (2026-04-10)

After researching InsForge's actual capabilities against the existing stack, the decision is **Option A: hybrid architecture**.

**ExcelTech stays completely untouched** — Railway + Supabase, current deployment, no changes. The risk of breaking a production system the family depends on is not worth any migration benefit.

**The SaaS product uses a split stack:**

| Layer | Technology | Why |
|---|---|---|
| SaaS database + auth | **InsForge** (Postgres + built-in auth + RLS) | MCP-native — Claude Code can scaffold tenant schema, auth flows, and onboarding directly. Fresh project, no migration risk. |
| SaaS backend (FastAPI) | **Railway** (second service) | InsForge can't host a persistent Python process. FastAPI needs APScheduler, MS Graph token refresh, long-running agent calls. Railway handles this. |
| SaaS frontend | **Jinja2** (now) → **Next.js** (later) | Jinja2 reuses the existing template codebase and ships fast. Next.js rebuild comes after paying customers exist. |
| Model gateway | **InsForge** | Route Claude/OpenAI calls through InsForge's unified endpoint. Per-tenant usage tracking for free. |
| Billing | **Stripe** | InsForge has native Stripe integration. |
| LLM calls | **Claude API** (via InsForge gateway) | Sonnet 4 for reasoning, Haiku 4.5 for extraction. Same model split as ExcelTech. |
| Shared code | **Same GitHub repo** | `/ai-agents/`, skills, and core logic shared. Environment variables determine which backend (Supabase vs InsForge) each deploy talks to. |

### Why NOT migrate ExcelTech to InsForge
- ExcelTech is production, in daily use, with 14k submissions and 10 live inbox connections.
- InsForge's Postgres has the same RLS as Supabase — no multi-tenant magic layer.
- InsForge's deployment is optimized for Next.js/edge, not persistent Python processes.
- The migration tool is tested on 39 users / 985 rows — our dataset is 14x larger.
- Incremental cost of running InsForge alongside Supabase is ~$25/month. Not worth the risk to save it.

See [[Efforts/Niksho-SaaS-Product/decisions/2026-04-10-option-a-hybrid-architecture]] for the full ADR.

### Monthly cost (incremental over current ExcelTech spend)

| Component | Cost | Notes |
|---|---|---|
| InsForge Pro | $25/month | SaaS database + auth + model gateway |
| Railway (SaaS backend) | $5–20/month | Second service, same repo |
| Stripe | 2.9% + $0.30/txn | Only kicks in when customers pay |
| Claude API (SaaS tenants) | Usage-based | Per-tenant caps enforced |
| Firecrawl (SaaS tenants) | Usage-based | Per-tenant caps enforced |
| **Total incremental** | **~$30–45/month** | **Before any tenant generates load** |

## The build plan (revised)

### Phase A — InsForge foundation + tenant schema (weeks 1–2)

Goal: a working InsForge project with tenant-aware Postgres, auth, and a "hello world" FastAPI connection.

1. Create InsForge project (hosted, closest region to SG).
2. Connect InsForge MCP to Claude Code. Verify connection.
3. Use Claude Code + InsForge MCP to scaffold the tenant-aware database schema: all ExcelTech tables with `tenant_id` column added, RLS policies scoped by `tenant_id`.
4. Set up InsForge auth: email/password + Google OAuth for agency sign-up.
5. Push the existing GitHub repo. Add environment-switching logic: `BACKEND=insforge` vs `BACKEND=supabase` determines which DB client the FastAPI app uses.
6. Deploy a second Railway service pointing at the same repo with `BACKEND=insforge` env var.
7. Smoke test: FastAPI boots, connects to InsForge Postgres, auth works, a test tenant can be created and queried with RLS isolation.

**Exit criteria:** A zero-data tenant can sign up, log in, and see an empty dashboard. No ExcelTech data or config is touched.

### Phase B — Tenant isolation + agent wiring (weeks 2–3)

Goal: every agent and skill works correctly scoped to a single tenant.

1. Add `tenant_id` context to every query path in FastAPI. Use a middleware that extracts `tenant_id` from the authenticated session and injects it into all DB calls.
2. Per-tenant secrets vault in InsForge for MS Graph credentials. Each agency brings their own Outlook accounts — no shared pool.
3. Per-tenant Firecrawl budget caps. Hard daily limit per tenant, enforced at the skill layer.
4. Per-tenant Claude API budget caps via InsForge model gateway. Track usage per tenant automatically.
5. Run the full agent suite (Screener, Outreach, Follow-up, Formatter, Sourcing) against a test tenant with synthetic data. Verify no data leaks across tenants.
6. APScheduler: inbox scan loop respects `tenant_id`. Each tenant's recruiters get their own scan cycle.

**Exit criteria:** Two test tenants running simultaneously, zero data bleed, per-tenant cost caps enforced.

### Phase C — Onboarding flow + billing (weeks 3–4)

Goal: a new agency can self-onboard from sign-up to first sourced candidate.

1. Sign-up flow: agency name, TL user creation, recruiter invites (Jinja2 templates).
2. Guided setup wizard: connect Outlook accounts (OAuth redirect per recruiter), add first client, create first requirement.
3. Empty-state content: sample JDs, templated client profiles, walkthrough tooltips.
4. Stripe integration via InsForge: plan selection, card entry, trial period (14 days free).
5. Admin dashboard for us: tenant list, usage per tenant, health metrics.

**Exit criteria:** A non-technical agency owner can go from sign-up to "first candidate sourced" without calling us.

### Phase D — Demo tenant + marketing (week 4)

Goal: a self-serve demo that sells the product without a sales call.

1. Pre-seeded demo tenant with realistic fake data (5 reqs, 30 candidates, 3 clients, 2 recruiters).
2. Read-only mode: prospects can explore but not break anything.
3. 3-minute screencast of the core workflow for the landing page.
4. Landing page (Jinja2 or static HTML on InsForge) with demo CTA and sign-up CTA.

**Exit criteria:** A prospect can play with the demo and understand the value in under 5 minutes.

### Phase E — First external pilot (weeks 5–8)

Goal: one real agency running real workflows on the SaaS product.

1. Use Nik's father's network to onboard one friendly agency (see [[Atlas/Business-Model/Phase-2-GTM]]).
2. Handhold them through onboarding. Sit with their TL for the first week.
3. Capture every friction point in a product backlog.
4. Monitor: RLS isolation, per-tenant budgets, billing accuracy, agent quality.
5. First invoice. First real revenue.

**Exit criteria:** Pilot agency is self-sufficient for at least 2 weeks. Zero data bleed incidents. Billing works.

## Open risks
- **Data bleed across tenants.** RLS is the primary defence. Every PR that touches a query path needs tenant-scoping review. Paranoia warranted.
- **Per-tenant cost variance.** One noisy tenant burns the Firecrawl or Claude budget. Hard caps in Phase B, before any external tenant.
- **InsForge maturity.** InsForge is newer than Supabase. If it has outages or breaking changes, the SaaS product is affected but ExcelTech is not (by design). Mitigation: the same schema could be stood up on a fresh Supabase project in a day if needed.
- **Support burden.** One agency is fun; five is a chore; fifty is a full-time job. Build a support playbook before onboarding tenant #2.
- **Feature creep from early customers.** Every custom request weighed against core product. See [[mi#NOT-to-do]].
- **ExcelTech regression risk.** Shared codebase means a bad merge could affect Railway. Mitigation: environment isolation via env vars, separate Railway services, ExcelTech gets extra CI scrutiny.
- **Jinja2 → Next.js migration debt.** Shipping Jinja2 now means rebuilding the frontend later. Acceptable: frontend rebuild is a known Phase 2.5 task, not a surprise.

## Tools available for this effort

### Anthropic Managed Agents (`platform.anthropic.com/managed-agents`)
Anthropic hosts individual agents on their infrastructure — sandboxed, credential-vaulted, observable, no server management. Each agent gets a persistent endpoint, an OAuth vault for external credentials, full session logs, and a debug view.

**What we use it for (not the core product stack):**

| Use case | Why Managed Agents fits |
|---|---|
| **Demo tenant** | Walk a prospect through the full ExcelTech workflow interactively — paste a JD, see candidates sourced and screened — without standing up a Railway service or touching RLS. Anthropic's sandbox handles isolation. |
| **Show Nik first** | Shoham can demo the entire workflow to Nikhil before any SaaS infra is built. Paste a real JD from ExcelTech, the agent runs the Screener + Outreach flow, output appears live. Faster than a slide deck. |
| **Show Nik's dad's network** | A friendly agency owner can be given a Managed Agent link and experience the product. No login, no onboarding, no infrastructure risk. |
| **Internal ops tools** | Post-meeting transcript → tasks in Notion/ClickUp automatically. Useful internally before it becomes a product feature. |

**What Managed Agents does NOT replace:** Railway (FastAPI + APScheduler), InsForge (Postgres, auth, storage). The core product stack is unchanged. Managed Agents is for demos, pilots, and bounded ops tools.

**Limitations to know:**
- Locked to Sonnet 4.6 (no model choice at time of writing)
- Limited networking — only pre-approved external services can be called
- No persistent background processes — conversational/request-response only
- Priced per token via the Anthropic API

---

## Demo tenant — task list

> **Immediate priority.** Shoham builds this to show Nik. If it lands, Nik shows it to his dad's network. This is the fastest path to a first external pilot — faster than Phase A–E of the full SaaS build.

### What the demo does
A prospect (or Nik) pastes a real job requirement. The agent runs the full ExcelTech workflow:
1. Screener agent finds matching candidates from Foundit / MCF
2. Outreach agent drafts personalised messages
3. Follow-up agent explains what it would do next
4. Output: a structured shortlist with outreach drafts, ready to send

They see the before (manual, hours of recruiter time) and the after (3 minutes, agent-done) in a single session.

### Build task list

- [ ] **1. Define the demo agent spec** — write the system prompt that stitches Screener + Outreach + Follow-up into a single conversational flow. Reference the existing agent prompts in the ExcelTech codebase. Agent should ask for: JD text or role description, location, seniority. Then run the workflow and return a structured shortlist + outreach drafts.
- [ ] **2. Create the Managed Agent on `platform.anthropic.com`** — paste the spec, name it "Niksho Recruitment Demo", connect MCPs for Foundit (Firecrawl) and MyCareersFuture. Use the Anthropic credential vault for any API keys.
- [ ] **3. Test with a real ExcelTech JD** — pick one active requirement from ExcelTech, paste it in, verify the output quality matches or exceeds what the live system produces. Iterate on the system prompt until it's tight.
- [ ] **4. Build a thin frontend** — use Claude Code + Managed Agents "integrate" flow to spin up a simple chat UI (Netlify or InsForge static hosting). Landing page with one sentence: "Paste a job requirement. See AI recruitment in 3 minutes." Demo button → chat window → agent runs.
- [ ] **5. Show Nik** — walk through it together. Nik's job: poke holes, tell Shoham what a recruiter would actually say when they see this. Capture all feedback in `Efforts/Niksho-SaaS-Product/decisions/`.
- [ ] **6. Show one person from Nik's dad's network** — one friendly agency owner, handhold the session, watch what confuses them. That confusion list becomes the Phase C onboarding backlog.

### Success criteria for the demo
A non-technical agency owner can paste a JD and in under 5 minutes say "I want this for my team." If that happens once, Phase A–E of the full SaaS build has a real customer waiting.

---

## What we are NOT doing (yet)
- Migrating ExcelTech off Railway+Supabase.
- SSO / SAML for enterprise customers.
- SOC 2 / ISO 27001 certification (too early — see Phase 3 funding prep).
- White-labelling for resellers.
- A mobile app.
- Public API / marketplace / integrations beyond what we already support.
- Self-serve sign-up without handholding (until pilot is smooth).
- Next.js frontend rebuild (until post-pilot).

## Open questions
- What's the pricing model? Per-seat? Per-placement? Per-requirement? Flat + usage?
- How do we handle data portability if a customer wants to leave?
- Do we give every tenant their own Niksho vault, or is that a later feature?
- What's the right way to share `/ai-agents/` code between ExcelTech and SaaS deploys without coupling their release cycles?

## v2 Architecture (2026-04-13)

The v2 architecture redesign restructured sourcing, enrichment, and the agent layer. Build tracker: [[Efforts/Niksho-SaaS-Product/v2-Planning-Log]].

**Key decisions:**
- [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-foundit-edge-api]] — switch to official API
- [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-phone-first-enrichment]] — phone-first, email last resort
- [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-channel-restructure]] — core vs BD add-on
- [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-screener-salary-logic]] — client budget primary
- [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-naukri-paused]] — no subscription

**Product knowledge:**
- [[Atlas/Product/Sourcing-Channels]] — the 6-channel lineup and waterfall
- [[Atlas/Product/Foundit-EDGE-Integration]] — full API reference
- [[Atlas/Product/Enrichment-Strategy]] — phone-first enrichment waterfall

## Related
- [[Efforts/ExcelTech-Automation/Overview]]
- [[Efforts/Niksho-SaaS-Product/decisions/2026-04-10-option-a-hybrid-architecture]]
- [[Atlas/Business-Model/Phase-2-GTM]]
- [[Atlas/Product/Architecture]]
- [[Atlas/Product/Tech-Stack]]
- [[Calendar/Quarterly/2026-Q2]]
