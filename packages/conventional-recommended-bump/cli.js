#!/usr/bin/env node
'use strict';
var meow = require('meow');
var conventionalRecommendedBump = require('./');

var cli = meow({
  help: [
    'Usage',
    '  conventional-recommended-bump',
    '',
    'Example',
    '  conventional-recommended-bump',
    '',
    'Options',
    '  -p, --preset                   Name of the preset you want to use',
    '  -h, --header-pattern           Regex to match header pattern',
    '  -c, --header-correspondence    Comma separated parts used to define what capturing group of `headerPattern` captures what',
    '  -r, --reference-actions        Comma separated keywords that used to reference issues',
    '  -i, --issue-prefixes           Comma separated prefixes of an issue',
    '  -n, --note-keywords            Comma separated keywords for important notes',
    '  -f, --field-pattern            Regex to match other fields',
    '  -v, --verbose                  Verbose output'
  ]
}, {
  alias: {
    p: 'preset',
    h: 'headerPattern',
    c: 'headerCorrespondence',
    r: 'referenceActions',
    i: 'issuePrefixes',
    n: 'noteKeywords',
    f: 'fieldPattern',
    v: 'verbose'
  }
});

var options;
var flags = cli.flags;
var preset = flags.preset;

if (preset) {
  options = {
    preset: preset
  };
  delete flags.preset;
}

if (flags.verbose) {
  options.warn = console.warn.bind(console);
}

conventionalRecommendedBump(options, flags, function(err, releaseAs) {
  if (err) {
    console.error(err.toString());
    process.exit(1);
  }

  console.log(releaseAs);
});
