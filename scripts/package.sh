#!/usr/bin/env bash
set -euo pipefail

archive="vault-ops-orphan-finder-0.1.0-obsidian.zip"
rm -f "$archive"
zip -q -r "$archive" manifest.json main.js styles.css README.md LICENSE
echo "Created package: $archive"
