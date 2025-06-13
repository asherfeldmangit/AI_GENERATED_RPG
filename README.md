# AI_GENERATED_RPG
Retro-styled JRPG prototype powered by React + Pixi, Electron, and a lightweight Python gameplay core.  
Play it in the browser **or** install the native desktop build (Windows .EXE installer generated automatically).

## TL;DR – I just want to play (Windows)
1. Go to the latest [Releases](https://github.com/asherfeldmangit/AI_GENERATED_RPG/releases) page.
2. Download **`AI-Generated-RPG-Setup-<version>.exe`**.
3. Double-click the file and follow the wizard – no additional software required.
4. Launch the "AI Generated RPG" shortcut that appears on your desktop / Start Menu.

## Prerequisites

* Node.js **≥18** and npm (https://nodejs.org)
* Python **≥3.10** (for text-based prototype & unit tests)
* Git
* (Optional) **Aseprite** CLI – required only if you plan to edit & export sprites via `scripts/aseprite_export.js`.  
  Set `ASEPRITE_BIN=/path/to/aseprite` if the binary is not in your PATH.

---

## 1. Clone & bootstrap

```bash
# Clone
$ git clone <repo-url>
$ cd AI_GENERATED_RPG

# One-time Python setup – creates .venv and installs requirements
$ ./scripts/bootstrap.sh           # macOS / Linux
#  – or –  
PS> scripts\bootstrap.ps1           # Windows PowerShell
```

---

## 2. Back-end / CLI prototype (optional)

```bash
# Activate virtual-env in each terminal session
$ source .venv/bin/activate           # Windows: .venv\Scripts\activate

# Run classic text version
$ python main.py
```

---

## 3. Front-end – Browser OR Electron

```bash
$ cd web
# Install JS deps (first time or when package.json changes)
$ npm install

# Launch Vite dev-server (hot-reload)
$ npm run dev -- --host    # pass --host so other devices can access
# Open the printed URL (default http://localhost:5173)
```

### Run as a desktop app (cross-platform dev)
```bash
$ cd web
$ npm run dev:electron          # starts Vite + Electron window with hot-reload
```

You should now see:
1. Title screen → click **New Game**.
2. Opening cinematic (click to skip).
3. Party-creation → add heroes.
4. Overworld (Windridge Trail) with dynamic lighting & shrine tiles.
5. ATB battles with Elemental Resonance, Risk meter, and command menu.

---

## 4. Unit tests & coverage (should be 14 TS + 13 Py = 27 total)

```bash
# JS/TS tests (Vitest)
$ cd web
$ npm test -- --coverage        # generates coverage report in coverage/

# Python tests (Pytest) – from repo root
$ pytest -q                     # all 13 should pass
```

A CI workflow blocks merges if any test fails or coverage drops below the configured threshold.

---

## 5. Production build / Windows installer

```bash
$ cd web
# One-click static build (HTML demo)
$ npm run build

# Create a signed Windows NSIS installer (.exe)
$ npm run dist:win              # bundles Electron + game assets into dist_electron/
```
The generated installer can be uploaded to GitHub Releases so Windows users can simply download and run.

---

## 6. Sprite pipeline (optional)

Source `.aseprite` files live under `art/` (coming soon). To re-export:

```bash
$ node scripts/aseprite_export.js art/tileset_fflike.aseprite
```

The script applies the 28-colour palette in `web/assets/palette_fflike.json` and writes trimmed PNGs to an `export/` folder.
