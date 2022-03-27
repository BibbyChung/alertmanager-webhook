workspace-up:
	cd ./ops/dev && docker-compose -p line-notify-bridge up -d p-workspace
	cd ./ops/dev && docker-compose -p line-notify-bridge exec p-workspace /bin/bash

project-up: project-down
	cd ./ops/dev && docker-compose -p line-notify-bridge up
project-down:
	cd ./ops/dev && docker-compose -p line-notify-bridge down
project-build:
	cd ./ops/dev && docker-compose -p line-notify-bridge build
project-logs:
	cd ./ops/dev && docker-compose -p line-notify-bridge logs -f

k8s-all: k8s-gen-env k8s-build-push k8s-copy-yaml
k8s-gen-env:
	cd ./ops/k8s && ./proc.sh "gen-env"
k8s-build-push:
	cd ./ops/k8s && ./proc.sh "build-push"
k8s-copy-yaml:
	cd ./ops/k8s && ./proc.sh "copy-yaml"