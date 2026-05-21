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
  function pickToday(now) {
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

    // Live-pulse on primary join tile
    const joinTile = root.querySelector('.action-tile.primary');
    joinTile.classList.toggle('live', status.state === 'live');

    // Adjacent cards
    const prev = window.SESSIONS[pick.idx - 1];
    const next = window.SESSIONS[pick.idx + 1];
    const prevEl = root.querySelector('[data-prev-card]');
    const nextEl = root.querySelector('[data-next-card]');
    if (prev) {
      prevEl.style.display = '';
      prevEl.className = 'adj-card subject-' + prev.subject;
      prevEl.dataset.dir = 'prev';
      prevEl.querySelector('[data-prev-title]').textContent = prev.title;
      prevEl.querySelector('[data-prev-label]').textContent = 'Yesterday · Day ' + prev.day;
    } else { prevEl.style.display = 'none'; }
    if (next) {
      nextEl.style.display = '';
      nextEl.className = 'adj-card subject-' + next.subject;
      nextEl.dataset.dir = 'next';
      nextEl.querySelector('[data-next-title]').textContent = next.title;
      nextEl.querySelector('[data-next-label]').textContent = 'Tomorrow · Day ' + next.day;
    } else { nextEl.style.display = 'none'; }

    // Top bar chip — turn green when soon/live
    const chip = document.querySelector('.chip-zoom');
    chip.classList.toggle('live', status.state === 'live' || status.state === 'soon');

    // Side rail presence
    renderSideRail(now, pick);
  }

  // ---------------- Side rail ----------------
  function renderSideRail(now, pick) {
    // progress
    const counts = { cvs: 0, resp: 0, epi: 0, path: 0 };
    window.SESSIONS.forEach(s => {
      const d = parseYMD(s.date);
      d.setHours(7, 30, 0, 0);
      if (d < now) counts[s.subject]++;
    });
    Object.keys(counts).forEach(key => {
      const done = counts[key];
      const total = window.SUBJECT_META[key].count;
      const pct = Math.round((done / total) * 100);
      const el = document.querySelector('[data-pie="' + key + '"]');
      if (!el) return;
      el.style.setProperty('--pct', pct);
      el.querySelector('.pie-val').textContent = done + '/' + total;
    });

    // Allan presence
    const status = classStatus(now, pick.session);
    const presence = document.querySelector('[data-allan-presence]');
    const online = status.state === 'live' || status.state === 'soon';
    presence.classList.toggle('online', online);
    presence.querySelector('[data-presence-text]').textContent =
      online ? 'Allan is here · in class' : 'Offline · next at 5:00 AM EAT';

    // mini-cal — 7 days starting today
    const cal = document.querySelector('[data-mini-cal]');
    cal.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const ymdStr = ymd(d);
      const session = window.SESSIONS.find(s => s.date === ymdStr);
      const cell = document.createElement('div');
      cell.className = 'cell' + (i === 0 ? ' today' : '');
      const dow = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      cell.innerHTML = '<span>' + dow.toUpperCase() + '</span><span class="d">' + d.getDate() + '</span>';
      if (session) {
        cell.classList.add('subject-' + session.subject);
        const dot = document.createElement('span'); dot.className = 'sub-dot'; cell.appendChild(dot);
      }
      cal.appendChild(cell);
    }
  }

  // ---------------- SESSIONS list ----------------
  let activeFilter = 'all';
  function renderSessions() {
    const root = document.querySelector('[data-sessions-table]');
    if (!root) return;
    const now = window.getNow();
    const todayStr = ymd(now);
    root.innerHTML = '';
    window.SESSIONS
      .filter(s => activeFilter === 'all' || s.subject === activeFilter)
      .forEach(s => {
        const d = parseYMD(s.date);
        let status = 'upcoming';
        if (s.date === todayStr) status = 'today';
        else if (s.date < todayStr) status = 'done';
        const row = document.createElement('div');
        row.className = 'sess-row subject-' + s.subject + (status === 'today' ? ' today-row' : '');
        row.innerHTML = `
          <div class="sess-day"><span class="num">Day ${s.day}</span></div>
          <div class="sess-date">${fmtDateShort(d)}</div>
          <div class="sess-topic">
            <small>${window.SUBJECT_META[s.subject].name}</small>
            <strong>${s.title}</strong>
          </div>
          <div class="sess-status ${status}">${status}</div>
        `;
        root.appendChild(row);
      });
  }

  function bindFilters() {
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b === btn));
        renderSessions();
      });
    });
  }

  // ---------------- SCHEDULE (June grid) ----------------
  function renderCalendar() {
    const grid = document.querySelector('[data-cal-grid]');
    if (!grid) return;
    grid.innerHTML = '';
    const now = window.getNow();
    const todayStr = ymd(now);
    const dows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dows.forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'cal-dow';
      cell.textContent = d;
      grid.appendChild(cell);
    });
    // June 1 2026 = Monday (good!)
    const first = new Date(2026, 5, 1);
    let dow = (first.getDay() + 6) % 7; // 0 = Mon
    for (let i = 0; i < dow; i++) {
      const blank = document.createElement('div');
      blank.className = 'cal-day empty';
      grid.appendChild(blank);
    }
    for (let day = 1; day <= 30; day++) {
      const dateObj = new Date(2026, 5, day);
      const ymdStr = ymd(dateObj);
      const session = window.SESSIONS.find(s => s.date === ymdStr);
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      if (session) cell.classList.add('has-class', 'subject-' + session.subject);
      if (ymdStr === todayStr) cell.classList.add('today');
      cell.innerHTML = `<span class="d">${day}</span>` + (session ? `<span class="t">${session.title}</span>` : '');
      grid.appendChild(cell);
    }
  }

  // ---------------- TABS ----------------
  function bindTabs() {
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab;
        document.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('active', t === tab));
        document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === key));
        if (key === 'sessions')   renderSessions();
        if (key === 'schedule')   renderCalendar();
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
    document.querySelectorAll('[data-link="zoom"]').forEach(a => a.href = L.zoom);
    document.querySelectorAll('[data-link="whatsapp"]').forEach(a => a.href = L.whatsapp);
    document.querySelectorAll('[data-link="ics"]').forEach(a => a.href = L.ics);
    document.querySelectorAll('[data-link="calendly"]').forEach(a => a.href = L.calendly);
  }

  // Expose for tweaks panel re-rendering
  window.__dashRerender = function () {
    renderToday();
    renderSessions();
    renderCalendar();
  };

  document.addEventListener('DOMContentLoaded', () => {
    wireLinks();
    bindTabs();
    bindFilters();
    bindUserMenu();
    renderToday();
    renderSessions();
    renderCalendar();
    // tick once a minute so the countdown stays fresh
    setInterval(renderToday, 30000);
  });
})();
