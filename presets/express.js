'use strict';
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;
var semver = require('semver');

function presetOpts(cb) {
  var parserOpts = {
    headerPattern: /^(\w*)\: (.*)$/,
    headerCorrespondence: [
      'component',
      'shortDesc'
    ]
  };

  var writerOpts = {
    transform: function(commit) {
      if (commit.component === 'perf') {
        commit.component = 'Performance';
      } else if (commit.component === 'deps') {
        commit.component = 'Dependencies';
      } else {
        return;
      }

      return commit;
    },
    groupBy: 'component',
    commitGroupsSort: 'title',
    commitsSort: ['component', 'shortDesc'],
    generateOn: function(commit) {
      return semver.valid(commit.version);
    }
  };

  Q.all([
    readFile(resolve(__dirname, '../templates/express/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/express/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, '../templates/express/commit.hbs'), 'utf-8')
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
