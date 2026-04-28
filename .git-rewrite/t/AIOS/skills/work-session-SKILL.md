# Skill: Work Session

## Purpose
Be the in-session companion during active working sessions. Track what's happening in-conversation only — no Obsidian file edits mid-session. At session end, do one single batch update of `TODO.md`, `Wiki/hot.md`, and `Wiki/log.md` so Nikhil can open Obsidian and immediately see what was done and what to do next.

This skill works in tandem with `ingest-source`. Ingest-source handles raw filing and Wiki compilation. This skill handles session orchestration: when to call ingest-source, what to track, and when to write anything to disk.

## Trigger phrases
- "work session", "start session", "let's work", "beginning a session"
- Any `.md` file uploaded or added while a session is clearly active
- "we're done", "session done", "wrap up", "end of session"

---

## Phase 0 — Session start

When a session begins (user signals they're starting work, or context makes it clear):

1. Read `[[Wiki/hot]]` — what's currently active and what the blockers are.
2. Read `[[TODO]]` — what tasks are open, who owns them.
3. Brief the user **in-conversation only**:
   - "Here's where we left off: [active work, open blockers]. What are we working on today?"
4. Track session state in-conversation from here. **Do not edit any vault files yet.**

Set up an internal in-conversation scratchpad (never written to disk) with:
- Session date
- Tasks open at start
- Running list of: what was filed, what was decided, what new tasks emerged

---

## Phase 1 — Mid-session: .md file added

When any `.md` file is uploaded or added **and** there is an active session in progress:

**Ask one question before touching anything:**
> "Are you still working, or is this the last thing for this session?"

- **Still working** → File the content if needed (call `ingest-source`), note what was done in the in-conversation scratchpad, **do not update TODO / hot / log**. Keep going.
- **Session done** → Proceed to Phase 2.

If the user says "quick update", "just file this", or similar, file the content and skip the question. Only ask when it's genuinely ambiguous.

---

## Phase 2 — Session end: batch update

When the user signals the session is done, execute all of the following in one pass:

### 1. Update `TODO.md`
- Mark completed tasks `- [x]` — leave them visible for one session before removing, so Nikhil can see what just moved.
- Add any new tasks that emerged during the session, with full inline context and ownership tags.
- Update or rewrite tasks whose scope changed.
- Do **not** reorder or restructure — just update what changed.

### 2. Rewrite `Wiki/hot.md`
- Update the "right now" section to reflect the current state post-session.
- Remove blockers that got resolved. Add new ones that emerged.
- Update the footer timestamp and summary line.

### 3. Append to `Wiki/log.md`
- One entry at the top (reverse chronological) summarising the session.
- Format: `## YYYY-MM-DD[letter] — [session description]`
- Include: what was ingested, what was decided, what files were created/updated, what the key output was.

### 4. Call `ingest-source` if needed
- If any raw `.md` files were added during the session that haven't been filed to `Raw/` and compiled to `Wiki/` yet, handle that as part of the wrap-up.

### 5. Present summary and ask for corrections
After writing everything, tell the user in-conversation:
- What was done this session (filed, decided, resolved, checked off)
- What's now on the TODO list (new tasks + checked-off tasks)
- Ask: "Did I miss anything? Any tasks wrong?"
- Apply corrections immediately, then done.

---

## Token efficiency rules

- **Never edit `TODO.md`, `Wiki/hot.md`, or `Wiki/log.md` mid-session.** In-conversation tracking only until Phase 2.
- **One batch write at session end** — all three files updated in a single pass, not one at a time after each action.
- When briefing the user mid-session on what we're doing, use plain in-conversation text. Do not open vault files just to describe current state.
- If the user asks "what have we done so far this session?" — answer from the in-conversation scratchpad, not by re-reading vault files.

---

## Ownership tag conventions (for TODO.md writes)
- **👤 Nikhil** — only for tasks that need ExcelTech-internal access or context (recruiter workflows, credentials, internal comms). ExcelTech is Nikhil's family's company — he is the direct line to the business.
- **👥 Either** — all other technical work. Both Nik and Nikhil are technical, both building toward MVP. No business/comms split yet.

---

## Relationship with ingest-source

`ingest-source` is a content skill: files raw material and compiles Wiki notes. It has no session awareness.

`work-session` is the conductor: decides *when* to call `ingest-source`, *what* to track in-conversation, and *when* to batch-write to disk.

If `ingest-source` is triggered directly (without a `work-session` context), ask the session-state question before proceeding with any `TODO.md` / `hot.md` / `log.md` updates.

---

## Example session flow

```
User uploads analysis.md mid-session
→ Ask: "Still working or session done?"
→ "Still working" → note in scratchpad, do not touch Obsidian

User uploads test-report.md
→ Ask: "Still working or session done?"
→ "Still working" → note in scratchpad

User: "ok that's it for today"
→ Phase 2: batch update TODO + hot + log in one pass
→ Present summary, ask for corrections
→ Done
```
