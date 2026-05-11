// USMLE June Advert — portrait 4:5 (WhatsApp Status / Groups / Instagram-safe).
// Graphic-forward poster, spotlighting June curriculum.
// Run:  node build_june_advert.js

const pptxgen = require("pptxgenjs");
const fs = require("fs");

// ── Palette ────────────────────────────────────────────
const C = {
  ink:    "0C2A3D",
  ink2:   "345671",
  muted:  "6B87A3",
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

// ── 1. HERO BAND (sky-blue) ───────────────────────────
const HERO_H = 2.20;
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: PAGE_W, h: HERO_H,
  fill: { color: C.cvs }, line: { color: C.cvs },
});
// subtle deeper-blue bottom strip for depth
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: HERO_H - 0.18, w: PAGE_W, h: 0.18,
  fill: { color: C.cvsDeep }, line: { color: C.cvsDeep },
});

// Kicker pill (top-left)
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: 0.30, w: 3.2, h: 0.36,
  fill: { color: C.white }, line: { color: C.white },
  rectRadius: 0.18,
});
slide.addText("JUNE COHORT  ·  LIMITED SLOTS", {
  x: MARGIN, y: 0.30, w: 3.2, h: 0.36,
  fontSize: 11, fontFace: "Calibri", color: C.cvsDeep,
  bold: true, charSpacing: 3, align: "center", valign: "middle", margin: 0,
});

// Hero text column (leaves room for photo on the right)
const HERO_TEXT_W = CONTENT_W - 1.95;

// Main headline
slide.addText("STARTS JUNE 1", {
  x: MARGIN, y: 0.74, w: HERO_TEXT_W, h: 0.82,
  fontSize: 52, fontFace: "Calibri", color: C.white,
  bold: true, charSpacing: -1, margin: 0,
});

// Subtitle
slide.addText([
  { text: "USMLE Step 1", options: { bold: true, color: C.white } },
  { text: "   ·   ", options: { color: "BFE3F7" } },
  { text: "Daily, Mon to Sun", options: { color: "E0F2FE" } },
], {
  x: MARGIN, y: 1.52, w: HERO_TEXT_W, h: 0.40,
  fontSize: 18, fontFace: "Calibri", margin: 0,
});

// ── Circular headshot, right side of hero ────────────
const PHOTO_SIZE = 1.65;
const PHOTO_X = PAGE_W - MARGIN - PHOTO_SIZE;
const PHOTO_Y = (HERO_H - PHOTO_SIZE) / 2 - 0.05;
const RING = 0.06;

// White ring background (slightly larger circle for the rim effect)
slide.addShape(pres.shapes.OVAL, {
  x: PHOTO_X - RING, y: PHOTO_Y - RING,
  w: PHOTO_SIZE + 2 * RING, h: PHOTO_SIZE + 2 * RING,
  fill: { color: C.white }, line: { color: C.white },
});

// Circular photo
slide.addImage({
  path: "allan_circle.png",
  x: PHOTO_X, y: PHOTO_Y, w: PHOTO_SIZE, h: PHOTO_SIZE,
});

// ── 2. SECTION LABEL ──────────────────────────────────
slide.addText("WHAT WE'RE COVERING IN JUNE", {
  x: MARGIN, y: HERO_H + 0.24, w: CONTENT_W, h: 0.28,
  fontSize: 11, fontFace: "Calibri", color: C.muted,
  bold: true, charSpacing: 4, margin: 0,
});
slide.addShape(pres.shapes.LINE, {
  x: MARGIN, y: HERO_H + 0.58, w: 1.10, h: 0,
  line: { color: C.cvs, width: 2 },
});

// ── 3. FOUR DETAILED SCHEDULE CARDS (side-by-side) ────
const CARD_GAP = 0.12;
const CARD_W = (CONTENT_W - 3 * CARD_GAP) / 4;
const CARD_Y = HERO_H + 0.75;
const CARD_H = 4.95;
const HEADER_H = 0.78;

const cards = [
  {
    title: "CARDIOVASCULAR", days: 11, dates: "Jun 1 – 11",
    accent: C.cvs, soft: C.cvsSoft, deep: C.cvsDeep,
    items: [
      "Orientation & overview",
      "Embryology · congenital",
      "Anatomy · pericardium",
      "Pump physiology · PV",
      "Heart sounds · murmurs",
      "ECG · action potentials",
      "CAD · IHD · MI",
      "HTN · atherosclerosis",
      "HF · cardiomyopathies",
      "Rheumatic · IE · vasc",
      "CV pharmacology",
    ],
  },
  {
    title: "RESPIRATORY", days: 9, dates: "Jun 12 – 20",
    accent: C.resp, soft: C.respSoft, deep: C.respDeep,
    items: [
      "Embryology · surfactant",
      "Anatomy · diaphragm",
      "Volumes · mechanics",
      "V/Q · A–a · pulm circ",
      "Control · sleep apnea",
      "Upper airway · obstr",
      "Restrictive · ARDS",
      "TB · pleural · cancer",
      "Chapter review",
    ],
  },
  {
    title: "EPI / BIOSTATS", days: 4, dates: "Jun 21 – 24",
    accent: C.amber, soft: "FEF3C7", deep: "B45309",
    items: [
      "Study design · trials",
      "Sens/spec · PPV/NPV",
      "Bias · confounding",
      "Ethics · health policy",
    ],
  },
  {
    title: "GEN. PATHOLOGY", days: 8, dates: "Jun 25 – Jul 2",
    accent: C.path, soft: C.pathSoft, deep: C.pathDeep,
    items: [
      "Adaptations · apoptosis",
      "Necrosis · free radicals",
      "Acute inflammation",
      "Chronic inflam · repair",
      "Neoplasia I · hallmarks",
      "Neoplasia II · oncogenes",
      "Neoplasia III · aging",
      "Chapter review",
    ],
  },
];

cards.forEach((c, i) => {
  const cx = MARGIN + i * (CARD_W + CARD_GAP);

  // Card background (soft tint)
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx, y: CARD_Y, w: CARD_W, h: CARD_H,
    fill: { color: c.soft }, line: { color: c.soft },
    rectRadius: 0.10,
  });

  // Solid color header band (covers top portion, edges align with rounded card)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: cx, y: CARD_Y + 0.10, w: CARD_W, h: HEADER_H - 0.10,
    fill: { color: c.accent }, line: { color: c.accent },
  });
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx, y: CARD_Y, w: CARD_W, h: HEADER_H,
    fill: { color: c.accent }, line: { color: c.accent },
    rectRadius: 0.10,
  });

  // Chapter title
  slide.addText(c.title, {
    x: cx + 0.10, y: CARD_Y + 0.10, w: CARD_W - 0.20, h: 0.30,
    fontSize: 11, fontFace: "Calibri", color: C.white,
    bold: true, charSpacing: 1, margin: 0,
  });
  // Days · Dates
  slide.addText(`${c.days} days  ·  ${c.dates}`, {
    x: cx + 0.10, y: CARD_Y + 0.42, w: CARD_W - 0.20, h: 0.28,
    fontSize: 9.5, fontFace: "Calibri", color: "FFFFFF",
    margin: 0,
  });

  // Day items
  const ITEM_X = cx + 0.10;
  const ITEM_W = CARD_W - 0.20;
  const ITEM_Y_START = CARD_Y + HEADER_H + 0.10;
  const ITEM_H = 0.30;

  c.items.forEach((item, idx) => {
    slide.addText([
      { text: String(idx + 1).padStart(2, "0") + "  ",
        options: { color: c.accent, bold: true } },
      { text: item, options: { color: C.ink2 } },
    ], {
      x: ITEM_X, y: ITEM_Y_START + idx * ITEM_H, w: ITEM_W, h: ITEM_H,
      fontSize: 8.5, fontFace: "Calibri", margin: 0, valign: "middle",
    });
  });
});

// ── 4. METHODOLOGY STRIPE ─────────────────────────────
const STRIPE_Y = CARD_Y + CARD_H + 0.18;

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: STRIPE_Y, w: CONTENT_W, h: 0.72,
  fill: { color: C.ink }, line: { color: C.ink },
  rectRadius: 0.10,
});
slide.addText([
  { text: "FIRST AID 2025 + UWORLD",
    options: { bold: true, color: C.white, fontSize: 15, charSpacing: 2 } },
  { text: "  every single day  ",
    options: { color: "BFE3F7", fontSize: 13, italic: true } },
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
  fontSize: 9.5, fontFace: "Calibri", color: C.muted,
  align: "center", valign: "top", charSpacing: 2, margin: 0,
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
slide.addText([
  { text: "Full plan + class details: ", options: { color: C.ink2 } },
  { text: "bakesiga.github.io/usmle-dashboard",
    options: { color: C.cvs, bold: true } },
], {
  x: ctaTextX, y: CTA_Y + 0.85, w: ctaTextW, h: 0.26,
  fontSize: 10.5, fontFace: "Calibri", margin: 0,
});
slide.addText([
  { text: "or message ", options: { color: C.muted } },
  { text: "+256 705 571 443", options: { color: C.ink, bold: true } },
  { text: "  ·  WhatsApp", options: { color: C.muted } },
], {
  x: ctaTextX, y: CTA_Y + 1.12, w: ctaTextW, h: 0.24,
  fontSize: 10, fontFace: "Calibri", margin: 0,
});

// ── 6. FOOTER: Allan badge ────────────────────────────
const FOOT_Y = PAGE_H - 0.42;
slide.addShape(pres.shapes.LINE, {
  x: MARGIN, y: FOOT_Y - 0.05, w: CONTENT_W, h: 0,
  line: { color: C.border, width: 0.75 },
});
slide.addText([
  { text: "ALLAN BAKESIGA, MD", options: { bold: true, color: C.ink, charSpacing: 2 } },
  { text: "   MD (Makerere) · MScGH (Duke) · PGY-1 Neurology, Creighton",
    options: { color: C.muted } },
], {
  x: MARGIN, y: FOOT_Y, w: CONTENT_W, h: 0.32,
  fontSize: 9.5, fontFace: "Calibri", margin: 0, valign: "middle",
});

// ── Write ─────────────────────────────────────────────
pres.writeFile({ fileName: "USMLE_June_Advert.pptx" }).then((f) => {
  console.log("✓ wrote", f);
});
