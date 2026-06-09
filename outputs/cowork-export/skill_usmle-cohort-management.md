---
name: usmle-cohort-management
description: Rubric for processing new USMLE class signups and confirmations. Triggers when Allan asks to check the spreadsheets, process new enrolments, draft outreach or confirmation emails, mark rows as resolved, or reconcile his Gmail with the two Google Forms (Interest = Sheet A, Confirmation = Sheet B). Use this skill any time the work touches the USMLE Class Enrolment Interest sheet, the USMLE Class Confirm Your Step 1 (June) Spot sheet, or the email templates in outputs/email-templates/.
---

# USMLE Cohort Management Rubric

This is the standard workflow for processing new responses on Allan's two USMLE class forms. Follow it in order. Each section ends with a CHECK — do not move on until the check passes.

## Inputs you must know before starting

| Item | Value |
|------|-------|
| **Sheet A (Interest form responses)** | `https://docs.google.com/spreadsheets/d/1Lqms7y406_f5Tj7fdSunNmeRfyzA-aYP1bCZ7aJNUps/edit` |
| **Sheet B (Confirmation form responses)** | `https://docs.google.com/spreadsheets/d/1rNenHKC_chTZ3InJ7awOATwpG2MACbb9M1tl8BmVQXo/edit` |
| **Confirmation form URL (for emails)** | `https://forms.gle/iHCdPVjvJeGeGTXy7` |
| **Dashboard URL** | `https://bakesiga.github.io/usmle-dashboard` |
| **Outreach template** | `/Users/allanbakesiga/.claude/usmle-dashboard/outputs/email-templates/outreach.html` |
| **Confirmation Uganda template** | `/Users/allanbakesiga/.claude/usmle-dashboard/outputs/email-templates/confirmation-uganda.html` |
| **Confirmation international template** | `/Users/allanbakesiga/.claude/usmle-dashboard/outputs/email-templates/confirmation-international.html` |
| **Flyer (attach to confirmations)** | `/Users/allanbakesiga/.claude/usmle-dashboard/outputs/flyers/USMLE_June_Advert.pdf` |
| **Fee, Uganda** | UGX 350,000/month, MoMo `0705 571 443`, name `Bakesiga Allan` |
| **Fee, international** | USD 200/month (Rose Cheptoo is the precedent) |

## Step 1 — Refresh both sheets before reading

Cached views miss recent submissions. Always:

1. Switch to each sheet tab and press `Cmd+R` to hard-reload
2. Wait ~3 seconds for the table to redraw
3. THEN take a screenshot

**Check:** the last row's timestamp on each sheet should be from today (or close to it). If it isn't, refresh again.

## Step 2 — Identify green (done) vs white (new) rows

- Green = email already sent for that entry
- White = needs action
- Zoom in tightly (`region: [0, ~boundary_y, 800, ~boundary_y+150]`) to see the boundary clearly. Shades near the rendering threshold can fool you without zoom.

**Check:** explicitly call out the row numbers that are white. Do not proceed until you have a definite list per sheet.

## Step 3 — Cross-reference Gmail BEFORE drafting

For each white row, search Gmail to see if Allan already has a thread with that email address. Use:

```
in:sent (to:<email1> OR to:<email2> OR to:<email3>)
```

This catches the common case where someone emailed Allan directly first (e.g. about "July–October cohort"), and the form-fill is a follow-up rather than a fresh introduction.

**Decision tree per Sheet A white row:**

- **No prior thread** → fresh outreach (template: `outreach.html`)
- **Prior thread asking about Step 1 / general enquiry** → reply on the existing thread, point at the confirmation form, do not paste the full outreach pitch
- **Prior thread + they already replied confirming** → they're past Sheet A; they likely need payment details (skip to Step 4 logic)
- **Combined Step 1 & 2 (expedited) requested** → use outreach.html BUT add the "Step 2 CK is paused, residency starting, Step 1 in June still on" framing in the opening paragraph

**Decision tree per Sheet B white row:**

- **Country = Uganda** → `confirmation-uganda.html` (UGX 350,000, MoMo)
- **Country ≠ Uganda** → `confirmation-international.html` (USD 200, ask which payment rail works)

**Check:** for every white row, you should be able to name the template you're using and why.

## Step 4 — Draft emails

Use the Gmail `create_draft` tool. **For each draft:**

### Required content rules

1. **No em dashes.** Use commas, colons, periods, parentheses. Allan has called this out twice — it is a hard rule.
2. **Greeting:** `Hi <FirstName>,` — use the name from column B of the sheet, not a fuller form.
3. **Signature block** (always include, verbatim):
   ```
   Allan Bakesiga
   MD (Makerere) · MScGH (Duke)
   Past Teaching Assistant, Epidemiology & Biostatistics, Duke Global Health Institute
   Research Assistant, Duke Global Neurosurgery and Neurology
   PGY-1 Neurology, Creighton
   ```
4. **Sign-off line:** `Allan` only (not `Allan Bakesiga, MD`). The full credentials come from the signature block right below.
5. **Use `htmlBody`** (not plain `body`) so formatting matches the templates.

### Attachment rules

| Email type | Attach the flyer? |
|------------|-------------------|
| Outreach (Sheet A new entries) | **No** — template doesn't reference an attachment |
| Confirmation, Uganda (Sheet B new entries) | **YES — attach `USMLE_June_Advert.pdf`**. The template literally says "The attached flyer has the full June schedule at a glance." A confirmation email without the flyer is broken. |
| Confirmation, international | **YES** — same reason |
| Reply to existing thread with payment details | **YES** — they will want the schedule |

If the PDF base64 is too large to pass directly through the tool call (it usually is, ~170KB → 161K tokens), do this instead:

1. Run `open -R /Users/allanbakesiga/.claude/usmle-dashboard/outputs/flyers/USMLE_June_Advert.pdf` to reveal it in Finder
2. Create the draft WITHOUT the attachment
3. Tell Allan in your reply: *"The flyer is open in Finder. Drag-drop `USMLE_June_Advert.pdf` into each Gmail draft before clicking Send."*

**Check:** before reporting "drafts created," reread your tool calls. Did each confirmation draft include the flyer or include the explicit instruction for Allan to attach it? If no, fix it.

### Replies vs new threads

- Use `replyToMessageId` to keep replies inside the existing thread (better deliverability and context). Use the *latest* message id from `search_threads`.
- Match the subject of the existing thread (with `Re:` prefix).
- For brand-new threads, pick a clear subject (e.g. "USMLE class, June Step 1 cohort" or "USMLE Step 1 (June cohort): confirmation received and next steps").

## Step 5 — Verify drafts vs sent status

After creating drafts, immediately run both:

```
list_drafts query: to:<email1> OR to:<email2> OR to:<email3>
search_threads query: in:sent (to:<email1> OR ...) newer_than:1d
```

**Three possible outcomes:**

| In drafts? | In sent? | Meaning |
|-----------|---------|---------|
| Yes | No | Normal — Allan still needs to review and send |
| No | Yes | Sent already (some drafts auto-route to Sent — unclear why, has happened with replies) |
| Yes | Yes | Probably duplicates — clean up |

Tell Allan exactly what you found ("3 drafts in Drafts, none in Sent" or "all 3 appear in Sent already") so he knows whether to click Send or whether work is done.

**Check:** never say "emails sent" unless you've confirmed via Gmail search. Drafts ≠ sent.

## Step 6 — Mark rows as resolved (green)

**Use paste-special-format-only.** Do NOT use the fill-color palette. The light green Allan uses is a specific custom shade and the palette greens (notably the one at column 5 row 2) come out teal. Eyedropper is unreliable in the browser MCP.

Sequence per sheet:

1. **Click a row known to be already-green** (e.g. on Sheet A, row 47; on Sheet B, row 15)
2. Select a small range like `A47:E47` via the Name box (`Cmd` + click Name box → type `A47:E47` → Enter)
3. `Cmd+C`
4. Click Name box → type target range like `A48:E50` → Enter
5. `Cmd+Option+V` (paste special → format only)
6. Click outside the selection to deselect, then zoom in to verify the colors match.

**Selection overlay caveat:** while a range is selected, the cells look more blue-cyan than green. Always deselect before judging the colour. We learned this the hard way.

**Check:** zoom into the boundary between a known-green row and the just-painted rows and confirm they're indistinguishable.

## Step 7 — Final reconciliation

End every session with a one-screen summary in this exact form:

```
Sheet A: rows X–Y all green (N students contacted). Outstanding: <none | row Z reason>.
Sheet B: rows X–Y all green (N confirmations acknowledged). Outstanding: <none | row Z reason>.
```

Then list anything still pending (e.g. "waiting for Allan to attach flyer + send", "international student needs payment rail clarification").

## Things to proactively flag every time

Before ending the conversation, scan back through your tool calls and ask yourself:

- [ ] Did I attach the flyer to every confirmation draft? (Or tell Allan to attach manually before sending?)
- [ ] Did I check for em dashes in every body I wrote?
- [ ] Did I cross-reference Gmail before drafting, or did I assume the sheet was the full story?
- [ ] Did I verify draft vs sent status before saying "emails sent"?
- [ ] Did I leave any white rows uncoloured after sends were confirmed?
- [ ] Are there any direct-email contacts (people who emailed Allan but never filled the form) who deserve a nudge? Check threads where Allan said "I'll send details in two weeks" etc.

If yes to anything missed, fix it before signing off.

## Common pitfalls Allan has caught before

1. **Missed a new row** because the sheet wasn't refreshed → always `Cmd+R` first.
2. **Drafted without the flyer** → confirmation emails need `USMLE_June_Advert.pdf`.
3. **Picked wrong green shade** from the palette → use paste-special-format-only.
4. **Said "all sent" when drafts were still in Drafts** → run list_drafts + in:sent search both.
5. **Wrong email captured** (e.g. `dudayeef` vs `dudayeef9`) → always copy email from the sheet, never type by memory.
6. **Reused old "MD" sign-off** when signature block already has `MD (Makerere)` → use plain `Allan` as sign-off.

## How students reach Allan

There are at least four entry points:
- **Interest form** → Sheet A
- **Confirmation form** → Sheet B
- **Direct email** to allanbakesiga@gmail.com
- **WhatsApp** (group and DM at +256 705 571 443)

Sheets are not the whole picture. Cross-reference Gmail every time.
