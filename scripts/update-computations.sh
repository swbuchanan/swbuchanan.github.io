#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 || ! -f "$1" ]]; then
  echo "Usage: $0 /path/to/computations.pdf" >&2
  exit 2
fi

site_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
install -m 0644 "$1" "$site_root/content/computations.pdf"

echo "Updated content/computations.pdf"
