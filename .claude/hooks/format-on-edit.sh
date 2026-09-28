#!/bin/bash
# Format a file Claude just edited with the repo's own formatter (oxfmt, reading
# .oxfmtrc.json), so an edit lands in house style: single quotes, no semicolons.
#
# Formatting only. `oxlint --fix` is left to the pre-commit hook: run after every
# edit, its unused-imports rule deletes an import added one edit before the code
# that uses it.
FILE=$(jq -r '.tool_input.file_path // empty')

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
case "$FILE" in
  "$ROOT"/*) ;;
  *) exit 0 ;;
esac

if [[ "$FILE" =~ \.(ts|tsx|js|jsx|mjs|cjs|json|css|md)$ ]]; then
  "$ROOT/node_modules/.bin/oxfmt" "$FILE" >/dev/null 2>&1
fi

exit 0
