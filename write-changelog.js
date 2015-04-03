#!/usr/bin/env node
'use strict';
var pkg = require('./package.json');
var fs = require('fs');
var changelog = require('./index.js');

changelog({
  version: pkg.version,
  repository: 'https://github.com/ajoslin/conventional-changelog'
}, function(err, log) {
  if (err) {
    throw new Error(err);
  }
  fs.writeFileSync('CHANGELOG.md', log);
});
