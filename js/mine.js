/* One student's own NBME results, read live from the submissions sheet.
 *
 * The tutor view reads the whole cohort with a shared key typed into the
 * browser once. That cannot work here: this page is handed to every student,
 * so a key in it is a key everybody has, and the repo is public anyway.
 *
 * Instead the page sends the Google credential the student already signed in
 * with. Google signs that credential, so it cannot be edited into someone
 * else's address, and the reader answers with that one verified student's
 * rows and nothing else. No roster, no other scores, nothing to enumerate,
 * which matters because the roster addresses themselves sit in a public file.
 *
 * The credential expires after about an hour, so a student coming back the
 * next day needs a fresh one. mountSignIn draws Google's own button for that
 * without sending them away from the page and losing their place.
 */
var USMLE_MINE = (function () {
  'use strict';

  var pending = null;   // in-flight or finished read, so one visit reads once

  function cfg() { return (typeof USMLE_CONFIG !== 'undefined' ? USMLE_CONFIG : {}) || {}; }

  function token() {
    if (typeof USMLE_AUTH === 'undefined' || !USMLE_AUTH.idToken) return null;
    return USMLE_AUTH.idToken();
  }

  function blank(reason) {
    return { ok: false, reason: reason, email: null, results: {}, name: '', at: null };
  }

  // Resolves to { ok, reason, email, results: { nbme27: {...} }, name, at }.
  // Never rejects: every failure comes back as a reason the page can say out
  // loud, because "nothing here" and "could not reach the sheet" are very
  // different things to a student who knows they sent their form.
  function load(force) {
    if (pending && !force) return pending;

    var url = cfg().NBME_READ_URL;
    if (!url) return (pending = Promise.resolve(blank('no-url')));

    var t = token();
    if (!t) return (pending = Promise.resolve(blank('signed-out')));

    pending = fetch(url + (url.indexOf('?') > -1 ? '&' : '?') + 'token=' + encodeURIComponent(t),
                    { cache: 'no-store' })
      .then(function (res) { return res.text(); })
      .then(function (text) {
        var data;
        // A credential the reader will not accept gets the collector's plain
        // line, not JSON, exactly as a wrong key does.
        try { data = JSON.parse(text); } catch (e) { return blank('signed-out'); }
        if (!data || !data.ok) return blank('reader-error');
        var email = String(data.email || '').toLowerCase().trim();
        return {
          ok: true, reason: null, email: email,
          results: (data.results || {})[email] || {},
          name: (data.names || {})[email] || '',
          at: data.at || null
        };
      })
      .catch(function () { return blank('offline'); });

    return pending;
  }

  // Google's own sign-in button, drawn into el. On success the session is
  // rewritten with the fresh credential and done() is called, so the caller
  // can simply read again.
  function mountSignIn(el, done) {
    if (!el) return;
    var id = cfg().GOOGLE_CLIENT_ID;
    if (!id || typeof USMLE_AUTH === 'undefined') return;

    var tries = 0;
    (function draw() {
      if (!window.google || !google.accounts || !google.accounts.id) {
        if (tries++ > 60) return;          // six seconds, then give up quietly
        setTimeout(draw, 100);
        return;
      }
      google.accounts.id.initialize({
        client_id: id,
        callback: function (resp) {
          var r = USMLE_AUTH.handleCredential(resp.credential);
          if (!r || !r.ok) return;
          pending = null;                  // the old answer was "signed out"
          if (typeof done === 'function') done();
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });
      google.accounts.id.renderButton(el, {
        type: 'standard', theme: 'outline', size: 'medium',
        text: 'continue_with', shape: 'pill', logo_alignment: 'left'
      });
    })();
  }

  return { load: load, mountSignIn: mountSignIn };
})();
