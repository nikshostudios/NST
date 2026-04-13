---
type: reference
generated-by: claude
updated: 2026-04-14
purpose: which MCP servers to keep connected per session type
---

# MCP Session Guide

Connect only what you need. Each MCP server costs ~18K tokens every turn just by existing. Disconnecting unused servers is the single biggest context savings you can make.

## Session types → servers needed

**Obsidian / knowledge work** (ingestion, wiki edits, vault maintenance)
- Keep: workspace (file tools), computer-use, Chrome (if browsing sources)
- Disconnect: Notion, Gmail, Canva, Apollo, Figma, Google Drive

**ExcelTech development** (coding, debugging, deployment)
- Keep: workspace, computer-use, Chrome
- Disconnect: Canva, Figma, Notion (unless syncing to Notion)
- Maybe: Apollo (if testing enrichment), Gmail (if testing outreach)

**Outreach / sales** (Apollo campaigns, email sequences, lead research)
- Keep: workspace, Apollo, Gmail, Chrome
- Disconnect: Canva, Figma, Notion

**Design / branding** (presentations, visual assets, Figma work)
- Keep: workspace, Canva, Figma, Chrome
- Disconnect: Apollo, Gmail, Notion

**Planning / project management** (status updates, Notion pages, meeting prep)
- Keep: workspace, Notion, Gmail, Google Drive, Chrome
- Disconnect: Canva, Figma, Apollo

**Research / browsing** (competitive analysis, market research, site teardowns)
- Keep: workspace, Chrome, computer-use
- Disconnect: Notion, Gmail, Canva, Apollo, Figma, Google Drive

## The math

| Servers connected | Approx overhead | Context left (of 200K) |
|---|---|---|
| All 6 user servers | ~58K | ~142K |
| 2-3 relevant ones | ~20-35K | ~165-180K |
| None (vault work only) | ~0K user MCP | ~200K |

System servers (cowork, workspace, scheduled-tasks, etc.) add ~14K and can't be disconnected.

## How to check

Run `/context` at any point to see current overhead. Look at the "MCP tools (deferred)" row — that's your total MCP cost.
