#!/usr/bin/env bash
set -euo pipefail

# Determine script directory and project root
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ -d .venv ]; then
  echo "🔄  .venv already exists – upgrading dependencies..."
else
  echo "🐍  Creating virtual environment in .venv"
  python3 -m venv .venv
fi

source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt

echo
echo "✅  Environment ready. Activate any time with:  source .venv/bin/activate" 