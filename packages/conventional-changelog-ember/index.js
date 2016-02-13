'use strict';
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;

function presetOpts(cb) {
  var parserOpts = {
    mergePattern: /^Merge pull request #(.*) from .*$/,
    mergeCorrespondence: ['pr'],
    headerPattern: /^\[(.*) (.*)] (.*)$/,
    headerCorrespondence: [
      'tag',
      'taggedAs',
      'message'
    ]
  };

  var writerOpts = {
    transform: function(commit) {
      if (!commit.pr) {
        return;
      }

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
    commitsSort: ['tag', 'taggedAs', 'message']
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
        gitRawCommitsOpts: {
          noMerges: null
        },
        parserOpts: parserOpts,
        writerOpts: writerOpts
      });
    });
}

module.exports = presetOpts;
