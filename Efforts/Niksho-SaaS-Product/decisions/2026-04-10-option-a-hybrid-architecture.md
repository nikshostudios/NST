---
type: decision
effort: Niksho-SaaS-Product
date: 2026-04-10
status: accepted
generated-by: claude
decision-makers: Shoham & Nikhil
---

# Decision: Option A — Hybrid architecture for SaaS product

## Context

Task 2 is to take the working ExcelTech automation system and productise it as a multi-tenant SaaS. The original plan assumed a full migration from Railway+Supabase to InsForge. After researching InsForge's actual capabilities (official docs, pricing, two YouTube implementation walkthroughs, Supabase comparison articles, and the official migration toolkit), we reassessed.

## Options considered

### Option A — Hybrid: InsForge for SaaS data layer, Railway for FastAPI (CHOSEN)
ExcelTech stays untouched on Railway+Supabase. The new SaaS product uses InsForge for Postgres+auth+model gateway and a second Railway service for the FastAPI backend. Shared codebase, environment-variable switching.

**Pros:** Zero risk to ExcelTech. InsForge's MCP lets Claude Code scaffold tenant schema fast. Model gateway gives per-tenant LLM usage tracking for free. Incremental cost is ~$30–45/month.

**Cons:** Two platforms to manage (InsForge + Railway). If InsForge has outages, the SaaS product is affected. Newer platform with less battle-testing than Supabase.

### Option B — Pure Supabase: second Supabase project + second Railway service
Skip InsForge entirely. Add multi-tenancy to a fresh Supabase project. Deploy SaaS as a second Railway service.

**Pros:** Zero new dependencies. Supabase is mature and well-documented. Same tooling for both ExcelTech and SaaS.

**Cons:** No MCP-native development workflow. Model gateway must be built manually. No deployment hosting (still need Railway or similar for everything). Misses the speed advantage of AI-agent-assisted backend scaffolding.

### Option C — Full InsForge migration (REJECTED)
Migrate ExcelTech off Railway+Supabase onto InsForge. Single platform for everything.

**Pros:** One platform. Simpler mental model long-term.

**Cons:** InsForge can't host persistent Python processes (APScheduler, MS Graph token refresh). Migration tool tested on 39 users / 985 rows — ExcelTech has 14k+ submissions. Risk of breaking a production system the family depends on. The multi-tenant primitives (RLS) are identical to Supabase — no actual feature gain from migrating.

## Decision

**Option A.** The risk-to-reward ratio of migrating ExcelTech is wrong. InsForge's value is in rapid AI-assisted scaffolding of the *new* SaaS layer, not in replacing a working production system.

## Consequences

- ExcelTech is permanently decoupled from InsForge. If InsForge disappears, ExcelTech is unaffected.
- The SaaS product has a dependency on InsForge. Mitigated by: the schema is standard Postgres and could be stood up on Supabase in a day.
- The shared codebase needs an environment-switching layer (`BACKEND=insforge` vs `BACKEND=supabase`). This is the main new engineering work.
- Frontend ships as Jinja2 first, Next.js later. This creates known tech debt but is the right trade-off for speed to first pilot.

## How we'll know if this was wrong

- InsForge has repeated outages or breaking changes that block SaaS development.
- The environment-switching layer becomes so complex it's harder than maintaining two separate codebases.
- InsForge's MCP advantage doesn't materially speed up development (i.e., we could have scaffolded just as fast with raw Supabase).

If any of these are true by the end of Phase B, we fall back to Option B (pure Supabase) with minimal sunk cost.

## Reversibility

**High.** The InsForge layer is standard Postgres. A fallback to Supabase means: `pg_dump` the InsForge DB → `pg_restore` into a new Supabase project → update env vars → redeploy. Auth migration is the hardest part (password hashes, OAuth tokens), but InsForge's migration tool works in both directions.
