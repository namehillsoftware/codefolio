#!/usr/bin/env bash

docker compose build && docker compose run --rm \
	-v "$(pwd)":/src -w /src \
  	-u "$(id -u)":"$(id -g)" \
  	-e NPM_AUTH_TOKEN="${NPM_AUTH_TOKEN}" \
 	npm publish
