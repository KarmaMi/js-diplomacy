#! /bin/sh

## Create a javascript file for web browsers
gulp browserify &&
## Create JSDoc
gulp docs &&
mkdir -p public &&
mkdir -p public/js &&
cp ./browser/diplomacy.js ./public/js &&
rm -rf ./public/docs &&
mv ./out ./public/docs
