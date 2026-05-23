/* ============================================================
   Curriculum data — 30 sessions across 4 chapters
   In production this would be fetched from /data/sessions.json.
   Kept inline for the prototype so it works offline.
   ============================================================ */

window.SESSIONS = [
  // ---- Cardiovascular (10) — June 1-10 ----
  { day: 1,  date: "2026-06-01", subject: "cvs",  title: "Cardiac anatomy & embryology",      sub: "Heart tubes, septation, fetal circulation",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "https://drive.google.com/file/d/1htaSuaclSoxn-TtvTZ9DB61svmESBZSS/view",
        meta: "PDF · 2 pages" },
      { kind: "flashcards", label: "Flashcards",
        url: "https://drive.google.com/file/d/1AqtifaPbieNdMnBHbP_nsqu-NlEkBv_F/view",
        meta: "PDF · 65 cards" }
    ]
  },
  { day: 2,  date: "2026-06-02", subject: "cvs",  title: "The cardiac cycle & PV loops",       sub: "Wiggers diagram, pressure-volume relationships" },
  { day: 3,  date: "2026-06-03", subject: "cvs",  title: "Cardiac output & Frank-Starling",    sub: "Preload, afterload, contractility, SV" },
  { day: 4,  date: "2026-06-04", subject: "cvs",  title: "Vascular biology & hemodynamics",    sub: "Poiseuille, capillary exchange, lymphatics" },
  { day: 5,  date: "2026-06-05", subject: "cvs",  title: "EKG fundamentals",                   sub: "Axis, intervals, chamber enlargement" },
  { day: 6,  date: "2026-06-06", subject: "cvs",  title: "Arrhythmias I & II",                 sub: "Supraventricular, ventricular, blocks" },
  { day: 7,  date: "2026-06-07", subject: "cvs",  title: "Heart failure & cardiomyopathies",   sub: "Systolic vs diastolic, dilated, hypertrophic" },
  { day: 8,  date: "2026-06-08", subject: "cvs",  title: "Valvular heart disease",             sub: "Stenosis, regurgitation, murmurs" },
  { day: 9,  date: "2026-06-09", subject: "cvs",  title: "Hypertension & vasculitis",          sub: "Primary, secondary, large to small vessel" },
  { day: 10, date: "2026-06-10", subject: "cvs",  title: "Congenital heart disease",           sub: "Cyanotic, acyanotic, shunt physiology" },

  // ---- Respiratory (8) — June 11-18 ----
  { day: 11, date: "2026-06-11", subject: "resp", title: "Lung anatomy & development",         sub: "Branching, surfactant, fetal lung" },
  { day: 12, date: "2026-06-12", subject: "resp", title: "Ventilation & perfusion",            sub: "V/Q matching, dead space, shunt" },
  { day: 13, date: "2026-06-13", subject: "resp", title: "Gas exchange & transport",           sub: "O2-Hb curve, CO2 carriage, A-a gradient" },
  { day: 14, date: "2026-06-14", subject: "resp", title: "Pulmonary function tests",           sub: "Spirometry, flow-volume loops, lung volumes" },
  { day: 15, date: "2026-06-15", subject: "resp", title: "Obstructive lung disease",           sub: "Asthma, COPD, bronchiectasis, CF" },
  { day: 16, date: "2026-06-16", subject: "resp", title: "Restrictive lung disease",           sub: "IPF, sarcoid, pneumoconioses, NMD" },
  { day: 17, date: "2026-06-17", subject: "resp", title: "Pulmonary vascular disease",         sub: "PE, pulmonary hypertension, edema" },
  { day: 18, date: "2026-06-18", subject: "resp", title: "Pneumonia, TB, ARDS",                sub: "Community, hospital, atypical, ARDS criteria" },

  // ---- Epi & Biostats (4) — June 19-22 ----
  { day: 19, date: "2026-06-19", subject: "epi",  title: "Study design",                       sub: "RCT, cohort, case-control, cross-sectional" },
  { day: 20, date: "2026-06-20", subject: "epi",  title: "Diagnostic tests",                   sub: "Sensitivity, specificity, PPV, NPV, LR" },
  { day: 21, date: "2026-06-21", subject: "epi",  title: "Bias, confounding & error",          sub: "Selection, recall, lead-time, type I/II" },
  { day: 22, date: "2026-06-22", subject: "epi",  title: "Statistical tests",                  sub: "T-test, ANOVA, chi-square, regression" },

  // ---- Pathology (8) — June 23-30 ----
  { day: 23, date: "2026-06-23", subject: "path", title: "Cell injury, death & adaptation",    sub: "Necrosis, apoptosis, accumulations" },
  { day: 24, date: "2026-06-24", subject: "path", title: "Inflammation & wound healing",       sub: "Acute, chronic, granulomatous, repair" },
  { day: 25, date: "2026-06-25", subject: "path", title: "Neoplasia",                          sub: "Hallmarks, grading, staging, markers" },
  { day: 26, date: "2026-06-26", subject: "path", title: "Genetic disease",                    sub: "AD, AR, X-linked, mitochondrial, trinucleotide" },
  { day: 27, date: "2026-06-27", subject: "path", title: "Immunology essentials",              sub: "Hypersensitivity, immunodeficiency, transplant" },
  { day: 28, date: "2026-06-28", subject: "path", title: "Hematologic pathology",              sub: "Anemias, leukemias, lymphomas, clotting" },
  { day: 29, date: "2026-06-29", subject: "path", title: "Endocrine pathology",                sub: "Thyroid, adrenal, pituitary, pancreas" },
  { day: 30, date: "2026-06-30", subject: "path", title: "Renal & GU pathology",               sub: "GN, tubular, neoplastic, stones" }
];

window.SUBJECT_META = {
  cvs:  { name: "Cardiovascular",   short: "CVS",   dateRange: "Jun 1 – Jun 10", count: 10 },
  resp: { name: "Respiratory",      short: "RESP",  dateRange: "Jun 11 – Jun 18", count: 8 },
  epi:  { name: "Epi & Biostats",   short: "EPI",   dateRange: "Jun 19 – Jun 22", count: 4 },
  path: { name: "Pathology",        short: "PATH",  dateRange: "Jun 23 – Jun 30", count: 8 }
};

window.LINKS = {
  zoom:     "https://duke.zoom.us/j/96991939005",
  whatsapp: "https://chat.whatsapp.com/JvaTpyDt9loGZjomAVwi42",
  calendly: "https://calendly.com/allanbakesiga/usmle-office-hours",
  signup:   "https://forms.gle/iHCdPVjvJeGeGTXy7",
  ics:      "data/schedule.ics"
};

/* The "today" the dashboard uses. Defaults to real now, but the Tweaks
   panel can override it for previewing different states. */
window.SIM_NOW = null;
window.getNow = function () {
  if (window.SIM_NOW) return new Date(window.SIM_NOW);
  return new Date();
};
