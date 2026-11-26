#!/usr/bin/env bash
# Stamps a fresh version on the site's files so every browser (including the
# in-app browsers of WhatsApp, Instagram, Snapchat...) loads the newest files
# instead of an old saved copy. Run it before each push:   ./stamp.sh
set -euo pipefail
cd "$(dirname "$0")"
V=$(date -u +%Y%m%d%H%M%S)
sed -i -E \
  -e "s#href=\"styles\.css(\?v=[0-9]+)?\"#href=\"styles.css?v=$V\"#" \
  -e "s#src=\"data\.js(\?v=[0-9]+)?\"#src=\"data.js?v=$V\"#" \
  -e "s#src=\"main\.js(\?v=[0-9]+)?\"#src=\"main.js?v=$V\"#" \
  index.html
echo "stamped version $V"
