#! /bin/sh

## Create JSDoc
gulp docs &&
mkdir -p public &&
cat << EOF > ./public/index.html &&
<html><head></head>
<body>
<a href="./docs/">Documentations</a><br />
</body>
</html>
EOF
touch ./public/.nojekyll &&
rm -rf ./public/docs &&
mv ./docs ./public/docs
