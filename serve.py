#!/usr/bin/env python3
"""Local preview server for the USMLE dashboard.

Serves the static site at http://localhost:5151 so Google Sign-In can complete
against an authorised origin you've added in Google Cloud Console.
"""

import http.server
import socketserver
from pathlib import Path

PORT = 5151
ROOT = Path(__file__).resolve().parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        # Disable caching so JSON edits show up on refresh
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main() -> None:
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"USMLE dashboard preview → http://localhost:{PORT}")
        print("Ctrl-C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")


if __name__ == "__main__":
    main()
