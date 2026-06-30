# Monthly student evaluation

A monthly check-in that tells you, in numbers, where your students are weakest
and what they want revisited. Built for June (Cardiovascular, Respiratory, Epi
and Biostats, General Pathology) and easy to clone for July onward.

The form takes a student about 25 minutes. It is gated behind the same class
sign-in as the dashboard, so only your students can open it, and it fills in
their email automatically.

## What it measures

1. **The month overall** — a rating, how well they understood it, and how their
   confidence changed since the start of the month.
2. **Teaching and support** — clarity, pace, recordings, dashboard, practice
   questions, support, workload (agree / disagree), plus a direct pace read.
3. **Confidence change per subject** — then versus now, for all four subjects.
4. **Understanding topic by topic** — 50 topics laid out the way First Aid
   groups them. The scale is deliberately not about mastery:
   `1 Lost · 2 Shaky · 3 Making sense · 4 Solid · 5 Confident · Skipped`.
   "Solid" means they can make sense of it and recognise it in a question, which
   is the level you asked for.
5. **Where to focus** — each student picks up to five topics to revisit, then a
   few short written questions (biggest blocker, what worked, what to change).

## How students reach it

`https://bakesiga.github.io/usmle-dashboard/evaluation.html`

It is also linked from the dashboard. Share that link in WhatsApp when the month
closes.

## Collecting the data (recommended path)

The form already works on its own: if no collector is connected, a student taps
"Send my answers on WhatsApp" or downloads a copy to send you. That is fine for a
handful of replies, but to get clean, aggregated data, connect the collector.

1. Open **collector.gs** in this folder and follow the 5 steps in its header
   comment. It takes about 5 minutes, once.
2. It creates two tabs in a Google Sheet:
   - **Responses** — one row per student, every answer in its own column.
   - **Focus** — rebuilt on every submission, all 50 topics **sorted weakest
     first**.

### Reading the Focus tab

The first rows are where to spend next month. Columns:

| Column | Meaning |
| --- | --- |
| Avg understanding (1-5) | Class average self-rating. Low is weak. |
| Responses | How many students rated it (excludes those who skipped). |
| Struggling (rated 1-2) | How many are genuinely lost on it. |
| Revisit requests | How many actively asked you to revisit it. |
| Skipped / absent | How many missed that class. A high number flags an attendance gap, not a teaching gap. |

A topic that is both low on understanding **and** high on revisit requests is
your clearest signal to reteach. A topic with a high skipped count needs a
recording nudge, not a reteach.

## Alternative: a plain Google Form

If you would rather use a standard Google Form (less polished, but native charts
and zero connecting step), run **build-google-form.gs** once from
script.google.com. It generates the same instrument as a Google Form with a
linked response sheet. You lose the on-brand look and the automatic email
fill-in, so the HTML form above is the better default.

## Cloning for next month

In `evaluation.html`, edit `MONTH_LABEL`, `MONTH_KEY`, and the topic lists in the
`TOPICS` object to match what you taught. Update the matching `LABELS` in
`collector.gs` so the Focus tab stays readable. Everything else carries over.

## Privacy

Responses are tied to a student email so you can follow up, and the footer tells
students the data is for planning teaching, not grading. Nothing is shared
beyond your own Sheet.
