#! /bin/sh
if ([ "$TRAVIS_BRANCH" = "master" ] || [ ! -z "$TRAVIS_TAG" ]) && [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
  echo "Start Deployment"
  # Install modules
  npm i -g makeshift jsdoc &&
  # Publish to npm
  ## Set NPM_TOKEN
  makeshift &&
  echo "npm publish" &&
  npm publish &&

  # Publish to GitHub Pages
  ## Prepare ssh keys
  $(npm bin)/set-up-ssh --key "$encrypted_752e87b9cdd6_key" \
                        --iv "$encrypted_752e87b9cdd6_iv" \
                        --path-encrypted-key ".travis/github_deploy_key.enc"
  ## Create a javascript file for web browsers
  gulp browserify &&
  ## Create JSDoc
  jsdoc -r ./lib -d ./api-output &&
  ## Checkout gh-pages
  git fetch &&
  git branch gh-pages origin/gh-pages &&
  git checkout gh-pages &&
  ## Add files to gh-pages
  mkdir -p js/ &&
  cp ./browser/diplomacy.js ./js &&
  rm -rf ./api &&
  mv api-output ./api &&
  ## Push to GitHub Pages
  git add js/diplomacy.js
  git add api
  git commit --allow-empty -m "Release ${TRAVIS_TAG}" &&
  echo "push to gh-pages" &&
  git push -q origin gh-pages &&
  ## Cleanup
  cd ../ &&
  rm -r gh-pages &&
  git worktree prune
fi
