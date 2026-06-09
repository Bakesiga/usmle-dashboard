# USMLE Cohort Operations — Full Project Handoff

**Owner:** Allan Bakesiga (allanbakesiga@gmail.com)
**Operating account for Sheets:** bakesiganajjuma@gmail.com
**Document date:** 2026-05-17
**Cohort start:** **2026-06-01** (15 days to go as of this handoff)

This document is intended to fully describe the project so that a new Cowork (or any Claude Agent SDK) workspace can recreate the workflow with no missing context.

---

## 1. What this project is

Allan runs a **USMLE Step 1 prep cohort** for International Medical Graduates (IMGs), mostly East African physicians.

- **Format:** daily live Zoom classes, 2.5 hours/day.
- **Cohort dates:** June 1 – June 30, 2026 (30 days, 4 subjects).
- **Class times:**
  - 5:00 – 7:30 AM EAT
  - 9:00 – 11:30 PM CST (previous calendar day)
  - 10:00 PM – 12:30 AM EST (previous calendar day)
- **Subjects taught in June:**
  1. Cardiovascular (Jun 1–10, 10 days)
  2. Respiratory (Jun 11–18, 8 days)
  3. Epidemiology & Biostatistics (Jun 19–22, 4 days)
  4. General Pathology (Jun 23–30, 8 days)
- **Fee:**
  - Uganda: UGX 350,000 / month
  - International: USD 200 / month (template default). Allan has used USD 150 ad-hoc for select students (Mushi, Michael) — confirm per case.
- **First-month payment:** due in full by 30 May (slots are first-come, first-served).
- **Subsequent months:** same monthly fee, due within the first 7 days of each month. Access pauses on day 8 if unpaid.

The agent's job is to keep the intake pipeline from form-submission through confirmation-email through payment-tracking as low-friction as possible for Allan.

---

## 2. System map

```
                    ┌───────────────────┐
                    │  Google Form A    │  Interest sign-up
                    │ (Enrolment Intrst)│
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │     Sheet A       │  responses table
                    └─────────┬─────────┘
                              │ outreach.html
                              ▼
                    ┌───────────────────┐
                    │   Gmail draft     │  ← agent creates
                    └─────────┬─────────┘
                              │ Allan reviews + sends
                              ▼
                    ┌───────────────────┐
                    │   Student opens   │
                    │ Confirmation form │
                    │  forms.gle/iHCd…  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │     Sheet B       │  confirmation responses
                    └─────────┬─────────┘
                              │ confirmation-uganda.html
                              │ confirmation-international.html
                              │ + flyer attached
                              ▼
                    ┌───────────────────┐
                    │   Gmail draft     │
                    └─────────┬─────────┘
                              │ Allan reviews + sends
                              ▼
                    ┌───────────────────┐
                    │   Student pays    │
                    │   (Mobile Money)  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │     Sheet C       │  manual payment tracker
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Dashboard access  │  + WhatsApp group invite
                    └───────────────────┘
```

There are also **two alternate intake paths**:
- Direct email to allanbakesiga@gmail.com
- WhatsApp DM/group (group invite: `https://chat.whatsapp.com/JvaTpyDt9loGZjomAVwi42`, DM: +256 705 571 443)

Both bypass the forms, so the agent must always cross-reference Gmail before drafting.

---

## 3. The three Google Sheets

| Sheet | Purpose | URL | Owner account |
|---|---|---|---|
| **A — Enrolment Interest** | Initial sign-ups (Google Form) | https://docs.google.com/spreadsheets/d/1Lqms7y406_f5Tj7fdSunNmeRfyzA-aYP1bCZ7aJNUps/edit | bakesiganajjuma@gmail.com |
| **B — Confirmation** | Spot confirmations (Google Form) | https://docs.google.com/spreadsheets/d/1rNenHKC_chTZ3InJ7awOATwpG2MACbb9M1tl8BmVQXo/edit | bakesiganajjuma@gmail.com |
| **C — Payment Tracker** | Manual payment ledger | https://docs.google.com/spreadsheets/d/1zkURBFRBC_1CBMiLjvS5RQACfVdh8e_qxjiOUMh_moM/edit | bakesiganajjuma@gmail.com |

### Confirmation form URL (give to students)
`https://forms.gle/iHCdPVjvJeGeGTXy7`

### Sheet A columns
| Col | Field |
|---|---|
| A | Timestamp |
| B | First name |
| C | Last name |
| D | Email |
| E | Track interest |

### Sheet B columns
| Col | Field |
|---|---|
| A | Timestamp |
| B | First name |
| C | Last name |
| D | Email |
| E | WhatsApp (with country code, e.g. +256…) |
| F | Country of residence |
| G | Time zone |
| H | Notes |

### Sheet C tabs and columns
Three tabs (Paid, Confirmation, Enrollment). Primary tab columns:
`Timestamp · First Name · Last Name · Email · Country · Tuition (UGX) · Amount Paid (UGX) · Balance (UGX) · Payment Method · Payment Date · Transaction Ref · Status · Notes`

---

## 4. Color-coding convention

Both Sheet A and Sheet B use background fill to track state:

- **Green row** = email has been drafted *and* sent (verified in Gmail "Sent").
- **White row** = needs action (either drafting or sending).

To recolor a row green, **use paste-special-format-only** (Cmd+Option+V) from a known-green row. Do NOT use the fill-color palette or eyedropper. Allan has called this out — only paste-format-only produces the right shade.

Sheet A has an "Alternating colors" form-table style; if a green fill is invisible after applying, open the fill menu → Alternating colors → uncheck "Show alternating colors."

---

## 5. Email templates

Located at `/Users/allanbakesiga/.claude/usmle-dashboard/outputs/email-templates/`:

| File | Used for | Attach flyer? |
|---|---|---|
| `outreach.html` | Sheet A respondents (initial intro + form link) | No |
| `confirmation-uganda.html` | Sheet B respondents in Uganda (UGX 350k, MoMo) | **Yes** |
| `confirmation-international.html` | Sheet B respondents outside Uganda (USD 200) | **Yes** |

Each template has a `{NAME}` placeholder. The substitution is the first name in Title Case.

### Style rules (HARD — Allan has called these out)

1. **No em dashes.** Use commas, colons, periods, parentheses. Never use `—`.
2. **Greeting:** `Hi <FirstName>,`
3. **Sign-off line:** `Allan` (plain), followed by a blank line, then the signature block below.
4. **Signature block (verbatim, always present):**
   ```
   Allan Bakesiga
   MD (Makerere) · MScGH (Duke)
   Past Teaching Assistant, Epidemiology & Biostatistics, Duke Global Health Institute
   Research Assistant, Duke Global Neurosurgery and Neurology
   PGY-1 Neurology, Creighton
   ```
5. **Use `htmlBody`** (not plain `body`) so formatting matches the templates.

### Attachment workaround

PDFs base64-encoded are too large to pass directly through the Gmail create_draft tool (~170KB → 161K tokens). Standard workaround:
1. Create the draft with no attachment.
2. Run `open -R /Users/allanbakesiga/.claude/usmle-dashboard/outputs/flyers/USMLE_June_Advert.pdf` to reveal the flyer in Finder.
3. Tell Allan to drag-attach the PDF into each draft before sending.

---

## 6. The flyer suite

All flyer build scripts live at `/Users/allanbakesiga/.claude/usmle-dashboard/outputs/flyers/`. Each produces a portrait 4:5 PPTX, then is converted to PDF (LibreOffice headless) and JPG (pdftoppm).

| Build script | Output basename | Purpose |
|---|---|---|
| `build_june_teaser.js` | `USMLE_June_Teaser` | Initial advertising flyer (overview + cohort start) |
| `build_june_advert.js` | `USMLE_June_Advert` | The detailed advert with curriculum + Allan's photo. **This is the flyer attached to all confirmation emails.** |
| `build_june_curriculum.js` | `USMLE_June_Curriculum` | Curriculum-only companion to the teaser |
| `build_june_explainer.js` | `USMLE_June_Explainer` | Educational Q&A explainer: "What is the USMLE?" + countdown + sign-up QR |
| `build_june_reminder.js` | `USMLE_June_Reminder` | "What we're covering in June" — curriculum at-a-glance + class times + sign-up QR |

### Build pipeline (per flyer)

```bash
cd /Users/allanbakesiga/.claude/usmle-dashboard/outputs/flyers
node build_june_<NAME>.js
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf USMLE_June_<NAME>.pptx
pdftoppm -jpeg -r 144 USMLE_June_<NAME>.pdf USMLE_June_<NAME>
mv -f USMLE_June_<NAME>-1.jpg USMLE_June_<NAME>.jpg
open -R USMLE_June_<NAME>.jpg
```

### Design conventions (shared by Explainer + Reminder)

- Font: `Comic Sans MS` (Allan's preference)
- Page: 9″ × 11.25″ (portrait 4:5, WhatsApp Status / Instagram-safe)
- Palette: dark ink `#0C2A3D` + 4 subject accent colors (blue cardio, green respiratory, amber epi, purple pathology)
- Top ribbon: dark, full-width, white caps
- Countdown line in amber: `<N> DAYS TO GO · JUNE 1`
- Allan's circular photo top-right (`allan_circle.png`) + 3-line credentials
- Sign-up QR (`signup_qr.png`) on dark CTA strip at bottom

The countdown is **hardcoded** in each script as `const DAYS_TO_GO = <N>`. Bump it down by 1 each day. Today (2026-05-17) the correct value is **15**.

---

## 7. Scheduled tasks (cron)

Listed in the `scheduled-tasks` MCP. To inspect: `list_scheduled_tasks`.

### `usmle-auto-outreach`

- **Cron expression:** `13 */6 * * *` (every 6 hours, 13 minutes past the hour)
- **SKILL.md:** `/Users/allanbakesiga/.claude/scheduled-tasks/usmle-auto-outreach/SKILL.md`
- **What it does:** runs autonomously in a fresh session, checks both Google Forms response sheets, drafts outreach (Sheet A) and confirmation (Sheet B) emails for any new respondents, color-codes green rows where the email is in Sent.
- **Drafts only — never sends.** Allan reviews and sends manually.
- **Prerequisites:**
  - Chrome with Claude_in_Chrome MCP active, signed in to bakesiganajjuma@gmail.com
  - Gmail MCP authed to allanbakesiga@gmail.com
- **Stops cleanly:** if browser or Gmail unreachable, abort with a report; don't loop.

### `nejm-neurology-daily` (unrelated to USMLE, but currently on cron)

- **Cron:** `0 7 * * 1` (every Monday at 7:02 AM)
- Downloads NEJM neurology papers, classifies into subfolders, generates podcasts. Lives at `/Users/allanbakesiga/.claude/scheduled-tasks/nejm-neurology-daily/SKILL.md`.

### System crontab (also relevant)

```
17 9 * * 5 /opt/homebrew/bin/python3 "…/Neurology/generate_podcast.py" >> "…/podcast_log.txt" 2>&1
17 * * * * /Users/allanbakesiga/.claude/dashboard/cron_refresh.sh
```

The hourly `cron_refresh.sh` refreshes a local dashboard cache. The Friday podcast generator runs an unrelated neurology podcast pipeline.

---

## 8. The cohort-management skill (operational rubric)

- **Path:** `/Users/allanbakesiga/.claude/skills/usmle-cohort-management/SKILL.md`
- **Trigger:** any user request that touches Sheet A, Sheet B, the email templates, payment tracking, or reconciling Gmail.
- **Summary of the seven-step rubric:**

  1. **Refresh both sheets** with `Cmd+R` before reading (cached views miss new submissions; wait ~3s).
  2. **Identify green (done) vs white (new) rows.** Zoom in tight when the boundary is unclear. Selection overlay tints rows cyan — always deselect before judging.
  3. **Cross-reference Gmail** with `in:sent (to:<email1> OR to:<email2>)` BEFORE drafting. Some students email Allan directly first.
  4. **Draft emails** with the style rules from §5. Confirmation emails always reference an attached flyer; reveal the PDF in Finder for drag-attach.
  5. **Verify drafts vs sent** with both `list_drafts` and `search_threads in:sent newer_than:1d` before claiming sent.
  6. **Mark rows green** using paste-special-format-only from a known-green source row. Never use the fill palette or eyedropper.
  7. **Final reconciliation:** one-screen summary per sheet: `rows X–Y all green (N students), outstanding: <none | row Z reason>`.

The skill includes a self-checklist before signing off (em dashes, flyer attached, Gmail cross-checked, drafts-vs-sent verified, etc.).

---

## 9. MCPs required

| MCP | Purpose | Auth |
|---|---|---|
| **Gmail** (`mcp__e422b0cc-…`) | search_threads, create_draft, list_drafts | OAuth: allanbakesiga@gmail.com |
| **Google Calendar** (`mcp__f760d012-…`) | optional (not currently used in this workflow) | OAuth: same |
| **Claude in Chrome** (`mcp__Claude_in_Chrome__*`) | drives Google Sheets, Calendly, GitHub UIs, giscus.app | Browser signed into bakesiganajjuma@gmail.com |
| **scheduled-tasks** (`mcp__scheduled-tasks__*`) | runs `usmle-auto-outreach` every 6 hours | Local |

Tools to expect (load via ToolSearch as needed in Cowork):

- `mcp__Claude_in_Chrome__tabs_context_mcp`, `navigate`, `computer`, `read_page`, `javascript_tool`
- `mcp__e422b0cc-…__create_draft`, `search_threads`, `list_drafts`, `get_thread`
- `mcp__scheduled-tasks__list_scheduled_tasks`, `create_scheduled_task`, `update_scheduled_task`

---

## 10. Public-facing assets

- **Dashboard (live):** https://bakesiga.github.io/usmle-dashboard
- **GitHub repo:** https://github.com/Bakesiga/usmle-dashboard
- **WhatsApp class group:** https://chat.whatsapp.com/JvaTpyDt9loGZjomAVwi42
- **Calendly office hours:** https://calendly.com/allanbakesiga/usmle-office-hours
- **Zoom (daily class):** https://duke.zoom.us/j/96991939005
- **Zoom (office hours):** https://duke.zoom.us/j/95347253995
- **Sign-up form:** https://forms.gle/iHCdPVjvJeGeGTXy7

---

## 11. Repo layout on Allan's Mac

```
~/.claude/
├── skills/
│   ├── usmle-cohort-management/SKILL.md      ← the operational rubric
│   ├── nejm-neurology/SKILL.md
│   └── notebooklm/SKILL.md
├── scheduled-tasks/
│   ├── usmle-auto-outreach/SKILL.md          ← cron 13 */6 * * *
│   ├── nejm-neurology-daily/SKILL.md
│   └── nejm-neurology-weekly/
├── usmle-dashboard/                           ← the GitHub Pages repo
│   ├── README.md
│   ├── admin.py
│   ├── configure.py
│   ├── dashboard.html · index.html · signin.html
│   ├── css/  js/  images/
│   ├── data/
│   │   ├── sessions.json                      ← 30-session curriculum (4 chapters)
│   │   └── schedule.ics                        ← built by build_ics.js
│   └── outputs/
│       ├── email-templates/
│       │   ├── outreach.html
│       │   ├── confirmation-uganda.html
│       │   └── confirmation-international.html
│       ├── flyers/
│       │   ├── build_june_advert.js · USMLE_June_Advert.{pptx,pdf,jpg}
│       │   ├── build_june_teaser.js · USMLE_June_Teaser.{pptx,pdf,jpg}
│       │   ├── build_june_curriculum.js · USMLE_June_Curriculum.{pptx,pdf,jpg}
│       │   ├── build_june_explainer.js · USMLE_June_Explainer.{pptx,pdf,jpg}
│       │   ├── build_june_reminder.js · USMLE_June_Reminder.{pptx,pdf,jpg}
│       │   ├── allan_circle.png · signup_qr.png · whatsapp.png
│       │   └── …
│       ├── scripts/build_ics.js               ← generates data/schedule.ics from sessions.json
│       ├── payments/payments_tracker.csv      ← snapshot of Sheet C
│       └── cowork-export/                     ← this folder (handoff bundle)
└── dashboard/cron_refresh.sh                   ← hourly refresh script
```

---

## 12. Current state snapshot (as of 2026-05-17)

### Sheet A — Enrolment Interest
~52 rows, **all processed**. Last entry: David Okiror (5/12).

### Sheet B — Confirmation
**41 rows**, mostly processed. Status notes:
- Row 29: Suzan Asinde — invalid email (filled "Yes" in email field). Allan to contact via WhatsApp +256789561545.
- Row 33: ASINGUZA DAVID — duplicate of row 31 (skip).
- Row 40: Humphrey Kabugo — confirmation draft already in Drafts, awaiting send.
- Row 41: Jibril Amir Mohammed — confirmation draft created 2026-05-17.

### Sheet C — Payment Tracker
| # | Student | Country | Paid | Balance | Status |
|---|---|---|---|---|---|
| 1 | Lindah Namatovu | Uganda | UGX 350,000 | 0 | Paid in Full |
| 2 | Moses Tenywa | Uganda | UGX 100,000 | UGX 250,000 | Partial deposit |
| 3 | Lynn (Cousin) | Uganda | — | — | Comp |
| 4 | Fredrick | Uganda | UGX 350,000 | 0 | Paid in Full |

### Outstanding action items (Allan's hand)
- Send Fredrick receipt-reply (draft exists)
- Send Humphrey Kabugo confirmation (draft exists)
- Send Jibril Amir Mohammed confirmation (draft exists)
- Contact Suzan Asinde via WhatsApp +256789561545
- Authorize IMPORTRANGE on Payment Tracker (Confirmation + Enrollment tabs currently show #REF!)
- Install giscus GitHub app on Bakesiga/usmle-dashboard (paused at password prompt)
- Customize Calendly availability hours (still M-F 9-5 ET default)
- Clarify "Allan Julian" payment reference

---

## 13. Bootstrap commands for Cowork

```bash
# 1. Place the cohort-management skill where Claude finds it
mkdir -p ~/.claude/skills/usmle-cohort-management
cp skill_usmle-cohort-management.md ~/.claude/skills/usmle-cohort-management/SKILL.md

# 2. Place the scheduled-task SKILL
mkdir -p ~/.claude/scheduled-tasks/usmle-auto-outreach
cp task_usmle-auto-outreach.md ~/.claude/scheduled-tasks/usmle-auto-outreach/SKILL.md

# 3. Register the cron job via the scheduled-tasks MCP
#    (in Cowork, ask the agent: "create the usmle-auto-outreach cron at 13 */6 * * *")

# 4. Restore email templates
mkdir -p ~/usmle/email-templates
cp outreach.html confirmation-uganda.html confirmation-international.html ~/usmle/email-templates/

# 5. Restore the flyer pipeline (requires Node + pptxgenjs + LibreOffice + pdftoppm)
npm install pptxgenjs
cp build_june_*.js allan_circle.png signup_qr.png whatsapp.png ~/usmle/flyers/
# rebuild each flyer:
for f in teaser advert curriculum explainer reminder; do
  cd ~/usmle/flyers && node build_june_${f}.js
  /Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf USMLE_June_$(echo $f | sed 's/.*/\u&/').pptx
  pdftoppm -jpeg -r 144 USMLE_June_$(echo $f | sed 's/.*/\u&/').pdf USMLE_June_$(echo $f | sed 's/.*/\u&/')
done

# 6. Restore curriculum data
mkdir -p ~/usmle/data
cp sessions.json ~/usmle/data/

# 7. Restore payment tracker snapshot
cp payments_tracker.csv ~/usmle/
# Upload to Google Drive as a Sheet OR re-import into the existing Sheet C
```

---

## 14. Sanity-check prompts for the new Cowork agent

Run these four after bootstrapping. If all four succeed, the migration is complete.

1. `"check the spreadsheets"` → triggers the cohort-management skill, refreshes both sheets, lists white rows.
2. `"draft outreach for <new-email>"` → produces a no-em-dash email matching `outreach.html`.
3. `"run the usmle auto-outreach now"` → executes the scheduled-task prompt and produces drafts only (no sends).
4. `"open the june reminder flyer in finder"` → runs `open -R outputs/flyers/USMLE_June_Reminder.jpg`.

---

## 15. Things to flag every session (skill checklist)

Before signing off any session, the agent should verify:

- [ ] Flyer attached to every confirmation draft (or Allan told to drag-attach manually)
- [ ] No em dashes anywhere in drafted bodies
- [ ] Gmail cross-referenced before drafting (not just sheet)
- [ ] Draft vs Sent status verified before saying "emails sent"
- [ ] All confirmed-sent white rows recolored green
- [ ] Direct-email contacts checked (people who never filled the form)
- [ ] Countdown on flyers refreshed (`DAYS_TO_GO` in `build_june_*.js`) if rebuilding

---

## 16. Known sharp edges

1. **Google Sheets is canvas-rendered.** DOM scraping returns nothing useful. Always use the screenshot + Name-box-jump pattern from the skill rubric.
2. **PDF attachments don't pass through `create_draft`.** Always use the Finder drag-attach workaround.
3. **Selection overlay tints rows cyan.** Deselect before judging if a row is green.
4. **Fill-color palette green ≠ Allan's green.** Use paste-special-format-only from a known-green source row.
5. **Em dashes** are forbidden — Allan has hard-corrected this multiple times.
6. **The same student can land in Sheet A, Sheet B, Gmail, and WhatsApp.** Always reconcile across all four.
7. **The countdown in flyers is hardcoded, not dynamic.** Bump it down by 1 each day before rebuilding.
8. **System clock has drifted before.** If `date` says a wrong day, hardcode the countdown rather than computing it.

---

End of handoff document.
