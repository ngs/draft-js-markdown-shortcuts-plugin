#!/bin/sh

set -eu

NODE_ENV=production webpack --config demo/webpack.config.prod.js
rm -rf demo/public/css
cp -R demo/publicTemplate/* demo/public/
