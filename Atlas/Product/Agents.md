---
type: atlas-note
area: Product
updated: 2026-04-10
sources: ["[[Raw/docs/ExcelTech_Master_Knowledge_Base]]"]
---

# Product — Agents

Five agents make up the ExcelTech automation layer. Each is a focused, single-responsibility function with typed inputs and outputs. They live in `/ai-agents/` inside the Railway app and are invoked either by the web UI (human-triggered) or by APScheduler (time-triggered).

See [[Atlas/Concepts/Agents-vs-Tools]] for why we call these "agents" and not "tools" even though the line is blurry.

## Model choice

| Concern | Model | Why |
|---|---|---|
| Reasoning-heavy work (screening, outreach writing) | **Claude Sonnet 4** | Quality matters more than cost per call |
| High-volume, low-judgment work (parsing, classification, extraction) | **Claude Haiku 4.5** | Cheap, fast, good enough |
| Future option | Local models | For PII-sensitive extraction if a client demands it |

## Screener
**Purpose:** Given a JD + a candidate CV, produce a structured match score with reasoning.

**Inputs:**
- `requirement_id` (structured: must-haves, nice-to-haves, YOE, location, salary, client, nationality rule)
- `cv_text` (extracted from PDF/DOCX upstream)

**Outputs:**
- `match_score` (0–100)
- `strengths` (array of specific matches)
- `gaps` (array of missing/weak areas)
- `risk_flags` (overqualified, location mismatch, nationality fail, salary mismatch, career gap, notice period too long)
- `reasoning` (short prose — shown to recruiter for trust)

**Runs:** on every new CV sourced for a requirement, and on manual re-score triggers.

**Model:** Sonnet 4. The judgment quality here is worth the cost.

**Rules:**
- Never auto-reject on a single flag. Surface it, let the recruiter decide.
- For SG government roles, nationality rule is a hard filter (auto-reject non-SC/PR).
- Never assume fields not present. If CTC is missing from the CV, it's missing — don't hallucinate.

## Outreach
**Purpose:** Draft a personalised first-contact email from the recruiter's own Outlook account to a screened candidate.

**Inputs:**
- `recruiter_id` (→ inbox identity, signature, tone preferences)
- `candidate_id` (→ CV, screening notes)
- `requirement_id` (→ role context, client name, salary range)

**Outputs:**
- `subject` (concise, role + seniority)
- `body` (natural prose, not template-shaped, with the standard fields table appended)
- `from_email` (the recruiter's actual Outlook address)
- `draft_id` (MS Graph draft ID; never sent until recruiter approves)

**Runs:** on recruiter click from the "Ready for Outreach" queue.

**Model:** Sonnet 4.

**Rules:**
- **Never sends.** Always creates a draft. Recruiter clicks send.
- Writes from the individual recruiter's voice — short, direct, no corporate-speak.
- Always asks for the same 8 fields: current CTC, expected CTC, notice period, current location, preferred location, reason for change, total experience, relevant experience.
- British English for SG market, Indian English conventions for India market.

## Follow-up
**Purpose:** Parse candidate replies, extract the 8 fields, update the candidate record, and draft chase emails if fields are missing.

**Inputs:**
- `message_id` (from MS Graph inbox scan)
- `thread_context` (prior messages in the conversation)
- `candidate_id` (if already linked; otherwise the agent links via email address)

**Outputs:**
- `extracted_fields` (whichever of the 8 were present)
- `status_update` (e.g. `interested` / `not_interested` / `needs_info` / `wants_to_talk`)
- `draft_reply` (if missing fields → polite chase; if all fields → confirmation + next step)

**Runs:** APScheduler every 15 minutes against all 10 recruiter inboxes.

**Model:** Haiku 4.5 for field extraction (cheap, high volume), Sonnet 4 for drafting the reply (quality matters).

**Rules:**
- Never auto-send chase emails. Stack them in the recruiter's draft queue.
- Never mark "not interested" on ambiguous signals. When uncertain, escalate to the recruiter.
- If a candidate replies with new CTC/notice info, update the record immediately and re-score against open requirements.

## Formatter
**Purpose:** Generate the ExcelTech-format candidate profile document that the TL sends to clients.

**Inputs:**
- `candidate_id` (fully enriched: CV + all 8 fields + screening notes)
- `requirement_id` (→ client, format preference)
- `client_template` (some clients want specific layouts)

**Outputs:**
- A formatted document (Markdown → HTML → PDF pipeline, or direct DOCX for clients that need it)
- Stored in Supabase Storage with a reference URL
- Populated into the TL's Submission Queue

**Runs:** automatically when a candidate reaches the "ready for submission" status.

**Model:** Haiku 4.5. This is mostly transformation, not reasoning.

**Rules:**
- Never invents data. If a field is empty, leave it empty (or mark "Not provided").
- Matches the exact table structure the TL has used historically — consistency matters to clients.

## Sourcing agent
**Purpose:** Search external portals for candidates matching a requirement.

**Inputs:**
- `requirement_id`
- `channel` (`foundit` | `mycareersfuture` | `internal_db`)
- `account_slot` (for Foundit: which of the 3 shared accounts to use — rotation logic)

**Outputs:**
- List of candidate records (CVs pulled, parsed, stored in Supabase)
- Deduped against existing candidates
- Initial match score from the Screener agent

**Runs:** on-demand when a requirement is published; can be re-run by recruiters.

**Model:** Haiku 4.5 for query construction, Sonnet 4 if using reasoning to refine search terms from an unclear JD.

**Rules:**
- **Never scrapes LinkedIn.** That's a hard rule. If a user asks, decline and explain.
- **Respect Foundit account rotation** — if one account is rate-limited, move to the next. See [[Atlas/Product/Sourcing-Channels]].
- **Honour Firecrawl credit caps.** Configurable per-day spend limit. If breached, pause and alert.
- **MyCareersFuture is public API** — use it freely, no scraping constraints.

## How the agents chain together
Individual agents are just functions. The **skills layer** is where they get chained into end-to-end workflows. See [[Atlas/Product/Skills]].

## Related
- [[Atlas/Product/Skills]]
- [[Atlas/Product/Architecture]]
- [[Atlas/Product/Sourcing-Channels]]
- [[Atlas/Product/Tech-Stack]]
- [[Atlas/Concepts/Agents-vs-Tools]]
