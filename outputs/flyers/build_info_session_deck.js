// USMLE Info Session — slide deck for the live Zoom session.
// Brand palette + content sourced to align with ecfmg.org and FA 2025.
// Run:  node build_info_session_deck.js

const pptxgen = require("pptxgenjs");
const fs = require("fs");

const PHOTO_CANDIDATES = ["allan.jpg", "allan.jpeg", "allan.png"];
const PHOTO = PHOTO_CANDIDATES.find((p) => fs.existsSync(p)) || null;
const QR    = fs.existsSync("forms_qr.png") ? "forms_qr.png" : null;

const C = {
  ink: "0C2A3D", ink2: "345671", muted: "6B87A3",
  bg: "FFFFFF", bgTint: "F5FBFF",
  border: "D6E8F5", border2: "B8D6EC",
  step1: "0284C7", step1Soft: "E0F2FE", step1Deep: "075985",
  step2: "D97706", step2Soft: "FEF3C7", step2Deep: "B45309",
  amber: "D97706",
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";   // 13.3 × 7.5 inch
pres.author = "Allan Bakesiga";
pres.title  = "USMLE Info Session — June Cohort";

const W = 13.333, H = 7.5;
const M = 0.55;
const CW = W - 2 * M;

// ── Helpers ──────────────────────────────────────────
function titleBand(slide, primary, secondary) {
  // Top split: 60% primary / 40% secondary
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W * 0.60, h: 0.45,
    fill: { color: primary }, line: { color: primary },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: W * 0.60, y: 0, w: W * 0.40, h: 0.45,
    fill: { color: secondary }, line: { color: secondary },
  });
}

function footer(slide, num, total, opts = {}) {
  const fg = opts.color || C.muted;
  slide.addText("Allan's USMLE Class · June Cohort", {
    x: M, y: H - 0.40, w: CW * 0.7, h: 0.30,
    fontSize: 10, fontFace: "Calibri", color: fg, italic: true, margin: 0,
  });
  slide.addText(`${num} / ${total}`, {
    x: W - M - 0.6, y: H - 0.40, w: 0.6, h: 0.30,
    fontSize: 10, fontFace: "Calibri", color: fg,
    align: "right", margin: 0,
  });
}

function slideTitle(slide, kicker, title, primary) {
  slide.addText(kicker, {
    x: M, y: 0.70, w: CW, h: 0.30,
    fontSize: 12, fontFace: "Calibri", color: primary,
    bold: true, charSpacing: 4, margin: 0,
  });
  slide.addText(title, {
    x: M, y: 1.00, w: CW, h: 0.80,
    fontSize: 32, fontFace: "Arial Black", color: C.ink,
    bold: true, margin: 0,
  });
}

const TOTAL = 7;

// ─────────────────────────────────────────────────────
// SLIDE 1 — Title
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Split header
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W * 0.55, h: H,
    fill: { color: C.step1 }, line: { color: C.step1 } });
  s.addShape(pres.shapes.RECTANGLE, { x: W * 0.55, y: 0, w: W * 0.45, h: H,
    fill: { color: C.bg }, line: { color: C.bg } });

  // Left column — title
  s.addText("USMLE INFO SESSION  ·  JUNE COHORT", {
    x: 0.7, y: 0.9, w: W * 0.55 - 1.4, h: 0.36,
    fontSize: 13, fontFace: "Calibri", color: "FFFFFF",
    bold: true, charSpacing: 4, margin: 0,
  });
  s.addText("Step 1 + Step 2 CK", {
    x: 0.7, y: 1.32, w: W * 0.55 - 1.4, h: 0.5,
    fontSize: 26, fontFace: "Arial Black", color: "FFFFFF",
    bold: true, margin: 0,
  });
  s.addText("Info Session", {
    x: 0.7, y: 1.95, w: W * 0.55 - 1.4, h: 1.40,
    fontSize: 68, fontFace: "Arial Black", color: "FFFFFF",
    bold: true, margin: 0,
  });
  s.addText("Bring your questions about the cohort. Open Q&A — no commitment.", {
    x: 0.7, y: 3.55, w: W * 0.55 - 1.4, h: 0.5,
    fontSize: 16, fontFace: "Calibri", italic: true, color: "FFFFFF", margin: 0,
  });

  // Date stamp on left bottom
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 5.5, w: 3.0, h: 1.20,
    fill: { color: C.step1Deep }, line: { color: C.step1Deep },
  });
  s.addText("SAT", {
    x: 0.7, y: 5.55, w: 3.0, h: 0.30,
    fontSize: 13, fontFace: "Calibri", color: "FFFFFF",
    bold: true, align: "center", valign: "middle", charSpacing: 6, margin: 0,
  });
  s.addText("MAY 9, 2026", {
    x: 0.7, y: 5.85, w: 3.0, h: 0.42,
    fontSize: 22, fontFace: "Arial Black", color: "FFFFFF",
    bold: true, align: "center", valign: "middle", margin: 0,
  });
  s.addText("11 AM EDT  ·  6 PM EAT", {
    x: 0.7, y: 6.27, w: 3.0, h: 0.34,
    fontSize: 12, fontFace: "Calibri", color: "FFFFFF",
    bold: true, align: "center", valign: "middle", margin: 0,
  });

  // Right column — Allan photo + credentials
  if (PHOTO) {
    s.addShape(pres.shapes.OVAL, {
      x: W * 0.55 + 1.3, y: 1.4, w: 3.6, h: 3.6,
      fill: { color: C.step2 }, line: { color: C.step2 },
    });
    s.addImage({ path: PHOTO,
      x: W * 0.55 + 1.4, y: 1.5, w: 3.4, h: 3.4,
      sizing: { type: "cover", w: 3.4, h: 3.4 }, rounding: true });
  }
  s.addText("Allan Bakesiga, MD", {
    x: W * 0.55 + 0.4, y: 5.20, w: W * 0.45 - 0.8, h: 0.45,
    fontSize: 22, fontFace: "Calibri", bold: true, color: C.ink,
    align: "center", margin: 0,
  });
  s.addText("MD (Makerere)  ·  MScGH (Duke)", {
    x: W * 0.55 + 0.4, y: 5.60, w: W * 0.45 - 0.8, h: 0.30,
    fontSize: 13, fontFace: "Calibri", color: C.ink2,
    align: "center", margin: 0,
  });
  s.addText("PGY-1 Neurology Resident, Creighton University", {
    x: W * 0.55 + 0.4, y: 5.88, w: W * 0.45 - 0.8, h: 0.30,
    fontSize: 13, fontFace: "Calibri", color: C.ink2,
    align: "center", margin: 0,
  });
  s.addText("Teaching Assistant  |  Epi & Biostats, Duke Global Health Institute", {
    x: W * 0.55 + 0.4, y: 6.18, w: W * 0.45 - 0.8, h: 0.30,
    fontSize: 11, fontFace: "Calibri", italic: true, color: C.step1Deep,
    align: "center", margin: 0,
  });

  footer(s, 1, TOTAL);
}

// ─────────────────────────────────────────────────────
// SLIDE 2 — Application roadmap: MyIntealth → Step 2 CK
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  titleBand(s, C.step1Deep, C.step2Deep);
  slideTitle(s, "APPLICATION ROADMAP  ·  MYINTEALTH → STEP 2 CK",
    "From account to exam — 8 concrete steps", C.step1Deep);

  const steps = [
    { n: 1, h: "Establish MyIntealth account",  ref: "p. 10",
       d: "Required first. Name as on passport, DOB, address, school info, plus identity verification. One MyIntealth ID, forever." },
    { n: 2, h: "Confirm name of record",         ref: "p. 12",
       d: "Must match your passport exactly. Different name on diploma → submit verification documentation." },
    { n: 3, h: "Application for ECFMG Cert.",    ref: "p. 21",
       d: "Pay fee. Medical school must be in the World Directory with ECFMG Sponsor Note (Graduation Years: Current). Track in My Cases." },
    { n: 4, h: "Submit medical credentials",     ref: "p. 34",
       d: "Final diploma + transcript (+ English translations). ECFMG verifies with the issuing institution before the application is accepted." },
    { n: 5, h: "Receive your USMLE ID",          ref: "p. 10",
       d: "Since Jan 2026 USMLE Service Transition, FSMB issues this when you register for your first Step. View in My Profile." },
    { n: 6, h: "Apply for USMLE Step 1",         ref: "p. 26",
       d: "Through FSMB. FSMB confirms with ECFMG that you're eligible. Students need school official to certify enrollment." },
    { n: 7, h: "Take Step 1  ·  Pass / Fail",    ref: "—",
       d: "USMLE shares the outcome directly with ECFMG. You don't need to forward the result yourself." },
    { n: 8, h: "Apply for USMLE Step 2 CK",      ref: "p. 26",
       d: "Same eligibility chain. Plan timing carefully — NRMP and GME programs have deadlines, and ECFMG warns slot availability isn't guaranteed." },
  ];

  const colW = (CW - 0.30) / 2;
  const rowH = 1.12;
  steps.forEach((step, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (colW + 0.30);
    const y = 2.05 + row * (rowH + 0.10);

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: colW, h: rowH,
      fill: { color: C.bgTint }, line: { color: C.border, width: 0.75 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.10, h: rowH,
      fill: { color: i < 4 ? C.step1 : C.step2 },
      line:  { color: i < 4 ? C.step1 : C.step2 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.22, y: y + 0.30, w: 0.45, h: 0.45,
      fill: { color: i < 4 ? C.step1Deep : C.step2Deep },
      line:  { color: i < 4 ? C.step1Deep : C.step2Deep },
    });
    s.addText(String(step.n), {
      x: x + 0.22, y: y + 0.30, w: 0.45, h: 0.45,
      fontSize: 18, fontFace: "Arial Black", color: "FFFFFF",
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    s.addText(step.h, {
      x: x + 0.78, y: y + 0.10, w: colW - 1.50, h: 0.36,
      fontSize: 14, fontFace: "Calibri", bold: true, color: C.ink, margin: 0,
    });
    s.addText(step.ref, {
      x: x + colW - 0.78, y: y + 0.10, w: 0.70, h: 0.30,
      fontSize: 10, fontFace: "Calibri", italic: true, color: C.muted,
      align: "right", margin: 0,
    });
    s.addText(step.d, {
      x: x + 0.78, y: y + 0.46, w: colW - 0.92, h: rowH - 0.50,
      fontSize: 11, fontFace: "Calibri", color: C.ink2, margin: 0,
    });
  });

  s.addText("Source: ECFMG 2026 Information Booklet (page references in upper right of each card).", {
    x: M, y: H - 0.70, w: CW, h: 0.24,
    fontSize: 10, fontFace: "Calibri", italic: true, color: C.muted, margin: 0,
  });
  footer(s, 2, TOTAL);
}

// ─────────────────────────────────────────────────────
// SLIDE 3 — Step 1 Prep
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  titleBand(s, C.step1, C.step1);
  slideTitle(s, "STEP 1 PREP", "Foundational sciences. Pass / Fail.", C.step1);

  // Left: physician tasks + content distribution
  const leftX = M, leftW = CW * 0.42;
  s.addText("WHAT'S TESTED", {
    x: leftX, y: 2.05, w: leftW, h: 0.28,
    fontSize: 11, fontFace: "Calibri", color: C.step1Deep,
    bold: true, charSpacing: 3, margin: 0,
  });
  const tasks = [
    ["Applying foundational science concepts", "60–70%"],
    ["Diagnosis", "20–25%"],
    ["Communication & interpersonal skills", "6–9%"],
    ["Evidence-based medicine", "4–6%"],
  ];
  tasks.forEach((t, i) => {
    const y = 2.40 + i * 0.40;
    s.addText(t[0], { x: leftX, y, w: leftW - 1.0, h: 0.32,
      fontSize: 13, fontFace: "Calibri", color: C.ink, margin: 0 });
    s.addText(t[1], { x: leftX + leftW - 1.0, y, w: 1.0, h: 0.32,
      fontSize: 13, fontFace: "Calibri", bold: true, color: C.step1, align: "right", margin: 0 });
  });

  s.addText("FORMAT", {
    x: leftX, y: 4.30, w: leftW, h: 0.28,
    fontSize: 11, fontFace: "Calibri", color: C.step1Deep,
    bold: true, charSpacing: 3, margin: 0,
  });
  const fmt = [
    ["Question blocks", "7"],
    ["Items (max)", "280"],
    ["Test day length", "8 hours"],
    ["Result", "Pass / Fail"],
  ];
  fmt.forEach((t, i) => {
    const y = 4.65 + i * 0.36;
    s.addText(t[0], { x: leftX, y, w: leftW - 1.2, h: 0.30,
      fontSize: 12, fontFace: "Calibri", color: C.ink2, margin: 0 });
    s.addText(t[1], { x: leftX + leftW - 1.2, y, w: 1.2, h: 0.30,
      fontSize: 12, fontFace: "Calibri", bold: true, color: C.ink, align: "right", margin: 0 });
  });

  // Right: high-yield disciplines + systems
  const rightX = M + CW * 0.42 + 0.30;
  const rightW = CW * 0.58 - 0.30;
  s.addText("HIGH-YIELD CONTENT", {
    x: rightX, y: 2.05, w: rightW, h: 0.28,
    fontSize: 11, fontFace: "Calibri", color: C.step1Deep,
    bold: true, charSpacing: 3, margin: 0,
  });
  const blocks = [
    { h: "Disciplines",
      body: "Pathology · Physiology · Biochemistry · Pharmacology · Anatomy & Embryology · Microbiology · Immunology · Histology · Behavioral Sciences · Genetics" },
    { h: "Organ systems",
      body: "General Principles · Cardiovascular · Respiratory · GI · Renal/Urinary · Reproductive & Endocrine · MSK & Skin · Nervous & Behavioral · Heme & Immune · Biostats & Epi" },
  ];
  blocks.forEach((b, i) => {
    const y = 2.40 + i * 1.85;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX, y, w: rightW, h: 1.65,
      fill: { color: C.bgTint }, line: { color: C.border, width: 0.75 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX, y, w: 0.10, h: 1.65,
      fill: { color: C.step1 }, line: { color: C.step1 },
    });
    s.addText(b.h, {
      x: rightX + 0.30, y: y + 0.15, w: rightW - 0.40, h: 0.34,
      fontSize: 14, fontFace: "Calibri", bold: true, color: C.ink, margin: 0,
    });
    s.addText(b.body, {
      x: rightX + 0.30, y: y + 0.50, w: rightW - 0.40, h: 1.05,
      fontSize: 12, fontFace: "Calibri", color: C.ink2, margin: 0,
    });
  });

  // Strategy footer
  s.addText("Our approach: master First Aid + UWorld with daily Mon–Sun reps over a 4-month roadmap.", {
    x: M, y: H - 0.95, w: CW, h: 0.32,
    fontSize: 12, fontFace: "Calibri", italic: true, color: C.step1Deep,
    bold: true, margin: 0,
  });
  s.addText("Source: usmle.org Step 1 content outline + FA 2025", {
    x: M, y: H - 0.65, w: CW, h: 0.24,
    fontSize: 10, fontFace: "Calibri", italic: true, color: C.muted, margin: 0,
  });
  footer(s, 3, TOTAL);
}

// ─────────────────────────────────────────────────────
// SLIDE 4 — Step 2 CK Prep
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  titleBand(s, C.step2, C.step2);
  slideTitle(s, "STEP 2 CK PREP", "Clinical knowledge. Scaled score 1–300.", C.step2);

  // Left: physician tasks + format
  const leftX = M, leftW = CW * 0.42;
  s.addText("WHAT'S TESTED", {
    x: leftX, y: 2.05, w: leftW, h: 0.28,
    fontSize: 11, fontFace: "Calibri", color: C.step2Deep,
    bold: true, charSpacing: 3, margin: 0,
  });
  const tasks = [
    ["Diagnosis", "34–46%"],
    ["Pharmacotherapy & management", "26–38%"],
    ["Health maintenance & prevention", "8–12%"],
    ["Ethics / professionalism", "5–7%"],
    ["Patient safety / systems-based practice", "5–7%"],
  ];
  tasks.forEach((t, i) => {
    const y = 2.40 + i * 0.36;
    s.addText(t[0], { x: leftX, y, w: leftW - 1.0, h: 0.30,
      fontSize: 12, fontFace: "Calibri", color: C.ink, margin: 0 });
    s.addText(t[1], { x: leftX + leftW - 1.0, y, w: 1.0, h: 0.30,
      fontSize: 12, fontFace: "Calibri", bold: true, color: C.step2, align: "right", margin: 0 });
  });

  s.addText("FORMAT", {
    x: leftX, y: 4.40, w: leftW, h: 0.28,
    fontSize: 11, fontFace: "Calibri", color: C.step2Deep,
    bold: true, charSpacing: 3, margin: 0,
  });
  const fmt = [
    ["Question blocks", "8"],
    ["Items (max)", "318"],
    ["Test day length", "9 hours"],
    ["Score scale", "1 – 300 (mean ≈ 248)"],
  ];
  fmt.forEach((t, i) => {
    const y = 4.75 + i * 0.36;
    s.addText(t[0], { x: leftX, y, w: leftW - 1.5, h: 0.30,
      fontSize: 12, fontFace: "Calibri", color: C.ink2, margin: 0 });
    s.addText(t[1], { x: leftX + leftW - 1.5, y, w: 1.5, h: 0.30,
      fontSize: 12, fontFace: "Calibri", bold: true, color: C.ink, align: "right", margin: 0 });
  });

  // Right: specialties + systems
  const rightX = M + CW * 0.42 + 0.30;
  const rightW = CW * 0.58 - 0.30;
  s.addText("HIGH-YIELD CONTENT", {
    x: rightX, y: 2.05, w: rightW, h: 0.28,
    fontSize: 11, fontFace: "Calibri", color: C.step2Deep,
    bold: true, charSpacing: 3, margin: 0,
  });
  const blocks = [
    { h: "Disciplines",
      body: "Internal Medicine (50–60%) · Surgery (25–30%) · Pediatrics (20–25%) · OB-GYN (10–20%) · Psychiatry (10–15%) · Family Medicine" },
    { h: "Organ systems & cross-cutting",
      body: "Cardiovascular · GI · Respiratory · MSK & Skin · Nervous & Behavioral · Endocrine · Reproductive & Pregnancy · Renal · Heme & Immune · Multisystem · Ethics & Patient Safety" },
  ];
  blocks.forEach((b, i) => {
    const y = 2.40 + i * 1.85;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX, y, w: rightW, h: 1.65,
      fill: { color: C.step2Soft }, line: { color: "EAB308", width: 0.75 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX, y, w: 0.10, h: 1.65,
      fill: { color: C.step2 }, line: { color: C.step2 },
    });
    s.addText(b.h, {
      x: rightX + 0.30, y: y + 0.15, w: rightW - 0.40, h: 0.34,
      fontSize: 14, fontFace: "Calibri", bold: true, color: C.ink, margin: 0,
    });
    s.addText(b.body, {
      x: rightX + 0.30, y: y + 0.50, w: rightW - 0.40, h: 1.05,
      fontSize: 12, fontFace: "Calibri", color: C.ink2, margin: 0,
    });
  });

  // Strategy footer
  s.addText("Our approach: case-based teaching across all disciplines, daily UWorld blocks, full FA 2025 mapping.", {
    x: M, y: H - 0.95, w: CW, h: 0.32,
    fontSize: 12, fontFace: "Calibri", italic: true, color: C.step2Deep,
    bold: true, margin: 0,
  });
  s.addText("Source: usmle.org Step 2 CK content outline + FA 2025", {
    x: M, y: H - 0.65, w: CW, h: 0.24,
    fontSize: 10, fontFace: "Calibri", italic: true, color: C.muted, margin: 0,
  });
  footer(s, 4, TOTAL);
}

// ─────────────────────────────────────────────────────
// SLIDE 5 — How Classes Work I (Daily structure)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  titleBand(s, C.step1, C.step2);
  slideTitle(s, "HOW THE CLASSES WORK  ·  PART 1",
    "Daily structure — Mon to Sun", C.step1);

  // Big headline stats
  const stats = [
    { big: "Mon–Sun", small: "Daily classes" },
    { big: "4 months", small: "Structured roadmap" },
    { big: "Step 1 + 2", small: "Combined option" },
  ];
  const sw = (CW - 2 * 0.30) / 3;
  stats.forEach((st, i) => {
    const x = M + i * (sw + 0.30);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.10, w: sw, h: 1.20,
      fill: { color: C.step1Soft }, line: { color: C.step1Soft },
    });
    s.addText(st.big, {
      x, y: 2.20, w: sw, h: 0.65,
      fontSize: 30, fontFace: "Arial Black", color: C.step1Deep,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    s.addText(st.small, {
      x, y: 2.85, w: sw, h: 0.40,
      fontSize: 13, fontFace: "Calibri", color: C.ink2,
      align: "center", valign: "middle", charSpacing: 2,
      bold: true, margin: 0,
    });
  });

  // Cards: anatomy of a class
  const cards = [
    { num: 1, h: "Topic teaching", body: "30–45 min focused teaching mapped page-by-page to First Aid 2025." },
    { num: 2, h: "UWorld debrief",  body: "Walk through the day's UWorld block with reasoning for every option." },
    { num: 3, h: "High-yield wrap", body: "5-minute mnemonic / pearls recap that you take into the next day." },
    { num: 4, h: "Office hours",    body: "Open Q&A outside class time for clarifying questions and weak areas." },
  ];
  const cw = (CW - 0.45) / 4;
  const cy = 3.70;
  const ch = 2.40;
  cards.forEach((c, i) => {
    const x = M + i * (cw + 0.15);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cy, w: cw, h: ch,
      fill: { color: C.bg }, line: { color: C.border, width: 0.75 },
      shadow: { type: "outer", color: "0C2A3D", blur: 10, offset: 1, angle: 90, opacity: 0.08 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cy, w: cw, h: 0.08,
      fill: { color: i % 2 === 0 ? C.step1 : C.step2 },
      line:  { color: i % 2 === 0 ? C.step1 : C.step2 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.30, y: cy + 0.30, w: 0.50, h: 0.50,
      fill: { color: i % 2 === 0 ? C.step1 : C.step2 },
      line:  { color: i % 2 === 0 ? C.step1 : C.step2 },
    });
    s.addText(String(c.num), {
      x: x + 0.30, y: cy + 0.30, w: 0.50, h: 0.50,
      fontSize: 18, fontFace: "Arial Black", color: "FFFFFF",
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    s.addText(c.h, {
      x: x + 0.30, y: cy + 0.95, w: cw - 0.60, h: 0.40,
      fontSize: 15, fontFace: "Calibri", bold: true, color: C.ink, margin: 0,
    });
    s.addText(c.body, {
      x: x + 0.30, y: cy + 1.40, w: cw - 0.60, h: ch - 1.50,
      fontSize: 11.5, fontFace: "Calibri", color: C.ink2, margin: 0,
    });
  });

  footer(s, 5, TOTAL);
}

// ─────────────────────────────────────────────────────
// SLIDE 6 — How Classes Work II (Roadmap & mentorship)
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  titleBand(s, C.step1, C.step2);
  slideTitle(s, "HOW THE CLASSES WORK  ·  PART 2",
    "4-month roadmap + end-to-end mentorship", C.step1);

  // 4-month roadmap timeline
  const months = [
    { name: "Month 1", topic: "Cardiovascular · Respiratory · General Pathology · Epi/Biostats" },
    { name: "Month 2", topic: "Endocrine · GI · Heme/Onc · Renal" },
    { name: "Month 3", topic: "Musculoskeletal · Neurology · Psychiatry · Reproductive" },
    { name: "Month 4", topic: "Immunology / Microbiology · Pharmacology · Behavioral · Mock blocks" },
  ];
  const mw = (CW - 3 * 0.20) / 4;
  const my = 2.05;
  months.forEach((m, i) => {
    const x = M + i * (mw + 0.20);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: my, w: mw, h: 1.55,
      fill: { color: C.bgTint }, line: { color: C.border2, width: 0.75 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: my, w: mw, h: 0.36,
      fill: { color: C.step1 }, line: { color: C.step1 },
    });
    s.addText(m.name, {
      x, y: my, w: mw, h: 0.36,
      fontSize: 13, fontFace: "Calibri", bold: true, color: "FFFFFF",
      align: "center", valign: "middle", charSpacing: 3, margin: 0,
    });
    s.addText(m.topic, {
      x: x + 0.18, y: my + 0.45, w: mw - 0.36, h: 1.05,
      fontSize: 12, fontFace: "Calibri", color: C.ink2,
      align: "left", margin: 0,
    });
  });

  // Mentorship panel
  s.addText("END-TO-END MENTORSHIP", {
    x: M, y: 4.00, w: CW, h: 0.30,
    fontSize: 12, fontFace: "Calibri", color: C.step2Deep,
    bold: true, charSpacing: 4, margin: 0,
  });
  const mentor = [
    "ECFMG application — credentials submission, sponsor notes, EPIC.",
    "Personal statement & CV review, with iterative drafts.",
    "Interview prep — mock interviews, IMG-specific Q&A, programs by signal.",
    "ERAS / NRMP timeline coaching from application to rank list.",
    "Combined Step 1 + Step 2 expedited track for efficient overlap.",
  ];
  mentor.forEach((line, i) => {
    s.addShape(pres.shapes.OVAL, {
      x: M, y: 4.40 + i * 0.42, w: 0.18, h: 0.18,
      fill: { color: C.step2 }, line: { color: C.step2 },
    });
    s.addText(line, {
      x: M + 0.30, y: 4.34 + i * 0.42, w: CW - 0.30, h: 0.36,
      fontSize: 13, fontFace: "Calibri", color: C.ink, margin: 0,
    });
  });

  footer(s, 6, TOTAL);
}

// ─────────────────────────────────────────────────────
// SLIDE 7 — Sign up + link
// ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.step1Deep };

  s.addText("READY TO JOIN THE COHORT?", {
    x: M, y: 0.80, w: CW, h: 0.40,
    fontSize: 14, fontFace: "Calibri", color: "FFFFFF",
    bold: true, charSpacing: 5, align: "center", margin: 0,
  });
  s.addText("Sign up · Limited slots", {
    x: M, y: 1.30, w: CW, h: 0.85,
    fontSize: 48, fontFace: "Arial Black", color: "FFFFFF",
    bold: true, align: "center", margin: 0,
  });

  // Big URL
  s.addText("bakesiga.github.io/usmle-dashboard", {
    x: M, y: 2.40, w: CW, h: 0.80,
    fontSize: 38, fontFace: "Arial Black", color: "FFFFFF",
    bold: true, align: "center", margin: 0,
  });

  // QR code
  if (QR) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: W / 2 - 1.30, y: 3.50, w: 2.60, h: 2.60,
      fill: { color: "FFFFFF" }, line: { color: "FFFFFF" },
    });
    s.addImage({ path: QR, x: W / 2 - 1.20, y: 3.60, w: 2.40, h: 2.40 });
  }

  // Contact line
  s.addText("Or reach Allan directly:", {
    x: M, y: H - 1.50, w: CW, h: 0.30,
    fontSize: 13, fontFace: "Calibri", italic: true, color: "E0F2FE",
    align: "center", margin: 0,
  });
  s.addText("allanbakesiga@gmail.com   ·   WhatsApp +256 705 571 443   ·   Call +1 984 710 2902", {
    x: M, y: H - 1.10, w: CW, h: 0.40,
    fontSize: 16, fontFace: "Calibri", bold: true, color: "FFFFFF",
    align: "center", margin: 0,
  });

  footer(s, 7, TOTAL, { color: "B8D6EC" });
}

// Output
pres.writeFile({ fileName: "USMLE_Info_Session_Deck.pptx" }).then((p) => {
  console.log("✔ wrote", p);
});
