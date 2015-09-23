'use strict';
var compareFunc = require('compare-func');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;
var semver = require('semver');
var _ = require('lodash');

function presetOpts(cb) {
  var parserOpts = {
    headerPattern: /^\[(.*): (.*)] (.*)$/,
    headerCorrespondence: [
    'task',
    'type',
    'shortDesc'
    ],
    noteKeywords: 'BREAKING CHANGE',
    referenceActions: [
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
    issuePrefixes: [
    '#'
    ]
  };

  var writerOpts = {
    transform: function(commit) {
      if (commit.type === 'FEAT') {
        commit.type = 'Features';
      } else if (commit.type === 'FIX') {
        commit.type = 'Bug Fixes';
      } else {
        return;
      }

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7);
      }

      _.map(commit.notes, function(note) {
        if (note.title === 'BREAKING CHANGE') {
          note.title = 'BREAKING CHANGES';
        }

        return note;
      });

      return commit;
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['type', 'shortDesc'],
    noteGroupsSort: 'title',
    notesSort: compareFunc,
    generateOn: function(commit) {
      return semver.valid(commit.version);
    }
  };

  Q.all([
    readFile(resolve(__dirname, '../templates/jira/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/jira/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/jira/commit.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/jira/footer.hbs'), 'utf-8')
  ])
    .spread(function(template, header, commit, footer) {
      writerOpts.mainTemplate = template;
      writerOpts.headerPartial = header;
      writerOpts.commitPartial = commit;
      writerOpts.footerPartial = footer;

      cb(null, {
        parserOpts: parserOpts,
        writerOpts: writerOpts
      });
    });
}

module.exports = presetOpts;
