#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npm run start -- --port 3000 >/tmp/next-load.log 2>&1 &
echo $! >/tmp/next-load.pid

cleanup() {
  if [[ -f /tmp/next-load.pid ]]; then
    kill "$(cat /tmp/next-load.pid)" 2>/dev/null || true
  fi
}
trap cleanup EXIT

for i in $(seq 1 60); do
  if curl -sf http://127.0.0.1:3000/ >/dev/null; then
    echo "Server is ready"
    break
  fi
  sleep 1
done

BASE_URL=http://127.0.0.1:3000 k6 run load/homepage.js
