from __future__ import annotations

"""Cross-platform launcher that serves the built React front-end and opens the game in the user's browser.

Run with:  ``python -m ai_rpg.launcher``  (or via the console-script entry once packaged).
"""

from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import contextlib
import os
import socket
import subprocess
import sys
import webbrowser
from contextlib import suppress

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

ROOT_DIR = Path(__file__).resolve().parent.parent  # project root (AI_GENERATED_RPG)
WEB_DIR = ROOT_DIR / "web"
DIST_DIR = WEB_DIR / "dist"


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def _build_frontend() -> None:
    """Run the npm build only if web/dist does not yet exist."""
    if DIST_DIR.exists():
        return

    print("▶ Building React front-end (npm run build)…")
    try:
        # Ensure dependencies are installed (idempotent)
        subprocess.check_call(["npm", "install"], cwd=WEB_DIR)
        # Production build
        subprocess.check_call(["npm", "run", "build"], cwd=WEB_DIR)
    except FileNotFoundError as exc:
        missing = "npm" if exc.filename == "npm" else "node"
        print(f"Error: {missing} is not installed or not on PATH.", file=sys.stderr)
        sys.exit(1)


def _find_free_port() -> int:
    """Ask the OS for a free localhost port."""
    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(("", 0))
        return s.getsockname()[1]


def _serve_directory(directory: Path, port: int) -> None:
    """Serve *directory* on *port* until the process is terminated."""
    os.chdir(directory)
    handler = SimpleHTTPRequestHandler
    server = ThreadingHTTPServer(("0.0.0.0", port), handler)
    url = f"http://127.0.0.1:{port}"

    print("\n────────────────────────────────────────")
    print(f"ASCII Quest running at {url}")
    print("(Close the window to quit.)")
    print("────────────────────────────────────────\n")

    if 'webview' not in globals():
        HAVE_WEBVIEW = False
    else:
        HAVE_WEBVIEW = True

    if HAVE_WEBVIEW:
        # PyWebview runs its own loop; start server in background thread
        import threading

        threading.Thread(target=server.serve_forever, daemon=True).start()
        webview.create_window("ASCII Quest", url, min_size=(900, 700))  # type: ignore
        webview.start()  # type: ignore
        server.shutdown()
        server.server_close()
    else:
        # Fallback: open system browser
        try:
            webbrowser.open(url, new=1, autoraise=True)
        except Exception:
            pass

        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down…")
        finally:
            server.server_close()


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def run() -> None:  # noqa: D401 (imperative mood is intentional for CLI)
    """Entry-point executed by ``python -m ai_rpg.launcher`` or console script."""
    _build_frontend()
    port = _find_free_port()
    _serve_directory(DIST_DIR, port)


if __name__ == "__main__":  # pragma: no cover
    run() 