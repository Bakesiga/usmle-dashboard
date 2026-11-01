/* ============================================================================
 * Carey Coombs — NBME submissions READER (Google Apps Script web app)
 *
 * This is a second, separate script from the collector that already runs. It
 * only reads. The collector is left completely alone, so nothing here can
 * break a student's submission mid-phase.
 *
 * What it does
 *   Serves the submissions sheet as JSON, shaped exactly like
 *   window.NBME.results, so the tutor view can read it live:
 *
 *     { ok: true,
 *       at: "2026-11-01T...",
 *       results: { "student@x.com": { nbme27: { wrong: [3,15], score: null,
 *                                               at: "...", name: "..." } } },
 *       names:   { "student@x.com": "Student Name" },
 *       rows: 41 }
 *
 *   A student who submits twice counts once: the latest row for that form wins,
 *   which is what you want when someone re-marks a form.
 *
 * Why there is a key
 *   A web app deployed "Anyone" is a public URL. The key keeps the cohort's
 *   scores off the open web. Without the right key this returns the same bland
 *   line the collector returns, so the URL gives a stranger nothing.
 *   The key lives in your browser only; it is never committed.
 *
 * Setup, about four minutes, once
 *   1. script.google.com  ->  New project. Delete the sample and paste this file.
 *   2. Set READ_KEY below to any long string you make up. Keep a copy.
 *      SHEET_ID is already filled in.
 *   3. Run -> doGet once, approve the permissions prompt (your script, your sheet).
 *   4. Deploy -> New deployment -> Web app.
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      Deploy, then copy the /exec URL.
 *   5. Paste that URL into js/config.js as NBME_READ_URL, commit, push.
 *   6. Open tutor.html, paste the key once when it asks. Done.
 * ========================================================================== */

const SHEET_ID = "1EiPw2Sw2SwJr2FeVRuR1cD1viQe1s3YLjps4oB4It-Q";

// Any long string of your own. Change it and the old one stops working.
const READ_KEY = "PASTE_A_LONG_RANDOM_STRING_HERE";

// Leave blank to read the first tab, whatever it is called.
const TAB_NAME = "";

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var key = (e && e.parameter && e.parameter.key) || "";
  if (key !== READ_KEY) {
    // Same reply the collector gives, so a wrong key reveals nothing.
    return ContentService.createTextOutput("Carey Coombs collector is live. POST submissions here.");
  }
  try {
    return json(readAll());
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function readAll() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = TAB_NAME ? ss.getSheetByName(TAB_NAME) : ss.getSheets()[0];
  if (!sheet) throw new Error("submissions tab not found");

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return { ok: true, at: new Date().toISOString(), results: {}, names: {}, rows: 0 };

  // Find columns by header rather than position, so a column inserted in the
  // sheet by hand does not silently shift everything.
  var header = values[0].map(function (h) { return String(h).toLowerCase().trim(); });
  var col = function () {
    for (var i = 0; i < arguments.length; i++) {
      var at = header.indexOf(arguments[i]);
      if (at > -1) return at;
    }
    return -1;
  };
  var cAt    = col("timestamp", "received_at", "at");
  var cEmail = col("email");
  var cName  = col("name");
  var cForm  = col("form");
  var cTotal = col("total");
  var cWrong = col("wrong question numbers", "wrong", "wrong questions");
  var cScore = col("score", "3-digit", "three digit");

  // "wrong" is the count in one column and the list in another. If the list
  // header is missing we must not mistake the count for the list.
  var cWrongList = col("wrong question numbers", "wrong questions");
  if (cWrongList > -1) cWrong = cWrongList;

  var results = {}, names = {}, seen = {}, rows = 0;

  values.slice(1).forEach(function (r) {
    var email = cEmail > -1 ? String(r[cEmail] || "").toLowerCase().trim() : "";
    var form  = cForm  > -1 ? String(r[cForm]  || "").toLowerCase().trim() : "";
    if (!email || !form) return;
    rows++;

    var at = cAt > -1 && r[cAt] ? new Date(r[cAt]) : null;
    var stamp = at ? at.getTime() : 0;
    var seenKey = email + "|" + form;
    // Latest row for this form wins. A re-mark replaces the first attempt.
    if (seen[seenKey] !== undefined && seen[seenKey] >= stamp) return;
    seen[seenKey] = stamp;

    var wrong = String(cWrong > -1 ? r[cWrong] : "")
      .split(/[^0-9]+/)
      .map(Number)
      .filter(function (n) { return n > 0; });

    var score = null;
    if (cScore > -1 && r[cScore] !== "" && r[cScore] !== null) {
      var s = Number(r[cScore]);
      if (!isNaN(s) && s > 0) score = s;
    }

    var nm = cName > -1 ? String(r[cName] || "").trim() : "";
    if (nm) names[email] = nm;

    if (!results[email]) results[email] = {};
    results[email][form] = {
      wrong: wrong,
      score: score,
      total: cTotal > -1 && Number(r[cTotal]) ? Number(r[cTotal]) : 200,
      at: at ? at.toISOString() : null,
      name: nm
    };
  });

  return { ok: true, at: new Date().toISOString(), results: results, names: names, rows: rows };
}
