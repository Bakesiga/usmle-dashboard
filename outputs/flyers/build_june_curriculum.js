// USMLE June Curriculum — portrait 4:5.
// Curriculum-only companion to USMLE_June_Teaser.
// Run:  node build_june_curriculum.js

const pptxgen = require("pptxgenjs");

// ── Palette (same as teaser) ──────────────────────────
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

const pres = new pptxgen();
pres.defineLayout({ name: "CURR", width: PAGE_W, height: PAGE_H });
pres.layout = "CURR";
pres.author = "Allan Bakesiga";
pres.title = "USMLE Step 1 · June Curriculum";

const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── 1. TOP RIBBON ─────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fill: { color: C.ink }, line: { color: C.ink },
});
slide.addText("USMLE STEP 1  ·  JUNE 2026 CURRICULUM", {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fontSize: 16, fontFace: FONT, color: C.white,
  bold: true, charSpacing: 3, align: "center", valign: "middle", margin: 0,
});

// ── 2. SUBHEAD ────────────────────────────────────────
slide.addText("What we're covering, day by day", {
  x: MARGIN, y: 0.74, w: CONTENT_W, h: 0.40,
  fontSize: 18, fontFace: FONT, color: C.ink2,
  italic: true, align: "center", valign: "middle", margin: 0,
});

// ── 3. FOUR DETAILED BLOCKS (2 × 2 grid) ──────────────
const GRID_Y_START = 1.30;
const GAP_H = 0.20;
const GAP_V = 0.20;
const CARD_W = (CONTENT_W - GAP_H) / 2;
const CARD_H = 4.40;
const HEADER_H = 0.78;

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
  const cx = MARGIN + col * (CARD_W + GAP_H);
  const cy = GRID_Y_START + row * (CARD_H + GAP_V);

  // Card background (soft tint)
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
    x: cx + 0.18, y: cy + 0.08, w: CARD_W - 0.36, h: 0.36,
    fontSize: 16, fontFace: FONT, color: C.white,
    bold: true, charSpacing: 1, margin: 0, valign: "middle",
  });
  // Days + Dates
  slide.addText(`${c.days} days  ·  ${c.dates}`, {
    x: cx + 0.18, y: cy + 0.42, w: CARD_W - 0.36, h: 0.30,
    fontSize: 13, fontFace: FONT, color: C.white,
    margin: 0, valign: "middle",
  });

  // Day items, evenly distributed
  const N = c.items.length;
  const BODY_TOP = 0.20;
  const BODY_BOTTOM = 0.16;
  const BODY_H = CARD_H - HEADER_H - BODY_TOP - BODY_BOTTOM;
  const ITEM_H = BODY_H / N;
  const ITEM_FS = N <= 4 ? 14 : (N <= 8 ? 12 : 11);
  const ITEM_Y_START = cy + HEADER_H + BODY_TOP;
  const ITEM_X = cx + 0.18;
  const ITEM_W = CARD_W - 0.36;

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

// ── 4. FOOTER ─────────────────────────────────────────
const FOOTER_Y = GRID_Y_START + 2 * CARD_H + GAP_V + 0.20;

slide.addText([
  { text: "Full schedule & dashboard:  ", options: { color: C.ink2 } },
  { text: "bakesiga.github.io/usmle-dashboard",
    options: { color: C.cvs, bold: true } },
], {
  x: MARGIN, y: FOOTER_Y, w: CONTENT_W, h: 0.36,
  fontSize: 13, fontFace: FONT, align: "center", valign: "middle", margin: 0,
});

// ── Write ─────────────────────────────────────────────
pres.writeFile({ fileName: "USMLE_June_Curriculum.pptx" }).then((f) => {
  console.log("✓ wrote", f);
});
