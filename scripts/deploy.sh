#! /bin/sh
if [ ! -z "$TRAVIS_TAG" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]
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
                        --path-encrypted-key ".travis/github_deploy_key.enc" &&
  ## Push to GitHub Pages
  $(npm bin)/update-branch --commands "$(dirname $0)/prepare-gh-pages.sh" \
                           --commit-message "Update website (${TRAVIS_TAG})" \
                           --directory "./public" \
                           --distribution-branch "gh-pages" \
                           --source-branch "master"
fi
