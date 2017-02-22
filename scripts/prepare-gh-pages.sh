#! /bin/sh

## Create a javascript file for web browsers
gulp browserify &&
## Create JSDoc
gulp docs &&
mkdir -p public &&
mkdir -p public/js &&
cp ./browser/diplomacy.js ./public/js &&
cp ./browser/diplomacy.js.map ./public/js &&
rm -rf ./public/docs &&
mv ./docs ./public/docs
