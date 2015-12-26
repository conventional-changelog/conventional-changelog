'use strict';
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;

function presetOpts(cb) {
  var parserOpts = {
    headerPattern: /^\[(.*?)(?: (.*))?] (.*)$/,
    headerCorrespondence: [
      'language',
      'type',
      'message'
    ]
  };

  var writerOpts = {
    transform: function(commit) {
      if (!commit.language) {
        return;
      }

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7);
      }

      return commit;
    },
    groupBy: 'language',
    commitGroupsSort: 'title',
    commitsSort: ['language', 'type', 'message'],
  };

  Q.all([
    readFile(resolve(__dirname, 'templates/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, 'templates/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, 'templates/commit.hbs'), 'utf-8')
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
