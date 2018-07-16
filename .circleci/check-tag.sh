#!/bin/sh

set -eu

PKG=draft-js-markdown-shortcuts-plugin
V=$(npm show $PKG version)
[ $V = $CIRCLE_TAG ] || (
  echo "${PKG} ${V} does not match with CIRCLE_TAG ${CIRCLE_TAG}"; exit 1
)
