// USMLE June Advert — portrait 4:5 (WhatsApp Status / Groups / Instagram-safe).
// Graphic-forward poster, spotlighting June curriculum.
// Run:  node build_june_advert.js

const pptxgen = require("pptxgenjs");
const fs = require("fs");

// ── Palette ────────────────────────────────────────────
const C = {
  ink:    "0C2A3D",
  ink2:   "345671",
  muted:  "3D5E80",
  bg:     "FFFFFF",
  bgTint: "F5FBFF",
  border: "D6E8F5",
  // chapter accents (match the website plan cards)
  cvs:    "0284C7", cvsSoft: "E0F2FE", cvsDeep: "075985",
  resp:   "059669", respSoft: "D1FAE5", respDeep: "065F46",
  path:   "7C3AED", pathSoft: "EDE9FE", pathDeep: "5B21B6",
  amber:  "D97706",
  white:  "FFFFFF",
};

// ── Layout: 9 × 11.25 inches  →  1080 × 1350 px at 120 dpi ──
const PAGE_W = 9, PAGE_H = 11.25, MARGIN = 0.55;
const CONTENT_W = PAGE_W - 2 * MARGIN;

const pres = new pptxgen();
pres.defineLayout({ name: "JUNE", width: PAGE_W, height: PAGE_H });
pres.layout = "JUNE";
pres.author = "Allan Bakesiga";
pres.title = "USMLE Step 1 · June Cohort";

const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── 1. HERO TILE (white, calm) ────────────────────────
const HERO_H = 2.45;
// White hero background (already the page bg, just add a subtle bottom rule)
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: HERO_H - 0.04, w: PAGE_W, h: 0.04,
  fill: { color: C.border }, line: { color: C.border },
});

// Kicker pill (top-left) — light blue tint
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: 0.30, w: 3.65, h: 0.36,
  fill: { color: C.cvsSoft }, line: { color: C.cvsSoft },
  rectRadius: 0.18,
});
slide.addText("JUNE SCHEDULE  ·  LIMITED SLOTS", {
  x: MARGIN, y: 0.30, w: 3.65, h: 0.36,
  fontSize: 10.5, fontFace: "Calibri", color: C.cvsDeep,
  bold: true, charSpacing: 2, align: "center", valign: "middle", margin: 0,
});

// Hero text column (leaves room for photo on the right)
const HERO_TEXT_W = CONTENT_W - 1.95;

// Main headline (deep blue on white)
slide.addText("STARTS JUNE 1", {
  x: MARGIN, y: 0.74, w: HERO_TEXT_W, h: 0.82,
  fontSize: 52, fontFace: "Calibri", color: C.cvsDeep,
  bold: true, charSpacing: -1, margin: 0,
});

// Subtitle
slide.addText([
  { text: "USMLE Step 1", options: { bold: true, color: C.ink } },
  { text: "   ·   ", options: { color: C.muted } },
  { text: "Daily, Mon to Sun", options: { color: C.ink2 } },
], {
  x: MARGIN, y: 1.52, w: HERO_TEXT_W, h: 0.40,
  fontSize: 18, fontFace: "Calibri", margin: 0,
});

// ── Circular headshot + credentials, right side of hero
const PHOTO_SIZE = 1.45;
const PHOTO_X = PAGE_W - MARGIN - PHOTO_SIZE - 0.18;
const PHOTO_Y = 0.18;
const RING = 0.04;

// Thin blue ring for definition on white background
slide.addShape(pres.shapes.OVAL, {
  x: PHOTO_X - RING, y: PHOTO_Y - RING,
  w: PHOTO_SIZE + 2 * RING, h: PHOTO_SIZE + 2 * RING,
  fill: { color: C.cvs }, line: { color: C.cvs },
});

// Circular photo
slide.addImage({
  path: "allan_circle.png",
  x: PHOTO_X, y: PHOTO_Y, w: PHOTO_SIZE, h: PHOTO_SIZE,
});

// Credentials caption beneath the photo
const CAP_W = 2.05;
const CAP_X = PHOTO_X + PHOTO_SIZE / 2 - CAP_W / 2;
const CAP_Y_START = PHOTO_Y + PHOTO_SIZE + 0.06;

slide.addText("Allan Bakesiga, MD", {
  x: CAP_X, y: CAP_Y_START, w: CAP_W, h: 0.22,
  fontSize: 11, fontFace: "Calibri", color: C.ink,
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText("MD (Makerere)  ·  MScGH (Duke)", {
  x: CAP_X, y: CAP_Y_START + 0.22, w: CAP_W, h: 0.20,
  fontSize: 9.5, fontFace: "Calibri", color: C.ink2,
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText("PGY-1 Neurology, Creighton", {
  x: CAP_X, y: CAP_Y_START + 0.42, w: CAP_W, h: 0.20,
  fontSize: 9.5, fontFace: "Calibri", color: C.ink2,
  bold: true, align: "center", valign: "middle", margin: 0,
});

// ── 2. SECTION LABEL ──────────────────────────────────
slide.addText("WHAT WE'RE COVERING IN JUNE", {
  x: MARGIN, y: HERO_H + 0.22, w: CONTENT_W, h: 0.26,
  fontSize: 11, fontFace: "Calibri", color: C.ink2,
  bold: true, charSpacing: 4, margin: 0,
});
slide.addShape(pres.shapes.LINE, {
  x: MARGIN, y: HERO_H + 0.55, w: 1.10, h: 0,
  line: { color: C.cvs, width: 2 },
});

// ── 3. FOUR DETAILED SCHEDULE CARDS (2 × 2 grid) ──────
const CARD_GAP_H = 0.15;
const CARD_GAP_V = 0.15;
const CARD_W = (CONTENT_W - CARD_GAP_H) / 2;
const CARD_H = 2.60;
const HEADER_H = 0.62;
const GRID_Y_START = HERO_H + 0.55;

const cards = [
  {
    title: "CARDIOVASCULAR", days: 10, dates: "Jun 1 – 10",
    accent: C.cvs, soft: C.cvsSoft, deep: C.cvsDeep,
    items: [
      "Orientation, embryology & congenital heart defects",
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
    accent: C.amber, soft: "FEF3C7", deep: "B45309",
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
      "Neoplasia I — hallmarks & metastases",
      "Neoplasia II — oncogenes & TSGs",
      "Neoplasia III — markers & aging",
      "General pathology review",
    ],
  },
];

cards.forEach((c, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const cx = MARGIN + col * (CARD_W + CARD_GAP_H);
  const cy = GRID_Y_START + row * (CARD_H + CARD_GAP_V);

  // Card background (soft tint)
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx, y: cy, w: CARD_W, h: CARD_H,
    fill: { color: c.soft }, line: { color: c.soft },
    rectRadius: 0.10,
  });

  // Solid color header band
  slide.addShape(pres.shapes.RECTANGLE, {
    x: cx, y: cy + 0.08, w: CARD_W, h: HEADER_H - 0.08,
    fill: { color: c.accent }, line: { color: c.accent },
  });
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx, y: cy, w: CARD_W, h: HEADER_H,
    fill: { color: c.accent }, line: { color: c.accent },
    rectRadius: 0.10,
  });

  // Chapter title (left side of header)
  slide.addText(c.title, {
    x: cx + 0.14, y: cy + 0.06, w: CARD_W - 0.28, h: 0.28,
    fontSize: 13, fontFace: "Calibri", color: C.white,
    bold: true, charSpacing: 1, margin: 0,
  });
  // Days · Dates
  slide.addText(`${c.days} days  ·  ${c.dates}`, {
    x: cx + 0.14, y: cy + 0.34, w: CARD_W - 0.28, h: 0.24,
    fontSize: 10, fontFace: "Calibri", color: "FFFFFF",
    margin: 0,
  });

  // Day items — Epi block (4 items) gets taller rows to fill space
  const ITEM_X = cx + 0.14;
  const ITEM_W = CARD_W - 0.28;
  // Distribute items evenly across the card's body so each tile fills its space.
  const N = c.items.length;
  const BODY_TOP_PAD = 0.10;
  const BODY_BOTTOM_PAD = 0.08;
  const BODY_H = CARD_H - HEADER_H - BODY_TOP_PAD - BODY_BOTTOM_PAD;
  const ITEM_H = BODY_H / N;
  const ITEM_FS = N <= 4 ? 10.5 : 10;
  const ITEM_Y_START = cy + HEADER_H + BODY_TOP_PAD;

  c.items.forEach((item, idx) => {
    slide.addText([
      { text: String(idx + 1).padStart(2, "0") + "  ",
        options: { color: c.deep, bold: true } },
      { text: item, options: { color: C.ink, bold: true } },
    ], {
      x: ITEM_X, y: ITEM_Y_START + idx * ITEM_H, w: ITEM_W, h: ITEM_H,
      fontSize: ITEM_FS, fontFace: "Calibri", margin: 0, valign: "middle",
    });
  });
});

// ── 4. METHODOLOGY STRIPE ─────────────────────────────
const STRIPE_Y = GRID_Y_START + 2 * CARD_H + CARD_GAP_V + 0.18;

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: STRIPE_Y, w: CONTENT_W, h: 0.72,
  fill: { color: C.ink }, line: { color: C.ink },
  rectRadius: 0.10,
});
slide.addText([
  { text: "HIGH-YIELD MATERIAL + TEST QUESTIONS",
    options: { bold: true, color: C.white, fontSize: 14, charSpacing: 2 } },
  { text: "  similar to exam day  ·  every day",
    options: { color: "BFE3F7", fontSize: 12, italic: true } },
], {
  x: MARGIN + 0.30, y: STRIPE_Y, w: CONTENT_W - 0.60, h: 0.72,
  fontFace: "Calibri", valign: "middle", margin: 0,
});

// ── 5. CTA ROW (QR + text) ────────────────────────────
const CTA_Y = STRIPE_Y + 0.92;
const QR_SIZE = 1.40;

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: CTA_Y, w: QR_SIZE, h: QR_SIZE,
  fill: { color: C.white }, line: { color: C.border, width: 1 },
  rectRadius: 0.08,
});
slide.addImage({
  path: "signup_qr.png",
  x: MARGIN + 0.08, y: CTA_Y + 0.08,
  w: QR_SIZE - 0.16, h: QR_SIZE - 0.16,
});
slide.addText("scan to sign up", {
  x: MARGIN, y: CTA_Y + QR_SIZE + 0.02, w: QR_SIZE, h: 0.22,
  fontSize: 10, fontFace: "Calibri", color: C.ink2,
  bold: true, align: "center", valign: "top", charSpacing: 2, margin: 0,
});

// CTA text block
const ctaTextX = MARGIN + QR_SIZE + 0.30;
const ctaTextW = CONTENT_W - QR_SIZE - 0.30;

slide.addText("SIGN UP", {
  x: ctaTextX, y: CTA_Y + 0.02, w: ctaTextW, h: 0.50,
  fontSize: 32, fontFace: "Calibri", color: C.ink,
  bold: true, charSpacing: 1, margin: 0,
});
slide.addText("Limited slots · June cohort", {
  x: ctaTextX, y: CTA_Y + 0.54, w: ctaTextW, h: 0.26,
  fontSize: 12, fontFace: "Calibri", color: C.amber,
  bold: true, margin: 0,
});
slide.addText("bakesiga.github.io/usmle-dashboard", {
  x: ctaTextX, y: CTA_Y + 0.84, w: ctaTextW, h: 0.24,
  fontSize: 11, fontFace: "Calibri", color: C.cvs,
  bold: true, margin: 0,
});

// ── Contact row: email · WhatsApp · call ─────────────
const contacts = [
  { icon: "email-blue.png",  text: "allanbakesiga@gmail.com" },
  { icon: "whatsapp.png",    text: "+256 705 571 443" },
  { icon: "phone-blue.png",  text: "+1 984 710 2902" },
];
const CONTACT_Y = CTA_Y + 1.15;
const CONTACT_ITEM_W = ctaTextW / 3;
const ICON_SIZE = 0.20;

contacts.forEach((ct, i) => {
  const cx_i = ctaTextX + i * CONTACT_ITEM_W;
  slide.addImage({
    path: ct.icon,
    x: cx_i, y: CONTACT_Y + 0.03,
    w: ICON_SIZE, h: ICON_SIZE,
  });
  slide.addText(ct.text, {
    x: cx_i + ICON_SIZE + 0.06, y: CONTACT_Y,
    w: CONTACT_ITEM_W - ICON_SIZE - 0.10, h: 0.28,
    fontSize: 10, fontFace: "Calibri", color: C.ink,
    bold: true, margin: 0, valign: "middle",
  });
});

// ── Write ─────────────────────────────────────────────
pres.writeFile({ fileName: "USMLE_June_Advert.pptx" }).then((f) => {
  console.log("✓ wrote", f);
});
