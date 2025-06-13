import sys
from pathlib import Path

# Add project root to PYTHONPATH so tests can import local package without installation.
ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR)) 