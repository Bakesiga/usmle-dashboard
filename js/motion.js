/* ============================================================
   motion.js — countdown, scroll-reveal, nav-shadow, faq, drawer
   Used by index.html and signin.html. Tiny, dependency-free.
   ============================================================ */

(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Cohort countdown: June 1, 2026, 5 AM EAT (UTC+3) ---- */
  function pad(n) { return String(n).padStart(2, '0'); }

  function startCountdown(target) {
    const root = document.querySelector('[data-countdown]');
    if (!root) return;
    const dEl = root.querySelector('.d-val');
    const hEl = root.querySelector('.h-val');
    const mEl = root.querySelector('.m-val');
    const sEl = root.querySelector('.sec-val');
    const daysLabel = document.querySelector('[data-days-to-go]');

    function tick() {
      const now = (window.getNow ? window.getNow() : new Date());
      let diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        if (dEl) dEl.textContent = '00';
        if (hEl) hEl.textContent = '00';
        if (mEl) mEl.textContent = '00';
        if (sEl) sEl.textContent = '00';
        if (daysLabel) daysLabel.textContent = 'NOW';
        return;
      }
      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
      const m = Math.floor(diff / 60000);    diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      if (dEl) dEl.textContent = pad(d);
      if (hEl) hEl.textContent = pad(h);
      if (mEl) mEl.textContent = pad(m);
      if (sEl) {
        sEl.textContent = pad(s);
        if (!reduce) {
          sEl.classList.add('tick');
          setTimeout(() => sEl.classList.remove('tick'), 200);
        }
      }
      if (daysLabel) daysLabel.textContent = d;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Nav shadow on scroll ---- */
  function bindNavShadow() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Scroll-reveal with IntersectionObserver ---- */
  function bindReveal() {
    if (reduce || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-anim]').forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => entry.target.classList.add('in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
    document.querySelectorAll('[data-anim]').forEach(el => io.observe(el));

    // Safety net: any element still not "in" after 700ms gets revealed.
    // Catches first-paint races where IO fires before stagger delays apply.
    setTimeout(() => {
      document.querySelectorAll('[data-anim]:not(.in)').forEach(el => el.classList.add('in'));
    }, 700);
  }

  /* ---- Staggered children ---- */
  function bindStaggers() {
    document.querySelectorAll('[data-stagger]').forEach(parent => {
      const step = parseInt(parent.dataset.stagger, 10) || 60;
      Array.from(parent.children).forEach((child, i) => {
        if (!child.hasAttribute('data-anim')) child.setAttribute('data-anim', 'fade-up');
        child.dataset.delay = String(i * step);
      });
    });
  }

  /* ---- FAQ accordion ---- */
  function bindFaq() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    });
  }

  /* ---- Mobile nav drawer ---- */
  function bindDrawer() {
    const drawer = document.querySelector('.nav-drawer');
    const scrim = document.querySelector('.scrim');
    const open = document.querySelector('.nav-hamburger');
    const close = document.querySelector('.nav-drawer-close');
    if (!drawer || !open) return;
    function show() { drawer.classList.add('open'); scrim && scrim.classList.add('open'); }
    function hide() { drawer.classList.remove('open'); scrim && scrim.classList.remove('open'); }
    open.addEventListener('click', show);
    close && close.addEventListener('click', hide);
    scrim && scrim.addEventListener('click', hide);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', hide));
  }

  /* ---- Boot ---- */
  document.addEventListener('DOMContentLoaded', () => {
    // Cohort target — June 1 2026 5:00 EAT  ===  2026-05-31 26:00 UTC
    const target = new Date('2026-06-01T05:00:00+03:00');
    startCountdown(target);
    bindNavShadow();
    bindStaggers();
    bindReveal();
    bindFaq();
    bindDrawer();
  });
})();
