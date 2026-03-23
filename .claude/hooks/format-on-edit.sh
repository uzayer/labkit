#!/bin/bash
FILE=$(cat | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

pnpm exec prettier --write "$FILE" 2>/dev/null

if [[ "$FILE" =~ \.(ts|tsx|js|jsx)$ ]]; then
  pnpm exec eslint --fix "$FILE" 2>/dev/null
fi

exit 0
