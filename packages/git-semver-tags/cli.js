#!/usr/bin/env node
'use strict';
var meow = require('meow');
var gitSemverTags = require('./');

var args = meow({
  help: [
    'Usage',
    '  git-semver-tags',
    'Options',
    ' --lerna parse lerna style git tags',
    ' --package when listing lerna style tags, filter by a package'
  ]
});

gitSemverTags(function(err, tags) {
  if (err) {
    console.error(err.toString());
    process.exit(1);
  }

  console.log(tags.join('\n'));
}, {
  lernaTags: args.flags.lerna,
  package: args.flags.package
});
