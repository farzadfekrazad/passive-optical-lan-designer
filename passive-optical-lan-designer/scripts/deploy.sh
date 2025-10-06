#!/usr/bin/env bash
set -euo pipefail

# Simple deployment script to pull changes and restart containers
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/.."
cd "${REPO_ROOT}"

echo "[deploy] Pulling latest changes..."
git pull --rebase

echo "[deploy] Building images..."
docker compose build

echo "[deploy] Starting services..."
docker compose up -d

echo "[deploy] Status:"
docker compose ps

echo "[deploy] Backend health:"
curl -s http://localhost:4001/health || true

echo "[deploy] Done."