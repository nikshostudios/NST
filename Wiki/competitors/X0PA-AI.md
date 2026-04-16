---
type: wiki-competitor
generated-by: claude
company: X0PA AI
url: https://x0pa.com
hq: Singapore
founded: 2017
sources:
  - "[[Raw/docs/X0PA-AI-Recruiter-Features-2026-04-17]]"
updated: 2026-04-17
tags: [competitor, recruitment-ai, singapore, assessment, screening]
---

# X0PA AI

Singapore-based AI recruitment platform (est. 2017). Three products: AI Recruiter (core ATS with AI scoring), X0PA ROOM (video interviews and assessments), and two agentic AI features (Zeus for interview intelligence, Ruby for candidate engagement). Trusted by Singapore government; uses the AI Verify framework for fairness testing. Pricing reportedly $28K–$110K/year depending on seats and company size.

## What they do well

X0PA's strength is on the **assessment and scoring side** — they have four distinct AI scoring models (Suitability, BRIQ, Persona Fit, and a configurable meta-model with adjustable weightages). The DISC personality matching, work style fit scoring, and 7-trait behavioural assessment go deeper than most competitors into candidate-role alignment. Their Bias Checker and AI Verify compliance are strong selling points for government and enterprise clients in Singapore.

The platform is broad: 29 features across job creation, screening, sourcing, automation, assessment, analytics, and integrations (35+ ATS, 50+ HRMS, enterprise systems like Workday/SAP/Oracle). Multi-language support (72+ languages) and white-label career sites make it enterprise-ready.

Their candidate sourcing claims 250M+ passive candidates with guaranteed LinkedIn links — similar to Juicebox/hireEZ's global database approach.

## Where they overlap with Niksho

- AI-powered candidate screening and scoring
- Recruitment process automation (they claim 90% workflow automation)
- Pre-screening questions with auto-shortlisting/rejecting
- CV parsing (their Lotus parser supports 72+ languages, 95% accuracy)
- Interview scheduling automation
- Singapore market presence
- Candidate re-targeting from past applicant pool

## Where Niksho differs

**Niksho's advantages:**

- **End-to-end recruiter workflow automation.** X0PA automates individual stages (screening, scheduling, sourcing) but the recruiter still stitches them together. Niksho's pipeline runs sourcing → screening → outreach → follow-up → submission formatting as a single autonomous flow.
- **Job portal integration.** Niksho pulls candidates directly from Foundit, MyCareersFuture, and Apollo — the portals recruiters at agencies actually use daily. X0PA's sourcing is from their own 250M passive candidate database, not from the job portals. For agencies that live on Foundit/MCF, this is a fundamental difference.
- **Outreach and follow-up automation.** X0PA has no visible outreach or email follow-up agents. Their "Ruby" chatbot handles candidate queries on the career site, not proactive recruiter-to-candidate outreach via email. Niksho's Outreach Agent + Follow-up Agent + inbox monitoring loop is a capability X0PA doesn't appear to have.
- **Submission formatting.** Niksho's Formatter Agent auto-generates client-ready .docx profiles. X0PA has offer letter generation but no submission formatting for agency-to-client delivery.
- **Agency-first pricing.** X0PA's $28K–$110K/year pricing targets mid-to-enterprise companies. Niksho's per-tenant model with cost controls is designed for 5–20 person agencies that can't justify that spend.
- **Owned stack.** Niksho owns the agent logic and model routing (Sonnet for reasoning, Haiku for classification). X0PA's AI is a black box — the customer can toggle weightages but not the underlying model.

**X0PA's advantages over Niksho:**

- **Assessment depth.** DISC personality profiling, work style fit, persona matching, hybrid video assessments, 30+ evaluation metrics on video responses. Niksho has no assessment layer — the focus is on sourcing and operations, not candidate evaluation beyond screening scores.
- **Enterprise integrations.** 35+ ATS, 50+ HRMS, Workday/SAP/Oracle, SAML/SSO, API/SFTP. Niksho's integration story is early — ExcelTech is the only live deployment.
- **Video interviews (X0PA ROOM).** A full video assessment platform with transcript analysis, integrity monitoring, and auto-evaluation. Niksho has nothing in this space.
- **Compliance and bias tooling.** AI Verify framework, bias checker, GDPR compliance, fairness testing. Niksho hasn't built compliance tooling yet (noted as Phase 3 / funding prep in the roadmap).
- **White-label and career sites.** X0PA offers branded career sites with custom domains. Niksho's SaaS product doesn't include this yet.
- **Candidate re-targeting.** X0PA automatically matches past applicants to new roles. Niksho doesn't have a re-targeting feature (though the Supabase candidate pool could support it).
- **Multi-language.** 72+ languages across all features. Niksho is English-only for now.
- **Maturity.** Founded 2017, Singapore government clients, recognised by Singapore Business Review. Niksho is pre-revenue.

## Strategic takeaway

X0PA is wide but not deep on the operational side. They've built a comprehensive platform with strong assessment, compliance, and enterprise integration — the features that win RFPs and government contracts. But they haven't solved the **recruiter's daily grind**: the sourcing-from-portals → outreach → follow-up → format → submit loop that eats 6–8 hours a day at an agency like ExcelTech.

Niksho doesn't compete on assessment, compliance, or enterprise integrations — and shouldn't try to. The positioning is: X0PA helps you **evaluate** candidates better; Niksho helps you **find, contact, and deliver** candidates faster. They're complementary more than directly competitive at this stage. The overlap grows if either side expands scope.

For GTM: if a prospect says "we already use X0PA," the response is "great — we do the part X0PA doesn't: autonomous sourcing from Foundit/MCF, outreach sequences, inbox monitoring, and client submission formatting. Your recruiters still spend hours on that even with X0PA."

## Related

- [[Efforts/Niksho-SaaS-Product/Overview]] — the SaaS product this competitor analysis informs
- [[Atlas/Business-Model/Phase-2-GTM]] — go-to-market strategy
- [[Atlas/Product/Sourcing-Channels]] — Niksho's sourcing stack (the key differentiator)
- [[Wiki/concepts/Search-First-SaaS-UI]] — UI pattern both products use
- [[Raw/docs/X0PA-AI-Recruiter-Features-2026-04-17]] — full feature extraction from the sales deck
