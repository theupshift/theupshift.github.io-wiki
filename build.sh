#!/usr/bin/env bash

set -e
set -o errtrace
set -o nounset
set -o pipefail

node build.js

git add index.html
git add lexicon.js
git add wiki/*

git commit -m "Build"
