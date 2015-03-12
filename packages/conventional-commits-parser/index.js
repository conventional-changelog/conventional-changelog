'use strict';
var _ = require('lodash');
var parser = require('./lib/parser');
var through = require('through2');

function conventionalCommitsParser(options) {
  if (options && !_.isEmpty(options)) {
    var headerPattern = options.headerPattern;
    if (typeof headerPattern === 'string') {
      options.headerPattern = new RegExp(headerPattern);
    }

    if (typeof options.closeKeywords === 'string') {
      options.closeKeywords = options.closeKeywords.split(',');
    }

    if (typeof options.noteKeywords === 'string') {
      options.noteKeywords = options.noteKeywords.split(',');
    }
  }

  options = _.extend({
    maxSubjectLength: 80,
    headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
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
    noteKeywords: [
      'BREAKING CHANGE'
    ]
  }, options || {});

  return through.obj(function(data, enc, cb) {
    var commit = parser(data.toString(), options);

    if (commit) {
      cb(null, commit);
    } else {
      cb(null, '');
    }
  });
}

module.exports = conventionalCommitsParser;
