#!/usr/bin/env python3
"""
USMLE Dashboard admin CLI (track-aware).

Tracks: step1, step2 (or "both" for items shared across tracks).

Students:
  ./admin.py student add  --tracks step1,step2  alice@gmail.com bob@gmail.com
  ./admin.py student add  --tracks step1        student@gmail.com
  ./admin.py student list
  ./admin.py student remove                     alice@gmail.com
  ./admin.py student tracks  alice@gmail.com  step1,step2

Sessions / materials / announcements (interactive prompts include track):
  ./admin.py session add
  ./admin.py session list
  ./admin.py material add
  ./admin.py announce add
"""

from __future__ import annotations

import json
import sys
import uuid
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
F = {
    "allowlist":     DATA / "allowlist.json",
    "sessions":      DATA / "sessions.json",
    "materials":     DATA / "materials.json",
    "announcements": DATA / "announcements.json",
}

VALID_TRACKS = {"step1", "step2"}
VALID_ITEM_TRACKS = VALID_TRACKS | {"both"}


def load(name: str):
    with F[name].open() as fh:
        return json.load(fh)


def save(name: str, data) -> None:
    with F[name].open("w") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    print(f"  ✔ wrote {F[name].relative_to(ROOT)}")


def ask(prompt: str, default: str = "") -> str:
    suffix = f" [{default}]" if default else ""
    val = input(f"{prompt}{suffix}: ").strip()
    return val or default


def parse_tracks(raw: str) -> list[str]:
    parts = [p.strip().lower() for p in raw.split(",") if p.strip()]
    bad = [p for p in parts if p not in VALID_TRACKS]
    if bad:
        print(f"✗ invalid track(s): {', '.join(bad)} — use step1 and/or step2")
        sys.exit(1)
    if not parts:
        print("✗ no tracks provided")
        sys.exit(1)
    # de-dup, preserve order
    seen, out = set(), []
    for p in parts:
        if p not in seen: seen.add(p); out.append(p)
    return out


def parse_item_track(raw: str) -> str:
    raw = raw.strip().lower()
    if raw not in VALID_ITEM_TRACKS:
        print(f"✗ invalid track: {raw} — use step1, step2, or both")
        sys.exit(1)
    return raw


def normalize_allowlist(data) -> dict:
    """Migrate legacy {emails:[...]} → {students:[{email,tracks}]}."""
    if "students" in data and isinstance(data["students"], list):
        return data
    if "emails" in data and isinstance(data["emails"], list):
        students = [{"email": e.lower().strip(), "tracks": ["step1", "step2"]} for e in data["emails"]]
        return {"_comment": data.get("_comment", ""), "students": students}
    return {"_comment": "", "students": []}


# ── Students ────────────────────────────────────────────
def _extract_tracks_flag(args: list[str]) -> tuple[list[str], list[str]]:
    """Pull --tracks foo,bar out of args, return (tracks, remaining)."""
    tracks = None
    remaining = []
    i = 0
    while i < len(args):
        a = args[i]
        if a == "--tracks" and i + 1 < len(args):
            tracks = parse_tracks(args[i + 1]); i += 2; continue
        if a.startswith("--tracks="):
            tracks = parse_tracks(a.split("=", 1)[1]); i += 1; continue
        remaining.append(a); i += 1
    if tracks is None:
        raw = ask("Tracks for these students (step1, step2, or step1,step2)", "step1")
        tracks = parse_tracks(raw)
    return tracks, remaining


def student_add(args: list[str]) -> None:
    tracks, emails = _extract_tracks_flag(args)
    data = normalize_allowlist(load("allowlist"))
    by_email = {s["email"].lower(): s for s in data["students"]}
    added, updated = [], []
    for e in emails:
        e = e.lower().strip()
        if not e or "@" not in e:
            print(f"  ✗ skipped invalid: {e!r}")
            continue
        if e in by_email:
            existing = set(by_email[e].get("tracks", []))
            new = sorted(existing | set(tracks))
            if list(by_email[e].get("tracks", [])) != new:
                by_email[e]["tracks"] = new
                updated.append((e, new))
            else:
                print(f"  · {e} already has tracks {new}")
        else:
            by_email[e] = {"email": e, "tracks": list(tracks)}
            added.append(e)
    data["students"] = sorted(by_email.values(), key=lambda s: s["email"])
    save("allowlist", data)
    if added:
        print(f"Added {len(added)} student(s) on {tracks}: {', '.join(added)}")
    if updated:
        print(f"Updated tracks for: " + "; ".join(f"{e} → {t}" for e, t in updated))
    print()
    print("⚠ Reminder: also add these emails to each Zoom Cloud recording's")
    print("  'Only authenticated users can view' allowlist for the matching track,")
    print("  otherwise students will see the recording row but Zoom blocks playback.")


def student_remove(emails: list[str]) -> None:
    data = normalize_allowlist(load("allowlist"))
    by_email = {s["email"].lower(): s for s in data["students"]}
    removed = []
    for e in emails:
        e = e.lower().strip()
        if e in by_email:
            del by_email[e]; removed.append(e)
    data["students"] = sorted(by_email.values(), key=lambda s: s["email"])
    save("allowlist", data)
    print(f"Removed {len(removed)}: {', '.join(removed) if removed else '—'}")


def student_set_tracks(args: list[str]) -> None:
    if len(args) < 2:
        print("Usage: ./admin.py student tracks <email> <step1|step2|step1,step2>")
        sys.exit(1)
    email, raw = args[0].lower().strip(), args[1]
    tracks = parse_tracks(raw)
    data = normalize_allowlist(load("allowlist"))
    by_email = {s["email"].lower(): s for s in data["students"]}
    if email not in by_email:
        print(f"✗ {email} not on the list. Use ./admin.py student add first.")
        sys.exit(1)
    by_email[email]["tracks"] = tracks
    data["students"] = sorted(by_email.values(), key=lambda s: s["email"])
    save("allowlist", data)
    print(f"Set {email} → {tracks}")


def student_list() -> None:
    data = normalize_allowlist(load("allowlist"))
    students = data["students"]
    print(f"{len(students)} student(s):")
    for s in sorted(students, key=lambda x: x["email"]):
        print(f"  · {s['email']:<40}  [{', '.join(s.get('tracks', []))}]")


# ── Sessions ────────────────────────────────────────────
def session_add() -> None:
    print("New session — fill in the fields. Press Enter to skip optional ones.")
    print("(Make sure the Zoom recording is set to 'Only authenticated users can view'.)")
    today = date.today().isoformat()
    track = parse_item_track(ask("Track (step1 / step2 / both)", "step1"))
    default_tag = {"step1": "Step 1", "step2": "Step 2 CK", "both": "Mixed"}[track]
    default_color = {"step1": "pill-blue", "step2": "pill-amber", "both": "pill-purple"}[track]
    entry = {
        "id":            f"s-{uuid.uuid4().hex[:8]}",
        "track":         track,
        "date":          ask("Date (YYYY-MM-DD)", today),
        "topic":         ask("Topic"),
        "duration":      ask("Duration (e.g. 90 min)", ""),
        "tag":           ask("Tag", default_tag),
        "tagColor":      default_color,
        "recording_url": ask("Zoom recording URL"),
        "slides_url":    ask("Slides URL (Google Drive)", ""),
        "notes_url":     ask("Notes URL", ""),
        "qbank_url":     ask("Practice Qs URL", ""),
        "notes":         ask("Short summary / notes", ""),
    }
    if not entry["topic"] or not entry["recording_url"]:
        print("✗ Topic and recording URL are required.")
        return
    data = load("sessions")
    data.append(entry)
    save("sessions", data)
    print(f"Added [{track}] session: {entry['topic']} ({entry['date']})")


def session_list() -> None:
    data = load("sessions")
    print(f"{len(data)} session(s):")
    for s in sorted(data, key=lambda x: x.get("date", ""), reverse=True):
        print(f"  · {s.get('date','?')}  [{s.get('track','?'):<5}]  {s.get('topic','(no topic)')}")


# ── Materials ───────────────────────────────────────────
def material_add() -> None:
    print("New material:")
    track = parse_item_track(ask("Track (step1 / step2 / both)", "step1"))
    entry = {
        "track":       track,
        "category":    ask("Category (e.g. Cardiology, Pharm, Biostats)"),
        "title":       ask("Title"),
        "description": ask("Short description", ""),
        "url":         ask("URL (Google Drive / external)"),
        "type":        ask("Type (pdf / video / link / sheet)", "pdf"),
    }
    if not entry["title"] or not entry["url"]:
        print("✗ Title and URL are required.")
        return
    data = load("materials")
    data.append(entry)
    save("materials", data)
    print(f"Added [{track}] material: {entry['title']}")


# ── Announcements ───────────────────────────────────────
def announce_add() -> None:
    today = date.today().isoformat()
    track = parse_item_track(ask("Track (step1 / step2 / both)", "both"))
    entry = {
        "track": track,
        "date":  ask("Date (YYYY-MM-DD)", today),
        "title": ask("Title"),
        "body":  ask("Body"),
    }
    if not entry["title"]:
        print("✗ Title is required.")
        return
    data = load("announcements")
    data.append(entry)
    save("announcements", data)
    print(f"Added [{track}] announcement: {entry['title']}")


# ── Dispatch ────────────────────────────────────────────
HELP = __doc__


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(HELP); return 1
    group, cmd, *rest = argv[1:] + [""] * 2
    try:
        if   group == "student"  and cmd == "add":     student_add(rest)
        elif group == "student"  and cmd == "remove":  student_remove(rest)
        elif group == "student"  and cmd == "tracks":  student_set_tracks(rest)
        elif group == "student"  and cmd == "list":    student_list()
        elif group == "session"  and cmd == "add":     session_add()
        elif group == "session"  and cmd == "list":    session_list()
        elif group == "material" and cmd == "add":     material_add()
        elif group == "announce" and cmd == "add":     announce_add()
        else:
            print(HELP); return 1
    except KeyboardInterrupt:
        print("\nAborted.")
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
