#!/bin/sh
# Rebuilds the downloads on /free-tools/ from the skill source folder.
# Run from anywhere after editing travel-operating-map/: sh free-tools/build.sh
#   travel-operating-map.zip        the skill folder at the zip root (what claude.ai expects)
#   travel-operating-map-guide.md   one-file version for a chat or Project without Skills
set -eu
cd "$(dirname "$0")"
SKILL=travel-operating-map

rm -f "$SKILL.zip"
TZ=UTC find "$SKILL" -exec touch -t 202610160000 {} +
zip -qrX "$SKILL.zip" "$SKILL" -x '*.DS_Store'

{
  printf '# The Travel Agency Operating Map: one-file guide\n\n'
  printf 'A free guide from Eliava Travel Ops (eliavatravel.com).\n\n'
  printf 'How to use it: start a new Claude chat or Project, attach this file, and say "Follow this guide and start my operating map." '
  printf 'Where the guide mentions a file in references/, that file is included further down under the same name.\n\n'
  awk 'n >= 2 { print } /^---$/ { n++ }' "$SKILL/SKILL.md" | sed '1{/^$/d;}'
  for f in steps frameworks travel-examples map-template; do
    printf '\n\n---\n\n## File: references/%s.md\n\n' "$f"
    cat "$SKILL/references/$f.md"
  done
} > "$SKILL-guide.md"

echo "Built free-tools/$SKILL.zip and free-tools/$SKILL-guide.md"
