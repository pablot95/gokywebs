#!/usr/bin/env bash
# Deploy incremental a Hostinger desde la PC: lo corre cada minuto la tarea «Gokywebs deploy».
# Hace lo mismo que .github/workflows/deploy-hostinger.yml, que no corre mientras GitHub Actions
# siga bloqueado por facturación (3-nov-2026). Si un push no llegó al servidor, sube lo que
# cambió entre la marca del servidor y origin/main.
set -euo pipefail

REPO=/c/Users/pablo/OneDrive/Escritorio/Gokywebs/Gokywebsweb
LLAVE=~/.ssh/gokywebs_deploy
SRV=u739671719@195.200.3.71
DESTINO=domains/gokywebs.com/public_html
MARCA=domains/gokywebs.com/.deploy-sha
TRABAJO=/c/Users/pablo/gk-deploy
mkdir -p "$TRABAJO"
LOG="$TRABAJO/deploy.log"

# Una sola corrida a la vez; un candado de más de 20 min es de una corrida que murió.
CANDADO="$TRABAJO/candado"
if ! mkdir "$CANDADO" 2>/dev/null; then
  [ -n "$(find "$CANDADO" -maxdepth 0 -mmin +20 2>/dev/null)" ] || exit 0
  rm -rf "$CANDADO"; mkdir "$CANDADO"
fi
trap 'rm -rf "$CANDADO"' EXIT

ssh_srv() { ssh -i "$LLAVE" -p 65002 -o BatchMode=yes -o ConnectTimeout=20 "$SRV" "$@"; }
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*" >> "$LOG"; }

cd "$REPO"
git fetch -q origin main
nuevo=$(git rev-parse origin/main)
previo=$(ssh_srv "cat $MARCA 2>/dev/null || true" | tr -d '[:space:]')
[ "$nuevo" != "$previo" ] || exit 0
if [ -z "$previo" ] || ! git cat-file -e "$previo^{commit}" 2>/dev/null; then
  log "ERROR: la marca del servidor ($previo) no es un commit conocido; no se sube nada."
  exit 1
fi

lista=$(mktemp -d)
git diff --no-renames --name-only --diff-filter=ACMRT "$previo" "$nuevo" > "$lista/subir"
git diff --no-renames --name-only --diff-filter=D "$previo" "$nuevo" > "$lista/borrar"

# Se extrae primero en una carpeta aparte del servidor y después rsync reemplaza cada archivo
# con un rename: el sitio nunca se queda sin el archivo. autocrlf apagado para subir los
# archivos tal cual están en git, sin los CRLF de Windows.
if [ -s "$lista/subir" ]; then
  tmp=".deploy-tmp/$nuevo"
  GIT_LITERAL_PATHSPECS=1 xargs -d '\n' -a "$lista/subir" \
    git -c core.autocrlf=false -c core.eol=lf archive --format=tar "$nuevo" -- \
    | ssh_srv "rm -rf $tmp && mkdir -p $tmp && tar -x -i -C $tmp"
  ssh_srv "rsync -rlt --chmod=D755,F644 $tmp/ $DESTINO/ && rm -rf $tmp"
fi
# Solo se borra lo que git borró: los datos del servidor (wabot/data, etc.) no se tocan.
if [ -s "$lista/borrar" ]; then
  ssh_srv "cd $DESTINO && while IFS= read -r f; do rm -f -- \"\$f\"; done" < "$lista/borrar"
fi
ssh_srv "echo $nuevo > $MARCA"
log "$previo -> $nuevo: $(wc -l < "$lista/subir") subidos, $(wc -l < "$lista/borrar") borrados"
rm -rf "$lista"
