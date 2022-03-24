#!/usr/bin/env bash

set -ue #xv
set -o pipefail

_home="/app/code/lib/.bin/"

_func=${1:-""}

# =============== utilies ===============

function log() {
  echo "===============> $1 "
}

function loadEnv() {
  if [ -f "${_home}../.env" ]; then
    # export $(cat "${_home}../.env" | xargs)
    source "${_home}../.env"
  fi
}

# =============== action ===============

if [[ "${_func}" == "build" ]]; then
  loadEnv
  log "build cjs"
  tsc -p ${_home}../tsconfig.json
  log "build esm"
  tsc -p ${_home}../tsconfig.esm.json
fi

if [[ "${_func}" == "buildWatch" ]]; then
  loadEnv
  log "buildWatch"
  tsc -p ${_home}../tsconfig.json -w &
    tsc -p ${_home}../tsconfig.esm.json -w
fi

if [[ "${_func}" == "" ]]; then
  echo "please add args"
fi
