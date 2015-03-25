'use strict';
var compareFunc = require('compare-func');
var dateFormat = require('dateformat');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;
var semver = require('semver');
var through = require('through2');
var _ = require('lodash');

var regex = /tag:\s*[v=]?(.+?)[,\)]/gi;

function presetOpts(cb) {
  var parserOpts = {
    headerPattern: /^(\w*)(?:\((.*)\))?\: (.*)$/,
    headerCorrespondence: [
      'type',
      'scope',
      'subject'
    ],
    noteKeywords: 'BREAKING CHANGE'
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
      if (commit.type === 'feat') {
        commit.type = 'Features';
      } else if (commit.type === 'fix') {
        commit.type = 'Bug Fixes';
      } else if (commit.type === 'perf') {
        commit.type = 'Performance Improvements';
      } else if (commit.type === 'revert') {
        commit.type = 'Reverts';
      } else {
        return;
      }

      regex.lastIndex = 0;

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7);
      }

      if (typeof commit.subject === 'string') {
        commit.subject = commit.subject.substring(0, 80);
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
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc,
    generateOn: function(commit) {
      return semver.valid(commit.version);
    }
  };

  Q.all([
    readFile(resolve(__dirname, '../templates/angular/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/angular/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/angular/commit.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/angular/footer.hbs'), 'utf-8')
  ])
    .spread(function(template, header, commit, footer) {
      writerOpts.mainTemplate = template;
      writerOpts.headerPartial = header;
      writerOpts.commitPartial = commit;
      writerOpts.footerPartial = footer;

      cb(null, {
        parserOpts: parserOpts,
        transform: transform,
        writerOpts: writerOpts
      });
    });
}

module.exports = presetOpts;
