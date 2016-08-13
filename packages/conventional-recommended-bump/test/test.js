'use strict';
var assert = require('assert');
var conventionalRecommendedBump = require('../');
var equal = require('core-assert').deepStrictEqual;
var fs = require('fs');
var shell = require('shelljs');
var betterThanBefore = require('better-than-before')();
var preparing = betterThanBefore.preparing;

betterThanBefore.setups([
  function() { // 1
    shell.mkdir('test');
    shell.cd('test');
    shell.exec('git init');
    fs.writeFileSync('test1', '');
  },
  function() { // 2
    shell.exec('git add --all && git commit -m"First commit"');
  },
  function() { // 3
    shell.exec('git add --all && git commit -m"First commit"');
  },
  function() { // 4
    shell.exec('git tag v1.0.0');
  },
  function() { // 5
    fs.writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m"Second commit"');
  }
]);

betterThanBefore.tearsWithJoy(function() {
  shell.cd('../');
  shell.rm('-rf', 'test');
});

describe('conventional-recommended-bump', function() {
  it('should error if no commits in the repo', function(done) {
    preparing(1);

    conventionalRecommendedBump({}, function(err) {
      if (err) {
        assert.ok(err);
        done();
      }
    });
  });

  it('should return `{}` if no `whatBump` is found', function(done) {
    preparing(2);

    conventionalRecommendedBump({}, function(err, releaseType) {
      equal(releaseType, {});

      done();
    });
  });

  it('should return what is returned by `whatBump`', function(done) {
    preparing(3);

    conventionalRecommendedBump({
      whatBump: function() {
        return {
          test: 'test'
        };
      }
    }, function(err, releaseType) {
      equal(releaseType, {
        test: 'test'
      });

      done();
    });
  });

  it('should be a major bump', function(done) {
    preparing(3);

    conventionalRecommendedBump({
      whatBump: function() {
        return 0;
      }
    }, function(err, releaseType) {
      equal(releaseType, {
        level: 0,
        releaseType: 'major'
      });

      done();
    });
  });

  it('should warn if there is no new commits since last release', function(done) {
    preparing(4);

    conventionalRecommendedBump({
      warn: function(warning) {
        equal(warning, 'No commits since last release');
        done();
      }
    });
  });

  it('`warn` is optional', function(done) {
    preparing(4);

    conventionalRecommendedBump({}, done);
  });

  it('should get the commits from last tag', function(done) {
    preparing(5);

    conventionalRecommendedBump({
      whatBump: function(commits) {
        equal(commits.length, 1);
        done();
      }
    });
  });

  it('should not error if callback is missing', function() {
    preparing(5);

    conventionalRecommendedBump({});
  });

  it('should error if `options` is missing', function() {
    preparing(5);

    assert.throws(function() {
      conventionalRecommendedBump(function() {});
    }, 'options must be an object');
  });

  it('should error if no preset found', function(done) {
    preparing(5);

    conventionalRecommendedBump({
      preset: 'no'
    }, function(err) {
      equal(err.message, 'Preset: "no" does not exist');
      done();
    });
  });
});
