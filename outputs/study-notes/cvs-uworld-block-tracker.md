# CVS · UWorld block tracker + workflow

**Allan-only · NOT in Drive · Working doc for the June cohort build-out**

This file does two jobs:
1. Tells you exactly how to create each UWorld block so I can process it the same way we did Days 2 + 3.
2. Tracks which blocks have been opened, processed, and folded into the dashboard.

---

## Block-creation workflow (do this for every new day)

### 1. Create the test in UWorld

1. Sign in to UWorld → **My Account** → **My Tests** → **Create New Test**.
2. **Test mode:** Tutor mode (so the explanation shows as you go — we want to read the explanations together).
3. **Question mode:** Unused (so we don't re-see anything from Days 2–3 physio).
4. **Timing:** Untimed.
5. **Number of questions:** match the "Target Qs" column in the table below for that day (15–35 depending on topic).
6. **Subject:** check **Cardiovascular System**.
7. **Systems / sub-topics:** check ONLY the categories listed for that day in the table below. Don't mix days — one day = one block (split AM/PM if size > 25).
8. Click **Generate Test** → **Start Test**.
9. UWorld opens the test interface in a new tab.

### 2. Hand the block to me

1. Find the new UWorld tab in Chrome.
2. Drag it into the MCP-controlled window — that's the window with the green "Claude is connected" indicator at the bottom of the screen.
3. Tell me "block ready" (or just paste the URL) — I'll confirm via `tabs_context_mcp` and start clicking through Q-by-Q.

### 3. What I produce on my end

For each block I'll deliver, same template as Days 2–3:
- **Concept-per-Q running list** during the click-through (one line per Q, original wording — no UWorld stems verbatim).
- **Consolidated concept map** when the block ends.
- **Day-X-high-yield.html** + matching PDF (1-page summary with traps).
- **Day-X-flashcards.html** + matching PDF (~50–70 Q+A cards).
- **Day-X outline** wired into `data.js` with FA page references.
- **Day-X teaching-flow.md** for your prep (local, not in Drive).
- **Drive upload + dashboard wire-up** to the per-day subfolder in `01 · Cardiovascular`.

### 4. Keep me honest

Update the **Status** column in the table below as we go. Possible values:
- `planned` — not yet opened.
- `block-open` — UWorld block created and shared into the MCP tab; click-through pending.
- `in-progress` — I'm walking through Qs right now.
- `synthesized` — concept map + HTML + PDFs built locally.
- `live` — uploaded to Drive + wired into `data.js` + pushed to `bakesiga.github.io/usmle-dashboard` + visible on the day's Today panel.

---

## Block plan + live tracker

| Day | Date | Title | UWorld filter | Target Qs | Status | Block URL / notes |
|-----|------|-------|---------------|-----------|--------|-------------------|
| 1 | Jun 1 | Cardiac anatomy & embryology | — (anatomy/embryo via FA only; no Q-bank block) | — | **live** | n/a |
| 2 | Jun 2 | Pumping mechanics — CO, PV loops, sounds & valves | Custom physio filter | 40 | **live** | done — block 1 of physio set |
| 3 | Jun 3 | Cardiac electrics — APs, ECG, arrhythmias & shock | Custom physio filter | 36 | **live** | done — block 2 of physio set |
| **4** | **Jun 4** | **HTN, vascular pathology & aortic disease** | **Hypertension** + **Aortic & peripheral artery diseases** + **Miscellaneous** | **31** *(actual)* | **walkthrough done — synthesis pending** | UWorld test 424922169 — all 31 Qs concept-mapped; ready to build high-yield + flashcards + outline |
| **5** | **Jun 5** | **Ischemic heart disease — angina to MI** | **Coronary heart disease** | **28** *(actual)* | **walkthrough done — synthesis pending** | UWorld test 424923955 — all 28 Qs concept-mapped |
| **6** | **Jun 6** | **Heart failure & shock — clinical management** | **Heart failure and shock** | **20** | planned | — |
| **7** | **Jun 7** | **Cardiomyopathies & myocarditis** | **Myopericardial diseases** — filter "Unused" then pick the CMP / myocarditis questions (skip pericardial) | **~22** | planned | Manually skip pericardial Qs as you go; flag any you'd rather see on Day 9 |
| **8** | **Jun 8** | **Valvular & rheumatic heart disease + endocarditis** | **Valvular heart diseases** | **35** *(split AM 17 + PM 18)* | planned | — |
| **9** | **Jun 9** | **Pericardial disease, cardiac tumors & inherited arrhythmias** | **Myopericardial diseases** (pericardial + tumors leftover) + **Cardiac arrhythmias** | **~31** | planned | Same Myopericardial filter as Day 7 — pick the pericardial / myocarditis / tumor Qs not yet seen |
| **10** | **Jun 10** | **Congenital heart disease** | **Congenital heart disease** | **20** | planned | — |

**Total CVS Q-bank questions to process across Days 4–10:** ~187 (out of the 198 UWorld CVS pool; the remaining 11 are basic-physiology questions already covered in Days 2–3 or in the Misc. bucket).

---

## Splitting big blocks (Day 4, Day 8)

For days with > 25 questions, split into **morning** and **afternoon** sub-blocks. Procedure:
1. Create a single UWorld block of full size (e.g., 35 for Day 8).
2. The block has a built-in "Suspend Test" button — students do half before class, the other half after lunch/dinner.
3. When you hand it to me, I'll click through all questions in one MCP session (~10–15 min per Q × 35 = a couple of hours; I'm fine to chunk it).

---

## What I do NOT do until you say so

- **No drug / pharmacology coverage yet.** Days 4–10 outlines and class materials currently exclude pharmacology slots. When you're ready to add drugs (probably after Day 10), tell me and I'll fold them in as a separate "CVS Pharmacology" supplementary block.
- **No respiratory or pathology days yet** — focus stays on CVS through Day 10.

---

## When all 10 CVS days are live

Once Day 10 is wired, send a "wrap CVS" cue and I'll:
1. Build a CVS-wide cumulative review block (~40 mixed Qs — a synthesis test).
2. Generate a CVS chapter master 1-pager + master flashcards (~150 cards) covering Days 1–10.
3. Hand you a transition plan into Respiratory (Days 11–18).

---

## Quick reference — how to keep this file current

When you finish creating a UWorld block:
```
Update "Status" column → block-open
Paste the URL into "Block URL / notes"
Tell Claude "Day X block ready"
```

When Claude finishes synthesis:
```
Status → synthesized (Claude updates)
After Drive upload + dashboard push → live (Claude updates)
```
