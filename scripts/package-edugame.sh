#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
DEFAULT_FILE="$DIST_DIR/cdu-matematica-2ano.edugame"
OUTPUT_FILE="${1:-$DEFAULT_FILE}"

if [[ "$OUTPUT_FILE" = /* ]]; then
  TARGET_FILE="$OUTPUT_FILE"
else
  TARGET_FILE="$ROOT_DIR/$OUTPUT_FILE"
fi

FILES_TO_PACKAGE=()
for path in manifest.json index.html assets script.js styles.css README.md; do
  if [[ -e "$ROOT_DIR/$path" ]]; then
    FILES_TO_PACKAGE+=("$path")
  fi
done

if [[ ${#FILES_TO_PACKAGE[@]} -eq 0 ]]; then
  echo "Nenhum arquivo para empacotar foi encontrado." >&2
  exit 1
fi

mkdir -p "$(dirname "$TARGET_FILE")"
rm -f "$TARGET_FILE"

cd "$ROOT_DIR"
zip -r "$TARGET_FILE" "${FILES_TO_PACKAGE[@]}" >/dev/null

echo "Pacote gerado em: $TARGET_FILE"
