/* ============================================================================
 * USMLE Monthly Evaluation — response collector (Google Apps Script web app)
 *
 * What it does
 *   - Receives a POST from evaluation.html and appends one row per student to
 *     a Google Sheet (tab "Responses").
 *   - Rebuilds a "Focus" tab on every submission: every topic ranked from
 *     weakest to strongest by average self-rated understanding, with counts of
 *     students who are struggling (rated 1 to 2) and who asked to revisit it.
 *     The top of that tab is literally your "teach this next" list.
 *
 * Setup (about 5 minutes, one time)
 *   1. Create a new Google Sheet. Copy its ID from the URL
 *      (the long string between /d/ and /edit) and paste it into SHEET_ID below.
 *   2. Go to script.google.com  ->  New project. Delete the sample code and
 *      paste this whole file in.
 *   3. Run -> doGet once. Approve the permissions prompt (it is your own script
 *      writing to your own Sheet).
 *   4. Deploy -> New deployment -> type "Web app".
 *        Execute as:  Me
 *        Who has access:  Anyone
 *      Click Deploy and copy the Web app URL (ends in /exec).
 *   5. Open evaluation.html, find  const SHEETS_ENDPOINT = "";  near the top of
 *      the scripts, paste the URL between the quotes, save, and push.
 *
 * After that, every submission lands in the Sheet automatically and the Focus
 * tab updates itself. No spreadsheet formulas needed.
 * ========================================================================== */

const SHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";
const RESP_TAB = "Responses";
const FOCUS_TAB = "Focus";
const ROSTER_TAB = "Responders";
// Public class roster (student emails), used to flag who has NOT responded yet.
const ROSTER_URL = "https://bakesiga.github.io/usmle-dashboard/data/allowlist.json";

/* Readable labels for the Focus tab. Keys must match evaluation.html. */
const LABELS = {
  cvs_embryo: "CVS · Embryology and fetal circulation",
  cvs_cycle: "CVS · Cardiac cycle and pressure volume loops",
  cvs_output: "CVS · Preload, afterload, contractility, cardiac output",
  cvs_bp: "CVS · Blood pressure regulation (baroreceptors, RAAS)",
  cvs_curves: "CVS · Cardiac and vascular function curves",
  cvs_ecg: "CVS · Cardiac electrophysiology and the ECG",
  cvs_htn: "CVS · Hypertension and vascular disease",
  cvs_athero: "CVS · Atherosclerosis and aneurysms",
  cvs_ihd: "CVS · Ischaemic heart disease and MI",
  cvs_hf: "CVS · Heart failure",
  cvs_cm: "CVS · Cardiomyopathies and pericardial disease",
  cvs_valve: "CVS · Valvular disease and murmurs",
  cvs_arr: "CVS · Arrhythmias",
  cvs_rx1: "CVS · Antihypertensive and heart failure drugs",
  cvs_rx2: "CVS · Antiarrhythmic and lipid lowering drugs",
  resp_anat: "RESP · Embryology and anatomy",
  resp_vol: "RESP · Lung volumes and capacities",
  resp_mech: "RESP · Mechanics of breathing and compliance",
  resp_circ: "RESP · Pulmonary circulation and the A-a gradient",
  resp_vq: "RESP · V/Q mismatch and dead space",
  resp_o2: "RESP · Oxygen transport and the O2-haemoglobin curve",
  resp_co2: "RESP · Carbon dioxide transport and acid-base",
  resp_obs: "RESP · Obstructive lung disease (asthma, COPD)",
  resp_res: "RESP · Restrictive and interstitial lung disease",
  resp_ca: "RESP · Lung cancers",
  resp_vasc: "RESP · PE, pulmonary hypertension and pleural disease",
  resp_rx: "RESP · Respiratory drugs (antihistamines, antitussives)",
  epi_obs: "EPI · Observational designs",
  epi_exp: "EPI · Experimental designs and clinical trials",
  epi_bias: "EPI · Bias and confounding",
  epi_risk: "EPI · Quantifying risk (RR, OR, attributable risk)",
  epi_nnt: "EPI · Number needed to treat or harm",
  epi_sesp: "EPI · Sensitivity and specificity",
  epi_pv: "EPI · Predictive values and likelihood ratios",
  epi_inc: "EPI · Incidence versus prevalence",
  epi_valid: "EPI · Validity, reliability, precision, accuracy",
  epi_hyp: "EPI · Hypothesis testing, type I/II error, power",
  epi_tests: "EPI · Confidence intervals and statistical tests",
  path_adapt: "PATH · Cellular adaptations",
  path_inj: "PATH · Reversible vs irreversible cell injury",
  path_death: "PATH · Cell death: necrosis and apoptosis",
  path_free: "PATH · Free radical injury",
  path_acute: "PATH · Acute inflammation and mediators",
  path_chronic: "PATH · Chronic and granulomatous inflammation",
  path_nomen: "PATH · Tumour nomenclature, grading, staging",
  path_hall: "PATH · Hallmarks of cancer",
  path_onco: "PATH · Oncogenes and tumour suppressors",
  path_carc: "PATH · Carcinogens and tumour markers",
  path_meta: "PATH · Invasion, metastasis, paraneoplastic syndromes",
  path_epi: "PATH · Cancer epidemiology and prevention"
};

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json({ ok: true, service: "USMLE monthly evaluation collector", time: new Date().toISOString() });
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(RESP_TAB) || ss.insertSheet(RESP_TAB);

    // header: received_at first, then every key we have seen
    var header = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : ["received_at"];
    var changed = false;
    if (header.indexOf("received_at") === -1) { header.unshift("received_at"); changed = true; }
    Object.keys(data).forEach(function (k) {
      if (header.indexOf(k) === -1) { header.push(k); changed = true; }
    });
    if (sheet.getLastRow() === 0 || changed) {
      sheet.getRange(1, 1, 1, header.length).setValues([header]);
      sheet.setFrozenRows(1);
    }

    var row = header.map(function (h) {
      if (h === "received_at") return new Date();
      return data[h] !== undefined ? data[h] : "";
    });
    sheet.appendRow(row);

    try { rebuildFocus(ss, sheet); } catch (err) { /* never block a save on summary errors */ }
    try { rebuildRoster(ss, sheet); } catch (err) { /* never block a save on roster errors */ }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function rebuildFocus(ss, sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return;
  var header = values[0];
  var rows = values.slice(1);
  var topicKeys = header.filter(function (h) { return /^(cvs|resp|epi|path)_/.test(h); });
  var revisitCol = header.indexOf("revisit");

  var stats = {};
  topicKeys.forEach(function (k) { stats[k] = { sum: 0, n: 0, skip: 0, low: 0 }; });
  var revisit = {};

  rows.forEach(function (r) {
    topicKeys.forEach(function (k) {
      var raw = r[header.indexOf(k)];
      if (raw === "" || raw === null) return;
      var v = Number(raw);
      if (isNaN(v)) return;
      if (v === 0) { stats[k].skip++; return; }      // skipped / absent
      stats[k].sum += v; stats[k].n++;
      if (v <= 2) stats[k].low++;                     // struggling
    });
    if (revisitCol > -1) {
      String(r[revisitCol] || "").split(";").forEach(function (t) {
        t = t.trim(); if (t) revisit[t] = (revisit[t] || 0) + 1;
      });
    }
  });

  var out = [["Topic", "Avg understanding (1-5)", "Responses", "Struggling (rated 1-2)", "Revisit requests", "Skipped / absent"]];
  topicKeys.map(function (k) {
    var s = stats[k];
    var avg = s.n ? s.sum / s.n : null;
    return { sortAvg: avg === null ? 99 : avg, row: [LABELS[k] || k, avg === null ? "" : Number(avg.toFixed(2)), s.n, s.low, revisit[k] || 0, s.skip] };
  }).sort(function (a, b) { return a.sortAvg - b.sortAvg; })
    .forEach(function (o) { out.push(o.row); });

  var f = ss.getSheetByName(FOCUS_TAB) || ss.insertSheet(FOCUS_TAB);
  f.clear();
  f.getRange(1, 1, out.length, out[0].length).setValues(out);
  f.setFrozenRows(1);
  f.autoResizeColumn(1);
}

function rebuildRoster(ss, sheet) {
  // Pull the class roster (student emails) from the public allowlist.
  var roster = [];
  try {
    var res = UrlFetchApp.fetch(ROSTER_URL, { muteHttpExceptions: true });
    var json = JSON.parse(res.getContentText());
    (json.students || []).forEach(function (s) {
      var e = String(s.email || "").toLowerCase().trim();
      if (e && e !== "allanbakesiga@gmail.com") roster.push(e);
    });
  } catch (e) { return; }
  if (!roster.length) return;

  // Latest submission per email.
  var values = sheet.getDataRange().getValues();
  var header = values[0];
  var emailCol = header.indexOf("email");
  var nameCol = header.indexOf("name");
  var subCol = header.indexOf("submitted_at");
  var recCol = header.indexOf("received_at");
  var responded = {};
  values.slice(1).forEach(function (r) {
    var e = emailCol > -1 ? String(r[emailCol] || "").toLowerCase().trim() : "";
    if (!e) return;
    responded[e] = {
      at: (subCol > -1 ? r[subCol] : "") || (recCol > -1 ? r[recCol] : ""),
      name: nameCol > -1 ? r[nameCol] : ""
    };
  });

  var pending = [], done = [];
  roster.forEach(function (e) {
    if (responded[e]) done.push([e, "Yes", responded[e].at, responded[e].name]);
    else pending.push([e, "No", "", ""]);
  });

  var out = [["Class roster: " + done.length + " of " + roster.length + " responded", "", "", ""]];
  out.push(["Student email", "Responded?", "When", "Name"]);
  pending.concat(done).forEach(function (row) { out.push(row); });   // not-yet-responded first

  var t = ss.getSheetByName(ROSTER_TAB) || ss.insertSheet(ROSTER_TAB);
  t.clear();
  t.getRange(1, 1, out.length, out[0].length).setValues(out);
  t.setFrozenRows(2);
  t.autoResizeColumn(1);
}
