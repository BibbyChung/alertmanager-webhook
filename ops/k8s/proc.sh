#!/usr/bin/env bash

set -ue #xv
set -o pipefail

_func=$1
_ver="1.0"

_projectName="bibbynet"
# _registryDomain="hub.docker.com"

_homePath=$(pwd)/../..

_apiImage0="${_projectName}/alertmanager-webhook:${_ver}"
_apiImage1="${_projectName}/alertmanager-webhook:latest"

if [[ "${_func}" == "build_push" ]]; then

  docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    -t ${_apiImage0} \
    -f ./docker/api.dockerfile ${_homePath}

  docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    -t ${_apiImage1} \
    -f ./docker/api.dockerfile ${_homePath}

fi

if [[ "${_func}" == "gen-env" ]]; then

  cat >${_homePath}/ops/k8s/kustomize/base/.env <<EOF
API_IMAGE=${_apiImage0}
EOF

fi
