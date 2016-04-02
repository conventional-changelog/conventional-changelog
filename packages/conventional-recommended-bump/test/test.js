'use strict';
var assert = require('assert');
var conventionalRecommendedBump = require('../');
var equal = require('core-assert').deepStrictEqual;
var fs = require('fs');
var shell = require('shelljs');

describe('conventional-recommended-bump', function() {
  before(function() {
    shell.cd('test');
    shell.exec('git init');
    fs.writeFileSync('test1', '');
  });

  after(function() {
    shell.cd('../');
  });

  it('should error if no commits in the repo', function(done) {
    conventionalRecommendedBump({}, function(err) {
      if (err) {
        assert.ok(err);
        done();
      }
    });
  });

  it('should return `{}` if no `whatBump` is found', function(done) {
    shell.exec('git add --all && git commit -m"First commit"');

    conventionalRecommendedBump({}, function(err, releaseAs) {
      equal(releaseAs, {});

      done();
    });
  });

  it('should return what is returned by `whatBump`', function(done) {
    shell.exec('git add --all && git commit -m"First commit"');

    conventionalRecommendedBump({
      whatBump: function() {
        return {
          test: 'test'
        };
      }
    }, function(err, releaseAs) {
      equal(releaseAs, {
        test: 'test'
      });

      done();
    });
  });

  it('should be a major bump', function(done) {
    conventionalRecommendedBump({
      whatBump: function() {
        return 0;
      }
    }, function(err, releaseAs) {
      equal(releaseAs, {
        level: 0,
        releaseAs: 'major'
      });

      done();
    });
  });

  it('should warn if there is no new commits since last release', function(done) {
    shell.exec('git tag v1.0.0');

    conventionalRecommendedBump({
      warn: function(warning) {
        equal(warning, 'No commits since last release');
        done();
      }
    });
  });

  it('`warn` is optional', function(done) {
    conventionalRecommendedBump({}, done);
  });

  it('should get the commits from last tag', function(done) {
    fs.writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m"Second commit"');

    conventionalRecommendedBump({
      whatBump: function(commits) {
        equal(commits.length, 1);
        done();
      }
    });
  });

  it('should not error if callback is missing', function() {
    conventionalRecommendedBump({});
  });

  it('should error if `options` is missing', function() {
    assert.throws(function() {
      conventionalRecommendedBump(function() {});
    }, 'options must be an object');
  });

  it('should error if no preset found', function(done) {
    conventionalRecommendedBump({
      preset: 'no'
    }, function(err) {
      equal(err.message, 'Preset: "no" does not exist');
      done();
    });
  });
});
