'use strict';
var concat = require('concat-stream');
var conventionalCommitsFilter = require('conventional-commits-filter');
var conventionalCommitsParser = require('conventional-commits-parser');
var gitLatestSemverTag = require('git-latest-semver-tag');
var gitRawCommits = require('git-raw-commits');
var objectAssign = require('object-assign');

var VERSIONS = ['major', 'minor', 'patch'];

function conventionalRecommendedBump(options, parserOpts, cb) {
  var preset;
  var noop = function() {};

  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }

  if (typeof parserOpts === 'function') {
    cb = parserOpts;
  } else {
    cb = cb || noop;
  }

  options = objectAssign({
    ignoreReverted: true,
    warn: function() {}
  }, options);

  if (options.preset) {
    try {
      preset = require('./presets/' + options.preset);
    } catch (err) {
      cb(new Error('Preset: "' + options.preset + '" does not exist'));
      return;
    }
  } else {
    preset = {};
  }

  var whatBump = options.whatBump || preset.whatBump || noop;
  parserOpts = objectAssign({}, preset.parserOpts, parserOpts);
  parserOpts.warn = parserOpts.warn || options.warn;

  gitLatestSemverTag(function(err, tag) {
    if (err) {
      cb(err);
      return;
    }

    gitRawCommits({
      format: '%B%n-hash-%n%H',
      from: tag
    })
      .pipe(conventionalCommitsParser(parserOpts))
      .pipe(concat(function(data) {
        var commits;

        if (options.ignoreReverted) {
          commits = conventionalCommitsFilter(data);
        } else {
          commits = data;
        }

        if (!commits || !commits.length) {
          options.warn('No commits since last release');
        }

        var result = whatBump(commits);

        if (typeof result === 'number') {
          result = {
            level: result
          };
        }

        if (result && result.level != null) {
          result.releaseAs = VERSIONS[result.level];
        } else if (result == null) {
          result = {};
        }

        cb(null, result);
      }));
  });
}

module.exports = conventionalRecommendedBump;
