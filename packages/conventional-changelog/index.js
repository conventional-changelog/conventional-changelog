'use strict';
var conventionalChangelogCore = require('conventional-changelog-core');

function conventionalChangelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  options.warn = options.warn || function() {};

  var scope = '';

  if (options.scope) {
    scope = options.scope.toLowerCase() + '/';
  }

  if (options.preset) {
    try {
      options.config = require(scope + 'conventional-changelog-' + options.preset.toLowerCase());
    } catch (err) {
      var errMessage = 'Preset: "' + options.preset + '" does not exist';
      errMessage += scope !== '' ?  ' under scope "' + options.scope + '"' : '';
      options.warn(errMessage);
    }
  }

  return conventionalChangelogCore(options, context, gitRawCommitsOpts, parserOpts, writerOpts);
}

module.exports = conventionalChangelog;
