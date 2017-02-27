#! /bin/sh

## Create a javascript file for web browsers
gulp browserify &&
## Create JSDoc
gulp docs &&
mkdir -p public &&
mkdir -p public/js &&
cat << EOF > ./public/index.html &&
<html><head></head>
<body>
<a href="./docs/">Documentations</a><br />
</body>
</html>
EOF
touch ./public/.nojekyll &&
cp ./browser/diplomacy.js ./public/js &&
cp ./browser/diplomacy.js.map ./public/js &&
rm -rf ./public/docs &&
mv ./docs ./public/docs
