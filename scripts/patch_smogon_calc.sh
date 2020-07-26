#! /bin/sh
set -e

# This script allows you to patch in unpublished changes from @smogon/calc.
# To use it, clone git@github.com:smogon/damage-calc.git into the same projects
# folder as this repository, then run with:
#
# `yarn run patch-smogon`

(
  cd ../damage-calc
  # Rebuild package
  npm run build
  # Copy compilation artifacts to target node modules
  cp -r dist/calc/* ../visual-pokemon-calc/node_modules/@smogon/calc/dist
)
# Run patch-package to save changes to visual-pokemon-calc
yarn patch-package @smogon/calc
