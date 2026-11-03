/* The paper, drawn by us instead of by Google's viewer.
 *
 * Why this exists: with Drive's own preview in an iframe the student could
 * scroll it anywhere, and nothing could be done about it. The iframe is on
 * another origin, so the page cannot ask it which page is showing and cannot
 * tell it which page to show. Both were tested. Answering question 14 against
 * the stem for question 16 was therefore always possible.
 *
 * Here the page and the question are the same object. Moving to question 14
 * draws page 14, and there is nothing to scroll out of step.
 *
 * Nothing is rehosted. The file is read from the class Drive folder through
 * the Drive API with the student's own Google token, so the sharing on that
 * folder is still exactly what decides who can see anything. A student who is
 * not on the folder gets a 404 from Google and the old iframe behaviour.
 *
 * It is fetched once and kept in IndexedDB. That costs one download per form
 * per device and buys two things: later blocks start instantly, and a sitting
 * survives the connection dropping, which matters more in an exam than the
 * megabytes do.
 */
window.PAPER = (function () {
  'use strict';

  var SCOPE = 'https://www.googleapis.com/auth/drive.readonly';
  var TOKKEY = 'usmle.drive.tok.v1';
  var DB = 'usmle.papers', STORE = 'files';

  var tok = null, tokExp = 0, client = null;
  var doc = null, docId = null, page = 0, zoom = 1;
  // `page` is where the student is. `drawn` is what is actually on the
  // canvas. They differ while a render is in flight, and the gap is the
  // whole reason the first version of this showed page 2 of a 200 page
  // paper while every label on screen said page 14.
  var drawing = false, drawn = 0;
  var cv, ctx, host, statusEl;
  var onStatus = function () {};

  function cfg() { return (typeof USMLE_CONFIG !== 'undefined' ? USMLE_CONFIG : {}) || {}; }

  // ---- The token --------------------------------------------------
  (function restore() {
    try {
      var s = JSON.parse(sessionStorage.getItem(TOKKEY) || 'null');
      if (s && s.e > Date.now() + 60000) { tok = s.t; tokExp = s.e; }
    } catch (e) {}
  })();

  function gisReady() {
    return !!(window.google && google.accounts && google.accounts.oauth2);
  }

  // Must be called from inside a click: asking for a token opens a popup,
  // and a popup without a gesture behind it is a blocked popup.
  function getToken() {
    if (tok && Date.now() < tokExp - 60000) return Promise.resolve(tok);
    if (!gisReady()) return Promise.reject(new Error('gis-not-loaded'));
    if (!cfg().GOOGLE_CLIENT_ID) return Promise.reject(new Error('no-client-id'));
    return new Promise(function (resolve, reject) {
      if (!client) {
        client = google.accounts.oauth2.initTokenClient({
          client_id: cfg().GOOGLE_CLIENT_ID,
          scope: SCOPE,
          callback: function () {}
        });
      }
      client.callback = function (r) {
        if (r && r.access_token) {
          tok = r.access_token;
          tokExp = Date.now() + (Number(r.expires_in || 3600) * 1000);
          try { sessionStorage.setItem(TOKKEY, JSON.stringify({ t: tok, e: tokExp })); } catch (e) {}
          resolve(tok);
        } else {
          reject(new Error('no-token'));
        }
      };
      client.error_callback = function (e) { reject(e || new Error('token-refused')); };
      try { client.requestAccessToken({ prompt: '' }); } catch (e) { reject(e); }
    });
  }

  // ---- The cache --------------------------------------------------
  function idb() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) return reject(new Error('no-idb'));
      var r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function () {
        if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE);
      };
      r.onsuccess = function () { resolve(r.result); };
      r.onerror = function () { reject(r.error); };
    });
  }
  function cacheGet(id) {
    return idb().then(function (db) {
      return new Promise(function (resolve) {
        var t = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
        t.onsuccess = function () { resolve(t.result || null); };
        t.onerror = function () { resolve(null); };
      });
    }).catch(function () { return null; });
  }
  function cachePut(id, buf) {
    return idb().then(function (db) {
      return new Promise(function (resolve) {
        var t = db.transaction(STORE, 'readwrite').objectStore(STORE).put(buf, id);
        t.onsuccess = function () { resolve(true); };
        t.onerror = function () { resolve(false); };     // a full disk is not fatal
      });
    }).catch(function () { return false; });
  }

  // ---- Fetching ---------------------------------------------------
  function fetchFile(t, id) {
    var url = 'https://www.googleapis.com/drive/v3/files/' +
              encodeURIComponent(id) + '?alt=media&supportsAllDrives=true';
    return fetch(url, { headers: { Authorization: 'Bearer ' + t } }).then(function (res) {
      if (res.status === 401 || res.status === 403) throw new Error('no-access');
      if (res.status === 404) throw new Error('not-shared');
      if (!res.ok) throw new Error('http-' + res.status);
      var total = Number(res.headers.get('content-length') || 0);
      if (!res.body || !res.body.getReader) return res.arrayBuffer();
      var reader = res.body.getReader(), chunks = [], got = 0;
      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) {
            var out = new Uint8Array(got), at = 0;
            chunks.forEach(function (c) { out.set(c, at); at += c.length; });
            return out.buffer;
          }
          chunks.push(r.value); got += r.value.length;
          onStatus(total ? 'Loading the paper, ' + Math.round(got * 100 / total) + '%'
                         : 'Loading the paper, ' + Math.round(got / 1048576) + ' MB');
          return pump();
        });
      })();
    });
  }

  // ---- Drawing ----------------------------------------------------
  function draw() {
    if (!doc || !page) return;
    // Already busy. Whatever is current when that render lands gets drawn
    // next, so a student holding the right arrow ends on the page they
    // stopped at rather than on one from somewhere in the middle.
    if (drawing) return;
    drawing = true;
    var target = page;
    doc.getPage(target).then(function (pg) {
      var avail = Math.max(240, host.clientWidth - 24);
      var base = pg.getViewport({ scale: 1 });
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var s = (avail / base.width) * zoom;
      var vp = pg.getViewport({ scale: s * dpr });
      cv.width = vp.width; cv.height = vp.height;
      cv.style.width = (vp.width / dpr) + 'px';
      cv.style.height = (vp.height / dpr) + 'px';
      return pg.render({ canvasContext: ctx, viewport: vp }).promise;
    }).then(function () {
      drawing = false;
      drawn = target;
      if (page !== drawn) draw();
    }).catch(function () {
      drawing = false;
      onStatus('That page would not draw. Try the Drive copy.');
    });
  }

  // ---- Public -----------------------------------------------------
  function mount(opts) {
    cv = opts.canvas; host = opts.host; statusEl = opts.status;
    ctx = cv.getContext('2d', { alpha: false });
    onStatus = function (msg) { if (statusEl) statusEl.textContent = msg || ''; };
    var redraw = null;
    window.addEventListener('resize', function () {
      clearTimeout(redraw);
      redraw = setTimeout(draw, 180);
    });
  }

  function usable() {
    return !!(window.pdfjsLib && gisReady() && window.indexedDB);
  }

  // Resolves when the document is ready to draw; rejects with a reason the
  // caller can show, having already fallen back to the iframe.
  function open(fileId) {
    if (!usable()) return Promise.reject(new Error('unsupported'));
    if (doc && docId === fileId) return Promise.resolve(true);
    // Started here, synchronously, because we are inside the click that
    // began the sitting and a popup asked for later is a popup the browser
    // blocks. If the file turns out to be cached the result is discarded,
    // and for anyone who has consented once it is silent anyway.
    var tokenP = getToken().then(function (t) { return t; }, function (e) { return e; });
    onStatus('Opening the paper');
    return cacheGet(fileId).then(function (hit) {
      if (hit) { onStatus(''); return hit; }
      return tokenP.then(function (t) {
        if (typeof t !== 'string') throw (t instanceof Error ? t : new Error('no-token'));
        return fetchFile(t, fileId).then(function (buf) {
          cachePut(fileId, buf);
          return buf;
        });
      });
    }).then(function (buf) {
      // A copy, because pdf.js takes ownership of the buffer it is given
      // and the cached one has to stay readable for the next block.
      var task = pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)) });
      return task.promise;
    }).then(function (d) {
      doc = d; docId = fileId; onStatus('');
      if (page) draw();
      return true;
    });
  }

  function show(n) {
    n = Number(n) || 1;
    if (doc && n > doc.numPages) n = doc.numPages;
    page = n;
    if (doc) draw();
  }

  function setZoom(z) {
    zoom = Math.max(0.6, Math.min(2.6, z));
    draw();
    return zoom;
  }
  function getZoom() { return zoom; }
  function pages() { return doc ? doc.numPages : 0; }
  function ready() { return !!doc; }
  function reset() { doc = null; docId = null; page = 0; drawn = 0; }
  function drawnPage() { return drawn; }

  return { mount: mount, open: open, show: show, usable: usable, ready: ready,
           setZoom: setZoom, getZoom: getZoom, pages: pages, reset: reset,
           drawnPage: drawnPage };
})();
