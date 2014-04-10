#!/usr/bin/env node

var pkg = require('./package.json');
var fs = require('fs');
var changelog = require('./index.js');
var request = require('request');

changelog({
  version: pkg.version,
  subtitle: '"' + pkg.codename + '"',
  repository: 'https://github.com/ajoslin/conventional-changelog'
}, function(err, log) {
  if (err) throw new Error(err);
  fs.writeFileSync('CHANGELOG.md', log);
});

