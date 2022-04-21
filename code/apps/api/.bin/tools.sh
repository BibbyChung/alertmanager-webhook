#!/usr/bin/env bash

set -ue #xv
set -o pipefail

_currentFolder="$(realpath $0 | sed 's|\(.*\)/.*|\1|')/"

_func=${1:-""}
_nodeEnv=${2:-""}

# =============== utilies ===============

function log() {
  echo "===============> $1 "
}

function loadEnv() {
  if [ -f "${_currentFolder}../.env" ]; then
    log "load .env"
    # export $(cat "${_currentFolder}../.env" | xargs)
    source "${_currentFolder}../.env"
  fi
}

# =============== action ===============

if [[ "${_func}" == "runDev" ]]; then
  pnpm generate:env:dev
  pnpm generate:env:more
  loadEnv
  log "run dev"
  vite --host 0.0.0.0
fi

if [[ "${_func}" == "runProd" ]]; then
  loadEnv
  log "run prod"
  node ${_currentFolder}../dist/server.js
fi

if [[ "${_func}" == "build" ]]; then
  log "rm dist"
  rm -rf ${_currentFolder}../dist

  pnpm generate:env:prod
  # pnpm generate:env:more
  loadEnv
  log "build cjs"
  tsc -p ${_currentFolder}../tsconfig.commonjs.json
fi

if [[ "${_func}" == "createEnv" ]]; then
  log "createEnv"
  __envPath=""
  if [[ "${_nodeEnv}" == "prod" ]]; then
    __envPath=${_currentFolder}../.env.prod.json
  else
    __envPath=${_currentFolder}../.env.dev.json
  fi
  log "create .env.json (${_nodeEnv})"
  cat ${__envPath} >${_currentFolder}../src/_env.json
  log "create .env (${_nodeEnv})"
  node ${_currentFolder}../../../.bin/convertJsonToEnv.js ${__envPath} ${_currentFolder}../.env
  echo "NODE_ENV=\"${_nodeEnv}\"" >>${_currentFolder}../.env
  echo "VITE_NODE_ENV=\"${_nodeEnv}\"" >>${_currentFolder}../.env
fi

if [[ "${_func}" == "createEnvMore" ]]; then
  __envPath=${_currentFolder}../.env
  __isExistCount=$(cat ${__envPath} | { grep "GIT_SHORT_VER" || :; } | wc -l)
  if ((${__isExistCount} != 0)); then
    log "env more info existed"
    exit 0
  fi
  log "add env more info"
  echo "VITE_GIT_SHORT_VER=\"${_gitShortVer:-xxxx}\"" >>${__envPath}
  echo "VITE_GIT_TIME=\"${_gitTime:-xxxx}\"" >>${__envPath}
fi

if [[ "${_func}" == "" ]]; then
  echo "please add args..."
fi
