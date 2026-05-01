#!/usr/bin/env python3
"""
Wire the OAuth Client ID and Google Calendar URL into js/config.js,
then commit + push so the live site updates.

Usage:
  ./configure.py oauth   <CLIENT_ID>
  ./configure.py calendar <EMBED_URL>
  ./configure.py status

Either argument can be passed at once with no flag — the script auto-detects:
  ./configure.py 1234567-abc.apps.googleusercontent.com
  ./configure.py "https://calendar.google.com/calendar/embed?src=..."
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONFIG = ROOT / "js" / "config.js"

OAUTH_RE  = re.compile(r'(GOOGLE_CLIENT_ID:\s*)"[^"]*"')
CAL_RE    = re.compile(r'(CALENDAR_EMBED_URL:\s*)"[^"]*"')


def read() -> str:
    return CONFIG.read_text()


def write(text: str) -> None:
    CONFIG.write_text(text)
    print(f"  ✔ wrote {CONFIG.relative_to(ROOT)}")


def set_oauth(client_id: str) -> None:
    if not client_id.endswith(".apps.googleusercontent.com"):
        print("✗ Client ID should end with .apps.googleusercontent.com")
        sys.exit(1)
    text = read()
    new = OAUTH_RE.sub(rf'\g<1>"{client_id}"', text)
    if new == text:
        print("✗ Could not find GOOGLE_CLIENT_ID line in config.js")
        sys.exit(1)
    write(new)
    print(f"OAuth Client ID set: {client_id}")


def set_calendar(url: str) -> None:
    # Accept either the bare URL or the full <iframe src="..."> HTML
    m = re.search(r'src=["\']([^"\']+)["\']', url)
    if m:
        url = m.group(1)
    # Decode any HTML entities (e.g. &amp; → &) that get pasted from the embed code
    url = url.replace("&amp;", "&")
    if "calendar.google.com" not in url:
        print("✗ That doesn't look like a Google Calendar URL.")
        sys.exit(1)
    text = read()
    new = CAL_RE.sub(rf'\g<1>"{url}"', text)
    if new == text:
        print("✗ Could not find CALENDAR_EMBED_URL line in config.js")
        sys.exit(1)
    write(new)
    print(f"Calendar embed URL set:\n  {url}")


def status() -> None:
    text = read()
    m1 = OAUTH_RE.search(text)
    m2 = CAL_RE.search(text)
    oauth_val = re.search(r'"([^"]*)"', m1.group(0)).group(1) if m1 else "?"
    cal_val   = re.search(r'"([^"]*)"', m2.group(0)).group(1) if m2 else "?"
    oauth_ok  = oauth_val.endswith(".apps.googleusercontent.com") and "REPLACE_WITH" not in oauth_val
    cal_ok    = "PASTE_CALENDAR_ID" not in cal_val
    print(f"OAuth Client ID  : {'✔ set' if oauth_ok else '✗ not set'}  ({oauth_val[:40]}{'…' if len(oauth_val)>40 else ''})")
    print(f"Calendar URL     : {'✔ set' if cal_ok else '✗ not set'}")


def commit_and_push() -> None:
    try:
        subprocess.run(["git", "-C", str(ROOT), "add", "js/config.js"], check=True)
        diff = subprocess.run(
            ["git", "-C", str(ROOT), "diff", "--cached", "--quiet"],
        )
        if diff.returncode == 0:
            print("· nothing to commit")
            return
        subprocess.run(
            ["git", "-C", str(ROOT), "commit", "-m", "configure: update OAuth/calendar config"],
            check=True,
        )
        subprocess.run(["git", "-C", str(ROOT), "push"], check=True)
        print("✔ pushed to origin/main — Pages will rebuild in ~30s")
    except subprocess.CalledProcessError as e:
        print(f"✗ git step failed: {e}")
        sys.exit(1)


def auto(arg: str) -> None:
    if arg.startswith("http") and "calendar.google.com" in arg:
        set_calendar(arg)
    elif arg.endswith(".apps.googleusercontent.com"):
        set_oauth(arg)
    else:
        print("✗ Couldn't auto-detect. Use: configure.py oauth <id>  or  configure.py calendar <url>")
        sys.exit(1)


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__); return 1
    cmd = argv[1]
    if cmd == "status":
        status(); return 0
    if cmd == "oauth" and len(argv) >= 3:
        set_oauth(argv[2]); commit_and_push(); return 0
    if cmd == "calendar" and len(argv) >= 3:
        set_calendar(argv[2]); commit_and_push(); return 0
    # auto-detect single arg
    auto(cmd); commit_and_push()
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
