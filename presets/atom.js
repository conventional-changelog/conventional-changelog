'use strict';
var dateFormat = require('dateformat');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;
var semver = require('semver');
var through = require('through2');

var regex = /tag:\s*[v=]?(.+?)[,\)]/gi;

function presetOpts(cb) {
  var parserOpts = {
    headerPattern: /^(:.*?:) (.*)$/,
    headerCorrespondence: [
      'emoji',
      'shortDesc'
    ]
  };

  var transform = through.obj(function(chunk, enc, cb) {
    if (typeof chunk.gitTags === 'string') {
      var match = regex.exec(chunk.gitTags);
      if (match) {
        chunk.version = match[1];
      }
    }

    if (chunk.committerDate) {
      chunk.committerDate = dateFormat(chunk.committerDate, 'yyyy-mm-dd', true);
    }

    cb(null, chunk);
  });

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
    commitsSort: ['emoji', 'shortDesc'],
    generateOn: function(commit) {
      return semver.valid(commit.version);
    }
  };

  Q.all([
    readFile(resolve(__dirname, '../templates/jquery/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/jquery/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/jquery/commit.hbs'), 'utf-8')
  ])
    .spread(function(template, header, commit) {
      writerOpts.mainTemplate = template;
      writerOpts.headerPartial = header;
      writerOpts.commitPartial = commit;

      cb(null, {
        parserOpts: parserOpts,
        transform: transform,
        writerOpts: writerOpts
      });
    });
}

module.exports = presetOpts;
