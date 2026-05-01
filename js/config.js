/* Public config — safe to commit. Allowlist lives in data/allowlist.json. */
const USMLE_CONFIG = {
  // Get this from Google Cloud Console → APIs & Services → Credentials → Create OAuth client (Web)
  // Authorized JS origins must include your hosted URL (e.g. https://bakesiga.github.io) and http://localhost:5151 for local preview.
  GOOGLE_CLIENT_ID: "269521341031-mjkthkigvhiltjd9p8v6ogsiri0hfeqh.apps.googleusercontent.com",

  // Public Google Calendar embed URL. Make a calendar (e.g. "USMLE Class"), set it public, then
  // copy the "Embed code" iframe `src` and paste below. Theme params keep it dark-friendly.
  CALENDAR_EMBED_URL: "https://calendar.google.com/calendar/embed?src=54aef5b7d76c45980812c13fefef1095298082a8ee4818d831e71eddec424ced%40group.calendar.google.com&ctz=America%2FNew_York",

  // Where data files live, relative to the page
  DATA: {
    sessions:      "data/sessions.json",
    materials:     "data/materials.json",
    announcements: "data/announcements.json",
    allowlist:     "data/allowlist.json",
  },
};
