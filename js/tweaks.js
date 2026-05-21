/* ============================================================
   tweaks.js — vanilla Tweaks panel shared by all pages.
   Listens for __activate_edit_mode / __deactivate_edit_mode.
   ============================================================ */
(function () {
  'use strict';

  // -- protocol order: register listener first, then announce --
  let visible = false;
  let panel   = null;

  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || !d.type) return;
    if (d.type === '__activate_edit_mode')   show();
    if (d.type === '__deactivate_edit_mode') hide();
  });

  // Announce that this surface supports tweaks
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}

  // -- state (rewritten by host between markers) --
  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "light",
    "simState": "live",
    "showCountdownStrip": true,
    "heroPhotoSize": 240
  }/*EDITMODE-END*/;

  const saved = JSON.parse(localStorage.getItem('__usmle_tweaks') || '{}');
  const state = Object.assign({}, DEFAULTS, saved);

  function persist() {
    localStorage.setItem('__usmle_tweaks', JSON.stringify(state));
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: state }, '*'); } catch (e) {}
  }

  // ---- Apply tweaks to live DOM ----
  function apply() {
    document.documentElement.dataset.theme = state.theme;

    // Hero photo size
    document.documentElement.style.setProperty('--allan-portrait-size', state.heroPhotoSize + 'px');
    const portrait = document.querySelector('.allan-portrait');
    if (portrait) { portrait.style.width = state.heroPhotoSize + 'px'; portrait.style.height = state.heroPhotoSize + 'px'; }

    // Countdown strip toggle
    const strip = document.querySelector('.countdown-strip');
    if (strip) strip.style.display = state.showCountdownStrip ? '' : 'none';

    // Simulated time for dashboard previews
    const now = new Date();
    let sim = null;
    switch (state.simState) {
      case 'now':       sim = null; break;
      case 'live':      sim = new Date('2026-06-03T05:30:00'); break;
      case 'soon':      sim = new Date('2026-06-03T04:45:00'); break;
      case 'ended':     sim = new Date('2026-06-03T11:00:00'); break;
      case 'mid':       sim = new Date('2026-06-15T06:00:00'); break;
      case 'pre':       sim = new Date('2026-05-25T12:00:00'); break;
      default:          sim = null;
    }
    window.SIM_NOW = sim;
    if (typeof window.__dashRerender === 'function') window.__dashRerender();
  }

  apply();

  // ---- Build panel UI ----
  function build() {
    panel = document.createElement('aside');
    panel.id = '__tweaks';
    panel.innerHTML = `
      <header>
        <span>Tweaks</span>
        <button type="button" aria-label="Close tweaks" data-close>×</button>
      </header>
      <section>
        <h4>Theme</h4>
        <div class="row">
          <button data-set="theme:light" class="seg">Light</button>
          <button data-set="theme:dark"  class="seg">Dark</button>
        </div>
      </section>

      <section data-only="dashboard">
        <h4>Simulated "now" <small>(dashboard only)</small></h4>
        <div class="row col">
          <button data-set="simState:now"   class="seg">Real now</button>
          <button data-set="simState:pre"   class="seg">Pre-cohort · May 25</button>
          <button data-set="simState:soon"  class="seg">Day 3 · 30 min to class</button>
          <button data-set="simState:live"  class="seg">Day 3 · live now</button>
          <button data-set="simState:ended" class="seg">Day 3 · class ended</button>
          <button data-set="simState:mid"   class="seg">Day 15 · respiratory</button>
        </div>
      </section>

      <section data-only="marketing">
        <h4>Countdown strip</h4>
        <div class="row">
          <button data-set="showCountdownStrip:true"  class="seg">Show</button>
          <button data-set="showCountdownStrip:false" class="seg">Hide</button>
        </div>
        <h4 style="margin-top:14px;">Allan photo size</h4>
        <div class="row">
          <button data-set="heroPhotoSize:200" class="seg">200</button>
          <button data-set="heroPhotoSize:240" class="seg">240</button>
          <button data-set="heroPhotoSize:280" class="seg">280</button>
        </div>
      </section>

      <footer>
        <small>Changes persist locally. Open Tweaks again to revisit.</small>
      </footer>
    `;
    document.body.appendChild(panel);

    // hide sections that don't apply to this page
    const isDash = document.body.matches('[data-screen-label*="Dashboard"]');
    panel.querySelectorAll('[data-only="dashboard"]').forEach(el => el.style.display = isDash ? '' : 'none');
    panel.querySelectorAll('[data-only="marketing"]').forEach(el => el.style.display = isDash ? 'none' : '');

    panel.querySelector('[data-close]').addEventListener('click', () => {
      hide();
      try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
    });
    panel.querySelectorAll('[data-set]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [k, raw] = btn.dataset.set.split(':');
        let v = raw;
        if (raw === 'true')  v = true;
        else if (raw === 'false') v = false;
        else if (!isNaN(Number(raw)) && raw !== '') v = Number(raw);
        state[k] = v;
        persist();
        apply();
        markActive();
      });
    });

    markActive();
  }

  function markActive() {
    if (!panel) return;
    panel.querySelectorAll('[data-set]').forEach(btn => {
      const [k, raw] = btn.dataset.set.split(':');
      let v = raw;
      if (raw === 'true')  v = true;
      else if (raw === 'false') v = false;
      else if (!isNaN(Number(raw)) && raw !== '') v = Number(raw);
      btn.classList.toggle('active', state[k] === v);
    });
  }

  function show() { if (!panel) build(); panel.classList.add('open'); visible = true; }
  function hide() { if (panel) panel.classList.remove('open'); visible = false; }

  // ---- Styles ----
  const css = document.createElement('style');
  css.textContent = `
    #__tweaks {
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: 300px;
      max-height: calc(100vh - 32px);
      overflow: auto;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      box-shadow: 0 12px 40px rgba(12,42,61,0.2);
      font-family: var(--font-body);
      color: var(--ink);
      z-index: 9999;
      transform: translateY(8px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 200ms var(--ease), transform 200ms var(--ease);
    }
    #__tweaks.open { opacity: 1; transform: none; pointer-events: auto; }
    #__tweaks header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-2);
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 14px;
      letter-spacing: -0.005em;
    }
    #__tweaks header button {
      background: transparent; border: 0;
      width: 28px; height: 28px; border-radius: 6px;
      font-size: 20px; color: var(--muted); cursor: pointer; line-height: 1;
    }
    #__tweaks header button:hover { background: var(--bg-cream); color: var(--ink); }
    #__tweaks section { padding: 14px 16px; border-bottom: 1px solid var(--border-2); }
    #__tweaks section:last-of-type { border-bottom: 0; }
    #__tweaks h4 {
      font-family: var(--font-display);
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 10px;
    }
    #__tweaks h4 small { letter-spacing: 0; text-transform: none; color: var(--muted); opacity: 0.7; }
    #__tweaks .row { display: flex; flex-wrap: wrap; gap: 6px; }
    #__tweaks .row.col { flex-direction: column; }
    #__tweaks .seg {
      padding: 7px 10px;
      border-radius: 8px;
      background: var(--bg-cream);
      border: 1px solid var(--border-2);
      font-family: var(--font-body);
      font-size: 12px;
      font-weight: 500;
      color: var(--ink-2);
      cursor: pointer;
      flex: 1;
      text-align: left;
    }
    #__tweaks .seg:hover { border-color: var(--border); color: var(--ink); }
    #__tweaks .seg.active {
      background: var(--ink); color: #fff; border-color: var(--ink);
    }
    #__tweaks footer { padding: 12px 16px; background: var(--bg-cream); color: var(--muted); font-size: 11px; }
  `;
  document.head.appendChild(css);
})();
