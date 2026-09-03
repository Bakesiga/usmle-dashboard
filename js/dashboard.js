/* ============================================================
   dashboard.js — hydrates the student dashboard from data.js.
   Today panel, sessions list, schedule grid, news, tab switching.
   ============================================================ */

(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------- Date helpers ----------------
  function pad(n) { return String(n).padStart(2, '0'); }
  function fmtDateLong(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
  function fmtDateShort(d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  function ymd(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function parseYMD(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  // Class window — 5:00 AM to 7:30 AM EAT.
  // For the prototype, treat the *local* clock as if it were EAT.
  function classWindow(forDate) {
    const start = new Date(forDate); start.setHours(5, 0, 0, 0);
    const end   = new Date(forDate); end.setHours(7, 30, 0, 0);
    return { start, end };
  }

  function classStatus(now, session) {
    if (!session) return { state: 'none' };
    const day = parseYMD(session.date);
    const { start, end } = classWindow(day);
    if (now < start) {
      const ms = start - now;
      const min = Math.floor(ms / 60000);
      if (min <= 30) return { state: 'soon', minutes: min };
      return { state: 'upcoming', minutes: min };
    }
    if (now <= end)   return { state: 'live', endsInMin: Math.ceil((end - now) / 60000) };
    return { state: 'ended', minutesAgo: Math.floor((now - end) / 60000) };
  }

  // ---------------- Find today's session ----------------
  // window.DASH_SELECTED_IDX, when set, overrides the auto-pick so prev/next
  // adjacent cards can navigate the Today panel without leaving the tab.
  function pickToday(now) {
    if (Number.isInteger(window.DASH_SELECTED_IDX)) {
      const i = window.DASH_SELECTED_IDX;
      if (i >= 0 && i < window.SESSIONS.length) {
        return { session: window.SESSIONS[i], idx: i, exact: ymd(now) === window.SESSIONS[i].date };
      }
    }
    const today = ymd(now);
    const exact = window.SESSIONS.find(s => s.date === today);
    if (exact) return { session: exact, idx: window.SESSIONS.indexOf(exact), exact: true };
    // not in window — pick the next upcoming
    const upcoming = window.SESSIONS.find(s => s.date >= today);
    if (upcoming) return { session: upcoming, idx: window.SESSIONS.indexOf(upcoming), exact: false };
    // course done — show last
    return { session: window.SESSIONS[window.SESSIONS.length - 1], idx: window.SESSIONS.length - 1, exact: false };
  }

  // ---------------- TODAY panel ----------------
  function renderToday() {
    const root = document.querySelector('[data-panel="today"]');
    if (!root) return;
    const now = window.getNow();
    const pick = pickToday(now);
    const s = pick.session;
    const meta = window.SUBJECT_META[s.subject];

    const card = root.querySelector('.today-card');
    // reset subject classes
    card.classList.remove('subject-cvs', 'subject-resp', 'subject-path', 'subject-epi');
    card.classList.add('subject-' + s.subject);

    root.querySelector('[data-today-day]').textContent  = 'Day ' + s.day;
    root.querySelector('[data-today-date]').textContent = fmtDateLong(parseYMD(s.date));
    root.querySelector('[data-today-title]').textContent = s.title;
    root.querySelector('[data-today-sub]').textContent   = s.sub;

    // Heading prefix says "Today's session" if it's the actual day, else "Up next"
    const headPrefix = root.querySelector('[data-today-prefix]');
    if (headPrefix) headPrefix.textContent = pick.exact ? "Today's session" : "Up next";

    // Status pill + countdown line
    const status = classStatus(now, s);
    const pill = root.querySelector('[data-live-pill]');
    pill.classList.remove('is-live', 'is-soon');
    let pillText = '';
    let countdownLine = '';
    if (status.state === 'live') {
      pill.classList.add('is-live');
      pillText = 'Class is live now';
      countdownLine = 'Class ends in ' + status.endsInMin + ' min · 5:00 – 7:30 AM EAT';
    } else if (status.state === 'soon') {
      pill.classList.add('is-soon');
      pillText = 'Starting soon';
      countdownLine = 'Class starts in ' + status.minutes + ' min';
    } else if (status.state === 'upcoming') {
      pillText = 'Not yet live';
      const h = Math.floor(status.minutes / 60);
      const m = status.minutes % 60;
      countdownLine = 'Class starts in ' + (h ? h + ' hr ' : '') + m + ' min';
    } else if (status.state === 'ended') {
      pillText = 'Class ended';
      const min = status.minutesAgo;
      const ago = min < 60 ? min + ' min' : Math.floor(min / 60) + ' hr ' + (min % 60) + ' min';
      countdownLine = 'Class ended ' + ago + ' ago. Recording uploading shortly.';
    } else {
      pillText = 'Scheduled';
      countdownLine = 'Class window: 5:00 – 7:30 AM EAT';
    }
    pill.querySelector('.lab').textContent = pillText;
    root.querySelector('[data-countdown-line]').textContent = countdownLine;

    // Live-pulse on primary join tile (the shared Zoom tile was removed, so
    // guard against it being absent).
    const joinTile = root.querySelector('.action-tile.primary');
    if (joinTile) joinTile.classList.toggle('live', status.state === 'live');

    // Dynamic resource tiles (one per item in session.resources)
    renderResourceTiles(root, s);

    // Course outline / FA read-ahead (one block per session that has one)
    renderOutline(root, s);

    // Adjacent cards — clickable to navigate the Today panel without leaving the tab
    const prev = window.SESSIONS[pick.idx - 1];
    const next = window.SESSIONS[pick.idx + 1];
    const prevEl = root.querySelector('[data-prev-card]');
    const nextEl = root.querySelector('[data-next-card]');
    // helper: label is "Previous · Day N" / "Next · Day N" except when the
    // user is on the auto-pick (then yesterday/tomorrow read naturally).
    function adjLabel(side, day) {
      if (pick.exact && side === 'prev') return 'Yesterday · Day ' + day;
      if (pick.exact && side === 'next') return 'Tomorrow · Day '  + day;
      return (side === 'prev' ? 'Previous · Day ' : 'Next · Day ') + day;
    }
    if (prev) {
      prevEl.style.display = '';
      prevEl.className = 'adj-card subject-' + prev.subject;
      prevEl.dataset.dir = 'prev';
      prevEl.dataset.sessionIdx = String(pick.idx - 1);
      prevEl.setAttribute('role', 'button');
      prevEl.setAttribute('href', '#today');
      prevEl.querySelector('[data-prev-title]').textContent = prev.title;
      prevEl.querySelector('[data-prev-label]').textContent = adjLabel('prev', prev.day);
    } else { prevEl.style.display = 'none'; }
    if (next) {
      nextEl.style.display = '';
      nextEl.className = 'adj-card subject-' + next.subject;
      nextEl.dataset.dir = 'next';
      nextEl.dataset.sessionIdx = String(pick.idx + 1);
      nextEl.setAttribute('role', 'button');
      nextEl.setAttribute('href', '#today');
      nextEl.querySelector('[data-next-title]').textContent = next.title;
      nextEl.querySelector('[data-next-label]').textContent = adjLabel('next', next.day);
    } else { nextEl.style.display = 'none'; }

    // Add a small "Back to today" link if the user is viewing a non-today session
    let backLink = root.querySelector('[data-back-to-today]');
    if (!pick.exact && Number.isInteger(window.DASH_SELECTED_IDX)) {
      if (!backLink) {
        backLink = document.createElement('a');
        backLink.setAttribute('data-back-to-today', '');
        backLink.href = '#today';
        backLink.className = 'back-to-today';
        backLink.textContent = '← Back to today';
        const card = root.querySelector('.today-card');
        if (card && card.parentNode) card.parentNode.insertBefore(backLink, card);
      }
      backLink.hidden = false;
    } else if (backLink) {
      backLink.hidden = true;
    }

    // Top bar Zoom chip removed (students use their own personal links).
    // Guard kept in case a future shared chip is reintroduced.
    const chip = document.querySelector('.chip-zoom');
    if (chip) chip.classList.toggle('live', status.state === 'live' || status.state === 'soon');

    // Side rail presence
    renderSideRail(now, pick);
  }

  // ---------------- Resource tiles (driven by session.resources) ----------------
  // Icons per resource kind — kept inline so we don't ship an extra SVG file
  const RESOURCE_ICONS = {
    highYield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>',
    flashcards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="13" height="14" rx="2"/><path d="M8 9h13v10a2 2 0 0 1-2 2H8a2 2 0 0 1 0-4z"/></svg>',
    slides:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    notes:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><line x1="8" y1="9"  x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
    link:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>'
  };

  function renderResourceTiles(root, session) {
    const actions = root.querySelector('[data-today-actions]');
    if (!actions) return;
    // Remove any tiles we previously appended
    actions.querySelectorAll('.action-tile.resource-tile').forEach(el => el.remove());
    const list = (session.resources || []);
    list.forEach(res => {
      const a = document.createElement('a');
      a.className = 'action-tile resource-tile';
      a.href = res.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML =
        '<span class="action-icon">' + (RESOURCE_ICONS[res.kind] || RESOURCE_ICONS.link) + '</span>' +
        '<span class="action-text">' + res.label +
          '<small>' + (res.meta || 'Open in Drive') + '</small>' +
        '</span>';
      actions.appendChild(a);
    });
  }

  // ---------------- Course outline / FA read-ahead ----------------
  function renderOutline(root, session) {
    const card = root.querySelector('[data-outline-card]');
    if (!card) return;
    const outline = session.outline;
    if (!outline || !Array.isArray(outline.items) || outline.items.length === 0) {
      card.hidden = true;
      return;
    }
    card.hidden = false;
    // Use the session's subject for the accent
    card.className = 'outline-card subject-' + session.subject;
    const eyebrow = card.querySelector('[data-outline-eyebrow]');
    if (eyebrow) {
      eyebrow.textContent = 'Read ahead · ' + (outline.edition || 'First Aid');
    }
    const intro = card.querySelector('[data-outline-intro]');
    if (intro) intro.textContent = outline.intro || '';
    const list = card.querySelector('[data-outline-list]');
    if (!list) return;
    list.innerHTML = '';
    outline.items.forEach((it, idx) => {
      const li = document.createElement('li');
      li.className = 'outline-item';
      const pagesHtml = it.pages
        ? '<span class="outline-pages">' + it.pages + '</span>'
        : '<span class="outline-pages outline-pages-blank">pp. — </span>';
      li.innerHTML =
        '<span class="outline-num">' + String(idx + 1).padStart(2, '0') + '</span>' +
        '<span class="outline-body">' +
          '<span class="outline-topic">' + it.topic + '</span>' +
          '<span class="outline-section">' + (it.section || '') + '</span>' +
        '</span>' +
        pagesHtml;
      list.appendChild(li);
    });
  }

  // ---------------- Side rail ----------------
  function renderSideRail(now, pick) {
    // Allan presence
    const status = classStatus(now, pick.session);
    const presence = document.querySelector('[data-allan-presence]');
    const online = status.state === 'live' || status.state === 'soon';
    presence.classList.toggle('online', online);
    presence.querySelector('[data-presence-text]').textContent =
      online ? 'Allan is here · in class' : 'Offline · next at 5:00 AM EAT';

  }

  // Greet the signed-in student by first name. Falls back gracefully so the
  // heading never reads "Welcome back, undefined".
  function paintWelcome() {
    var el = document.querySelector('[data-welcome-name]');
    if (!el) return;
    var name = '';
    try {
      var sess = JSON.parse(localStorage.getItem('usmle.session.v2') || 'null');
      if (sess) name = sess.name || '';
    } catch (e) {}
    if (!name || name.indexOf('@') > -1) { el.textContent = 'there'; return; }
    el.textContent = name.trim().split(/\s+/)[0];
  }

  // ---------------- SIDE RAIL: countdown + cohort position ----------------
  // Counts down to the next 05:00 East Africa Time (UTC+3 => 02:00 UTC).
  function nextClassUTC(now) {
    var t = new Date(now.getTime());
    // 02:00 UTC today
    var target = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), 2, 0, 0, 0);
    if (target <= now.getTime()) target += 86400000;   // already passed, aim at tomorrow
    return target;
  }

  function paintCountdown() {
    var el = document.querySelector('[data-countdown]');
    if (!el) return;
    var now = new Date();
    var ms = nextClassUTC(now) - now.getTime();
    if (ms < 0) ms = 0;
    var h = Math.floor(ms / 3600000);
    var m = Math.floor((ms % 3600000) / 60000);
    var sec = Math.floor((ms % 60000) / 1000);
    var pad2 = function (n) { return String(n).padStart(2, '0'); };
    el.textContent = pad2(h) + ':' + pad2(m) + ':' + pad2(sec);

    var lab = document.querySelector('[data-countdown-label]');
    if (lab) lab.textContent = (h < 12 ? 'Today' : 'Tomorrow') + ', 5:00 AM EAT';
  }

  function paintRailPosition() {
    var blocks = window.BLOCKS || [];
    var upcoming = window.UPCOMING || [];
    var curId = currentBlockId();
    var cur = blocks.filter(function (b) { return b.id === curId; })[0];

    var sessions = 0, systemsDone = 0;
    blocks.forEach(function (b) {
      if (blockRecordingsLocked(b)) return;
      sessions += visibleRecordings(b).length;
      if (b.id !== curId) systemsDone++;
    });

    var monthEl = document.querySelector('[data-rail-month]');
    var subsEl  = document.querySelector('[data-rail-subjects]');
    var sEl     = document.querySelector('[data-rail-sessions]');
    var yEl     = document.querySelector('[data-rail-systems]');

    if (monthEl) {
      var start = new Date(2026, 5, 1);                 // cohort began June 2026
      var now = window.getNow();
      var monthNo = (now.getFullYear() - start.getFullYear()) * 12
                  + (now.getMonth() - start.getMonth()) + 1;
      var names = ['January','February','March','April','May','June','July',
                   'August','September','October','November','December'];
      monthEl.innerHTML = 'Month ' + monthNo + ' &middot; ' + names[now.getMonth()];
    }
    if (subsEl) {
      // What is running now, or what is next if the block has not opened.
      var line = cur ? cur.label
               : (upcoming.length ? upcoming[0].label : '');
      var sameMonth = upcoming.filter(function (u, i) { return i < 4; })
                              .map(function (u) { return u.label; });
      subsEl.textContent = cur ? cur.label : sameMonth.join(', ');
    }
    if (sEl) sEl.textContent = sessions;
    if (yEl) yEl.textContent = systemsDone;
  }

  // Repaint the side rail on its own clock (the Today panel that used to drive
  // it was retired). Safe to call any time; all targets live in the side rail.
  function paintSideRail() {
    const now = window.getNow();
    renderSideRail(now, pickToday(now));
    paintRailPosition();
  }

  // ---------------- SESSIONS hierarchy (Block / Sub-block / Day) ----------------
  // currentBlockView: 'all' (Level 1), '<blockId>' (Level 2),
  // '<blockId>/<subBlockId>' (Level 3).
  let currentBlockView = 'all';

  function findBlock(blockId) {
    return (window.BLOCKS || []).find(b => b.id === blockId) || null;
  }
  function findSubBlock(block, subBlockId) {
    if (!block) return null;
    return (block.subBlocks || []).find(sb => sb.id === subBlockId) || null;
  }
  function dayRangeLabel(days) {
    if (!days || !days.length) return '';
    if (days.length === 1) return 'Day ' + days[0];
    return 'Days ' + days[0] + ' to ' + days[days.length - 1];
  }

  // ---- Per-student recording access gate ----
  // A student with an accessFrom date sees class recordings only from blocks
  // that start on/after that date (blocks before they joined are locked).
  // No accessFrom => full back-access (existing/founding students). Reads the
  // live allowlist cache first so an accessFrom edit applies on next load
  // without forcing a re-login; falls back to the stored session.
  function studentAccessFrom() {
    let email = null, fromSession = null;
    try {
      const sess = JSON.parse(localStorage.getItem('usmle.session.v2') || 'null');
      if (sess) { email = sess.email; fromSession = sess.accessFrom || null; }
    } catch (e) {}
    if (!email) return null;
    try {
      const cache = JSON.parse(sessionStorage.getItem('usmle.allowlist.v2') || '[]');
      const live = cache.find(s => s.email === email);
      if (live) return live.accessFrom || null;
    } catch (e) {}
    return fromSession;
  }
  // Mirror of studentAccessFrom for the optional whole-block lock.
  function studentLockedBlocks() {
    let email = null, fromSession = null;
    try {
      const sess = JSON.parse(localStorage.getItem('usmle.session.v2') || 'null');
      if (sess) { email = sess.email; fromSession = sess.lockedBlocks || null; }
    } catch (e) {}
    if (!email) return null;
    try {
      const cache = JSON.parse(sessionStorage.getItem('usmle.allowlist.v2') || '[]');
      const live = cache.find(s => s.email === email);
      if (live) return live.lockedBlocks || null;
    } catch (e) {}
    return fromSession;
  }
  // Mirror of studentAccessFrom for the whole-account recording pause. Unlike
  // lockedBlocks this needs no per-block list, so blocks added later are
  // covered automatically and the student keeps seeing the rest of the site.
  function studentRecordingsPaused() {
    let email = null, fromSession = false;
    try {
      const sess = JSON.parse(localStorage.getItem('usmle.session.v2') || 'null');
      if (sess) { email = sess.email; fromSession = !!sess.recordingsPaused; }
    } catch (e) {}
    if (!email) return false;
    try {
      const cache = JSON.parse(sessionStorage.getItem('usmle.allowlist.v2') || '[]');
      const live = cache.find(s => s.email === email);
      if (live) return !!live.recordingsPaused;
    } catch (e) {}
    return fromSession;
  }
  // The student's own Zoom join link, or null. Read live-first like the other
  // per-student fields, so issuing a link does not require them to sign out.
  function studentZoomLink() {
    let email = null, fromSession = null;
    try {
      const sess = JSON.parse(localStorage.getItem('usmle.session.v2') || 'null');
      if (sess) { email = sess.email; fromSession = sess.zoomLink || null; }
    } catch (e) {}
    if (!email) return null;
    try {
      const cache = JSON.parse(sessionStorage.getItem('usmle.allowlist.v2') || '[]');
      const live = cache.find(s => s.email === email);
      // Only let the live entry win when it actually carries a link. A cache
      // written by an older auth.js has no zoomLink field at all, and treating
      // that absence as "no link" would blank out a link we already hold.
      if (live && live.zoomLink) return live.zoomLink;
    } catch (e) {}
    return fromSession;
  }

  function blockRecordingsLocked(block) {
    if (studentRecordingsPaused()) return true;
    const locked = studentLockedBlocks();
    if (locked && block && locked.indexOf(block.id) !== -1) return true;
    const from = studentAccessFrom();
    return !!(from && block && block.start && block.start < from);
  }

  // Mirror of studentAccessFrom for the optional upper-bound date gate.
  function studentAccessUntil() {
    let email = null, fromSession = null;
    try {
      const sess = JSON.parse(localStorage.getItem('usmle.session.v2') || 'null');
      if (sess) { email = sess.email; fromSession = sess.accessUntil || null; }
    } catch (e) {}
    if (!email) return null;
    try {
      const cache = JSON.parse(sessionStorage.getItem('usmle.allowlist.v2') || '[]');
      const live = cache.find(s => s.email === email);
      if (live) return live.accessUntil || null;
    } catch (e) {}
    return fromSession;
  }
  // A recording dated after the cutoff is locked. Recordings without their
  // own "date" fall back to the block's start date, which only matters for
  // blocks whose entire run is unambiguously on one side of the cutoff.
  function recordingPastAccessUntil(block, rec) {
    const until = studentAccessUntil();
    if (!until) return false;
    const date = (rec && rec.date) ? rec.date : (block && block.start) || null;
    return !!(date && date > until);
  }

  // Optional per-recording gate. A student may be entitled to only some
  // recordings inside a block they can otherwise see (e.g. paid mid-block).
  // Returns a { blockId: [titleSubstring] } map, or null when there is no
  // filter. Blocks missing from the map are unrestricted.
  function studentOnlyRecordings() {
    let email = null, fromSession = null;
    try {
      const sess = JSON.parse(localStorage.getItem('usmle.session.v2') || 'null');
      if (sess) { email = sess.email; fromSession = sess.onlyRecordings || null; }
    } catch (e) {}
    if (!email) return null;
    try {
      const cache = JSON.parse(sessionStorage.getItem('usmle.allowlist.v2') || '[]');
      const live = cache.find(s => s.email === email);
      if (live) return live.onlyRecordings || null;
    } catch (e) {}
    return fromSession;
  }
  function blockRecordingList(block) {
    const out = [];
    ((block && block.subBlocks) || []).forEach(sb => {
      (sb.recordings || []).forEach(r => out.push(r));
    });
    return out;
  }
  function recordingLocked(block, rec) {
    if (blockRecordingsLocked(block)) return true;
    if (recordingPastAccessUntil(block, rec)) return true;
    const map = studentOnlyRecordings();
    if (!map || !block) return false;
    const rule = map[block.id];
    if (!rule) return false;
    // { from: "..." } => that recording and everything after it in the block,
    // so classes added later are picked up automatically.
    if (rule.from) {
      const list = blockRecordingList(block);
      const cut = list.findIndex(r => ((r && r.title) || '').indexOf(rule.from) !== -1);
      if (cut < 0) return false;
      const idx = list.indexOf(rec);
      return idx > -1 && idx < cut;
    }
    if (Array.isArray(rule) && rule.length) {
      const title = (rec && rec.title) ? rec.title : '';
      return !rule.some(t => title.indexOf(t) !== -1);
    }
    return false;
  }

  // Level 1: root grid of 4 Block tiles
  function renderBlocksRoot() {
    const root = document.querySelector('[data-blocks-root]');
    if (!root) return;
    const blocks = window.BLOCKS || [];
    const wrap = document.createElement('div');
    wrap.className = 'blocks-grid';
    blocks.forEach(b => {
      const dayCount = (b.dayRange ? (b.dayRange[1] - b.dayRange[0] + 1) : 0);
      const subCount = (b.subBlocks || []).length;
      const locked = blockRecordingsLocked(b);
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'block-tile subject-' + b.subject + (locked ? ' is-locked' : '');
      tile.dataset.blockId = b.id;
      const recCount = visibleRecordings(b).length;
      tile.innerHTML =
        '<span class="tile-count"><b>' + recCount + '</b><span>classes</span></span>' +
        '<span class="tile-name">' + esc(b.label) + '</span>' +
        '<span class="tile-range">' + esc(b.dateRange || '') +
          (locked ? ' <span class="lock-pill">locked</span>' : '') + '</span>' +
        '<span class="tile-open">Open system' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
        '</span>';
      wrap.appendChild(tile);
    });
    root.innerHTML = '';
    root.appendChild(wrap);
  }

  // Level 2: sub-block tiles for one Block
  function renderBlocksOfBlock(blockId) {
    const root = document.querySelector('[data-blocks-root]');
    if (!root) return;
    const block = findBlock(blockId);
    if (!block) { renderBlocksRoot(); return; }
    const locked = blockRecordingsLocked(block);

    const header = document.createElement('div');
    header.className = 'block-detail-head subject-' + block.subject;
    header.innerHTML =
      '<button type="button" class="block-back" data-back-target="all">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
        'Back to all blocks' +
      '</button>' +
      '<div class="block-detail-titlerow">' +
        '<span class="block-detail-badge">' + block.short + '</span>' +
        '<h2 class="block-detail-title">' + block.label + '</h2>' +
        '<span class="block-detail-range">' + block.dateRange + '</span>' +
      '</div>';

    const grid = document.createElement('div');
    grid.className = 'subblocks-grid';
    (block.subBlocks || []).forEach(sb => {
      const hasDays = sb.days && sb.days.length > 0;
      const recN = (sb.recordings || []).length;
      const resN = (sb.resources || []).length;
      const clickable = hasDays || recN > 0 || resN > 0;
      const el = document.createElement(clickable ? 'button' : 'div');
      if (clickable) el.type = 'button';
      el.className = 'subblock-tile subject-' + block.subject + (clickable ? '' : ' is-empty');
      if (clickable) {
        el.dataset.blockId = block.id;
        el.dataset.subBlockId = sb.id;
      }
      const bits = [];
      if (hasDays) bits.push(dayRangeLabel(sb.days) + ' · ' + sb.days.length + ' day' + (sb.days.length === 1 ? '' : 's'));
      else if (!recN && !resN) bits.push('Coming soon');
      if (recN) bits.push(recN + ' recording' + (recN === 1 ? '' : 's') + (locked ? ' (locked)' : ''));
      el.innerHTML =
        '<span class="subblock-title">' + sb.label + '</span>' +
        '<span class="subblock-meta">' + bits.join(' · ') + '</span>' +
        (clickable ?
          '<span class="subblock-chevron" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
          '</span>' : '');
      grid.appendChild(el);
    });

    root.innerHTML = '';
    root.appendChild(header);
    root.appendChild(grid);
  }

  // Level 3: day list for one sub-block
  function renderSubBlock(blockId, subBlockId) {
    const root = document.querySelector('[data-blocks-root]');
    if (!root) return;
    const block = findBlock(blockId);
    const sub = findSubBlock(block, subBlockId);
    if (!block || !sub) { renderBlocksRoot(); return; }

    const now = window.getNow();
    const todayStr = ymd(now);

    const header = document.createElement('div');
    header.className = 'block-detail-head subject-' + block.subject;
    header.innerHTML =
      '<button type="button" class="block-back" data-back-target="' + block.id + '">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
        'Back to ' + block.label +
      '</button>' +
      '<div class="block-detail-titlerow">' +
        '<span class="block-detail-badge">' + block.short + '</span>' +
        '<h2 class="block-detail-title">' + block.label + ' · ' + sub.label + '</h2>' +
        '<span class="block-detail-range">' + dayRangeLabel(sub.days) + '</span>' +
      '</div>';

    const list = document.createElement('div');
    list.className = 'subblock-days';

    (sub.days || []).forEach(dayNum => {
      const session = window.SESSIONS.find(s => s.day === dayNum);
      if (!session) return;
      const idx = window.SESSIONS.indexOf(session);
      let status = 'upcoming';
      if (session.date === todayStr) status = 'today';
      else if (session.date < todayStr) status = 'done';
      const d = parseYMD(session.date);
      const row = document.createElement('div');
      row.className = 'sess-row subject-' + session.subject + (status === 'today' ? ' today-row' : '');
      row.dataset.sessionIdx = idx;
      row.setAttribute('role', 'link');
      row.setAttribute('tabindex', '0');
      row.title = 'Day ' + session.day + ': ' + session.title;
      row.innerHTML =
        '<div class="sess-day"><span class="num">Day ' + session.day + '</span></div>' +
        '<div class="sess-date">' + fmtDateShort(d) + '</div>' +
        '<div class="sess-topic">' +
          '<small>' + window.SUBJECT_META[session.subject].name + '</small>' +
          '<strong>' + session.title + '</strong>' +
        '</div>' +
        '<div class="sess-status ' + status + '">' + status + '</div>';
      list.appendChild(row);
    });

    root.innerHTML = '';
    root.appendChild(header);
    root.appendChild(list);

    // Class recordings for this sub-block
    if (sub.recordings && sub.recordings.length > 0) {
      const recHeader = document.createElement('h3');
      recHeader.className = 'block-recordings-h';
      recHeader.textContent = 'Class recordings';
      root.appendChild(recHeader);

      const recList = document.createElement('div');
      recList.className = 'block-recordings-list subject-' + block.subject;
      sub.recordings.forEach(rec => {
        if (recordingLocked(block, rec)) {
          // Pre-join block: show the recording exists but lock it (no link).
          const card = document.createElement('div');
          card.className = 'block-recording-card is-locked';
          card.setAttribute('aria-disabled', 'true');
          card.innerHTML =
            '<span class="block-recording-icon">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
            '</span>' +
            '<div class="block-recording-body">' +
              '<span class="block-recording-title">' + rec.title + '</span>' +
              '<span class="block-recording-meta">Not included in your plan</span>' +
            '</div>';
          recList.appendChild(card);
        } else {
          const link = document.createElement('a');
          link.className = 'block-recording-card';
          link.href = rec.url;
          link.target = '_blank';
          link.rel = 'noopener';
          link.innerHTML =
            '<span class="block-recording-icon">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>' +
            '</span>' +
            '<div class="block-recording-body">' +
              '<span class="block-recording-title">' + rec.title + '</span>' +
              '<span class="block-recording-meta">Open recording on Zoom</span>' +
            '</div>';
          recList.appendChild(link);
        }
      });
      root.appendChild(recList);
    }

    // Resources for this sub-block (Drive folders, question banks, etc.)
    if (sub.resources && sub.resources.length > 0) {
      const resHeader = document.createElement('h3');
      resHeader.className = 'block-recordings-h';
      resHeader.textContent = 'Resources';
      root.appendChild(resHeader);

      const resListEl = document.createElement('div');
      resListEl.className = 'block-recordings-list subject-' + block.subject;
      sub.resources.forEach(r => {
        const link = document.createElement('a');
        link.className = 'block-recording-card';
        link.href = r.url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.innerHTML =
          '<span class="block-recording-icon">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' +
          '</span>' +
          '<div class="block-recording-body">' +
            '<span class="block-recording-title">' + r.label + '</span>' +
            '<span class="block-recording-meta">' + (r.meta || 'Open resource') + '</span>' +
          '</div>';
        resListEl.appendChild(link);
      });
      root.appendChild(resListEl);
    }
  }

  function renderSessions() {
    // Dispatch based on currentBlockView state
    if (currentBlockView === 'all') return renderBlocksRoot();
    const parts = currentBlockView.split('/');
    if (parts.length === 1) return renderBlocksOfBlock(parts[0]);
    return renderSubBlock(parts[0], parts[1]);
  }

  function setBlockView(view) {
    currentBlockView = view || 'all';
    renderSessions();
  }

  // Event delegation on the blocks-root container.
  function bindBlocksRoot() {
    const root = document.querySelector('[data-blocks-root]');
    if (!root) return;
    root.addEventListener('click', e => {
      // Back link
      const back = e.target.closest('[data-back-target]');
      if (back) {
        e.preventDefault();
        setBlockView(back.dataset.backTarget);
        return;
      }
      // Sub-block tile drill-in (Level 2 -> Level 3)
      const subTile = e.target.closest('.subblock-tile:not(.is-empty)');
      if (subTile && subTile.dataset.subBlockId) {
        e.preventDefault();
        setBlockView(subTile.dataset.blockId + '/' + subTile.dataset.subBlockId);
        return;
      }
      // Block tile drill-in (Level 1 -> Level 2)
      const blockTile = e.target.closest('.block-tile');
      if (blockTile && blockTile.dataset.blockId) {
        e.preventDefault();
        setBlockView(blockTile.dataset.blockId);
        return;
      }
      // Day row -> Today panel (handled here too so day clicks always work)
      const dayRow = e.target.closest('[data-session-idx]');
      if (dayRow) {
        e.preventDefault();
        const idx = parseInt(dayRow.dataset.sessionIdx, 10);
        if (Number.isInteger(idx)) jumpToSession(idx);
      }
    });
    root.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const dayRow = e.target.closest('[data-session-idx]');
      if (dayRow) {
        e.preventDefault();
        const idx = parseInt(dayRow.dataset.sessionIdx, 10);
        if (Number.isInteger(idx)) jumpToSession(idx);
      }
    });
  }

  // ---------------- PROGRESS ----------------
  // Derived entirely from BLOCKS, so it can never go stale the way the old
  // hardcoded June calendar did. Respects the same access gates as Sessions:
  // a locked block contributes nothing to the student's totals.
  // Recordings in a block this student is actually entitled to see.
  function visibleRecordings(block) {
    if (blockRecordingsLocked(block)) return [];
    var out = [];
    (block.subBlocks || []).forEach(function (sb) {
      (sb.recordings || []).forEach(function (r) {
        if (!recordingLocked(block, r)) out.push(r);
      });
    });
    return out;
  }

  // The block the cohort is currently in: latest block whose start has passed.
  function currentBlockId() {
    var today = ymd(window.getNow());
    var id = null;
    (window.BLOCKS || []).forEach(function (b) {
      if (b.start && b.start <= today) id = b.id;
    });
    return id;
  }

  // ---------------- MONTH PLAN ----------------
  // The landing view. One row per teaching day, grouped into blocks, with the
  // day the cohort is actually on marked. Purely derived from window.PLAN, so
  // rolling into October means replacing that object and nothing here.
  var WDAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  var WDAY_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MON_LONG = ['January','February','March','April','May','June','July',
                  'August','September','October','November','December'];

  function planDayParts(iso) {
    var p = iso.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return {
      num: +p[2],
      wday: WDAY[d.getDay()],
      wdayLong: WDAY_LONG[d.getDay()],
      month: MON_LONG[+p[1] - 1]
    };
  }

  function renderPlan() {
    var root = document.querySelector('[data-plan-root]');
    if (!root) return;
    var plan = window.PLAN;
    if (!plan || !plan.days || !plan.days.length) { root.innerHTML = ''; return; }

    var today = ymd(window.getNow());
    var days = plan.days;
    var first = days[0].date, last = days[days.length - 1].date;
    var done = 0;
    days.forEach(function (d) { if (d.date < today) done++; });

    var todayItem = null;
    days.forEach(function (d) { if (d.date === today) todayItem = d; });

    var html = '' +
      '<div class="plan-head">' +
        '<div class="plan-head-l">' +
          '<span class="plan-eyebrow">The month ahead</span>' +
          '<h2 class="plan-h">' + esc(plan.label) + '</h2>' +
        '</div>' +
        '<div class="plan-meter">' +
          '<span class="plan-meter-n">' + done + '<i>/' + days.length + '</i></span>' +
          '<span class="plan-meter-l">days behind us</span>' +
        '</div>' +
      '</div>';

    if (todayItem) {
      html += '<p class="plan-now"><span class="plan-now-tag">Today</span>' +
              esc(todayItem.title) + '</p>';
    } else if (today < first) {
      var f = planDayParts(first);
      html += '<p class="plan-now"><span class="plan-now-tag">Starts</span>' +
              f.wdayLong + ' ' + f.num + ' ' + f.month + ', with ' +
              esc(days[0].title) + '.</p>';
    } else if (today > last) {
      html += '<p class="plan-now"><span class="plan-now-tag">Done</span>' +
              esc(plan.label) + ' is complete.</p>';
    }

    (plan.blocks || []).forEach(function (b) {
      var items = days.filter(function (d) { return d.block === b.id; });
      if (!items.length) return;
      html += '<section class="plan-group plan-' + esc(b.id) + '">' +
                '<div class="plan-group-head">' +
                  '<span class="plan-rule"></span>' +
                  '<h3 class="plan-group-h">' + esc(b.label) + '</h3>' +
                  '<span class="plan-group-range">' + esc(b.range || '') + '</span>' +
                '</div><ol class="plan-list">';
      items.forEach(function (d) {
        var state = d.date < today ? 'is-done' : (d.date === today ? 'is-now' : '');
        var pt = planDayParts(d.date);
        html += '<li class="plan-row ' + state + '">' +
                  '<span class="plan-date"><b>' + pt.num + '</b><i>' + pt.wday + '</i></span>' +
                  '<span class="plan-title">' + esc(d.title) + '</span>' +
                  '<span class="plan-state">' + (d.date === today ? 'Today' : '') + '</span>' +
                '</li>';
      });
      html += '</ol></section>';
    });

    root.innerHTML = html;
  }

  function renderProgress() {
    var root = document.querySelector('[data-progress-root]');
    if (!root) return;
    var curId = currentBlockId();
    var blocks = window.BLOCKS || [];

    var totalAvail = 0, openBlocks = 0;
    var rows = blocks.map(function (b) {
      var locked = blockRecordingsLocked(b);
      var recs = visibleRecordings(b);
      if (!locked) { openBlocks++; totalAvail += recs.length; }
      return { b: b, locked: locked, total: recs.length };
    });

    var upcoming = window.UPCOMING || [];
    var coveredCount = 0;
    rows.forEach(function (r) { if (!r.locked && r.b.id !== curId) coveredCount++; });

    var upcoming = window.UPCOMING || [];
    var coveredCount = 0;
    rows.forEach(function (r) { if (!r.locked && r.b.id !== curId) coveredCount++; });

    var now = window.getNow();
    var mAbbr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][now.getMonth()];
    var cohortStart = new Date(2026, 5, 1);
    var monthNo = (now.getFullYear() - cohortStart.getFullYear()) * 12
                + (now.getMonth() - cohortStart.getMonth()) + 1;

    var html =
      '<div class="stat-row">' +
        '<div class="stat"><div class="stat-n">' + totalAvail + '</div>' +
          '<div class="stat-l">Class recordings in the archive</div></div>' +
        '<div class="stat"><div class="stat-n">' + coveredCount + '</div>' +
          '<div class="stat-l">Systems finished</div></div>' +
        '<div class="stat is-now"><div class="stat-n">' + mAbbr + '</div>' +
          '<div class="stat-l">Month ' + monthNo + ', running now</div></div>' +
      '</div>';

    html += '<h2 class="sec-h">Finished</h2><div class="fin-list">';
    rows.forEach(function (row) {
      var b = row.b;
      if (row.locked || b.id === curId) return;
      var days = b.dayRange ? (b.dayRange[1] - b.dayRange[0] + 1) : row.total;
      html +=
        '<div class="fin-row" data-goto-block="' + b.id + '" role="link" tabindex="0">' +
          '<span class="fin-check">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12.5 10 17.5 19 7"/></svg>' +
          '</span>' +
          '<span class="fin-body">' +
            '<span class="fin-name">' + esc(b.label) + '</span>' +
            '<span class="fin-meta">' + days + ' days &middot; ' + esc(b.dateRange || '') + '</span>' +
          '</span>' +
          '<svg class="fin-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</div>';
    });
    html += '</div>';

    // The system running right now, if it has opened.
    var cur = rows.filter(function (r) { return r.b.id === curId && !r.locked; })[0];
    if (cur) {
      html += '<h2 class="sec-h">Running now</h2><div class="fin-list">' +
        '<div class="fin-row is-now" data-goto-block="' + cur.b.id + '" role="link" tabindex="0">' +
          '<span class="fin-check is-now"><i></i></span>' +
          '<span class="fin-body">' +
            '<span class="fin-name">' + esc(cur.b.label) + '</span>' +
            '<span class="fin-meta">' + cur.total + ' classes so far &middot; ' + esc(cur.b.dateRange || '') + '</span>' +
          '</span>' +
          '<svg class="fin-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</div></div>';
    }

    if (upcoming.length) {
      html += '<h2 class="sec-h">Ahead</h2><div class="ahead-pills">';
      upcoming.forEach(function (u) {
        html += '<span class="ahead-pill">' + esc(u.label) + '</span>';
      });
      html += '</div>';
    }

    root.innerHTML = html;
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function bindLauncher() {
    document.querySelectorAll('[data-goto-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () { activateTab(btn.dataset.gotoTab); });
    });
  }

  function bindProgress() {
    var root = document.querySelector('[data-progress-root]');
    if (!root) return;
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-goto-block]');
      if (!t) return;
      activateTab('sessions');
      setBlockView(t.dataset.gotoBlock);
    });
  }

  // Kept so older call sites and the tweaks panel keep working.
  function renderCalendar() { renderProgress(); }

  // ---------------- TABS ----------------
  function activateTab(key) {
    document.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('active', t.dataset.tab === key));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === key));
    if (key === 'sessions')   { currentBlockView = 'all'; renderSessions(); }
    // Re-render on entry so a tab left open overnight rolls onto the new day.
    if (key === 'about')      renderPlan();
    if (key === 'progress')   renderProgress();
  }
  function bindTabs() {
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    });
  }

  // ---------------- Jump to a day from Sessions or Schedule ----------------
  function jumpToSession(idx) {
    if (!Number.isInteger(idx) || idx < 0 || idx >= window.SESSIONS.length) return;
    const session = window.SESSIONS[idx];
    // The Today panel was retired. Day clicks now deep-link into the Sessions
    // hierarchy: find the block + sub-block whose days[] holds this day and open it.
    let view = 'all';
    (window.BLOCKS || []).some(b =>
      (b.subBlocks || []).some(sb => {
        if ((sb.days || []).includes(session.day)) { view = b.id + '/' + sb.id; return true; }
        return false;
      })
    );
    document.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('active', t.dataset.tab === 'sessions'));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === 'sessions'));
    setBlockView(view);
    const panel = document.querySelector('[data-panel="sessions"]');
    if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function bindDayJumps() {
    // Sessions panel is handled in bindBlocksRoot (delegated on the new container).
    [['schedule', '[data-session-idx]']].forEach(([panelKey, selector]) => {
      const panel = document.querySelector(`[data-panel="${panelKey}"]`);
      if (!panel) return;
      panel.addEventListener('click', e => {
        const target = e.target.closest(selector);
        if (!target) return;
        if (e.target.closest('[data-filter]')) return; // don't hijack filter pills
        const idx = parseInt(target.dataset.sessionIdx, 10);
        if (Number.isInteger(idx)) jumpToSession(idx);
      });
      panel.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const target = e.target.closest(selector);
        if (!target) return;
        e.preventDefault();
        const idx = parseInt(target.dataset.sessionIdx, 10);
        if (Number.isInteger(idx)) jumpToSession(idx);
      });
    });
  }

  // ---------------- USER MENU ----------------
  function bindUserMenu() {
    const chip = document.querySelector('.user-chip');
    const menu = document.querySelector('.user-menu');
    if (!chip || !menu) return;
    chip.addEventListener('click', e => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', () => menu.classList.remove('open'));
  }

  // ---------------- Wire chip + action links ----------------
  function wireLinks() {
    const L = window.LINKS;
    // Each student gets their own Zoom join link when we have one, so the
    // button drops them straight into the class instead of the registration
    // form. Falls back to the shared registration URL for anyone not yet
    // registered. Same live-allowlist-then-session lookup as the access gates,
    // so a link added today works on their next load without a re-login.
    const personalZoom = studentZoomLink();
    document.querySelectorAll('[data-link="zoom"]').forEach(a => {
      a.href = personalZoom || L.zoom;
      if (personalZoom) a.setAttribute('data-personal', '');
    });
    document.querySelectorAll('[data-link="whatsapp"]').forEach(a => a.href = L.whatsapp);
    document.querySelectorAll('[data-link="ics"]').forEach(a => a.href = L.ics);
    document.querySelectorAll('[data-link="calendly"]').forEach(a => a.href = L.calendly);
  }

  // ---------------- Prev/Next session navigation on the Today panel ----------------
  // Click delegation so we don't have to rebind after every renderToday.
  function bindAdjacentNav() {
    const root = document.querySelector('[data-panel="today"]');
    if (!root) return;
    root.addEventListener('click', e => {
      const card = e.target.closest('[data-prev-card], [data-next-card]');
      const back = e.target.closest('[data-back-to-today]');
      if (back) {
        e.preventDefault();
        window.DASH_SELECTED_IDX = null;
        renderToday();
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (!card) return;
      const idxStr = card.dataset.sessionIdx;
      if (!idxStr) return;
      e.preventDefault();
      const idx = parseInt(idxStr, 10);
      if (Number.isInteger(idx) && idx >= 0 && idx < window.SESSIONS.length) {
        window.DASH_SELECTED_IDX = idx;
        renderToday();
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Expose for tweaks panel re-rendering
  window.__dashRerender = function () {
    renderSessions();
    renderCalendar();
    paintSideRail();
  };

  document.addEventListener('DOMContentLoaded', () => {
    wireLinks();
    paintWelcome();
    renderPlan();
    bindTabs();
    bindBlocksRoot();
    bindProgress();
    bindLauncher();
    bindUserMenu();
    bindDayJumps();
    renderSessions();
    renderCalendar();
    // Side rail: instructor presence. Repaint every
    // 30s so the presence state flips live as class start/end times pass.
    paintSideRail();
    setInterval(paintSideRail, 30000);
    paintCountdown();
    setInterval(paintCountdown, 1000);

    // The first pass above ran against whatever allowlist copy the device
    // already held. Once the fresh copy lands, apply it: the Zoom button picks
    // up a corrected personal link and the recording gates any changed access,
    // without the student needing to sign out and in.
    if (typeof USMLE_AUTH !== 'undefined' && USMLE_AUTH.ready && typeof USMLE_AUTH.ready.then === 'function') {
      USMLE_AUTH.ready.then(() => { wireLinks(); renderSessions(); }).catch(() => {});
    }
  });
})();
