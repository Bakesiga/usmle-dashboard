# Allan's USMLE Class — Student Dashboard

A static, dark-themed dashboard where enrolled students sign in with Google and access:

- **Sessions** — Zoom-cloud recordings with passcodes, slides, notes, practice Qs
- **Materials** — high-yield PDFs and links, grouped by topic
- **Schedule** — embedded Google Calendar of upcoming classes
- **Announcements** — short notes pinned to the top

Access is gated by a Gmail allowlist you control (`data/allowlist.json`). No backend — hosts free on GitHub Pages or Netlify.

---

## One-time setup (15 min)

### 0. Lock down Zoom Cloud recordings (security model)

The dashboard's Google Sign-In gates the **UI** — not the recordings themselves. Real access control lives in Zoom. For every recording you share:

1. **Zoom web portal → Recordings → Cloud Recordings → click the recording → Share.**
2. Toggle **"Only authenticated users can view"** → choose **"Specific users"** (or your institution's domain if all students share it).
3. Add each student's Zoom-account email. (Same emails you put on the dashboard allowlist; they must match the email a student uses to sign in to Zoom.)
4. Optionally: turn off "Viewers can download". Leave passcode protection on as a second layer.
5. Copy the share link — that's what goes into `./admin.py session add`.

With this in place, the JSON files on the dashboard are safe to be public: a stranger who scrapes a recording URL still can't watch it without a Zoom account on the auth list.

> **Whenever you add a student to the dashboard allowlist, also add them to the Zoom recording auth list.** `./admin.py student add` prints a reminder.

### 1. Get a Google OAuth Client ID

1. Go to https://console.cloud.google.com/ → pick the **Epilepsy Uganda** project (or any project).
2. **APIs & Services → Credentials → + Create credentials → OAuth client ID**.
3. Application type: **Web application**. Name: `USMLE Dashboard`.
4. **Authorized JavaScript origins** — add both:
   - `http://localhost:5151` (local preview)
   - Your hosted URL once you pick one (e.g. `https://bakesiga.github.io`)
5. Copy the Client ID. It looks like `1234567890-abc.apps.googleusercontent.com`.
6. Paste it into `js/config.js` → `GOOGLE_CLIENT_ID`.

> If you haven't configured the OAuth consent screen yet: **APIs & Services → OAuth consent screen** → External → fill in app name + your email. You don't need to publish; "Testing" mode is fine and supports up to 100 users.

### 2. Connect Google Calendar (optional but nice)

1. Calendar → **+ Other calendars → Create new calendar** → name it `USMLE Class`.
2. Open the calendar's settings → **Access permissions → Make available to public** (read-only).
3. Scroll to **Integrate calendar → Embed code** → copy the iframe `src` URL.
4. Paste it into `js/config.js` → `CALENDAR_EMBED_URL` (keep the dark `bgcolor` params already there).

### 3. Add yourself + first students

```bash
cd ~/.claude/usmle-dashboard
./admin.py student add allanbakesiga@gmail.com student1@gmail.com student2@gmail.com
```

### 4. Preview locally

```bash
./serve.py
# → http://localhost:5151
```

Sign in with your Gmail. You should land on the dashboard.

---

## Ongoing use (after every class)

```bash
cd ~/.claude/usmle-dashboard

# Add a new recording (interactive — paste Zoom share URL + passcode)
./admin.py session add

# Drop a new high-yield material
./admin.py material add

# Post an announcement
./admin.py announce add

# Manage students
./admin.py student add  newstudent@gmail.com
./admin.py student remove  someone@gmail.com
./admin.py student list
```

Then redeploy (see below). A new session shows up the moment students refresh.

---

## Deployment

### Option A — GitHub Pages (recommended, free, version-controlled)

```bash
cd ~/.claude/usmle-dashboard
git init
git add .
git commit -m "Initial USMLE dashboard"
# Create a repo at github.com/Bakesiga/usmle-dashboard, then:
git remote add origin git@github.com:Bakesiga/usmle-dashboard.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: main, root → Save**.
You'll get a URL like `https://bakesiga.github.io/usmle-dashboard/` — add it to the OAuth client's authorized origins.

To publish updates after editing JSON:

```bash
git add data/ && git commit -m "Add session" && git push
```

### Option B — Netlify drag-and-drop

1. Go to https://app.netlify.com/drop
2. Drag the entire `usmle-dashboard/` folder onto the page.
3. Netlify gives you a URL — add it to the OAuth client's authorized origins.
4. To update: drag the folder again (or connect to GitHub).

---

## File layout

```
usmle-dashboard/
├── index.html              Sign-in landing
├── dashboard.html          Gated content (4 tabs)
├── css/style.css           Dark theme
├── js/
│   ├── config.js           Client ID + calendar URL + paths
│   ├── auth.js             Google Sign-In + allowlist check
│   └── app.js              Renders sessions / materials / schedule / announcements
├── data/
│   ├── allowlist.json      Gmail addresses with access
│   ├── sessions.json       Recording entries
│   ├── materials.json      Library entries
│   └── announcements.json  Announcements
├── admin.py                CLI for adding students/sessions/materials/announcements
├── serve.py                Local preview at :5151
└── README.md
```

---

## Security model

- **Dashboard sign-in (Google) gates the UI only.** The JSON files (`data/sessions.json`, etc.) are publicly readable on any static host — that's a property of static hosting, not a bug.
- **Recording access is enforced by Zoom.** Each recording uses Zoom's "Only authenticated users can view → specific users" setting. A scraped recording URL is useless without a Zoom account on that recording's auth list.
- **Materials.** For Google Drive PDFs/docs, set sharing to **"Restricted — only people added"** and use the same student emails. If you use **"Anyone with the link"**, the link itself becomes the shared secret — fine for non-sensitive material.
- **`GOOGLE_CLIENT_ID` is not a secret.** It's safe to commit. Google's security relies on the authorized JS origins.
- **Allowlist sync.** The dashboard allowlist (`data/allowlist.json`) and the per-recording Zoom auth list must stay aligned. Adding a student is a two-step action: `./admin.py student add` + add them on Zoom's recording sharing settings.

---

## Adding more features later

The data files are plain JSON, so it's easy to extend:

- Per-student progress tracking → would need a backend (Flask + SQLite, or a Google Sheet)
- Discussion threads → simplest is to link a private Slack/Telegram channel
- Auto-pull from Zoom Cloud → Zoom API + a cron job that writes `sessions.json`

Ask Claude to add any of these when you're ready.
