---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
video: "3 MCPs, 2 AI tools to make $$ in the AI era"
tab: 7
date: 2026-04-14
updated: 2026-04-14
tags: [gtm, landing-pages, analytics, ab-testing, design, agents, arbitrage, mcp, tools]
speakers: [Amir (Humbalytics), Jordan (Idea Browser host)]
---

# 3 MCPs, 2 AI Tools to Make Money in the AI Era

Source: Tab 7 of [[Raw/transcripts/YT-Transcripts-2026-04-14]]

## Core argument

There's a full AI-native GTM stack that takes you from raw idea to live landing page to AB-tested conversions — without touching a designer, developer, or traditional SaaS dashboard. The stack is Idea Browser (context + strategy) → Paper (design) → Humbalytics (analytics + experiments), all connected through Claude Code. The people who know this stack right now have an arbitrage window before everyone else catches up.

## The full stack

**Idea Browser MCP** — connects your business idea context directly to Claude Code. Stores ICP positioning, offer definition, talk tracks, competitive positioning, and growth strategy as files. Has built-in skills like "lead magnet legend" and "landing page architect." The unlock: instead of starting from scratch every session, Claude always has the full business context to work from. Also has an activity streak to keep building on the idea over time.

**Paper** — the missing link between design and code. Previously: designers made static Figma assets → hand off to engineers. Now: build design iterations directly in Paper → connected to Claude Code → push to code. Lets you try different layouts, drop in reference components, and iterate without going back to the terminal. Good for non-designers who want to tweak without prompting. Figma just launched a bidirectional MCP (design ↔ code) but Paper's experience is currently smoother.

**Humbalytics** — analytics + AB testing that Claude can operate via API. Key capability: run experiments that dynamically update page content without deploying code. Tracks visitors, scroll depth, click heatmaps, form submissions, full funnel attribution, paid ad attribution (Meta + Google). The experiment engine pushes variant copy to the page in real-time and tracks which headline converts better — no developer needed to push a branch.

**Tail Arc (Tail Pro)** — UI component library. Use it as reference: find a component you like, screenshot it, drop into Claude with "install this component and use it for X section." Faster than building from scratch, better than generic vibe-coded output.

## The design approach

Take reference screenshots from sites you like → ask Claude to "extrapolate the key design elements and help me create a design system." That design system becomes the consistency layer for all future sessions: "use design style guide as basis when creating new components."

On prompting for design: be specific about constraints. "Improve the design" is too broad. "Work on refining the design. Make sure you have consistent layouts and themes. Keep it subtle enough to make sure there's cohesiveness across the entire page" gets far better results. The word **subtle** is intentional — it acts as a guardrail against over-animation and generic output.

## The autonomous CRO agent

Humbalytics runs an internal autonomous agent that:
1. Connects Google Ads + Meta Ads via API
2. Has three Claude skills: paid media manager (pulls data), CRO optimizer (runs AB tests), funnel report (Stripe + Chartmogul + other tools)
3. Humbalytics endpoint scrapes the live site via Firecrawl, pulls analytics, and gives specific recommendations
4. Claude executes the experiment — pushes variants, tracks results, reports back
5. Scheduled as a weekly cron job directly in Claude Code

This is why they migrated from Webflow → Framer → custom code. Custom code lets Claude be the CMS. Webflow and Framer don't give enough access for agents to run this autonomously.

## The bigger thesis

> "More agents are going to actually visit websites than humans."

Gartner research: 20% of internet commerce by 2030 will be agents (agents buying things on behalf of humans). The multiplier effect: one person running 5 sub-agents generates more traffic than 5 individual humans. This creates pressure to build agent-friendly websites (markdown-accessible, API-exposed endpoints, agent-optimised content) rather than just human-friendly ones.

Websites as agent infrastructure: Firecrawl's scraping endpoint gives agents the data they need. Claude Code's automated tasks (cron jobs) let agents operate on websites on schedules without human initiation.

The arbitrage window: "99.999% of people don't know this stack exists." Like Facebook ads at 5 cents a click before everyone discovered it. The opportunity is to use this stack now — for your own business, or as a managed service ($5-20K/month) for clients who want paid ad management + CRO without hiring a team. See [[Wiki/concepts/Agent-Traffic-Arbitrage]].

## Relevance to Niksho

Direct applications:

1. **The Idea Browser pattern for ExcelTech** — we don't have a dedicated context file per project the way Idea Browser structures it. Our `mi.md` + `Home.md` play a similar role, but we could add an `ExcelTech/offer-definition.md` with ICP, transformation, competitive positioning that Claude always has available. Same idea, our own vault structure.

2. **Paper for the Niksho SaaS product** — Phase D of the SaaS product involves building the client-facing UI. Paper (or Figma's bidirectional MCP) could be the design layer instead of prompting in code and guessing. Worth evaluating when we get to that phase. See [[Efforts/Niksho-SaaS-Product/Overview]].

3. **Humbalytics-style analytics for ExcelTech** — we have no AB testing or conversion tracking for the outreach sequences right now. The CRO agent concept (skill that pulls performance data → gives recommendations → executes experiments) maps directly to ExcelTech's outreach optimisation. Not immediate priority but worth noting for post-MVP.

4. **The managed service opportunity** — Niksho is a B2B SaaS but we also do consulting for ExcelTech clients. This stack (AI-powered paid ads + landing page optimisation + CRO) is a service that barely exists in India's recruiting-tech market. Separate business idea, file for later.

5. **Agent-friendly website design** — when the Niksho SaaS product website gets built, design it for agent consumption from day one (llms.txt, API-accessible content, markdown endpoints).

## See also

- [[Wiki/concepts/Agent-Traffic-Arbitrage]] — the thesis that agents will outnumber humans on websites, and the early-mover opportunity
- [[Wiki/concepts/AI-GTM-Stack]] — the Idea Browser → Paper → Humbalytics pipeline as a reusable framework
- [[Wiki/tools/Idea-Browser]] — context management MCP
- [[Wiki/tools/Paper-Design]] — design-to-code intermediary
- [[Wiki/tools/Humbalytics]] — analytics + AB testing connected to Claude
- [[Wiki/digests/YT-Elite-Websites-Claude-Code-2026-04-14]] — complementary: the 7 levels of web design quality
- [[Wiki/digests/YT-Strategic-AI-Coding-2026-04-14]] — prompting discipline (being specific, constraints like "subtle")
- [[Wiki/concepts/Scale-for-Productivity]] — the autonomous agent stack mirrors the 1-agent-then-sub-agents progression
- [[Efforts/Niksho-SaaS-Product/Overview]] — Paper and agent-friendly design are relevant to Phase D
- [[Efforts/ExcelTech-Automation/Overview]] — CRO agent concept maps to outreach optimisation
