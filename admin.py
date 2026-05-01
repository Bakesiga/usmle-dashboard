#!/usr/bin/env python3
"""
USMLE Dashboard admin CLI.

Add students, sessions, materials, or announcements without hand-editing JSON.

Usage:
  ./admin.py student add  alice@gmail.com bob@gmail.com
  ./admin.py student list
  ./admin.py student remove  alice@gmail.com

  ./admin.py session add
  ./admin.py session list

  ./admin.py material add
  ./admin.py announce add

After editing, redeploy (see README).
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


# ── Students ────────────────────────────────────────────
def student_add(emails: list[str]) -> None:
    data = load("allowlist")
    current = {e.lower() for e in data.get("emails", [])}
    added = []
    for e in emails:
        e = e.lower().strip()
        if not e or "@" not in e:
            print(f"  ✗ skipped invalid: {e!r}")
            continue
        if e in current:
            print(f"  · already on list: {e}")
            continue
        current.add(e)
        added.append(e)
    data["emails"] = sorted(current)
    save("allowlist", data)
    print(f"Added {len(added)} student(s): {', '.join(added) if added else '—'}")
    if added:
        print()
        print("⚠ Reminder: also add these emails to each Zoom Cloud recording's")
        print("  'Only authenticated users can view' allowlist, otherwise they will")
        print("  be able to see the recording row but Zoom will block playback.")


def student_remove(emails: list[str]) -> None:
    data = load("allowlist")
    current = {e.lower() for e in data.get("emails", [])}
    removed = []
    for e in emails:
        e = e.lower().strip()
        if e in current:
            current.remove(e)
            removed.append(e)
    data["emails"] = sorted(current)
    save("allowlist", data)
    print(f"Removed {len(removed)}: {', '.join(removed) if removed else '—'}")


def student_list() -> None:
    data = load("allowlist")
    emails = data.get("emails", [])
    print(f"{len(emails)} student(s) on the allowlist:")
    for e in sorted(emails):
        print(f"  · {e}")


# ── Sessions ────────────────────────────────────────────
def session_add() -> None:
    print("New session — fill in the fields. Press Enter to skip optional ones.")
    print("(Make sure the Zoom recording is set to 'Only authenticated users can view'.)")
    today = date.today().isoformat()
    entry = {
        "id":            f"s-{uuid.uuid4().hex[:8]}",
        "date":          ask("Date (YYYY-MM-DD)", today),
        "topic":         ask("Topic"),
        "duration":      ask("Duration (e.g. 90 min)", ""),
        "tag":           ask("Tag (Step 1 / Step 2 CK / Mixed)", "Step 1"),
        "tagColor":      "pill-blue",
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
    print(f"Added session: {entry['topic']} ({entry['date']})")


def session_list() -> None:
    data = load("sessions")
    print(f"{len(data)} session(s):")
    for s in sorted(data, key=lambda x: x.get("date", ""), reverse=True):
        print(f"  · {s.get('date','?')}  {s.get('topic','(no topic)')}")


# ── Materials ───────────────────────────────────────────
def material_add() -> None:
    print("New material:")
    entry = {
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
    print(f"Added material: {entry['title']}")


# ── Announcements ───────────────────────────────────────
def announce_add() -> None:
    today = date.today().isoformat()
    entry = {
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
    print(f"Added announcement: {entry['title']}")


# ── Dispatch ────────────────────────────────────────────
HELP = __doc__


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(HELP)
        return 1
    group, cmd, *rest = argv[1:] + [""] * 2
    try:
        if group == "student" and cmd == "add":      student_add(rest)
        elif group == "student" and cmd == "remove": student_remove(rest)
        elif group == "student" and cmd == "list":   student_list()
        elif group == "session" and cmd == "add":    session_add()
        elif group == "session" and cmd == "list":   session_list()
        elif group == "material" and cmd == "add":   material_add()
        elif group == "announce" and cmd == "add":   announce_add()
        else:
            print(HELP); return 1
    except KeyboardInterrupt:
        print("\nAborted.")
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
