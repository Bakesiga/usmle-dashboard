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
 * The second door: a student reading their own row
 *   The dashboard is handed to every student, so it can never carry the key.
 *   Instead it sends the Google credential the student signed in with, and
 *   this script asks Google whether that credential is real, who it belongs
 *   to, and whether it was issued for this class's sign-in. It then answers
 *   with that one verified address's rows and nothing else. A student cannot
 *   ask for anyone else's, because they cannot forge Google's signature. That
 *   matters: the roster addresses sit in a public file, so a door that opened
 *   on an address alone would open on all of them.
 *
 * Setup, about four minutes, once
 *   1. script.google.com  ->  New project. Delete the sample and paste this file.
 *   2. Set READ_KEY below to any long string you make up. Keep a copy.
 *      SHEET_ID is already filled in.
 *   3. Run -> doGet once, approve the permissions prompt (your script, your
 *      sheet, and an outside connection: that one is the call to Google that
 *      checks a student's credential).
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

// The class sign-in, from js/config.js. A credential is only accepted if
// Google says it was issued for this client: one minted for some other site
// is a valid Google token and still must not open this door.
const CLIENT_ID = "269521341031-mjkthkigvhiltjd9p8v6ogsiri0hfeqh.apps.googleusercontent.com";

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function bland() {
  // The reply the collector gives. A wrong key, a missing credential and an
  // expired one all land here, so none of them tells anyone anything.
  return ContentService.createTextOutput("Carey Coombs collector is live. POST submissions here.");
}

function doGet(e) {
  var p = (e && e.parameter) || {};

  // The tutor's door: the whole cohort, behind the shared key.
  if (p.key) {
    if (p.key !== READ_KEY) return bland();
    try { return json(readAll()); }
    catch (err) { return json({ ok: false, error: String(err) }); }
  }

  // The student's door: their own row, behind their own Google credential.
  if (p.token) {
    var email;
    try { email = verifiedEmail(p.token); }
    catch (err) { return json({ ok: false, error: String(err) }); }
    if (!email) return bland();
    try { return json(readOne(email)); }
    catch (err) { return json({ ok: false, error: String(err) }); }
  }

  return bland();
}

// The address Google vouches for, or null. Anything short of a real, current,
// verified credential issued for this class's sign-in is null.
function verifiedEmail(idToken) {
  var res = UrlFetchApp.fetch(
    "https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken),
    { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) return null;

  var c;
  try { c = JSON.parse(res.getContentText()); } catch (err) { return null; }

  if (!c || c.aud !== CLIENT_ID) return null;          // minted for somewhere else
  if (String(c.email_verified) !== "true") return null; // Google has not checked it
  if (!c.email) return null;
  if (Number(c.exp) * 1000 < Date.now()) return null;   // an hour old, ask again

  return String(c.email).toLowerCase().trim();
}

// One verified student's rows, shaped exactly like the key door's answer so
// the page can read either without caring which it got.
function readOne(email) {
  var all = readAll();
  var mine = all.results[email] || {};
  var results = {}, names = {};
  if (Object.keys(mine).length) results[email] = mine;
  if (all.names[email]) names[email] = all.names[email];
  return { ok: true, at: all.at, email: email,
           results: results, names: names, rows: Object.keys(mine).length };
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
