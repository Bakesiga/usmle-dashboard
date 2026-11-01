/* ============================================================
   cohort.js — the tutor side of the NBME phase.

   Everything here reads the whole cohort rather than one student,
   so it is loaded by tutor.html only. The per-topic arithmetic is
   NOT reimplemented: it comes from NBMEPanel.topicReport in
   js/nbme.js, so a change to the bands or the question map lands
   on the student report and the tutor view at the same time.

   Two sources of submissions, in this order:
     live    the reader web app (outputs/nbme/reader.gs), when
             config has NBME_READ_URL and a key is stored on this
             machine. Current as of the moment the page loaded.
     static  window.NBME.results in js/data.js, for anything typed
             up by hand. Used when there is no live source, and
             merged under the live one when there is, so a result
             sent on WhatsApp is not lost.
   ============================================================ */
(function () {
  'use strict';

  var KEY_STORE = 'usmle.nbmekey.v1';

  function cfg() { return (typeof USMLE_CONFIG !== 'undefined' ? USMLE_CONFIG : {}) || {}; }
  function N() { return window.NBME || {}; }

  // ---- Who may see this -------------------------------------------
  // The tutor list in data.js, falling back to the NBME unlock list so
  // there is never a window where the page is open to the class.
  function tutors() {
    var list = N().tutors || N().unlockFor || [];
    return list.map(function (e) { return String(e).toLowerCase().trim(); }).filter(Boolean);
  }
  function isTutor(email) {
    return tutors().indexOf(String(email || '').toLowerCase().trim()) !== -1;
  }
  function session() {
    try { return JSON.parse(localStorage.getItem('usmle.session.v2') || 'null'); } catch (e) { return null; }
  }

  // ---- The read key -----------------------------------------------
  // Stored on this machine and nowhere else. Never committed, never sent
  // anywhere except the reader URL.
  function getKey() {
    try { return localStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; }
  }
  function setKey(k) {
    try { localStorage.setItem(KEY_STORE, String(k || '').trim()); } catch (e) {}
  }
  function clearKey() {
    try { localStorage.removeItem(KEY_STORE); } catch (e) {}
  }

  // ---- Loading -----------------------------------------------------
  function staticResults() {
    var out = {};
    var src = N().results || {};
    Object.keys(src).forEach(function (email) {
      var e = String(email).toLowerCase().trim();
      out[e] = {};
      Object.keys(src[email] || {}).forEach(function (f) {
        var r = src[email][f] || {};
        out[e][f] = {
          wrong: Array.isArray(r.wrong) ? r.wrong.map(Number) : [],
          score: typeof r.score === 'number' ? r.score : null,
          total: r.total || 200,
          at: r.at || null,
          name: r.name || '',
          hand: true                       // typed up by hand, not submitted
        };
      });
    });
    return out;
  }

  function loadResults() {
    var url = cfg().NBME_READ_URL, key = getKey();
    var fallback = {
      source: 'static', results: staticResults(), names: {}, at: null, rows: null,
      reason: !url ? 'no-url' : (!key ? 'no-key' : null)
    };
    if (!url || !key) return Promise.resolve(fallback);

    return fetch(url + (url.indexOf('?') > -1 ? '&' : '?') + 'key=' + encodeURIComponent(key),
                 { cache: 'no-store' })
      .then(function (res) { return res.text(); })
      .then(function (text) {
        var data;
        // A wrong key gets the collector's plain-text line, not JSON.
        try { data = JSON.parse(text); } catch (e) {
          fallback.reason = 'bad-key'; return fallback;
        }
        if (!data || !data.ok) { fallback.reason = 'reader-error'; return fallback; }

        // Live wins per form, hand-typed fills the gaps.
        var merged = staticResults();
        Object.keys(data.results || {}).forEach(function (email) {
          var e = String(email).toLowerCase().trim();
          if (!merged[e]) merged[e] = {};
          Object.keys(data.results[email]).forEach(function (f) {
            merged[e][f] = data.results[email][f];
          });
        });
        return { source: 'live', results: merged, names: data.names || {},
                 at: data.at || null, rows: data.rows, reason: null };
      })
      .catch(function () { fallback.reason = 'offline'; return fallback; });
  }

  // The class roster, minus the tutors themselves.
  function loadRoster() {
    var ready = (window.USMLE_AUTH && USMLE_AUTH.ready)
      ? USMLE_AUTH.ready
      : fetch(cfg().DATA ? cfg().DATA.allowlist : 'data/allowlist.json', { cache: 'no-store' })
          .then(function (r) { return r.json(); })
          .then(function (j) { return j.students || []; });
    return Promise.resolve(ready).then(function (students) {
      var t = tutors();
      return (students || [])
        .map(function (s) {
          return {
            email: String(s.email || '').toLowerCase().trim(),
            paused: s.recordingsPaused === true,
            tracks: s.tracks || []
          };
        })
        .filter(function (s) { return s.email && t.indexOf(s.email) === -1; });
    });
  }

  // ---- Reading one form across the cohort --------------------------
  function pct(right, total) { return total ? Math.round(right * 100 / total) : 0; }

  // One row per student on the roster: did they send this form, and how did
  // it go. Everyone is listed, which is the point: the blanks are the work.
  function rosterFor(formId, roster, results, names) {
    return roster.map(function (s) {
      var r = (results[s.email] || {})[formId] || null;
      var row = {
        email: s.email,
        name: (r && r.name) || (names || {})[s.email] || '',
        sent: !!r,
        hand: !!(r && r.hand),
        at: r && r.at ? new Date(r.at) : null,
        wrong: r ? r.wrong.length : null,
        total: r ? (r.total || 200) : null,
        score: r && typeof r.score === 'number' ? r.score : null,
        pct: null
      };
      if (r) row.pct = pct(row.total - row.wrong, row.total);
      return row;
    });
  }

  function stats(values) {
    var v = values.filter(function (x) { return typeof x === 'number' && !isNaN(x); })
                  .sort(function (a, b) { return a - b; });
    if (!v.length) return null;
    var sum = v.reduce(function (a, b) { return a + b; }, 0);
    var mid = Math.floor(v.length / 2);
    return {
      n: v.length,
      mean: Math.round(sum / v.length),
      median: v.length % 2 ? v[mid] : Math.round((v[mid - 1] + v[mid]) / 2),
      lo: v[0],
      hi: v[v.length - 1]
    };
  }

  // ---- What the class got wrong ------------------------------------
  // The teaching list. One row per question, how many of the submitters
  // missed it, with the system and discipline that question belongs to.
  function missCounts(formId, results) {
    var n = N();
    var sysMap = (n.map || {})[formId] || [];
    var discMap = (n.disc || {})[formId] || [];
    var total = Math.max(sysMap.length, discMap.length, 200);

    var counts = new Array(total + 1).join('0').split('').map(Number);
    var submitters = 0;
    Object.keys(results).forEach(function (email) {
      var r = results[email][formId];
      if (!r) return;
      submitters++;
      r.wrong.forEach(function (q) {
        if (q >= 1 && q <= total) counts[q - 1]++;
      });
    });

    var sysT = n.systems || {}, discT = n.disciplines || {};
    var byId = {}; (window.BLOCKS || []).forEach(function (b) { byId[b.id] = b; });

    var rows = [];
    for (var i = 0; i < total; i++) {
      var sid = sysMap[i] || null, did = discMap[i] || null;
      var blocks = []
        .concat((sid && sysT[sid] && sysT[sid].blocks) || [])
        .concat((did && discT[did] && discT[did].blocks) || []);
      var uniq = [];
      blocks.forEach(function (b) { if (byId[b] && uniq.indexOf(b) === -1) uniq.push(b); });
      rows.push({
        q: i + 1,
        missed: counts[i],
        of: submitters,
        pct: pct(counts[i], submitters),
        system: sid ? ((sysT[sid] && sysT[sid].label) || sid) : '',
        discipline: did ? ((discT[did] && discT[did].label) || did) : '',
        blocks: uniq.map(function (b) { return byId[b]; })
      });
    }
    return { submitters: submitters, rows: rows };
  }

  // ---- The cohort's own topic report -------------------------------
  // Every submitter's questions pooled into one report, using the same
  // topicReport the students see. Pooling means a topic's percent is the
  // class's percent on those questions, not an average of averages.
  function cohortReport(formId, results, axis) {
    if (!window.NBMEPanel || !NBMEPanel.topicReport) return null;
    var agg = {}, n = 0;
    Object.keys(results).forEach(function (email) {
      var r = results[email][formId];
      if (!r) return;
      var rep = NBMEPanel.topicReport(formId, { wrong: r.wrong }, axis);
      if (!rep) return;
      n++;
      rep.rows.forEach(function (row) {
        if (!agg[row.id]) {
          agg[row.id] = { id: row.id, label: row.label, blocks: row.blocks,
                          known: row.known, right: 0, total: 0, students: 0 };
        }
        agg[row.id].right += row.right;
        agg[row.id].total += row.total;
        agg[row.id].students++;
      });
    });
    if (!n) return null;

    var bands = N().bands || { strong: 75, borderline: 60 };
    var rows = Object.keys(agg).map(function (id) {
      var a = agg[id];
      a.pct = pct(a.right, a.total);
      a.band = a.pct >= bands.strong ? 'strong' : (a.pct >= bands.borderline ? 'borderline' : 'weak');
      a.perStudent = Math.round(a.total / a.students);
      a.thin = a.perStudent < (N().minTopicN || 4);
      return a;
    });
    return { rows: rows, students: n };
  }

  window.USMLE_COHORT = {
    isTutor: isTutor,
    session: session,
    getKey: getKey, setKey: setKey, clearKey: clearKey,
    loadResults: loadResults,
    loadRoster: loadRoster,
    rosterFor: rosterFor,
    stats: stats,
    missCounts: missCounts,
    cohortReport: cohortReport
  };
})();
