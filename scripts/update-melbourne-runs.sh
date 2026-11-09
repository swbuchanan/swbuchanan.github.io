#!/usr/bin/env bash
set -euo pipefail

# Copies the Melbourne running project's generated progress artefacts into
# this site. Regenerate them first, in a melbourne-run-project checkout:
#
#   uv run python -m melbourne_run.strava_sync   # optional: pull new runs
#   uv run python -m melbourne_run.publish       # writes publish/
#
# then run this with the path to that publish/ directory. The map is already
# a valid standalone document when it is written, so this is a plain copy;
# contrast update-runs.sh, which has to repair the older Canberra export.

if [[ $# -ne 1 || ! -d "$1" ]]; then
  echo "Usage: $0 /path/to/melbourne-run-project/publish" >&2
  exit 2
fi

source_dir="$1"
site_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

for name in melbourne_progress.html melbourne_progress.json; do
  if [[ ! -f "$source_dir/$name" ]]; then
    echo "Missing $source_dir/$name; run melbourne_run.publish first." >&2
    exit 1
  fi
done

install -m 0644 "$source_dir/melbourne_progress.html" "$site_root/static/melbourne_progress.html"
install -m 0644 "$source_dir/melbourne_progress.json" "$site_root/data/melbourne_progress.json"

echo "Updated static/melbourne_progress.html and data/melbourne_progress.json"

