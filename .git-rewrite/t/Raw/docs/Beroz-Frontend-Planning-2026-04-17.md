---
title: Beroz SaaS Platform — Planning Session
date: 2026-04-17
generated-by: claude
type: planning-session
repo: https://github.com/nikshostudios/beroz
app-file: beroz/frontend-saas/index.html
stack: Vanilla HTML/CSS/JS SPA (no framework)
---

# Beroz SaaS Platform — Planning Session (April 17, 2026)

## Platform Overview

- **Repo:** https://github.com/nikshostudios/beroz
- **Main app file:** `beroz/frontend-saas/index.html`
- **Stack:** Vanilla HTML/CSS/JavaScript single-page app
- **Routing:** CSS class toggling on `.page` divs via `data-page` attributes
- **Competitor reference:** Juicebox (juicebox.ai) — AI-powered sourcing and email outreach for recruiters

---

## TODO List

### 1. Chrome Extension for Outreach Tracking (Gmail/Outlook)
**Status:** Future feature — not part of this code pass  
**Priority:** TBD  

Mirror Juicebox's pattern: a browser extension that sits on top of Gmail or Outlook in the browser, detects when a recruiter sends an email to a candidate, and logs the send (plus replies, opens, follow-ups) back into the Beroz platform against the candidate's profile. This lets recruiters keep sending from their personal inbox (better deliverability, replies land in a familiar inbox) while Beroz still captures all outreach activity.

**Decision needed:** Do we build this, or require all outreach to flow through the platform?

---

### 2. Profile Avatar (Top-Right) Must Be Clickable
**Status:** Ready for implementation  
**Priority:** High  
**Location in code:** `.avatar` element in the header (~line 902)

Currently the profile avatar ("S") in the top-right corner of the header is not clickable. It needs to open a dropdown menu with the following items:

- Invite members
- Help center
- Knowledge base
- Contact support
- Sign out

Style it clean and minimal, with icons next to each item (similar to Juicebox's settings dropdown).

---

### 3. Rename Sidebar Project Selector → "Projects" & Make It Functional
**Status:** Ready for implementation  
**Priority:** High  
**Location in code:** Sidebar project selector (~lines 816–887)

**Current state:** The sidebar has a dropdown labeled "recruitment agent" that isn't fully functional.

**Changes needed:**

**a) Rename to "Projects"**
- Change the label from "recruitment agent" to "Projects."
- Make it clickable.

**b) Dropdown behavior**
- When clicked, shows a dropdown listing available client/project names.
- Includes a search field at the top ("Find projects").
- Each client/project name has its own role-specific requirements.
- Includes a "View all projects →" link at the bottom of the dropdown.

**c) "All Projects" persistent sidebar entry**
- Add a persistent "All Projects" nav item at the very top of the sidebar, *above* the Projects dropdown.
- Navigates to `page-all-projects`.

**d) "All Projects" page**
- Table/list of existing projects showing: Title, Progress, Created on, Collaborators, Status.
- "Create new project +" button in the top-right.
- Opens a modal with:
  - Project Title (required)
  - Access Level: Shared (visible to everyone) / Private (only you, collaborators, admin)
  - Collaborators (optional dropdown)
  - "Create Project →" submit button

---

### 4. Remove Agent Home Page Entirely
**Status:** Ready for implementation  
**Priority:** High  
**Location in code:** `#page-agent-home` (~lines 910–929)

The Agent Home page (greeting message + chat input + quick action chips) does not serve any function. Remove it entirely and set the default landing page to `page-all-projects` instead.

---

## Claude Code Prompt

> I need you to make changes to my SaaS recruitment platform. The main application file is `frontend-saas/index.html` — it's a vanilla HTML/CSS/JS single-page app. All pages are static divs switched via CSS classes and `data-page` attributes. Here's what needs to change:
>
> **1. Make the profile avatar clickable (top-right header)**
> The `.avatar` element in the header (currently shows "S") is not clickable. It needs to open a dropdown menu with these items: Invite members, Help center, Knowledge base, Contact support, Sign out. Style it similar to how Juicebox does their settings dropdown — clean, minimal, with icons next to each item.
>
> **2. Rename the sidebar project selector from "recruitment agent" to "Projects" and make it fully functional**
> The project selector dropdown at the top of the sidebar currently says "recruitment agent." Rename it to "Projects." When clicked, it should show a dropdown listing available client/project names with a search field at the top and a "View all projects →" link at the bottom. Also add a persistent "All Projects" nav item at the very top of the sidebar, above the Projects dropdown, that navigates to `page-all-projects`.
>
> **3. Build out the "All Projects" page and "Create New Project" flow**
> The `page-all-projects` page needs a proper layout: a table/list of existing projects showing Title, Progress, Created on, Collaborators, and Status. Include a "Create new project +" button in the top-right that opens a modal with fields for: Project Title (required), Access Level (Shared vs Private radio/checkbox), Collaborators (optional dropdown), and a "Create Project →" submit button.
>
> **4. Remove the Agent Home page**
> The `page-agent-home` section (the greeting + chat input + quick action chips) should be removed entirely — it serves no function. Set the default landing page to `page-all-projects` instead.
>
> Plan all of this out first before writing any code. Identify every section of `frontend-saas/index.html` that needs to change, the order of changes, and any risks or dependencies between them.

---

## Open Questions

1. **Project vs Agent relationship:** Is a project = a client engagement (e.g. "Acme Corp – Backend Engineer role") with one or more agents running *within* it? Or is project still synonymous with agent, just renamed and reorganized?
2. **Chrome extension timeline:** When should this move from future feature to active development?
