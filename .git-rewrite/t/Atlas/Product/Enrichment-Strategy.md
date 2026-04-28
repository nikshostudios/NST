---
type: atlas-note
area: Product
updated: 2026-04-14
generated-by: claude-opus-4-6
sources: ["[[Atlas/Product/Sourcing-Channels]]"]
---

# Product — Enrichment Strategy

> How we get contact details (phone, email) for sourced candidates.
> Decision record: [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-phone-first-enrichment]]

## Core principle: Phone-first, email is a bonus

Indian and Singaporean recruiters reach candidates via WhatsApp, not email. The enrichment pipeline reflects that reality.

## The waterfall

```
Candidate arrives from any sourcing channel
    │
    ├── Already has phone number? (from Foundit Profile API / Apollo)
    │   └── YES → Done. Recruiter WhatsApps them. Skip email enrichment.
    │
    ├── No phone? → Lusha lookup (primary phone enrichment)
    │   └── Found phone? → Done.
    │
    ├── No phone from Lusha? → Apollo enrichment lookup
    │   └── Found phone? → Done.
    │
    └── No phone anywhere? → Hunter.io (email only, last resort)
        └── Found email? → Route to automated Outreach Agent (Outlook)
        └── Nothing? → Flag for manual recruiter action
```

## What each tool does

**Foundit Candidate Profile API** — first source of contact data for Foundit-sourced candidates. Returns structured `email` and `mobile_details` fields. Called after screening (only for passing candidates). See [[Atlas/Product/Foundit-EDGE-Integration]].

**Apollo.io** — both a discovery engine (search for passive candidates) and an enrichment tool. Returns verified direct emails and sometimes phone numbers. Already live in `sourcing.py`. $49-99/month.

**Lusha** — purpose-built phone number enrichment. 100M+ profiles. Primary enrichment tool when Foundit/Apollo don't have the phone. Not yet implemented. $49/month (Pro tier).

**Hunter.io** — email finder and verifier. 107M+ addresses. Only used as a last resort or when a recruiter clicks "Find Email" for mass email campaigns. Not the default path. $49/month.

## Two outreach paths

**Phone-first path (majority of candidates):**
Candidate has phone → recruiter manually WhatsApps → human touch, personal connection. This is how ExcelTech works today and matches the market norm.

**Email path (automated, minority):**
Candidate has email but no phone (or recruiter triggers mass outreach) → Outreach Agent drafts personalized email → stages in Outlook → recruiter reviews → sends. Follow-up Agent handles inbox scanning and response processing.

## When to revisit this strategy

Track the metric: **what % of sourced candidates come with phone vs phone-only vs email-only vs nothing?** If >40% of candidates have no phone and require email outreach, reconsider making Hunter.io a default step rather than last resort.

## Cost summary

| Tool | Monthly cost | Credits/mo | Role |
|------|-------------|------------|------|
| Foundit Profile API | Included in subscription | — | Primary contact data for Foundit candidates |
| Apollo.io | $49-99 | 300-600 | Discovery + enrichment (already live) |
| Lusha | $49 (Pro) | 480 | Phone enrichment (to implement) |
| Hunter.io | $49 | 500 | Email last resort (to implement) |

## Related

- [[Atlas/Product/Foundit-EDGE-Integration]] — how Foundit provides contact data
- [[Atlas/Product/Sourcing-Channels]] — which channels provide what data
- [[Efforts/Niksho-SaaS-Product/decisions/2026-04-13-phone-first-enrichment]] — the decision record
- [[Atlas/Product/Agents]] — Outreach Agent handles email path

---
*Template: Atlas note · Home: [[Home]]*
