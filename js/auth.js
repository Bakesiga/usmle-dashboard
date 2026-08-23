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

  // Per-block recording rules. Two forms are accepted:
  //   { heme: { from: "Platelet disorders" } }  everything from that recording
  //                                             onward, including ones added later
  //   { heme: ["Platelet disorders"] }          only titles matching the list
  // Prefer the "from" form for a student who joined mid-block and stays on:
  // it needs no upkeep as new classes are appended.
  function normalizeOnlyRecordings(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const out = {};
    Object.keys(raw).forEach((blockId) => {
      const rule = raw[blockId];
      if (Array.isArray(rule)) {
        const list = rule.map((t) => String(t).trim()).filter(Boolean);
        if (list.length) out[blockId] = list;
      } else if (rule && typeof rule === "object" && rule.from) {
        const from = String(rule.from).trim();
        if (from) out[blockId] = { from: from };
      }
    });
    return Object.keys(out).length ? out : null;
  }

  // Optional whole-block lock, by block id: ["cvs"]. Every recording in a
  // listed block is locked regardless of accessFrom, and the block tile shows
  // as locked. Used when a student is entitled to the cohort but not to one
  // particular block.
  function normalizeLockedBlocks(raw) {
    if (!Array.isArray(raw)) return null;
    const list = raw.map((b) => String(b).trim()).filter(Boolean);
    return list.length ? list : null;
  }

  function normalizeAllowlist(json) {
    // Accept v2 ({students:[{email,tracks}]}) or legacy v1 ({emails:[]}, gives all tracks)
    if (Array.isArray(json.students)) {
      return json.students.map((s) => ({
        email: String(s.email || "").toLowerCase().trim(),
        tracks: Array.isArray(s.tracks) && s.tracks.length ? s.tracks : ["step1", "step2"],
        // Optional join-date gate. null => full back-access.
        accessFrom: s.accessFrom ? String(s.accessFrom).trim() : null,
        // Optional end-date gate (YYYY-MM-DD, inclusive). A recording with a
        // "date" past this is locked, regardless of block. Recordings without
        // a "date" field fall back to their block's start date, which is safe
        // for any block that closed out well before the cutoff. null => no
        // upper bound.
        accessUntil: s.accessUntil ? String(s.accessUntil).trim() : null,
        // Optional per-recording gate, keyed by block id:
        //   { heme: ["Platelet disorders"] }
        // Inside a listed block, only recordings whose title contains one of
        // the substrings unlock. Blocks absent from the map are governed by
        // accessFrom alone, so a partial entitlement in one block never leaks
        // out and locks the student out of later blocks. null => no filter.
        onlyRecordings: normalizeOnlyRecordings(s.onlyRecordings),
        // Optional whole-block lock. null => nothing locked.
        lockedBlocks: normalizeLockedBlocks(s.lockedBlocks),
      }));
    }
    if (Array.isArray(json.emails)) {
      return json.emails.map((e) => ({ email: String(e).toLowerCase().trim(), tracks: ["step1", "step2"], accessFrom: null, accessUntil: null, onlyRecordings: null, lockedBlocks: null }));
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
      accessFrom: entry.accessFrom || null,
      accessUntil: entry.accessUntil || null,
      onlyRecordings: entry.onlyRecordings || null,
      lockedBlocks: entry.lockedBlocks || null,
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
    // Sign-out lands on the public home page; sign-in page is for re-entry only.
    location.replace("index.html");
  }

  function requireSession() {
    const s = getSession();
    if (!s) { location.replace("signin.html"); return null; }
    return s;
  }

  loadAllowlist();

  return { handleCredential, getSession, signOut, requireSession, loadAllowlist };
})();
