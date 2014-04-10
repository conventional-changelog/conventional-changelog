#!/usr/bin/env node

var pkg = require('./package.json');
var fs = require('fs');
var changelog = require('./index.js');
var request = require('request');

changelog({
  codename: pkg.codename,
  version: pkg.version,
  repository: 'https://github.com/ajoslin/conventional-changelog'
}, function(err, log) {
  if (err) throw new Error(err);
  fs.writeFileSync('CHANGELOG.md', log);
});

