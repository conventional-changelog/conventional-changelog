#!/bin/bash

for d in ./packages/* ; do
  echo "installing deps for $d"
  cd $d
  npm i
  cd ../../
done
