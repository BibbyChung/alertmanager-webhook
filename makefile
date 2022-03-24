workspace-up:
	cd ./ops/local && docker-compose -p line-notify-bridge up -d p-workspace
	cd ./ops/local && docker-compose -p line-notify-bridge exec p-workspace /bin/bash

project-up: project-down
	cd ./ops/local && docker-compose -p line-notify-bridge up
project-down:
	cd ./ops/local && docker-compose -p line-notify-bridge down
project-build:
	cd ./ops/local && docker-compose -p line-notify-bridge build
project-logs:
	cd ./ops/local && docker-compose -p line-notify-bridge logs -f

k8s-all: k8s-gen-env k8s-build k8s-publish
k8s-gen-env:
	cd ./ops/k8s && ./proc.sh "k8s" "gen-env"
k8s-build:
	cd ./ops/k8s && ./proc.sh "k8s" "build"
k8s-publish:
	cd ./ops/k8s && ./proc.sh "k8s" "publish"