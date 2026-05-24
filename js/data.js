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
  { day: 2,  date: "2026-06-02", subject: "cvs",  title: "Pumping mechanics — CO, PV loops, sounds & valves", sub: "Cardiac output, Frank-Starling, PV loops, sounds, valvular disease, cardiomyopathy",
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
  { day: 3,  date: "2026-06-03", subject: "cvs",  title: "Cardiac electrics — APs, ECG, arrhythmias & shock", sub: "Action potentials, conduction, ECG, arrhythmias, coronary autoregulation, baroreflex, shock, HF cascade",
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
  { day: 4,  date: "2026-06-04", subject: "cvs",  title: "HTN, vascular pathology & aortic disease", sub: "Essential & secondary HTN, atherosclerosis, dyslipidemia, vasculitis large/medium/small, AAA, dissection",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "outputs/study-notes/cvs-day-04-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-04-flashcards.html",
        meta: "60 cards" }
    ],
    outline: {
      intro: "Day 4 covers HTN, vascular wall pathology, aortic disease, and vasculitis. Read ahead in First Aid 2025 (CVS Pathology pp. 302-309) so the lecture lands faster.",
      edition: "First Aid 2025 · CVS Pathology (vascular section)",
      items: [
        { topic: "Vascular wall pathology — recognize the 5 patterns: hyaline arteriolosclerosis (chronic HTN/DM), hyperplastic arteriolosclerosis (malignant HTN, onion-skin), fibrinoid necrosis (malignant HTN, PAN), atherosclerosis (intimal lipid plaques), Monckeberg medial calcific sclerosis (aging, no lumen narrowing)", section: "CVS · Pathology (vascular wall patterns)", pages: "pp. 302-303" },
        { topic: "Primary vs secondary HTN; renal artery stenosis (atherosclerotic in older patients, fibromuscular dysplasia in younger women); refractory HTN + abdominal bruit + AKI after ACE-i", section: "CVS · Pathology (hypertension + secondary causes)", pages: "p. 309" },
        { topic: "Hypertensive emergency vs urgency; malignant nephrosclerosis (fibrinoid necrosis + onion-skin + MAHA with schistocytes); 20-25% rule for lowering BP; concentric LVH driven by local AngII trophic signal (β-MHC upregulation)", section: "CVS · Pathology (HTN emergency + end-organ damage)", pages: "p. 309 + 314-315" },
        { topic: "Abdominal aortic aneurysm: chronic inflammation + MMP-driven medial degradation; risks (age > 60, male, smoking strongest, HTN, family history); DM mildly protective; USPSTF screening (one-time US in men 65-75 ever-smokers); repair > 5.5 cm; rupture triad (sudden pain + syncope + pulsatile mass); Grey-Turner / Cullen signs", section: "CVS · Pathology (aortic aneurysm)", pages: "p. 307" },
        { topic: "Thoracic aortic aneurysm: cystic medial degeneration (elastic lamellae fragmentation + mucopolysaccharide pools); compression triad (cough, dysphagia, hoarseness via RLN); Marfan FBN1; Loeys-Dietz; EDS vascular COL3A1; lathyrism / lysyl oxidase inhibition; Menkes copper defect", section: "CVS · Pathology (TAA + connective tissue disorders)", pages: "pp. 307-308" },
        { topic: "Aortic dissection: intimal tear → false lumen; HTN is strongest risk; Stanford A (surgical) vs B (medical); BP discrepancy > 20 mmHg between arms; widened mediastinum on CXR; complication cascade (tamponade, acute AR, MI, stroke, limb ischemia); β-blocker FIRST then vasodilator", section: "CVS · Pathology (aortic dissection)", pages: "p. 308" },
        { topic: "Vasculitis by vessel size: large (giant cell arteritis, Takayasu — both granulomatous), medium (PAN ANCA-negative + HBV + spares lungs, Kawasaki CRASH + coronary aneurysm, Buerger young male smoker + vein/nerve involvement), small (GPA c-ANCA, MPA p-ANCA without granulomas, EGPA with asthma/eosinophilia, IgA vasculitis/HSP in kids)", section: "CVS · Pathology (vasculitis)", pages: "pp. 311-313" },
        { topic: "Atherosclerosis + peripheral artery disease: Leriche syndrome (aortoiliac); acute limb ischemia 6 Ps; embolic sources (AFib LA appendage, LV thrombus post-MI, endocarditis vegetations, atrial myxoma); reperfusion injury mechanisms (ROS, mitochondrial permeability transition, neutrophils, complement)", section: "CVS · Pathology (atherosclerosis + PAD)", pages: "pp. 305-307" },
        { topic: "Venous disease: varicose veins from valve incompetence; chronic venous insufficiency with stasis dermatitis + hemosiderin bronze pigmentation + lipodermatosclerosis + medial-malleolar ulcers; distinguish arterial (lateral) vs venous (medial) ulcer location", section: "CVS · Pathology (venous disease)", pages: "p. 308" },
        { topic: "Coarctation cross-reference (Day 10 preview): narrowing near ligamentum arteriosum; upper-body HTN + brachial-femoral delay; rib notching on CXR; Turner syndrome + bicuspid AV + berry aneurysm associations; neonate critical coarctation managed with PGE1 until surgery", section: "CVS · Pathology (congenital heart disease — coarctation)", pages: "p. 322 (cross-reference)" }
      ]
    }
  },
  { day: 5,  date: "2026-06-05", subject: "cvs",  title: "Ischemic heart disease — angina to MI", sub: "Stable angina, ACS spectrum, ECG localisation, post-MI complications timeline",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "outputs/study-notes/cvs-day-05-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-05-flashcards.html",
        meta: "60 cards" }
    ],
    outline: {
      intro: "Day 5 is the most board-tested CVS topic. Read First Aid 2025 (CVS Pathology pp. 308-313) on ischemic heart disease before class — focus on the ACS spectrum, MI histology timeline, and post-MI complications.",
      edition: "First Aid 2025 · CVS Pathology (ischemic heart disease)",
      items: [
        { topic: "Atherogenesis cellular cast in order: endothelial injury (first step) → LDL into intima → oxidation → monocyte adhesion → foam cells (via SR-A/CD36) → T cell recruitment → platelets adhere and release PDGF → smooth muscle cells migrate from media to intima and lay down collagen → fibrous cap. Lipid core built by foam cells; fibrous cap built by SMCs", section: "CVS · Pathology (atherogenesis)", pages: "pp. 305-307" },
        { topic: "Plaque stability vs vulnerability; fatty streaks (age 10-20, reversible); plaque rupture mechanism — macrophage MMPs degrade fibrous cap → thrombosis → ACS; collateral circulation develops in slow-growing stenosis (Q11 anchor)", section: "CVS · Pathology (plaque stability)", pages: "pp. 306-307" },
        { topic: "Atherosclerosis distribution: abdominal aorta > coronaries > popliteal > carotid > circle of Willis. Internal mammary arteries protected → LIMA = CABG conduit of choice", section: "CVS · Pathology (atherosclerosis location)", pages: "p. 307" },
        { topic: "Stable angina: fixed ≥ 70% stenosis with NO thrombus; reproducible exertional pain; ECG normal at rest; stress testing modalities (exercise vs dobutamine vs adenosine nuclear); coronary steal mechanism with adenosine; wall motion localization (apical = LAD, inferior = RCA, lateral = LCx)", section: "CVS · Pathology (stable angina + stress testing)", pages: "p. 309" },
        { topic: "ACS spectrum: UA (plaque rupture + partial thrombus, troponin normal), NSTEMI (subendocardial infarct, ST depression, troponin elevated), STEMI (transmural infarct from occlusive thrombus, ST elevation → Q waves). STEMI = emergent PCI < 90 min door-to-balloon", section: "CVS · Pathology (ACS spectrum)", pages: "pp. 310-311" },
        { topic: "Special angina syndromes: vasospastic (Prinzmetal) angina — young woman, rest pain, transient ST elevation, no fixed CAD, CCB first-line, AVOID β-blockers; cocaine-induced chest pain — benzodiazepines + NTG, AVOID pure β-blockers", section: "CVS · Pathology (vasospastic angina + cocaine)", pages: "p. 311" },
        { topic: "Ischemic injury timeline: contraction stops < 60 s; reversible cell swelling 1-20 min (Na/Ca accumulation → osmotic water influx); irreversible threshold at 20-30 min (mitochondrial permeability transition); EM marker = mitochondrial vacuolization with flocculent densities", section: "CVS · Pathology (ischemic cell injury)", pages: "p. 308" },
        { topic: "MI histology timeline: 0-4 h minimal change; 4-24 h coag necrosis + contraction band; 1-5 d neutrophilic infiltrate; 5-10 d macrophages (PEAK risk for rupture); 10-14 d granulation tissue; 2 wk - 2 mo collagen scar (TGF-β driven)", section: "CVS · Pathology (MI histology)", pages: "p. 312" },
        { topic: "Right ventricular infarction: inferior STEMI + JVD + clear lungs + hypotension; cath profile ↑ CVP + ↓ PCWP (pathognomonic); RV resilience explained by perfusion both systole and diastole; TREATMENT IV FLUIDS — AVOID nitroglycerin, diuretics, morphine", section: "CVS · Pathology (RV infarction)", pages: "p. 311" },
        { topic: "Mechanical complications post-MI by timing: papillary muscle rupture or dysfunction 3-5 d (RCA, posteromedial single PDA supply); IV septum rupture 3-5 d (O₂ step-up RA → RV on cath); free wall rupture 5-14 d (LAD, distant heart sounds + JVD + clear lungs + PEA); LV aneurysm weeks-months (persistent ST elevation)", section: "CVS · Pathology (mechanical complications of MI)", pages: "p. 312" },
        { topic: "Stunned vs hibernating vs scarred myocardium: stunned (brief acute ischemia, spontaneously reversible), hibernating (chronic underperfusion, reversible with revascularization), scarred (TGF-β driven fibrosis, irreversible). Viability testing distinguishes hibernating from scarred to guide revascularization decision", section: "CVS · Pathology (myocardial viability)", pages: "p. 312" },
        { topic: "Sudden cardiac death post-MI: ~50% of MI deaths from VF in first hour out-of-hospital; ICD indication EF < 35% post-MI; β-blockers reduce arrhythmic death; atheroembolism (needle-shaped cholesterol clefts + giant cells) post-procedure; watershed colonic ischemia at splenic flexure", section: "CVS · Pathology (post-MI SCD + atheroembolism + watershed)", pages: "p. 313" }
      ]
    }
  },
  { day: 6,  date: "2026-06-06", subject: "cvs",  title: "Heart failure & shock — clinical management", sub: "HFrEF vs HFpEF clinical mgmt, NYHA staging, shock types applied" },
  { day: 7,  date: "2026-06-07", subject: "cvs",  title: "Cardiomyopathies & myocarditis",     sub: "Dilated, hypertrophic, restrictive, ARVC, peripartum, takotsubo, infectious myocarditis" },
  { day: 8,  date: "2026-06-08", subject: "cvs",  title: "Valvular & rheumatic heart disease + endocarditis", sub: "Rheumatic HD, IE Duke criteria, prosthetic valves, valvular intervention timing" },
  { day: 9,  date: "2026-06-09", subject: "cvs",  title: "Pericardial disease, cardiac tumors & inherited arrhythmias", sub: "Effusion, tamponade, constrictive pericarditis, myxoma, WPW, long QT, Brugada, ARVC" },
  { day: 10, date: "2026-06-10", subject: "cvs",  title: "Congenital heart disease",           sub: "Acyanotic, cyanotic, TOF, TGA, coarctation, Eisenmenger, pediatric presentations" },

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
