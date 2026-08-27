// USMLE August Intake Poster — clean white style (matches build_info_session.js).
// Story: what is done, what is loading this month, what is coming, cycle repeats.
// Run:  node build_august_poster.js
const pptxgen = require("pptxgenjs");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

// ── Palette (matches info-session / flyers) ─────────────────────
const C = {
  ink: "0C2A3D", ink2: "345671", muted: "6B87A3",
  bg: "FFFFFF", bgTint: "F5FBFF", border: "D6E8F5", border2: "B8D6EC",
  blue: "0284C7", blueSoft: "E0F2FE", blueDeep: "075985",
  amber: "D97706", amberSoft: "FEF3C7", amberDeep: "B45309",
  green: "059669", greenSoft: "D1FAE5", greenDeep: "065F46",
};
const HEAVY = "Arial Black";
const BODY = "Calibri";

const PAGE_W = 8.5, PAGE_H = 11, MARGIN = 0.5, CONTENT_W = PAGE_W - 2 * MARGIN;
const HEADSHOT = "/Users/allanbakesiga/.claude/usmle-dashboard/images/allan-headshot.jpg";

const pres = new pptxgen();
pres.defineLayout({ name: "POSTER", width: PAGE_W, height: PAGE_H });
pres.layout = "POSTER";
pres.author = "Allan Bakesiga";
pres.title = "USMLE Step 1 Prep · August Intake Poster";

(async () => {
const slide = pres.addSlide();
slide.background = { color: C.bg };

// ── Header band: split blue / amber ─────────────────────────────
const HEAD_H = 1.86;
slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: PAGE_W * 0.55, h: HEAD_H, fill: { color: C.blue }, line: { color: C.blue } });
slide.addShape(pres.shapes.RECTANGLE, { x: PAGE_W * 0.55, y: 0, w: PAGE_W * 0.45, h: HEAD_H, fill: { color: C.amber }, line: { color: C.amber } });

const HEAD_TXT_W = PAGE_W - MARGIN - 2.10;
slide.addText("NEW INTAKE  ·  OPEN NOW  ·  LIMITED SLOTS", {
  x: MARGIN, y: 0.18, w: HEAD_TXT_W, h: 0.32, fontSize: 13.5, fontFace: BODY, color: "FFFFFF",
  bold: true, charSpacing: 3, margin: 0,
});
slide.addText("USMLE  ·  STEP 1", {
  x: MARGIN, y: 0.52, w: HEAD_TXT_W, h: 0.30, fontSize: 13.5, fontFace: HEAVY, color: "FFFFFF",
  bold: true, charSpacing: 4, margin: 0,
});
slide.addText("August Intake", {
  x: MARGIN, y: 0.82, w: HEAD_TXT_W, h: 0.80, fontSize: 46, fontFace: HEAVY, color: "FFFFFF", bold: true, margin: 0,
});
slide.addText("Four months. The full First Aid blueprint. Live with Allan, every day.", {
  x: MARGIN, y: 1.56, w: HEAD_TXT_W, h: 0.26, fontSize: 12.5, fontFace: BODY, color: "FFFFFF", italic: true, margin: 0,
});

// Date/status stamp (deep amber) on the right
const stampX = PAGE_W - MARGIN - 2.00;
slide.addShape(pres.shapes.RECTANGLE, { x: stampX, y: 0.46, w: 2.00, h: 1.30, fill: { color: C.amberDeep }, line: { color: C.amberDeep } });
slide.addText("LIVE DAILY", { x: stampX, y: 0.52, w: 2.00, h: 0.30, fontSize: 12, fontFace: BODY, color: "FFFFFF", bold: true, align: "center", valign: "middle", charSpacing: 5, margin: 0 });
slide.addText("AUGUST", { x: stampX, y: 0.82, w: 2.00, h: 0.44, fontSize: 24, fontFace: HEAVY, color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0 });
slide.addText("10 PM EST  ·  5 AM EAT", { x: stampX, y: 1.26, w: 2.00, h: 0.26, fontSize: 9.5, fontFace: BODY, color: "FFFFFF", bold: true, align: "center", valign: "middle", margin: 0 });
slide.addText("new cycle begins", { x: stampX, y: 1.50, w: 2.00, h: 0.22, fontSize: 9, fontFace: BODY, color: "FFFFFF", italic: true, align: "center", valign: "middle", margin: 0 });

// ── Instructor strip ────────────────────────────────────────────
const stripY = 2.00, stripH = 1.02;
slide.addShape(pres.shapes.RECTANGLE, { x: MARGIN, y: stripY, w: CONTENT_W, h: stripH, fill: { color: C.bgTint }, line: { color: C.border, width: 0.75 } });
slide.addShape(pres.shapes.OVAL, { x: MARGIN + 0.16, y: stripY + 0.13, w: 0.80, h: 0.80, fill: { color: C.blue }, line: { color: C.blue } });
if (fs.existsSync(HEADSHOT)) {
  slide.addImage({ path: HEADSHOT, x: MARGIN + 0.20, y: stripY + 0.17, w: 0.72, h: 0.72, sizing: { type: "cover", w: 0.72, h: 0.72 }, rounding: true });
}
slide.addText("Allan Bakesiga, MD", { x: MARGIN + 1.12, y: stripY + 0.12, w: CONTENT_W - 1.2, h: 0.34, fontSize: 17, fontFace: BODY, bold: true, color: C.ink, margin: 0 });
slide.addText("MD (Makerere)  ·  MScGH (Duke)  ·  PGY-1 Neurology Resident, Creighton University", { x: MARGIN + 1.12, y: stripY + 0.46, w: CONTENT_W - 1.2, h: 0.28, fontSize: 11, fontFace: BODY, color: C.ink2, margin: 0 });
slide.addText("Live daily on Zoom  ·  content review + question approach, every class", { x: MARGIN + 1.12, y: stripY + 0.72, w: CONTENT_W - 1.2, h: 0.26, fontSize: 10.5, fontFace: BODY, italic: true, color: C.blueDeep, margin: 0 });

// ── Section header ──────────────────────────────────────────────
const secY = 3.22;
slide.addText("WHERE THE CLASS IS RIGHT NOW", { x: MARGIN, y: secY, w: CONTENT_W, h: 0.28, fontSize: 11, fontFace: BODY, color: C.blueDeep, bold: true, charSpacing: 4, margin: 0 });

// ── Status rows (clean white cards) ─────────────────────────────
let cy = secY + 0.34;
function statusRow(title, body, accent, deep, badge, h) {
  const y = cy;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN, y, w: CONTENT_W, h, fill: { color: C.bg }, line: { color: C.border, width: 0.75 },
    shadow: { type: "outer", color: "0C2A3D", blur: 7, offset: 1, angle: 90, opacity: 0.08 },
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: MARGIN, y, w: 0.10, h, fill: { color: accent }, line: { color: accent } });
  const BADGE_W = 1.25, BADGE_H = 0.32;
  const badgeX = MARGIN + CONTENT_W - BADGE_W - 0.16;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: badgeX, y: y + 0.15, w: BADGE_W, h: BADGE_H, fill: { color: accent }, line: { color: accent }, rectRadius: 0.16 });
  slide.addText(badge, { x: badgeX, y: y + 0.15, w: BADGE_W, h: BADGE_H, fontSize: 9.5, fontFace: BODY, color: "FFFFFF", bold: true, charSpacing: 2, align: "center", valign: "middle", margin: 0 });
  slide.addText(title, { x: MARGIN + 0.28, y: y + 0.13, w: CONTENT_W - 0.35 - BADGE_W - 0.10, h: 0.32, fontSize: 14, fontFace: BODY, bold: true, color: deep, margin: 0 });
  slide.addText(body, { x: MARGIN + 0.28, y: y + 0.47, w: CONTENT_W - 0.52, h: h - 0.54, fontSize: 11, fontFace: BODY, color: C.ink2, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
  cy += h + 0.13;
}

statusRow("Completed in June",
  "Cardiovascular   ·   Respiratory   ·   Epidemiology & Biostatistics   ·   General Pathology",
  C.green, C.greenDeep, "DONE", 0.86);
statusRow("Completed in July",
  "Neurology (CNS)   ·   Immunology",
  C.green, C.greenDeep, "DONE", 0.72);
statusRow("Loading this month",
  "Hematology & Oncology   ·   General Pharmacology",
  C.amber, C.amberDeep, "LIVE NOW", 0.72);
statusRow("Still to come",
  "Renal   ·   Reproductive   ·   Endocrine   ·   Gastrointestinal   ·   Musculoskeletal, Skin & Connective Tissue   ·   Behavioral Sciences   ·   Biochemistry   ·   Microbiology",
  C.blue, C.blueDeep, "NEXT", 1.02);

// ── Cycle-repeats callout (dark blue band) ──────────────────────
const cycY = cy + 0.04, cycH = 1.12;
slide.addShape(pres.shapes.RECTANGLE, { x: MARGIN, y: cycY, w: CONTENT_W, h: cycH, fill: { color: C.blueDeep }, line: { color: C.blueDeep } });
slide.addShape(pres.shapes.RECTANGLE, { x: MARGIN, y: cycY, w: 0.10, h: cycH / 2, fill: { color: C.blue }, line: { color: C.blue } });
slide.addShape(pres.shapes.RECTANGLE, { x: MARGIN, y: cycY + cycH / 2, w: 0.10, h: cycH / 2, fill: { color: C.amber }, line: { color: C.amber } });
slide.addText("THE CYCLE REPEATS", { x: MARGIN + 0.30, y: cycY + 0.14, w: CONTENT_W - 0.6, h: 0.30, fontSize: 13, fontFace: BODY, color: "FFFFFF", bold: true, charSpacing: 3, margin: 0 });
slide.addText(
  "Join now for the modules running live this month. When the four-month blueprint comes back around, you cover every earlier chapter too, so you never miss a thing. And every single class is recorded on the dashboard from day one.",
  { x: MARGIN + 0.30, y: cycY + 0.46, w: CONTENT_W - 0.60, h: cycH - 0.56, fontSize: 11, fontFace: BODY, color: "FFFFFF", margin: 0, valign: "top", lineSpacingMultiple: 1.08 });

// ── Register CTA (URL + QR + contacts) ──────────────────────────
const regY = cycY + cycH + 0.22;
const qrDataUri = await QRCode.toDataURL("https://bakesiga.github.io/usmle-dashboard/", { width: 400, margin: 1, color: { dark: "#0C2A3D", light: "#FFFFFF" } });
const QR_SIZE = 1.25;
const QR_X = PAGE_W - MARGIN - QR_SIZE;
const QR_Y = regY;
slide.addImage({ data: qrDataUri, x: QR_X, y: QR_Y, w: QR_SIZE, h: QR_SIZE });
slide.addText("scan to register", { x: QR_X, y: QR_Y + QR_SIZE - 0.02, w: QR_SIZE, h: 0.18, fontSize: 8, fontFace: BODY, color: C.blueDeep, italic: true, align: "center", valign: "middle", margin: 0 });

const regTxtW = QR_X - 0.25 - MARGIN;
slide.addText("REGISTER AT THE DASHBOARD", { x: MARGIN, y: regY + 0.02, w: regTxtW, h: 0.26, fontSize: 11, fontFace: BODY, color: C.blueDeep, bold: true, charSpacing: 3, margin: 0 });
slide.addText("bakesiga.github.io/usmle-dashboard", { x: MARGIN, y: regY + 0.28, w: regTxtW, h: 0.42, fontSize: 21, fontFace: HEAVY, color: C.blue, bold: true, margin: 0 });
slide.addText("WhatsApp  +256 705 571 443", { x: MARGIN, y: regY + 0.76, w: regTxtW, h: 0.26, fontSize: 11.5, fontFace: BODY, bold: true, color: C.ink, margin: 0 });
slide.addText("Book a 1:1:  calendly.com/allanbakesiga/30min", { x: MARGIN, y: regY + 1.02, w: regTxtW, h: 0.26, fontSize: 11.5, fontFace: BODY, color: C.ink2, margin: 0 });

// ── Bottom split rule ───────────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: PAGE_H - 0.16, w: PAGE_W * 0.55, h: 0.16, fill: { color: C.blue }, line: { color: C.blue } });
slide.addShape(pres.shapes.RECTANGLE, { x: PAGE_W * 0.55, y: PAGE_H - 0.16, w: PAGE_W * 0.45, h: 0.16, fill: { color: C.amber }, line: { color: C.amber } });

const wrote = await pres.writeFile({ fileName: path.join(__dirname, "USMLE_August_Poster.pptx") });
console.log("wrote", wrote);
})().catch((err) => { console.error(err); process.exit(1); });
