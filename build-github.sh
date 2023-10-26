#!/usr/bin/env bash

docker compose build && docker compose run --rm \
	-v "$(pwd)":/src -w /src \
 	npm run build
