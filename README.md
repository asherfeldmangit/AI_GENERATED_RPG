# AI_GENERATED_RPG
Fully ai generated and tested text based rpg game

## Quick start (backend & pygame)

```bash
# clone and enter repo
git clone <repo-url>
cd AI_GENERATED_RPG

# one-time setup – creates .venv and installs Python deps
./scripts/bootstrap.sh        # macOS / Linux
#  – or –
powershell scripts\bootstrap.ps1   # Windows

# activate venv each session
source .venv/bin/activate     # or .venv\Scripts\activate on Windows

# run terminal version
python main.py

# run pygame prototype
python -m ai_rpg.pygame_frontend
```

## Front-end (React)

```bash
cd web
npm install        # first time
npm run dev -- --host
# open the printed URL (http://localhost:5173)
```
