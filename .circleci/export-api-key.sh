#!/bin/sh

set -eu

echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" >> ~/.npmrc
chmod 600 ~/.npmrc
