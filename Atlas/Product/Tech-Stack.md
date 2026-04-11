---
type: atlas-note
area: Product
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# Product — Tech Stack

Deliberately boring choices. Everything here was picked for shipability, portability, and "will still work if one vendor dies".

## The stack at a glance

| Layer | Choice | Why |
|---|---|---|
| Backend framework | **FastAPI** (Python) | Fast to ship, async-native, huge ecosystem |
| Templating | **Jinja2** (server-rendered) | No SPA complexity, works on slow laptops |
| Database | **Supabase Postgres** | Managed PG + Storage + auth + RLS primitives |
| Hosting (now) | **Railway** | One-command deploys, good enough for single-tenant |
| Hosting (SaaS) | **Insforge** (migrating) | Better multi-tenant story, see [[Efforts/Niksho-SaaS-Product/Overview]] |
| Scheduler | **APScheduler** (in-process) | No separate worker service needed at this size |
| LLM (heavy) | **Claude Sonnet 4** | Reasoning quality for screening/outreach |
| LLM (light) | **Claude Haiku 4.5** | Cheap, fast, good enough for parsing |
| Email | **Microsoft Graph API** | Required — recruiters have individual Outlook |
| Web scraping | **Firecrawl** | Managed headless browser, auth sessions |
| SG sourcing | **MyCareersFuture API** | Free, public, government |
| BD prospecting | **Apollo.io Professional** | Client acquisition, not candidate sourcing |
| Auth (now) | Simple dict-based role flags | Will harden for SaaS |
| Observability | Railway logs + `agent_runs` table | Structured and queryable |
| Version control | Git (GitHub) | Prompts live in-repo |

## Why Python + FastAPI
- **Recruitment is a Python ecosystem problem.** Document parsing (PDF/DOCX), LLM SDKs, pandas for ad-hoc analysis — Python has the libraries.
- **FastAPI is a thin layer over async + Pydantic.** We get typed request/response models, OpenAPI docs for free, and first-class async support for outbound API calls (MS Graph, Firecrawl, Claude).
- **Server-rendered HTML is a feature, not a debt.** Recruiters are on mid-tier laptops with patchy connectivity. An SPA would lose to a plain page render every time.

## Why Supabase
- Postgres is the right database. Full stop. Relational data, proper transactions, mature ecosystem.
- Supabase wraps it with Storage (for CVs and formatted docs), basic auth primitives, and a dashboard. Saves us from running our own PG + S3 + Auth0.
- Row-level security is available when we flip on multi-tenant for Phase 2. Not turned on yet.
- **Portable.** If we ever need to leave Supabase, it's `pg_dump` + lift files from Storage. No vendor lock.

## Why Railway (for now), Insforge (next)
- **Railway** for the current single-tenant ExcelTech deployment — one-command deploys, decent log drain, minimal config.
- **Insforge** is where the SaaS product will live. Better multi-tenant story, better usage-based billing, better aligned with the "drop a vault and a tenant gets spun up" vision. See [[Efforts/Niksho-SaaS-Product/Overview]] for the migration plan — that's task 2 after the vault is done.

## Why Claude (Sonnet 4 + Haiku 4.5)
- **Sonnet 4** for reasoning-heavy work where quality compounds into placement rates (screening, outreach writing, edge-case judgement).
- **Haiku 4.5** for high-volume low-judgement work (field extraction from replies, document formatting). Order of magnitude cheaper.
- **Why not GPT / Gemini?** Tool-use quality, long-context stability, and our actual experience. Not religious — we'll re-evaluate per task if a better model ships.
- **Why not open-source models?** Deployment cost + quality gap + operational overhead. Not worth it at this scale.

## Why Microsoft Graph (and not Gmail API or SendGrid)
- Hard requirement: every recruiter has their own **Outlook** account, not Gmail. Graph is the only sane way to read and draft emails from those inboxes.
- SendGrid or a shared inbox would break the entire "from a real human" principle that makes our outreach different.
- 10 individual OAuth connections. Per-user token cache with 1-hour TTL. Refresh tokens rotated nightly.

## Why Firecrawl (and not our own Playwright)
- Running headless browsers at scale = dev ops hell. Proxies, CAPTCHAs, session persistence, IP rotation.
- Firecrawl handles all of that as a managed service. We pay per credit and get a clean API.
- Trade-off: we have a vendor dependency. Mitigated by (a) budget caps, (b) the fact that losing Firecrawl only breaks Foundit scraping — MyCareersFuture and internal DB still work.

## Why Apollo.io Professional
- For **BD**, not candidate sourcing. Apollo is how we find new clients for ExcelTech (and for the Phase 2 SaaS sell).
- The Apollo plugin in the skills list (`apollo:prospect`, `apollo:enrich-lead`) is for that side of the business.

## What we deliberately did not pick
- **Langchain / LlamaIndex.** Too much magic, too opaque, version churn. We call the Claude SDK directly.
- **Vector databases for RAG.** Don't need them at this scale. Postgres full-text search plus structured fields plus a well-maintained wiki beats a vector store for our problem shape. See [[Atlas/Concepts/File-over-AI]].
- **OpenClaw / Paperclip / other agent platforms.** See [[Atlas/Business-Model/Product-Thesis#Why-we-own-the-stack]]. Our agents are our IP.
- **React / Next.js / SPA.** No. Server-rendered Jinja2 is faster to ship, faster to load, and easier to reason about.
- **Kubernetes.** Railway + future Insforge is all we need.

## Cost sanity check
Current monthly budget for running ExcelTech's automation layer is tracked in [[Atlas/Business-Model/Phase-1-ExcelTech#Cost-sanity-check]]. It has to stay under the margin per placement for the thing to make sense as a business.

## Related
- [[Atlas/Product/Architecture]]
- [[Atlas/Product/Agents]]
- [[Atlas/Product/Sourcing-Channels]]
- [[Atlas/Product/Database-Schema]]
- [[Atlas/Business-Model/Product-Thesis]]
