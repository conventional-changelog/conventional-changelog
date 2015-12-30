'use strict';
var conventionalChangelogCore = require('conventional-changelog-core');

function conventionalChangelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  var loadPreset;

  options.warn = options.warn || function() {};

  if (options.preset) {
    try {
      options.config = require('conventional-changelog-' + options.preset.toLowerCase());
      loadPreset = true;
    } catch (err) {
      loadPreset = false;
      options.warn('Preset: "' + options.preset + '" does not exist');
    }
  }

  return conventionalChangelogCore(options, context, gitRawCommitsOpts, parserOpts, writerOpts);
}

module.exports = conventionalChangelog;
