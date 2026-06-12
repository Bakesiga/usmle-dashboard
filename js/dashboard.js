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

    // Live-pulse on primary join tile
    const joinTile = root.querySelector('.action-tile.primary');
    joinTile.classList.toggle('live', status.state === 'live');

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

    // Top bar chip — turn green when soon/live
    const chip = document.querySelector('.chip-zoom');
    chip.classList.toggle('live', status.state === 'live' || status.state === 'soon');

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
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'block-tile subject-' + b.subject;
      tile.dataset.blockId = b.id;
      tile.innerHTML =
        '<span class="block-tile-badge">' + b.short + '</span>' +
        '<span class="block-tile-body">' +
          '<span class="block-tile-eyebrow">' + b.dateRange + '</span>' +
          '<span class="block-tile-title">' + b.label + '</span>' +
          '<span class="block-tile-meta">' + dayCount + ' days · ' + subCount + ' sub-blocks</span>' +
        '</span>' +
        '<span class="block-tile-chevron" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
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
      const empty = !sb.days || sb.days.length === 0;
      const el = document.createElement(empty ? 'div' : 'button');
      if (!empty) el.type = 'button';
      el.className = 'subblock-tile subject-' + block.subject + (empty ? ' is-empty' : '');
      if (!empty) {
        el.dataset.blockId = block.id;
        el.dataset.subBlockId = sb.id;
      }
      const metaText = empty ? 'Coming soon' : (dayRangeLabel(sb.days) + ' · ' + sb.days.length + ' day' + (sb.days.length === 1 ? '' : 's'));
      el.innerHTML =
        '<span class="subblock-title">' + sb.label + '</span>' +
        '<span class="subblock-meta">' + metaText + '</span>' +
        (empty ? '' :
          '<span class="subblock-chevron" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
          '</span>');
      grid.appendChild(el);
    });

    root.innerHTML = '';
    root.appendChild(header);
    root.appendChild(grid);

    // Class recordings section (if present)
    if (block.recordings && block.recordings.length > 0) {
      const recHeader = document.createElement('h3');
      recHeader.className = 'block-recordings-h';
      recHeader.textContent = 'Class recordings';
      root.appendChild(recHeader);

      const recList = document.createElement('div');
      recList.className = 'block-recordings-list subject-' + block.subject;
      block.recordings.forEach(rec => {
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
      });
      root.appendChild(recList);
    }
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
      row.title = 'Open Day ' + session.day + ' in Today panel';
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
      if (session) {
        cell.classList.add('has-class', 'subject-' + session.subject);
        cell.dataset.sessionIdx = window.SESSIONS.indexOf(session);
        cell.setAttribute('role', 'link');
        cell.setAttribute('tabindex', '0');
        cell.title = 'Open Day ' + session.day + ' (' + session.title + ') in Today panel';
      }
      if (ymdStr === todayStr) cell.classList.add('today');
      cell.innerHTML = `<span class="d">${day}</span>` + (session ? `<span class="t">${session.title}</span>` : '');
      grid.appendChild(cell);
    }
  }

  // ---------------- TABS ----------------
  function activateTab(key) {
    document.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('active', t.dataset.tab === key));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === key));
    if (key === 'today')      renderToday();
    if (key === 'sessions')   { currentBlockView = 'all'; renderSessions(); }
    if (key === 'schedule')   renderCalendar();
  }
  function bindTabs() {
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    });
  }

  // ---------------- Jump to a day from Sessions or Schedule ----------------
  function jumpToSession(idx) {
    if (!Number.isInteger(idx) || idx < 0 || idx >= window.SESSIONS.length) return;
    window.DASH_SELECTED_IDX = idx;
    activateTab('today');
    const todayPanel = document.querySelector('[data-panel="today"]');
    if (todayPanel) todayPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    document.querySelectorAll('[data-link="zoom"]').forEach(a => a.href = L.zoom);
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
    renderToday();
    renderSessions();
    renderCalendar();
  };

  document.addEventListener('DOMContentLoaded', () => {
    wireLinks();
    bindTabs();
    bindBlocksRoot();
    bindUserMenu();
    bindAdjacentNav();
    bindDayJumps();
    renderToday();
    renderSessions();
    renderCalendar();
    // tick once a minute so the countdown stays fresh
    setInterval(renderToday, 30000);
  });
})();
