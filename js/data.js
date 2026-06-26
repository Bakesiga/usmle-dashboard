/* ============================================================
   Curriculum data — 30 sessions across 4 chapters
   In production this would be fetched from /data/sessions.json.
   Kept inline for the prototype so it works offline.
   ============================================================ */

window.SESSIONS = [
  // ---- Cardiovascular (10) — June 1-10 ----
  { day: 1,  date: "2026-06-01", subject: "cvs",  phase: "anatomy", title: "Anatomy & Embryology pt 1 · heart tube & looping", sub: "Heart tubes, cardiac looping, primitive chambers, early embryologic origins",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "outputs/study-notes/cvs-day-01-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-01-flashcards.html",
        meta: "65 cards" }
    ],
    outline: {
      intro: "Day 1 opens the cardiovascular block with the earliest embryology. Read ahead in First Aid 2025 (Cardiovascular · Embryology) so the lecture lands faster. The Q-bank for Day 1 only asks about material in the sections below.",
      edition: "First Aid 2025 · Cardiovascular chapter (Embryology)",
      items: [
        { topic: "Cardiogenic field and primitive heart tube formation from splanchnic mesoderm; lateral folding brings paired endocardial tubes together by day 22", section: "CVS · Embryology (heart tube formation)", pages: "p. 284" },
        { topic: "Five primitive dilations along the heart tube and their adult derivatives: truncus arteriosus (ascending aorta + pulmonary trunk), bulbus cordis (smooth RV + smooth LV outflow), primitive ventricle (trabeculated LV), primitive atrium (trabeculated atria), sinus venosus (smooth RA + coronary sinus + SVC)", section: "CVS · Embryology (primitive chambers)", pages: "p. 284" },
        { topic: "Cardiac looping at weeks 4 (dextral D-loop); dextrocardia and situs inversus when looping reverses; Kartagener syndrome (ciliary dyskinesia) as a clinical association", section: "CVS · Embryology (cardiac looping)", pages: "p. 284" },
        { topic: "Sinus venosus contributions to the right atrium (smooth posterior wall) and to the coronary sinus and SVC; left horn regression leaves the coronary sinus", section: "CVS · Embryology (sinus venosus derivatives)", pages: "p. 284" },
        { topic: "Pulmonary venous incorporation into the left atrium (single common pulmonary vein splits into four); explains anomalous pulmonary venous return patterns", section: "CVS · Embryology (LA derivation)", pages: "p. 284" },
        { topic: "Endocardial cushion role: contributes to atrial septation, ventricular septation membranous portion, and AV valve formation; cushion defects underlie AV canal defects (common in Down syndrome)", section: "CVS · Embryology (endocardial cushions)", pages: "pp. 284-285" },
        { topic: "Neural crest cell migration into the outflow tract; sets up the aorticopulmonary septum that Day 2 will cover; DiGeorge (22q11.2) as the clinical link", section: "CVS · Embryology (neural crest preview for Day 2)", pages: "p. 285" },
        { topic: "Timeline anchors: heart beats by day 22; four-chambered heart by week 8; teratogen-sensitive window for cardiac defects roughly weeks 3 to 8", section: "CVS · Embryology (timeline)", pages: "p. 284" }
      ]
    }
  },
  { day: 2,  date: "2026-06-02", subject: "cvs",  phase: "anatomy", title: "Anatomy & Embryology pt 2 · septation", sub: "Atrial septation, ventricular septation, conotruncal / aorticopulmonary septum",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "outputs/study-notes/cvs-day-02-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-02-flashcards.html",
        meta: "52 cards" }
    ],
    outline: {
      intro: "Day 2 walks through every septum the embryonic heart forms. Read ahead in First Aid 2025 (CVS Embryology · septation pages). The Q-bank for Day 2 only asks about material in the sections below.",
      edition: "First Aid 2025 · Cardiovascular chapter (Embryology, septation)",
      items: [
        { topic: "Atrial septation: septum primum grows down toward endocardial cushions leaving ostium primum, then perforations form ostium secundum; septum secundum grows down to its right leaving foramen ovale; the two septa form a one-way valve held open by right-to-left fetal pressure gradient", section: "CVS · Embryology (atrial septation)", pages: "p. 285" },
        { topic: "Atrial septal defects: ostium secundum (most common, septum secundum failure), ostium primum (endocardial cushion failure, often with AV valve defect), sinus venosus, patent foramen ovale; left-to-right shunt with fixed split S2", section: "CVS · Embryology + Pathology (ASD)", pages: "p. 285 + cross-ref" },
        { topic: "Ventricular septation: muscular IVS grows up from the apex; membranous IVS forms from endocardial cushions and aorticopulmonary septum fusing with the muscular IVS", section: "CVS · Embryology (ventricular septation)", pages: "p. 285" },
        { topic: "VSD: membranous most common type (failure of the membranous IVS to form); muscular VSD smaller and often closes spontaneously; left-to-right shunt with holosystolic murmur at left lower sternal border", section: "CVS · Embryology + Pathology (VSD)", pages: "p. 285 + cross-ref" },
        { topic: "Conotruncal / aorticopulmonary septum: neural-crest-derived spiral septum divides the truncus arteriosus into the aorta and pulmonary trunk and also divides the bulbus cordis into the LV and RV outflow tracts", section: "CVS · Embryology (aorticopulmonary septum)", pages: "p. 285" },
        { topic: "Conotruncal defects: persistent truncus arteriosus (failure to divide), transposition of the great arteries (failure to spiral), tetralogy of Fallot (anterosuperior displacement causing pulmonary stenosis + overriding aorta + VSD + RVH); all linked to neural crest failure and 22q11.2 deletion", section: "CVS · Embryology + Pathology (conotruncal defects)", pages: "p. 285 + cross-ref" },
        { topic: "AV septal defect (AV canal defect): full endocardial cushion failure giving large common atrioventricular orifice with primum ASD + inlet VSD + common AV valve; strong Down syndrome association", section: "CVS · Embryology (AVSD)", pages: "p. 285" },
        { topic: "Tricuspid atresia: failure of right AV cushion development; absent tricuspid valve, hypoplastic RV; requires ASD + VSD to survive; cyanotic with left axis deviation", section: "CVS · Embryology + Pathology (tricuspid atresia)", pages: "p. 285 + cross-ref" }
      ]
    }
  },
  { day: 3,  date: "2026-06-03", subject: "cvs",  phase: "anatomy", title: "Anatomy & Embryology pt 3 · fetal circulation & gross anatomy", sub: "Fetal shunts, postnatal flip, gross cardiac anatomy, coronary anatomy, great vessels",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "outputs/study-notes/cvs-day-03-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-03-flashcards.html",
        meta: "53 cards" },
      { kind: "notes", label: "Anatomy & Embryology block summary",
        url: "outputs/study-notes/block-summary-anatomy-embryology.html",
        meta: "Days 1-3 wrap-up" }
    ],
    outline: {
      intro: "Day 3 closes anatomy with fetal circulation and adult gross cardiac anatomy. Read ahead in First Aid 2025 (CVS · fetal circulation and heart anatomy pages). The Q-bank for Day 3 only asks about material in the sections below.",
      edition: "First Aid 2025 · Cardiovascular chapter (fetal circulation + gross anatomy)",
      items: [
        { topic: "Fetal circulation overview: oxygenated blood enters via umbilical vein from placenta; deoxygenated returns via two umbilical arteries (branches of internal iliacs)", section: "CVS · Embryology (fetal circulation)", pages: "p. 286" },
        { topic: "Three fetal shunts: (1) ductus venosus bypasses fetal liver (umbilical vein to IVC); (2) foramen ovale shunts oxygenated blood right atrium to left atrium; (3) ductus arteriosus shunts deoxygenated blood pulmonary artery to descending aorta, bypassing high-resistance fetal lungs", section: "CVS · Embryology (3 shunts)", pages: "p. 286" },
        { topic: "Postnatal transition: first breath drops pulmonary vascular resistance; loss of placenta raises systemic vascular resistance; left atrial pressure exceeds right and seals the foramen ovale; oxygenation and falling prostaglandins close the ductus arteriosus", section: "CVS · Embryology (postnatal transition)", pages: "p. 286" },
        { topic: "Pharmacologic management of patent ductus: indomethacin or ibuprofen to close (inhibits prostaglandin synthesis); PGE1 (alprostadil) to keep open in ductal-dependent lesions (e.g. transposition, critical coarctation, hypoplastic left heart) until surgery", section: "CVS · Embryology + Pharmacology (PDA)", pages: "p. 286" },
        { topic: "Fetal-to-adult derivatives: umbilical vein to ligamentum teres hepatis; ductus venosus to ligamentum venosum; umbilical arteries to medial umbilical ligaments; foramen ovale to fossa ovalis; ductus arteriosus to ligamentum arteriosum; allantois/urachus to median umbilical ligament", section: "CVS · Embryology (postnatal derivatives)", pages: "p. 286" },
        { topic: "Cardiac chambers and surface anatomy: right atrium forms right heart border, right ventricle forms most of anterior surface, left ventricle forms apex and left border, left atrium most posterior (esophagus compression with LA enlargement)", section: "CVS · Anatomy (chambers and silhouette)", pages: "p. 287" },
        { topic: "Coronary artery anatomy: left main divides into LAD (anterior IV groove, anterior 2/3 of septum, anterior LV) and LCx (left AV groove, lateral LV); RCA in right AV groove gives off AV nodal artery and PDA in right-dominant circulation (~85% of people); PDA supplies inferior LV, posterior 1/3 of septum, posteromedial papillary muscle", section: "CVS · Anatomy (coronary blood supply)", pages: "p. 287" },
        { topic: "Coronary perfusion timing: LV coronaries fill during diastole; tachycardia shortens diastole and worsens subendocardial ischemia; SA nodal artery from RCA in ~60% and from LCx in ~40%", section: "CVS · Anatomy + Physiology (coronary perfusion)", pages: "p. 287" },
        { topic: "Great vessel anatomy: aortic arch branches (brachiocephalic → right subclavian + right common carotid, then left common carotid, then left subclavian); ligamentum arteriosum at the isthmus (site of blunt aortic injury and coarctation); pulmonary trunk bifurcation under arch", section: "CVS · Anatomy (great vessels)", pages: "p. 287" },
        { topic: "Pericardial anatomy: visceral and parietal layers; pericardial cavity holds 15-50 mL fluid; rapid accumulation causes tamponade well below the chronic threshold; phrenic nerve runs over the fibrous pericardium (referred shoulder pain)", section: "CVS · Anatomy (pericardium)", pages: "p. 287" }
      ]
    }
  },
  { day: 4,  date: "2026-06-04", subject: "cvs",  phase: "physiology", title: "Physiology pt 1 · pump mechanics", sub: "CO, SV, Frank-Starling, preload/afterload, PV loops, ejection fraction",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "outputs/study-notes/cvs-day-04-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-04-flashcards.html",
        meta: "60 cards" }
    ],
    outline: {
      intro: "Day 4 opens CVS physiology with how the heart pumps. Read First Aid 2025 (CVS Physiology · cardiac output, Starling, PV loops) before class.",
      edition: "First Aid 2025 · CVS Physiology (pump mechanics)",
      items: [
        { topic: "Core equations: CO = SV × HR; SV = EDV − ESV; EF = SV / EDV; MAP ≈ DBP + 1/3 PP; Fick principle (CO = VO2 / [CaO2 − CvO2])", section: "CVS · Physiology (cardiac output equations)", pages: "p. 288" },
        { topic: "Preload: end-diastolic ventricular volume; increased by venous return, fluid loading, decreased venous compliance (sympathetic tone); decreased by venodilators (nitroglycerin), hemorrhage, increased intrathoracic pressure", section: "CVS · Physiology (preload)", pages: "pp. 288-289" },
        { topic: "Afterload: ventricular wall stress during ejection; approximated by MAP for LV; increased by hypertension, aortic stenosis; decreased by ACE inhibitors, hydralazine, nitroprusside; Laplace: wall stress = (P × r) / (2 × wall thickness)", section: "CVS · Physiology (afterload + Laplace)", pages: "pp. 288-289" },
        { topic: "Contractility (inotropy): intrinsic strength of myocyte contraction; raised by sympathetic stimulation, catecholamines, digoxin, hypercalcemia; lowered by beta-blockers, non-DHP CCBs, hypoxia, acidosis, heart failure", section: "CVS · Physiology (contractility)", pages: "pp. 288-289" },
        { topic: "Frank-Starling law: greater EDV stretches sarcomeres toward optimal length-tension overlap, raising SV; shifts down and right in heart failure; shifts up and left with positive inotropes", section: "CVS · Physiology (Frank-Starling)", pages: "p. 289" },
        { topic: "Pressure-volume loop landmarks: (1) mitral close → isovolumetric contraction; (2) aortic open → ejection; (3) aortic close → isovolumetric relaxation; (4) mitral open → filling; ESPVR slope reflects contractility; EDPVR reflects compliance", section: "CVS · Physiology (PV loops)", pages: "p. 290" },
        { topic: "PV loop shifts: increased preload widens the loop to the right; increased afterload raises the top of the loop and reduces SV; increased contractility steepens ESPVR and raises SV; valvular lesions produce characteristic shape distortions (AS tall narrow, MR no isovolumetric contraction, AR wide loop with high SV)", section: "CVS · Physiology (PV loop shifts + valves)", pages: "p. 290" },
        { topic: "Ejection fraction: SV / EDV; normal 55-70%; HFrEF defined ≤ 40%; HFpEF preserved EF ≥ 50% with diastolic dysfunction; mid-range 41-49%", section: "CVS · Physiology + Pathology cross-ref (EF)", pages: "p. 288 + HF cross-ref" },
        { topic: "Cardiac and vascular function curves: cardiac curve rises with contractility; vascular curve shifts right with volume or constriction; intersection sets operating CO and venous pressure; useful for explaining hemorrhage, exercise, AV fistula, HFrEF shifts", section: "CVS · Physiology (cardiac and vascular function curves)", pages: "p. 289" }
      ]
    }
  },
  { day: 5,  date: "2026-06-05", subject: "cvs",  phase: "physiology", title: "Physiology pt 2 · heart sounds & murmurs", sub: "S1/S2/S3/S4, splitting, systolic and diastolic murmurs, maneuvers",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "outputs/study-notes/cvs-day-05-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-05-flashcards.html",
        meta: "60 cards" }
    ],
    outline: {
      intro: "Day 5 covers the auscultation half of CVS physiology. Read First Aid 2025 (CVS Physiology · heart sounds, splitting, murmurs + Pathology · valvular disease) before class.",
      edition: "First Aid 2025 · CVS Physiology + Pathology (auscultation)",
      items: [
        { topic: "S1 (mitral + tricuspid closure) marks beginning of systole; S2 (aortic + pulmonic closure) marks beginning of diastole; A2 normally precedes P2 because LV pressure falls first", section: "CVS · Physiology (heart sounds)", pages: "p. 291" },
        { topic: "S2 splitting patterns: physiologic (P2 delayed with inspiration), wide (delayed RV emptying: pulmonary stenosis, RBBB), fixed (independent of respiration: ASD), paradoxical (A2 after P2: LBBB, aortic stenosis, HOCM)", section: "CVS · Physiology (S2 splitting)", pages: "p. 291" },
        { topic: "S3 (early diastolic, low-pitched): rapid passive filling into a dilated or volume-overloaded LV; normal in children and young adults; pathologic with HFrEF, MR, AR, high-output states", section: "CVS · Physiology (S3)", pages: "p. 291" },
        { topic: "S4 (late diastolic, atrial kick into stiff LV): pathologic in HFpEF, HTN, HCM, restrictive CMP, acute MI; can be normal in older adults", section: "CVS · Physiology (S4)", pages: "p. 291" },
        { topic: "Systolic murmurs: aortic stenosis (crescendo-decrescendo at right upper sternal border radiating to carotids, pulsus parvus et tardus); mitral regurgitation (holosystolic at apex radiating to axilla); mitral valve prolapse (mid-systolic click + late systolic murmur); HCM (crescendo-decrescendo at LLSB louder with Valsalva and standing); VSD (holosystolic at LLSB)", section: "CVS · Pathology (systolic murmurs)", pages: "pp. 296-297" },
        { topic: "Diastolic murmurs: aortic regurgitation (early decrescendo at LLSB, wide pulse pressure, water-hammer pulse, head bobbing); mitral stenosis (opening snap + low-pitched diastolic rumble at apex, often post-rheumatic)", section: "CVS · Pathology (diastolic murmurs)", pages: "pp. 296-297" },
        { topic: "Maneuvers that change preload or afterload: inspiration raises right-sided sounds; Valsalva strain and standing drop preload (MVP click moves earlier, HCM murmur louder, most other murmurs softer); squatting and passive leg raise raise preload (opposite effect); hand-grip raises afterload (louder MR, AR, VSD; softer AS, HCM)", section: "CVS · Physiology (maneuvers)", pages: "p. 291" },
        { topic: "Auscultation map: aortic (right 2nd ICS), pulmonic (left 2nd ICS), tricuspid (left lower sternal border 4th-5th ICS), mitral (apex 5th ICS midclavicular line); Erb point (left 3rd ICS) for AR", section: "CVS · Physiology (auscultation landmarks)", pages: "p. 291" }
      ]
    }
  },
  { day: 6,  date: "2026-06-06", subject: "cvs",  phase: "physiology", title: "Physiology pt 3 · conduction & regulation", sub: "Cardiac action potentials, ECG basics, baroreflex, chemoreceptors, autoregulation",
    resources: [
      { kind: "highYield", label: "High-yield 1-pager",
        url: "outputs/study-notes/cvs-day-06-high-yield.html",
        meta: "Open in browser" },
      { kind: "flashcards", label: "Flashcards",
        url: "outputs/study-notes/cvs-day-06-flashcards.html",
        meta: "52 cards" },
      { kind: "notes", label: "Physiology block summary",
        url: "outputs/study-notes/block-summary-physiology.html",
        meta: "Days 4-6 wrap-up" }
    ],
    outline: {
      intro: "Day 6 closes physiology with the electrical and regulatory systems. Read First Aid 2025 (CVS Physiology · action potentials, ECG, autoregulation, baroreceptors) before class.",
      edition: "First Aid 2025 · CVS Physiology (conduction + regulation)",
      items: [
        { topic: "Ventricular action potential: phase 0 (rapid Na+ in), phase 1 (transient K+ out), phase 2 (Ca2+ in plateau balancing K+ out), phase 3 (K+ out repolarization), phase 4 (resting potential, K+ leak); effective refractory period covers phases 0-3", section: "CVS · Physiology (ventricular AP)", pages: "pp. 292-293" },
        { topic: "Pacemaker (SA / AV) action potential: phase 4 spontaneous depolarization from funny current (HCN channel, Na+ in) plus T-type Ca2+; phase 0 is a slow L-type Ca2+ upstroke; phase 3 K+ out repolarization; no phase 1 or 2; targets for beta-blockers, non-DHP CCBs, adenosine, ivabradine", section: "CVS · Physiology (pacemaker AP)", pages: "pp. 292-293" },
        { topic: "Conduction system: SA node → atrial myocardium → AV node (delay allows atrial kick) → bundle of His → right + left bundle branches → Purkinje fibers → ventricular myocardium; velocity order Purkinje > atrial > ventricular > AV node; escape rate hierarchy SA 60-100, junctional 40-60, ventricular 20-40", section: "CVS · Physiology (conduction system)", pages: "p. 293" },
        { topic: "ECG basics: P wave (atrial depolarization), PR interval (AV nodal delay, normal 120-200 ms), QRS (ventricular depolarization, normal < 120 ms), ST segment (ventricular plateau), T wave (ventricular repolarization), QT interval (rate-corrected QTc)", section: "CVS · Physiology (ECG)", pages: "p. 294" },
        { topic: "Baroreflex: stretch on carotid sinus (CN IX to NTS) and aortic arch (CN X to NTS) → medullary integration → adjusts sympathetic and parasympathetic outflow; raised BP triggers vagal slowing + reduced sympathetic tone; falling BP triggers sympathetic surge (orthostasis response)", section: "CVS · Physiology (baroreceptors)", pages: "p. 295" },
        { topic: "Chemoreceptors: peripheral (carotid + aortic bodies) respond to ↓ PO2, ↑ PCO2, ↓ pH and drive ventilation + sympathetic outflow; central (ventral medulla) respond to ↑ CSF H+ (from CO2 crossing BBB) and drive ventilation only", section: "CVS · Physiology (chemoreceptors)", pages: "p. 295" },
        { topic: "Coronary autoregulation: heart extracts > 70% of delivered O2 at rest so meeting increased demand requires increased flow; mediated by adenosine and NO; preserved across MAP 60-140; LV perfused mostly in diastole, subendocardium most vulnerable to ischemia", section: "CVS · Physiology (coronary autoregulation)", pages: "p. 295" },
        { topic: "Organ-specific autoregulation drivers: brain (CO2, pH), heart (adenosine, NO), kidney (myogenic + tubuloglomerular feedback), skeletal muscle (adenosine, lactate, K+ during exercise), skin (sympathetic tone for thermoregulation)", section: "CVS · Physiology (regional autoregulation)", pages: "p. 295" },
        { topic: "MAP / CO / SVR relationship: MAP = CO × SVR; explains why hypotension reflects either pump (CO) or vascular tone (SVR) failure; drives shock classification (cardiogenic = low CO, distributive = low SVR, hypovolemic = low preload → low CO)", section: "CVS · Physiology (MAP equation)", pages: "p. 295" }
      ]
    }
  },
  { day: 7,  date: "2026-06-07", subject: "cvs", phase: "pathology",    title: "CVS Pathology pt 1 · congenital, CAD, IE, RHD",        sub: "Congenital heart defects, coronary artery disease, infective endocarditis, rheumatic heart disease" },
  { day: 8,  date: "2026-06-08", subject: "cvs", phase: "pathology",    title: "CVS Pathology pt 2 · HF, shock, CMP, vascular disease", sub: "Heart failure, shock, cardiomyopathies, hypertension, atherosclerosis and arteriolosclerosis, aortic diseases" },
  { day: 9,  date: "2026-06-09", subject: "cvs", phase: "pathology",    title: "CVS Pathology pt 3 · arrhythmias, pericardial, tumors", sub: "Arrhythmias, pericardial diseases, cardiac tumors" },
  { day: 10, date: "2026-06-10", subject: "cvs", phase: "pathology",    title: "CVS Pathology review",                                 sub: "Review pass over CVS pathology: congenital, CAD, IE, RHD, HF, shock, CMP, HTN, atherosclerosis, aortic, arrhythmias, pericardial, tumors" },
  { day: 11, date: "2026-06-11", subject: "cvs", phase: "pharmacology", title: "CVS Pharmacology Day 1 · antihypertensives & HF meds", sub: "Antihypertensive drug classes and heart failure medications" },
  { day: 12, date: "2026-06-12", subject: "cvs", phase: "pharmacology", title: "CVS Pharmacology Day 2 · antiarrhythmic medications",  sub: "Class I to IV antiarrhythmics, adenosine, digoxin, magnesium" },

  // ---- Respiratory (8) — June 14 to June 21 ----
  { day: 13, date: "2026-06-14", subject: "resp", phase: "anatomy",     title: "Respiratory Anatomy & Embryology", sub: "Lung development, branching morphogenesis, surfactant, fetal lung, gross airway and lung anatomy",
    resources: [
      { kind: "highYield", label: "Anatomy & Embryology high-yield summary", url: "outputs/study-notes/resp-anatomy-embryology-high-yield.html", meta: "Full lecture summary · FA 2025 pp. 678 to 681" }
    ]
  },
  { day: 14, date: "2026-06-15", subject: "resp", phase: "physiology",  title: "Respiratory Physiology",           sub: "",
    resources: [
      { kind: "highYield", label: "Respiratory Physiology high-yield summary", url: "outputs/study-notes/resp-physiology-high-yield.html", meta: "Full lecture summary · FA 2025 pp. 682 to 689" }
    ]
  },
  { day: 15, date: "2026-06-16", subject: "resp", phase: "physiology",  title: "Respiratory Physiology",           sub: "",
    resources: [
      { kind: "highYield", label: "Respiratory Physiology high-yield summary", url: "outputs/study-notes/resp-physiology-high-yield.html", meta: "Full lecture summary · FA 2025 pp. 682 to 689" }
    ]
  },
  { day: 16, date: "2026-06-17", subject: "resp", phase: "pathology",   title: "Respiratory Pathology",            sub: "",
    resources: [
      { kind: "highYield", label: "Respiratory Pathology high-yield summary", url: "outputs/study-notes/resp-pathology-high-yield.html", meta: "Full lecture summary · FA 2025 pp. 690 to 703" }
    ]
  },
  { day: 17, date: "2026-06-18", subject: "resp", phase: "pathology",   title: "Respiratory Pathology",            sub: "",
    resources: [
      { kind: "highYield", label: "Respiratory Pathology high-yield summary", url: "outputs/study-notes/resp-pathology-high-yield.html", meta: "Full lecture summary · FA 2025 pp. 690 to 703" }
    ]
  },
  { day: 18, date: "2026-06-19", subject: "resp", phase: "pathology",   title: "Respiratory Pathology",            sub: "",
    resources: [
      { kind: "highYield", label: "Respiratory Pathology high-yield summary", url: "outputs/study-notes/resp-pathology-high-yield.html", meta: "Full lecture summary · FA 2025 pp. 690 to 703" }
    ]
  },
  // ---- Respiratory Pharmacology · June 20 ----
  { day: 19, date: "2026-06-20", subject: "resp", phase: "pharmacology", title: "Respiratory Pharmacology", sub: "H1 blockers, antitussives, decongestants" },

  // ---- Epi & Biostats (5) · June 21 to June 25 ----
  { day: 20, date: "2026-06-21", subject: "epi",  title: "Study design",                       sub: "RCT, cohort, case-control, cross-sectional" },
  { day: 21, date: "2026-06-22", subject: "epi",  title: "Biases and Quantifying risk",        sub: "Selection, recall, confounding; RR, OR, AR, NNT" },
  { day: 22, date: "2026-06-23", subject: "epi",  title: "Quantifying risk (Part 2) and Demographic transitions", sub: "Practice questions on risk measures; demographic transition" },
  { day: 23, date: "2026-06-24", subject: "epi",  title: "Diagnostic tests, Validity and Reliability, Incidence and Prevalence", sub: "Sensitivity, specificity, PPV, NPV; validity and reliability; incidence and prevalence" },
  { day: 24, date: "2026-06-25", subject: "epi",  title: "Statistical tests",                  sub: "Type I/II error, t-test, ANOVA, chi-square" },

  // ---- General Pathology (8) · June 26 to July 3 ----
  { day: 25, date: "2026-06-26", subject: "path", title: "General Pathology", sub: "" },
  { day: 26, date: "2026-06-27", subject: "path", title: "General Pathology", sub: "" },
  { day: 27, date: "2026-06-28", subject: "path", title: "General Pathology", sub: "" },
  { day: 28, date: "2026-06-29", subject: "path", title: "General Pathology", sub: "" },
  { day: 29, date: "2026-06-30", subject: "path", title: "General Pathology", sub: "" },
  { day: 30, date: "2026-07-01", subject: "path", title: "General Pathology", sub: "" },
  { day: 31, date: "2026-07-02", subject: "path", title: "General Pathology", sub: "" },
  { day: 32, date: "2026-07-03", subject: "path", title: "General Pathology", sub: "" }
];

window.SUBJECT_META = {
  cvs:  { name: "Cardiovascular",   short: "CVS",   dateRange: "Jun 1 to Jun 12", count: 12 },
  resp: { name: "Respiratory",      short: "RESP",  dateRange: "Jun 14 to Jun 20", count: 7 },
  epi:  { name: "Epi & Biostats",   short: "EPI",   dateRange: "Jun 21 to Jun 25", count: 5 },
  path: { name: "General Pathology", short: "PATH", dateRange: "Jun 26 to Jul 3", count: 8 }
};

window.LINKS = {
  zoom:     "https://duke.zoom.us/j/96991939005",
  whatsapp: "https://chat.whatsapp.com/JvaTpyDt9loGZjomAVwi42",
  calendly: "https://calendly.com/allanbakesiga/30min",
  signup:   "https://docs.google.com/forms/d/e/1FAIpQLScJwdFDTwH6qtQio-0MmDo5e6rQtKA8BZstoa6RQbo7oPYsXw/viewform",
  ics:      "data/schedule.ics"
};

window.BLOCK_SUMMARIES = [
  { id: "cvs-anatomy",    subject: "cvs", phase: "anatomy",    label: "Anatomy & Embryology", sub: "Days 1-3 wrap-up", days: [1,2,3], url: "outputs/study-notes/block-summary-anatomy-embryology.html" },
  { id: "cvs-physiology", subject: "cvs", phase: "physiology", label: "Physiology",           sub: "Days 4-6 wrap-up", days: [4,5,6], url: "outputs/study-notes/block-summary-physiology.html" }
];

/* ============================================================
   BLOCKS. Hierarchical Block / Sub-block / Day structure that
   powers the Sessions panel drill-in. SESSIONS above stays the
   flat per-day source of truth (Today panel, mini-cal, etc.).
   ============================================================ */
window.BLOCKS = [
  {
    id: "cvs",
    short: "CVS",
    label: "Cardiovascular",
    subject: "cvs",
    dateRange: "Jun 01 to Jun 12",
    dayRange: [1, 12],
    subBlocks: [
      { id: "cvs-anat-embryo",  label: "Anatomy and Embryology", days: [1, 2, 3] },
      { id: "cvs-physiology",   label: "Physiology",             days: [4, 5, 6] },
      { id: "cvs-pathology",    label: "Pathology (incl. review)", days: [7, 8, 9, 10],
        recordings: [
          { title: "Myopericardial pathology part 1", url: "https://us06web.zoom.us/rec/share/hKEhi6frtIXdISm9SABDzyhq_6nz0KUN4a1_wM94F6cRogIdEs8ffn4HHx_AJ9GN.wtCb5-MhDQBilM8i" },
          { title: "Myopericardial pathology part 2", url: "https://us06web.zoom.us/rec/share/igoCAN24nmCgr0EKcVZ_Yo8pt26ihRHTri4LQ2O0cfg_UlkqkV5CcTuOnjD1Abik.lq57yEEv5ilJV9zR" }
        ]
      },
      { id: "cvs-pharmacology", label: "Pharmacology",             days: [11, 12],
        recordings: [
          { title: "CVS Pharmacology Day 1 (antihypertensives and heart failure medications) part 1", url: "https://us06web.zoom.us/rec/share/bi8XXkQi0YlE94xbDy928Mqphi8OqDHYBEZedjUueTEA0u2ENFyIDs98DVdbNIWW.DVroufTF-ooT_9Cc" },
          { title: "CVS Pharmacology Day 2 (antiarrhythmic medications)", url: "https://us06web.zoom.us/rec/share/P9HPLYaN9BFB2E2v6JC0uB1umQ-Q-a5p5RLmUdvzNjeUBJVZ0iEbViNx_ucZQReC.gnRnmEGPs1KfzM3d" }
        ]
      }
    ]
  },
  {
    id: "resp",
    short: "RS",
    label: "Respiratory",
    subject: "resp",
    dateRange: "Jun 14 to Jun 20",
    dayRange: [13, 19],
    subBlocks: [
      { id: "resp-anat-embryo",  label: "Anatomy and Embryology", days: [13],
        recordings: [
          { title: "Respiratory Anatomy & Embryology", url: "https://us06web.zoom.us/rec/share/vSdGuRQ9lF5ZCrvXsl_L1M3begPlIxXm2cVH3MT9cjGA8OdNyHh0_NWZdD2rQm-3.c7Bo7MsUz1m2WLpS" }
        ]
      },
      { id: "resp-physiology",   label: "Physiology",             days: [14, 15],
        recordings: [
          { title: "Respiratory Physiology part 1 (lung volumes, mechanics, pulmonary circulation, V/Q, A-a gradient)", url: "https://us06web.zoom.us/rec/share/K0PekmDVVmEJoK-tcoU8HUi661XpWmWZgRBkBUheeRkRr4cxEStpKZGBLv0EHxV0.6nUn_r87C_B2ZbYE" },
          { title: "Respiratory Physiology part 2 (gas transport, oxygen content, CO2 transport, hemoglobin)", url: "https://us06web.zoom.us/rec/share/KbNDxgnHWvyq0jCu9NdzadZXdXGo8i7iwD_yvTS8s7sVpn1S4RtKOQJBwFpWHT6u.zfaKWTyQSkv_QzfX" }
        ],
        resources: [
          { kind: "drive", label: "Respiratory Physiology extra questions", url: "https://drive.google.com/drive/folders/1x6-b98OhD8SHt9DQjVfZn0_6zw6p46aK?usp=drive_link", meta: "Practice questions and answers on Google Drive" }
        ]
      },
      { id: "resp-pathology",    label: "Pathology",              days: [16, 17, 18],
        recordings: [
          { title: "Respiratory Pathology part 1 (obstructive and restrictive airway diseases)", url: "https://us06web.zoom.us/rec/share/Sfa1D3zx7ex6JzcEA8sXPz9uY27z3GlhYRNOGdaqRNR9uaErnYO_Q-zN2pV7e5qY.z32jsExqt9YdsEx4" },
          { title: "Respiratory Pathology part 2 (lung cancers, pulmonary hypertension, atelectasis, effusion, pneumothorax)", url: "https://us06web.zoom.us/rec/share/yzHz0g6G2P8WO3c5z8tIgZLO0_zVX1Hb4gYnf0dTYyKV09uFJPXxapYP9MdeBJ9C.SL3w5IOrYfa5MWcw" },
          { title: "Respiratory Pathology part 3 (pulmonary vascular diseases and interstitial lung disease)", url: "https://us06web.zoom.us/rec/share/vkw0okrEn8Em5Y-9sqHYulyIizAy4D-AlEBaL6L1TmqFXm_GM3ksLs6JkGtaxAg-.B_Sc0IkSZewfZB4k" }
        ],
        resources: [
          { kind: "drive", label: "Respiratory Pathology extra questions", url: "https://drive.google.com/drive/folders/1ghH7sDj1oUs428Jk95Ap6ufvXJ6kC9ZY?usp=sharing", meta: "Pulmonary vascular and interstitial lung disease practice questions on Google Drive" }
        ]
      },
      { id: "resp-pharmacology", label: "Pharmacology", days: [19],
        recordings: [
          { title: "Respiratory Pharmacology (H1 blockers, antitussives, decongestants)", url: "https://us06web.zoom.us/rec/share/TyUTwaa8QGjgX1l5Zv_WUB_EOOaLBd7sHGq0hQ0OdQqLg9C-nKyUcp5-rZQrb1Od.5r9ghjHSk-T02t60" }
        ]
      }
    ]
  },
  {
    id: "epi",
    short: "EPI",
    label: "Epi and Biostats",
    subject: "epi",
    dateRange: "Jun 21 to Jun 25",
    dayRange: [20, 24],
    subBlocks: [
      { id: "epi-study-design",     label: "Study design",             days: [20],
        recordings: [
          { title: "Study designs: observational vs experimental (with practice questions)", url: "https://us06web.zoom.us/rec/share/LI1tH4KHa9e4CPT7NOeCcOYcwJH6T8B0moToT9O409PfpmGWvaunAGSbXpF4P6dJ.nu1k_Bs_BXhCG8Kg" }
        ]
      },
      { id: "epi-bias-risk",        label: "Biases and Quantifying risk", days: [21],
        recordings: [
          { title: "Biases and Quantifying risk (selection and recall bias, with practice questions; introduction to relative risk, odds ratio, attributable risk, and NNT)", url: "https://us06web.zoom.us/rec/share/5poUujCxFlhkwp93x70qMviwUHOd-yj9pROrTChdYtgJ6eh1FSjQ0lpcwZF02ctY.7u6W9bhUzp7f-e34" }
        ]
      },
      { id: "epi-quant-risk-2",     label: "Quantifying risk (Part 2) and Demographic transitions", days: [22],
        recordings: [
          { title: "Quantifying risk Part 2 (practice questions) and Demographic transitions", url: "https://us06web.zoom.us/rec/share/2oHbnbD-PUiGzTuWQCEosgNiKDGQ9t7kTDU_QcaMNHfObyJ3mrYXrfAAQedfLUtp.rhGdwN5oEICQXusP" }
        ]
      },
      { id: "epi-diagnostic-validity", label: "Diagnostic tests, Validity and Reliability, Incidence and Prevalence", days: [23],
        recordings: [
          { title: "Diagnostic tests, Validity and Reliability, and Incidence and Prevalence", url: "https://us06web.zoom.us/rec/share/1x_Jt3t9I7f6uYYBiAVY9SArs4iPtrZA_hDIgpl8B7IYmFtFr7qiq1T2yjuWqw-5.O7QDSEIUYLeXaNYN" }
        ]
      },
      { id: "epi-stat-tests",       label: "Statistical tests",           days: [24],
        recordings: [
          { title: "Statistical tests (distributions and central tendency, hypothesis testing, type I and II errors and power, confidence intervals, t-test, ANOVA, chi-square, and correlation)", url: "https://us06web.zoom.us/rec/share/888PhsnUEIlpZxPqZOmm5w8DRXiZicivcXAHoNiuIzQyHsAModxaeUEG9I5W1RVF.8xsZk16QgzqcygC3" }
        ]
      }
    ]
  },
  {
    id: "path",
    short: "PATH",
    label: "General Pathology",
    subject: "path",
    dateRange: "Jun 26 to Jul 03",
    dayRange: [25, 32],
    subBlocks: [
      { id: "path-general", label: "General Pathology", days: [25, 26, 27, 28, 29, 30, 31, 32] }
    ]
  }
];

/* The "today" the dashboard uses. Defaults to real now, but the Tweaks
   panel can override it for previewing different states. */
window.SIM_NOW = null;
window.getNow = function () {
  if (window.SIM_NOW) return new Date(window.SIM_NOW);
  return new Date();
};
