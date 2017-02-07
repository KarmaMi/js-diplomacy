#! /bin/sh
if ([ "$TRAVIS_BRANCH" == "master" ] || [ ! -z "$TRAVIS_TAG" ]) &&
    [ "$TRAVIS_PULL_REQUEST" == "false" ]
then
  # Install modules
  npm i -g makeshift jsdoc &&
  # Publish to npm
  ## Set NPM_TOKEN
  makeshift &&
  npm publish &&

  # Publish to GitHub Pages
  ## Prepare ssh keys
  $(npm bin)/set-up-ssh --key "$encrypted_752e87b9cdd6_key" \
                        --iv "$encrypted_752e87b9cdd6_iv" \
                        --path-encrypted-key ".travis/github_deploy_key.enc"
  ## Create a javascript file for web browsers
  gulp browserify &&
  ## Add files to gh-pages
  git worktree add gh-pages &&
  cd gh-pages &&
  git checkout -b gh-pages origin/gh-pages &&
  mkdir -p js/ &&
  cp ../browser/diplomacy.js ./js &&
  rm -rf ./api &&
  ## Create JSDoc
  jsdoc -r ../lib -d ./api &&
  ## Push to GitHub Pages
  git commit -am "Release ${TRAVIS_TAG}" &&
  git push -q origin gh-pages &&
  ## Cleanup
  cd ../ &&
  rm -r gh-pages &&
  git worktree prune
fi
