// Build USMLE Info Session poster — synthesis of Step 1 + Step 2 CK flyers.
// Same brand language; split-colour header to represent both tracks.
// Run:  node build_info_session.js
//
// Date / time / Zoom info are placeholders at the top — edit before sending.

const pptxgen = require("pptxgenjs");
const fs = require("fs");

// ── Edit these, then rebuild ───────────────────────────
const SESSION = {
  weekdayShort: "SAT",
  monthDay:     "MAY 9",
  fullDate:     "Saturday, May 9, 2026",
  time:         "11:00 AM EDT  ·  6:00 PM EAT",
  duration:     "60 min · open Q&A",
  zoomUrl:      "duke.zoom.us/j/96991939005",
  zoomId:       "969 9193 9005",
  zoomPass:     "",
};

// ── Photo (uses same allan.jpg as flyers) ──────────────
const PHOTO_CANDIDATES = ["allan.jpg", "allan.jpeg", "allan.png", "allan.webp"];
const PHOTO_PATH = PHOTO_CANDIDATES.find((p) => fs.existsSync(p)) || null;

// ── Palette (matches flyers) ───────────────────────────
const C = {
  ink: "0C2A3D",  ink2: "345671", muted: "6B87A3",
  bg: "FFFFFF",   bgTint: "F5FBFF",
  border: "D6E8F5", border2: "B8D6EC",
  step1: "0284C7",  step1Soft: "E0F2FE",  step1Deep: "075985",
  step2: "D97706",  step2Soft: "FEF3C7",  step2Deep: "B45309",
};

const pres = new pptxgen();
pres.defineLayout({ name: "POSTER", width: 8.5, height: 11 });
pres.layout = "POSTER";
pres.author = "Allan Bakesiga";
pres.title = "USMLE Info Session — Step 1 & Step 2 CK";

const PAGE_W = 8.5, PAGE_H = 11, MARGIN = 0.5, CONTENT_W = PAGE_W - 2 * MARGIN;

const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── Header band: split blue / amber ────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: PAGE_W * 0.55, h: 2.00,
  fill: { color: C.step1 }, line: { color: C.step1 },
});
slide.addShape(pres.shapes.RECTANGLE, {
  x: PAGE_W * 0.55, y: 0, w: PAGE_W * 0.45, h: 2.00,
  fill: { color: C.step2 }, line: { color: C.step2 },
});

// Top kicker label (across the split)
slide.addText("FREE  ·  JULY–OCTOBER COHORT", {
  x: MARGIN, y: 0.18, w: PAGE_W - MARGIN - 2.10, h: 0.34,
  fontSize: 14, fontFace: "Calibri", color: "FFFFFF",
  bold: true, charSpacing: 3, margin: 0,
});

// "USMLE" small kicker
slide.addText("USMLE · STEP 1 + STEP 2 CK", {
  x: MARGIN, y: 0.54, w: PAGE_W - MARGIN - 2.10, h: 0.32,
  fontSize: 14, fontFace: "Arial Black", color: "FFFFFF",
  bold: true, charSpacing: 4, margin: 0,
});

// Big title: INFO SESSION
slide.addText("Info Session", {
  x: MARGIN, y: 0.86, w: PAGE_W - MARGIN - 2.10, h: 0.85,
  fontSize: 50, fontFace: "Arial Black", color: "FFFFFF",
  bold: true, margin: 0,
});

// Subtitle / pitch
slide.addText("Bring your questions about the cohort. Open Q&A, no commitment.", {
  x: MARGIN, y: 1.66, w: PAGE_W - MARGIN - 2.10, h: 0.26,
  fontSize: 13, fontFace: "Calibri", color: "FFFFFF",
  italic: true, margin: 0,
});

// ── Date / time stamp on the right (deep amber for contrast) ──
const stampX = PAGE_W - MARGIN - 2.00;
slide.addShape(pres.shapes.RECTANGLE, {
  x: stampX, y: 0.50, w: 2.00, h: 1.30,
  fill: { color: C.step2Deep }, line: { color: C.step2Deep },
});
slide.addText(SESSION.weekdayShort, {
  x: stampX, y: 0.55, w: 2.00, h: 0.32,
  fontSize: 13, fontFace: "Calibri", color: "FFFFFF",
  bold: true, align: "center", valign: "middle", charSpacing: 6, margin: 0,
});
slide.addText(SESSION.monthDay, {
  x: stampX, y: 0.86, w: 2.00, h: 0.42,
  fontSize: 22, fontFace: "Arial Black", color: "FFFFFF",
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText(SESSION.time, {
  x: stampX, y: 1.30, w: 2.00, h: 0.30,
  fontSize: 10, fontFace: "Calibri", color: "FFFFFF",
  bold: true, align: "center", valign: "middle", margin: 0,
});
slide.addText(SESSION.duration, {
  x: stampX, y: 1.55, w: 2.00, h: 0.22,
  fontSize: 9, fontFace: "Calibri", color: "FFFFFF",
  italic: true, align: "center", valign: "middle", margin: 0,
});

// ── Instructor strip ───────────────────────────────────
const stripY = 2.05;
slide.addShape(pres.shapes.RECTANGLE, {
  x: MARGIN, y: stripY, w: CONTENT_W, h: 1.10,
  fill: { color: C.bgTint }, line: { color: C.border, width: 0.75 },
});

// Photo or AB initials with split-coloured ring
if (PHOTO_PATH) {
  // Left half blue ring, right half amber ring (to match the split header)
  slide.addShape(pres.shapes.OVAL, {
    x: MARGIN + 0.16, y: stripY + 0.14, w: 0.86, h: 0.86,
    fill: { color: C.step1 }, line: { color: C.step1 },
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
    fill: { color: C.step1 }, line: { color: C.step1 },
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
slide.addText("MD (Makerere)  ·  MScGH (Duke)  ·  PGY-1 Neurology Resident, Creighton University", {
  x: MARGIN + 1.15, y: stripY + 0.46, w: CONTENT_W - 1.2, h: 0.30,
  fontSize: 12, fontFace: "Calibri", color: C.ink2, margin: 0,
});
slide.addText("Teaching Assistant  |  Epidemiology & Biostatistics, Duke Global Health Institute", {
  x: MARGIN + 1.15, y: stripY + 0.76, w: CONTENT_W - 1.2, h: 0.28,
  fontSize: 10.5, fontFace: "Calibri", italic: true, color: C.step1Deep, margin: 0,
});

// ── Section header: WHAT WE'LL COVER ───────────────────
const agendaY = 3.35;
slide.addText("WHAT WE'LL COVER  ·  ~60 minutes", {
  x: MARGIN, y: agendaY, w: CONTENT_W, h: 0.30,
  fontSize: 11, fontFace: "Calibri", color: C.step1Deep,
  bold: true, charSpacing: 4, margin: 0,
});

// ── Agenda cards (2x2) ─────────────────────────────────
const cardsY = 3.70;
const cardW = (CONTENT_W - 0.25) / 2;
const cardH = 1.30;

const agenda = [
  {
    accent: C.step1,
    title: "Course structure",
    body: "Daily Mon–Sun classes, 4-month roadmap, how the syllabus flows topic-by-topic.",
  },
  {
    accent: C.step2,
    title: "Materials & resources",
    body: "Recommended textbook, Qbank, and curated supplements walked through together.",
  },
  {
    accent: C.step1,
    title: "End-to-end mentorship",
    body: "USMLE Steps 1 & 2 CK, ECFMG application, CV, personal statement, interviews, and the residency match.",
  },
  {
    accent: C.step2,
    title: "Cost & enrollment",
    body: "Pricing, payment options, the combined Step 1+2 expedited track, and how to join the July–October cohort.",
  },
];

agenda.forEach((c, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = MARGIN + col * (cardW + 0.25);
  const y = cardsY + row * (cardH + 0.18);
  // Card background
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: cardW, h: cardH,
    fill: { color: C.bg }, line: { color: C.border, width: 0.75 },
    shadow: { type: "outer", color: "0C2A3D", blur: 8, offset: 1, angle: 90, opacity: 0.08 },
  });
  // Left accent bar — colour alternates by track
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.10, h: cardH,
    fill: { color: c.accent }, line: { color: c.accent },
  });
  // Number circle in track colour
  const deep = c.accent === C.step1 ? C.step1Deep : C.step2Deep;
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

// ── Zoom join callout (replaces combined-prep callout) ──
const calloutY = 6.75;
const calloutH = 1.55;
slide.addShape(pres.shapes.RECTANGLE, {
  x: MARGIN, y: calloutY, w: CONTENT_W, h: calloutH,
  fill: { color: C.step1Deep }, line: { color: C.step1Deep },
});
// Two-tone left accent: half blue, half amber to echo the synthesis
slide.addShape(pres.shapes.RECTANGLE, {
  x: MARGIN, y: calloutY, w: 0.10, h: calloutH / 2,
  fill: { color: C.step1 }, line: { color: C.step1 },
});
slide.addShape(pres.shapes.RECTANGLE, {
  x: MARGIN, y: calloutY + calloutH / 2, w: 0.10, h: calloutH / 2,
  fill: { color: C.step2 }, line: { color: C.step2 },
});

slide.addText("JOIN THE ZOOM SESSION", {
  x: MARGIN + 0.30, y: calloutY + 0.12, w: CONTENT_W - 0.40, h: 0.26,
  fontSize: 11, fontFace: "Calibri", color: "FFFFFF",
  bold: true, charSpacing: 4, margin: 0,
});
slide.addText(SESSION.fullDate + "  ·  " + SESSION.time, {
  x: MARGIN + 0.30, y: calloutY + 0.36, w: CONTENT_W - 0.40, h: 0.30,
  fontSize: 14, fontFace: "Calibri", bold: true, color: "FFFFFF", margin: 0,
});
slide.addText(SESSION.zoomUrl, {
  x: MARGIN + 0.30, y: calloutY + 0.68, w: CONTENT_W - 0.40, h: 0.42,
  fontSize: 22, fontFace: "Arial Black", color: "FFFFFF", bold: true, margin: 0,
});
slide.addText(
  SESSION.zoomPass
    ? "Meeting ID: " + SESSION.zoomId + "    ·    Passcode: " + SESSION.zoomPass
    : "Meeting ID: " + SESSION.zoomId,
  {
    x: MARGIN + 0.30, y: calloutY + 1.12, w: CONTENT_W - 0.40, h: 0.30,
    fontSize: 12, fontFace: "Calibri", color: "FFFFFF", margin: 0,
  }
);

// ── Contacts (3-up) ───────────────────────────────────
const ctaY = 8.55;
slide.addText("CAN'T MAKE IT? CONTACT ALLAN ANY TIME ON:", {
  x: MARGIN, y: ctaY, w: CONTENT_W, h: 0.24,
  fontSize: 11, fontFace: "Calibri", color: C.step1Deep,
  bold: true, charSpacing: 4, margin: 0,
});

const contactsY = ctaY + 0.28;
const colGap = 0.18;
const colW = (CONTENT_W - 2 * colGap) / 3;
const charW = 0.092;
const iconGap = 0.08;

function contact(colIndex, iconPath, iconW, label) {
  const labelW = label.length * charW;
  const contentW = iconW + iconGap + labelW;
  const cellLeft = MARGIN + colIndex * (colW + colGap);
  const padLeft = Math.max(0, (colW - contentW) / 2);
  const iconX = cellLeft + padLeft;
  const textX = iconX + iconW + iconGap;
  const iconYNudge = (0.32 - iconW) / 2;
  slide.addImage({ path: iconPath, x: iconX, y: contactsY + iconYNudge, w: iconW, h: iconW });
  slide.addText(label, {
    x: textX, y: contactsY, w: labelW + 0.10, h: 0.32,
    fontSize: 12, fontFace: "Calibri", bold: true, color: C.ink,
    align: "left", valign: "middle", margin: 0,
  });
}

// Use the blue-coloured icons since the poster's primary is blue
contact(0, "email-blue.png", 0.26, "allanbakesiga@gmail.com");
contact(1, "whatsapp.png",   0.28, "+256 705 571 443");
contact(2, "phone-blue.png", 0.26, "+1 984 710 2902");

// ── Closing line + dashboard URL ──────────────────────
slide.addText("Course materials and class recordings live at:", {
  x: MARGIN, y: ctaY + 0.86, w: CONTENT_W, h: 0.22,
  fontSize: 10.5, fontFace: "Calibri", italic: true, color: C.ink2, margin: 0,
});
slide.addText("bakesiga.github.io/usmle-dashboard", {
  x: MARGIN, y: ctaY + 1.08, w: CONTENT_W, h: 0.42,
  fontSize: 22, fontFace: "Arial Black", color: C.step1, bold: true, margin: 0,
});

// ── Bottom rule (split blue/amber) ────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: PAGE_H - 0.20, w: PAGE_W * 0.55, h: 0.05,
  fill: { color: C.step1Deep }, line: { color: C.step1Deep },
});
slide.addShape(pres.shapes.RECTANGLE, {
  x: PAGE_W * 0.55, y: PAGE_H - 0.20, w: PAGE_W * 0.45, h: 0.05,
  fill: { color: C.step2Deep }, line: { color: C.step2Deep },
});
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: PAGE_H - 0.15, w: PAGE_W * 0.55, h: 0.15,
  fill: { color: C.step1 }, line: { color: C.step1 },
});
slide.addShape(pres.shapes.RECTANGLE, {
  x: PAGE_W * 0.55, y: PAGE_H - 0.15, w: PAGE_W * 0.45, h: 0.15,
  fill: { color: C.step2 }, line: { color: C.step2 },
});

pres.writeFile({ fileName: "USMLE_InfoSession_Poster.pptx" }).then((p) => {
  console.log("✔ wrote", p);
});
