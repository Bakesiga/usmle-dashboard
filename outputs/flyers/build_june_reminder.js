// USMLE June Reminder — portrait 4:5 (WhatsApp Status / Groups / Instagram-safe).
// "What we're covering in June" — countdown + 4 subject cards + sign-up QR.
// Run:  node build_june_reminder.js

const pptxgen = require("pptxgenjs");

// ── Palette ────────────────────────────────────────────
const C = {
  ink:    "0C2A3D",
  ink2:   "345671",
  muted:  "5B7A95",
  bg:     "FFFFFF",
  border: "D6E8F5",
  cvs:    "0284C7", cvsSoft: "E0F2FE", cvsDeep: "075985",
  resp:   "059669", respSoft: "D1FAE5", respDeep: "065F46",
  path:   "7C3AED", pathSoft: "EDE9FE", pathDeep: "5B21B6",
  amber:  "D97706", amberSoft: "FEF3C7", amberDeep: "B45309",
  white:  "FFFFFF",
};

const FONT = "Comic Sans MS";
const PAGE_W = 9, PAGE_H = 11.25, MARGIN = 0.55;
const CONTENT_W = PAGE_W - 2 * MARGIN;

// Countdown to June 1, 2026 — hardcoded daily; bump down by 1 each day
const DAYS_TO_GO = 12;

const pres = new pptxgen();
pres.defineLayout({ name: "REM", width: PAGE_W, height: PAGE_H });
pres.layout = "REM";
pres.author = "Allan Bakesiga";
pres.title = "USMLE Step 1 · June Cohort · Reminder";

const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── 1. TOP RIBBON ─────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fill: { color: C.ink }, line: { color: C.ink },
});
slide.addText("USMLE STEP 1  ·  WHAT WE'RE COVERING IN JUNE", {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fontSize: 14, fontFace: FONT, color: C.white,
  bold: true, charSpacing: 3, align: "center", valign: "middle", margin: 0,
});

// ── 2. COUNTDOWN ───────────────────────────────────────
slide.addText(`${DAYS_TO_GO} DAYS TO GO  ·  JUNE 1`, {
  x: MARGIN, y: 0.72, w: 5.40, h: 0.40,
  fontSize: 15, fontFace: FONT, color: C.amberDeep,
  bold: true, charSpacing: 2, align: "left", valign: "middle", margin: 0,
});

// ── 3. PHOTO (top right) ──────────────────────────────
const PHOTO_SIZE = 1.50;
const PHOTO_X = PAGE_W - MARGIN - PHOTO_SIZE - 0.05;
const PHOTO_Y = 0.75;
const RING = 0.04;

slide.addShape(pres.shapes.OVAL, {
  x: PHOTO_X - RING, y: PHOTO_Y - RING,
  w: PHOTO_SIZE + 2 * RING, h: PHOTO_SIZE + 2 * RING,
  fill: { color: C.cvs }, line: { color: C.cvs },
});
slide.addImage({
  path: "allan_circle.png",
  x: PHOTO_X, y: PHOTO_Y, w: PHOTO_SIZE, h: PHOTO_SIZE,
});

const CAP_W = 2.70;
const CAP_X = PHOTO_X + PHOTO_SIZE / 2 - CAP_W / 2;
const CAP_Y = PHOTO_Y + PHOTO_SIZE + 0.08;

slide.addText("Allan Bakesiga", {
  x: CAP_X, y: CAP_Y, w: CAP_W, h: 0.32,
  fontSize: 15, fontFace: FONT, color: C.ink,
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText("MD (Makerere) · MScGH (Duke)", {
  x: CAP_X, y: CAP_Y + 0.32, w: CAP_W, h: 0.28,
  fontSize: 11, fontFace: FONT, color: C.ink2,
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText("PGY-1 Neurology (Creighton)", {
  x: CAP_X, y: CAP_Y + 0.60, w: CAP_W, h: 0.28,
  fontSize: 11, fontFace: FONT, color: C.ink2,
  bold: true, align: "center", valign: "middle", margin: 0,
});

// ── 4. HEADLINE ───────────────────────────────────────
slide.addText("June at a glance", {
  x: MARGIN, y: 1.20, w: CONTENT_W - 2.10, h: 0.80,
  fontSize: 36, fontFace: FONT, color: C.cvsDeep,
  bold: true, charSpacing: -1, margin: 0,
});
slide.addText("30 days · 4 subjects · daily live Zoom classes.", {
  x: MARGIN, y: 2.05, w: CONTENT_W - 2.10, h: 0.36,
  fontSize: 17, fontFace: FONT, color: C.ink2,
  bold: true, italic: true, margin: 0, valign: "top",
});

// Class times — three time zones stacked under the subtitle
slide.addText([
  { text: "5:00 – 7:30 AM EAT",      options: { color: C.amberDeep, bold: true, breakLine: true } },
  { text: "9:00 – 11:30 PM CST",     options: { color: C.amberDeep, bold: true, breakLine: true } },
  { text: "10:00 PM – 12:30 AM EST", options: { color: C.amberDeep, bold: true } },
], {
  x: MARGIN, y: 2.50, w: CONTENT_W - 2.10, h: 0.70,
  fontSize: 11, fontFace: FONT, align: "left", valign: "top", margin: 0,
  lineSpacingMultiple: 1.0,
});

// ── 5. FOUR SUBJECT CARDS (2 × 2) ─────────────────────
const GRID_Y_START = 3.25;
const GAP_H = 0.20;
const GAP_V = 0.22;
const CARD_W = (CONTENT_W - GAP_H) / 2;
const CARD_H = 2.65;
const HEADER_H = 0.85;

const cards = [
  {
    title: "CARDIOVASCULAR", days: 10, dates: "Jun 1 — 10",
    accent: C.cvs, soft: C.cvsSoft, deep: C.cvsDeep,
    bullets: [
      "ECG, action potentials & arrhythmias",
      "Heart failure & cardiomyopathies",
      "CAD, MI & atherosclerosis",
      "CV pharmacology",
    ],
  },
  {
    title: "RESPIRATORY", days: 8, dates: "Jun 11 — 18",
    accent: C.resp, soft: C.respSoft, deep: C.respDeep,
    bullets: [
      "Lung volumes, V/Q & gas exchange",
      "Asthma & COPD",
      "TB, pneumonia & ARDS",
      "Lung cancer & pulm pharmacology",
    ],
  },
  {
    title: "EPI & BIOSTATS", days: 4, dates: "Jun 19 — 22",
    accent: C.amber, soft: C.amberSoft, deep: C.amberDeep,
    bullets: [
      "Study designs & diagnostic testing",
      "Risk, survival & transitions",
      "Bias, confounding & effect modification",
      "Distributions, hypothesis testing & CIs",
    ],
  },
  {
    title: "GENERAL PATHOLOGY", days: 8, dates: "Jun 23 — 30",
    accent: C.path, soft: C.pathSoft, deep: C.pathDeep,
    bullets: [
      "Cell injury, adaptation & apoptosis",
      "Acute & chronic inflammation",
      "Neoplasia, oncogenes & TSGs",
      "Tumor markers & aging",
    ],
  },
];

cards.forEach((c, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const cx = MARGIN + col * (CARD_W + GAP_H);
  const cy = GRID_Y_START + row * (CARD_H + GAP_V);

  // Card body (soft tint)
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx, y: cy, w: CARD_W, h: CARD_H,
    fill: { color: c.soft }, line: { color: c.soft },
    rectRadius: 0.12,
  });

  // Header band (accent color)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: cx, y: cy + 0.10, w: CARD_W, h: HEADER_H - 0.10,
    fill: { color: c.accent }, line: { color: c.accent },
  });
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx, y: cy, w: CARD_W, h: HEADER_H,
    fill: { color: c.accent }, line: { color: c.accent },
    rectRadius: 0.12,
  });

  // Chapter title
  slide.addText(c.title, {
    x: cx + 0.18, y: cy + 0.08, w: CARD_W - 0.36, h: 0.38,
    fontSize: 16, fontFace: FONT, color: C.white,
    bold: true, charSpacing: 1, margin: 0, valign: "middle",
  });
  // Days + Dates
  slide.addText(`${c.days} days  ·  ${c.dates}`, {
    x: cx + 0.18, y: cy + 0.46, w: CARD_W - 0.36, h: 0.32,
    fontSize: 12, fontFace: FONT, color: C.white,
    bold: true, margin: 0, valign: "middle",
  });

  // Bullets
  const BODY_TOP = 0.18;
  const BODY_BOTTOM = 0.16;
  const BODY_H = CARD_H - HEADER_H - BODY_TOP - BODY_BOTTOM;
  const ITEM_H = BODY_H / c.bullets.length;
  const ITEM_Y_START = cy + HEADER_H + BODY_TOP;
  const ITEM_X = cx + 0.18;
  const ITEM_W = CARD_W - 0.36;

  c.bullets.forEach((bullet, idx) => {
    slide.addText([
      { text: "• ", options: { color: c.deep, bold: true } },
      { text: bullet, options: { color: C.ink, bold: true } },
    ], {
      x: ITEM_X, y: ITEM_Y_START + idx * ITEM_H, w: ITEM_W, h: ITEM_H,
      fontSize: 12, fontFace: FONT, margin: 0, valign: "middle",
    });
  });
});

// ── 6. CTA STRIP — with sign-up QR ────────────────────
const CTA_Y = GRID_Y_START + 2 * CARD_H + GAP_V + 0.10;
const CTA_H = 1.50;
const QR_SIZE = 1.10;
const QR_PAD = 0.20;
const QR_X = MARGIN + CONTENT_W - QR_PAD - QR_SIZE;
const QR_Y = CTA_Y + (CTA_H - QR_SIZE) / 2;
const TEXT_W = CONTENT_W - QR_SIZE - QR_PAD * 2;

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: CTA_Y, w: CONTENT_W, h: CTA_H,
  fill: { color: C.ink }, line: { color: C.ink },
  rectRadius: 0.12,
});

slide.addText("READY TO START?", {
  x: MARGIN + QR_PAD, y: CTA_Y + 0.14, w: TEXT_W, h: 0.32,
  fontSize: 13, fontFace: FONT, color: "BFE3F7",
  bold: true, charSpacing: 2, align: "center", valign: "middle", margin: 0,
});
slide.addText("Start preparing for the USMLE exams with Allan!", {
  x: MARGIN + QR_PAD, y: CTA_Y + 0.48, w: TEXT_W, h: 0.46,
  fontSize: 16, fontFace: FONT, color: C.white,
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText("bakesiga.github.io/usmle-dashboard", {
  x: MARGIN + QR_PAD, y: CTA_Y + 0.98, w: TEXT_W, h: 0.28,
  fontSize: 11, fontFace: FONT, color: "BFE3F7",
  italic: true, align: "center", valign: "middle", margin: 0,
});

// White QR card
slide.addShape(pres.shapes.RECTANGLE, {
  x: QR_X - 0.06, y: QR_Y - 0.06,
  w: QR_SIZE + 0.12, h: QR_SIZE + 0.12,
  fill: { color: C.white }, line: { color: C.white },
});
slide.addImage({
  path: "signup_qr.png",
  x: QR_X, y: QR_Y, w: QR_SIZE, h: QR_SIZE,
});

// ── Write ─────────────────────────────────────────────
pres.writeFile({ fileName: "USMLE_June_Reminder.pptx" }).then((f) => {
  console.log("✓ wrote", f);
});
