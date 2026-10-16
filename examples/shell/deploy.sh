#!/usr/bin/env bash
# Sample deploy script
set -euo pipefail

ENVIRONMENT="${1:-production}"
VERSION=$(git describe --tags --abbrev=0)
TARGET_DIR="/var/www/garden"

log() {
  echo -e "\033[32m[deploy]\033[0m $*"
}

if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
  echo "Invalid environment: $ENVIRONMENT" >&2
  exit 1
fi

log "Deploying version $VERSION to $ENVIRONMENT"

for service in api web worker; do
  log "Restarting $service..."
  systemctl restart "garden-$service" || log "Failed to restart $service"
done

rsync -az --delete ./dist/ "$TARGET_DIR/"
log "Finished at $(date +%H:%M:%S) ✅"
