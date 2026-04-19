---
type: wiki-technique
generated-by: claude
sources:
  - "[[Raw/docs/Beroz-Session-2026-04-19]]"
updated: 2026-04-19
tags: [supabase, sql, migrations, infra, devops]
---

# One-Command SQL Migration

## What it is

A Python helper script (`apply_schema.py`) that runs any `.sql` file against a Supabase project via the Management API, authenticated with a Personal Access Token (PAT). Invocation:

```bash
python backend/ai_agents/data/apply_schema.py path/to/migration.sql
```

The script reads the SQL file, POSTs it to the Supabase Management API endpoint for the target project, and reports success or failure. No browser, no copy-paste, no dashboard.

## Why it matters

The standard Supabase Python client (`supabase-py`) has no DDL support — you can't run `CREATE TABLE` or `ALTER TABLE` via the client SDK. Before this helper, every schema change required opening the Supabase Dashboard, navigating to the SQL Editor, pasting the migration, and clicking Run. This was slow, error-prone (easy to run the wrong version or forget to run it at all), and left no audit trail in version control. With `apply_schema.py`, migrations are `.sql` files committed alongside the code that uses them — the migration and the application change are in the same PR.

## How to apply

Use whenever a schema change is needed:
1. Write the migration as a `.sql` file in `backend/ai_agents/data/`.
2. Run `apply_schema.py` against the target Supabase project (staging or prod).
3. Commit both the `.sql` file and the code change that depends on it in the same commit.

Note: the PAT must have `database:write` permission on the Supabase project. Keep it in `.env`, never commit it.

First use (April 2026): applied `phase3_shortlists_notes.sql` to create `candidate_shortlists` and `candidate_notes`, which were missing from production and causing PGRST205 500s on the Shortlist page.

## Relevance to Niksho

This removes the last purely manual step from the Beroz deployment workflow. All code changes + schema changes can now be reviewed in a single PR, applied from the command line, and rolled back by running the inverse migration. As Beroz scales to more recruiters and the schema evolves, this helper prevents the "did you remember to apply the migration?" class of production incidents. The same pattern applies to the future Niksho SaaS product on Supabase.

## Related
- [[Wiki/digests/Session-Beroz-Sequences-DB-Cleanup-2026-04-19]] — session where this was built and first used
- [[Efforts/ExcelTech-Automation/Overview]] — the deployment context
- [[Wiki/techniques/Auto-Git-Pull-Hook]] — adjacent infra improvement (keeps local in sync with GitHub)
