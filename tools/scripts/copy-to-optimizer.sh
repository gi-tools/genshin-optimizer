#!/usr/bin/env bash
# Build the GO frontend and copy the output into the deploy repo (../optimizer).
#
# Usage:
#   tools/scripts/copy-to-optimizer.sh [--skip-build]
#
# Env:
#   OPTIMIZER_DIR  target deploy repo (default: ../optimizer next to this repo)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC_DIR="$ROOT_DIR/dist/apps/frontend"
DEST_DIR="${OPTIMIZER_DIR:-$ROOT_DIR/../optimizer}"

SKIP_BUILD=false
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=true ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

if [ ! -d "$DEST_DIR/.git" ]; then
  echo "Error: $DEST_DIR is not a git repo, refusing to copy." >&2
  exit 1
fi
DEST_DIR="$(cd "$DEST_DIR" && pwd)"

if [ "$SKIP_BUILD" = false ]; then
  echo "==> Building frontend..."
  (cd "$ROOT_DIR" && yarn nx build frontend)
fi

if [ ! -f "$SRC_DIR/index.html" ]; then
  echo "Error: no build found at $SRC_DIR (missing index.html)." >&2
  exit 1
fi

echo "==> Copying $SRC_DIR -> $DEST_DIR"
# --delete removes stale hashed assets from old builds;
# the excludes protect deploy-repo files that are not part of the build.
rsync -a --delete \
  --exclude '.git' \
  --exclude '.gitignore' \
  --exclude 'CNAME' \
  "$SRC_DIR/" "$DEST_DIR/"

echo "==> Done. Changes in $DEST_DIR:"
git -C "$DEST_DIR" status --short | tail -n 20
echo "($(git -C "$DEST_DIR" status --short | wc -l | tr -d ' ') changed files)"
