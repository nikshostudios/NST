---
type: wiki-digest
generated-by: claude
sources: ["[[Raw/transcripts/YT-Transcripts-2026-04-14]]", "[[Raw/clippings/context-audit-skill-bradley-bonanno]]", "[[Raw/docs/Claude-Code-Context-Cleanup-Guide.pdf]]"]
video: "I Stopped Hitting Claude Code Usage Limits (Here's How)"
tab: 6
date: 2026-04-14
updated: 2026-04-14
tags: [context-management, tokens, usage-limits, settings, mcp, claude-md, skills, optimization]
speaker: Bradley Bonanno
---

# I Stopped Hitting Claude Code Usage Limits (Here's How)

Source: Tab 6 of [[Raw/transcripts/YT-Transcripts-2026-04-14]]
Supporting: [[Raw/clippings/context-audit-skill-bradley-bonanno]] (the audit skill he references), [[Raw/docs/Claude-Code-Context-Cleanup-Guide.pdf]] (companion guide)

## Core argument

Usage limits aren't a subscription problem — they're a context hygiene problem. Every message in Claude Code rereads the entire conversation history, so message 30 costs 31x what message 1 costs. On top of that, CLAUDE.md files, MCP servers, and skills all preload into context on every session. The fix: systematically identify and remove invisible sources of context bloat, then adopt daily habits that keep it lean.

## The context bloat architecture

Here's what fills your context window before you even send a message:

```
┌─────────────────────────────────────────────────────┐
│                 CONTEXT WINDOW                       │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ System prompt + Tool definitions              │   │
│  │ (always present, ~base cost)                  │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │ MCP Servers (ALL tool defs loaded every turn) │   │
│  │ ~18,000 tokens EACH · 3 servers = 54K dead    │   │
│  │ weight before you type anything               │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │ CLAUDE.md / agent.md                          │   │
│  │ Loaded every turn · bloated = expensive        │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │ Skills metadata (name + description only)     │   │
│  │ ~50 tokens each · lightweight                  │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │ Conversation history                          │   │
│  │ COMPOUNDS: msg N costs N+1 × base             │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  His starting overhead: 50,000+ tokens               │
│  before sending a single message                     │
└─────────────────────────────────────────────────────┘
```

## Fix 1: MCP servers — the biggest offender

Each connected MCP server loads all of its tool definitions into context on every single message — not just when you call the tool. One server ≈ 18,000 tokens. Three servers = 54K+ tokens of dead weight every turn.

**The workflow:**

```
/mcp  →  list all connected servers
  │
  ├─ Not using it this session?  →  Disconnect it
  │
  └─ Using it but CLI exists?  →  Replace MCP with CLI
        │
        └─ CLI only costs tokens when Claude calls the command
           MCP costs tokens just by existing
           Expected savings: ~40%
```

He replaced Playwright MCP and Amplify with their CLI equivalents.

## Fix 2: CLAUDE.md — the Five-Filter Rule Audit

Every rule in your CLAUDE.md gets loaded into context at the start of every session and stays there. Three things to fix:

### 1. Check for contradictions
"Be concise" in one section + "always explain your reasoning in detail" in another = Claude can't satisfy both. It picks one randomly, you get inconsistent output, and you don't know why.

### 2. Cut rules that aren't earning their place

The **Five-Filter Audit** — ask each rule these questions:

```
Rule: "Always write clean code"
  │
  ├─ 1. DEFAULT?     Does Claude already do this without being told?
  │      → YES → CUT ✂️
  │
  ├─ 2. CONTRADICTION?  Does it conflict with another rule?
  │      → YES → CUT ✂️ (or reconcile)
  │
  ├─ 3. REDUNDANCY?  Is it already covered elsewhere?
  │      → YES → CUT ✂️
  │
  ├─ 4. BANDAID?     Was it added to fix one bad output?
  │      → YES → CUT ✂️
  │
  └─ 5. VAGUE?       Would Claude interpret it differently every time?
         ("be natural", "use a good tone")
         → YES → CUT ✂️
```

If a rule fails ANY of these five, cut it. Be ruthless — you can always add back later.

See [[Wiki/concepts/Five-Filter-Rule-Audit]] for the standalone concept.

### 3. Progressive disclosure in CLAUDE.md

This is the same principle from [[Wiki/concepts/Progressive-Disclosure]] applied to your project rules file:

```
BEFORE (5,000 token CLAUDE.md):
┌──────────────────────────────────┐
│ Style preferences                │
│ Project structure                │
│ API conventions (200 lines)      │ ← loaded every turn
│ Testing guidelines (150 lines)   │   even when working
│ Deployment steps (100 lines)     │   on the frontend
│ Development patterns (200 lines) │
└──────────────────────────────────┘

AFTER (~500 token core + reference files):
┌──────────────────────────────────┐
│ Style preferences                │
│ Project structure                │
│ "For API conventions,            │ ← one-line pointers
│  read api-standards.md"          │   Claude reads on demand
│ "For testing, read testing.md"   │
│ "For deploy, read deploy.md"     │
└──────────────────────────────────┘
     │           │           │
     ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│api-      │ │testing  │ │deploy   │
│standards │ │.md      │ │.md      │
│.md       │ │         │ │         │
│(200 ln)  │ │(150 ln) │ │(100 ln) │
└─────────┘ └─────────┘ └─────────┘
   Only loaded when Claude actually needs them
```

## Fix 3: Skills — same problem, same fix

Every installed skill loads its metadata into context. Verbose skills (400-800 lines from free marketplaces) burn context even when they're not triggered. Past a certain point, Claude starts ignoring rules because too much is competing for attention.

Apply the same five filters to skill instructions. Concise and short > detailed and verbose.

## Fix 4: Settings.json quick wins

Three settings most people never configure:

| Setting | Problem | Fix |
|---------|---------|-----|
| `autocompact_percentage_override` | Default compacts at ~83%, but quality degrades before that | Set to **75** — compaction triggers before quality drops |
| `BASH_MAX_OUTPUT_LENGTH` | Default is 30-50K chars. Anything beyond gets silently truncated. Claude then reruns the entire command = wasted tokens on retry | Set to **150,000** |
| `permissions.deny` | Claude reads everything: node_modules, dist, lock files, build artifacts | Add deny rules like .gitignore — block directories Claude doesn't need |

## Fix 5: Daily habits that compound

```
Session workflow:
                                        ┌──────────────┐
    ┌───────────────┐                   │ DON'T send a  │
    │ New task?      │──YES──→ /clear   │ correction.   │
    │ (unrelated to  │        (fresh    │ EDIT the bad  │
    │  current work) │        session)  │ prompt and    │
    └───────────────┘                   │ resubmit.     │
                                        └──────────────┘
    ┌───────────────┐
    │ Non-trivial    │──YES──→ Plan mode first
    │ task?          │        (clarify before writing)
    └───────────────┘

    ┌───────────────┐
    │ What model?    │──→  Sonnet: most coding
    │                │     Haiku: sub-agents, formatting, lookups
    │                │     Opus: deep architectural planning
    └───────────────┘
```

**Why editing > correcting:** Every follow-up message gets permanently added to conversation history. A correction means the bad response + your correction + the new response all sit in context, compounding on every future message. Editing replaces the bad exchange entirely — you save those tokens and don't pollute the session.

**Why /clear between tasks:** If you just finished a 20-message research session and now switch to script writing, every scripting message is still paying the tax of all that research history. Fresh session = fresh context. This one habit probably saves more tokens than anything else on the list.

## The context-audit skill

Bradley built a Claude skill that automates all of this: runs `/context` to see real overhead, audits each category, gives you a score out of 100, and tells you exactly what to cut. Then you can ask Claude to implement the fixes automatically — it splits CLAUDE.md, removes unnecessary skills, adds missing settings.

The skill is filed at [[Raw/clippings/context-audit-skill-bradley-bonanno]].

## Relevance to Niksho

This video is directly actionable for our Claude setup right now:

1. **Our CLAUDE.md is already thin** (it's a pointer file per [[Atlas/Concepts/File-over-AI]]) — that's good. But the files it points to (`mi.md`, `Home.md`, `vault-map.md`) get loaded when Claude reads them at session start. The progressive disclosure principle suggests making some of this on-demand instead of auto-loaded.
2. **MCP servers:** We have Notion, Gmail, Canva, Figma, Apollo, Google Drive, and others connected. Each one is ~18K tokens. If we're doing an Obsidian ingestion session, we don't need Canva or Apollo loaded. Running `/mcp` and disconnecting unused servers per session would save massively.
3. **The five-filter audit should be run on `mi.md`** — some of the instructions may be things Claude already does by default or are too vague to be actionable.
4. **Settings.json tweaks** (autocompact at 75%, BASH_MAX_OUTPUT_LENGTH=150000, deny rules) — should implement these immediately.
5. **The ingest-source skill we just built** follows the progressive disclosure pattern — it's a skill, not an agent.md instruction set. This is correct by design.
6. **The context-audit skill itself** could be adapted for our vault — audit our CLAUDE.md + mi.md + skills setup for context hygiene.

## See also

- [[Wiki/concepts/Context-Window-Management]] — the broader principle this video operationalises
- [[Wiki/concepts/Five-Filter-Rule-Audit]] — the standalone methodology for pruning rules
- [[Wiki/concepts/Progressive-Disclosure]] — the mechanism behind reference file splitting
- [[Wiki/digests/YT-Agents-Skills-Clearly-Explained-2026-04-14]] — Ross Mike's complementary perspective on context management
- [[Wiki/digests/YT-Strategic-AI-Coding-2026-04-14]] — "short focused conversations" as a corollary to /clear between tasks
- [[Wiki/tools/Claude-Memory-Compiler]] — Cole Medin's approach to managing context across sessions
- [[Raw/clippings/context-audit-skill-bradley-bonanno]] — the audit skill itself
- [[Raw/docs/Claude-Code-Context-Cleanup-Guide.pdf]] — companion PDF guide
- [[AIOS/skills/ingest-source]] — example of a skill that benefits from progressive disclosure
- [[Atlas/Concepts/File-over-AI]] — our existing principle that this reinforces
