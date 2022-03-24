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
