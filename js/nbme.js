/* ============================================================
   nbme.js — the Carey Coombs scores and reports panel.

   One implementation, used by two pages:
     dashboard.html   the NBMEs tab
     carey-coombs.html the cohort's own front door

   Keeping it here stops the band thresholds and the topic join from
   drifting apart between the two.

   window.NBMEPanel.render(rootEl, { onBlock: fn })
   ============================================================ */
(function () {
  'use strict';

  function parseYMD(s) {
    var p = String(s).split('-').map(Number);
    return new Date(p[0], (p[1] || 1) - 1, p[2] || 1);
  }
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  var onBlock = null;

  function nbmeEmail() {
    try {
      var sess = JSON.parse(localStorage.getItem('usmle.session.v2') || 'null');
      return sess && sess.email ? String(sess.email).toLowerCase().trim() : null;
    } catch (e) { return null; }
  }

  // This student's results, or an empty object before anything is entered.
  function nbmeResults() {
    var N = window.NBME || {};
    var email = nbmeEmail();
    if (!email || !N.results) return {};
    return N.results[email] || {};
  }

  // Status of one form relative to today: done | sitting | correcting | ahead
  function nbmeFormStatus(form, now, res) {
    var sitEnd = parseYMD(form.sit[1]);
    var wkStart = parseYMD(form.week[0]);
    var wkEnd = parseYMD(form.week[1]);
    var t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (t < parseYMD(form.sit[0])) return 'ahead';
    if (t <= sitEnd) return 'sitting';
    if (t >= wkStart && t <= wkEnd) return 'correcting';
    return 'done';
  }

  function nbmeDayLabel(ymdStr) {
    var d = parseYMD(ymdStr);
    var mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
    return d.getDate() + ' ' + mon;
  }

  // ---- Score trend ------------------------------------------------
  // One series, so no legend: the heading names it. Target line is a
  // recessive reference, not a second series.
  function nbmeTrendSvg(forms, pts, target, unit) {
    if (!pts || !pts.length) return '';
    unit = unit || '';

    var W = 680, H = 210, padL = 48, padR = 18, padT = 20, padB = 34;
    var vals = pts.map(function (p) { return p.v; });
    if (target) vals = vals.concat([target]);
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    var step = unit === '%' ? 10 : 20;
    lo = Math.floor((lo - step * 0.6) / step) * step;
    hi = Math.ceil((hi + step * 0.6) / step) * step;
    if (unit === '%') { lo = Math.max(0, lo); hi = Math.min(100, hi); }
    if (hi - lo < step * 2) hi = lo + step * 2;

    var x = function (i) { return padL + (forms.length === 1 ? 0 : i * (W - padL - padR) / (forms.length - 1)); };
    var y = function (v) { return padT + (hi - v) * (H - padT - padB) / (hi - lo); };

    var out = '<svg class="nbme-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Your ' +
      (unit === '%' ? 'percent correct' : 'NBME score') + ' across the forms you have sat">';

    for (var g = lo; g <= hi; g += step) {
      out += '<line class="nb-grid" x1="' + padL + '" y1="' + y(g) + '" x2="' + (W - padR) + '" y2="' + y(g) + '"/>' +
             '<text class="nb-ax" x="' + (padL - 9) + '" y="' + (y(g) + 4) + '" text-anchor="end">' + g + unit + '</text>';
    }

    if (target) {
      out += '<line class="nb-target" x1="' + padL + '" y1="' + y(target) + '" x2="' + (W - padR) + '" y2="' + y(target) + '"/>' +
             '<text class="nb-target-t" x="' + (W - padR) + '" y="' + (y(target) - 7) + '" text-anchor="end">Target ' + target + '</text>';
    }

    forms.forEach(function (f, i) {
      out += '<text class="nb-ax" x="' + x(i) + '" y="' + (H - 11) + '" text-anchor="middle">' + f.n + '</text>';
    });

    if (pts.length > 1) {
      out += '<path class="nb-line" d="' +
        pts.map(function (p, k) { return (k ? 'L' : 'M') + x(p.i) + ' ' + y(p.v); }).join(' ') + '"/>';
    }

    pts.forEach(function (p, k) {
      var last = (k === pts.length - 1);
      out += '<circle class="nb-dot' + (last ? ' is-last' : '') + '" cx="' + x(p.i) + '" cy="' + y(p.v) +
             '" r="' + (last ? 7 : 5) + '"><title>NBME ' + p.n + ': ' + p.v + unit + '</title></circle>';
      if (last || k === 0) {
        var first = (k === 0 && !last);
        out += '<text class="nb-val" x="' + (x(p.i) + (first ? 9 : 0)) + '" y="' + (y(p.v) - 14) +
               '" text-anchor="' + (first ? 'start' : 'middle') + '">' + p.v + unit + '</text>';
      }
    });

    return out + '</svg>';
  }

  // ---- Topic report ------------------------------------------------
  // Joins what the student got wrong against the question->topic map.
  // Everything the student does not list counts as correct, so their
  // form is just the misses.
  function nbmeTopicReport(formId, rec) {
    var N = window.NBME || {};
    var map = (N.map || {})[formId];
    if (!map || !map.length) return null;
    if (!rec || !Array.isArray(rec.wrong)) return null;

    var missed = {};
    rec.wrong.forEach(function (n) { missed[Number(n)] = true; });

    var agg = {};
    map.forEach(function (topic, i) {
      if (!topic) return;
      if (!agg[topic]) agg[topic] = { id: topic, total: 0, right: 0, missed: [] };
      agg[topic].total++;
      if (missed[i + 1]) agg[topic].missed.push(i + 1); else agg[topic].right++;
    });

    var bands = N.bands || { strong: 75, borderline: 60 };
    var minN = N.minTopicN || 4;
    var blocks = window.BLOCKS || [];
    var byId = {}; blocks.forEach(function (b) { byId[b.id] = b; });

    var rows = Object.keys(agg).map(function (id) {
      var a = agg[id];
      a.pct = a.total ? Math.round(a.right * 100 / a.total) : 0;
      a.thin = a.total < minN;
      a.band = a.pct >= bands.strong ? 'strong' : (a.pct >= bands.borderline ? 'borderline' : 'weak');
      a.label = (byId[id] && byId[id].label) || id;
      a.known = !!byId[id];
      return a;
    });

    var totalQ = map.filter(Boolean).length;
    var rightQ = totalQ - rec.wrong.filter(function (n) { return map[Number(n) - 1]; }).length;

    return {
      rows: rows,
      totalQ: totalQ,
      rightQ: rightQ,
      pct: totalQ ? Math.round(rightQ * 100 / totalQ) : 0
    };
  }

  // The most recent form that has both a map and a submission.
  function nbmeLatestReport(forms, res) {
    for (var i = forms.length - 1; i >= 0; i--) {
      var rep = nbmeTopicReport(forms[i].id, res[forms[i].id]);
      if (rep) return { form: forms[i], rep: rep };
    }
    return null;
  }

  // ---- Per-topic evaluation ---------------------------------------
  // Band is carried by bar length, chip depth on a single-hue ramp,
  // and the word. Never by hue alone: the system's sage and terracotta
  // sit at deltaE 4.8 under protanopia and are not separable.
  var NBME_RANK = { strong: 1, borderline: 2, weak: 3 };

  function nbmeSystemsBlock(res, forms) {
    var latest = nbmeLatestReport(forms, res);
    if (!latest) return '';

    var solid = latest.rep.rows.filter(function (r) { return !r.thin; });
    var thin  = latest.rep.rows.filter(function (r) { return r.thin; });
    if (!solid.length && !thin.length) return '';

    // Weakest first: this is a to-do list, not an alphabet.
    solid.sort(function (a, b) {
      return (NBME_RANK[b.band] - NBME_RANK[a.band]) || (a.pct - b.pct) || a.label.localeCompare(b.label);
    });

    var html = '<h2 class="sec-h">Your topics after NBME ' + latest.form.n + '</h2>' +
      '<p class="nbme-note">Weakest first, out of the questions on this form. ' +
      'Anything you are losing marks on links to the classes that cover it.</p>' +
      '<div class="nbme-sys">';

    solid.forEach(function (r) {
      var word = r.band.charAt(0).toUpperCase() + r.band.slice(1);
      html += '<div class="nbme-sysrow band-' + r.band + '"' +
            (r.known ? ' data-goto-block="' + r.id + '" role="link" tabindex="0"' : '') + '>' +
          '<span class="nbme-sysname">' + esc(r.label) +
            '<span class="nbme-frac">' + r.right + '/' + r.total + '</span></span>' +
          '<span class="nbme-meter" aria-hidden="true"><i style="width:' + Math.max(r.pct, 3) + '%"></i></span>' +
          '<span class="nbme-band">' + r.pct + '% &middot; ' + word + '</span>' +
        '</div>';
    });
    html += '</div>';

    if (thin.length) {
      thin.sort(function (a, b) { return a.label.localeCompare(b.label); });
      html += '<p class="nbme-note nbme-thin">Too few questions on this form to call: ' +
        thin.map(function (r) { return esc(r.label) + ' (' + r.right + '/' + r.total + ')'; }).join(', ') +
        '.</p>';
    }
    return html;
  }

  function renderNBME(root) {
    if (!root) return;
    var N = window.NBME;
    if (!N || !N.forms) { root.innerHTML = ''; return; }

    var now = window.getNow();
    var res = nbmeResults();
    var forms = N.forms;

    // A form counts as sat once a submission exists, with or without a
    // 3-digit score. Plot 3-digit scores if any form carries one;
    // otherwise plot percent correct. Never both on one axis.
    var anyScore = forms.some(function (f) { return res[f.id] && typeof res[f.id].score === 'number'; });
    var series = [];
    forms.forEach(function (f, i) {
      var r = res[f.id];
      if (!r) return;
      var v = null;
      if (anyScore) {
        if (typeof r.score === 'number') v = r.score;
      } else {
        var rep = nbmeTopicReport(f.id, r);
        if (rep) v = rep.pct;
        else if (Array.isArray(r.wrong)) v = Math.round((200 - r.wrong.length) * 100 / 200);
      }
      if (v !== null) series.push({ i: i, n: f.n, v: v });
    });

    var satCount = forms.filter(function (f) { return !!res[f.id]; }).length;
    var latest = series.length ? series[series.length - 1].v : null;
    var prev   = series.length > 1 ? series[series.length - 2].v : null;
    var delta  = (latest !== null && prev !== null) ? latest - prev : null;
    var unit   = anyScore ? '' : '%';

    // --- Headline -------------------------------------------------
    var html = '<div class="stat-row">';
    if (latest !== null) {
      html += '<div class="stat is-now"><div class="stat-n">' + latest + unit + '</div>' +
              '<div class="stat-l">' + (anyScore ? 'Your latest NBME' : 'Correct on your latest form') + '</div></div>' +
              '<div class="stat"><div class="stat-n">' +
              (delta === null ? '&mdash;' : (delta > 0 ? '+' + delta : String(delta))) + (delta === null ? '' : unit) + '</div>' +
              '<div class="stat-l">' + (delta === null ? 'No earlier form yet' : 'Since the form before') + '</div></div>';
    } else {
      html += '<div class="stat is-now"><div class="stat-n">8</div>' +
              '<div class="stat-l">Forms in this phase</div></div>';
    }
    html += '<div class="stat"><div class="stat-n">' + satCount + '<span class="stat-of">/8</span></div>' +
            '<div class="stat-l">Sat so far</div></div></div>';

    // --- Where we are this week ----------------------------------
    var live = null;
    forms.forEach(function (f) {
      var st = nbmeFormStatus(f, now, res);
      if (st === 'sitting' || st === 'correcting') live = { f: f, st: st };
    });
    var nextUp = null;
    for (var i = 0; i < forms.length; i++) {
      if (nbmeFormStatus(forms[i], now, res) === 'ahead') { nextUp = forms[i]; break; }
    }
    if (live) {
      html += '<div class="nbme-now">' +
        '<span class="nbme-now-k">This week</span>' +
        '<span class="nbme-now-v">' +
          (live.st === 'sitting'
            ? 'Sit <b>NBME ' + live.f.n + '</b> on your own. 200 questions, 4 blocks of 50, timed. There is no class today.'
            : 'Corrections for <b>NBME ' + live.f.n + '</b>, ' + nbmeDayLabel(live.f.week[0]) + ' to ' + nbmeDayLabel(live.f.week[1]) + '. Send me your report if you have not.') +
        '</span></div>';
    } else if (nextUp) {
      html += '<div class="nbme-now">' +
        '<span class="nbme-now-k">Next up</span>' +
        '<span class="nbme-now-v"><b>NBME ' + nextUp.n + '</b>, sit it ' +
          nbmeDayLabel(nextUp.sit[0]) + ' or ' + nbmeDayLabel(nextUp.sit[1]) + '.</span></div>';
    }

    // --- Link to the marking form ---------------------------------
    html += '<a class="nbme-cta" href="nbme-form.html">' +
      '<span>Mark an NBME you have sat</span>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
      '</a>';

    // --- Trend ----------------------------------------------------
    var chart = nbmeTrendSvg(forms, series, anyScore ? (N.target || 196) : null, unit);
    if (chart) {
      html += '<h2 class="sec-h">' + (anyScore ? 'Your scores' : 'Your percent correct') + '</h2>' +
              '<div class="nbme-chart-wrap">' + chart + '</div>';
    }

    // --- Systems --------------------------------------------------
    html += nbmeSystemsBlock(res, forms);

    // --- The eight forms ------------------------------------------
    html += '<h2 class="sec-h">All eight forms</h2><div class="fin-list nbme-list">';
    forms.forEach(function (f) {
      var st = nbmeFormStatus(f, now, res);
      var r = res[f.id];
      var hasScore = r && typeof r.score === 'number';
      var repq = r ? nbmeTopicReport(f.id, r) : null;
      var pctq = repq ? repq.pct : (r && Array.isArray(r.wrong) ? Math.round((200 - r.wrong.length) * 100 / 200) : null);
      var meta = 'Sit ' + nbmeDayLabel(f.sit[0]) + ' or ' + nbmeDayLabel(f.sit[1]) +
                 ' &middot; corrections ' + nbmeDayLabel(f.week[0]) + ' to ' + nbmeDayLabel(f.week[1]);
      var mark = hasScore
        ? '<span class="nbme-score">' + r.score + '</span>'
        : pctq !== null
        ? '<span class="nbme-score">' + pctq + '%</span>'
        : '<span class="nbme-state is-' + st + '">' +
            (st === 'ahead' ? 'Ahead' : st === 'sitting' ? 'Sit it now' : st === 'correcting' ? 'In corrections' : 'Awaiting your report') +
          '</span>';
      html += '<div class="fin-row nbme-row' + (st === 'sitting' || st === 'correcting' ? ' is-now' : '') + '">' +
          '<span class="nbme-num">' + f.n + '</span>' +
          '<span class="fin-body">' +
            '<span class="fin-name">NBME ' + f.n + '</span>' +
            '<span class="fin-meta">' + meta + '</span>' +
          '</span>' + mark +
        '</div>';
    });
    html += '</div>';

    if (!satCount) {
      html += '<p class="nbme-note nbme-foot">Your scores appear here once you send me each report. ' +
              'I will add the per-system breakdown at the same time.</p>';
    }

    root.innerHTML = html;
  }

  function bindNbme(root) {
    if (!root) return;
    function go(t) { if (onBlock) onBlock(t.dataset.gotoBlock); }
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-goto-block]');
      if (t) go(t);
    });
    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var t = e.target.closest('[data-goto-block]');
      if (t) { e.preventDefault(); go(t); }
    });
  }


  window.NBMEPanel = {
    render: function (root, opts) {
      opts = opts || {};
      onBlock = opts.onBlock || null;
      renderNBME(root);
      if (!root.__nbmeBound) { bindNbme(root); root.__nbmeBound = true; }
    },
    topicReport: nbmeTopicReport
  };
})();
