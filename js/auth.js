/* Google Sign-In + gmail allowlist gate.
 * The allowlist lives in data/allowlist.json. Adding/removing students = editing that file.
 */
const USMLE_AUTH = (() => {
  const SESSION_KEY = "usmle.session.v1";
  const ALLOW_CACHE_KEY = "usmle.allowlist.v1";

  function decodeJWT(token) {
    const payload = token.split(".")[1];
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  }

  async function loadAllowlist() {
    try {
      const res = await fetch(USMLE_CONFIG.DATA.allowlist, { cache: "no-store" });
      if (!res.ok) throw new Error("allowlist fetch failed");
      const json = await res.json();
      const emails = (json.emails || []).map((e) => e.toLowerCase().trim());
      sessionStorage.setItem(ALLOW_CACHE_KEY, JSON.stringify(emails));
      return emails;
    } catch (e) {
      const cached = sessionStorage.getItem(ALLOW_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  }

  // Synchronous allow check used in the sign-in callback.
  // We pre-load the allowlist on page load so it's cached by the time GSI fires.
  function isAllowed(email) {
    const cached = sessionStorage.getItem(ALLOW_CACHE_KEY);
    const emails = cached ? JSON.parse(cached) : [];
    return emails.includes(email.toLowerCase().trim());
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
    if (!isAllowed(claims.email)) {
      return { ok: false, error: `${claims.email} is not on the class allowlist. Message Allan to be added.` };
    }
    const session = {
      email: claims.email,
      name: claims.name || claims.email,
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

  // Pre-warm allowlist cache on script load
  loadAllowlist();

  // On the gated page, enforce session presence
  function requireSession() {
    const s = getSession();
    if (!s) { location.replace("index.html"); return null; }
    return s;
  }

  return { handleCredential, getSession, signOut, requireSession, loadAllowlist };
})();
