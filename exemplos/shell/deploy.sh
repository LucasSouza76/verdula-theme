#!/usr/bin/env bash
# Script de deploy de exemplo
set -euo pipefail

AMBIENTE="${1:-producao}"
VERSAO=$(git describe --tags --abbrev=0)
DESTINO="/var/www/jardim"

log() {
  echo -e "\033[32m[deploy]\033[0m $*"
}

if [[ "$AMBIENTE" != "producao" && "$AMBIENTE" != "homologacao" ]]; then
  echo "Ambiente inválido: $AMBIENTE" >&2
  exit 1
fi

log "Publicando versão $VERSAO em $AMBIENTE"

for servico in api web worker; do
  log "Reiniciando $servico..."
  systemctl restart "jardim-$servico" || log "Falha ao reiniciar $servico"
done

rsync -az --delete ./dist/ "$DESTINO/"
log "Concluído em $(date +%H:%M:%S) ✅"
