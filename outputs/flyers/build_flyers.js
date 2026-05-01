// Build USMLE recruitment flyers (Step 1 + Step 2 CK).
// One PPTX, two slides — portrait Letter (8.5 x 11").
// Run:  node build_flyers.js

const pptxgen = require("pptxgenjs");
const fs = require("fs");

// If you drop a square-ish photo at outputs/flyers/allan.jpg or allan.png,
// it'll be used instead of the "AB" initials. Otherwise the avatar shows AB.
const PHOTO_CANDIDATES = ["allan.jpg", "allan.jpeg", "allan.png", "allan.webp"];
const PHOTO_PATH = PHOTO_CANDIDATES.find((p) => fs.existsSync(p)) || null;

function newPres(title) {
  const p = new pptxgen();
  p.defineLayout({ name: "FLYER", width: 8.5, height: 11 });
  p.layout = "FLYER";
  p.author = "Allan Bakesiga";
  p.title = title;
  return p;
}

// ── Palette ────────────────────────────────────────────
const C = {
  ink:        "0C2A3D",
  ink2:       "345671",
  muted:      "6B87A3",
  bg:         "FFFFFF",
  bgTint:     "F5FBFF",
  border:     "D6E8F5",

  step1:      "0284C7",
  step1Soft:  "E0F2FE",
  step1Deep:  "075985",

  step2:      "D97706",
  step2Soft:  "FEF3C7",
  step2Deep:  "B45309",
};

// ── Helpers ────────────────────────────────────────────
const PAGE_W = 8.5;
const PAGE_H = 11;
const MARGIN = 0.5;
const CONTENT_W = PAGE_W - 2 * MARGIN;

function shadow() {
  return { type: "outer", color: "0C2A3D", blur: 8, offset: 1, angle: 90, opacity: 0.08 };
}

// Renders one flyer slide.
function buildFlyer(pres, config) {
  const { track, title, subtitle, primary, soft, deep, accent, accentLabel, topics, topicGroups } = config;
  const groups = topicGroups || [{ label: null, items: topics }];
  const slide = pres.addSlide();
  slide.background = { color: C.bg };

  // ── Header band ─────────────────────────────────────
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: PAGE_W, h: 2.00,
    fill: { color: primary }, line: { color: primary },
  });

  slide.addText("Enrolling now · July–October cohort", {
    x: MARGIN, y: 0.26, w: CONTENT_W * 0.65, h: 0.24,
    fontSize: 11, fontFace: "Calibri", color: "FFFFFF",
    bold: true, charSpacing: 4, margin: 0,
  });
  slide.addText("USMLE", {
    x: MARGIN, y: 0.50, w: CONTENT_W * 0.65, h: 0.32,
    fontSize: 24, fontFace: "Arial Black", color: "FFFFFF",
    bold: true, charSpacing: 8, margin: 0,
  });
  slide.addText(title, {
    x: MARGIN, y: 0.84, w: CONTENT_W * 0.65, h: 0.85,
    fontSize: 54, fontFace: "Arial Black", color: "FFFFFF",
    bold: true, margin: 0,
  });
  slide.addText(subtitle, {
    x: MARGIN, y: 1.66, w: CONTENT_W * 0.85, h: 0.26,
    fontSize: 13, fontFace: "Calibri", color: "FFFFFF",
    italic: true, margin: 0,
  });

  // Right-side stamp on the header band
  const stampX = PAGE_W - MARGIN - 2.00;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: stampX, y: 0.50, w: 2.00, h: 1.05,
    fill: { color: deep }, line: { color: deep },
  });
  slide.addText("MON–SUN", {
    x: stampX, y: 0.55, w: 2.00, h: 0.32,
    fontSize: 12, fontFace: "Calibri", color: "FFFFFF",
    bold: true, align: "center", valign: "middle", charSpacing: 4, margin: 0,
  });
  slide.addText("4-month prep", {
    x: stampX, y: 0.88, w: 2.00, h: 0.32,
    fontSize: 14, fontFace: "Arial Black", color: "FFFFFF",
    bold: true, align: "center", valign: "middle", margin: 0,
  });
  slide.addText("· daily classes ·", {
    x: stampX, y: 1.20, w: 2.00, h: 0.30,
    fontSize: 10.5, fontFace: "Calibri", color: "FFFFFF",
    italic: true, align: "center", valign: "middle", margin: 0,
  });

  // ── Instructor strip ────────────────────────────────
  const stripY = 2.15;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN, y: stripY, w: CONTENT_W, h: 1.10,
    fill: { color: C.bgTint }, line: { color: C.border, width: 0.75 },
  });
  // Avatar — photo if available, otherwise "AB" initials
  if (PHOTO_PATH) {
    // Coloured ring behind the photo for brand polish
    slide.addShape(pres.shapes.OVAL, {
      x: MARGIN + 0.16, y: stripY + 0.14, w: 0.86, h: 0.86,
      fill: { color: primary }, line: { color: primary },
    });
    slide.addImage({
      path: PHOTO_PATH,
      x: MARGIN + 0.20, y: stripY + 0.18, w: 0.78, h: 0.78,
      sizing: { type: "cover", w: 0.78, h: 0.78 },
      rounding: true,
    });
  } else {
    slide.addShape(pres.shapes.OVAL, {
      x: MARGIN + 0.20, y: stripY + 0.18, w: 0.78, h: 0.78,
      fill: { color: primary }, line: { color: primary },
    });
    slide.addText("AB", {
      x: MARGIN + 0.20, y: stripY + 0.18, w: 0.78, h: 0.78,
      fontSize: 24, fontFace: "Arial Black", color: "FFFFFF",
      bold: true, align: "center", valign: "middle", margin: 0,
    });
  }
  slide.addText("Allan Bakesiga, MD", {
    x: MARGIN + 1.15, y: stripY + 0.10, w: CONTENT_W - 1.2, h: 0.36,
    fontSize: 18, fontFace: "Calibri", bold: true, color: C.ink, margin: 0,
  });
  slide.addText("MD (Makerere)  ·  MScGH (Duke)  ·  PGY-1 Neurology Resident, Creighton", {
    x: MARGIN + 1.15, y: stripY + 0.46, w: CONTENT_W - 1.2, h: 0.30,
    fontSize: 12, fontFace: "Calibri", color: C.ink2, margin: 0,
  });
  slide.addText("Epidemiology & biostatistics teaching assistant", {
    x: MARGIN + 1.15, y: stripY + 0.76, w: CONTENT_W - 1.2, h: 0.28,
    fontSize: 11, fontFace: "Calibri", italic: true, color: deep, margin: 0,
  });

  // ── Stats row ───────────────────────────────────────
  const statsY = 3.40;
  const stats = [
    { big: "Mon–Sun", small: "Daily classes" },
    { big: "4 mo",     small: "Structured roadmap" },
    { big: "Step 1+2", small: "Combined option" },
  ];
  const statW = (CONTENT_W - 0.4) / 3;
  stats.forEach((s, i) => {
    const x = MARGIN + i * (statW + 0.20);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: statsY, w: statW, h: 1.05,
      fill: { color: soft }, line: { color: soft },
    });
    slide.addText(s.big, {
      x, y: statsY + 0.12, w: statW, h: 0.50,
      fontSize: 26, fontFace: "Arial Black", color: deep,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(s.small, {
      x, y: statsY + 0.62, w: statW, h: 0.35,
      fontSize: 11, fontFace: "Calibri", color: C.ink2,
      align: "center", valign: "middle", charSpacing: 2,
      bold: true, margin: 0,
    });
  });

  // ── Value-prop cards (2x2) ──────────────────────────
  const cardsY = 4.55;
  const cardW = (CONTENT_W - 0.25) / 2;
  const cardH = 1.20;
  const cards = [
    { title: "Daily classes",      body: "Monday to Sunday. Topic-by-topic flow that keeps you in the material every single day." },
    { title: "Active community",   body: "Off-class peer discussions, accountability, and rapid Q&A between sessions." },
    { title: "Textbook + Qbank",   body: "Full review of the recommended textbook plus USMLE-style questions from the recommended Qbank." },
    { title: "End-to-end mentorship", body: "Guidance through ECFMG, CV, personal statement, interview prep, and residency application." },
  ];
  cards.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * (cardW + 0.25);
    const y = cardsY + row * (cardH + 0.18);
    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: C.bg }, line: { color: C.border, width: 0.75 },
      shadow: shadow(),
    });
    // Left accent bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.10, h: cardH,
      fill: { color: primary }, line: { color: primary },
    });
    // Number circle (white digit on solid deep color → strong contrast)
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.25, y: y + 0.22, w: 0.48, h: 0.48,
      fill: { color: deep }, line: { color: deep },
    });
    slide.addText(String(i + 1), {
      x: x + 0.25, y: y + 0.22, w: 0.48, h: 0.48,
      fontSize: 18, fontFace: "Arial Black", color: "FFFFFF",
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    // Title
    slide.addText(c.title, {
      x: x + 0.82, y: y + 0.18, w: cardW - 0.92, h: 0.34,
      fontSize: 15, fontFace: "Calibri", bold: true, color: C.ink, margin: 0,
    });
    // Body
    slide.addText(c.body, {
      x: x + 0.82, y: y + 0.54, w: cardW - 0.92, h: cardH - 0.60,
      fontSize: 11.5, fontFace: "Calibri", color: C.ink2, margin: 0,
    });
  });

  // ── Topics row ──────────────────────────────────────
  const topicsY = 7.20;
  slide.addText("WHAT WE COVER", {
    x: MARGIN, y: topicsY, w: CONTENT_W, h: 0.30,
    fontSize: 11, fontFace: "Calibri", color: deep,
    bold: true, charSpacing: 4, margin: 0,
  });
  // Render each group on its own labeled line
  const groupYStart = topicsY + 0.34;
  const groupHeight = 0.55;
  groups.forEach((g, gi) => {
    const y = groupYStart + gi * groupHeight;
    const runs = [];
    if (g.label) {
      runs.push({ text: g.label + ":  ", options: { bold: true, color: deep } });
    }
    runs.push({ text: g.items.join("  ·  "), options: { color: C.ink } });
    slide.addText(runs, {
      x: MARGIN, y, w: CONTENT_W, h: groupHeight,
      fontSize: 12.5, fontFace: "Calibri", margin: 0,
    });
  });
  const topicsEnd = groupYStart + groups.length * groupHeight;

  // ── Combined-prep callout ───────────────────────────
  // Hug whichever topics block is above (Step 1 has 2 lines, Step 2 has 1).
  const calloutY = topicsEnd + 0.05;
  const calloutH = 0.85;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN, y: calloutY, w: CONTENT_W, h: calloutH,
    fill: { color: deep }, line: { color: deep },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN, y: calloutY, w: 0.10, h: calloutH,
    fill: { color: accent }, line: { color: accent },
  });
  slide.addText("Doing both Step 1 & 2?", {
    x: MARGIN + 0.30, y: calloutY + 0.08, w: CONTENT_W - 0.40, h: 0.30,
    fontSize: 14, fontFace: "Calibri", bold: true, color: "FFFFFF", margin: 0,
  });
  slide.addText("Take the expedited combined prep — overlapping topics taught once, reinforced across both Steps. Save time, retain more.", {
    x: MARGIN + 0.30, y: calloutY + 0.38, w: CONTENT_W - 0.40, h: 0.42,
    fontSize: 11.5, fontFace: "Calibri", color: "FFFFFF", margin: 0,
  });

  // ── CTA + contact ───────────────────────────────────
  // Pull CTA up to follow callout when there's empty space (Step 2),
  // capped at 9.55 so Step 1 (taller topics block) still fits above the bottom rule.
  const calloutEnd = calloutY + calloutH;
  const ctaY = Math.min(calloutEnd + 0.25, 9.55);
  slide.addText("SIGN UP", {
    x: MARGIN, y: ctaY, w: CONTENT_W, h: 0.22,
    fontSize: 11, fontFace: "Calibri", color: deep,
    bold: true, charSpacing: 4, margin: 0,
  });
  slide.addText("bakesiga.github.io/usmle-dashboard", {
    x: MARGIN, y: ctaY + 0.20, w: CONTENT_W, h: 0.44,
    fontSize: 24, fontFace: "Arial Black", color: primary,
    bold: true, margin: 0,
  });

  // Two contact rows: email + WhatsApp on a 2-column layout
  const contactsY = ctaY + 0.70;
  const colW = (CONTENT_W - 0.20) / 2;

  // Email column (left): blue dot + address
  slide.addShape(pres.shapes.OVAL, {
    x: MARGIN, y: contactsY + 0.06, w: 0.18, h: 0.18,
    fill: { color: primary }, line: { color: primary },
  });
  slide.addText("allanbakesiga@gmail.com", {
    x: MARGIN + 0.26, y: contactsY, w: colW - 0.26, h: 0.30,
    fontSize: 12.5, fontFace: "Calibri", bold: true, color: C.ink, margin: 0,
  });

  // WhatsApp column (right): real WhatsApp logo + number
  slide.addImage({
    path: "whatsapp.png",
    x: MARGIN + colW + 0.20, y: contactsY + 0.02, w: 0.26, h: 0.26,
  });
  slide.addText("WhatsApp · +256 705 571 443", {
    x: MARGIN + colW + 0.54, y: contactsY, w: colW - 0.54, h: 0.30,
    fontSize: 12.5, fontFace: "Calibri", bold: true, color: C.ink, margin: 0,
  });

  // Limited-cohort note (small italic, snug above bottom rule)
  slide.addText("Limited cohort · Sign in with the Gmail Allan adds you under", {
    x: MARGIN, y: contactsY + 0.32, w: CONTENT_W, h: 0.18,
    fontSize: 9.5, fontFace: "Calibri", italic: true, color: C.muted,
    align: "left", margin: 0,
  });

  // ── Bottom rule (taller, brand gradient look via two stacked bars) ──
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: PAGE_H - 0.20, w: PAGE_W, h: 0.05,
    fill: { color: deep }, line: { color: deep },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: PAGE_H - 0.15, w: PAGE_W, h: 0.15,
    fill: { color: primary }, line: { color: primary },
  });
}

// ── Step 1 flyer (own file) ────────────────────────────
const p1 = newPres("USMLE Step 1 — Class Flyer");
buildFlyer(p1, {
  track: "step1",
  title: "Step 1",
  subtitle: "Master the foundational sciences. Build the base every step rests on.",
  primary: C.step1, soft: C.step1Soft, deep: C.step1Deep,
  accent: C.step2, accentLabel: "Step 2 CK",
  topicGroups: [
    {
      label: "Disciplines",
      items: [
        "Anatomy", "Physiology", "Biochemistry", "Pathology",
        "Pharmacology", "Microbiology", "Immunology",
        "Behavioral science", "Biostatistics", "Genetics",
      ],
    },
    {
      label: "Organ systems",
      items: [
        "Cardiovascular", "Respiratory", "Gastrointestinal", "Renal",
        "Reproductive", "Endocrine", "Musculoskeletal",
        "Nervous system", "Psychiatry", "Heme/Onc", "Skin",
      ],
    },
  ],
});

// ── Step 2 CK flyer (own file) ─────────────────────────
const p2 = newPres("USMLE Step 2 CK — Class Flyer");
buildFlyer(p2, {
  track: "step2",
  title: "Step 2 CK",
  subtitle: "Sharpen clinical reasoning. Move from facts to bedside decisions.",
  primary: C.step2, soft: C.step2Soft, deep: C.step2Deep,
  accent: C.step1, accentLabel: "Step 1",
  topics: [
    "Internal Medicine", "Surgery", "OB-GYN", "Pediatrics",
    "Psychiatry", "Family Medicine", "Preventive Medicine",
    "Ethics", "Biostatistics", "Patient Safety",
  ],
});

(async () => {
  const a = await p1.writeFile({ fileName: "USMLE_Step1_Flyer.pptx" });
  const b = await p2.writeFile({ fileName: "USMLE_Step2_Flyer.pptx" });
  console.log("✔ wrote", a);
  console.log("✔ wrote", b);
})();
