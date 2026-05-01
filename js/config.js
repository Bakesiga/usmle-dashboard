/* Public config — safe to commit. Allowlist lives in data/allowlist.json. */
const USMLE_CONFIG = {
  // Get this from Google Cloud Console → APIs & Services → Credentials → Create OAuth client (Web)
  // Authorized JS origins must include your hosted URL (e.g. https://bakesiga.github.io) and http://localhost:5151 for local preview.
  GOOGLE_CLIENT_ID: "REPLACE_WITH_YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com",

  // Public Google Calendar embed URL. Make a calendar (e.g. "USMLE Class"), set it public, then
  // copy the "Embed code" iframe `src` and paste below. Theme params keep it dark-friendly.
  CALENDAR_EMBED_URL: "https://calendar.google.com/calendar/embed?src=PASTE_CALENDAR_ID&ctz=America%2FNew_York&bgcolor=%230b0f17&color=%235eead4&showTitle=0&showPrint=0&showCalendars=0",

  // Where data files live, relative to the page
  DATA: {
    sessions:      "data/sessions.json",
    materials:     "data/materials.json",
    announcements: "data/announcements.json",
    allowlist:     "data/allowlist.json",
  },
};
