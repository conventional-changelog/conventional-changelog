'use strict';
var conventionalChangelogCore = require('conventional-changelog-core');

function conventionalChangelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  options.warn = options.warn || function() {};

  if (options.preset) {
    try {
      var scope = '';
      var name = options.preset.toLowerCase();

      if (name[0] === '@') {
        var parts = name.split('/');
        scope = parts.shift() + '/';
        name = parts.join('');
      }
      
      console.log('scope', scope, 'name', name);
      options.config = require(scope + 'conventional-changelog-' + name);
    } catch (err) {
      options.warn('Preset: "' + options.preset + '" does not exist');
    }
  }

  return conventionalChangelogCore(options, context, gitRawCommitsOpts, parserOpts, writerOpts);
}

module.exports = conventionalChangelog;
