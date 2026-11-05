/* ============================================================
   tutor.js — renders tutor.html.

   On what this gate is worth: the page and the Cohort tab are
   hidden from everyone outside NBME.tutors, and the live reader
   needs a key that exists only in this browser. But GitHub Pages
   serves static files, so anything the page can read without the
   key, a student with the view-source menu can read too. That is
   exactly one thing: whatever is typed into window.NBME.results
   in data.js. Keep that empty and the cohort's scores never leave
   the sheet. Hand-type a result there and treat it as published.
   ============================================================ */
(function () {
  'use strict';

  var C = window.USMLE_COHORT;
  var N = window.NBME || {};
  var email = window.__TUTOR_EMAIL__ || '';

  // Second half of the gate, now that data.js has the tutor list.
  if (!C || !C.isTutor(email)) {
    document.documentElement.innerHTML =
      '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>Not your page &middot; USMLE Classes</title>' +
      '<link rel="stylesheet" href="css/redesign-tokens.css"><link rel="stylesheet" href="css/site.css"></head>' +
      '<body style="background:var(--bg);color:var(--ink);font-family:var(--font-body);margin:0">' +
      '<div style="max-width:520px;margin:0 auto;padding:18vh 24px 0;text-align:center">' +
      '<h1 style="font-family:var(--font-display);font-weight:400;font-size:32px;line-height:1.15;margin:0 0 14px">' +
      'This one is not for you</h1>' +
      '<p style="color:var(--muted);font-size:15px;line-height:1.6;margin:0 0 24px">' +
      'Your own results are on the dashboard, under My results.</p>' +
      '<a href="dashboard.html" style="display:inline-block;font-weight:700;text-decoration:none;' +
      'padding:13px 24px;border-radius:999px;background:var(--accent);color:#fff">Back to the dashboard</a>' +
      '</div></body>';
    return;
  }

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function parseYMD(s) { var p = String(s).split('-').map(Number); return new Date(p[0], (p[1] || 1) - 1, p[2] || 1); }
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function dayLabel(ymd) { var d = parseYMD(ymd); return d.getDate() + ' ' + MON[d.getMonth()]; }
  function when(d) {
    if (!d) return '';
    var now = new Date();
    var same = d.toDateString() === now.toDateString();
    var hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
    return same ? 'today ' + hh + ':' + mm : d.getDate() + ' ' + MON[d.getMonth()] + ', ' + hh + ':' + mm;
  }
  // A name worth printing. Submissions carry the student's Google name, so
  // anyone who has sent something is named properly. For the rest, the
  // allowlist holds only addresses, so the local part is tidied into
  // something scannable: no trailing digits, separators become spaces,
  // first letters raised. Give allowlist.json a "name" and that wins.
  function who(row) {
    if (row.name) return row.name;
    var local = row.email.split('@')[0].replace(/[0-9]+$/, '');
    return local.split(/[._+-]+/).filter(Boolean).map(function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ') || row.email;
  }

  var forms = N.forms || [];
  var state = { form: null, axis: 'system', allMissed: false, open: null };
  var DATA = { results: {}, names: {}, roster: [], source: 'static', at: null, reason: null };

  function formStatus(f, now) {
    var t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (t < parseYMD(f.sit[0])) return 'ahead';
    if (t <= parseYMD(f.sit[1])) return 'sitting';
    if (t <= parseYMD(f.week[1])) return 'correcting';
    return 'done';
  }
  function sentCount(formId) {
    return Object.keys(DATA.results).filter(function (e) {
      return DATA.results[e][formId] && DATA.roster.some(function (s) { return s.email === e; });
    }).length;
  }
  // The form the week is actually about, falling back to the newest one
  // anybody has sent, so the page opens on something worth reading.
  function pickForm() {
    var now = new Date();
    var live = forms.filter(function (f) {
      var st = formStatus(f, now);
      return st === 'sitting' || st === 'correcting';
    });
    if (live.length) return live[live.length - 1].id;
    for (var i = forms.length - 1; i >= 0; i--) if (sentCount(forms[i].id)) return forms[i].id;
    return forms.length ? forms[0].id : null;
  }

  /* ---------------- the source strip ---------------- */
  function renderSource() {
    var live = DATA.source === 'live';
    var bits = [];
    if (live) {
      bits.push('<span><b>Live</b> from the submissions sheet' +
                (DATA.at ? ', read ' + when(new Date(DATA.at)) : '') + '.</span>');
      bits.push('<button type="button" data-act="refresh">Refresh</button>');
      bits.push('<button type="button" data-act="forget">Forget the key on this device</button>');
    } else {
      var why = {
        'no-url': 'No reader is set up yet, so this is the snapshot held in data.js rather than a live read.',
        'no-key': 'A reader is set up but this browser has no key, so this is only what has been typed in by hand.',
        'bad-key': 'That key was refused. Showing only what has been typed in by hand.',
        'reader-error': 'The reader answered with an error. Showing only what has been typed in by hand.',
        'offline': 'Could not reach the reader. Showing only what has been typed in by hand.'
      }[DATA.reason] || 'Showing only what has been typed in by hand.';
      bits.push('<span>' + why + '</span>');
    }
    bits.push('<span style="margin-left:auto"><b>' + DATA.roster.length + '</b> students on the roster</span>');
    $('tv-src').innerHTML = bits.join('');

    var setup = $('tv-setup');
    if (live) { setup.innerHTML = ''; return; }
    var hasUrl = !!(typeof USMLE_CONFIG !== 'undefined' && USMLE_CONFIG.NBME_READ_URL);
    setup.innerHTML = hasUrl
      ? '<div class="tv-setup"><h3>Paste the read key</h3>' +
        '<p>Once per browser. It is kept on this device only and never committed, so a student ' +
        'reading the page source finds nothing.</p>' +
        '<form data-act="key"><input type="password" name="k" placeholder="read key" autocomplete="off" ' +
        'spellcheck="false" aria-label="Read key" /><button type="submit">Unlock</button></form></div>'
      : '<div class="tv-setup"><h3>The live reader is not set up yet</h3>' +
        '<p>Submissions are landing in the Carey Coombs sheet, but nothing reads them back yet. ' +
        'The code and the four setup steps are in <b>outputs/nbme/reader.gs</b>: deploy it, paste its ' +
        'URL into <b>js/config.js</b> as <b>NBME_READ_URL</b>, then come back here and enter the key. ' +
        'Until then this page shows the roster with everyone blank.</p></div>';
  }

  /* ---------------- the form picker ---------------- */
  function renderForms() {
    var now = new Date();
    $('tv-forms').innerHTML = forms.map(function (f) {
      var n = sentCount(f.id);
      var st = formStatus(f, now);
      var title = 'Sit ' + dayLabel(f.sit[0]) + ' or ' + dayLabel(f.sit[1]) +
                  ', corrections ' + dayLabel(f.week[0]) + ' to ' + dayLabel(f.week[1]);
      return '<button type="button" data-form="' + f.id + '" title="' + esc(title) + '" ' +
        'aria-pressed="' + (state.form === f.id ? 'true' : 'false') + '">' + f.n +
        (n ? '<span class="tv-dot" title="' + n + ' sent"></span>' : '') +
        (st === 'sitting' || st === 'correcting' ? '' : '') + '</button>';
    }).join('');
  }

  /* ---------------- 01 who has sent ---------------- */
  function renderRoster() {
    var f = forms.filter(function (x) { return x.id === state.form; })[0];
    if (!f) { $('tv-roster').innerHTML = ''; return; }

    var rows = C.rosterFor(f.id, DATA.roster, DATA.results, DATA.names);
    var sent = rows.filter(function (r) { return r.sent; });
    var missing = rows.filter(function (r) { return !r.sent; });

    // Blanks first, because the blanks are the work. Then weakest first.
    missing.sort(function (a, b) { return who(a).localeCompare(who(b)); });
    sent.sort(function (a, b) { return a.pct - b.pct; });

    var st = C.stats(sent.map(function (r) { return r.pct; }));
    var figs = '<div class="tv-figs">' +
      '<span class="tv-fig"><b>' + sent.length + '<small>/' + rows.length + '</small></b>' +
        '<span>Sent this form</span></span>' +
      (st ? '<span class="tv-fig"><b>' + st.median + '%</b><span>Median correct</span></span>' +
            '<span class="tv-fig"><b>' + st.lo + '&ndash;' + st.hi + '%</b><span>Range</span></span>' +
            '<span class="tv-fig"><b>' + st.mean + '%</b><span>Mean</span></span>'
          : '') +
      '</div>';

    var head = '<h2><i>01</i> Who has sent NBME ' + f.n + '</h2>' +
      '<p class="tv-note">Everyone on the roster is listed. The shaded rows have sent nothing for this ' +
      'form yet. Sit days were ' + dayLabel(f.sit[0]) + ' and ' + dayLabel(f.sit[1]) +
      '. Tap anyone who has sent to open their own report.</p>';

    var body = '<table class="tv-t"><thead><tr>' +
      '<th>Student</th><th>Sent</th><th class="num">Wrong</th><th class="num">Correct</th>' +
      '</tr></thead><tbody>' +
      missing.concat(sent).map(function (r) {
        if (!r.sent) {
          return '<tr class="is-missing"><td><span class="tv-who">' + esc(who(r)) + '</span>' +
            '<span class="tv-mail">' + esc(r.email) + '</span></td>' +
            '<td class="tv-when">Nothing yet</td><td class="num">&mdash;</td><td class="num">&mdash;</td></tr>';
        }
        return '<tr class="tv-open" tabindex="0" data-student="' + esc(r.email) + '">' +
          '<td><span class="tv-who">' + esc(who(r)) + (r.hand ? '<span class="tv-hand">by hand</span>' : '') + '</span>' +
          '<span class="tv-mail">' + esc(r.email) + '</span></td>' +
          '<td class="tv-when">' + esc(when(r.at)) + '</td>' +
          '<td class="num">' + r.wrong + '</td>' +
          '<td class="num"><span class="tv-pc">' + r.pct + '%</span>' +
            (r.score ? '<br><span class="tv-when">' + r.score + '</span>' : '') + '</td></tr>' +
          (state.open === r.email ? studentDetail(f, r) : '');
      }).join('') +
      '</tbody></table>';

    $('tv-roster').innerHTML = head + figs + body;
  }

  // One student, opened out: their weakest topics on this form and the
  // questions they actually missed, so a WhatsApp reply writes itself.
  function studentDetail(f, row) {
    var rec = (DATA.results[row.email] || {})[f.id];
    if (!rec) return '';
    var out = '<tr><td class="tv-detail" colspan="4">';
    out += '<h4>' + esc(who(row)) + ' on NBME ' + f.n + ': ' +
           (row.total - row.wrong) + ' of ' + row.total + ' correct</h4>';

    ['system', 'discipline'].forEach(function (axis) {
      var rep = NBMEPanel.topicReport(f.id, { wrong: rec.wrong }, axis);
      if (!rep) return;
      var rows = rep.rows.filter(function (r) { return !r.thin; })
                         .sort(function (a, b) { return a.pct - b.pct; })
                         .slice(0, 4);
      if (!rows.length) return;
      out += '<p class="tv-note" style="margin:' + (axis === 'system' ? '0' : '14px') + ' 0 8px">Weakest ' +
             (axis === 'system' ? 'systems' : 'disciplines') + '</p><div class="nbme-sys">';
      rows.forEach(function (r) {
        out += '<div class="nbme-sysrow band-' + r.band + '">' +
          '<span class="nbme-sysname">' + esc(r.label) + '</span>' +
          '<span class="nbme-meter" aria-hidden="true"><i style="width:' + Math.max(r.pct, 3) + '%"></i></span>' +
          '<span class="nbme-band">' + r.pct + '% &middot; ' + r.band.charAt(0).toUpperCase() + r.band.slice(1) + '</span>' +
          '<span class="nbme-say">' + r.right + ' of ' + r.total + ' on this form.</span>' +
          '</div>';
      });
      out += '</div>';
    });

    if (rec.wrong.length) {
      out += '<p class="tv-qlist"><b>Missed:</b> ' +
             rec.wrong.slice().sort(function (a, b) { return a - b; }).join(', ') + '</p>';
    }
    if (!NBMEPanel.topicReport(f.id, { wrong: rec.wrong }, 'system')) {
      out += '<p class="tv-note" style="margin:12px 0 0">No question map is typed up for NBME ' + f.n +
             ' yet, so there is no topic breakdown for this form. The raw score above is sound.</p>';
    }
    return out + '</td></tr>';
  }

  /* ---------------- 02 what the class got wrong ---------------- */
  function renderMissed() {
    var f = forms.filter(function (x) { return x.id === state.form; })[0];
    if (!f) { $('tv-missed').innerHTML = ''; return; }

    var mc = C.missCounts(f.id, DATA.results);
    var head = '<h2><i>02</i> What the class got wrong</h2>';

    if (!mc.submitters) {
      $('tv-missed').innerHTML = head +
        '<p class="tv-empty">Nobody has sent NBME ' + f.n + ' yet. Once they do, this becomes the ' +
        'teaching list: every question ranked by how many of them missed it.</p>';
      return;
    }

    var rows = mc.rows.filter(function (r) { return r.missed > 0; })
                      .sort(function (a, b) { return b.missed - a.missed || a.q - b.q; });
    if (!rows.length) {
      $('tv-missed').innerHTML = head + '<p class="tv-empty">Nobody missed a single question on this form. ' +
        'Worth checking the submissions are real before you believe it.</p>';
      return;
    }

    var shown = state.allMissed ? rows : rows.slice(0, 25);
    var worst = rows[0].missed;
    var halfOrMore = rows.filter(function (r) { return r.pct >= 50; }).length;

    var note = '<p class="tv-note">Ranked by how many of the <b>' + mc.submitters + '</b> submitters missed ' +
      'each question. ' + (halfOrMore
        ? '<b>' + halfOrMore + '</b> question' + (halfOrMore === 1 ? '' : 's') + ' beat half the class, which is where ' +
          'day one of corrections belongs.'
        : 'No single question beat half the class.') + '</p>';

    var list = '<div class="tv-miss">' + shown.map(function (r) {
      var topic = [r.system, r.discipline].filter(Boolean).join(' &middot; ');
      return '<div class="tv-mq">' + r.q + '</div>' +
        '<div class="tv-mbar"><i style="width:' + Math.max(Math.round(r.missed * 100 / worst), 3) + '%"></i>' +
        '<span>' + (topic || 'No map for this question yet') +
        (r.blocks.length ? ' &middot; <b>' + r.blocks.map(function (b) { return esc(b.label); }).join(', ') + '</b>' : '') +
        '</span></div>' +
        '<div class="tv-mn">' + r.missed + ' of ' + r.of + '<small>' + r.pct + '% missed it</small></div>';
    }).join('') + '</div>';

    var more = rows.length > 25
      ? '<p class="tv-note" style="margin-top:16px"><button type="button" data-act="allmissed" ' +
        'style="font:inherit;font-weight:700;cursor:pointer;background:none;border:none;padding:0;' +
        'color:var(--accent-deep);text-decoration:underline;text-underline-offset:3px">' +
        (state.allMissed ? 'Show the top 25 only' : 'Show all ' + rows.length + ' missed questions') +
        '</button></p>'
      : '';

    $('tv-missed').innerHTML = head + note + list + more;
  }

  /* ---------------- 03 the cohort by topic ---------------- */
  function renderTopics() {
    var f = forms.filter(function (x) { return x.id === state.form; })[0];
    if (!f) { $('tv-topics').innerHTML = ''; return; }

    var head = '<h2><i>03</i> The cohort by topic</h2>';
    var rep = C.cohortReport(f.id, DATA.results, state.axis);
    if (!rep) {
      $('tv-topics').innerHTML = head + '<p class="tv-empty">This needs submissions and a question map for ' +
        'NBME ' + f.n + '. Whichever is missing, it fills in by itself once both are there.</p>';
      return;
    }

    var toggle = '<div class="tv-toggle" role="group" aria-label="Which axis">' +
      '<button type="button" data-axis="system" aria-pressed="' + (state.axis === 'system') + '">By system</button>' +
      '<button type="button" data-axis="discipline" aria-pressed="' + (state.axis === 'discipline') + '">By discipline</button>' +
      '</div>';

    var note = '<p class="tv-note">Every submitter\'s questions pooled into one report, weakest first, from ' +
      '<b>' + rep.students + '</b> submission' + (rep.students === 1 ? '' : 's') + '. This is the class as a whole, ' +
      'not an average of averages, so a topic sitting in the weak band is one to teach rather than one that ' +
      'one student happened to fail.</p>';

    var solid = rep.rows.filter(function (r) { return !r.thin; })
                        .sort(function (a, b) { return a.pct - b.pct || a.label.localeCompare(b.label); });
    var thin = rep.rows.filter(function (r) { return r.thin; });

    var list = '<div class="nbme-sys">' + solid.map(function (r) {
      var word = r.band.charAt(0).toUpperCase() + r.band.slice(1);
      return '<div class="nbme-sysrow band-' + r.band + '">' +
        '<span class="nbme-sysname">' + esc(r.label) + '</span>' +
        '<span class="nbme-meter" aria-hidden="true"><i style="width:' + Math.max(r.pct, 3) + '%"></i></span>' +
        '<span class="nbme-band">' + r.pct + '% &middot; ' + word + '</span>' +
        '<span class="nbme-say">About <b>' + r.perStudent + '</b> questions each, and the class got <b>' +
          r.pct + '%</b> of them.' +
          (r.blocks && r.blocks.length ? ' Covered in ' + r.blocks.map(function (b) { return esc(b.label); }).join(', ') + '.' : '') +
        '</span></div>';
    }).join('') + '</div>';

    var thinNote = thin.length
      ? '<p class="tv-note" style="margin-top:16px">Too few questions on this form to call: ' +
        thin.sort(function (a, b) { return a.label.localeCompare(b.label); })
            .map(function (r) { return esc(r.label); }).join(', ') + '.</p>'
      : '';

    $('tv-topics').innerHTML = head + toggle + note + list + thinNote;
  }

  /* ---------------- 04 across the forms ---------------- */
  function renderMatrix() {
    var head = '<h2><i>04</i> Across the forms</h2>';
    var emails = DATA.roster.map(function (s) { return s.email; })
      .filter(function (e) { return DATA.results[e] && Object.keys(DATA.results[e]).length; });

    if (!emails.length) {
      $('tv-matrix').innerHTML = head + '<p class="tv-empty">One row per student, one column per form, ' +
        'as soon as the first results come in. This is the view that shows you who is climbing and who ' +
        'is going backwards.</p>';
      return;
    }

    function pctOf(e, fid) {
      var r = (DATA.results[e] || {})[fid];
      if (!r) return null;
      var total = r.total || 200;
      return Math.round((total - r.wrong.length) * 100 / total);
    }

    var rows = emails.map(function (e) {
      var vals = forms.map(function (f) { return pctOf(e, f.id); });
      var done = vals.filter(function (v) { return v !== null; });
      var delta = null;
      if (done.length > 1) delta = done[done.length - 1] - done[done.length - 2];
      var fromSub = (DATA.results[e][Object.keys(DATA.results[e])[0]] || {}).name;
      var nm = who({ name: fromSub || DATA.names[e] || '', email: e });
      return { email: e, name: nm, vals: vals, last: done[done.length - 1], delta: delta, n: done.length };
    }).sort(function (a, b) { return b.n - a.n || a.last - b.last; });

    var note = '<p class="tv-note">Percent correct, one row per student. The last column is the move from ' +
      'their form before, so a run of red is a conversation and not a number.</p>';

    var table = '<div class="tv-scroll"><table class="tv-m"><thead><tr><th>Student</th>' +
      forms.map(function (f) { return '<th>' + f.n + '</th>'; }).join('') +
      '<th>Move</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td>' + esc(r.name) + '</td>' +
          r.vals.map(function (v) {
            return v === null ? '<td class="blank">&middot;</td>' : '<td class="v">' + v + '</td>';
          }).join('') +
          '<td>' + (r.delta === null ? '<span class="blank">&middot;</span>'
            : r.delta > 0 ? '<span class="tv-up">+' + r.delta + '</span>'
            : r.delta < 0 ? '<span class="tv-down">' + r.delta + '</span>'
            : '0') + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    $('tv-matrix').innerHTML = head + note + table;
  }

  /* ---------------- plumbing ---------------- */
  function renderAll() {
    var f = forms.filter(function (x) { return x.id === state.form; })[0];
    if (f) {
      $('tv-h1').textContent = 'The cohort on NBME ' + f.n;
      document.title = 'Cohort · NBME ' + f.n;
    }
    renderSource(); renderForms(); renderRoster(); renderMissed(); renderTopics(); renderMatrix();
  }

  function load() {
    return Promise.all([C.loadResults(), C.loadRoster()]).then(function (out) {
      var res = out[0];
      DATA.results = res.results; DATA.names = res.names;
      DATA.source = res.source; DATA.at = res.at; DATA.reason = res.reason;
      DATA.roster = out[1];
      if (!state.form) state.form = pickForm();
      renderAll();
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-form]');
    if (btn) { state.form = btn.dataset.form; state.open = null; renderAll(); return; }

    var ax = e.target.closest('[data-axis]');
    if (ax) { state.axis = ax.dataset.axis; renderTopics(); return; }

    var act = e.target.closest('[data-act]');
    if (act && act.tagName !== 'FORM') {
      if (act.dataset.act === 'allmissed') { state.allMissed = !state.allMissed; renderMissed(); return; }
      if (act.dataset.act === 'refresh') { load(); return; }
      if (act.dataset.act === 'forget') { C.clearKey(); load(); return; }
    }

    var row = e.target.closest('[data-student]');
    if (row) {
      state.open = (state.open === row.dataset.student) ? null : row.dataset.student;
      renderRoster();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var row = e.target.closest('[data-student]');
    if (!row) return;
    e.preventDefault();
    state.open = (state.open === row.dataset.student) ? null : row.dataset.student;
    renderRoster();
  });

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-act="key"]');
    if (!form) return;
    e.preventDefault();
    var k = (form.querySelector('[name="k"]') || {}).value || '';
    if (!k.trim()) return;
    C.setKey(k);
    load();
  });

  load();
})();
