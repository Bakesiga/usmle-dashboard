// USMLE June Brief — portrait 4:5 (WhatsApp Status / Groups / Instagram-safe).
// Brief business advert: countdown + 4 subject chips + sign-up QR.
// Run:  node build_june_brief.js

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
pres.defineLayout({ name: "BRIEF", width: PAGE_W, height: PAGE_H });
pres.layout = "BRIEF";
pres.author = "Allan Bakesiga";
pres.title = "USMLE Step 1 · June Cohort · Brief";

const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── 1. TOP RIBBON ─────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fill: { color: C.ink }, line: { color: C.ink },
});
slide.addText("USMLE STEP 1  ·  JUNE COHORT", {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fontSize: 16, fontFace: FONT, color: C.white,
  bold: true, charSpacing: 3, align: "center", valign: "middle", margin: 0,
});

// ── 2. COUNTDOWN + JUNE 1 ─────────────────────────────
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: 0.92, w: CONTENT_W, h: 1.05,
  fill: { color: C.amberSoft }, line: { color: C.amber, width: 2 },
  rectRadius: 0.18,
});
slide.addText(`${DAYS_TO_GO}`, {
  x: MARGIN + 0.25, y: 0.95, w: 2.40, h: 1.00,
  fontSize: 64, fontFace: FONT, color: C.amberDeep,
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText([
  { text: "DAYS TO GO", options: { color: C.amberDeep, bold: true, breakLine: true, charSpacing: 3 } },
  { text: "Cohort starts ", options: { color: C.ink2 } },
  { text: "June 1, 2026", options: { color: C.ink, bold: true } },
], {
  x: MARGIN + 2.85, y: 1.00, w: CONTENT_W - 3.10, h: 0.95,
  fontSize: 18, fontFace: FONT, align: "left", valign: "middle", margin: 0,
});

// ── 3. HERO HEADLINE ──────────────────────────────────
slide.addText("Start your USMLE journey.", {
  x: MARGIN, y: 2.20, w: CONTENT_W, h: 0.75,
  fontSize: 36, fontFace: FONT, color: C.cvsDeep,
  bold: true, charSpacing: -1, align: "left", margin: 0,
});
slide.addText("Daily live Zoom · Step 1 prep · coached by Allan.", {
  x: MARGIN, y: 3.00, w: CONTENT_W, h: 0.40,
  fontSize: 16, fontFace: FONT, color: C.ink2,
  bold: true, italic: true, align: "left", margin: 0,
});

// ── 4. PHOTO + CREDENTIALS (left aligned row) ─────────
const PHOTO_SIZE = 1.45;
const PHOTO_X = MARGIN;
const PHOTO_Y = 3.55;
const RING = 0.05;

slide.addShape(pres.shapes.OVAL, {
  x: PHOTO_X - RING, y: PHOTO_Y - RING,
  w: PHOTO_SIZE + 2 * RING, h: PHOTO_SIZE + 2 * RING,
  fill: { color: C.cvs }, line: { color: C.cvs },
});
slide.addImage({
  path: "allan_circle.png",
  x: PHOTO_X, y: PHOTO_Y, w: PHOTO_SIZE, h: PHOTO_SIZE,
});

// Credentials to the right of photo
slide.addText("Allan Bakesiga", {
  x: PHOTO_X + PHOTO_SIZE + 0.20, y: PHOTO_Y + 0.05, w: CONTENT_W - PHOTO_SIZE - 0.20, h: 0.40,
  fontSize: 20, fontFace: FONT, color: C.ink,
  bold: true, align: "left", valign: "middle", margin: 0,
});
slide.addText("MD (Makerere) · MScGH (Duke)", {
  x: PHOTO_X + PHOTO_SIZE + 0.20, y: PHOTO_Y + 0.48, w: CONTENT_W - PHOTO_SIZE - 0.20, h: 0.32,
  fontSize: 13, fontFace: FONT, color: C.ink2,
  bold: true, align: "left", valign: "middle", margin: 0,
});
slide.addText("PGY-1 Neurology (Creighton)", {
  x: PHOTO_X + PHOTO_SIZE + 0.20, y: PHOTO_Y + 0.80, w: CONTENT_W - PHOTO_SIZE - 0.20, h: 0.32,
  fontSize: 13, fontFace: FONT, color: C.ink2,
  bold: true, align: "left", valign: "middle", margin: 0,
});
slide.addText("Past TA, Epidemiology & Biostats, Duke Global Health", {
  x: PHOTO_X + PHOTO_SIZE + 0.20, y: PHOTO_Y + 1.12, w: CONTENT_W - PHOTO_SIZE - 0.20, h: 0.32,
  fontSize: 11, fontFace: FONT, color: C.muted,
  bold: true, italic: true, align: "left", valign: "middle", margin: 0,
});

// ── 5. FOUR SUBJECT CHIPS (2x2) ──────────────────────
const CHIP_Y = 5.30;
const CHIP_GAP = 0.20;
const CHIP_W = (CONTENT_W - CHIP_GAP) / 2;
const CHIP_H = 1.00;

const chips = [
  { title: "CARDIOVASCULAR", days: "10 days · Jun 1 — 10",  color: C.cvs },
  { title: "RESPIRATORY",    days: "8 days · Jun 11 — 18",  color: C.resp },
  { title: "EPI & BIOSTATS", days: "4 days · Jun 19 — 22",  color: C.amber },
  { title: "GENERAL PATH",   days: "8 days · Jun 23 — 30",  color: C.path },
];

chips.forEach((c, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const cx = MARGIN + col * (CHIP_W + CHIP_GAP);
  const cy = CHIP_Y + row * (CHIP_H + CHIP_GAP);

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx, y: cy, w: CHIP_W, h: CHIP_H,
    fill: { color: c.color }, line: { color: c.color },
    rectRadius: 0.12,
  });
  slide.addText(c.title, {
    x: cx + 0.18, y: cy + 0.10, w: CHIP_W - 0.36, h: 0.40,
    fontSize: 17, fontFace: FONT, color: C.white,
    bold: true, charSpacing: 1, valign: "middle", margin: 0,
  });
  slide.addText(c.days, {
    x: cx + 0.18, y: cy + 0.55, w: CHIP_W - 0.36, h: 0.36,
    fontSize: 12, fontFace: FONT, color: C.white,
    bold: true, valign: "middle", margin: 0,
  });
});

// ── 6. CLASS TIMES ────────────────────────────────────
const TIMES_Y = CHIP_Y + 2 * CHIP_H + CHIP_GAP + 0.20;
slide.addText("CLASS TIMES (DAILY)", {
  x: MARGIN, y: TIMES_Y, w: CONTENT_W, h: 0.30,
  fontSize: 11, fontFace: FONT, color: C.muted,
  bold: true, charSpacing: 3, align: "center", valign: "middle", margin: 0,
});
slide.addText([
  { text: "5:00 – 7:30 AM EAT", options: { color: C.amberDeep, bold: true } },
  { text: "   ·   ",            options: { color: C.muted } },
  { text: "9:00 – 11:30 PM CST", options: { color: C.amberDeep, bold: true } },
  { text: "   ·   ",            options: { color: C.muted } },
  { text: "10:00 PM – 12:30 AM EST", options: { color: C.amberDeep, bold: true } },
], {
  x: MARGIN, y: TIMES_Y + 0.30, w: CONTENT_W, h: 0.40,
  fontSize: 12, fontFace: FONT, align: "center", valign: "middle", margin: 0,
});

// ── 7. CTA STRIP — with sign-up QR ───────────────────
const CTA_Y = 9.55;
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

slide.addText("LIMITED SEATS", {
  x: MARGIN + QR_PAD, y: CTA_Y + 0.14, w: TEXT_W, h: 0.32,
  fontSize: 13, fontFace: FONT, color: "BFE3F7",
  bold: true, charSpacing: 2, align: "center", valign: "middle", margin: 0,
});
slide.addText("Scan to enroll · pay by 30 May", {
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
pres.writeFile({ fileName: "USMLE_June_Brief.pptx" }).then((f) => {
  console.log("✓ wrote", f);
});
