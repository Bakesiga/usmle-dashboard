// USMLE June Explainer — portrait 4:5 (WhatsApp Status / Groups / Instagram-safe).
// Educational poster: "What is the USMLE?" + countdown + sign-up link.
// Run:  node build_june_explainer.js

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
const DAYS_TO_GO = 16;

const pres = new pptxgen();
pres.defineLayout({ name: "EXP", width: PAGE_W, height: PAGE_H });
pres.layout = "EXP";
pres.author = "Allan Bakesiga";
pres.title = "USMLE Step 1 · June Cohort · Explainer";

const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── 1. TOP RIBBON ─────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fill: { color: C.ink }, line: { color: C.ink },
});
slide.addText("UNITED STATES MEDICAL LICENSING EXAMINATION", {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fontSize: 14, fontFace: FONT, color: C.white,
  bold: true, charSpacing: 3, align: "center", valign: "middle", margin: 0,
});

// ── 2. COUNTDOWN + COHORT LINE ────────────────────────
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

// Credentials under photo
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

// ── 4. HEADLINE (big question hook) ───────────────────
slide.addText("What is the USMLE?", {
  x: MARGIN, y: 1.20, w: CONTENT_W - 2.10, h: 0.80,
  fontSize: 36, fontFace: FONT, color: C.cvsDeep,
  bold: true, charSpacing: -1, margin: 0,
});

// Subtitle / tagline beneath hero
slide.addText("Your path to US medical residency training.", {
  x: MARGIN, y: 2.05, w: CONTENT_W - 2.10, h: 0.40,
  fontSize: 18, fontFace: FONT, color: C.ink2,
  bold: true, italic: true, margin: 0, valign: "top",
});

// ── 5. FOUR Q&A BLOCKS (vertical stack, variable heights) ─────
const QA_Y_START = 3.25;
const QA_GAP = 0.10;

const qas = [
  {
    q: "WHAT IS IT?",
    a: "A three-Step examination for medical licensure in the United States, sponsored by the FSMB and NBME. It assesses an examinee's ability to apply medical knowledge, concepts, and principles for safe and effective patient care.",
    accent: C.cvs, soft: C.cvsSoft, deep: C.cvsDeep,
    h: 1.65,
  },
  {
    q: "WHO TAKES IT?",
    a: "Medical students and graduates of US medical schools, and graduates of medical schools outside the US listed in the World Directory of Medical Schools. IMGs (International Medical Graduates, physicians whose medical degree was earned outside the US) register through ECFMG. Check your school at wdoms.org.",
    accent: C.resp, soft: C.respSoft, deep: C.respDeep,
    h: 1.90,
  },
  {
    q: "WHERE DOES IT LEAD?",
    a: "State medical boards use USMLE results for physician licensure. For IMGs, Step 1 and Step 2 CK are required for ECFMG Certification, the gateway to ACGME-accredited US residency programs.",
    accent: C.path, soft: C.pathSoft, deep: C.pathDeep,
    h: 1.55,
  },
  {
    q: "WHAT IS US RESIDENCY TRAINING?",
    a: "Specialty training after medical school. The equivalent of a Master of Medicine (MMed) in a given specialty.",
    accent: C.amber, soft: C.amberSoft, deep: C.amberDeep,
    h: 1.15,
  },
];

let qy = QA_Y_START;
qas.forEach((qa) => {
  // Card background
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: MARGIN, y: qy, w: CONTENT_W, h: qa.h,
    fill: { color: qa.soft }, line: { color: qa.soft },
    rectRadius: 0.12,
  });

  // Left accent strip
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN, y: qy + 0.10, w: 0.10, h: qa.h - 0.20,
    fill: { color: qa.accent }, line: { color: qa.accent },
  });

  // Question label
  slide.addText(qa.q, {
    x: MARGIN + 0.30, y: qy + 0.12, w: CONTENT_W - 0.45, h: 0.34,
    fontSize: 17, fontFace: FONT, color: qa.deep,
    bold: true, charSpacing: 2, margin: 0, valign: "middle",
  });

  // Answer
  slide.addText(qa.a, {
    x: MARGIN + 0.30, y: qy + 0.50, w: CONTENT_W - 0.45, h: qa.h - 0.60,
    fontSize: 13.5, fontFace: FONT, color: C.ink,
    bold: true, margin: 0, valign: "middle",
  });

  qy += qa.h + QA_GAP;
});

// ── 6. CTA STRIP — "What do you need to do right now?" ─────
const CTA_Y = qy + 0.04;
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

// Left side: text block
slide.addText("WHAT DO YOU NEED TO DO RIGHT NOW?", {
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

// Right side: white QR card with label
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
pres.writeFile({ fileName: "USMLE_June_Explainer.pptx" }).then((f) => {
  console.log("✓ wrote", f);
});
