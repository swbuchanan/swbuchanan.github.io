#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 || ! -f "$1" ]]; then
  echo "Usage: $0 /path/to/all_routes.html" >&2
  exit 2
fi

site_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output="$site_root/static/all_routes.html"
install -m 0644 "$1" "$output"

# Folium's standalone export omits a title and places its generated script
# after </body>. Normalize the document so it remains valid when published.
sed -i 's/<html>/<html lang="en">/' "$output"
if ! grep -q '<title>' "$output"; then
  sed -i '/<head>/a\    <title>Running every street in Canberra</title>' "$output"
fi
sed -i '/^[[:space:]]*<\/body>[[:space:]]*$/d' "$output"
sed -i '/^[[:space:]]*<\/html>[[:space:]]*$/i\</body>' "$output"

echo "Updated static/all_routes.html"
