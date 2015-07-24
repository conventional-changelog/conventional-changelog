'use strict';
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;
var semver = require('semver');

function presetOpts(cb) {
  var parserOpts = {
    headerPattern: /^(\w*)\: (.*?)(?:\((.*)\))?$/,
    headerCorrespondence: [
      'tag',
      'message'
    ]
  };

  var writerOpts = {
    transform: function(commit) {
      if (!commit.tag || typeof commit.tag !== 'string') {
        return;
      }

      return commit;
    },
    groupBy: 'tag',
    commitGroupsSort: 'title',
    commitsSort: ['tag', 'message'],
    generateOn: function(commit) {
      return semver.valid(commit.version);
    }
  };

  Q.all([
    readFile(resolve(__dirname, '../templates/eslint/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/eslint/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/eslint/commit.hbs'), 'utf-8')
  ])
    .spread(function(template, header, commit) {
      writerOpts.mainTemplate = template;
      writerOpts.headerPartial = header;
      writerOpts.commitPartial = commit;

      cb(null, {
        parserOpts: parserOpts,
        writerOpts: writerOpts
      });
    });
}

module.exports = presetOpts;
