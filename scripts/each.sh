#!/bin/bash
# each.sh
set -e
for pkg in $(node -e 'require("./lerna.json").packages.forEach(xs => console.log(xs))'); do
  if [ -z "$FILTER" ] || [[ "$pkg" == *"$FILTER"* ]]; then
    cd $pkg
    $@
    cd -
  fi
done
