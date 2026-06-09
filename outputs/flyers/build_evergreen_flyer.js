// USMLE Evergreen Flyer — portrait 4:5 (WhatsApp Status / Instagram safe).
// Year-round sharing asset: NO cohort-specific dates.
// Run:  node build_evergreen_flyer.js

const pptxgen = require("pptxgenjs");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

// ── Palette (matches build_june_brief.js / build_june_explainer.js) ─
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
  gold:   "E5A823", goldDeep: "B8851C", cream: "FFF8EC",
  white:  "FFFFFF",
};

const FONT = "Comic Sans MS";
const PAGE_W = 9, PAGE_H = 11.25, MARGIN = 0.45;
const CONTENT_W = PAGE_W - 2 * MARGIN;

const pres = new pptxgen();
pres.defineLayout({ name: "EVG", width: PAGE_W, height: PAGE_H });
pres.layout = "EVG";
pres.author = "Allan Bakesiga";
pres.title = "USMLE Step 1 Prep · Evergreen Flyer";

(async () => {

const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── 1. TOP RIBBON ─────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fill: { color: C.ink }, line: { color: C.ink },
});
slide.addText("USMLE STEP 1 PREP", {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fontSize: 17, fontFace: FONT, color: C.white,
  bold: true, charSpacing: 4, align: "center", valign: "middle", margin: 0,
});

// ── 2. TAGLINE ───────────────────────────────────────
slide.addText("4-month cohorts with Allan", {
  x: MARGIN, y: 0.72, w: CONTENT_W, h: 0.36,
  fontSize: 13, fontFace: FONT, color: C.amberDeep,
  bold: true, italic: true, charSpacing: 1, align: "center", valign: "middle", margin: 0,
});

// ── 3. ALLAN CREDENTIAL CARD (moved up, before hero) ─
const PROOF_Y = 1.18;
const PROOF_H = 1.22;

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: PROOF_Y, w: CONTENT_W, h: PROOF_H,
  fill: { color: C.cream }, line: { color: C.gold, width: 2 },
  rectRadius: 0.12,
});

const ALLAN_D = 0.90;
const ALLAN_X = MARGIN + 0.22;
const ALLAN_Y = PROOF_Y + 0.16;

const allanPath = "/Users/allanbakesiga/.claude/usmle-dashboard/images/allan-headshot.jpg";

// Gold ring behind Allan's photo
slide.addShape(pres.shapes.OVAL, {
  x: ALLAN_X - 0.06, y: ALLAN_Y - 0.06, w: ALLAN_D + 0.12, h: ALLAN_D + 0.12,
  fill: { color: C.gold }, line: { color: C.goldDeep, width: 1 },
});
if (fs.existsSync(allanPath)) {
  slide.addImage({
    path: allanPath,
    x: ALLAN_X, y: ALLAN_Y, w: ALLAN_D, h: ALLAN_D,
    sizing: { type: "cover", w: ALLAN_D, h: ALLAN_D },
    rounding: true,
  });
} else {
  slide.addText("A", {
    x: ALLAN_X, y: ALLAN_Y, w: ALLAN_D, h: ALLAN_D,
    fontSize: 32, fontFace: FONT, color: C.cream,
    bold: true, align: "center", valign: "middle", margin: 0,
  });
}

const ALLAN_TEXT_X = ALLAN_X + ALLAN_D + 0.22;
const ALLAN_TEXT_W = MARGIN + CONTENT_W - ALLAN_TEXT_X - 0.18;

slide.addText("Allan Bakesiga", {
  x: ALLAN_TEXT_X, y: PROOF_Y + 0.18, w: ALLAN_TEXT_W, h: 0.42,
  fontSize: 18, fontFace: FONT, color: C.ink,
  bold: true, align: "left", valign: "middle", margin: 0,
});
slide.addText("MD (Makerere) · MScGH (Duke) · PGY-1 Neurology, Creighton", {
  x: ALLAN_TEXT_X, y: PROOF_Y + 0.62, w: ALLAN_TEXT_W, h: 0.44,
  fontSize: 10.5, fontFace: FONT, color: C.ink2,
  bold: true, align: "left", valign: "middle", margin: 0,
});

// ── 4. HERO HEADLINE ─────────────────────────────────
const HERO_Y = PROOF_Y + PROOF_H + 0.14;
const HERO_H = 0.80;
slide.addText("Pass Step 1.", {
  x: MARGIN, y: HERO_Y, w: CONTENT_W, h: HERO_H,
  fontSize: 38, fontFace: FONT, color: C.cvsDeep,
  bold: true, charSpacing: -1, align: "center", valign: "middle", margin: 0,
});

// ── 5. PROGRAM MODEL — 4 BULLETS ─────────────────────
// Curriculum bullet (index 2) is taller to fit all 16 chapter names.
const PM_Y = HERO_Y + HERO_H + 0.14;
const PM_H_BIG = 1.95;
const PM_GAP = 0.06;

const bullets = [
  {
    title: "4-MONTH COHORT",
    body: "All 16 First Aid chapters spread across 4 months. Every class blends content review with question approach.",
    accent: C.cvs, soft: C.cvsSoft, deep: C.cvsDeep,
    h: 0.78,
  },
  {
    title: "DAILY LIVE ZOOM · 5:00 to 7:30 AM EAT",
    body: "Live with Allan, every day.",
    accent: C.resp, soft: C.respSoft, deep: C.respDeep,
    h: 0.50,
  },
  {
    title: "FULL STEP 1 BLUEPRINT",
    body: null, // rendered as two-column chapter list below
    accent: C.path, soft: C.pathSoft, deep: C.pathDeep,
    h: PM_H_BIG,
    isCurriculum: true,
  },
  {
    title: "DAILY 1-PAGER + FLASHCARD DECK",
    body: "Tied to First Aid 2025 page references.",
    accent: C.amber, soft: C.amberSoft, deep: C.amberDeep,
    h: 0.50,
  },
];

// Chapter list for the curriculum bullet (full FA 2025 chapter names).
const CHAPTERS_LEFT = [
  "Cardiovascular",
  "Respiratory",
  "Epidemiology and Biostatistics",
  "General Pathology",
  "Renal",
  "Reproductive",
  "Endocrine",
  "Gastrointestinal",
];
const CHAPTERS_RIGHT = [
  "Musculoskeletal, Skin, and Connective Tissue",
  "Neurology",
  "Hematology and Oncology",
  "Behavioral Sciences",
  "Biochemistry",
  "Microbiology",
  "Immunology",
  "Pharmacology",
];

let pmCursor = PM_Y;
bullets.forEach((b) => {
  const y = pmCursor;
  const h = b.h;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: MARGIN, y, w: CONTENT_W, h,
    fill: { color: b.soft }, line: { color: b.soft },
    rectRadius: 0.10,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN, y: y + 0.08, w: 0.10, h: h - 0.16,
    fill: { color: b.accent }, line: { color: b.accent },
  });
  slide.addText(b.title, {
    x: MARGIN + 0.25, y: y + 0.06, w: CONTENT_W - 0.35, h: 0.28,
    fontSize: 11.5, fontFace: FONT, color: b.deep,
    bold: true, charSpacing: 1.5, margin: 0, valign: "middle",
  });

  if (b.isCurriculum) {
    // Two-column chapter list inside the bullet card.
    const colTop = y + 0.36;
    const colH = h - 0.42;
    const colInnerX = MARGIN + 0.25;
    const colW = (CONTENT_W - 0.50) / 2;
    const colGap = 0.10;

    const leftText = CHAPTERS_LEFT.map((c) => "·  " + c).join("\n");
    const rightText = CHAPTERS_RIGHT.map((c) => "·  " + c).join("\n");

    slide.addText(leftText, {
      x: colInnerX, y: colTop, w: colW - colGap / 2, h: colH,
      fontSize: 9.5, fontFace: FONT, color: C.ink,
      bold: true, margin: 0, valign: "top", lineSpacingMultiple: 1.15,
      paraSpaceAfter: 1,
    });
    slide.addText(rightText, {
      x: colInnerX + colW + colGap / 2, y: colTop, w: colW - colGap / 2, h: colH,
      fontSize: 9.5, fontFace: FONT, color: C.ink,
      bold: true, margin: 0, valign: "top", lineSpacingMultiple: 1.15,
      paraSpaceAfter: 1,
    });
  } else {
    slide.addText(b.body, {
      x: MARGIN + 0.25, y: y + 0.34, w: CONTENT_W - 0.35, h: h - 0.38,
      fontSize: 10.5, fontFace: FONT, color: C.ink,
      bold: true, margin: 0, valign: "middle",
    });
  }

  pmCursor += h + PM_GAP;
});

// ── 6. WHAT'S INCLUDED (4-column compact row) ────────
const INC_Y = pmCursor + 0.05;
const INC_H = 0.95;
const INC_GAP = 0.10;
const INC_W = (CONTENT_W - 3 * INC_GAP) / 4;

const included = [
  { t: "DASHBOARD", b: "Daily outlines · resources", color: C.cvs },
  { t: "WHATSAPP", b: "Daily reminders", color: C.resp },
  { t: "1:1 MENTOR", b: "Monthly Calendly call", color: C.path },
  { t: "RESIDENCY PATH", b: "ERAS · obs · J1/H1B", color: C.amber },
];

included.forEach((it, i) => {
  const x = MARGIN + i * (INC_W + INC_GAP);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y: INC_Y, w: INC_W, h: INC_H,
    fill: { color: it.color }, line: { color: it.color },
    rectRadius: 0.10,
  });
  slide.addText(it.t, {
    x: x + 0.06, y: INC_Y + 0.12, w: INC_W - 0.12, h: 0.38,
    fontSize: 10.5, fontFace: FONT, color: C.white,
    bold: true, charSpacing: 1, align: "center", valign: "middle", margin: 0,
  });
  slide.addText(it.b, {
    x: x + 0.06, y: INC_Y + 0.48, w: INC_W - 0.12, h: 0.42,
    fontSize: 9, fontFace: FONT, color: C.white,
    bold: true, align: "center", valign: "middle", margin: 0,
  });
});

// ── 7. CTA STRIP (dark) with QR ──────────────────────
const CTA_Y = INC_Y + INC_H + 0.12;
const CTA_H_MAX = PAGE_H - CTA_Y - 0.25;
const CTA_H = Math.min(CTA_H_MAX, 1.55);

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: CTA_Y, w: CONTENT_W, h: CTA_H,
  fill: { color: C.ink }, line: { color: C.ink },
  rectRadius: 0.12,
});

// Generate QR code as data URI (dark on white for max scannability).
const qrDataUri = await QRCode.toDataURL("https://bakesiga.github.io/usmle-dashboard/", {
  width: 400,
  margin: 1,
  color: { dark: "#0C2A3D", light: "#FFFFFF" },
});

// QR placement on the right side of the strip.
const QR_SIZE = Math.min(1.0, CTA_H - 0.30);
const QR_PAD = 0.10;
const QR_X = MARGIN + CONTENT_W - QR_SIZE - 0.22;
const QR_Y = CTA_Y + (CTA_H - QR_SIZE) / 2;

// White rounded-rectangle backing so QR scans cleanly on dark CTA fill.
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: QR_X - QR_PAD, y: QR_Y - QR_PAD,
  w: QR_SIZE + 2 * QR_PAD, h: QR_SIZE + 2 * QR_PAD,
  fill: { color: C.white }, line: { color: C.white },
  rectRadius: 0.06,
});
slide.addImage({
  data: qrDataUri,
  x: QR_X, y: QR_Y, w: QR_SIZE, h: QR_SIZE,
});

// Text block on the left half of the CTA strip.
const TXT_X = MARGIN + 0.22;
const TXT_W = QR_X - QR_PAD - TXT_X - 0.16;

slide.addText("REGISTER AT THE DASHBOARD", {
  x: TXT_X, y: CTA_Y + 0.10, w: TXT_W, h: 0.30,
  fontSize: 12, fontFace: FONT, color: C.gold,
  bold: true, charSpacing: 2.5, align: "left", valign: "middle", margin: 0,
});
slide.addText("bakesiga.github.io/usmle-dashboard", {
  x: TXT_X, y: CTA_Y + 0.42, w: TXT_W, h: 0.34,
  fontSize: 13.5, fontFace: FONT, color: C.white,
  bold: true, align: "left", valign: "middle", margin: 0,
});
slide.addText("WhatsApp +256 705 571 443", {
  x: TXT_X, y: CTA_Y + 0.80, w: TXT_W, h: 0.26,
  fontSize: 10.5, fontFace: FONT, color: "BFE3F7",
  bold: true, italic: true, align: "left", valign: "middle", margin: 0,
});
slide.addText("Book a 1:1: calendly.com/allanbakesiga/30min", {
  x: TXT_X, y: CTA_Y + 1.06, w: TXT_W, h: 0.26,
  fontSize: 10, fontFace: FONT, color: "BFE3F7",
  bold: true, italic: true, align: "left", valign: "middle", margin: 0,
});

// ── Write ─────────────────────────────────────────────
const wrote = await pres.writeFile({
  fileName: path.join(__dirname, "USMLE_Evergreen_Flyer.pptx"),
});
console.log("wrote", wrote);

})().catch((err) => {
  console.error(err);
  process.exit(1);
});
