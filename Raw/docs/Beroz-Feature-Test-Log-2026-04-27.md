---
type: raw-test-log
generated-by: human
date: 2026-04-27
tester: Shoham
branch: main (post-21-commit pull)
protocol: One feature at a time. User navigates, reports observations. Agent logs. No code changes.
sections:
  - Requirements (features 1–5)
  - Searches (features 6–9)
  - Sequences (features 10–17)
  - Settings (features 18)
  - Email loop / Tier 3 (features 19–24, deferred)
---

# Feature Test Walkthrough — 2026-04-27

**Branch**: main (post-21-commit pull)
**Tester**: Shoham
**Protocol**: One feature at a time. User navigates, reports observations. Agent logs. No code changes.

---

## Requirements

### [1] All Requirements — 3-dot row menu

**Where**: All Requirements → row → `…` button (always visible)
**What to look for**:
- 3 items: Pin / Clone / Delete
- Pin: row floats to top + purple pin icon appears next to requirement name
- Clone: produces a new draft copy of the requirement in the list
- Delete: triggers a confirmation prompt before removing

**Screenshots**: Screenshot 2026-04-27 at 5.46.57 PM.png, Screenshot 2026-04-27 at 5.47.36 PM.png
**Observations**:
- `…` button is always visible (not hover-gated) ✓
- Menu has 5 items (not 3): Pin, Edit, Clone, Close, Delete — Edit and Close are present but were not in the spec
- Clone works: produced "Network Engineer (Copy)" ✓ — appeared below original (not floated, expected since it's a draft copy)
- Pin works functionally: row moves to top; menu label flips to "Unpin" on the pinned row ✓
- Delete shows confirmation dialog ("Permanently delete this requirement and all its sourced candidates? This cannot be undone.") ✓
- **Bug**: no purple pin icon appears next to the requirement name after pinning

**Feedback**: Pin icon missing is a clear UX gap — pinned vs unpinned rows look identical, so there's no at-a-glance signal that a row is pinned. Adding the small purple pin icon next to the name would fix this.
**Status**: ☐ works as-is · ☑ works with feedback · ☐ broken · ☐ skipped

---

### [2] Requirement create modal — 4 new intake fields

**Where**: All Requirements → New Requirement modal (or Edit on an existing row)
**What to look for**:
- `Certifications` (tag/chip input, text[])
- `Remote policy` (free-text)
- `Industry experience` (tag/chip input, text[])
- `Excluded companies` (tag/chip input, text[])
- All 4 save on submit, round-trip correctly when re-opened for edit, and appear in the requirement detail view

**Screenshots**: Screenshot 2026-04-27 at 5.55.59 PM.png
**Observations**:
- All 4 fields present in modal: Certifications (comma sep), Work Mode (remote policy), Industry / Domain (comma sep), Excluded Companies (no-poach) ✓
- Fields display with placeholder hint text and accept input ✓
- Save and round-trip confirmed working ✓
- No separate requirement detail view — clicking a row opens the edit modal; the modal is the detail view

**Feedback**: The "(comma sep)" and "(no-poach)" helper labels in the field titles are slightly cryptic to a new user. Could be friendlier as placeholder text inside the field itself rather than appended to the label. Minor cosmetic note.
**Status**: ☑ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

### [3] Requirement create modal — JD diagnostics

**Where**: All Requirements → New/Edit Requirement modal → paste a JD
**What to look for**:
- `jd_quality_score` (1–10 integer) displayed after parse
- `red_flags` array rendered in the modal
- Both values persist on the requirement row after save

**Screenshots**: Screenshot 2026-04-27 at 6.02.28 PM.png, Screenshot 2026-04-27 at 6.02.37 PM.png
**Observations**:
- JD pasted into Job Description field and saved successfully ✓
- On re-opening the edit modal: no `jd_quality_score` displayed anywhere
- No `red_flags` displayed anywhere in the modal or on the requirements list row
- The diagnostics that work in Searches → Job Description tab do NOT surface here

**Feedback**: The modal saves the JD text but the AI diagnostic step (score + red flags) either never runs on save, or runs but the results have no UI to display them. The feature is effectively invisible in this context.
**Status**: ☐ works as-is · ☐ works with feedback · ☑ broken · ☐ skipped

---

### [4] Requirement detail — Generate LinkedIn posts

**Where**: Requirement detail page → Generate LinkedIn posts button/section
**What to look for**:
- 3 distinct variants returned: `technical_challenge`, `growth_and_impact`, `team_and_culture`
- Each ≤180 words, headline ≤120 chars
- No buzzwords (per `job_seller.md`)

**Screenshots**: Screenshot 2026-04-27 at 6.05.58 PM.png, Screenshot 2026-04-27 at 6.06.26 PM.png, Screenshot 2026-04-27 at 6.06.33 PM.png, Screenshot 2026-04-27 at 6.06.39 PM.png
**Observations**:
- Loading modal appears immediately with spinner and "Generating 3 variants — usually 5-10 seconds..." ✓
- All 3 variants generated and displayed: TECHNICAL / PROBLEM-FIRST, GROWTH & IMPACT, TEAM & CULTURE ✓
- Each variant has a distinct angle and a Copy button ✓
- Actual generation time felt closer to ~30 seconds, not 5-10

**Feedback**:
- Loading estimate "usually 5-10 seconds" is misleading — felt closer to 30s. Should use a non-committal label like "This may take a short while" to avoid setting a false expectation
- All 3 variants read as clearly AI-generated: heavy em-dash usage (—), overwrought phrases ("they're not just nice-to-haves — they're survival skills"), and metaphors that feel performative rather than natural. The writing tries to sound human but lands in the recognisably-AI zone. The prompt in `job_seller.md` likely needs to be tightened to produce drier, more direct copy — fewer rhetorical flourishes, no em dashes
**Status**: ☐ works as-is · ☑ works with feedback · ☐ broken · ☐ skipped

---

### [5] Boost panel — boolean output copy buttons

**Where**: Agentic Boost → results header (after a boost run completes)
**What to look for**:
- 3 copy buttons: Copy Boolean, Copy X-ray, Copy GitHub
- GitHub button only emits output for technical roles (programming language present in `skills_required`)
- For non-technical roles: friendly empty-state message shown instead of a GitHub query

**Screenshots**: Screenshot 2026-04-27 at 6.42.57 PM.png
**Observations**:
- All 3 copy buttons present in results header: Copy Boolean, Copy X-ray, Copy GitHub ✓
- Boolean output: `("AWS" OR "Amazon Web Services") AND ("Kubernetes" OR "K8s" OR "EKS") AND ("Docker") AND ("Terraform") AND ("CI/CD" OR "Jenkins" OR "GitHub Actions") AND ("Python" OR "Bash") AND "Bangalore" AND ("senior" OR "lead")` — well-formed ✓
- X-ray output: `site:linkedin.com/in/ ("AWS" OR "Amazon Web Services") ("Kubernetes" OR "K8s" OR "EKS") ("Docker") ("Terraform") ("CI/CD" OR "Jenkins" OR "GitHub Actions") "Bangalore"` — correct Google X-ray format ✓
- GitHub output: `language:Python location:Bangalore kubernetes docker terraform aws` — correct GitHub search format; Python detected as programming language ✓
- Only 2 matching candidates returned (Nikhita Raghunath, Arpit Bhayani) — very low pool; may be due to the highly specific JD (8+ must-have skills, PCI-DSS)
- Non-technical role empty-state not tested (would need a non-technical JD)

**Feedback**: Boolean strings are relevant and well-constructed. Low candidate count (2) is notable — unclear if it's Apollo's pool being small for this niche profile or a search breadth issue. Would be worth testing with a broader JD to calibrate.
**Status**: ☑ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

## Searches

### [6] Find Similar (natural language)

**Where**: Searches → Find Similar tab → NL query field
**What to look for**:
- NL input parses into Apollo search filters
- 4 new fields also extracted from NL (e.g. "at fintech startups" → `industry_experience: ["FinTech"]`)
- Results panel populates with candidates

**Screenshots**: Screenshot 2026-04-27 at 6.23.38 PM.png, Screenshot 2026-04-27 at 6.24.04 PM.png
**Observations** (partial — triggered via Source Now on a requirement row):
- "Source Now" on the Network Engineer requirement auto-redirected to Searches → Find Similar, with the requirement data pre-populated as a NL query: "Network Engineer Python in Bangalore" ✓
- Interpreted filters parsed correctly: Role/Title (4 variants), Must-have skills (Python, Networking), Location (Bangalore) ✓
- JD diagnostic pills also appeared here: JD 2/10, Salary missing, Experience range missing, Location missing, Skills are vague ✓ (correct — the auto-filled text is sparse)
- 1 candidate returned (Swan Htet Lu, Senior Network Engineer, 62% match) — fast, within 5-10 seconds ✓
- 4 new intake fields (certifications, industry, excluded companies) NOT extracted — but the auto-generated query "Network Engineer Python in Bangalore" didn't contain those, so expected
- My Saved Searches section visible at bottom of page ✓

**Screenshots (NL intake fields test)**: Screenshot 2026-04-27 at 6.50.59 PM.png, Screenshot 2026-04-27 at 6.51.06 PM.png
**Observations (NL intake fields test — query: "Python network engineer at fintech startups, no Cisco or Juniper, hybrid Bangalore, needs CCNA certification")**:
- Certifications: CCNA extracted ✓
- Work mode: hybrid extracted ✓
- Industry: FinTech extracted ✓
- Excluded companies (Cisco, Juniper): NOT shown as an interpreted filter row — either not parsed or parsed but not displayed in the UI
- Zero candidates returned; two empty-state messages shown: "No matching candidates. Try loosening the filters." and below it "Scanned 24 candidates but none scored above the match threshold. Try loosening the filters." — the second message is informative (shows the search ran and scored)

**Bug**: Find Similar and Job Description tabs appear to be functionally identical — same text input, same interpreted filters output, same results. Entering the same query on either tab and switching tabs shows the same query and results on both. They may share state or be the same component with different labels.

**Bug (via Source Now flow)**: Source Now on a requirement should carry the full requirement data (all intake fields + JD) into the search. Instead it only passes a bare 5-word summary ("Network Engineer Python in Bangalore"), discarding certifications, industry, excluded companies, remote policy, and the full JD. This means Source Now generates an artificially weak search with a low JD score (2/10) — even when the requirement has a rich JD attached.

**Feedback**: 3 of 4 new fields extracted from NL correctly. Excluded companies not surfaced — needs investigation. The two-line empty state is better than a single line; the second line ("Scanned 24 candidates…") is helpful context.
**Status**: ☑ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

### [7] Searches — Job Description tab ✅ PRE-LOADED + CONFIRMED DUPLICATE

**Additional observation (2026-04-28)**: Confirmed Find Similar and Job Description tabs are identical — same input box, same interpreted filters, same results, same state persists when switching between tabs. Screenshots: Screenshot 2026-04-28 at 1.35.54 AM.png, Screenshot 2026-04-28 at 1.36.02 AM.png, Screenshot 2026-04-28 at 1.36.30 AM.png, Screenshot 2026-04-28 at 1.36.37 AM.png.

### [7] Searches — Job Description tab ✅ PRE-LOADED

**Where**: Searches → Job Description tab
**What to look for**: Parse JD into filters → display results

**Screenshots**: —
**Observations**:
- All 4 new intake fields parsed correctly from the Mumbai DevOps test JD: Certifications: AWS Solutions Architect; Industry: FinTech, Payments; Excluded: Razorpay, PhonePe; Work mode: Hybrid 3 days/week
- JD quality score 8/10 displayed
- 2 red-flag warnings rendered: "8 must-have skills — likely unrealistic"; "AWS Solutions Architect listed as 'preferred' but is a certification"
- 3-dot menu on All Requirements is always-visible (not hover-gated) — cosmetic, low priority

**Feedback**:
- UX issue 1: empty-state line "No matching candidates. Try loosening the filters." is too subtle — search runs invisibly and zero-result feedback gets lost
- UX issue 2: no editable-filter step — parse → filters → search runs immediately; user cannot tweak filters before spending the search
- UX issue 3: "Save this search" prompts for a name — should auto-derive from parsed role + location + experience (ChatGPT-style auto-titling) and let user rename inline in saved-searches list

**Status**: ☑ works with feedback

---

### [8] Searches — Select Manually

**Where**: Searches → Select Manually tab → direct filter form
**What to look for**:
- Filter form submits and returns candidate results
- Filters reflect expected Apollo fields

**Screenshots**: Screenshot 2026-04-28 at 1.41.49 AM.png, Screenshot 2026-04-28 at 1.42.57 AM.png, Screenshot 2026-04-28 at 1.43.04 AM.png, Screenshot 2026-04-28 at 1.43.31 AM.png
**Observations**:
- Select Manually does NOT show a structured filter form — it uses the same text input / interpreted filters pattern as Find Similar and Job Description, further confirming all 3 tabs are the same component
- Query: "Software Engineer, Bangalore" → Interpreted filters: Role/Title: Software Engineer, Location: Bangalore ✓
- Loading spinner showed "Finding matching candidates..." before results appeared ✓
- 30 candidates returned — all names hidden behind credit lock ("Reveal name ✦1") ✓
- Match scores visible: 77–95%; Qualify Contact and Qualify Account columns show "Coming soon"
- Save this search link visible ✓

**Feedback**: 30 results for the broadest possible query (just a job title + city, no other filters) is conspicuously low. Apollo has millions of profiles — this points to a low page-size being requested from the Apollo API rather than a threshold filtering issue (scores are high so the match threshold isn't to blame). This reinforces punch list item 8: the candidate pool cap needs investigation.
**Status**: ☑ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

### [9] My Saved Searches

**Where**: Searches page → My Saved Searches list (bottom of page)
**What to look for**:
- Saved search rows displayed
- Clicking a row reloads original query with same filters
- Bulk-select checkboxes functional

**Screenshots**: Screenshot 2026-04-28 at 1.56.13 AM.png, Screenshot 2026-04-28 at 1.58.00 AM.png (re-run results)
**Observations**:
- 1 saved search shown: "Software Engineer in Bangalore" — auto-named from the query ✓ (note: this contradicts UX issue 3 from Job Description tab — auto-naming appears to work here but may not on the JD tab)
- Row shows: name, type ("Manual"), last run timestamp (28/04/2026, 01:44:15), Re-run button, delete (red trash) button ✓
- No bulk-select checkboxes visible — likely only appears with multiple saved searches; not fully testable with 1 entry
- Clicking "Re-run" re-executes the same query and returns 30 candidates — mostly the same results, a few differences between runs (non-determinism in Apollo's response) ✓
- **Key observation**: Saved search saves the query parameters only, not the candidate results. Each re-run is a fresh Apollo API call. Results vary slightly between runs.
- No way to view the original run's candidates without re-running; the saved search is purely a shortcut to repeat the search

**Feedback**:
- The name "Saved Searches" implies storing results — but it's just a re-run shortcut. The distinction isn't communicated in the UI. Would be more accurate to label it "Saved Queries" or explain "Re-runs this search live against Apollo."
- Revealing candidates costs credits — the user noted concern about whether saving/re-running silently spends credits each time. This should be made clear in the UI (e.g. "Re-run uses Apollo credits").
- Slight result variation between runs is fine for a live search, but could confuse recruiters who expect reproducible results. Consider caching the last run's candidate list alongside the query.
**Status**: ☑ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

## Sequences

### [10] Overview — 6 stat cards

**Where**: Sequences → Overview (top cards)
**What to look for**:
- 6 cards: Total / Active / Opened / Clicked / Replied / Interested
- Numbers reflect real data; zeros acceptable before Tier 3 sends

**Screenshots**: Screenshot 2026-04-28 at 2.03.29 AM.png
**Observations**:
- All 6 cards present: Total (2), Active (0), Opened (0), Clicked (0), Replied (0), Interested (0) ✓
- Page loads cleanly, no errors ✓

**Status**: ☑ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

### [11] Overview — Schedule chart

**Where**: Sequences → Overview → chart
**What to look for**:
- SVG chart with 7/14/30 day period dropdown
- Lavender (`#c4b5fd`) bars for sent, purple (`#7c3aed`) for scheduled
- Dashed vertical line at "today"
- Switching dropdown period redraws the chart

**Screenshots**: Screenshot 2026-04-28 at 2.03.29 AM.png
**Observations**:
- Chart present with "SCHEDULE" label and "7 day period" dropdown ✓
- Legend shows two dot colours for sent and scheduled ✓
- Chart renders a flat line (0 sent, 0 scheduled) across 21–27 Apr — correct for zero sends
- Dashed vertical line visible at right edge of chart (27 Apr = yesterday, today is 28 Apr) — position looks correct
- Dropdown period change confirmed: switching to 30 day redraws chart with range 29 Mar–26 Apr and more data points ✓
- Chart remains flat (zero activity) — expected with no sends

**Status**: ☑ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

### [12] Overview — 3-dot row menu on sequence rows

**Where**: Sequences → Overview → hover a sequence row → `…` button
**What to look for**:
- Menu items in order: Pin / Star / Edit / Clone / separator / Archive (red)
- Clicking `…` does NOT also trigger the row-click navigation
- Whole-row click navigates to sequence detail

**Screenshots**: Screenshot 2026-04-28 at 2.16.36 AM.png, Screenshot 2026-04-28 at 2.16.58 AM.png
**Observations**:
- Menu opens on `…` click — Pin, Star, Edit visible ✓
- Clicking `…` does NOT navigate to detail page ✓
- Row title click navigates to Sequence Detail ✓
- **Bug**: Menu always drops DOWN, clipping below the viewport for rows near the bottom of the page — Clone, separator, and Archive are invisible and unreachable. Menu should detect proximity to viewport bottom and open upward instead.

**Feedback**: The drop-down direction should be dynamic (drop-up when near bottom of viewport). This is a standard UI pattern and makes the lower rows unusable via the menu.
**Status**: ☐ works as-is · ☑ works with feedback · ☐ broken · ☐ skipped

---

### [13] Overview — Pin & Star icons

**Where**: Sequences → Overview → pin or star a sequence via row menu
**What to look for**:
- Pinning floats the row to top with a small purple pin icon next to sequence name
- Starring shows an amber star icon on the row
- Both states persist (backed by `sequences.is_pinned`, `is_starred`, `pinned_at`)

**Screenshots**: —
**Observations**:
- Not fully testable — menu is clipped at viewport bottom (see Feature [12] bug), so Pin and Star are accessible in the top row but Clone/Archive remain hidden for lower rows
- Pin and Star items are visible in the menu ✓ (not yet activated to verify icon behavior)

**Feedback**: Blocked by the drop-direction bug in Feature [12]. Re-test after that fix.
**Status**: ☐ works as-is · ☐ works with feedback · ☐ broken · ☑ skipped

---

### [14] Sequence detail — 7 stat cards + chart + Engagement column

**Where**: Sequences → click a sequence row → detail page
**What to look for**:
- 7 stat cards: Contacts / Active / Opened / Clicked / Replied / Interested / Bounced
- Embedded chart with its own period dropdown
- Table has an **Engagement** column: "Opened ×N · Clicked ×M" per run

**Screenshots**: Screenshot 2026-04-28 at 2.18.37 AM.png
**Observations**:
- All 7 stat cards present: Contacts (0), Active (0), Opened (0), Clicked (0), Replied (0), Interested (0), Bounced (0) ✓
- Embedded schedule chart with 7 day period dropdown ✓
- Table columns: Full Name, Step, Status, Response, **Engagement**, Added By, Actions ✓
- Empty state: "No contacts enrolled yet. Click Add Contacts to enroll candidates." ✓
- Engagement column values not testable until contacts are enrolled and emails sent (Tier 3)

**Status**: ☑ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

### [15] Sequence editor — Preview & test

**Where**: Sequences → sequence detail → Edit → Preview and test button (top right of editor)
**What to look for**:
- Sends a real email to the current user's address with `[TEST]` prefix in subject
- No `outreach_log` row created
- No `sequence_runs` row created
- No tracking pixel / link rewriting

**Screenshots**: Screenshot 2026-04-28 at 2.26.32 AM.png, Screenshot 2026-04-28 at 2.27.15 AM.png
**Observations**:
- Email Preview modal opens with: From (Raju.akula work email), To (Sample candidate preview dropdown), Subject, Body ✓
- "Send yourself a test email" section at bottom with pre-filled work email address and "Send Test" button ✓
- Footer note: "Test emails have 'Test' in the subject line" ✓
- Test email arrived in inbox with `[TEST EMAIL]` prefix in subject ✓
- No tracking artifacts (Tier 3 verification deferred)

**Status**: ☑ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

### [16] Sequence editor — Signature dropdown

**Where**: Sequences → Edit step → Signature dropdown
**What to look for**:
- Dropdown populated from `GET /api/signatures`
- Selecting a signature and saving writes `sequence_steps.signature_id`

**Screenshots**: Screenshot 2026-04-28 at 2.26.32 AM.png
**Observations**:
- Signature dropdown visible in editor below the email body, currently showing "None" ✓
- Options in dropdown not yet tested (requires signatures to be set up in Settings first — see Feature [18])

**Status**: ☐ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

### [17] Sequence editor — Include unsubscribe checkbox

**Where**: Sequences → Edit step → Include unsubscribe checkbox
**What to look for**:
- Toggling writes `sequence_steps.include_unsubscribe`
- (Full send verification deferred to Tier 3)

**Screenshots**: Screenshot 2026-04-28 at 2.26.32 AM.png
**Observations**:
- "Include unsubscribe" checkbox visible at bottom right of the editor ✓ (unchecked by default)
- Toggle save behaviour deferred to Tier 3 verification

**Status**: ☐ works as-is · ☐ works with feedback · ☐ broken · ☐ skipped

---

## Settings

### [18] Email signatures

**Where**: Settings → Email Signatures section
**What to look for**:
- List of existing signatures
- New / Edit / Delete all functional
- Set default: only one default per user enforced (`uniq_user_default_signature` partial index)
- Flipping default on a second signature clears it on the first

**Screenshots**: Screenshot 2026-04-28 at 2.29.19 AM.png through Screenshot 2026-04-28 at 2.33.24 AM.png
**Observations**:
- Email Signatures section present in Settings → User tab, with subtitle "Reusable HTML signatures you can attach to sequence steps." ✓
- Empty state: "No signatures yet. Click New signature to create one." ✓
- New signature form: name field, Set as default checkbox, HTML BODY textarea, Cancel / Save signature buttons ✓
- Create, Edit, Delete all functional ✓
- **Bug**: When deleting a signature and immediately recreating one with "Set as default" checked, a raw DB error is shown: `APIError: duplicate key value violates unique constraint "uniq_user_default_signature"... Key (user_email)=(raju.akula@exceltechcomputers.com) already exists.` — the full Postgres error is exposed to the user. Despite the error dialog, the signature was still created and appeared as default, suggesting the error fires on a retry/race but the record saved anyway.
- **Bug**: "Save signature" button cursor flips from pointer (hand icon) to arrow cursor while hovering, making it feel unclickable or broken. Button also lags slightly on save. Likely a CSS `cursor: pointer` being lost during a loading/disabled state transition.
- Default switching works correctly: setting a second signature as default moves it to the top with the DEFAULT badge; the previous default loses the badge and gains a "Make default" button ✓
- Only one DEFAULT badge shown at any time — `uniq_user_default_signature` constraint is working ✓

**Feedback**: Core functionality works well. The two bugs (raw error message + cursor issue) are polish-level but both create moments of confusion ("did my action work?").
**Status**: ☐ works as-is · ☑ works with feedback · ☐ broken · ☐ skipped

---

## Email loop (Tier 3 — requires real send + test inbox)

*These require enrolling `nikshostudios@gmail.com` in a sequence and waiting for `sequence_tick`. Skip and mark deferred if inbox access isn't available.*

### [19] Test send — DEFERRED
### [20] Real send → opened tracking — DEFERRED
### [21] Real send → clicked tracking — DEFERRED
### [22] Unsubscribe flow — DEFERRED
### [23] Bounce handling — DEFERRED
### [24] Intent classification — DEFERRED

---

## Punch list

*Ordered by priority. Built up as testing proceeds.*

1. **[Bug] Requirements: pin icon missing** — pinned row has no visual indicator (no purple pin icon next to name); menu flips to "Unpin" correctly but the row itself looks identical to unpinned rows.
2. **[Bug] Requirements modal: JD diagnostics not displayed** — `jd_quality_score` and `red_flags` never surface in the edit modal after saving a JD. Works in Searches → Job Description tab but completely absent here.
3. **[UX] LinkedIn posts: loading estimate misleading** — "usually 5-10 seconds" but actual time is ~30s. Change to "This may take a short while."
4. **[Quality] LinkedIn posts: copy reads as AI-generated** — heavy em-dash usage, overwrought phrases ("not just nice-to-haves — they're survival skills"), performative metaphors. Tighten `job_seller.md` prompt: drier, more direct tone, ban em dashes, fewer rhetorical flourishes.
5. **[Bug] Source Now: passes bare 5-word summary instead of full requirement data** — Source Now should pre-fill the search with the full JD + all intake fields. Instead it generates a minimal NL summary (role + skills + location only), resulting in a weak JD score and few candidates. Fix: pass `requirement.job_description` (or the structured intake fields) directly to the search.
6. **[Bug] Find Similar / Job Description tabs are identical** — same input, same parsed filters, same results; switching between tabs shows the same query/results on both. Either they're the same component or they share state unintentionally. They should behave differently: Find Similar takes a candidate profile or NL description; Job Description takes a raw JD.
7. **[Bug] Excluded companies not shown in interpreted filters** — "no Cisco or Juniper" in NL query did not produce an Excluded companies filter row. Either the field isn't parsed from NL or parsed but not displayed.
8. **[Product + Bug] Search results: low candidate pool + show full unfiltered results** — "Software Engineer + Bangalore" (no other filters) returned only 30 candidates; match scores were 77–95% so the threshold is not the cause. The Apollo API page-size request is likely too small (probably 25–50). Fix: (1) increase Apollo page size to 100–200 per request, (2) show the full raw pool to the recruiter with a visible match % column, letting them choose their own threshold instead of hiding results below 60%. Recruiter feedback: abundance of results (100+) feels trustworthy even if only 6 are truly good.
9. **[Feature] Saved Searches: persist candidate results, not just the query** — When a search runs, save the full result set (job title + company) to the DB alongside the query. Show cached candidates on reopen. Credits still apply on reveal. Makes "saved searches" actually useful — stable list across sessions.
10. **[Bug] Sequence row menu: clips below viewport** — `…` menu always opens downward; on lower rows Clone, separator, and Archive are hidden below the page edge. Fix: detect viewport proximity and open upward (drop-up) when near the bottom.
11. **[UX] Sequence auto-naming: "New Sequence - MM/DD/YYYY" is not useful** — New sequences should be auto-named from the requirement they're associated with (e.g. "Network Engineer — HCL Tech"). User can rename after creation.
12. **[Bug] Signatures: raw Postgres error shown to user** — Creating a signature with "Set as default" hits `uniq_user_default_signature` on race/retry and shows the full DB error string. Catch constraint violation code 23505 and show a friendly message instead.
13. **[Bug] Add Contacts: no select/deselect per recipient** — Recipients list is pre-populated from the shortlist with no checkboxes to exclude individual contacts before enrolling. Fix: start with empty list or add per-row checkboxes.
14. **[Bug] Add Contacts: "sending now" is misleading when send time is set** — Confirmation dialog says "Step 1 emails are sending now" even when the step has a scheduled Send Time (09:00). Emails are queued, not sent. Message should reflect the actual scheduled time.
15. **[Bug] Signatures: Save button cursor reverts to arrow** — `cursor: pointer` lost during the save/disabled state. Ensure button retains `cursor: pointer` (or `cursor: wait`) during submission.
