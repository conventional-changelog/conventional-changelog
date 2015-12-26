'use strict';
var compareFunc = require('compare-func');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;

function presetOpts(cb) {
  var parserOpts = {
    headerPattern: /^\[\[(.*)]] (.*)$/,
    headerCorrespondence: [
      'type',
      'shortDesc'
    ],
    noteKeywords: 'BREAKING CHANGE'
  };

  var writerOpts = {
    transform: function(commit) {
      var type = commit.type ? commit.type.toUpperCase() : '';

      if (type === 'FEAT') {
        commit.type = 'Features';
      } else if (type === 'FIX') {
        commit.type = 'Bug Fixes';
      } else {
        return;
      }

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7);
      }

      commit.notes.forEach(function(note) {
        if (note.title === 'BREAKING CHANGE') {
          note.title = 'BREAKING CHANGES';
        }
      });

      return commit;
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['type', 'shortDesc'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  };

  Q.all([
    readFile(resolve(__dirname, 'templates/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, 'templates/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, 'templates/commit.hbs'), 'utf-8'),
    readFile(resolve(__dirname, 'templates/footer.hbs'), 'utf-8')
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
