// USMLE June Outline — portrait 4:5 (WhatsApp Status / Groups / Instagram-safe).
// Full day-by-day curriculum for the June cohort.
// Run:  node build_june_outline.js

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
const PAGE_W = 9, PAGE_H = 11.25, MARGIN = 0.45;
const CONTENT_W = PAGE_W - 2 * MARGIN;

// Countdown to June 1, 2026 — hardcoded daily; bump down by 1 each day
const DAYS_TO_GO = 12;

const pres = new pptxgen();
pres.defineLayout({ name: "OUT", width: PAGE_W, height: PAGE_H });
pres.layout = "OUT";
pres.author = "Allan Bakesiga";
pres.title = "USMLE Step 1 · June Cohort · Detailed Outline";

const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── 1. TOP RIBBON ─────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: PAGE_W, h: 0.58,
  fill: { color: C.ink }, line: { color: C.ink },
});
slide.addText("USMLE STEP 1  ·  JUNE OUTLINE", {
  x: 0, y: 0, w: PAGE_W, h: 0.58,
  fontSize: 15, fontFace: FONT, color: C.white,
  bold: true, charSpacing: 3, align: "center", valign: "middle", margin: 0,
});

// ── 2. COUNTDOWN + PHOTO + CLASS TIMES (compact row) ──
slide.addText(`${DAYS_TO_GO} DAYS TO GO  ·  JUNE 1`, {
  x: MARGIN, y: 0.66, w: 4.40, h: 0.36,
  fontSize: 14, fontFace: FONT, color: C.amberDeep,
  bold: true, charSpacing: 2, align: "left", valign: "middle", margin: 0,
});

// Class times (left, three lines)
slide.addText([
  { text: "5:00 – 7:30 AM EAT",      options: { color: C.amberDeep, bold: true, breakLine: true } },
  { text: "9:00 – 11:30 PM CST",     options: { color: C.amberDeep, bold: true, breakLine: true } },
  { text: "10:00 PM – 12:30 AM EST", options: { color: C.amberDeep, bold: true } },
], {
  x: MARGIN, y: 1.05, w: 3.20, h: 0.80,
  fontSize: 10, fontFace: FONT, align: "left", valign: "top", margin: 0,
  lineSpacingMultiple: 1.0,
});

// Photo top-right (smaller)
const PHOTO_SIZE = 1.10;
const PHOTO_X = PAGE_W - MARGIN - PHOTO_SIZE - 0.05;
const PHOTO_Y = 0.72;
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

// Credentials to left of photo (between times and photo)
slide.addText("Allan Bakesiga", {
  x: 4.10, y: 0.78, w: 2.95, h: 0.32,
  fontSize: 13, fontFace: FONT, color: C.ink,
  bold: true, align: "right", valign: "middle", margin: 0,
});
slide.addText("MD (Makerere) · MScGH (Duke)", {
  x: 4.10, y: 1.10, w: 2.95, h: 0.28,
  fontSize: 10, fontFace: FONT, color: C.ink2,
  bold: true, align: "right", valign: "middle", margin: 0,
});
slide.addText("PGY-1 Neurology (Creighton)", {
  x: 4.10, y: 1.38, w: 2.95, h: 0.28,
  fontSize: 10, fontFace: FONT, color: C.ink2,
  bold: true, align: "right", valign: "middle", margin: 0,
});

// ── 3. HERO ──────────────────────────────────────────
slide.addText("The full June outline", {
  x: MARGIN, y: 2.00, w: CONTENT_W, h: 0.50,
  fontSize: 28, fontFace: FONT, color: C.cvsDeep,
  bold: true, charSpacing: -1, align: "left", margin: 0,
});
slide.addText("30 days · 4 subjects · day-by-day what we cover.", {
  x: MARGIN, y: 2.50, w: CONTENT_W, h: 0.32,
  fontSize: 13, fontFace: FONT, color: C.ink2,
  bold: true, italic: true, align: "left", margin: 0,
});

// ── 4. FOUR DETAILED CARDS (2x2) ─────────────────────
const GRID_Y_START = 2.95;
const GAP_H = 0.18;
const GAP_V = 0.18;
const CARD_W = (CONTENT_W - GAP_H) / 2;
const CARD_H = 3.20;
const HEADER_H = 0.74;

const cards = [
  {
    title: "CARDIOVASCULAR", days: 10, dates: "Jun 1 – 10",
    accent: C.cvs, soft: C.cvsSoft, deep: C.cvsDeep,
    items: [
      "Orientation, embryology & congenital heart",
      "Anatomy & cardiac imaging",
      "Cardiac output & PV loops",
      "Heart sounds & murmurs",
      "ECG & action potentials",
      "CAD, IHD & myocardial infarction",
      "Hypertension & atherosclerosis",
      "Heart failure & cardiomyopathies",
      "Endocarditis, myocarditis & vasculitis",
      "Cardiovascular pharmacology",
    ],
  },
  {
    title: "RESPIRATORY", days: 8, dates: "Jun 11 – 18",
    accent: C.resp, soft: C.respSoft, deep: C.respDeep,
    items: [
      "Embryology, surfactant & congenital anomalies",
      "Anatomy & muscles of breathing",
      "Lung volumes & ventilation",
      "Gas exchange & V/Q mismatch",
      "Control of breathing & sleep apnea",
      "Asthma & COPD",
      "Restrictive disease, ARDS, pneumonia",
      "TB, lung cancer & respiratory pharmacology",
    ],
  },
  {
    title: "EPI & BIOSTATS", days: 4, dates: "Jun 19 – 22",
    accent: C.amber, soft: C.amberSoft, deep: C.amberDeep,
    items: [
      "Study designs, evidence & diagnostic testing",
      "Quantifying risk, transitions & survival analysis",
      "Bias, confounding & effect modification",
      "Statistical distributions, testing & CIs",
    ],
  },
  {
    title: "GENERAL PATHOLOGY", days: 8, dates: "Jun 23 – 30",
    accent: C.path, soft: C.pathSoft, deep: C.pathDeep,
    items: [
      "Cellular adaptations & apoptosis",
      "Necrosis, ischemia & free radicals",
      "Acute inflammation",
      "Chronic inflammation & repair",
      "Neoplasia I: hallmarks & metastases",
      "Neoplasia II: oncogenes & TSGs",
      "Neoplasia III: markers & aging",
      "General pathology review",
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

  // Title + Days
  slide.addText(c.title, {
    x: cx + 0.16, y: cy + 0.06, w: CARD_W - 0.32, h: 0.34,
    fontSize: 14, fontFace: FONT, color: C.white,
    bold: true, charSpacing: 1, margin: 0, valign: "middle",
  });
  slide.addText(`${c.days} days  ·  ${c.dates}`, {
    x: cx + 0.16, y: cy + 0.38, w: CARD_W - 0.32, h: 0.30,
    fontSize: 11, fontFace: FONT, color: C.white,
    bold: true, margin: 0, valign: "middle",
  });

  // Items list — numbered, evenly distributed
  const N = c.items.length;
  const BODY_TOP = 0.16;
  const BODY_BOTTOM = 0.14;
  const BODY_H = CARD_H - HEADER_H - BODY_TOP - BODY_BOTTOM;
  const ITEM_H = BODY_H / N;
  const ITEM_FS = N <= 4 ? 12 : (N <= 8 ? 10 : 9);
  const ITEM_Y_START = cy + HEADER_H + BODY_TOP;
  const ITEM_X = cx + 0.16;
  const ITEM_W = CARD_W - 0.32;

  c.items.forEach((item, idx) => {
    slide.addText([
      { text: String(idx + 1).padStart(2, "0") + "  ",
        options: { color: c.deep, bold: true } },
      { text: item, options: { color: C.ink, bold: true } },
    ], {
      x: ITEM_X, y: ITEM_Y_START + idx * ITEM_H, w: ITEM_W, h: ITEM_H,
      fontSize: ITEM_FS, fontFace: FONT, margin: 0, valign: "middle",
    });
  });
});

// ── 5. CTA STRIP — with sign-up QR ───────────────────
const CTA_Y = GRID_Y_START + 2 * CARD_H + GAP_V + 0.10;
const CTA_H = 1.40;
const QR_SIZE = 1.00;
const QR_PAD = 0.18;
const QR_X = MARGIN + CONTENT_W - QR_PAD - QR_SIZE;
const QR_Y = CTA_Y + (CTA_H - QR_SIZE) / 2;
const TEXT_W = CONTENT_W - QR_SIZE - QR_PAD * 2;

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: CTA_Y, w: CONTENT_W, h: CTA_H,
  fill: { color: C.ink }, line: { color: C.ink },
  rectRadius: 0.12,
});

slide.addText("READY TO START?", {
  x: MARGIN + QR_PAD, y: CTA_Y + 0.10, w: TEXT_W, h: 0.30,
  fontSize: 12, fontFace: FONT, color: "BFE3F7",
  bold: true, charSpacing: 2, align: "center", valign: "middle", margin: 0,
});
slide.addText("Scan the QR or visit:", {
  x: MARGIN + QR_PAD, y: CTA_Y + 0.42, w: TEXT_W, h: 0.36,
  fontSize: 14, fontFace: FONT, color: C.white,
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText("bakesiga.github.io/usmle-dashboard", {
  x: MARGIN + QR_PAD, y: CTA_Y + 0.82, w: TEXT_W, h: 0.30,
  fontSize: 12, fontFace: FONT, color: "BFE3F7",
  italic: true, bold: true, align: "center", valign: "middle", margin: 0,
});

// White QR card
slide.addShape(pres.shapes.RECTANGLE, {
  x: QR_X - 0.05, y: QR_Y - 0.05,
  w: QR_SIZE + 0.10, h: QR_SIZE + 0.10,
  fill: { color: C.white }, line: { color: C.white },
});
slide.addImage({
  path: "signup_qr.png",
  x: QR_X, y: QR_Y, w: QR_SIZE, h: QR_SIZE,
});

// ── Write ─────────────────────────────────────────────
pres.writeFile({ fileName: "USMLE_June_Outline.pptx" }).then((f) => {
  console.log("✓ wrote", f);
});
