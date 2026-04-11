---
skill: ship-check
triggers: ["ship check", "pre-deploy check", "ready to deploy"]
reads: [Efforts/, Atlas/Product/, Raw/docs/ExcelTech_Pipeline_Developer_Reference.md]
writes: []
---

# Skill: Ship Check

## Purpose
A pre-deployment checklist against the relevant Effort. Run this before pushing anything live on Railway or Supabase. Catches the obvious foot-guns.

## Trigger
- User says "ship check", "pre-deploy", "ready to deploy X"

## Inputs
- What's being shipped (a feature, an agent, a schema change, a whole effort milestone)

## Steps

1. **Identify what's changing.** Which files/agents/tables? Which parts of the system does it touch?

2. **Run the checklist:**

   **Code & config**
   - [ ] Secrets are in env vars, not in code
   - [ ] Portal credentials are still encrypted in `portal_credentials` table, not plaintext
   - [ ] Agent prompts loaded at startup, not per-request
   - [ ] Token budgets respected (Haiku for classification, Sonnet for reasoning — per [[Atlas/Product/Tech-Stack]])
   - [ ] Microsoft Graph API rate-limit aware (token cached, 1-hour TTL)
   - [ ] Firecrawl credit cap respected (20 profile clicks per sourcing run)
   - [ ] APScheduler cron intervals sane (15 min for inbox scan)

   **Data**
   - [ ] Schema migrations tested on dry-run against Supabase staging
   - [ ] Backwards-compatible (existing candidate/requirement/submission rows still queryable)
   - [ ] No data loss path (nothing irreversibly dropped)
   - [ ] Status vocabulary matches the canonical list in [[Atlas/Product/Database-Schema]]

   **Agent behaviour**
   - [ ] Agent drafts email only — never auto-sends
   - [ ] Sourcing rotates Foundit accounts to avoid rate limits
   - [ ] SG market flags non-Singaporean candidates
   - [ ] India vs SG salary format respected (LPA vs SGD)
   - [ ] LinkedIn is not being scraped anywhere (search strings only)

   **Rollout**
   - [ ] Railway env vars updated
   - [ ] Supabase RLS policies still correct
   - [ ] At least one recruiter tested the flow end-to-end
   - [ ] Rollback path documented
   - [ ] Logs visible in `/logs/` folder

3. **Report** to the user as a checklist with each item marked ✅ / ❌ / ⚠️ (unknown). Do not say "ready to ship" unless every item is ✅ or explicitly waived by the user.

4. **Log the ship check** in the relevant Effort's Decisions.md if any waivers were granted.

## Rules & guardrails

- **Never skip a check silently.** If you can't verify something, mark it ⚠️ and say what evidence is needed.
- **Stop at blocking failures.** Credentials in plaintext, data-loss path, auto-send enabled → HARD STOP, escalate to the user.
