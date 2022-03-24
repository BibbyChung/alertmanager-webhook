#!/usr/bin/env bash

set -ue #xv
set -o pipefail

_func=$1
_ver="1.0"

_projectName="bibbynet"
_registryDomain="hub.docker.com"

_homePath=$(pwd)/../..

_apiImage0="${_registryDomain}/${_projectName}/alertmanager-webhook:${_ver}"
_apiImage1="${_registryDomain}/${_projectName}/alertmanager-webhook:latest"

if [[ "${_func}" == "build" ]]; then

  docker build \
    -t ${_apiImage0} \
    -f ./docker/api.dockerfile ${_homePath}

  docker build \
    -t ${_apiImage1} \
    -f ./docker/api.dockerfile ${_homePath}

fi

if [[ "${_func}" == "gen-env" ]]; then

  cat >${_homePath}/ops/k8s/kustomize/base/.env <<EOF
API_IMAGE=${_apiImage0}
EOF

fi

if [[ "${_func}" == "publish" ]]; then

  docker push ${_apiImage0}
  docker push ${_apiImage1}

fi
