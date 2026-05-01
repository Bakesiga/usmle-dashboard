/* Google Sign-In + per-student track allowlist.
 * The allowlist lives in data/allowlist.json. Each student has tracks: a subset of ["step1","step2"].
 */
const USMLE_AUTH = (() => {
  const SESSION_KEY = "usmle.session.v2";
  const ALLOW_CACHE_KEY = "usmle.allowlist.v2";

  function decodeJWT(token) {
    const payload = token.split(".")[1];
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  }

  function normalizeAllowlist(json) {
    // Accept v2 ({students:[{email,tracks}]}) or legacy v1 ({emails:[]}, gives all tracks)
    if (Array.isArray(json.students)) {
      return json.students.map((s) => ({
        email: String(s.email || "").toLowerCase().trim(),
        tracks: Array.isArray(s.tracks) && s.tracks.length ? s.tracks : ["step1", "step2"],
      }));
    }
    if (Array.isArray(json.emails)) {
      return json.emails.map((e) => ({ email: String(e).toLowerCase().trim(), tracks: ["step1", "step2"] }));
    }
    return [];
  }

  async function loadAllowlist() {
    try {
      const res = await fetch(USMLE_CONFIG.DATA.allowlist, { cache: "no-store" });
      if (!res.ok) throw new Error("allowlist fetch failed");
      const json = await res.json();
      const students = normalizeAllowlist(json);
      sessionStorage.setItem(ALLOW_CACHE_KEY, JSON.stringify(students));
      return students;
    } catch (e) {
      const cached = sessionStorage.getItem(ALLOW_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  }

  function lookup(email) {
    const cached = sessionStorage.getItem(ALLOW_CACHE_KEY);
    const students = cached ? JSON.parse(cached) : [];
    const e = email.toLowerCase().trim();
    return students.find((s) => s.email === e) || null;
  }

  function handleCredential(jwt) {
    let claims;
    try {
      claims = decodeJWT(jwt);
    } catch (e) {
      return { ok: false, error: "Could not read your Google credential. Try again." };
    }
    if (!claims.email_verified) {
      return { ok: false, error: "Your Google email is not verified." };
    }
    const entry = lookup(claims.email);
    if (!entry) {
      return { ok: false, error: `${claims.email} is not on the class allowlist. Message Allan to be added.` };
    }
    const session = {
      email: entry.email,
      tracks: entry.tracks,
      name: claims.name || entry.email,
      picture: claims.picture || "",
      signedInAt: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, session };
  }

  function getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    if (window.google && google.accounts && google.accounts.id) {
      try { google.accounts.id.disableAutoSelect(); } catch (e) {}
    }
    location.replace("index.html");
  }

  function requireSession() {
    const s = getSession();
    if (!s) { location.replace("index.html"); return null; }
    return s;
  }

  loadAllowlist();

  return { handleCredential, getSession, signOut, requireSession, loadAllowlist };
})();
