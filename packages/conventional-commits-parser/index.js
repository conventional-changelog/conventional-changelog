'use strict';
var extend = require('lodash').extend;
var parser = require('./lib/parser');
var through = require('through2');

function conventionalCommitsParser(options) {
  options = extend({
    maxSubjectLength: 80,
    headerPattern: /^(\w*)(\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
    closeKeywords: [
      'close',
      'closes',
      'closed',
      'fix',
      'fixes',
      'fixed',
      'resolve',
      'resolves',
      'resolved'
    ],
    breakKeywords: [
      'BREAKING CHANGE'
    ]
  }, options || {});

  if (!Array.isArray(options.closeKeywords)) {
    options.closeKeywords = [options.closeKeywords];
  }

  if (!Array.isArray(options.breakKeywords)) {
    options.breakKeywords = [options.breakKeywords];
  }

  return through.obj(function(data, enc, cb) {
    var commit = parser(data.toString(), options);

    if (commit) {
      cb(null, commit);
    }
    else {
      cb();
    }
  });
}

module.exports = conventionalCommitsParser;
