# USMLE Cohort Management — Cowork Migration Pack

Everything needed to recreate this workflow inside Cowork (or any other Claude Agent SDK environment).

Last exported: 2026-05-13

---

## 1. Overview of the system

Allan Bakesiga runs a **USMLE Step 1 prep cohort starting June 1, 2026**, delivered via daily Zoom classes. The intake flow has four entry points and three outcomes.

### Intake → Outcome flow

```
Interest Form (Sheet A)  ─┐
Confirmation Form (Sheet B) ─┼─► Outreach email ─► Confirmation email ─► Payment ─► Dashboard onboarding ─► First class
Direct email (Gmail)      ─┤
WhatsApp DM/group        ─┘
```

### Three sheets

| Sheet | Purpose | URL |
|---|---|---|
| **A. Enrollment Interest** | Initial sign-ups (Google Form) | https://docs.google.com/spreadsheets/d/1Lqms7y406_f5Tj7fdSunNmeRfyzA-aYP1bCZ7aJNUps/edit |
| **B. Confirmation Form** | Spot confirmations (Google Form, Uganda + international) | https://docs.google.com/spreadsheets/d/1rNenHKC_chTZ3InJ7awOATwpG2MACbb9M1tl8BmVQXo/edit |
| **C. Payment Tracker** | Manual payment log (Lindah, Moses, ...) | https://docs.google.com/spreadsheets/d/1zkURBFRBC_1CBMiLjvS5RQACfVdh8e_qxjiOUMh_moM/edit |

The Confirmation form URL students fill in: **https://forms.gle/iHCdPVjvJeGeGTXy7**

### Public-facing assets

- **Dashboard**: https://bakesiga.github.io/usmle-dashboard
- **GitHub repo**: https://github.com/Bakesiga/usmle-dashboard
- **WhatsApp group**: https://chat.whatsapp.com/JvaTpyDt9loGZjomAVwi42
- **Calendly office hours**: https://calendly.com/allanbakesiga/usmle-office-hours
- **Zoom (class)**: https://duke.zoom.us/j/96991939005
- **Zoom (office hours)**: https://duke.zoom.us/j/95347253995

### Key fee / payment info

| | Uganda | International |
|---|---|---|
| Tuition | UGX 350,000 / month | USD 200 / month |
| First month | Due in full by May 30 (June 1 cohort start) | Same |
| Channel | Mobile Money: 0705 571 443 (Bakesiga Allan) | Wise / PayPal / other |

---

## 2. MCPs to reconnect in Cowork

| MCP | What it does | Auth needed |
|---|---|---|
| **Gmail** | search_threads, create_draft, list_drafts | OAuth: allanbakesiga@gmail.com |
| **Google Calendar** | (not used in current automation, but useful) | OAuth |
| **Chrome / browser automation** | Drives Google Sheets, Calendly, giscus.app | Browser signed into the right Google account |
| **scheduled-tasks** | Runs auto-outreach every 6 hours | Local (no auth) |
| **Notion / Atlassian / etc.** | Not used | n/a |

Source-sheet owner is `bakesiganajjuma@gmail.com`. Browser must be signed into that account when reading/writing Sheet A or Sheet B.

---

## 3. Files to copy across

Bundled in this export folder:

- `skill_usmle-cohort-management.md` — the operational rubric
- `task_usmle-auto-outreach.md` — the scheduled-task prompt (runs every 6 hours)
- `outreach.html` · `confirmation-uganda.html` · `confirmation-international.html` — email templates with `{NAME}` placeholder
- `build_june_advert.js` · `build_june_teaser.js` · `build_june_curriculum.js` — pptxgenjs flyer scripts
- `build_ics.js` — generates `data/schedule.ics` from `data/sessions.json`
- `sessions.json` — June curriculum data (30 sessions across 4 chapters)
- `payments_tracker.csv` — current payment state (Lindah + Moses)
- `allan_circle.png` · `signup_qr.png` · `whatsapp_qr.png` — photo + QR codes

Original locations on Allan's Mac (for re-import):

```
~/.claude/skills/usmle-cohort-management/SKILL.md
~/.claude/scheduled-tasks/usmle-auto-outreach/SKILL.md
~/.claude/usmle-dashboard/outputs/email-templates/
~/.claude/usmle-dashboard/outputs/flyers/
~/.claude/usmle-dashboard/outputs/scripts/build_ics.js
~/.claude/usmle-dashboard/data/sessions.json
~/.claude/usmle-dashboard/outputs/payments/payments_tracker.csv
```

---

## 4. The operational rubric (skill)

See `skill_usmle-cohort-management.md`. Summary:

1. **Refresh both sheets** with Cmd+R before reading (cached views miss new submissions).
2. **Identify green vs white rows** (green = done, white = new).
3. **Cross-reference Gmail** before drafting — some students email Allan directly first.
4. **Draft emails** with rules:
   - No em dashes.
   - Greeting "Hi <FirstName>,".
   - Sign-off "Allan" (full credentials in signature block).
   - htmlBody (not plain body).
5. **Attachments:**
   - Outreach: no flyer.
   - Confirmation (Uganda + International): **attach `USMLE_June_Advert.pdf`** — template literally says "The attached flyer..."
   - Use `open -R` to reveal the flyer in Finder so Allan can drag-attach (PDF base64 is too large to pass through tool calls).
6. **Verify drafts vs sent** with both `list_drafts` and `search_threads in:sent newer_than:1d` before claiming sent.
7. **Mark rows green** using paste-special-format-only (copy a known-green cell, paste format only onto target rows). Do NOT use the fill palette or eyedropper.
8. **Final reconciliation** at the end of every session.

---

## 5. The auto-outreach scheduled task

See `task_usmle-auto-outreach.md`. Runs every 6 hours via cron `13 */6 * * *`. Drafts only — never sends. Allan reviews and sends manually.

---

## 6. Current state snapshot (as of 2026-05-13)

### Sheet A — Enrollment Interest (52 rows, all processed)
Last entry: David Okiror (5/12). 51 unique sign-ups across May 2–12. All have had outreach emails sent.

### Sheet B — Confirmation (19 rows, all processed)
Last entry: Rhina Thatcher Nabbosa (5/12). 18 confirmations. All have had "confirmation received" emails sent. **Caveat**: rows 16–18 (Brenda, Diana, Shiba) were sent without the flyer attached — follow-up drafts exist in Drafts.

### Sheet C — Payments (2 entries, manual)
| # | Student | Paid | Balance | Status |
|---|---|---|---|---|
| 1 | Lindah Namatovu | UGX 350,000 | 0 | Paid in Full (May 11 — confirm exact amount) |
| 2 | Moses Tenywa | UGX 100,000 | UGX 250,000 | Partial deposit (May 13) |

### Direct-email contacts (not on any sheet)
| Person | Status |
|---|---|
| Isaac Maiko | Outreach + confirmation both sent May 13 |
| Maiko Isaac | Earlier direct email; followed up May 13 |
| Mable Regina Nagawa | Replied "Yes, I confirm" on May 11 but never filled the form; **needs payment-details email** |

### Pending action items (Allan's hand)
- Send updated Moses draft (3 drafts exist — keep newest, delete older 2)
- Send (or delete) the 3 Brenda/Diana/Shiba flyer follow-up drafts
- Send Lindah dashboard-onboarding email (promised May 11)
- Decide on Mable Regina (send payment email)
- Authorize IMPORTRANGE in the Payment Tracker (Confirmation + Enrollment tabs show #REF!)
- Install giscus GitHub app on Bakesiga/usmle-dashboard (paused at password prompt)
- Customize Calendly availability hours (still M-F 9-5 ET default)
- Clarify "Allan Julian" reference for 3rd payment row

---

## 7. Style notes

- **Em dashes are banned** in any email body. Use commas, colons, periods, parentheses. Allan has called this out twice — hard rule.
- **Signature block (verbatim, all emails):**
  ```
  Allan Bakesiga
  MD (Makerere) · MScGH (Duke)
  Past Teaching Assistant, Epidemiology & Biostatistics, Duke Global Health Institute
  Research Assistant, Duke Global Neurosurgery and Neurology
  PGY-1 Neurology, Creighton
  ```
- **Sign-off line:** plain `Allan` (the credentials follow in the signature block; never end with "Allan Bakesiga, MD").

---

## 8. Bootstrap commands for Cowork

```bash
# After installing this pack into a Cowork workspace:

# 1. Place the skill where Claude finds it
mkdir -p ~/.claude/skills/usmle-cohort-management
cp skill_usmle-cohort-management.md ~/.claude/skills/usmle-cohort-management/SKILL.md

# 2. Place the scheduled-task SKILL
mkdir -p ~/.claude/scheduled-tasks/usmle-auto-outreach
cp task_usmle-auto-outreach.md ~/.claude/scheduled-tasks/usmle-auto-outreach/SKILL.md
# Then create the cron registration (manual: CronCreate at "13 */6 * * *")

# 3. Restore email templates
mkdir -p ~/usmle/email-templates
cp outreach.html confirmation-uganda.html confirmation-international.html ~/usmle/email-templates/

# 4. Restore flyer pipeline (requires Node + pptxgenjs)
npm install pptxgenjs
node build_june_teaser.js
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf USMLE_June_Teaser.pptx
pdftoppm -jpeg -r 144 USMLE_June_Teaser.pdf USMLE_June_Teaser

# 5. Restore data
mkdir -p ~/usmle/data
cp sessions.json ~/usmle/data/

# 6. Restore payment tracker
cp payments_tracker.csv ~/usmle/  # then upload to Google Drive as a Sheet
```

---

## 9. Sanity-check prompts for the new agent

After bootstrapping, run these to confirm everything works:

1. `"check the spreadsheets"` → should auto-trigger the cohort-management skill, refresh both sheets, list white rows
2. `"draft outreach for <new email>"` → should produce a no-em-dash email matching `outreach.html`
3. `"run the usmle auto-outreach now"` → should execute the scheduled task prompt and produce drafts only (no sends)
4. `"open the june teaser flyer in finder"` → should run `open -R outputs/flyers/USMLE_June_Teaser.jpg`

If those four work, the migration is complete.
