'use strict';
var conventionalChangelogCore = require('conventional-changelog-core');
var angular = require('conventional-changelog-angular');

function conventionalChangelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  options = options || {};
  options.config = angular;
  return conventionalChangelogCore(options, context, gitRawCommitsOpts, parserOpts, writerOpts);
}

module.exports = conventionalChangelog;
