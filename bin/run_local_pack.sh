#!/bin/bash

set -e -x -u -o pipefail

poetry export --format=requirements.txt > requirements.txt
pack build --builder tools-harbor.wmcloud.org/toolforge/heroku-builder:22 did-you-knows
docker run -e PORT=8000 -p 8000:8000 --rm --entrypoint web did-you-knows
