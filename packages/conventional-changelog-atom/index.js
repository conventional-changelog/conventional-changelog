'use strict';
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;

function presetOpts(cb) {
  var parserOpts = {
    headerPattern: /^(:.*?:) (.*)$/,
    headerCorrespondence: [
      'emoji',
      'shortDesc'
    ]
  };

  var writerOpts = {
    transform: function(commit) {
      var emojiLength;

      if (!commit.emoji || typeof commit.emoji !== 'string') {
        return;
      }

      commit.emoji = commit.emoji.substring(0, 72);
      emojiLength = commit.emoji.length;

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7);
      }

      if (typeof commit.shortDesc === 'string') {
        commit.shortDesc = commit.shortDesc.substring(0, 72 - emojiLength);
      }

      return commit;
    },
    groupBy: 'emoji',
    commitGroupsSort: 'title',
    commitsSort: ['emoji', 'shortDesc']
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
