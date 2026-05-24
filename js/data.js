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
        url: "outputs/study-notes/cvs-day-01-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-01-flashcards.html",
        meta: "65 cards" }
    ],
    outline: {
      intro: "Read ahead in First Aid 2025 (Cardiovascular chapter) so class lands faster. Cover the sections below; the Q-bank for Day 1 only asks about material in these areas.",
      edition: "First Aid 2025 · Cardiovascular chapter",
      items: [
        { topic: "Heart embryology — tube formation, looping, atrial & ventricular septation, aorticopulmonary septum (neural crest)", section: "CVS · Embryology", pages: "pp. 284–286" },
        { topic: "Pharyngeal arch arteries + their cranial-nerve pairings (1st, 2nd, 3rd, 4th, 6th)", section: "CVS · Embryology (aortic arch derivatives)", pages: "p. 286" },
        { topic: "Fetal circulation, three in-utero shunts, and the neonatal flip (↑ SVR / ↓ PVR; PGE1 vs indomethacin)", section: "CVS · Embryology (fetal–postnatal derivatives + fetal circulation)", pages: "p. 287" },
        { topic: "Cardiac chambers, surface anatomy, X-ray borders, silhouette sign, LA appendage stasis", section: "CVS · Anatomy (Heart anatomy)", pages: "p. 288" },
        { topic: "Coronary arteries, coronary dominance, AV-nodal artery rule, posteromedial papillary muscle, coronary sinus & biventricular pacing", section: "CVS · Anatomy (coronary blood supply)", pages: "p. 288" },
        { topic: "Conduction system: SA node, AV node (triangle of Koch), His-Purkinje, conduction speed order", section: "CVS · Anatomy + Physiology (conduction pathway, action potentials)", pages: "p. 288, 297–298" },
        { topic: "Pericardium, effusion, tamponade (water-bottle silhouette, electrical alternans, Beck's triad)", section: "CVS · Pathology (pericardial disease)", pages: "pp. 317, 319–320" },
        { topic: "Aorta in the adult: arch branches, Stanford A vs B dissection, blunt aortic injury at the isthmus, ICA → ophthalmic → CRA atheroemboli, subclavian steal", section: "CVS · Pathology (aortic aneurysm, dissection) + Anatomy (great vessels)", pages: "pp. 306–307" },
        { topic: "Abdominal & pelvic vascular anatomy: IVC formation at L4–L5, renal-vein asymmetry, gonadal drainage, nutcracker syndrome, femoral triangle access", section: "Renal · Anatomy + Reproductive · Anatomy (gonadal venous drainage) — cross-chapter reference", pages: "Renal ch. (verify)" },
        { topic: "Upper-body venous anatomy: SVC formation, brachiocephalic vs SVC obstruction patterns; CABG conduit landmarks (LIMA, great saphenous vein)", section: "CVS · Anatomy (heart anatomy figure) + Respiratory · Anatomy (mediastinum cross-ref)", pages: "p. 288 + Resp ch. (verify)" }
      ]
    }
  },
  { day: 2,  date: "2026-06-02", subject: "cvs",  title: "Cardiac mechanics — PV loops, valves & sounds", sub: "Frank-Starling, PV loops, heart sounds, valvular disease",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "outputs/study-notes/cvs-day-02-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-02-flashcards.html",
        meta: "70 cards" }
    ],
    outline: {
      intro: "Day 2 covers the mechanical half of CVS Physiology — how the heart pumps. Read ahead in First Aid 2025 (Cardiovascular · Physiology section). The Day 2 Q-bank only asks about material in the sections below.",
      edition: "First Aid 2025 · Cardiovascular chapter (Physiology)",
      items: [
        { topic: "Cardiac output equations: CO = SV × HR, SV = EDV − ESV, EF = SV / EDV, Fick principle, MAP ≈ DBP + 1/3 PP", section: "CVS · Physiology (cardiac output)", pages: "p. 289" },
        { topic: "Resistance, pressure, flow: Ohm's law for circulation, Poiseuille (r⁴ dominates), pulse pressure determinants (↑ SV or ↓ aortic compliance)", section: "CVS · Physiology (resistance, pressure, flow)", pages: "p. 290" },
        { topic: "Stroke volume drivers: preload, afterload, contractility, Frank-Starling law, eccentric vs concentric hypertrophy (sarcomeres in series vs parallel, β-MHC upregulation)", section: "CVS · Physiology (CO variables, Starling curves)", pages: "p. 291" },
        { topic: "Pressure-volume loops: 4 landmark points, ESPVR / EDPVR; shifts with preload, afterload, contractility, nitroglycerin, nitroprusside, AV fistula; loops for AS, AR, MS, MR", section: "CVS · Physiology (PV loops, valve disease physiology)", pages: "pp. 292, 296" },
        { topic: "Cardiac & vascular function curves: cardiac up with contractility, vascular right with volume; intersection shifts for hemorrhage, exercise, AV fistula, HFrEF", section: "CVS · Physiology (cardiac & vascular function curves)", pages: "p. 293" },
        { topic: "Heart sounds: S1 / S2 mechanics, splitting patterns (physiologic, wide, fixed, paradoxical), S3 (early diastole, dilated/stiff LV) and S4 (atrial kick into stiff LV)", section: "CVS · Physiology (splitting of S2, S3 / S4, murmurs)", pages: "p. 294" },
        { topic: "Wiggers diagram + JVP waveforms (a, c, x, v, y); cannon a waves in 3° heart block; giant v wave in TR; Doppler mitral E / A waves and how S3 maps onto E", section: "CVS · Physiology (jugular venous pulse, cardiac cycle)", pages: "p. 295" },
        { topic: "Valvular disease anchored on PV loops + auscultation: AS (pulsus parvus et tardus, triad of angina / syncope / HF), AR (water-hammer, de Musset, Duroziez, Quincke), MS (opening snap + diastolic rumble, LA hypertension with normal LV), MR (holosystolic to axilla), MVP (click + maneuvers), TR (Carvallo positive), VSD", section: "CVS · Pathology (valvular disease) + cross-ref Physiology", pages: "pp. 316–318" },
        { topic: "Cardiomyopathy echo profiles: dilated, hypertrophic (asymmetric septal, dynamic LVOT, S4, sudden cardiac death), restrictive, athlete's heart — distinguished by LV mass, cavity size, EF, and diastolic function", section: "CVS · Pathology (cardiomyopathies)", pages: "pp. 314–315" },
        { topic: "Exercise + aging cardiovascular hemodynamics: aerobic exercise (↓ SVR, ↑ SBP, DBP unchanged, ↑ PP, eccentric LVH); aging aorta (ISH, wide PP); aging myocyte (hypertrophy without hyperplasia, lipofuscin)", section: "CVS · Physiology (normal pressures) + Pathology (aging changes)", pages: "p. 301 + pathology cross-ref" }
      ]
    }
  },
  { day: 3,  date: "2026-06-03", subject: "cvs",  title: "Cardiac electrics & integration",    sub: "Action potentials, arrhythmias, baroreflex, shock physiology",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "outputs/study-notes/cvs-day-03-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-03-flashcards.html",
        meta: "65 cards" }
    ],
    outline: {
      intro: "Day 3 covers the electrical half of CVS Physiology plus the body's integrative responses. Read ahead in First Aid 2025 (Cardiovascular · Physiology and Pathology selections below). The Day 3 Q-bank only asks about material in the sections below.",
      edition: "First Aid 2025 · Cardiovascular chapter (Physiology + selected Pathology)",
      items: [
        { topic: "Ventricular action potential: phases 0 (Na⁺) → 1 → 2 (L-type Ca²⁺ plateau) → 3 → 4 (K⁺ leak); effective refractory period; class IB shortens AP, class III prolongs", section: "CVS · Physiology (cardiac action potentials — ventricular)", pages: "pp. 297–298" },
        { topic: "Pacemaker (SA / AV) action potential: phase 4 spontaneous depolarization (HCN funny current → T-type Ca²⁺ → L-type Ca²⁺), phase 0 = L-type Ca²⁺ slow upstroke; drug targets: β-blocker, non-DHP CCB, adenosine, ivabradine", section: "CVS · Physiology (cardiac action potentials — pacemaker)", pages: "pp. 297–298" },
        { topic: "Excitation-contraction coupling: L-type Ca²⁺ → CICR via ryanodine receptor → troponin C → contraction; SERCA + NCX in relaxation; digoxin mechanism via Na/K ATPase block", section: "CVS · Physiology (myocardial action potential, calcium handling) + Pharmacology (digoxin)", pages: "pp. 297, 326" },
        { topic: "Conduction system & velocity hierarchy (Park-At-Ventura, AV: Purkinje > atrial > ventricular > AV node); pacemaker escape rate hierarchy (SA 60–100, junctional 40–60, ventricular 20–40)", section: "CVS · Physiology (conduction velocity, ECG)", pages: "p. 299" },
        { topic: "ECG fundamentals: rate, rhythm, axis, intervals; chamber enlargement (p-mitrale, p-pulmonale, LVH/RVH criteria); heart blocks (1°, Mobitz I, Mobitz II, 3°)", section: "CVS · Physiology (ECG) + Pathology (heart blocks)", pages: "p. 299 + pathology cross-ref" },
        { topic: "Arrhythmia recognition + ablation map: AFib (PV triggers, irregularly irregular), atrial flutter (cavotricuspid isthmus, sawtooth), AVNRT (slow pathway, vagal/adenosine), PVC + compensatory pause, VT, complete heart block escape patterns", section: "CVS · Pathology (arrhythmias)", pages: "pp. 311–313" },
        { topic: "Antiarrhythmic Vaughan-Williams classes I–IV (Na, β, K, Ca channel block) + adenosine + digoxin; rate-control choices for AFib", section: "CVS · Pharmacology (antiarrhythmics)", pages: "pp. 324–326" },
        { topic: "Coronary autoregulation: > 70% O₂ extraction at rest; autoregulation MAP 60–140 via adenosine + NO; LV perfused in diastole; subendocardium most vulnerable; coronary sinus lowest O₂ in body", section: "CVS · Physiology (autoregulation, coronary circulation)", pages: "p. 300" },
        { topic: "Vascular nitric oxide biology: eNOS / L-arginine → NO → guanylate cyclase → cGMP → smooth muscle relaxation; basis for nitroglycerin, nitroprusside, sildenafil mechanisms", section: "CVS · Physiology (NO) + Pharmacology", pages: "p. 300" },
        { topic: "Baroreceptors + chemoreceptors: carotid → CN IX, aortic → CN X (both baro and chemo); baroreflex in HTN, hypotension, carotid sinus hypersensitivity, vasovagal syncope", section: "CVS · Physiology (baroreceptors, chemoreceptors)", pages: "p. 301" },
        { topic: "Shock physiology — 4 types with cath profile shorthand (CVP, PCWP, CO, SVR, SvO₂): hypovolemic, cardiogenic, obstructive (tamponade pulsus paradoxus, Beck's triad), distributive (septic warm shock)", section: "CVS · Pathology (shock) — Day 7 preview", pages: "pp. 320–321" },
        { topic: "Heart failure neurohormonal cascade: sympathetic + RAAS + ADH (maladaptive) vs ANP/BNP (counter-regulatory); ARNi mechanism (neprilysin block + ARB); four-pillar HFrEF regimen (β-blocker, ACE-i/ARB/ARNi, MRA, SGLT2-i)", section: "CVS · Pathology (heart failure) + Pharmacology — Day 7 preview", pages: "pp. 318–319" }
      ]
    }
  },
  { day: 4,  date: "2026-06-04", subject: "cvs",  title: "Vascular biology, atherosclerosis & dyslipidemia", sub: "Capillary exchange, lymphatics, atherogenesis, statins & PCSK9" },
  { day: 5,  date: "2026-06-05", subject: "cvs",  title: "Ischemic heart disease — angina to MI", sub: "Stable angina, ACS spectrum, ECG localisation, post-MI complications timeline" },
  { day: 6,  date: "2026-06-06", subject: "cvs",  title: "Hypertension, vasculitis & aortic disease", sub: "Essential & secondary HTN, large/medium/small vasculitis, AAA, dissection" },
  { day: 7,  date: "2026-06-07", subject: "cvs",  title: "Heart failure & cardiomyopathies in depth", sub: "HFrEF vs HFpEF mgmt, dilated, restrictive, peripartum, takotsubo, ARVC" },
  { day: 8,  date: "2026-06-08", subject: "cvs",  title: "Valvular & rheumatic heart disease + endocarditis", sub: "Rheumatic HD, IE Duke criteria, prosthetic valves, intervention timing" },
  { day: 9,  date: "2026-06-09", subject: "cvs",  title: "Pericardial disease, cardiac tumors & inherited arrhythmias", sub: "Effusion, tamponade, constrictive pericarditis, myxoma, WPW, long QT, Brugada" },
  { day: 10, date: "2026-06-10", subject: "cvs",  title: "Congenital heart disease",           sub: "Acyanotic, cyanotic, TOF, TGA, coarctation, Eisenmenger" },

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
