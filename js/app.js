/* Dashboard app: gates the page, renders sessions / materials / schedule / announcements,
 * filtered by the student's enrolled track(s).
 */
(() => {
  const session = USMLE_AUTH.requireSession();
  if (!session) return;

  const TRACK_LABELS = { step1: "Step 1", step2: "Step 2 CK" };
  const STORAGE_TRACK = "usmle.activeTrack.v1";

  // Determine active track. If student is in only one, force that one.
  let activeTrack = session.tracks.length === 1
    ? session.tracks[0]
    : (localStorage.getItem(STORAGE_TRACK) || session.tracks[0] || "step1");
  if (!session.tracks.includes(activeTrack)) activeTrack = session.tracks[0];

  // Top-bar user chip
  document.getElementById("user-name").textContent = session.name;
  if (session.picture) document.getElementById("user-pic").src = session.picture;
  document.getElementById("signout-btn").addEventListener("click", USMLE_AUTH.signOut);

  // ── Nav action buttons (Zoom / WhatsApp / Subscribe) ──
  (function setupNavActions() {
    const zoomBtn = document.getElementById("nav-zoom");
    if (zoomBtn) {
      if (USMLE_CONFIG.ZOOM_URL) {
        zoomBtn.href = USMLE_CONFIG.ZOOM_URL;
      } else {
        zoomBtn.style.display = "none";
      }
    }
    const waBtn = document.getElementById("nav-whatsapp");
    if (waBtn) {
      const url = USMLE_CONFIG.WHATSAPP_GROUP_URL || USMLE_CONFIG.WHATSAPP_ALLAN_URL;
      if (url) {
        waBtn.href = url;
        // Re-label if the group URL isn't set yet — link to Allan directly.
        if (!USMLE_CONFIG.WHATSAPP_GROUP_URL) {
          waBtn.querySelector(".nav-label").textContent = "WhatsApp Allan";
          waBtn.title = "Direct WhatsApp to Allan (class group link coming soon)";
        }
      } else {
        waBtn.style.display = "none";
      }
    }
    const subBtn = document.getElementById("nav-subscribe");
    if (subBtn) {
      // webcal:// makes calendar apps prompt to subscribe rather than just download.
      const u = USMLE_CONFIG.SCHEDULE_ICS_URL;
      try {
        const abs = new URL(u, window.location.href);
        subBtn.href = abs.toString().replace(/^https?:/, "webcal:");
      } catch (e) {
        subBtn.href = u || "#";
      }
    }
  })();

  // Track switcher (only if enrolled in >1 track)
  const switcher = document.getElementById("track-switcher");
  if (session.tracks.length > 1) {
    switcher.style.display = "flex";
    switcher.innerHTML = session.tracks.map((t) => `
      <button class="track-btn ${t === activeTrack ? "active" : ""}" data-track="${t}">${TRACK_LABELS[t] || t}</button>
    `).join("");
    switcher.querySelectorAll(".track-btn").forEach((b) => {
      b.addEventListener("click", () => {
        activeTrack = b.dataset.track;
        localStorage.setItem(STORAGE_TRACK, activeTrack);
        switcher.querySelectorAll(".track-btn").forEach((x) => x.classList.toggle("active", x === b));
        // Reset chapter and calendar view so they re-auto-pick for the new track
        activeChapter = "__auto__";
        sessionStorage.removeItem("usmle.activeChapter.v1");
        calView = null;
        renderAll();
      });
    });
  } else {
    // Single track — show a label instead of a switcher
    switcher.style.display = "flex";
    switcher.innerHTML = `<div class="track-badge">${TRACK_LABELS[activeTrack] || activeTrack}</div>`;
  }

  // Tabs
  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      document.getElementById("panel-" + t.dataset.panel).classList.add("active");
    });
  });

  // ── Helpers ──────────────────────────────────────────
  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso + (iso.length <= 10 ? "T00:00:00" : ""));
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
  const safeUrl = (u) => /^https?:\/\//i.test(String(u || "")) ? u : "#";

  // ── Class-time helpers (EAT → student's local zone) ──
  function sessionStartDate(sess) {
    if (!sess || !sess.date) return null;
    const [y, m, d] = sess.date.split("-").map(Number);
    const [hh, mm] = (USMLE_CONFIG.CLASS_TIME_EAT || "19:00").split(":").map(Number);
    // EAT is UTC+3 with no DST.
    return new Date(Date.UTC(y, m - 1, d, hh - 3, mm));
  }
  function sessionEndDate(sess) {
    const start = sessionStartDate(sess);
    if (!start) return null;
    return new Date(start.getTime() + (USMLE_CONFIG.CLASS_DURATION_MIN || 90) * 60000);
  }
  function formatLocalTime(sess) {
    const start = sessionStartDate(sess);
    if (!start) return "";
    return start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  function formatLocalTzAbbr() {
    try {
      const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
        .formatToParts(new Date());
      const tz = parts.find((p) => p.type === "timeZoneName");
      return tz ? tz.value : "";
    } catch (e) { return ""; }
  }
  function eatTimeLabel() {
    const t = USMLE_CONFIG.CLASS_TIME_EAT || "19:00";
    const [hh, mm] = t.split(":").map(Number);
    const ampm = hh >= 12 ? "PM" : "AM";
    const h12 = ((hh + 11) % 12) + 1;
    return `${h12}:${String(mm).padStart(2, "0")} ${ampm} EAT`;
  }

  // ── Mark-as-watched (per-user, localStorage) ─────────
  const REVIEWED_KEY = "usmle.reviewed.v1." + (session && session.email || "anon");
  function loadReviewed() {
    try { return new Set(JSON.parse(localStorage.getItem(REVIEWED_KEY) || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveReviewed(set) {
    localStorage.setItem(REVIEWED_KEY, JSON.stringify([...set]));
  }
  let REVIEWED = loadReviewed();
  function toggleReviewed(sessionId) {
    if (REVIEWED.has(sessionId)) REVIEWED.delete(sessionId);
    else REVIEWED.add(sessionId);
    saveReviewed(REVIEWED);
  }

  // ── ICS options shared across the page ───────────────
  const ICS_OPTS = {
    classTime:   USMLE_CONFIG.CLASS_TIME_EAT || "19:00",
    durationMin: USMLE_CONFIG.CLASS_DURATION_MIN || 90,
    tzid:        USMLE_CONFIG.CLASS_TZ || "Africa/Kampala",
    zoomUrl:     USMLE_CONFIG.ZOOM_URL || "",
    zoomId:      USMLE_CONFIG.ZOOM_ID || "",
  };

  // Track filter: an item matches if its track is "both", missing, or === activeTrack.
  const matchesTrack = (item) => {
    const t = item.track;
    if (!t || t === "both") return true;
    return t === activeTrack;
  };

  async function loadJSON(url, fallback) {
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) return fallback;
      return await r.json();
    } catch (e) { return fallback; }
  }

  // ── Chapter sub-tabs (within Sessions panel) ─────────
  const CHAPTER_KEY = "usmle.activeChapter.v1";
  let activeChapter = sessionStorage.getItem(CHAPTER_KEY) || "__auto__";

  function renderChapterTabs(items) {
    const root = document.getElementById("chapter-tabs");
    if (!root) return;
    const trackItems = (items || []).filter(matchesTrack);

    // Build chapter inventory in date order: chapters appear in the order
    // their first session falls.
    const chapterFirstDate = {};
    trackItems.forEach((s) => {
      const ch = s.chapter || "Other";
      if (!(ch in chapterFirstDate) || (s.date || "") < chapterFirstDate[ch]) {
        chapterFirstDate[ch] = s.date || "9999-12-31";
      }
    });
    const chapters = Object.keys(chapterFirstDate)
      .sort((a, b) => chapterFirstDate[a].localeCompare(chapterFirstDate[b]));

    if (chapters.length <= 1) { root.style.display = "none"; return; }
    root.style.display = "flex";

    // Auto-pick the chapter containing today or the next upcoming session
    if (activeChapter === "__auto__") {
      const todayISO = new Date().toISOString().slice(0, 10);
      const upcoming = trackItems
        .filter((s) => (s.date || "") >= todayISO)
        .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
      activeChapter = (upcoming[0] && upcoming[0].chapter) || chapters[0];
    }
    if (!chapters.includes(activeChapter) && activeChapter !== "all") activeChapter = chapters[0];

    // Counts per chapter
    const counts = { all: trackItems.length };
    chapters.forEach((ch) => {
      counts[ch] = trackItems.filter((s) => (s.chapter || "Other") === ch).length;
    });

    const pill = (key, label) => `
      <div class="chapter-tab ${activeChapter === key ? "active" : ""}" data-chapter="${esc(key)}">
        ${esc(label)}<span class="count">(${counts[key] || 0})</span>
      </div>`;

    root.innerHTML =
      pill("all", "All") +
      chapters.map((ch) => pill(ch, ch)).join("");

    root.querySelectorAll(".chapter-tab").forEach((t) => {
      t.addEventListener("click", () => {
        activeChapter = t.dataset.chapter;
        sessionStorage.setItem(CHAPTER_KEY, activeChapter);
        renderChapterTabs(items);
        renderSessions(items);
      });
    });
  }

  // ── Sessions ────────────────────────────────────────
  let SEARCH_TERM = "";

  function sessionMatchesSearch(s) {
    if (!SEARCH_TERM) return true;
    const q = SEARCH_TERM.toLowerCase();
    return [s.topic, s.notes, s.chapter, s.fa_pages, s.tag]
      .map((v) => String(v || "").toLowerCase())
      .some((v) => v.includes(q));
  }

  function renderSessions(items) {
    renderChapterTabs(items);
    const root = document.getElementById("sessions-list");
    let filtered = (items || []).filter(matchesTrack);
    if (activeChapter && activeChapter !== "all" && activeChapter !== "__auto__") {
      filtered = filtered.filter((s) => (s.chapter || "Other") === activeChapter);
    }
    filtered = filtered.filter(sessionMatchesSearch);
    if (!filtered.length) {
      root.innerHTML = `<div class="empty">${
        SEARCH_TERM
          ? `No sessions match "${esc(SEARCH_TERM)}". Try a different keyword.`
          : `No schedule posted yet for ${TRACK_LABELS[activeTrack]}${activeChapter && activeChapter !== "all" ? " · " + esc(activeChapter) : ""}. Check back soon.`
      }</div>`;
      return;
    }

    const todayISO = new Date().toISOString().slice(0, 10);
    const upcoming = filtered.filter((s) => (s.date || "") >= todayISO);
    const past     = filtered.filter((s) => (s.date || "") <  todayISO);
    upcoming.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    past.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    function statusFor(s) {
      if (!s.date) return { label: "TBD",      cls: "pill-muted" };
      if (s.date === todayISO) return { label: "TODAY",    cls: "pill-amber" };
      if (s.date >  todayISO)  return { label: "UPCOMING", cls: "pill-blue"  };
      return { label: "COVERED", cls: "pill-muted" };
    }

    function cardHtml(s) {
      const status = statusFor(s);
      const dayPrefix = s.day ? `<strong>Day ${esc(s.day)}</strong> · ` : "";
      const isUpcoming = (s.date || "") >= todayISO;
      const hasAction = s.slides_url || s.notes_url || s.qbank_url;
      const reviewed = REVIEWED.has(s.id);
      const localTime = formatLocalTime(s);
      const tz = formatLocalTzAbbr();
      const timeBadge = localTime
        ? `<span class="time-badge" title="Local time (your timezone). Class is ${eatTimeLabel()}.">${esc(localTime)}${tz ? " " + esc(tz) : ""}</span>`
        : "";
      return `
        <div class="card session-card" data-id="${esc(s.id)}">
          <div class="row">
            <div>
              <h3>${esc(s.topic || "Untitled session")}</h3>
              <div class="meta">${dayPrefix}${esc(fmtDate(s.date))}${timeBadge ? " · " + timeBadge : ""}${s.fa_pages && s.fa_pages !== "—" ? " · <em>FA " + esc(s.fa_pages) + "</em>" : ""}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;">
              <span class="pill ${status.cls}">${esc(status.label)}</span>
              ${s.tag ? `<span class="pill ${s.tagColor || ""}">${esc(s.tag)}</span>` : ""}
            </div>
          </div>
          ${s.notes ? `<p>${esc(s.notes)}</p>` : ""}
          <div class="session-actions">
            ${isUpcoming && USMLE_CONFIG.ZOOM_URL ? `<a class="action-pill action-zoom" href="${esc(USMLE_CONFIG.ZOOM_URL)}" target="_blank" rel="noopener">🎥 Join class</a>` : ""}
            <button type="button" class="action-pill action-cal" data-action="cal-google" data-id="${esc(s.id)}">📅 Google Calendar</button>
            <button type="button" class="action-pill action-cal" data-action="cal-ics" data-id="${esc(s.id)}">📥 Download .ics</button>
            ${s.slides_url ? `<a class="action-pill" href="${esc(safeUrl(s.slides_url))}" target="_blank" rel="noopener">📑 Slides</a>` : ""}
            ${s.notes_url  ? `<a class="action-pill" href="${esc(safeUrl(s.notes_url))}"  target="_blank" rel="noopener">📝 Notes</a>` : ""}
            ${s.qbank_url  ? `<a class="action-pill" href="${esc(safeUrl(s.qbank_url))}"  target="_blank" rel="noopener">❓ Practice Qs</a>` : ""}
            <label class="action-pill reviewed-toggle">
              <input type="checkbox" data-action="reviewed" data-id="${esc(s.id)}" ${reviewed ? "checked" : ""} />
              <span>${reviewed ? "Reviewed ✓" : "Mark reviewed"}</span>
            </label>
          </div>
          ${isUpcoming && !hasAction
            ? `<p style="color:var(--muted);font-size:11.5px;margin-top:10px;">Slides and notes will appear here after class.</p>`
            : ""}
          <details class="session-discussion">
            <summary>💭 Discussion & Q&amp;A</summary>
            <div class="session-discussion-body" data-id="${esc(s.id)}"></div>
          </details>
        </div>
      `;
    }

    let html = "";
    if (upcoming.length) {
      html += `<h2 class="section-title" style="margin-top:6px;">Upcoming</h2>`;
      html += upcoming.map(cardHtml).join("");
    }
    if (past.length) {
      html += `<h2 class="section-title" style="margin-top:22px;">Past classes</h2>`;
      html += past.map(cardHtml).join("");
    }
    root.innerHTML = html;

    // Wire up per-card actions
    root.querySelectorAll('[data-action="cal-google"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const s = DATA.sessions.find((x) => x.id === btn.dataset.id);
        if (!s) return;
        window.open(USMLE_ICS.googleCalendarUrl(s, ICS_OPTS), "_blank", "noopener");
      });
    });
    root.querySelectorAll('[data-action="cal-ics"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const s = DATA.sessions.find((x) => x.id === btn.dataset.id);
        if (!s) return;
        USMLE_ICS.downloadOneSession(s, ICS_OPTS);
      });
    });
    root.querySelectorAll('[data-action="reviewed"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        toggleReviewed(cb.dataset.id);
        const span = cb.parentElement.querySelector("span");
        if (span) span.textContent = cb.checked ? "Reviewed ✓" : "Mark reviewed";
        cb.parentElement.classList.toggle("is-reviewed", cb.checked);
      });
      cb.parentElement.classList.toggle("is-reviewed", cb.checked);
    });

    // Lazy-load Giscus into each session's discussion drawer the first time it opens.
    root.querySelectorAll(".session-discussion").forEach((det) => {
      det.addEventListener("toggle", () => {
        if (!det.open) return;
        const body = det.querySelector(".session-discussion-body");
        if (!body || body.dataset.loaded) return;
        body.dataset.loaded = "1";
        loadGiscusInto(body, body.dataset.id);
      });
    });
  }

  // ── WhatsApp join card (only renders if a group URL is set) ──
  function renderWhatsAppCard() {
    const root = document.getElementById("whatsapp-card");
    if (!root) return;
    const url = USMLE_CONFIG.WHATSAPP_GROUP_URL;
    if (!url) { root.innerHTML = ""; return; }
    root.innerHTML = `
      <div class="wa-join">
        <div class="wa-join-text">
          <div class="wa-join-eyebrow">CLASS CHAT</div>
          <h3>Join the cohort WhatsApp group</h3>
          <p>Daily peer Q&amp;A, study buddies, quick reach to Allan between sessions. Tap to open WhatsApp, or scan with another phone.</p>
          <a class="action-pill primary wa-join-btn" href="${esc(url)}" target="_blank" rel="noopener">💬 Open in WhatsApp</a>
        </div>
        <div class="wa-join-qr" aria-hidden="true">
          <img src="images/whatsapp_qr.png" alt="WhatsApp class group QR code" />
          <span class="wa-join-qr-cap">scan with another phone</span>
        </div>
      </div>
    `;
  }

  // ── Today's-class hero card (top of Sessions panel) ──
  function renderTodayCard(items) {
    const root = document.getElementById("today-card");
    if (!root) return;
    const todayISO = new Date().toISOString().slice(0, 10);
    const trackItems = (items || []).filter(matchesTrack).filter((s) => s.date);

    // "Now/next" is: today's session if any, otherwise the soonest future one.
    const todays = trackItems.find((s) => s.date === todayISO);
    const upcoming = trackItems
      .filter((s) => s.date > todayISO)
      .sort((a, b) => a.date.localeCompare(b.date));
    const target = todays || upcoming[0];
    if (!target) { root.innerHTML = ""; return; }

    const start = sessionStartDate(target);
    const end   = sessionEndDate(target);
    const now   = new Date();
    let stateLabel, stateCls;
    if (start && end && now >= start && now < end) {
      stateLabel = "LIVE NOW";
      stateCls = "pill-amber";
    } else if (target.date === todayISO) {
      stateLabel = "TODAY";
      stateCls = "pill-amber";
    } else {
      stateLabel = "NEXT CLASS";
      stateCls = "pill-blue";
    }

    const localT = formatLocalTime(target);
    const tz = formatLocalTzAbbr();
    const countdownTarget = start ? start.getTime() : 0;

    root.innerHTML = `
      <div class="today-hero">
        <div class="today-hero-head">
          <span class="pill ${stateCls}">${stateLabel}</span>
          <span class="today-hero-countdown" data-target="${countdownTarget}">…</span>
        </div>
        <h2>${esc(target.topic || "Class")}</h2>
        <div class="today-hero-meta">
          ${target.chapter ? `<span>${esc(target.chapter)}</span>` : ""}
          ${target.day ? `<span>Day ${esc(target.day)}</span>` : ""}
          <span>${esc(fmtDate(target.date))}</span>
          ${localT ? `<span>${esc(localT)}${tz ? " " + esc(tz) : ""}<small class="dim"> · ${esc(eatTimeLabel())}</small></span>` : ""}
          ${target.fa_pages && target.fa_pages !== "—" ? `<span><em>FA ${esc(target.fa_pages)}</em></span>` : ""}
        </div>
        <div class="today-hero-actions">
          ${USMLE_CONFIG.ZOOM_URL ? `<a class="action-pill primary" href="${esc(USMLE_CONFIG.ZOOM_URL)}" target="_blank" rel="noopener">🎥 Join class on Zoom</a>` : ""}
          <button type="button" class="action-pill" data-action="hero-cal-google" data-id="${esc(target.id)}">📅 Add to Google Calendar</button>
          <button type="button" class="action-pill" data-action="hero-cal-ics" data-id="${esc(target.id)}">📥 Download .ics</button>
        </div>
      </div>
    `;

    root.querySelectorAll('[data-action="hero-cal-google"]').forEach((btn) => {
      btn.addEventListener("click", () =>
        window.open(USMLE_ICS.googleCalendarUrl(target, ICS_OPTS), "_blank", "noopener"));
    });
    root.querySelectorAll('[data-action="hero-cal-ics"]').forEach((btn) => {
      btn.addEventListener("click", () => USMLE_ICS.downloadOneSession(target, ICS_OPTS));
    });
  }

  // ── Countdown ticker (updates the today-hero label every minute) ──
  function tickCountdowns() {
    document.querySelectorAll(".today-hero-countdown").forEach((el) => {
      const t = Number(el.dataset.target || 0);
      if (!t) { el.textContent = ""; return; }
      const ms = t - Date.now();
      if (ms <= 0) {
        const endMs = ms + (USMLE_CONFIG.CLASS_DURATION_MIN || 90) * 60000;
        if (endMs > 0) {
          const mins = Math.ceil(endMs / 60000);
          el.textContent = `class in progress — ${mins} min left`;
        } else {
          el.textContent = "class has ended";
        }
        return;
      }
      const totalMin = Math.floor(ms / 60000);
      const days = Math.floor(totalMin / (60 * 24));
      const hours = Math.floor((totalMin % (60 * 24)) / 60);
      const mins = totalMin % 60;
      if (days > 0) el.textContent = `starts in ${days}d ${hours}h`;
      else if (hours > 0) el.textContent = `starts in ${hours}h ${mins}m`;
      else el.textContent = `starts in ${mins}m`;
    });
  }
  setInterval(tickCountdowns, 30 * 1000);

  // ── Giscus loader (per-session discussion drawer) ────
  function loadGiscusInto(host, sessionId) {
    const g = USMLE_CONFIG.GISCUS || {};
    if (!g.repoId || !g.categoryId) {
      host.innerHTML = `<p class="discussion-disabled">Discussion is being set up. For now, ping the class WhatsApp group or message Allan directly.</p>`;
      return;
    }
    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute("data-repo", g.repo);
    s.setAttribute("data-repo-id", g.repoId);
    s.setAttribute("data-category", g.category);
    s.setAttribute("data-category-id", g.categoryId);
    s.setAttribute("data-mapping", "specific");
    s.setAttribute("data-term", sessionId);
    s.setAttribute("data-strict", "0");
    s.setAttribute("data-reactions-enabled", "1");
    s.setAttribute("data-emit-metadata", "0");
    s.setAttribute("data-input-position", "top");
    s.setAttribute("data-theme", g.theme || "light");
    s.setAttribute("data-lang", "en");
    host.appendChild(s);
  }

  // ── Search input ────────────────────────────────────
  (function setupSearch() {
    const inp = document.getElementById("sessions-search");
    if (!inp) return;
    let t = null;
    inp.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        SEARCH_TERM = inp.value.trim();
        renderSessions(DATA.sessions);
      }, 120);
    });
  })();

  // ── Materials ───────────────────────────────────────
  function renderMaterials(items) {
    const root = document.getElementById("materials-list");
    const filtered = (items || []).filter(matchesTrack);
    if (!filtered.length) {
      root.innerHTML = `<div class="empty">No materials posted yet for ${TRACK_LABELS[activeTrack]}.</div>`;
      return;
    }
    const groups = {};
    filtered.forEach((m) => {
      const cat = m.category || "General";
      (groups[cat] = groups[cat] || []).push(m);
    });
    root.innerHTML = Object.keys(groups).sort().map((cat) => `
      <div class="material">
        <div class="cat">${esc(cat)}</div>
        ${groups[cat].map((m) => `
          <h4>${esc(m.title)}</h4>
          ${m.description ? `<p style="color:var(--text2);font-size:12.5px;margin-top:4px;">${esc(m.description)}</p>` : ""}
          <a href="${esc(safeUrl(m.url))}" target="_blank" rel="noopener">${esc(m.type ? m.type.toUpperCase() : "Open")} →</a>
        `).join("<hr style='border:none;border-top:1px solid var(--border);margin:10px 0' />")}
      </div>
    `).join("");
  }

  // ── Schedule (month grid generated from sessions.json) ──
  const CHAPTER_COLOR = {
    "Cardiovascular":               "#0284c7",
    "Respiratory":                  "#059669",
    "General Pathology":            "#7c3aed",
    "Epidemiology & Biostatistics": "#d97706",
  };
  const CHAPTER_FALLBACK = "#db2777";
  const monthLabel = (y, m) =>
    new Date(y, m, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const isoDate = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  let calView = null; // { year, month } — set on first render

  function pickInitialMonth(items) {
    const todayISO = new Date().toISOString().slice(0, 10);
    const trackItems = (items || []).filter(matchesTrack).filter((s) => s.date);
    const upcoming = trackItems
      .filter((s) => (s.date || "") >= todayISO)
      .sort((a, b) => a.date.localeCompare(b.date));
    const target = upcoming[0]
      ? upcoming[0].date
      : (trackItems.sort((a, b) => b.date.localeCompare(a.date))[0] || {}).date;
    if (target) {
      const [y, m] = target.split("-").map(Number);
      return { year: y, month: m - 1 };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }

  function renderSchedule() {
    const items = (DATA.sessions || []).filter(matchesTrack).filter((s) => s.date);
    if (!items.length) {
      document.getElementById("cal-grid").innerHTML =
        `<div class="empty" style="grid-column:1/-1;">No schedule posted yet for ${TRACK_LABELS[activeTrack]}.</div>`;
      document.getElementById("cal-month").textContent = "—";
      document.getElementById("cal-legend").innerHTML = "";
      return;
    }
    if (!calView) calView = pickInitialMonth(DATA.sessions);
    drawCalendar(items);
  }

  function drawCalendar(items) {
    const { year, month } = calView;
    document.getElementById("cal-month").textContent = monthLabel(year, month);

    // Index sessions by date for fast lookup
    const byDate = {};
    items.forEach((s) => { byDate[s.date] = s; });

    // Build the grid: start on Monday of the week containing day 1.
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // 0=Mon..6=Sun
    const gridStart = new Date(year, month, 1 - startOffset);
    const lastOfMonth = new Date(year, month + 1, 0);
    const totalDaysAcross = startOffset + lastOfMonth.getDate();
    const totalCells = Math.ceil(totalDaysAcross / 7) * 7;

    const todayISO = new Date().toISOString().slice(0, 10);

    let html = "";
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      const dy = d.getFullYear(), dm = d.getMonth(), dd = d.getDate();
      const cellISO = isoDate(dy, dm, dd);
      const inMonth = (dm === month);
      const session = byDate[cellISO];
      const chapter = session && session.chapter ? session.chapter : null;
      const accent = chapter && CHAPTER_COLOR[chapter] ? CHAPTER_COLOR[chapter] : CHAPTER_FALLBACK;

      const classes = [
        "cal-cell",
        inMonth ? "" : "outside-month",
        cellISO === todayISO ? "today" : "",
        session ? "has-session" : "",
      ].filter(Boolean).join(" ");

      const styleVar = session ? `style="--cell-accent:${accent};"` : "";
      const dayLabel = session && session.day ? `Day ${session.day}` : "";
      const topicShort = session
        ? esc(session.topic || "").split(/[—:;]/)[0].slice(0, 64)
        : "";

      html += `
        <div class="${classes}" ${styleVar} data-iso="${cellISO}" data-id="${session ? esc(session.id) : ""}">
          <div class="cal-day-num">${dd}</div>
          ${session ? `<div class="cal-day-label">${esc(dayLabel)}</div>` : ""}
          ${session ? `<div class="cal-day-topic">${topicShort}</div>` : ""}
        </div>`;
    }
    document.getElementById("cal-grid").innerHTML = html;

    // Legend (only chapters that exist for active track)
    const presentChapters = [...new Set(items.map((s) => s.chapter).filter(Boolean))];
    const legend = presentChapters
      .map((ch) => `<span class="cal-legend-item" style="--legend-color:${CHAPTER_COLOR[ch] || CHAPTER_FALLBACK};">${esc(ch)}</span>`)
      .join("");
    document.getElementById("cal-legend").innerHTML = legend;

    // Click a cell with a session → switch to Sessions tab
    document.getElementById("cal-grid").querySelectorAll(".cal-cell.has-session")
      .forEach((cell) => {
        cell.addEventListener("click", () => {
          // Switch to Sessions tab
          document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
          document.querySelectorAll(".panel").forEach((x) => x.classList.remove("active"));
          const sessionsTab = document.querySelector('.tab[data-panel="sessions"]');
          sessionsTab && sessionsTab.classList.add("active");
          document.getElementById("panel-sessions").classList.add("active");
          // Make sure the chapter filter shows the chapter we're switching to
          const ch = cell.style.getPropertyValue("--cell-accent");
          // If the active chapter pill doesn't match, switch it
          const chapterName = (DATA.sessions.find((s) => s.id === cell.dataset.id) || {}).chapter || "all";
          activeChapter = chapterName;
          sessionStorage.setItem(CHAPTER_KEY, activeChapter);
          renderSessions(DATA.sessions);
          // Scroll to the matching card (best effort — wait a tick for re-render)
          setTimeout(() => {
            const cards = document.getElementById("sessions-list").querySelectorAll(".card h3");
            const target = (DATA.sessions.find((s) => s.id === cell.dataset.id) || {}).topic;
            for (const h of cards) {
              if (h.textContent === target) {
                h.closest(".card").scrollIntoView({ behavior: "smooth", block: "center" });
                h.closest(".card").style.outline = `2px solid ${CHAPTER_COLOR[chapterName] || CHAPTER_FALLBACK}`;
                setTimeout(() => h.closest(".card").style.outline = "", 1600);
                break;
              }
            }
          }, 60);
        });
      });
  }

  // Calendar nav buttons
  document.getElementById("cal-prev").addEventListener("click", () => {
    if (!calView) return;
    calView = { year: calView.year + (calView.month === 0 ? -1 : 0),
                month: (calView.month + 11) % 12 };
    renderSchedule();
  });
  document.getElementById("cal-next").addEventListener("click", () => {
    if (!calView) return;
    calView = { year: calView.year + (calView.month === 11 ? 1 : 0),
                month: (calView.month + 1) % 12 };
    renderSchedule();
  });
  document.getElementById("cal-today").addEventListener("click", () => {
    const now = new Date();
    calView = { year: now.getFullYear(), month: now.getMonth() };
    renderSchedule();
  });

  // ── Announcements ───────────────────────────────────
  function renderAnnouncements(items) {
    const root = document.getElementById("announcements-list");
    const filtered = (items || []).filter(matchesTrack);
    if (!filtered.length) {
      root.innerHTML = `<div class="empty">No announcements right now.</div>`;
      return;
    }
    filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    root.innerHTML = filtered.map((a) => `
      <div class="announce">
        <div class="date">${esc(fmtDate(a.date))}</div>
        <h4>${esc(a.title)}</h4>
        <p>${esc(a.body || "")}</p>
      </div>
    `).join("");
  }

  // ── Office hours (Calendly embed) ───────────────────
  let officeHoursMounted = false;
  function renderOfficeHours() {
    const mount = document.getElementById("office-hours-mount");
    if (!mount || officeHoursMounted) return;
    officeHoursMounted = true;
    const url = USMLE_CONFIG.CALENDLY_URL;
    if (!url) {
      mount.innerHTML = `
        <div class="office-hours-fallback">
          <p><strong>The booking calendar is being set up.</strong></p>
          <p>In the meantime, reach out directly and we'll find a time:</p>
          <ul>
            <li>📧 <a href="mailto:allanbakesiga@gmail.com">allanbakesiga@gmail.com</a></li>
            <li>💬 <a href="${esc(USMLE_CONFIG.WHATSAPP_ALLAN_URL || '#')}" target="_blank" rel="noopener">WhatsApp +256 705 571 443</a></li>
            <li>📞 <a href="tel:+19847102902">Call +1 984 710 2902</a></li>
          </ul>
        </div>
      `;
      return;
    }
    // Calendly inline widget. Their script lazy-instantiates any
    // .calendly-inline-widget it finds in the DOM.
    mount.innerHTML = `
      <div class="calendly-inline-widget" data-url="${esc(url)}" style="min-width:320px;height:720px;"></div>
    `;
    if (!document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
      const s = document.createElement("script");
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.head.appendChild(s);
    }
    // Also pull in their widget stylesheet for the inline embed.
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(l);
    }
  }
  // Mount on first tab activation (lazy — avoids loading Calendly assets
  // for students who never open the tab).
  document.querySelector('.tab[data-panel="office-hours"]')
    ?.addEventListener("click", renderOfficeHours);

  // ── Boot / re-render ────────────────────────────────
  let DATA = { sessions: [], materials: [], announcements: [] };
  function renderAll() {
    renderTodayCard(DATA.sessions);
    renderWhatsAppCard();
    renderSessions(DATA.sessions);
    renderMaterials(DATA.materials);
    renderAnnouncements(DATA.announcements);
    renderSchedule();
    tickCountdowns();
    // If the user is already on the Office Hours tab, render it now.
    if (document.getElementById("panel-office-hours")?.classList.contains("active")) {
      renderOfficeHours();
    }
  }

  (async function () {
    const [sessions, materials, announcements] = await Promise.all([
      loadJSON(USMLE_CONFIG.DATA.sessions, []),
      loadJSON(USMLE_CONFIG.DATA.materials, []),
      loadJSON(USMLE_CONFIG.DATA.announcements, []),
    ]);
    DATA = { sessions, materials, announcements };
    renderAll();
  })();
})();
