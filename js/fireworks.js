/* ============================================================
   fireworks.js: a short celebration when a student opens the
   dashboard and there are new Step 1 results to see.

   Fires once per result batch per device. The batch key lives on
   the results block itself (data-wof-key), so bumping that key in
   dashboard.html when a new pass comes in re-arms the show for
   everyone. Append ?fireworks=1 to the URL to force it.
   ============================================================ */
(function () {
  'use strict';

  var COLORS = ['#c67139', '#e0b04a', '#7a8a5e', '#f5ead8', '#ffffff', '#d98a5a'];
  var DURATION = 6500;          // ms of launches
  var FADE     = 1400;          // ms to fade the canvas afterwards

  function shouldRun() {
    var block = document.querySelector('[data-wof-key]');
    if (!block) return false;
    var force = /[?&]fireworks=1\b/.test(location.search);
    if (!force && window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    var about = document.querySelector('.panel.active[data-panel="about"]');
    if (!about) return false;
    var key = 'usmle.fireworks.' + block.getAttribute('data-wof-key');
    try {
      if (!force && localStorage.getItem(key)) return false;
      localStorage.setItem(key, String(Date.now()));
    } catch (e) {}
    return true;
  }

  function run() {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;z-index:9999;' +
      'pointer-events:none;transition:opacity ' + FADE + 'ms ease;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      canvas.width  = Math.floor(innerWidth  * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    addEventListener('resize', size);

    var particles = [];
    var rockets   = [];
    var start = performance.now();
    var lastLaunch = 0;

    function launch() {
      rockets.push({
        x: innerWidth * (0.15 + Math.random() * 0.7),
        y: innerHeight + 10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(9 + Math.random() * 4),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        burstAt: innerHeight * (0.18 + Math.random() * 0.35)
      });
    }

    function burst(x, y, color) {
      var n = 70 + Math.floor(Math.random() * 40);
      for (var i = 0; i < n; i++) {
        var a = (Math.PI * 2 * i) / n + Math.random() * 0.15;
        var s = 2.2 + Math.random() * 4.2;
        particles.push({
          x: x, y: y,
          vx: Math.cos(a) * s, vy: Math.sin(a) * s,
          life: 1, decay: 0.010 + Math.random() * 0.012,
          color: Math.random() < 0.8 ? color : '#ffffff',
          r: 1.6 + Math.random() * 1.6
        });
      }
    }

    function frame(now) {
      var elapsed = now - start;
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      if (elapsed < DURATION && now - lastLaunch > 380 + Math.random() * 320) {
        launch(); lastLaunch = now;
        if (Math.random() < 0.35) launch();
      }

      for (var i = rockets.length - 1; i >= 0; i--) {
        var r = rockets[i];
        r.x += r.vx; r.y += r.vy; r.vy += 0.12;
        ctx.beginPath(); ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = r.color; ctx.fill();
        if (r.y <= r.burstAt || r.vy >= 0) { burst(r.x, r.y, r.color); rockets.splice(i, 1); }
      }

      for (var j = particles.length - 1; j >= 0; j--) {
        var p = particles[j];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.045; p.vx *= 0.985; p.vy *= 0.985;
        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(j, 1); continue; }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (elapsed < DURATION || particles.length || rockets.length) {
        requestAnimationFrame(frame);
      } else {
        canvas.style.opacity = '0';
        setTimeout(function () {
          removeEventListener('resize', size);
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }, FADE + 50);
      }
    }

    // A first burst straight away so the page opens to it, then the sequence.
    burst(innerWidth * 0.5, innerHeight * 0.3, COLORS[0]);
    requestAnimationFrame(frame);
  }

  function init() { if (shouldRun()) run(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.USMLE_FIREWORKS = { run: run };
})();
