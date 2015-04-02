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

    if (typeof options.referenceKeywords === 'string') {
      options.referenceKeywords = options.referenceKeywords.split(',');
    }

    if (typeof options.noteKeywords === 'string') {
      options.noteKeywords = options.noteKeywords.split(',');
    }

    if (typeof options.headerCorrespondence === 'string') {
      options.headerCorrespondence = options.headerCorrespondence.split(',');
    }
  }

  options = _.extend({
    warn: function() {},
    headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
    headerCorrespondence: ['type', 'scope', 'subject'],
    referenceKeywords: [
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
  }, options);

  return through.obj(function(data, enc, cb) {
    var commit;

    try {
      commit = parser(data.toString(), options);
      cb(null, commit);
    } catch (err) {
      if (options.warn === true) {
        cb(err);
      } else {
        options.warn(err.toString());
        cb(null, '');
      }
    }
  });
}

module.exports = conventionalCommitsParser;
