/* ICS (iCalendar) generation utilities — used by the dashboard for
 * per-session "Add to Calendar" buttons and the full-schedule subscribe link.
 *
 * Class times are stored in EAT (Africa/Kampala, UTC+3) per USMLE_CONFIG.
 * We emit each event with a TZID so calendar apps display the correct
 * local time wherever the student is in the world.
 */
const USMLE_ICS = (() => {
  const PROD_ID = "-//Allan Bakesiga USMLE//USMLE Step 1 Cohort//EN";

  // VTIMEZONE block for Africa/Kampala — fixed +03:00, no DST.
  const VTIMEZONE_EAT = [
    "BEGIN:VTIMEZONE",
    "TZID:Africa/Kampala",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0300",
    "TZOFFSETTO:+0300",
    "TZNAME:EAT",
    "END:STANDARD",
    "END:VTIMEZONE",
  ].join("\r\n");

  const pad = (n) => String(n).padStart(2, "0");

  // "YYYYMMDDTHHMMSS" in the event's local TZ.
  function localToICS(dateStr, timeStr) {
    // dateStr "YYYY-MM-DD"; timeStr "HH:MM"
    const [y, m, d] = dateStr.split("-").map(Number);
    const [hh, mm] = timeStr.split(":").map(Number);
    return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
  }

  function addMinutes(dateStr, timeStr, addMins) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const [hh, mm] = timeStr.split(":").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d, hh, mm + addMins));
    return {
      date: `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`,
      time: `${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}`,
    };
  }

  // RFC 5545: fold long lines at 75 octets, escape commas/semicolons/newlines.
  function escapeText(s) {
    return String(s == null ? "" : s)
      .replace(/\\/g, "\\\\")
      .replace(/\r?\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }
  function foldLine(line) {
    if (line.length <= 75) return line;
    const out = [];
    for (let i = 0; i < line.length; i += 74) {
      out.push((i === 0 ? "" : " ") + line.slice(i, i + 74));
    }
    return out.join("\r\n");
  }

  function nowStamp() {
    const d = new Date();
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
           `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  }

  // Build a single VEVENT block for one session.
  function vevent(session, opts) {
    const o = Object.assign({
      classTime:    "19:00",
      durationMin:  90,
      tzid:         "Africa/Kampala",
      zoomUrl:      "",
      zoomId:       "",
    }, opts || {});

    const startLocal = localToICS(session.date, o.classTime);
    const end = addMinutes(session.date, o.classTime, o.durationMin);
    const endLocal = localToICS(end.date, end.time);

    const summary = `USMLE Step 1${session.chapter ? ` · ${session.chapter}` : ""}${
      session.day ? ` · Day ${session.day}` : ""
    }: ${session.topic || "Class"}`;

    const descParts = [];
    if (session.notes) descParts.push(session.notes);
    if (session.fa_pages) descParts.push(`First Aid: ${session.fa_pages}`);
    if (o.zoomUrl) descParts.push(`Join Zoom: ${o.zoomUrl}`);
    if (o.zoomId) descParts.push(`Meeting ID: ${o.zoomId}`);
    descParts.push("Dashboard: https://bakesiga.github.io/usmle-dashboard");

    const lines = [
      "BEGIN:VEVENT",
      `UID:${session.id || session.date}@bakesiga.github.io`,
      `DTSTAMP:${nowStamp()}`,
      `DTSTART;TZID=${o.tzid}:${startLocal}`,
      `DTEND;TZID=${o.tzid}:${endLocal}`,
      `SUMMARY:${escapeText(summary)}`,
      `DESCRIPTION:${escapeText(descParts.join("\n\n"))}`,
      o.zoomUrl ? `URL:${o.zoomUrl}` : null,
      o.zoomUrl ? `LOCATION:${escapeText(o.zoomUrl)}` : null,
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeText(summary)}`,
      "END:VALARM",
      "END:VEVENT",
    ].filter(Boolean);

    return lines.map(foldLine).join("\r\n");
  }

  function calendarFor(sessions, opts) {
    const events = sessions.map((s) => vevent(s, opts)).join("\r\n");
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:${PROD_ID}`,
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:USMLE Step 1 (June cohort)",
      "X-WR-CALDESC:Daily USMLE Step 1 class schedule with Allan Bakesiga.",
      "X-WR-TIMEZONE:Africa/Kampala",
      VTIMEZONE_EAT,
      events,
      "END:VCALENDAR",
    ].join("\r\n") + "\r\n";
  }

  // Browser helpers: trigger a download of a single-session .ics
  function downloadOneSession(session, opts) {
    if (typeof document === "undefined") return;
    const ics = calendarFor([session], opts);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeId = (session.id || session.date || "class").replace(/[^a-z0-9-]/gi, "-");
    a.download = `usmle-${safeId}.ics`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }

  // "Add to Google Calendar" deep link (one-off event)
  function googleCalendarUrl(session, opts) {
    const o = Object.assign({
      classTime: "19:00", durationMin: 90, tzid: "Africa/Kampala",
      zoomUrl: "", zoomId: "",
    }, opts || {});
    // Google deep link uses UTC times, formatted as YYYYMMDDTHHMMSSZ
    const [y, m, d] = session.date.split("-").map(Number);
    const [hh, mm] = o.classTime.split(":").map(Number);
    // EAT is UTC+3 with no DST
    const startUTC = new Date(Date.UTC(y, m - 1, d, hh - 3, mm));
    const endUTC = new Date(startUTC.getTime() + o.durationMin * 60 * 1000);
    const fmt = (dt) =>
      `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T` +
      `${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}Z`;
    const dates = `${fmt(startUTC)}/${fmt(endUTC)}`;
    const text = `USMLE Step 1${session.chapter ? ` · ${session.chapter}` : ""}: ${session.topic || "Class"}`;
    const detail = [
      session.notes || "",
      session.fa_pages ? `First Aid: ${session.fa_pages}` : "",
      o.zoomUrl ? `Join Zoom: ${o.zoomUrl}` : "",
      "Dashboard: https://bakesiga.github.io/usmle-dashboard",
    ].filter(Boolean).join("\n\n");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text, dates, details: detail,
      location: o.zoomUrl || "",
      ctz: o.tzid,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  }

  return { vevent, calendarFor, downloadOneSession, googleCalendarUrl };
})();

// Also expose for Node when used by the build script.
if (typeof module !== "undefined" && module.exports) {
  module.exports = USMLE_ICS;
}
