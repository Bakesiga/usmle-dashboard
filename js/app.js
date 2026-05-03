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

  // ── Sessions ────────────────────────────────────────
  function renderSessions(items) {
    const root = document.getElementById("sessions-list");
    const filtered = (items || []).filter(matchesTrack);
    if (!filtered.length) {
      root.innerHTML = `<div class="empty">No schedule posted yet for ${TRACK_LABELS[activeTrack]}. Check back soon.</div>`;
      return;
    }

    const todayISO = new Date().toISOString().slice(0, 10);
    const upcoming = filtered.filter((s) => (s.date || "") >= todayISO);
    const past     = filtered.filter((s) => (s.date || "") <  todayISO);
    upcoming.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    past.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    function statusFor(s) {
      if (!s.date) return { label: "TBD",      cls: "pill-muted"  };
      if (s.date === todayISO) return { label: "TODAY",    cls: "pill-amber"  };
      if (s.date >  todayISO)  return { label: "UPCOMING", cls: "pill-blue"   };
      return s.recording_url
        ? { label: "RECORDED", cls: "pill-muted" }
        : { label: "PAST",     cls: "pill-muted" };
    }

    function cardHtml(s) {
      const status = statusFor(s);
      const dayPrefix = s.day ? `<strong>Day ${esc(s.day)}</strong> · ` : "";
      const isUpcoming = (s.date || "") >= todayISO;
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
          <div class="actions">
            ${s.recording_url ? `<a class="primary" href="${esc(safeUrl(s.recording_url))}" target="_blank" rel="noopener">▶ Watch recording</a>` : ""}
            ${s.slides_url   ? `<a href="${esc(safeUrl(s.slides_url))}" target="_blank" rel="noopener">📑 Slides</a>` : ""}
            ${s.notes_url    ? `<a href="${esc(safeUrl(s.notes_url))}"  target="_blank" rel="noopener">📝 Notes</a>` : ""}
            ${s.qbank_url    ? `<a href="${esc(safeUrl(s.qbank_url))}"  target="_blank" rel="noopener">❓ Practice Qs</a>` : ""}
          </div>
          ${s.recording_url
            ? `<p style="color:var(--muted);font-size:11.5px;margin-top:10px;">Sign in to Zoom with the email Allan added you under to view.</p>`
            : (isUpcoming ? `<p style="color:var(--muted);font-size:11.5px;margin-top:10px;">Recording, slides, and notes will appear here after class.</p>` : "")}
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

  // ── Schedule ────────────────────────────────────────
  function renderSchedule() {
    const url = USMLE_CONFIG.CALENDAR_EMBED_URL;
    const iframe = document.getElementById("cal-iframe");
    const wrap = document.getElementById("schedule-wrap");
    if (!url || url.includes("PASTE_CALENDAR_ID")) {
      wrap.innerHTML = `<div class="empty">Schedule not connected yet. Allan can paste a Google Calendar embed URL into <code>js/config.js</code>.</div>`;
      return;
    }
    iframe.src = url;
  }

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
  }

  (async function () {
    const [sessions, materials, announcements] = await Promise.all([
      loadJSON(USMLE_CONFIG.DATA.sessions, []),
      loadJSON(USMLE_CONFIG.DATA.materials, []),
      loadJSON(USMLE_CONFIG.DATA.announcements, []),
    ]);
    DATA = { sessions, materials, announcements };
    renderAll();
    renderSchedule();
  })();
})();
