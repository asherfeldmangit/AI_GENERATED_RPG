# AI_GENERATED_RPG
Fully ai generated and tested text based rpg game

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

## 3. Front-end (React + Pixi)

```bash
$ cd web
# Install JS deps (first time or when package.json changes)
$ npm install

# Launch Vite dev-server (hot-reload)
$ npm run dev -- --host    # pass --host so other devices can access
# Open the printed URL (default http://localhost:5173)
```

You should now see:
1. Title screen → click **New Game**.
2. Opening cinematic (click to skip).
3. Party-creation → add heroes.
4. Overworld (Windridge Trail) with dynamic lighting & shrine tiles.
5. ATB battles with Elemental Resonance, Risk meter, and command menu.

---

## 4. Unit tests

```bash
# JS/TS tests (Vitest)
$ cd web
$ npm test --silent

# Python tests (Pytest) – from repo root
$ pytest -q
```

All suites should pass (▲ 11 JS/TS tests, ▲ 13 Python tests).

---

## 5. Production build / demo artifact

```bash
$ cd web
$ npm run build          # outputs static files into web/dist
$ npm run preview        # serve the production build locally
```

Each push to **main** triggers the _Build Demo_ GitHub Action which:
1. Installs deps, runs tests.
2. Builds production bundle.
3. Uploads `web/dist/` as **ai_generated_rpg-demo** artifact (kept 14 days).

Download the ZIP directly from the workflow run to share a self-contained HTML demo.

---

## 6. Sprite pipeline (optional)

Source `.aseprite` files live under `art/` (coming soon). To re-export:

```bash
$ node scripts/aseprite_export.js art/tileset_fflike.aseprite
```

The script applies the 28-colour palette in `web/assets/palette_fflike.json` and writes trimmed PNGs to an `export/` folder.
