/* Client-side auth gate for student-facing artifact HTML pages.
 *
 * Shared design with js/auth.js:
 *   - Session is stored in localStorage under "usmle.session.v2".
 *   - Allowlist lives at data/allowlist.json (relative to site root).
 *
 * Drop-in usage (in each artifact <head>):
 *   <script src="../../js/artifact-gate.js" defer></script>
 *   <style>body { visibility: hidden; }</style>
 *
 * Behavior:
 *   1. Body is hidden by inline style until the gate decides.
 *   2. If a valid session exists in localStorage AND the email is on the
 *      allowlist, body is revealed.
 *   3. Otherwise the visitor is redirected to signin.html with a `return`
 *      query param so they land back on this artifact after sign-in.
 *
 * Notes:
 *   - This is not fortress-grade security. Anyone who views source or
 *     disables JS can still read the HTML. The goal is to stop casual
 *     link-forwarding.
 *   - All artifacts live two levels deep (outputs/study-notes/*.html),
 *     so site-root paths are computed by trimming the last two path
 *     segments off the current URL.
 */
(function () {
  var SESSION_KEY = "usmle.session.v2";

  function siteRoot() {
    // Strip the last two path segments (e.g. /outputs/study-notes/foo.html
    // becomes /). Works for both GitHub Pages base paths and localhost.
    var path = window.location.pathname;
    var parts = path.split("/");
    // Drop the file name and the two directories above it.
    parts = parts.slice(0, Math.max(1, parts.length - 3));
    var root = parts.join("/");
    if (!root.endsWith("/")) root += "/";
    return window.location.origin + root;
  }

  function reveal() {
    // Clear the inline visibility:hidden we set in the <head> of every
    // gated artifact. We also remove any class-based hide just in case.
    document.documentElement.style.visibility = "";
    if (document.body) {
      document.body.style.visibility = "visible";
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        document.body.style.visibility = "visible";
      });
    }
  }

  function redirectToSignin() {
    var here = window.location.href;
    var signinUrl = siteRoot() + "signin.html?return=" + encodeURIComponent(here);
    window.location.replace(signinUrl);
  }

  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function checkAllowlist(email) {
    return fetch(siteRoot() + "data/allowlist.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("allowlist fetch failed");
        return res.json();
      })
      .then(function (json) {
        var list = [];
        if (Array.isArray(json.students)) {
          list = json.students.map(function (s) {
            return String(s.email || "").toLowerCase().trim();
          });
        } else if (Array.isArray(json.emails)) {
          list = json.emails.map(function (e) {
            return String(e).toLowerCase().trim();
          });
        }
        return list.indexOf(String(email).toLowerCase().trim()) !== -1;
      });
  }

  var session = getSession();
  if (!session || !session.email) {
    redirectToSignin();
    return;
  }

  checkAllowlist(session.email).then(function (ok) {
    if (ok) {
      reveal();
    } else {
      // Stale session for a removed student. Drop the session and
      // bounce to signin so they get a clear error message there.
      try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
      redirectToSignin();
    }
  }).catch(function () {
    // Network/JSON error. Fail closed: send to signin.
    redirectToSignin();
  });
})();
