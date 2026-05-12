#!/usr/bin/env node
// Generates data/schedule.ics from data/sessions.json so students can
// subscribe to the live schedule from their own calendar app.
//
// Run from repo root:
//   node outputs/scripts/build_ics.js

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const SESSIONS_PATH = path.join(ROOT, "data", "sessions.json");
const OUT_PATH = path.join(ROOT, "data", "schedule.ics");
const ICS = require(path.join(ROOT, "js", "ics.js"));

// Defaults that mirror js/config.js. Keep these in sync if they change there.
const OPTS = {
  classTime:   "19:00",
  durationMin: 90,
  tzid:        "Africa/Kampala",
  zoomUrl:     "https://duke.zoom.us/j/96991939005",
  zoomId:      "969 9193 9005",
};

const sessions = JSON.parse(fs.readFileSync(SESSIONS_PATH, "utf8"));
const ics = ICS.calendarFor(sessions, OPTS);
fs.writeFileSync(OUT_PATH, ics, "utf8");
console.log(`✓ wrote ${path.relative(ROOT, OUT_PATH)} — ${sessions.length} events`);
