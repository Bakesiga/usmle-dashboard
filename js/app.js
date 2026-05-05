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
  function renderSessions(items) {
    renderChapterTabs(items);
    const root = document.getElementById("sessions-list");
    let filtered = (items || []).filter(matchesTrack);
    if (activeChapter && activeChapter !== "all" && activeChapter !== "__auto__") {
      filtered = filtered.filter((s) => (s.chapter || "Other") === activeChapter);
    }
    if (!filtered.length) {
      root.innerHTML = `<div class="empty">No schedule posted yet for ${TRACK_LABELS[activeTrack]}${activeChapter && activeChapter !== "all" ? " · " + esc(activeChapter) : ""}. Check back soon.</div>`;
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
      return `
        <div class="card">
          <div class="row">
            <div>
              <h3>${esc(s.topic || "Untitled session")}</h3>
              <div class="meta">${dayPrefix}${esc(fmtDate(s.date))}${s.duration ? " · " + esc(s.duration) : ""}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;">
              <span class="pill ${status.cls}">${esc(status.label)}</span>
              ${s.tag ? `<span class="pill ${s.tagColor || ""}">${esc(s.tag)}</span>` : ""}
            </div>
          </div>
          ${s.notes ? `<p>${esc(s.notes)}</p>` : ""}
          ${hasAction ? `
            <div class="actions">
              ${s.slides_url ? `<a class="primary" href="${esc(safeUrl(s.slides_url))}" target="_blank" rel="noopener">📑 Slides</a>` : ""}
              ${s.notes_url  ? `<a href="${esc(safeUrl(s.notes_url))}"  target="_blank" rel="noopener">📝 Notes</a>` : ""}
              ${s.qbank_url  ? `<a href="${esc(safeUrl(s.qbank_url))}"  target="_blank" rel="noopener">❓ Practice Qs</a>` : ""}
            </div>` : ""}
          ${isUpcoming && !hasAction
            ? `<p style="color:var(--muted);font-size:11.5px;margin-top:10px;">Slides and notes will appear here after class.</p>`
            : ""}
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
  }

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

  // ── Boot / re-render ────────────────────────────────
  let DATA = { sessions: [], materials: [], announcements: [] };
  function renderAll() {
    renderSessions(DATA.sessions);
    renderMaterials(DATA.materials);
    renderAnnouncements(DATA.announcements);
    renderSchedule();
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
