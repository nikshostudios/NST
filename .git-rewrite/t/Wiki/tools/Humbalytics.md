---
type: wiki-tool
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]"]
updated: 2026-04-14
tags: [tools, analytics, ab-testing, cro, mcp, claude-code]
---

# Humbalytics

## What it is

An analytics and AB testing platform designed to be operated by Claude via API. Tracks visitors, scroll depth, click heatmaps, form submissions, paid ad attribution (Meta + Google), and full conversion funnels. Runs AB experiments that dynamically update page content without pushing code.

## Key capability

The experiment engine: Claude hits a Humbalytics API endpoint with a variant suggestion → the page updates dynamically without a deploy → conversions are tracked per variant. No developer, no branch, no deployment pipeline.

Also has a recommendations endpoint: scrapes the live site via Firecrawl, pulls all analytics data, and returns specific optimisation suggestions Claude can act on directly.

## How it's used autonomously

Humbalytics runs an internal autonomous CRO agent: Claude Code skills (paid media manager, CRO optimizer, funnel report) + Humbalytics API + Google/Meta Ads API. Runs as a weekly cron job. The agent pulls performance data, generates AB test recommendations, executes experiments, and reports results — without a human in the loop.

Requires a custom code website (not Webflow/Framer) to give agents full file-level access.

## Where it fits

Part of the [[Wiki/concepts/AI-GTM-Stack]]. Layer 3 (analytics + experimentation) of the Idea Browser → Paper → Humbalytics pipeline.

## Pricing / access

Has an API with documentation. Skills available (Amir mentioned sharing a link). Free tier likely exists given it was demoed in a public video.

## Related

- [[Wiki/tools/Idea-Browser]] — context layer in the same stack
- [[Wiki/tools/Paper-Design]] — design layer in the same stack
- [[Wiki/concepts/AI-GTM-Stack]] — the full pipeline
- [[Wiki/concepts/Agent-Traffic-Arbitrage]] — why investing in this stack matters now
- [[Wiki/digests/YT-AI-GTM-Stack-2026-04-14]] — source video
- [[Wiki/tools/Firecrawl]] — used internally by Humbalytics to scrape sites for recommendations
