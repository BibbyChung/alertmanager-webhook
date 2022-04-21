#!/usr/bin/env bash

set -ue #xv
set -o pipefail

_currentFolder="$(realpath $0 | sed 's|\(.*\)/.*|\1|')/"

_func=${1:-""}

# =============== utilies ===============

function log() {
  echo "===============> $1 "
}

function loadEnv() {
  if [ -f "${_currentFolder}../.env" ]; then
    # export $(cat "${_currentFolder}../.env" | xargs)
    source "${_currentFolder}../.env"
  fi
}

# =============== action ===============

if [[ "${_func}" == "build" ]]; then
  loadEnv
  log "build cjs"
  tsc -p ${_currentFolder}../tsconfig.json
  log "build esm"
  tsc -p ${_currentFolder}../tsconfig.esm.json
fi

if [[ "${_func}" == "buildWatch" ]]; then
  loadEnv
  log "buildWatch"
  tsc -p ${_currentFolder}../tsconfig.json -w &
    tsc -p ${_currentFolder}../tsconfig.esm.json -w
fi

if [[ "${_func}" == "" ]]; then
  echo "please add args"
fi
