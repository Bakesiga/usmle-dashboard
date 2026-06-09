---
name: usmle-auto-outreach
description: Every 6 hours: check both USMLE response sheets, draft outreach/confirmation emails for any new respondents in Allan's Gmail.
---

USMLE class auto-outreach check (scheduled every 6 hours).

You are running autonomously in a fresh session. Check both Google Forms response sheets for new respondents who haven't yet received Allan's standard reply, create personalised draft emails in his Gmail (allanbakesiga@gmail.com), and color-code rows in the sheets so emailed rows are visually distinct. DRAFTS ONLY — do NOT send.

## Prerequisites
- Chrome must be running with the Claude_in_Chrome MCP extension active.
- Browser signed in to bakesiganajjuma@gmail.com (where the sheets live).
- Gmail MCP at mcp__e422b0cc-0cb8-45e3-bbbc-bae86bab7b6e authed to allanbakesiga@gmail.com.
- If any of these isn't true, abort with a clear report.

Load tools via ToolSearch if not immediately available:
- mcp__Claude_in_Chrome__tabs_context_mcp, navigate, computer (browser)
- mcp__e422b0cc-0cb8-45e3-bbbc-bae86bab7b6e__search_threads, create_draft (Gmail)

## Sheets to check

**A. Original sign-up sheet** — `https://docs.google.com/spreadsheets/d/1Lqms7y406_f5Tj7fdSunNmeRfyzA-aYP1bCZ7aJNUps/edit`
Columns: A=Timestamp · B=First name · C=Last name · D=Email · E=Track interest

**B. Confirmation form sheet** — `https://docs.google.com/spreadsheets/d/1rNenHKC_chTZ3InJ7awOATwpG2MACbb9M1tl8BmVQXo/edit`
Columns: A=Timestamp · B=First name · C=Last name · D=Email · E=WhatsApp · F=Country · G=Time zone · H=Notes

For each sheet: navigate, click into the cell area, use the Name box (top-left) to jump to B2, press Cmd+Down to find the last filled row.

## Templates

Read fresh from `/Users/allanbakesiga/.claude/usmle-dashboard/outputs/email-templates/`:
- `outreach.html`
- `confirmation-uganda.html`
- `confirmation-international.html`

Each has a `{NAME}` placeholder. Substitute first name in Title Case (e.g. "ALLAN" → "Allan", "Shalom Mary" stays "Shalom Mary").

## Step 1 — Sheet A (sign-ups → outreach)

For each unique email (dedupe by email, keep earliest timestamp):
- Gmail: `search_threads` with `query: in:sent subject:"USMLE Class, quick update" to:<email>`
- If 0 results → create outreach draft:
  - subject: `USMLE Class, quick update + a 60-second confirmation form`
  - htmlBody: outreach.html with {NAME} replaced
  - to: [email]
- Else → skip (already emailed).

Track which row indices have emails in Sent vs not — you'll need this in Step 3.

## Step 2 — Sheet B (confirmations → confirmation reply)

For each unique email:
- Gmail: `search_threads` with `query: in:sent subject:"USMLE Step 1 (June cohort): confirmation received" to:<email>`
- If 0 results: classify by WhatsApp prefix (column E):
  - Starts with `+256` → `confirmation-uganda.html`
  - Starts with `+1` → SKIP, add to "US flagged" report
  - Other → `confirmation-international.html`
- Create draft:
  - subject: `USMLE Step 1 (June cohort): confirmation received and next steps`
  - htmlBody: chosen template with {NAME} replaced
  - to: [email]
- Else → skip.

Track which row indices have emails in Sent vs not.

## Step 3 — Color-code rows in both sheets

For each sheet, apply a LIGHT GREEN background fill to rows whose email IS in Sent (already sent). Rows where you just created a new draft (NOT yet in Sent) stay white — this makes pending drafts visually distinct.

To color rows in the browser:
1. Click into the sheet (a cell, not the header).
2. Click the Name box (top-left, shows current cell reference).
3. Type the range: e.g. `A2:E10` (Sheet A) or `A2:H10` (Sheet B). Multi-range works with commas: `A2:E5,A8:E10`.
4. Press Enter to select.
5. Click the paint-bucket fill-color icon in the toolbar.
6. The 2nd row of the standard color palette has the lightest pastels — click the green one (it's the 4th or 5th column in that row).
7. Click outside the menu to apply.

**Note about Sheet A's "Alternating colors" table style:** Sheet A is a Form_Responses "smart table." If the fill green isn't visible after applying:
- Click the fill-bucket icon again.
- At the bottom of the color menu, find "Alternating colors" — if it has a checkmark, click it to open the Table formatting panel.
- In that panel, uncheck "Show alternating colors" → Done.
- The green fill should now be visible.

Sheet B doesn't have this complication.

Coloring is idempotent — green over green is fine. Don't worry about overshooting; just color all Sent rows green every run.

## Step 4 — Report

Print a concise summary:
- N outreach drafts created (list emails)
- N confirmation drafts created (list emails, variant: UG / Intl)
- N US responders flagged (list)
- N rows newly colored green (or "all already green")
- Anything that errored

If no work to do, say "No new respondents this cycle; row colors are up to date."

## Safety
- Don't send anything; drafts only.
- Don't delete or modify spreadsheet contents (other than the cell background fill color).
- Don't change the email templates on disk.
- If a Gmail draft creation fails, log it and continue.
- If you can't reach a sheet or the browser, stop and report — don't loop.
- This recurring task is pre-authorised by Allan for draft creation and cell coloring. No further permission needed at runtime.