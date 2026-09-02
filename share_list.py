#!/usr/bin/env python3
"""Generate the Zoom recording share list for a given class date.

The list is NOT simply everyone on data/allowlist.json. A student can hold
dashboard access and still be off the recording list, so the exclusions live
in the allowlist itself rather than in someone's notes:

  shareRecordings: false   never share new recordings with this student
  recordingsPaused: true   recordings locked on the dashboard, so no sharing
  accessUntil: "YYYY-MM-DD" entitlement ends on that date, inclusive

Usage:  python3 share_list.py [YYYY-MM-DD]     (defaults to today)
"""
import json, os, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))

# The host owns the recording; adding self errors in the Zoom share panel.
HOST = "allanbakesiga@gmail.com"


def build(date):
    doc = json.load(open(os.path.join(HERE, "data", "allowlist.json")))
    send, skip = [], []
    for r in doc["students"]:
        e = r["email"]
        if e == HOST:
            skip.append((e, "host, owns the recording"))
        elif r.get("shareRecordings") is False:
            skip.append((e, "shareRecordings: false"))
        elif r.get("recordingsPaused"):
            skip.append((e, "recordingsPaused: true"))
        elif r.get("accessUntil") and r["accessUntil"] < date:
            skip.append((e, "accessUntil %s" % r["accessUntil"]))
        else:
            send.append(e)
    return send, skip


if __name__ == "__main__":
    date = sys.argv[1] if len(sys.argv) > 1 else datetime.date.today().isoformat()
    send, skip = build(date)
    for e in send:
        print(e)
    sys.stderr.write("\nrecording date %s -> send %d, skip %d\n" % (date, len(send), len(skip)))
    for e, why in skip:
        sys.stderr.write("  skip  %-38s %s\n" % (e, why))
