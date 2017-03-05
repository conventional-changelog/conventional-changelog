#!/usr/bin/env node
'use strict';
var meow = require('meow');
var gitSemverTags = require('./');

var args = meow({
  help: [
    'Usage',
    '  git-semver-tags',
    'Options',
    ' --lerna, -l parse lerna style git tags',
    ' --package, -p when listing lerna style tags, filter by a package'
  ]
});

// the package argument only makes sense
// when used in the context of lerna-style git-tags.
if (args.flags.package && !args.flags.lerna) {
  console.error('--package should only be used when running in --lerna mode');
  process.exit(1);
}

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
