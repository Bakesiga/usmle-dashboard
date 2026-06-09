// USMLE June Teaser — portrait 4:5 (WhatsApp Status / Groups / Instagram-safe).
// Punchier, advertising-first counterpart to USMLE_June_Advert.
// Run:  node build_june_teaser.js

const pptxgen = require("pptxgenjs");

// ── Palette ────────────────────────────────────────────
const C = {
  ink:    "0C2A3D",
  ink2:   "345671",
  muted:  "5B7A95",
  bg:     "FFFFFF",
  bgTint: "F5FBFF",
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

// Countdown to cohort start (June 1, 2026)
const COHORT_START = new Date(2026, 5, 1); // month is 0-indexed, 5 = June
const TODAY = new Date();
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_TO_GO = Math.max(0, Math.ceil((COHORT_START - TODAY) / MS_PER_DAY));

const pres = new pptxgen();
pres.defineLayout({ name: "TEASER", width: PAGE_W, height: PAGE_H });
pres.layout = "TEASER";
pres.author = "Allan Bakesiga";
pres.title = "USMLE Step 1 · June Cohort · Teaser";

const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── 1. TOP RIBBON — full USMLE name ──────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fill: { color: C.ink }, line: { color: C.ink },
});
slide.addText("UNITED STATES MEDICAL LICENSING EXAMINATION", {
  x: 0, y: 0, w: PAGE_W, h: 0.62,
  fontSize: 14, fontFace: FONT, color: C.white,
  bold: true, charSpacing: 3, align: "center", valign: "middle", margin: 0,
});

// Countdown + scarcity line below ribbon
slide.addText(`${DAYS_TO_GO} DAYS TO GO  ·  LIMITED SLOTS`, {
  x: MARGIN, y: 0.72, w: 5.40, h: 0.36,
  fontSize: 14, fontFace: FONT, color: C.amberDeep,
  bold: true, charSpacing: 2, align: "left", valign: "middle", margin: 0,
});

// ── 2. HERO HEADLINE (massive, two lines) ─────────────
// Hero text width leaves room for photo on the right
const HERO_TEXT_W = CONTENT_W - 2.10;

slide.addText("STEP 1.", {
  x: MARGIN, y: 1.25, w: HERO_TEXT_W, h: 1.10,
  fontSize: 78, fontFace: FONT, color: C.cvsDeep,
  bold: true, charSpacing: -2, margin: 0,
});
slide.addText("JUNE 1.", {
  x: MARGIN, y: 2.30, w: HERO_TEXT_W, h: 1.10,
  fontSize: 78, fontFace: FONT, color: C.ink,
  bold: true, charSpacing: -2, margin: 0,
});

// ── 3. PHOTO (top right) ──────────────────────────────
const PHOTO_SIZE = 1.85;
const PHOTO_X = PAGE_W - MARGIN - PHOTO_SIZE - 0.05;
const PHOTO_Y = 0.78;
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

// Credentials under photo
const CAP_W = 2.50;
const CAP_X = PHOTO_X + PHOTO_SIZE / 2 - CAP_W / 2;
const CAP_Y = PHOTO_Y + PHOTO_SIZE + 0.10;

slide.addText("Allan Bakesiga", {
  x: CAP_X, y: CAP_Y, w: CAP_W, h: 0.30,
  fontSize: 14, fontFace: FONT, color: C.ink,
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText("MD (Makerere) · MScGH (Duke)", {
  x: CAP_X, y: CAP_Y + 0.30, w: CAP_W, h: 0.26,
  fontSize: 11, fontFace: FONT, color: C.ink2,
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText("PGY-1 Neurology, Creighton", {
  x: CAP_X, y: CAP_Y + 0.54, w: CAP_W, h: 0.26,
  fontSize: 11, fontFace: FONT, color: C.ink2,
  bold: true, align: "center", valign: "middle", margin: 0,
});

// ── 4. TAGLINE (one bold promise line) ────────────────
slide.addText([
  { text: "Daily live coaching, ", options: { color: C.ink } },
  { text: "built around recommended materials and Q bank.", options: { color: C.cvsDeep, bold: true } },
], {
  x: MARGIN, y: 3.55, w: CONTENT_W, h: 0.80,
  fontSize: 26, fontFace: FONT, margin: 0,
});

// Subline
slide.addText("June curriculum mapped page-by-page to high-yield resources.", {
  x: MARGIN, y: 4.40, w: CONTENT_W, h: 0.42,
  fontSize: 17, fontFace: FONT, color: C.muted,
  italic: true, margin: 0,
});

// ── 5. FOUR TOPIC BLOCKS (2 × 2 grid) ────────────────
const TOPIC_Y_START = 4.95;
const TOPIC_GAP_H = 0.20;
const TOPIC_GAP_V = 0.20;
const TOPIC_W = (CONTENT_W - TOPIC_GAP_H) / 2;
const TOPIC_H = 1.10;

const topics = [
  {
    title: "CARDIOVASCULAR", dates: "10 days  ·  Jun 1 – 10",
    accent: C.cvs, soft: C.cvsSoft, deep: C.cvsDeep,
  },
  {
    title: "RESPIRATORY", dates: "8 days  ·  Jun 11 – 18",
    accent: C.resp, soft: C.respSoft, deep: C.respDeep,
  },
  {
    title: "EPI & BIOSTATS", dates: "4 days  ·  Jun 19 – 22",
    accent: C.amber, soft: C.amberSoft, deep: C.amberDeep,
  },
  {
    title: "GENERAL PATHOLOGY", dates: "8 days  ·  Jun 23 – 30",
    accent: C.path, soft: C.pathSoft, deep: C.pathDeep,
  },
];

topics.forEach((t, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const tx = MARGIN + col * (TOPIC_W + TOPIC_GAP_H);
  const ty = TOPIC_Y_START + row * (TOPIC_H + TOPIC_GAP_V);

  // Card background (soft tint)
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: tx, y: ty, w: TOPIC_W, h: TOPIC_H,
    fill: { color: t.soft }, line: { color: t.soft },
    rectRadius: 0.12,
  });

  // Color accent strip on the left
  slide.addShape(pres.shapes.RECTANGLE, {
    x: tx, y: ty + 0.08, w: 0.10, h: TOPIC_H - 0.16,
    fill: { color: t.accent }, line: { color: t.accent },
  });

  // Title
  slide.addText(t.title, {
    x: tx + 0.28, y: ty + 0.12, w: TOPIC_W - 0.40, h: 0.46,
    fontSize: 19, fontFace: FONT, color: t.deep,
    bold: true, charSpacing: 0, margin: 0, valign: "middle",
  });

  // Dates
  slide.addText(t.dates, {
    x: tx + 0.30, y: ty + 0.62, w: TOPIC_W - 0.42, h: 0.40,
    fontSize: 16, fontFace: FONT, color: t.accent,
    bold: true, margin: 0, valign: "middle",
  });
});

// ── 6. METHODOLOGY STRIPE ────────────────────────────
const STRIPE_Y = TOPIC_Y_START + 2 * TOPIC_H + TOPIC_GAP_V + 0.22;

slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: MARGIN, y: STRIPE_Y, w: CONTENT_W, h: 0.86,
  fill: { color: C.ink }, line: { color: C.ink },
  rectRadius: 0.12,
});
slide.addText([
  { text: "MATERIALS  →  Q BANK  →  EXAM PATTERNS",
    options: { bold: true, color: C.white, fontSize: 17, charSpacing: 2 } },
], {
  x: MARGIN + 0.30, y: STRIPE_Y + 0.04, w: CONTENT_W - 0.60, h: 0.46,
  fontFace: FONT, valign: "middle", margin: 0, align: "center",
});
slide.addText("Read · Apply · Master — every single day.", {
  x: MARGIN + 0.30, y: STRIPE_Y + 0.48, w: CONTENT_W - 0.60, h: 0.34,
  fontSize: 13, fontFace: FONT, color: "BFE3F7",
  italic: true, align: "center", valign: "middle", margin: 0,
});

// ── 7. CTA ROW (QR + text) ──────────────────────────
const CTA_Y = STRIPE_Y + 1.05;
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
  x: MARGIN, y: CTA_Y + QR_SIZE + 0.04, w: QR_SIZE, h: 0.26,
  fontSize: 11, fontFace: FONT, color: C.ink2,
  bold: true, align: "center", valign: "top", charSpacing: 0, margin: 0,
});

const ctaTextX = MARGIN + QR_SIZE + 0.36;
const ctaTextW = CONTENT_W - QR_SIZE - 0.36;

slide.addText("RESERVE YOUR SEAT", {
  x: ctaTextX, y: CTA_Y - 0.05, w: ctaTextW, h: 0.55,
  fontSize: 28, fontFace: FONT, color: C.ink,
  bold: true, charSpacing: 1, margin: 0,
});
slide.addText([
  { text: "Limited slots  ·  Lock yours by May 30.", options: { color: C.amberDeep, bold: true } },
], {
  x: ctaTextX, y: CTA_Y + 0.54, w: ctaTextW, h: 0.32,
  fontSize: 14, fontFace: FONT, margin: 0,
});
slide.addText([
  { text: "or sign up at  ", options: { color: C.ink2 } },
  { text: "bakesiga.github.io/usmle-dashboard",
    options: { color: C.cvs, bold: true } },
], {
  x: ctaTextX, y: CTA_Y + 0.90, w: ctaTextW, h: 0.32,
  fontSize: 13, fontFace: FONT, margin: 0,
});

// ── 8. CONTACT ROW ───────────────────────────────────
const contacts = [
  { icon: "email-blue.png",  text: "allanbakesiga@gmail.com" },
  { icon: "whatsapp.png",    text: "+256 705 571 443" },
  { icon: "phone-blue.png",  text: "+1 984 710 2902" },
];
const CONTACT_Y = CTA_Y + QR_SIZE + 0.42;
const CONTACT_ITEM_W = CONTENT_W / 3;
const ICON_SIZE = 0.26;

contacts.forEach((ct, i) => {
  const cx_i = MARGIN + i * CONTACT_ITEM_W;
  slide.addImage({
    path: ct.icon,
    x: cx_i, y: CONTACT_Y + 0.04,
    w: ICON_SIZE, h: ICON_SIZE,
  });
  slide.addText(ct.text, {
    x: cx_i + ICON_SIZE + 0.08, y: CONTACT_Y,
    w: CONTACT_ITEM_W - ICON_SIZE - 0.12, h: 0.34,
    fontSize: 12, fontFace: FONT, color: C.ink,
    bold: true, margin: 0, valign: "middle",
  });
});

// ── Write ─────────────────────────────────────────────
pres.writeFile({ fileName: "USMLE_June_Teaser.pptx" }).then((f) => {
  console.log("✓ wrote", f);
});
