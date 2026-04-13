---
type: wiki-concept
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
updated: 2026-04-14
tags: [gtm, landing-pages, analytics, ab-testing, tools, workflow, agents, design]
---

# AI GTM Stack

## What it is

A fully AI-native go-to-market pipeline that takes a business idea from raw concept to live, analytically-optimised landing page — without a designer, developer, or traditional SaaS dashboard. Demonstrated by Amir (Humbalytics) and consists of three tools connected through Claude Code.

## The three layers

**1. Idea Browser (context + strategy)**
Connects to Claude Code as an MCP. Stores ICP positioning, offer definition, talk tracks, competitive positioning, and growth strategy as structured files. Has built-in skills for common GTM tasks (lead magnet generation, landing page architecture). The key pattern: business context lives in Idea Browser → Claude always has it → every session builds on what came before rather than starting from scratch.

**2. Paper (design)**
Design-to-code intermediary. Build layout iterations directly in a visual interface, connected to Claude Code. When a design direction is confirmed, Claude ports it to working code. Better than prompting directly in code because: you can try multiple layouts visually, designers can make tweaks without going back to the terminal, and you maintain design consistency without a Figma handoff workflow. Figma has a bidirectional MCP now but Paper's experience is currently smoother.

**3. Humbalytics (analytics + experimentation)**
Analytics platform with a Claude-accessible API. Key capabilities: full attribution tracking (visits, scroll depth, click heatmaps, form submissions, paid ad sources), and AB experiments that update page content dynamically without deploying code. Claude hits the Humbalytics API to pull recommendations, run experiments, and report back — all in a single agent session.

## The workflow

```
Idea Browser MCP
  ↓ (project context, ICP, offer)
Claude Code + Lead Magnet / Landing Page skill
  ↓ (builds initial page)
Paper
  ↓ (visual iterations, design system, reference components)
Claude Code
  ↓ (ports refined design to code, pushes live)
Humbalytics API
  ↓ (tracks conversions, suggests headline variants)
AB experiment running
  ↓ (dynamic content swap, no deploy needed)
Data → back to Idea Browser for context
```

## Design system approach

The consistency layer: take screenshots of sites you like → ask Claude to "extrapolate key design elements and create a design system" → save that file → reference it in every future session when creating components. Prevents drift toward generic output across sessions.

UI component libraries (Tail Arc, Shadcn, etc.) serve as the raw material: find a component you like → screenshot → drop into Claude with "install this, use it for X section."

Prompting constraint for quality: **"Keep it subtle."** Used when requesting animations, layout refinements, design changes. More effective than "improve the design" because it constrains the interpretation space and produces coherent output.

## The autonomous CRO agent

The full autonomous version of this stack (run at Humbalytics internally):
- Google Ads API + Meta Ads API connected to Claude
- Three Claude skills: paid media manager, CRO optimizer, funnel report
- Humbalytics endpoint: scrapes live site via Firecrawl, pulls all analytics, generates specific recommendations
- Claude executes experiments, tracks results, updates Idea Browser context
- Runs as a weekly scheduled task (cron job via Claude Code)

Requires custom code website (not Webflow or Framer) because agents need direct file access to update the CMS. The site becomes an agent-operated system rather than a human-operated SaaS.

## Why custom code > Webflow/Framer

Webflow and Framer are closed enough that agents can't: directly modify content programmatically, run cron jobs, connect arbitrary MCPs, or treat the site as an agent-accessible API. Custom code + Claude Code means the agent IS the CMS — content updates, A/B tests, and new page variants happen in the terminal without touching a UI.

## Relevance to Niksho

The Idea Browser pattern maps directly to our vault architecture. Our `mi.md` + `Home.md` + `Efforts/` files serve the same function — persistent business context available to Claude every session. The difference is ours is in Obsidian; theirs is in a dedicated product. Either way, the principle is identical: give the agent compounding context.

For ExcelTech's outreach optimisation (post-MVP): the autonomous CRO agent concept applies to sequence optimisation. Connect Instantly/Apollo analytics → Claude → paid media manager skill → run variant tests on subject lines or CTAs. Same pattern, different domain.

For the Niksho SaaS product: when we reach the marketing site phase, this is the stack to build on. Not Webflow. Custom code from day one.

## Related

- [[Wiki/concepts/Agent-Traffic-Arbitrage]] — the broader thesis about why this stack matters now
- [[Wiki/tools/Idea-Browser]] — context management layer
- [[Wiki/tools/Paper-Design]] — design layer
- [[Wiki/tools/Humbalytics]] — analytics + experimentation layer
- [[Wiki/digests/YT-AI-GTM-Stack-2026-04-14]] — source video
- [[Wiki/digests/YT-Elite-Websites-Claude-Code-2026-04-14]] — complementary: 7 levels of design quality
- [[Wiki/concepts/Scale-for-Productivity]] — the sub-agent scaling pattern mirrors the autonomous CRO agent
- [[Efforts/Niksho-SaaS-Product/Overview]] — this stack is the blueprint for our own GTM
- [[Efforts/ExcelTech-Automation/Overview]] — CRO agent concept maps to outreach optimisation
