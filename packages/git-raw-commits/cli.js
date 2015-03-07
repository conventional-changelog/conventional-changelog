#!/usr/bin/env node
'use strict';
var meow = require('meow');
var gitRawCommits = require('./');

var cli = meow({
  help: [
    'Usage',
    '  git-raw-commits [<git-log(1) options>]',
    '',
    'Example',
    '  git-raw-commits --grep unicorn -E --from HEAD~2 --to HEAD^'
  ].join('\n')
});

gitRawCommits(cli.flags, true);
