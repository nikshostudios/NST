---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/docs/Beroz-Frontend-Planning-2026-04-17]]"]
date: 2026-04-17
updated: 2026-04-17
tags: [outreach, deliverability, browser-extension, juicebox, product-strategy, gmail, outlook]
---

# Personal-Inbox Outreach Tracking

## What it is

A product pattern in which a recruiter (or salesperson, or anyone doing outbound) keeps sending email from their **own** Gmail or Outlook account, while a **browser extension** sitting on top of the inbox detects the outbound message and logs it back to the recruitment platform — together with downstream events: replies, opens, follow-ups. The platform never holds the SMTP credential and never proxies the send. Juicebox (juicebox.ai) is the canonical reference implementation in the recruiting space.

The opposite model — what Beroz currently does — is **platform-inbox outreach**: the platform composes the email, the recruiter clicks send inside the platform UI, the platform handles delivery via MS Graph or Gmail API or its own SMTP, and the conversation thread is rebuilt inside the platform from API events.

## The choice this concept is really about

Every outbound product eventually has to pick one of three:

1. **Platform-inbox** — all outreach flows through the product. Cleanest data, worst deliverability (your domain, no warm history), replies land in the platform inbox view (familiar to nobody).
2. **Personal-inbox + extension** — recruiter sends from their own inbox, extension logs activity back. Best deliverability (the recruiter's warmed-up domain), replies land in the recruiter's familiar inbox, but you now own and ship a Chrome/Edge/Firefox extension and an Outlook add-in, with all the store-review and policy risk that entails.
3. **Personal-inbox + IMAP/Graph polling** — same end result as (2) without an extension; the platform polls the recruiter's mailbox for the relevant threads. Cheaper to ship, but loses the live "send detected" event and adds latency. ExcelTech currently uses this for inbox scanning.

(2) is what Juicebox bet on. (1) is what Beroz ships today. (3) is what we already do for inbound and could extend for outbound classification.

## Why it matters

**Deliverability is the hidden moat in outbound tools.** A new product domain has zero warm history — emails sent from `outreach.beroznew.com` land in spam at 5–10× the rate of emails from `recruiter@yourcompany.com`. The recruiter's personal inbox has years of legitimate sending history; the platform's domain has none. For a SaaS recruitment product whose only job is to put a candidate in front of a real recruiter, losing 30% of the first-touch volume to spam is a fatal product issue.

**Reply experience is where platform-inbox tools die.** Recruiters are not going to switch to a new inbox UI to read candidate replies. If replies land in the platform but the recruiter reads them in Outlook anyway, the platform's data is incomplete and the recruiter's experience is split-brain. The personal-inbox model avoids this whole class of problem.

**The extension is the toll booth.** Owning the extension is owning the touchpoint. Every email surface — Gmail web, Outlook web, Outlook desktop add-in — is a place to inject status badges ("you've already contacted this candidate"), one-click actions ("log to project"), and quiet AI features ("draft reply with context"). It's also the only way to capture *opens* without a tracking pixel that pings your domain.

## The trade-offs (concrete)

| Dimension | Platform-inbox (Beroz today) | Personal-inbox + extension (Juicebox) |
|---|---|---|
| **Deliverability** | Cold domain, low warm history | Recruiter's warmed inbox |
| **Reply UX** | Replies in platform UI (unfamiliar) | Replies in recruiter's normal inbox |
| **Build cost** | One backend integration | One backend + 2–3 extension surfaces (Chrome, Edge, Outlook add-in) |
| **Maintenance** | Single deploy target | Extension store reviews; Gmail/Outlook DOM changes break things |
| **Activity capture** | Native — every send is a DB write | Event-driven via extension; needs reconciliation |
| **Compliance / consent** | Platform owns the send, easy to audit | Extension reads inbox content, needs explicit user consent + privacy policy review |
| **Data completeness** | Always know what was sent | Depends on the extension being installed and active |
| **Lock-in for the recruiter** | Low — they can switch tools tomorrow | High — once the extension is part of their inbox, switching costs go up |

## Relevance to Niksho

This is one of the [[Efforts/Niksho-SaaS-Product/Overview#Open questions|open product strategy questions]] for the SaaS product, surfaced as a deferred TODO in [[Wiki/digests/Session-Beroz-Frontend-Planning-2026-04-17]]. Beroz today is platform-inbox: the [[Atlas/Product/Agents|Outreach agent]] composes drafts inside the platform and the recruiter clicks send within the UI. This works for a single-tenant ExcelTech instance where MS Graph is already wired up to known recruiter mailboxes. It scales much less well for the SaaS multi-tenant case, where every new agency brings cold sending domains, unknown ESP relationships, and a recruiter base that already has years of personal-inbox habits.

**Realistic recommendation:** keep platform-inbox as the default in v1 (lower build cost, faster to multi-tenant pilot), but design the data model so an extension-based send-and-log path can be added later without a schema rewrite. Specifically: the `outreach_event` table should accept an event source (`platform | extension | imap_scan`) and not assume the platform was the originator. This is a cheap forward-compatibility change today and a very expensive retrofit later.

**When to actually build the extension:** when one of the pilot agencies tells us their deliverability is bad, OR when a competitor (Juicebox, an X0PA add-on, anyone) wins a deal we should have won because they had this and we didn't. Not before. Building two browser extensions and an Outlook add-in is a 6–10 week project that pulls a senior engineer off the core product.

## Related
- [[Wiki/digests/Session-Beroz-Frontend-Planning-2026-04-17]] — the planning session where this came up
- [[Wiki/digests/Session-Juicebox-Teardown-2026-04-15]] — the competitor that ships this pattern
- [[Wiki/competitors/X0PA-AI]] — competitor without this capability today (positioning gap)
- [[Atlas/Product/Agents]] — current Outreach agent design (platform-inbox)
- [[Efforts/Niksho-SaaS-Product/Overview]] — parent effort with the open strategy question
- [[Efforts/ExcelTech-Automation/Overview]] — the proving ground that currently uses platform-inbox + IMAP scan
