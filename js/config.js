/* Public config — safe to commit. Allowlist lives in data/allowlist.json. */
const USMLE_CONFIG = {
  // Get this from Google Cloud Console → APIs & Services → Credentials → Create OAuth client (Web)
  // Authorized JS origins must include your hosted URL (e.g. https://bakesiga.github.io) and http://localhost:5151 for local preview.
  GOOGLE_CLIENT_ID: "269521341031-mjkthkigvhiltjd9p8v6ogsiri0hfeqh.apps.googleusercontent.com",

  // Public Google Calendar embed URL. Make a calendar (e.g. "USMLE Class"), set it public, then
  // copy the "Embed code" iframe `src` and paste below. Theme params keep it dark-friendly.
  CALENDAR_EMBED_URL: "https://calendar.google.com/calendar/embed?src=54aef5b7d76c45980812c13fefef1095298082a8ee4818d831e71eddec424ced%40group.calendar.google.com&ctz=America%2FNew_York",

  // ── Class logistics ────────────────────────────────
  // Daily class time in East Africa Time (UTC+3) — 24h "HH:MM"
  CLASS_TIME_EAT:     "19:00",         // 7 PM EAT
  CLASS_DURATION_MIN: 90,              // minutes
  CLASS_TZ:           "Africa/Kampala",
  ZOOM_URL:           "https://duke.zoom.us/j/96991939005",
  ZOOM_ID:            "969 9193 9005",
  // WhatsApp class group invite — fill this in once Allan creates the group.
  // Until then a falsy value hides the WhatsApp button in the nav.
  WHATSAPP_GROUP_URL: "",
  // Direct WhatsApp to Allan (used as fallback contact)
  WHATSAPP_ALLAN_URL: "https://wa.me/256705571443",

  // Giscus per-session comments. Once you've enabled Discussions on the
  // repo and installed the Giscus app, fill these in. Leaving repoId blank
  // hides the comments section.
  GISCUS: {
    repo:               "Bakesiga/usmle-dashboard",
    repoId:             "",   // from giscus.app
    category:           "Session Q&A",
    categoryId:         "",   // from giscus.app
    theme:              "light",
    mapping:            "specific",   // we anchor by session id
  },

  // Hosted .ics feed for the full schedule (auto-regenerated from sessions.json
  // by outputs/scripts/build_ics.js and served at this static path).
  SCHEDULE_ICS_URL:   "data/schedule.ics",

  // Where data files live, relative to the page
  DATA: {
    sessions:      "data/sessions.json",
    materials:     "data/materials.json",
    announcements: "data/announcements.json",
    allowlist:     "data/allowlist.json",
  },
};
