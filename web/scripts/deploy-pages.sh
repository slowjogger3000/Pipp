#!/bin/sh
# Builds the web app and publishes web/dist to the gh-pages branch of origin.
# GitHub Pages serves that branch at https://<user>.github.io/Pipp/.
set -e
cd "$(dirname "$0")/.."
npm run build
remote=$(git -C .. remote get-url origin)
tmp=$(mktemp -d)
cp -R dist/. "$tmp"
touch "$tmp/.nojekyll"
cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -q -m "Web app build from $(git -C "$OLDPWD/.." rev-parse --short HEAD)"
git push -q -f "$remote" gh-pages
cd - >/dev/null
rm -rf "$tmp"
echo "Published to gh-pages."
