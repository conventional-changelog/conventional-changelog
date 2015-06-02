'use strict';
var parser = require('./lib/parser');
var regex = require('./lib/regex');
var through = require('through2');
var _ = require('lodash');

function conventionalCommitsParser(options) {
  options = _.extend({
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
    noteKeywords: ['BREAKING CHANGE'],
    fieldPattern: /^-(.*?)-$/,
    warn: function() {}
  }, options);

  var headerPattern = options.headerPattern;
  var fieldPattern = options.fieldPattern;

  if (typeof headerPattern === 'string') {
    options.headerPattern = new RegExp(headerPattern);
  }

  if (typeof options.headerCorrespondence === 'string') {
    options.headerCorrespondence = options.headerCorrespondence.split(',');
  }

  if (typeof options.referenceKeywords === 'string') {
    options.referenceKeywords = options.referenceKeywords.split(',');
  }

  if (typeof options.noteKeywords === 'string') {
    options.noteKeywords = options.noteKeywords.split(',');
  }

  if (typeof fieldPattern === 'string') {
    options.fieldPattern = new RegExp(fieldPattern);
  }

  var reg = regex(options);

  return through.obj(function(data, enc, cb) {
    var commit;

    try {
      commit = parser(data.toString(), options, reg);
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
