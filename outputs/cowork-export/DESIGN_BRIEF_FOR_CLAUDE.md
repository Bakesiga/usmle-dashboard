# USMLE Dashboard — Design Brief for Claude (Design)

You are redesigning a small static website that supports a single-instructor, live-Zoom USMLE Step 1 prep cohort. The site has two faces:

1. **Public marketing site** at `bakesiga.github.io/usmle-dashboard` — where prospective students land before signing up.
2. **Student dashboard** at `bakesiga.github.io/usmle-dashboard/dashboard.html` — where enrolled students get the daily class link, slides, schedule, and notes.

The goal of this redesign is to make the site feel **alive, trustworthy, and personal** — like an academic boutique that one specific physician runs, not an anonymous course platform. The instructor is Allan Bakesiga (MD Makerere, MScGH Duke, PGY-1 Neurology at Creighton). He coaches mostly East African IMGs and a small number of international students through Step 1.

This document is intentionally exhaustive. Use it as the source of truth, ask follow-up questions only when something is genuinely ambiguous.

---

## 1. Who the site is for

### Primary audience — prospects (public site)
- **East African IMGs** (mostly Uganda, Kenya, Tanzania, Rwanda) finishing or just past medical school, considering Step 1.
- **Diaspora IMGs** (India, Middle East, US-based IMGs) who heard about Allan via word-of-mouth.
- Many are visiting from a phone, on patchy mobile data, after seeing a WhatsApp status post or flyer.
- They want, in this order: **proof Allan is legit**, **what they get**, **what it costs**, **how to sign up**.

### Secondary audience — current students (dashboard)
- Already paid, returning daily for class.
- Want, in this order: **the Zoom link**, **today's schedule item**, **slide deck for this session**, **the WhatsApp group**, **the calendar subscription**.
- Older students will revisit past sessions to study; the dashboard is also a study reference.

### Tertiary audience — Allan himself (admin)
- Adds new sessions, uploads slide decks, edits the schedule.
- Currently uses `admin.py` / `configure.py` locally. The admin UX should not get worse.

---

## 2. What's there today (current state)

### Repo layout
```
~/.claude/usmle-dashboard/
├── index.html         ← marketing landing page (~9 KB)
├── dashboard.html     ← student dashboard (~4 KB)
├── signin.html        ← Google sign-in entry (~3 KB)
├── admin.py           ← local-only admin script
├── configure.py       ← config generator
├── serve.py           ← local dev server
├── css/
│   ├── style.css      ← shared
│   └── site.css       ← landing-page-only overrides
├── js/                ← config.js, schedule.js, sessions loader
├── data/
│   ├── sessions.json  ← 30 sessions across 4 chapters (the curriculum)
│   ├── schedule.ics   ← generated from sessions.json
│   └── …
├── images/            ← Allan headshot, subject icons, etc.
└── outputs/           ← flyers + email templates + cowork export
```

### What works
- The information is correct and organized.
- The marketing page tells a clear story (hero → about Allan → what's included → sample plan → sign up).
- The dashboard has the right action chips at the top (Zoom, WhatsApp, Calendar subscribe).
- Mobile rendering is OK-ish.

### What needs to improve (this brief's mandate)
- **Visual energy is low.** It looks like a 2014 academic site. Flat, no rhythm, no motion, no warmth.
- **Hierarchy is muddy.** Everything has roughly the same weight. The eye doesn't know where to land.
- **Hero is static.** The headline and Allan's photo sit there. No movement, no scroll cue, no visual depth.
- **Trust signals are weak.** Allan's credentials are listed but not designed. Recent USMLE-passers (testimonials) aren't featured.
- **The dashboard feels utilitarian.** It works, but it does not feel like a place a student wants to spend two hours a day for a month.
- **No design system.** Colors, spacing, and typography drift between pages.
- **Components are not composable.** Each block is a one-off.
- **No dark mode.** Some students study at 4:30 AM EAT — they would benefit.

---

## 3. Goals & success criteria

In rough priority order:

1. **First-touch trust.** A prospect lands on the homepage and within 5 seconds believes Allan is a real, credentialed physician running a serious program.
2. **One-screen clarity.** The hero answers: who, what, when, how much, how to start.
3. **Quiet motion.** Subtle, purposeful animation that makes the site feel alive without being flashy. (No bouncing emojis; no parallax overload.)
4. **Sign-up is one click.** From any scroll position, a clear path to the Google Form.
5. **Dashboard feels like a study companion.** Calm, focused, fast. Today's session is the first thing the student sees.
6. **Mobile-first.** Most visits are phones. Layouts must collapse cleanly, hit targets must be thumb-sized.
7. **Lighthouse 95+** for Performance, Accessibility, Best Practices, SEO.

You'll know the redesign worked if:
- A new visitor can verbalize what the course is and what it costs after 10 seconds on the homepage.
- A returning student can join class within 2 taps from a cold-open of the dashboard.
- Allan looks at it and says: "This finally feels like me."

---

## 4. Brand language

### Voice
Warm, plainspoken, slightly self-deprecating, never bro-y or hype-y. The tone of a senior resident teaching a junior, not a marketer pitching a course. Words to favor: *cohort, walkthrough, daily, mentor, patient, careful*. Words to avoid: *crush, dominate, hack, unlock, secret, masterclass, ninja*.

### Visual identity (shared with the flyer suite)

**Color palette** — already established in the flyers; reuse exactly:

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0C2A3D` | Primary text, dark surfaces |
| `--ink-2` | `#345671` | Secondary text |
| `--muted` | `#5B7A95` | Tertiary text, captions |
| `--bg` | `#FFFFFF` | Page background (light mode) |
| `--bg-soft` | `#FFF8EC` | Cream surface, success accents |
| `--border` | `#D6E8F5` | Subtle borders |
| `--cvs` | `#0284C7` | Cardiovascular accent |
| `--cvs-soft` | `#E0F2FE` | Cardiovascular tint |
| `--cvs-deep` | `#075985` | Cardiovascular deep |
| `--resp` | `#059669` | Respiratory accent |
| `--resp-soft` | `#D1FAE5` | |
| `--resp-deep` | `#065F46` | |
| `--path` | `#7C3AED` | Pathology accent |
| `--path-soft` | `#EDE9FE` | |
| `--path-deep` | `#5B21B6` | |
| `--amber` | `#D97706` | Epi & biostats accent / countdowns |
| `--amber-soft` | `#FEF3C7` | |
| `--amber-deep` | `#B45309` | |
| `--gold` | `#E5A823` | Success / "passed" gold |
| `--gold-deep` | `#B8851C` | Success deep |

Each of the four core subjects has its own color. Use them as **accents and tints**, never as flat blocks of body content. The dominant page color is white (or near-white cream `--bg-soft`). Subject colors appear on subject cards, in subject ribbons, on day-of-week chips, and in subject-specific dashboard sections.

**Typography**

- **Display / headings**: a friendly geometric sans. Options to evaluate: *Manrope*, *Plus Jakarta Sans*, *Inter Display*, *Nunito*. The flyer suite uses Comic Sans MS by Allan's preference — DO NOT use Comic Sans on the web. Comic Sans on screen looks unprofessional even though it lands on print. The web counterpart should feel warm and approachable but precise.
- **Body**: *Inter* or system stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- **Numerals**: tabular figures for countdown, schedule times, and any data table.
- **Scale**: a 1.250 (major third) modular scale. Base body 16 px on mobile, 17 px on desktop.

**Spacing**

Use an 8-pt base. Common spacings: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Avoid arbitrary numbers.

**Radii**

- Soft surfaces: 12 px
- Cards: 16 px
- Pills (badges, buttons): 999 px (full pill) or 8 px (compact button)
- Hero illustrations: 24 px

**Shadows**

Use **two layered shadows** for cards (one tight + one diffuse), not single drops. Light mode shadows are very gentle — `rgba(12, 42, 61, 0.04)` tight + `rgba(12, 42, 61, 0.06)` diffuse.

**Iconography**

Stroke icons, 1.5 px, rounded line caps. Either Phosphor or Lucide. Subject icons should be drawn (not stock) — see `images/` for the current set.

---

## 5. Information architecture

### Public site (logged out)

```
/                       (index.html)
   ├ Hero
   ├ Trust strip (Allan's photo + credentials + 3 logos: Makerere, Duke, Creighton)
   ├ The June outline (the 30-day curriculum, condensed)
   ├ What's included (daily class, dashboard, slides, notes, Q-bank walkthrough, mentorship)
   ├ Sample week (visual schedule)
   ├ Recent passes (Rosemary's testimonial + future graduates)
   ├ Pricing (Uganda + International, what's in / out)
   ├ FAQ
   ├ Sign up CTA (Google Form link)
   └ Footer (WhatsApp group, Calendly office hours, email)

/signin.html             (Google sign-in)

/dashboard.html          (auth-gated student dashboard)
```

### Student dashboard (logged in)

```
Top bar
   ├ Brand
   ├ Action chips: Join class · WhatsApp · Subscribe (.ics)
   └ User chip + Sign out

Main panels (tabbed)
   ├ Today
   │    ├ Today's session card (date, subject, topic, time-to-class countdown)
   │    ├ "Join class on Zoom" big button
   │    ├ Today's slide deck
   │    ├ Today's notes
   │    └ Today's Q-bank set
   ├ Sessions  (browse all 30 days)
   ├ Schedule  (calendar view)
   ├ Resources (First Aid PDF, UWorld guidance, open-source extras)
   └ Office hours (Calendly embed)
```

---

## 6. Page-by-page specification

### 6.1 Homepage (`/`)

**Hero**

- Full-width section, ~88vh on desktop, fully visible without scroll.
- Left two-thirds: copy. Right one-third: Allan's photo + credential block.
- Kicker line above headline: `ENROLLING NOW · STEP 1 · JUNE COHORT`, set in `--amber-deep`, letter-spacing wide.
- Headline: `USMLE prep that keeps you on it daily.`
  - Set the phrase "keeps you on it daily" in a 2-stop linear gradient from `--cvs` to `--cvs-deep` (subtle).
  - 56 px desktop, 36 px mobile.
- Lede paragraph: one sentence, 18 px, line-height 1.5, color `--ink-2`.
- Two CTAs:
  - Primary: `Sign up for Step 1 →` — solid `--cvs`, white text, 14 px / 24 px padding, radius 8 px.
  - Secondary: `What's included` — ghost button, 1.5 px border `--border`, ink text.
- Below CTAs: a row of three "hero stats" pills, each a compact card with a strong noun + caption (e.g. `Mon–Sun` / "Daily classes"). The pills should subtly stagger-in on load (50 ms apart, 200 ms fade + 6 px translate-up).

**Allan photo block**

- Circular portrait, 240 px, with a `--cvs` glow ring (8 px) that pulses very subtly (4 s ease-in-out, 0.6 → 1.0 opacity).
- Below the photo: name in 20 px ink bold, then three lines of credentials at 14 px `--ink-2`.
- Use the existing image at `images/allan.jpg`.

**Countdown strip**

Directly below the hero. A single horizontal band on cream `--bg-soft`. Displays:
- `12 DAYS TO GO · COHORT STARTS JUNE 1, 2026` (text).
- A live countdown timer (DD:HH:MM:SS) updating client-side from `Date.now()` to `2026-06-01T05:00:00+03:00` (5 AM EAT).
- Tabular figures, ink color, with a tiny pulse on the seconds digit only.

**June outline**

Use a 4-card layout that mirrors the `USMLE_June_Outline.jpg` flyer, but webified. Each card is a clickable subject:

- Card background: the subject's `-soft` tint (e.g. `--cvs-soft`).
- Header band: the subject's accent color, with the chapter title in white.
- Day count + date range in white below title.
- Numbered list of day topics (10 / 8 / 4 / 8 for cardio / resp / epi / path).
- On hover, the card lifts (translate-Y -2 px, shadow grows) and the accent band briefly highlights.

**What's included**

A 6-item grid (2x3 desktop, 1x6 mobile). Each item: stroke icon (24 px) + heading + one sentence. Items:
1. Daily live Zoom classes (2.5 hours)
2. Full First Aid 2025 walkthrough
3. UWorld vignette work, page-by-page
4. Class dashboard with slides + notes
5. ECFMG / residency mentorship through match
6. WhatsApp group for daily Q&A

**Sample week**

Render a 7-day grid (Mon–Sun) for the first week of June, with the subject chip + topic on each day. The current day (if viewing in June) gets a `--amber` border ring.

**Recent passes (testimonials)**

The hero of this section is **Rosemary Njambi Githinji** — the first graduate. Show:
- Her gold-framed portrait (square, from the success flyer).
- Quote: *"Allan is the most patient teacher I have ever had. He breaks every concept down so clearly that even a non-medic could follow. I would not have passed Step 1 without him."*
- Attribution: `— Dr. Rosemary Njambi Githinji · Tested May 2026`
- A small gold `PASSED` badge.

Leave room for 2 more testimonial slots (placeholder cards labeled "More passes coming"). When more pass, this becomes a horizontally-scrolling testimonial rail.

**Pricing**

Two side-by-side cards: **Uganda** and **International**. Each shows:
- Country header (with a small flag chip).
- Monthly tuition (UGX 350,000 / USD 200 default — but Allan adjusts case by case; copy should say "from").
- What's included list (echo of the "What's included" section but more terse).
- Payment rails (Mobile Money for UG, M-Pesa / Wise / PayPal for international).
- "Sign up →" link to the Google Form.

**FAQ**

Accordion. 6-8 questions. Examples:
- "I have not finished medical school. Can I still join?"
- "Do I need my own copy of First Aid?"
- "What if I miss a class?"
- "Can I pay weekly?"
- "Is the class recorded?"
- "How is this different from Doctors in Training or USMLE-Rx?"

**Sign-up CTA**

Big bottom-of-page banner. Dark `--ink` background, gold headline, white body, primary button to the Google Form, secondary link to email Allan.

**Footer**

Three columns:
- Class: WhatsApp group, Calendly office hours, signup form
- Allan: about, credentials, contact
- Materials: dashboard, calendar (.ics)

Plus a tiny credits line: `© 2026 Allan Bakesiga · Site by Claude Design`.

---

### 6.2 Sign-in (`/signin.html`)

- Centered, single-column, max 420 px.
- The same brand header from the homepage.
- One line: `Sign in to access your dashboard.`
- Single "Continue with Google" button (Google's official button styling).
- Below: `Trouble signing in?` link to `mailto:allanbakesiga@gmail.com`.
- The page should feel calm, not transactional. Use the cream background.

---

### 6.3 Dashboard (`/dashboard.html`)

**Top bar (sticky)**

- Left: brand mark + small "USMLE Class" type.
- Center: action chips. Each chip is a pill with icon + label:
  - 🎥 `Join class` (links to Zoom)
  - 💬 `Class WhatsApp` (links to invite)
  - 📅 `Subscribe` (downloads / subscribes to the .ics)
- The `Join class` chip should turn **`--resp` green** in the 30 minutes before class start, and pulse gently during class hours. Outside class hours it's neutral ink.
- Right: user avatar + name + sign-out.

**"Today" panel (default tab)**

A single hero card that takes the center of the screen:

- Big date display ("Day 3 · Cardiac output & PV loops" — pulled from sessions.json by computing today minus June 1).
- Subject chip in the subject color.
- Three primary actions in a row:
  - **Join class** (Zoom — same as top bar, but huge here)
  - **Today's deck** (Google Slides link from sessions.json)
  - **Today's notes** (markdown rendered inline below)
- Countdown to class: e.g. *"Class starts in 47 minutes."* If during class hours: *"Class is live now."* If past: *"Class ended 2 hours ago. Recording uploading shortly."*
- A "Yesterday" / "Tomorrow" pair of small ghost cards below — quick jump to the next/previous session.

**Other tabs**

- **Sessions**: list of all 30 days. Filter by subject. Each row: day number, date, subject chip, topic, status (upcoming / today / done).
- **Schedule**: a calendar grid for June. Hover a day to see the topic; click to deep-link to that session.
- **Resources**: open-source First Aid mirror links, UWorld guidance, Allan's mnemonic packs, anything Allan wants pinned.
- **Office hours**: Calendly inline embed.

**Side rail (desktop only)**

Right column shows:
- A 4-pie progress card: how many days in each subject have happened.
- A small "Allan is here" presence chip — green if `Date.now()` is within class hours.
- Next 7 days mini-calendar.

**Dark mode**

Toggle in the user chip menu. Dark surfaces use `#0A1822` background, `#0C2A3D` raised. Subject colors stay the same (they're saturated enough). Reduce the cream tones; replace with `#11293A`.

---

## 7. Interaction & motion

### Motion principles

- **Quiet by default.** Most page elements do not animate. Animation is a signal, not decoration.
- **Use easing curves**, not linear. Default ease: `cubic-bezier(0.4, 0, 0.2, 1)` (in/out). Entrances ease-out, exits ease-in.
- **Durations**: 150 ms for hover transitions, 250 ms for component reveals, 600 ms for hero stagger sequences. Never longer than 600 ms.
- **Stagger entrances** for grids (50 ms between siblings).
- **Reduce motion** is respected — wrap all motion in `@media (prefers-reduced-motion: no-preference)`.

### Specific moments

- **Hero load.** On first paint: hero copy fades in (200 ms), photo slides in from right 8 px + fades (300 ms, delay 100 ms), stats stagger in (each 80 ms apart, 200 ms duration).
- **Countdown ticking.** Only the seconds digit animates (color flicker, no scale).
- **Nav scroll.** Top nav goes from transparent to white + tiny shadow after 80 px scroll.
- **Cards on hover.** Lift 2 px, expand shadow, no scale change.
- **CTA primary.** On hover: color darkens 6%, no scale. On click: scale 0.98, 80 ms.
- **Anchor links.** Smooth scroll with 80 ms ease-out, account for sticky nav offset.
- **Subject card click.** Card expands inline to show full topic list (height grow 250 ms), don't navigate away.
- **Form submit.** Replace button with a small loading dot pattern. On success, the button becomes a green check for 1 s, then returns to label.
- **Dashboard "Join class" pulse.** During class hours: gentle 2 s pulse on the chip's outline (1 → 2 px), looping. Pause on hover.

---

## 8. Accessibility

- **Color contrast**: minimum WCAG AA. All body text against its background ≥ 4.5:1. Large text ≥ 3:1. Verify subject-color cards aren't using accent color as body text background without enough contrast.
- **Focus rings**: visible, 2 px solid `--cvs` outline, 2 px offset. Never `outline: none`.
- **Keyboard navigable**: every interactive element reachable by tab. Skip link to main content.
- **Screen-reader labels**: every icon button has `aria-label`. Pulsing elements have `aria-hidden` decoration where appropriate; meaningful animation is announced.
- **Form fields**: real `<label>`, no placeholder-as-label.
- **Heading order**: H1 (one per page), then H2/H3 in proper nest.
- **Alt text**: Allan's photo: "Allan Bakesiga, MD, headshot." Rosemary's photo: "Dr. Rosemary Njambi Githinji on her Duke graduation day."
- **Reduced motion**: as above.
- **Color is not the only cue**: status chips include text labels, not just color.

---

## 9. Responsive behavior

Breakpoints:
- `--bp-sm`: 480 px
- `--bp-md`: 768 px
- `--bp-lg`: 1024 px
- `--bp-xl`: 1280 px

Behaviors:
- Mobile-first base styles. Layouts assume single column.
- Hero stacks vertically on mobile (photo first, then copy).
- Subject card grid is 1 column < 768, 2 columns ≥ 768.
- Dashboard side rail collapses below 1024 px (its widgets go above the main panel as horizontal cards).
- Top nav becomes a hamburger drawer below 768 px. Drawer slides in from the right, full height, ink background with cream text.
- Hit targets ≥ 44 × 44 px on touch.
- Font scale shrinks 1 step at <480 px.

---

## 10. Performance

- **Total page weight on homepage**: ≤ 250 KB transferred, ≤ 100 KB JS.
- **No web fonts heavier than necessary**: variable font WOFF2, preloaded.
- **Images**: WebP with JPEG fallback for Allan's photo. Lazy load below the fold.
- **No analytics SDKs.** No Google Analytics, no tag manager. Privacy is part of the brand.
- **No third-party tracking.**
- **First Contentful Paint** < 1.0 s on a 3G throttle.
- **Lighthouse**: 95+ across Performance, Accessibility, Best Practices, SEO.
- **CSS strategy**: a single design-token CSS file + per-page CSS. No CSS-in-JS, no build step required. The site is hostable as flat files on GitHub Pages.

---

## 11. Tech constraints

- **Hosting**: GitHub Pages — static files only. No server.
- **JS framework**: vanilla JS or an *islands-of-interactivity* approach (e.g. Alpine.js if absolutely necessary). React is overkill and Allan won't maintain it.
- **Build step**: none required. If a build is introduced (e.g. for Tailwind), it must be runnable as `npm run build` and the output committed to the repo so GitHub Pages can serve it.
- **No external auth**: Sign-in is Google OAuth via Google Sign-In JS library, client-side only. The dashboard checks a list of allowed emails in `js/config.js`.
- **Data**: `data/sessions.json` is the curriculum source. The build pipeline regenerates `data/schedule.ics`.

---

## 12. Visual mood / references

Think:
- **Stripe Press** (warm seriousness, generous whitespace, tabular figures).
- **Linear's landing page** (calm motion, layered shadows, restrained palette).
- **Brilliant.org** (subject cards with personality, gentle color).
- **Substack writer pages** (one-person trust feel, photo + bio prominence).

Do not think:
- **Coursera / Udemy / Khan Academy** (course-mill aesthetic).
- **MedSchoolCoach / Kaplan** (overstuffed, sales-y).
- **AnKing / Anki community sites** (deliberately ugly).

The site should feel like a serious resident's personal academy, not a course platform.

---

## 13. Out of scope

Do not:
- Add payment processing (Allan handles it via Mobile Money / Wise / PayPal manually).
- Add a discussion forum / community feed (the WhatsApp group serves this role).
- Add video hosting (Zoom + linked recordings handle this).
- Add a CMS (sessions.json is the source of truth).
- Add multiple language localizations (English only for now).
- Add a logo redesign (the "U" mark stays; only refine if you have a strong reason).
- Add affiliate links, ads, or upsells.

---

## 14. Deliverables

For the first iteration, produce:

1. **A design system file** (`design-tokens.css`) capturing colors, typography, spacing, radii, shadows, motion easings.
2. **An updated `index.html`** with new structure and content blocks per §6.1.
3. **An updated `dashboard.html`** with the Today panel as the new default tab per §6.3.
4. **An updated `signin.html`** per §6.2.
5. **Two CSS files**: `css/site.css` (marketing) and `css/dashboard.css` (student dashboard), both leaning on the design tokens.
6. **A small `js/motion.js`** that handles the stagger, count-up, pulse, and reduce-motion guards.
7. **Updated `images/`** as needed (subject icons in Lucide/Phosphor style).
8. **A `CHANGELOG.md`** with what changed and why.

Optional (nice-to-have for later iterations):
- A dark-mode preference toggle in the user chip menu.
- A small admin micro-page (`/admin.html`) that lets Allan add a session by editing a single form (writes a new `sessions.json` and prints it for git-commit).

---

## 15. Content snippets

The actual copy for the redesigned site. Use exactly:

**Headline**: USMLE prep that keeps you on it daily.

**Lede**: A mentor-led USMLE Step 1 cohort starting June 1, 2026. Daily live Zoom classes Monday to Sunday, full First Aid walkthrough paired with UWorld vignettes, and end-to-end mentorship through ECFMG and the residency match.

**Trust block**: Allan Bakesiga, MD (Makerere) · MScGH (Duke) · PGY-1 Neurology resident at Creighton University. Past Teaching Assistant in Epidemiology & Biostatistics at the Duke Global Health Institute. Research Assistant in Duke Global Neurosurgery & Neurology.

**Pricing — Uganda**: From UGX 350,000 / month. Pay by Mobile Money to 0705 571 443 (Bakesiga Allan).

**Pricing — International**: From USD 150 / month. Pay by Wise, PayPal, or M-Pesa to +256 705 571 443. Reply to confirm the rail.

**Class times**:
- 5:00 – 7:30 AM EAT
- 9:00 – 11:30 PM CST (previous day)
- 10:00 PM – 12:30 AM EST (previous day)

**Sign-up form**: https://forms.gle/iHCdPVjvJeGeGTXy7

**WhatsApp group invite**: https://chat.whatsapp.com/JvaTpyDt9loGZjomAVwi42

**Calendly office hours**: https://calendly.com/allanbakesiga/usmle-office-hours

**Zoom class link**: https://duke.zoom.us/j/96991939005

---

## 16. How to ask Allan questions

When you have a genuine ambiguity:
- Pick the option that errs toward **trust + restraint** by default; you can show Allan the alternative.
- Show, don't ask. If you're torn between two approaches, build both and let Allan pick.
- Allan responds best to *concrete previews*. He does not enjoy abstract design questions like "what feeling do you want?". He'll tell you when something is wrong by saying "this is small" or "this overlaps." Take those at face value.
- Allan has banned em dashes in email bodies. They are acceptable in flyer / website copy as a typographic element, but lean toward commas, colons, or periods when in doubt.
- Allan's name is always **Allan Bakesiga**. Sign-offs on first-person copy: `— Allan`. Never `— Allan Bakesiga, MD` (the credentials live in the bio block, not the sign-off).

---

## 17. Definition of done

The redesign is complete when:

- [ ] All four pages (`/`, `/signin.html`, `/dashboard.html`, footer-linked anchors) match this brief.
- [ ] Lighthouse scores ≥ 95 in all four categories on a throttled 3G run.
- [ ] Keyboard-only walkthrough reaches every interactive element.
- [ ] Reduced-motion users see a still page.
- [ ] No console errors, no broken images, no broken links.
- [ ] Allan reviews and says *"this finally feels like me."*

End of brief.
