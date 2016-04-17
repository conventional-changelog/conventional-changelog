'use strict';
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;

var parserOpts = {
  headerPattern: /^(\w*)\: (.*)$/,
  headerCorrespondence: [
    'component',
    'shortDesc'
  ]
};

var writerOpts = {
  transform: function(commit) {
    if (!commit.component || typeof commit.component !== 'string') {
      return;
    }

    if (typeof commit.hash === 'string') {
      commit.hash = commit.hash.substring(0, 7);
    }

    return commit;
  },
  groupBy: 'component',
  commitGroupsSort: 'title',
  commitsSort: ['component', 'shortDesc']
};

module.exports = Q.all([
  readFile(resolve(__dirname, 'templates/template.hbs'), 'utf-8'),
  readFile(resolve(__dirname, 'templates/header.hbs'), 'utf-8'),
  readFile(resolve(__dirname, 'templates/commit.hbs'), 'utf-8')
])
  .spread(function(template, header, commit) {
    writerOpts.mainTemplate = template;
    writerOpts.headerPartial = header;
    writerOpts.commitPartial = commit;

    return {
      parserOpts: parserOpts,
      writerOpts: writerOpts
    };
  });
