# Carey Coombs: what a student actually does

Every screen, every control, in the order a student meets them. Two routes:
**Sit one with the timer** (`nbme-sit.html`), where they answer in the page, and
**Mark one you have sat** (`nbme-form.html`), where they only record what they
got wrong on a paper they already did.

---

## Part 0. Getting in

Same for both routes. There is no separate NBME account.

1. **Open the dashboard.** `bakesiga.github.io/usmle-dashboard/dashboard.html`.
2. **Sign in with Google.** One button. Their address is checked against
   `data/allowlist.json`. Not on it, nothing opens.
3. **The chooser.** Two tiles: Graham Steell and Carey Coombs. Carey Coombs is
   only there if their allowlist entry carries `nbme: true`, which is set from
   the November tab of the Payment Tracker. Without it there is one tile and no
   sign the NBME phase exists.
4. **Carey Coombs, then The eight forms.** The panel shows the eight papers,
   which one is live this week, and three ways on:
   - *Sit one with the timer* → Part 1
   - *Mark one you have sat* → Part 2
   - *The papers* → the shared Drive folder with the eight PDFs
5. **Both pages check again.** `nbme-sit.html` and `nbme-form.html` sit on their
   own URLs, so each re-reads the session and the allowlist. A student without
   November gets a short page saying this is part of the NBME phase, not the exam.

---

## Part 1. Sit one with the timer

### 1.1 Setup screen

- **Eight form buttons.** NBME 27 to 34, but only the form whose sitting
  weekend has arrived can be tapped. The rest are greyed, carry the date they
  open, and a line under the picker says when the next one does. Today that
  means NBME 27 only. A form stays open after its weekend, so anyone catching
  up on an earlier one still can.
- **The split note**, only for a form carrying a due date. For NBME 27 it reads:
  sit block 1 on its own, finish blocks 2, 3 and 4 any time before Wednesday 4
  November, each block timed on its own, result goes in once after block 4.
- **The pace**, fixed. 75 minutes, a minute and a half a question. No picker.
- **Resume line**, only if a sitting is already saved in this browser. It names
  the form, where they stopped (part way through block 2 / blocks 1 to 2 done,
  2 to go / all four done, waiting to be marked), how many of 200 are answered,
  the deadline, and whether the clock ran out while the page was closed.
- **Start block 1.** Disabled until a form is picked. If a sitting is already
  saved it asks to confirm before discarding it.
- **Pick up where I left off.** Goes to wherever they actually were: the marking
  screen, the break screen, or, if a block's clock expired while they were away,
  straight into that block's review rather than handing back a fresh 75 minutes.

### 1.2 The exam screen

Header: **Block N, item N of 50**, and the **clock** counting down from 75:00.
Under five minutes it turns and says "under 5 min".

Controls:

| Control | What it does |
|---|---|
| **A to J** (ten buttons) | Records their letter. Tapping the same letter again clears it. |
| **Mark for review** | Flags the question. Shows as flagged in the block review. |
| **Lab values** | Opens the docked lab table. Four tabs: Serum, Cerebrospinal, Blood, Urine and BMI. Scrolls on its own, stays open across questions, remembers whether it was open. |
| **Review this block** | Jumps to the block review without answering the rest. |
| **Back** | Previous question. Disabled on the first of the block. |
| **Next** | Next question. On item 50 it reads "Review block" and goes there. |

Keyboard, which is what a student sitting properly will use:

- **A to J** answer, same toggle as the buttons
- **→** next, **←** back
- **M** mark for review (not F, because F is an answer choice)
- **L** open or close lab values
- **Esc** closes lab values from anywhere

With the lab table open the arrows belong to the table, so scrolling the serum
list cannot skip them onto the next question.

Two things run quietly: every question's **seconds** are counted and kept, and
the whole state is saved on every answer, every flag, every move. Closing the
tab mid-block raises the browser's "leave site?" warning.

**If the clock runs out:** the block jumps to its review by itself, the squares
stop being clickable, and the only way on is Continue.

### 1.3 Block review

A grid of 50 squares, numbered **1 to 50**, the way the block is numbered on
the paper. An answered square keeps its number and adds the letter, reading as
"12 then D". An unanswered square is pale and shows the number alone. A dot in
the corner means flagged. The line above says how many of the 50 are still
unanswered.

- **Tap any square** to go back to that question, clock still running.
- **Back to questions** returns to where they were.
- **End block** closes it. If anything is unanswered it asks first.

When time ran out, Back to questions is gone and End block reads Continue.

### 1.4 The break

After blocks 1, 2 and 3.

- Says how many blocks are left, and that the next clock starts when they tap
  and does not stop, so start it when they have 75 clear minutes. For a form
  with a due date it adds that they can stop here and come back before it.
- **Start the next block** begins block N+1 on a fresh 75 minutes.
- **Save and come back later** writes the note: how many blocks are left, the
  deadline, that they must come back in this browser on this device, that
  nothing is sent until all four are marked, and a link back to the dashboard.

After block 4 there is no break. It goes straight to marking.

### 1.5 Marking

Four sections, one to a block, each numbered **1 to 50** so it lines up with
the answer page they are reading. Each row: the **question number**, **the letter
they chose** (a dash if they left it blank), and a **wrong** toggle. The number
sent to Allan is still 1 to 200, which is what the topic maps are keyed on. Only
the label changes.

- Blanks are marked wrong already, so a timed-out block can never be sent as a
  clean 200.
- **With an answer key loaded** for that form, every miss is filled in and they
  only check it over. Questions the key does not cover are named in the line
  above and handed back to them to check.
- **Without a key**, they open the NBME answer page and tap each one they got
  wrong, with their own letter in front of them as they go.
- Tapping a row toggles it either way.

Bottom bar: **N wrong**, and **X of 200 correct, Y%**, live.

**Send my result.** If nothing is marked wrong it asks whether to send a clean
200 out of 200.

### 1.6 What is sent, and what they see

Posted to the collector: form, email, name, the wrong list, total, timestamp,
plus the things only the timer can know, their 200 answers as a string, the
seconds on each question, the flagged list, 75, and `source: sit`.

The done screen shows their score and confirms it was sent. If the send failed
it shows a one-line backup, `NBME27 | their@email | wrong: 3,15,34...`, to send
on WhatsApp.

---

## Part 2. Mark one you have sat

For a paper they did offline. Same sign-in and same gate.

1. **Mark your NBME.** The line under it: tap only the questions you got wrong,
   anything left alone counts as correct, most people tap 40 to 70 of the 200.
2. **Pick the form.** Eight buttons, with the same rule: only a form the class has reached can be marked.
3. **Four blocks of 50 numbered buttons.** Each block headed "Block N, questions
   1 to 50" and numbered 1 to 50 within itself. Tap a number to mark it wrong, tap
   again to clear.
4. **Running tally** at the bottom, the count and the percent.
5. **Send my result.** Disabled until a form is picked. If nothing is marked it
   asks whether to send a clean 200.
6. **Receipt**, with the score, and the same backup line if the send did not land.

What this route does not have, by design: no timer, no answers captured, no
seconds, no flags, no lab values, no marking against the key. It records misses
only, which is all a paper sitting can give.

---

## After a send, both routes

The row lands in the submissions sheet: timestamp, email, name, form, total,
right, wrong, percent, and the wrong question numbers. The tutor view reads that
sheet once the reader is deployed, and the corrections week is taught off the
miss counts.

---

## Three gaps in this flow as it stands

1. **A half-finished sitting is saved to the browser, not to the student.** The
   key is a single `usmle.nbme.sit.v1` and signing out does not clear it. On a
   shared laptop, student B can be offered student A's unfinished paper and
   submit it under B's address. The same person cannot start on a laptop and
   finish on a phone.
2. **The done screen promises a breakdown that does not arrive by itself.** It
   says the report by system and discipline is on the dashboard, but My results
   reads `NBME.results` in `js/data.js`, which is typed by hand. Until a result
   is in there, the student sends and sees nothing come back.
3. **Tutor submissions pool into the class numbers.** The roster excludes
   tutors; `missCounts` and `cohortReport` do not. Once the reader is live, a
   test sit counts as class data.
