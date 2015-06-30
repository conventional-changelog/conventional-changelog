#!/usr/bin/env node
'use strict';
var meow = require('meow');
var gitSemverTags = require('./');

meow({
  help: [
    'Usage',
    '  git-semver-tags'
  ]
});

gitSemverTags(function(err, tags) {
  if (err) {
    console.error(err.toString());
    process.exit(1);
  }

  console.log(tags.join('\n'));
});
