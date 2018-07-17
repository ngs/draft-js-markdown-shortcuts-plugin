
#!/bin/sh

set -eu

COMMIT=$(git rev-parse --short HEAD)
BRANCH=gh-pages
GIT_URL=$(git config --get remote.origin.url)
DIR=.deploy

rm -rf $DIR

git clone $GIT_URL -b $BRANCH $DIR || (
  git init $DIR &&
  cd $DIR &&
  git remote add origin $GIT_URL &&
  git checkout -b $BRANCH
)

rm -rf ${DIR}/*
cp -R ${DIR}/../demo/public/* $DIR
rm -rf ${DIR}/.circleci
cp -R ${DIR}/../demo/publicTemplate/.circleci $DIR
cd $DIR
git add -A
git commit -m "Built artifacts of ${COMMIT}"
git push origin $BRANCH
