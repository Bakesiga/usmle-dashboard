// build_june_success.js
// USMLE Step 1 Success Flyer — Rosemary Njambi Githinji
// 9 x 11.25 portrait (4:5), Comic Sans MS, dark ink + gold success accent.
const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const pres = new PptxGenJS();
pres.defineLayout({ name: "PORTRAIT_4X5", width: 9, height: 11.25 });
pres.layout = "PORTRAIT_4X5";
const slide = pres.addSlide();
// palette
const INK       = "0C2A3D";
const GOLD      = "E5A823";
const GOLD_DEEP = "B8851C";
const CREAM     = "FFF8EC";
const BLUE_DUKE = "012169";
const WHITE     = "FFFFFF";
const ROSEMARY_QUOTE =
  "Allan is the most patient teacher I have ever had. He breaks every concept down so clearly that even a non-medic could follow. I would not have passed Step 1 without him.";
slide.background = { color: CREAM };
// ===== top ribbon
slide.addShape("rect", {
  x: 0, y: 0, w: 9, h: 1.0,
  fill: { color: INK }, line: { color: INK },
});
slide.addText("STUDENT SUCCESS · USMLE STEP 1", {
  x: 0, y: 0, w: 9, h: 1.0,
  fontFace: "Comic Sans MS", fontSize: 22, bold: true,
  color: WHITE, align: "center", valign: "middle",
  charSpacing: 2,
});
// ===== Allan coach disc (top-left)
const allanPhoto = path.join(__dirname, "allan_circle.png");
const apX = 0.80, apY = 1.35, apD = 1.4;
slide.addShape("ellipse", {
  x: apX - 0.07, y: apY - 0.07, w: apD + 0.14, h: apD + 0.14,
  fill: { color: INK }, line: { color: INK },
});
if (fs.existsSync(allanPhoto)) {
  slide.addImage({
    path: allanPhoto,
    x: apX, y: apY, w: apD, h: apD,
    sizing: { type: "contain", w: apD, h: apD },
  });
} else {
  slide.addShape("ellipse", {
    x: apX, y: apY, w: apD, h: apD,
    fill: { color: INK }, line: { color: INK },
  });
  slide.addText("AB", {
    x: apX, y: apY, w: apD, h: apD,
    fontFace: "Comic Sans MS", fontSize: 36, bold: true,
    color: CREAM, align: "center", valign: "middle",
  });
}
// Coach caption: "Coached by Allan Bakesiga" + full credentials, all same size
slide.addText("Coached by\nAllan Bakesiga\nMD (Makerere)\nMScGH (Duke)\nPGY-1 Neurology\nCreighton", {
  x: 0.05, y: 2.85, w: 2.30, h: 1.60,
  fontFace: "Comic Sans MS", fontSize: 14, bold: true,
  color: INK, align: "center", valign: "top",
  lineSpacingMultiple: 1.0,
});
// ===== PASSED badge
slide.addShape("roundRect", {
  x: 3.05, y: 1.35, w: 3.65, h: 1.4,
  fill: { color: GOLD }, line: { color: GOLD_DEEP, width: 4 },
  rectRadius: 0.6,
});
slide.addText("PASSED", {
  x: 3.05, y: 1.35, w: 3.65, h: 1.4,
  fontFace: "Comic Sans MS", fontSize: 40, bold: true,
  color: INK, align: "center", valign: "middle",
  charSpacing: 6,
});
// exam meta line
slide.addText("STEP 1 · TESTED 5 MAY 2026", {
  x: 3.05, y: 2.8, w: 3.65, h: 0.4,
  fontFace: "Comic Sans MS", fontSize: 12, bold: true,
  color: INK, align: "center", valign: "middle",
  charSpacing: 1,
});
// ===== Coached badge (top-right)
slide.addShape("rect", {
  x: 6.85, y: 1.4, w: 1.75, h: 1.3,
  fill: { color: WHITE }, line: { color: GOLD, width: 3 },
});
slide.addShape("star5", {
  x: 7.5, y: 1.45, w: 0.45, h: 0.45,
  fill: { color: GOLD }, line: { color: GOLD_DEEP, width: 1 },
});
slide.addText("COACHED\nFeb – May 2026", {
  x: 6.85, y: 1.95, w: 1.75, h: 0.7,
  fontFace: "Comic Sans MS", fontSize: 12, bold: true,
  color: INK, align: "center", valign: "middle",
});
// ===== student portrait
const studentPhoto = path.join(__dirname, "student_rosemary_circle.png");
const portraitX = 3.20, portraitY = 3.45, portraitD = 3.3;
// Square gold frame to match the square photo
slide.addShape("rect", {
  x: portraitX - 0.10, y: portraitY - 0.10,
  w: portraitD + 0.20, h: portraitD + 0.20,
  fill: { color: GOLD }, line: { color: GOLD_DEEP, width: 3 },
});
if (fs.existsSync(studentPhoto)) {
  slide.addImage({
    path: studentPhoto,
    x: portraitX, y: portraitY, w: portraitD, h: portraitD,
    sizing: { type: "cover", w: portraitD, h: portraitD },
  });
} else {
  slide.addShape("rect", {
    x: portraitX, y: portraitY, w: portraitD, h: portraitD,
    fill: { color: BLUE_DUKE }, line: { color: INK, width: 0 },
  });
  slide.addText("RG", {
    x: portraitX, y: portraitY, w: portraitD, h: portraitD,
    fontFace: "Comic Sans MS", fontSize: 110, bold: true,
    color: CREAM, align: "center", valign: "middle",
  });
}
// ===== congratulations + name + subtitle
slide.addText("CONGRATULATIONS!", {
  x: 0.4, y: 6.85, w: 8.2, h: 0.45,
  fontFace: "Comic Sans MS", fontSize: 22, bold: true, italic: true,
  color: GOLD_DEEP, align: "center", valign: "middle",
  charSpacing: 4,
});
slide.addText("Dr. Rosemary Njambi Githinji", {
  x: 0.4, y: 7.30, w: 8.2, h: 0.55,
  fontFace: "Comic Sans MS", fontSize: 28, bold: true,
  color: INK, align: "center", valign: "middle",
});
slide.addText("USMLE Step 1 Prep Cohort", {
  x: 0.4, y: 7.80, w: 8.2, h: 0.30,
  fontFace: "Comic Sans MS", fontSize: 14, bold: true, italic: true,
  color: GOLD_DEEP, align: "center", valign: "middle",
});
// ===== quote block
slide.addShape("rect", {
  x: 0.5, y: 8.05, w: 8.0, h: 1.55,
  fill: { color: WHITE }, line: { color: GOLD, width: 3 },
});
slide.addText("“", {
  x: 0.35, y: 7.85, w: 0.85, h: 1.0,
  fontFace: "Georgia", fontSize: 96, bold: true,
  color: GOLD, align: "left", valign: "top",
});
slide.addText(ROSEMARY_QUOTE, {
  x: 0.95, y: 8.15, w: 7.4, h: 1.15,
  fontFace: "Comic Sans MS", fontSize: 14, bold: true, italic: true,
  color: INK, align: "left", valign: "middle",
});
slide.addText("— Rosemary", {
  x: 0.95, y: 9.25, w: 7.4, h: 0.3,
  fontFace: "Comic Sans MS", fontSize: 12, bold: true,
  color: GOLD_DEEP, align: "right",
});
// ===== bottom CTA strip
slide.addShape("rect", {
  x: 0, y: 9.75, w: 9, h: 1.5,
  fill: { color: INK }, line: { color: INK },
});
slide.addText("YOU could be next.", {
  x: 0.45, y: 9.82, w: 5.7, h: 0.42,
  fontFace: "Comic Sans MS", fontSize: 22, bold: true,
  color: GOLD, align: "left", valign: "middle",
});
slide.addText("Next cohort starts 1 June 2026", {
  x: 0.45, y: 10.22, w: 5.7, h: 0.32,
  fontFace: "Comic Sans MS", fontSize: 13, bold: true,
  color: CREAM, align: "left", valign: "middle",
});
slide.addText("Daily live Zoom · Scan QR or visit:", {
  x: 0.45, y: 10.54, w: 5.7, h: 0.30,
  fontFace: "Comic Sans MS", fontSize: 11, bold: true,
  color: WHITE, align: "left", valign: "middle",
});
slide.addText("bakesiga.github.io/usmle-dashboard", {
  x: 0.45, y: 10.85, w: 5.7, h: 0.32,
  fontFace: "Comic Sans MS", fontSize: 12, bold: true, italic: true,
  color: GOLD, align: "left", valign: "middle",
});
// ===== sign-up QR
const qrPath = path.join(__dirname, "signup_qr.png");
const qrX = 6.6, qrY = 9.9, qrD = 1.25;
slide.addShape("rect", {
  x: qrX - 0.1, y: qrY - 0.1, w: qrD + 0.2, h: qrD + 0.2,
  fill: { color: WHITE }, line: { color: WHITE },
});
if (fs.existsSync(qrPath)) {
  slide.addImage({ path: qrPath, x: qrX, y: qrY, w: qrD, h: qrD });
} else {
  slide.addText("QR", {
    x: qrX, y: qrY, w: qrD, h: qrD,
    fontFace: "Comic Sans MS", fontSize: 24, bold: true,
    color: INK, align: "center", valign: "middle",
  });
}
// ===== save
pres.writeFile({
  fileName: path.join(__dirname, "USMLE_June_Success_Rosemary.pptx"),
}).then((f) => console.log("Wrote", f));
