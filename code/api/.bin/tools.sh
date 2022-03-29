#!/usr/bin/env bash

set -ue #xv
set -o pipefail

_home="/app/code/api/.bin/"

_func=${1:-""}
_nodeEnv=${2:-""}

# =============== utilies ===============

function log() {
  echo "===============> $1 "
}

function loadEnv() {
  if [ -f "${_home}../.env" ]; then
    log "load .env"
    # export $(cat "${_home}../.env" | xargs)
    source "${_home}../.env"
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
  node ${_home}../dist/server.js
fi

if [[ "${_func}" == "build" ]]; then
  log "rm dist"
  rm -rf ${_home}../dist

  pnpm generate:env:prod
  # pnpm generate:env:more
  loadEnv
  log "build cjs"
  tsc -p ${_home}../tsconfig.commonjs.json
fi

if [[ "${_func}" == "createEnv" ]]; then
  log "createEnv"
  __envPath=""
  if [[ "${_nodeEnv}" == "prod" ]]; then
    __envPath=${_home}../.env-prod.tpl
  else
    __envPath=${_home}../.env-dev.tpl
  fi
  log "create .env.json (${_nodeEnv})"
  cat ${__envPath} >${_home}../src/_env.json
  log "create .env (${_nodeEnv})"
  node ${_home}../../lib/.bin/convertJsonToEnv.js ${__envPath} ${_home}../.env
  echo "NODE_ENV=\"${_nodeEnv}\"" >>${_home}../.env
fi

if [[ "${_func}" == "createEnvMore" ]]; then
  __envPath=${_home}../.env
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
