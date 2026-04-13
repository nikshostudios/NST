---
type: decision
date: 2026-04-13
effort: Niksho-SaaS-Product
owners: Nikhil & Shoham
status: decided
generated-by: claude-opus-4-6
---

# Decision — Phone-First Enrichment, Email as Last Resort

## Context

When the Sourcing Agent finds a candidate, we often don't have their contact details (especially from Foundit search results, which don't include structured email/phone in the search response). We need an enrichment strategy to get recruiter-useful contact data.

The question: what tool do we prioritize — email finders or phone finders?

## Options considered

### Option A — Email-first (Hunter.io primary)
- Pros: Email feeds directly into the automated Outreach Agent (Outlook drafts → review → send → follow-up → inbox scan). Fully automated pipeline.
- Cons: Doesn't match how Indian/SG recruiters actually work. WhatsApp is the dominant channel. Email open rates for cold recruitment outreach are 15-25%. Phone/WhatsApp response rates are 60%+.

### Option B — Phone-first (Lusha primary, Hunter.io last resort)
- Pros: Matches reality — ExcelTech recruiters reach candidates via WhatsApp. Higher response rates. Faster time-to-conversation.
- Cons: Phone-only candidates bypass the automated Outreach Agent pipeline entirely. Recruiter handles outreach manually via WhatsApp.

### Option C — Always enrich both (Lusha + Hunter.io for every candidate)
- Pros: Maximum data. Both paths available.
- Cons: Double the enrichment cost. Unnecessary — if you have a phone number, the email adds marginal value for Indian/SG recruitment.

## Decision

**We chose: Option B — phone-first.**

Waterfall: Foundit Profile API → Lusha → Apollo → Hunter.io (last resort).

If we already have a phone number from any source, skip all remaining enrichment. Hunter.io only fires when a recruiter manually clicks "Find Email" for mass email campaigns.

## Why

Nikhil's reasoning: "That matches how ExcelTech works today. MVP should reflect reality, not aspirational workflow." Indian and Singaporean recruiters live on WhatsApp. Building an email-first pipeline would be solving a problem that doesn't exist.

## What we're giving up by choosing this

The automated end-to-end pipeline (draft email → send → track responses → follow up) only works for candidates with email. Phone-only candidates require manual recruiter action. We accept this because the manual action (WhatsApp message) is faster and more effective than the automated action (cold email) anyway.

## Reversibility

- [x] Easy to reverse (< 1 day)

Adding Hunter.io as a default enrichment step later is trivial. It's an API call.

## How we'll know if this was wrong

Track: **% of sourced candidates with phone vs email-only vs nothing.** If >40% of candidates end up with no phone and need email-only outreach, reconsider making Hunter.io a default step.

## Linked notes

- Effort: [[Efforts/Niksho-SaaS-Product/Overview]]
- Atlas: [[Atlas/Product/Enrichment-Strategy]]
- Atlas: [[Atlas/Product/Sourcing-Channels]]

---
*Template: [[Templates/Decision]] · Home: [[Home]]*
