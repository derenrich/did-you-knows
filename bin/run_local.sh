#!/bin/bash

set -e -x -u -o pipefail

poetry run uvicorn did_you_knows:app --reload