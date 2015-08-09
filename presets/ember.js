'use strict';
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;
var semver = require('semver');

var bodyPattern = /^\[(.*) (.*)] (.*)$/;

function presetOpts(cb) {
  var parserOpts = {
    headerPattern: /^Merge pull request #(.*) from .*$/,
    headerCorrespondence: [
      'pr'
    ]
  };

  var writerOpts = {
    transform: function(commit) {
      if (!commit.pr) {
        return;
      }

      var header = commit.body || commit.footer;

      var match = header ? header.match(bodyPattern) : null;

      if (!match) {
        return;
      }

      commit.tag = match[1];
      commit.taggedAs = match[2];
      commit.message = match[3];

      if (commit.tag === 'BUGFIX') {
        commit.tag = 'Bug Fixes';
      } else if (commit.tag === 'CLEANUP') {
        commit.tag = 'Cleanup';
      } else if (commit.tag === 'FEATURE') {
        commit.tag = 'Features';
      } else if (commit.tag === 'DOC') {
        commit.tag = 'Documentation';
      } else if (commit.tag === 'SECURITY') {
        commit.tag = 'Security';
      } else {
        return;
      }

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7);
      }

      return commit;
    },
    groupBy: 'tag',
    commitGroupsSort: 'title',
    commitsSort: ['tag', 'taggedAs', 'message'],
    generateOn: function(commit) {
      return semver.valid(commit.version);
    }
  };

  Q.all([
    readFile(resolve(__dirname, '../templates/ember/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/ember/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/ember/commit.hbs'), 'utf-8')
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
