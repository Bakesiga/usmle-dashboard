/* ============================================================
   vitals.js — signature motion for the "Vitals" theme
   - ECG waveform generator + sweeping phosphor blip
   - Telemetry boot-up counters (numbers calibrate on load)
   - Cursor reticle in the hero
   - Scan-line section reveals
   - Countdown, nav-shadow, FAQ, mobile drawer, rolling readout
   Dependency-free. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2, '0');

  /* ----------------------------------------------------------
     1. ECG WAVEFORM
     Builds a repeating PQRST polyline path that fills a given
     viewBox width, normalized via pathLength="1000".
     ---------------------------------------------------------- */
  function buildECG(viewW, viewH, cycleW) {
    const midY = viewH * 0.5;
    const amp = viewH * 0.34;          // R-wave height
    const cycles = Math.ceil(viewW / cycleW) + 1;
    let d = `M 0 ${midY}`;
    for (let c = 0; c < cycles; c++) {
      const x = c * cycleW;
      // proportional landmarks within one cycle
      const p = (f) => (x + cycleW * f).toFixed(1);
      d += ` L ${p(0.12)} ${midY}`;                       // baseline
      d += ` L ${p(0.17)} ${(midY - amp * 0.16).toFixed(1)}`; // P up
      d += ` L ${p(0.22)} ${midY}`;                       // P down
      d += ` L ${p(0.30)} ${midY}`;                       // baseline
      d += ` L ${p(0.33)} ${(midY + amp * 0.18).toFixed(1)}`; // Q
      d += ` L ${p(0.36)} ${(midY - amp).toFixed(1)}`;        // R spike
      d += ` L ${p(0.39)} ${(midY + amp * 0.34).toFixed(1)}`; // S
      d += ` L ${p(0.44)} ${midY}`;                       // baseline
      d += ` L ${p(0.58)} ${midY}`;                       // baseline
      d += ` L ${p(0.66)} ${(midY - amp * 0.28).toFixed(1)}`; // T up
      d += ` L ${p(0.74)} ${midY}`;                       // T down
      d += ` L ${p(1.0)} ${midY}`;                        // baseline to next
    }
    return d;
  }

  function initECG(el) {
    const vw = parseFloat(el.dataset.vw || '1440');
    const vh = parseFloat(el.dataset.vh || '230');
    const cw = parseFloat(el.dataset.cw || '300');
    const dash = el.dataset.dash || '22 978';
    const dur  = el.dataset.dur || '4s';
    const d = buildECG(vw, vh, cw);
    el.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
    el.setAttribute('preserveAspectRatio', 'none');
    const base = el.querySelector('.ekg-base');
    const blip = el.querySelector('.ekg-blip');
    [base, blip].forEach(p => { if (p) { p.setAttribute('d', d); p.setAttribute('pathLength', '1000'); } });
    if (blip && !reduce) {
      blip.style.strokeDasharray = dash;
      blip.style.animationDuration = dur;
    }
  }

  /* ----------------------------------------------------------
     2. TELEMETRY COUNTERS — calibrate on first view
     data-telemetry="number" | data-telemetry-text="STRING"
     ---------------------------------------------------------- */
  const GLYPHS = '0123456789';
  const TXT_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ–:/ ';

  function calibrateNumber(el) {
    const finalStr = el.dataset.telemetry;
    const finalNum = parseInt(finalStr.replace(/\D/g, ''), 10);
    const suffix = finalStr.replace(/[0-9]/g, '');     // keep non-digit chars
    if (reduce || isNaN(finalNum)) { el.textContent = finalStr; return; }
    const dur = 950, t0 = performance.now();
    function frame(t) {
      const k = Math.min(1, (t - t0) / dur);
      if (k < 0.62) {
        // scramble phase
        const digits = String(finalNum).length;
        let s = '';
        for (let i = 0; i < digits; i++) s += GLYPHS[(Math.random() * 10) | 0];
        el.textContent = s + suffix;
      } else {
        // ease toward final
        const e = (k - 0.62) / 0.38;
        const eased = 1 - Math.pow(1 - e, 3);
        const val = Math.round(finalNum * eased);
        el.textContent = val + suffix;
      }
      if (k < 1) requestAnimationFrame(frame);
      else el.textContent = finalStr;
    }
    requestAnimationFrame(frame);
  }

  function calibrateText(el) {
    const finalStr = el.dataset.telemetryText;
    if (reduce) { el.textContent = finalStr; return; }
    const dur = 700, t0 = performance.now();
    function frame(t) {
      const k = Math.min(1, (t - t0) / dur);
      const lock = Math.floor(k * finalStr.length);
      let s = '';
      for (let i = 0; i < finalStr.length; i++) {
        if (i < lock || finalStr[i] === ' ') s += finalStr[i];
        else s += TXT_GLYPHS[(Math.random() * TXT_GLYPHS.length) | 0];
      }
      el.textContent = s;
      if (k < 1) requestAnimationFrame(frame);
      else el.textContent = finalStr;
    }
    requestAnimationFrame(frame);
  }

  function initTelemetry() {
    const targets = document.querySelectorAll('[data-telemetry], [data-telemetry-text]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => { el.textContent = el.dataset.telemetry || el.dataset.telemetryText; });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const el = en.target;
          const delay = parseInt(el.dataset.tdelay || '0', 10);
          setTimeout(() => {
            if (el.dataset.telemetry != null) calibrateNumber(el);
            else calibrateText(el);
          }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    targets.forEach(el => io.observe(el));
  }

  /* ----------------------------------------------------------
     3. CURSOR RETICLE (hero only, fine pointers)
     ---------------------------------------------------------- */
  function initReticle() {
    const hero = document.querySelector('.vh');
    const reticle = document.querySelector('.vh-reticle');
    if (!hero || !reticle || reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const coord = reticle.querySelector('b');
    let raf = null, x = 0, y = 0;
    hero.addEventListener('pointerenter', () => reticle.classList.add('on'));
    hero.addEventListener('pointerleave', () => reticle.classList.remove('on'));
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      x = e.clientX - r.left; y = e.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        reticle.style.transform = `translate(${x}px, ${y}px)`;
        if (coord) coord.textContent = `x${pad(Math.round(x))} y${pad(Math.round(y))}`;
        raf = null;
      });
    });
  }

  /* ----------------------------------------------------------
     4. SCAN-LINE REVEALS
     Beam is CSS (.in). Child entrance is played imperatively
     via WAAPI so content is never left hidden.
     ---------------------------------------------------------- */
  function playRise(block) {
    if (reduce || typeof block.animate !== 'function') return;
    const kids = Array.from(block.children);
    kids.forEach((kid, i) => {
      kid.animate(
        [
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 550, delay: i * 70, easing: 'cubic-bezier(0,0,0.2,1)', fill: 'backwards' }
      );
    });
  }

  function initScan() {
    const blocks = document.querySelectorAll('[data-scan]');
    if (reduce || !('IntersectionObserver' in window)) {
      blocks.forEach(b => b.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');   // fires the CSS beam
          playRise(en.target);              // plays child entrance
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    blocks.forEach(b => io.observe(b));
  }

  /* ----------------------------------------------------------
     5. COUNTDOWN — stubbed (cohort is live)
     The June 2026 cohort already started, so the ticking
     countdown is replaced by a static progress strip in markup.
     This is kept as a no-op so any stray [data-countdown] node
     does not error out.
     ---------------------------------------------------------- */
  function initCountdown() { /* no-op */ }

  /* ----------------------------------------------------------
     6. NAV / FAQ / DRAWER
     ---------------------------------------------------------- */
  function initNav() {
    const nav = document.querySelector('.v-nav');
    if (nav) {
      const on = () => nav.classList.toggle('scrolled', window.scrollY > 60);
      on(); window.addEventListener('scroll', on, { passive: true });
    }
    document.querySelectorAll('.v-faq-q').forEach(btn => {
      btn.addEventListener('click', () => btn.closest('.v-faq-item').classList.toggle('open'));
    });
    const drawer = document.querySelector('.v-drawer');
    const scrim = document.querySelector('.v-scrim');
    const open = document.querySelector('.v-ham');
    const close = document.querySelector('.v-drawer-x');
    if (drawer && open) {
      const show = () => { drawer.classList.add('open'); scrim && scrim.classList.add('open'); };
      const hide = () => { drawer.classList.remove('open'); scrim && scrim.classList.remove('open'); };
      open.addEventListener('click', show);
      close && close.addEventListener('click', hide);
      scrim && scrim.addEventListener('click', hide);
      drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', hide));
    }
  }

  /* ----------------------------------------------------------
     BOOT
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ekg').forEach(initECG);
    initTelemetry();
    initReticle();
    initScan();
    initCountdown();
    initNav();
  });
})();
