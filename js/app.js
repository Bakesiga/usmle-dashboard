/* Dashboard app: gates the page, renders sessions / materials / schedule / announcements. */
(() => {
  const session = USMLE_AUTH.requireSession();
  if (!session) return;

  // Top-bar user chip
  document.getElementById("user-name").textContent = session.name;
  if (session.picture) document.getElementById("user-pic").src = session.picture;
  document.getElementById("signout-btn").addEventListener("click", USMLE_AUTH.signOut);

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

  async function loadJSON(url, fallback) {
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) return fallback;
      return await r.json();
    } catch (e) { return fallback; }
  }

  // ── Sessions (recordings) ────────────────────────────
  function renderSessions(items) {
    const root = document.getElementById("sessions-list");
    if (!items || !items.length) {
      root.innerHTML = `<div class="empty">No recordings posted yet. Check back after the next class.</div>`;
      return;
    }
    items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    root.innerHTML = items.map((s) => `
      <div class="card">
        <div class="row">
          <div>
            <h3>${esc(s.topic || "Untitled session")}</h3>
            <div class="meta">${esc(fmtDate(s.date))} ${s.duration ? "· " + esc(s.duration) : ""}</div>
          </div>
          <div>
            ${s.tag ? `<span class="pill ${s.tagColor || ""}">${esc(s.tag)}</span>` : ""}
          </div>
        </div>
        ${s.notes ? `<p>${esc(s.notes)}</p>` : ""}
        <div class="actions">
          ${s.recording_url ? `<a class="primary" href="${esc(safeUrl(s.recording_url))}" target="_blank" rel="noopener">▶ Watch recording</a>` : ""}
          ${s.slides_url ? `<a href="${esc(safeUrl(s.slides_url))}" target="_blank" rel="noopener">📑 Slides</a>` : ""}
          ${s.notes_url ? `<a href="${esc(safeUrl(s.notes_url))}" target="_blank" rel="noopener">📝 Notes</a>` : ""}
          ${s.qbank_url ? `<a href="${esc(safeUrl(s.qbank_url))}" target="_blank" rel="noopener">❓ Practice Qs</a>` : ""}
        </div>
        <p style="color:var(--muted);font-size:11.5px;margin-top:10px;">Sign in to Zoom with the email Allan added you under to view.</p>
      </div>
    `).join("");
  }

  // ── Materials ────────────────────────────────────────
  function renderMaterials(items) {
    const root = document.getElementById("materials-list");
    if (!items || !items.length) {
      root.innerHTML = `<div class="empty">No materials yet.</div>`;
      return;
    }
    // Group by category
    const groups = {};
    items.forEach((m) => {
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

  // ── Schedule (Google Calendar embed) ─────────────────
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

  // ── Announcements ────────────────────────────────────
  function renderAnnouncements(items) {
    const root = document.getElementById("announcements-list");
    if (!items || !items.length) {
      root.innerHTML = `<div class="empty">No announcements right now.</div>`;
      return;
    }
    items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    root.innerHTML = items.map((a) => `
      <div class="announce">
        <div class="date">${esc(fmtDate(a.date))}</div>
        <h4>${esc(a.title)}</h4>
        <p>${esc(a.body || "")}</p>
      </div>
    `).join("");
  }

  // ── Boot ─────────────────────────────────────────────
  (async function () {
    const [sessions, materials, announcements] = await Promise.all([
      loadJSON(USMLE_CONFIG.DATA.sessions, []),
      loadJSON(USMLE_CONFIG.DATA.materials, []),
      loadJSON(USMLE_CONFIG.DATA.announcements, []),
    ]);
    renderSessions(sessions);
    renderMaterials(materials);
    renderSchedule();
    renderAnnouncements(announcements);
  })();
})();
