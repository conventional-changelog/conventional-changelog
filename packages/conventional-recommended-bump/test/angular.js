'use strict';
var child = require('child_process');
var conventionalRecommendedBump = require('../');
var equal = require('core-assert').deepStrictEqual;
var shell = require('shelljs');
var writeFileSync = require('fs').writeFileSync;

describe('preset', function() {
  describe('angular', function() {
    var opts = {
      preset: 'angular'
    };

    before(function() {
      shell.cd('angular');
      shell.exec('git init');
      writeFileSync('test1', '');
      shell.exec('git add --all && git commit -m "chore: first commit"');
      writeFileSync('test2', '');
      shell.exec('git add --all && git commit -m "feat($compile): new feature"');
      writeFileSync('test3', '');
      shell.exec('git add --all && git commit -m "perf(ngOptions): make it faster"');
    });

    after(function() {
      shell.cd('../');
    });

    it('should release as minor', function(done) {
      conventionalRecommendedBump(opts, function(err, releaseAs) {
        equal(releaseAs, {
          level: 1,
          reason: 'There are 0 BREAKING CHANGES and 1 features',
          releaseAs: 'minor'
        });

        done();
      });
    });

    it('should merge parserOpts', function(done) {
      conventionalRecommendedBump(opts, {
        headerPattern: /^(\w*)\: (.*)$/,
      }, function(err, releaseAs) {
        equal(releaseAs, {
          level: 2,
          reason: 'There are 0 BREAKING CHANGES and 0 features',
          releaseAs: 'patch'
        });

        done();
      });
    });

    it('should release as major', function(done) {
      writeFileSync('test4', '');
      // fix this until https://github.com/arturadib/shelljs/issues/175 is solved
      child.exec('git add --all && git commit -m "feat(): amazing new module" -m "BREAKING CHANGE: Not backward compatible."', function() {
        conventionalRecommendedBump(opts, function(err, releaseAs) {
          equal(releaseAs, {
            level: 0,
            reason: 'There are 1 BREAKING CHANGES and 1 features',
            releaseAs: 'major'
          });

          done();
        });
      });
    });

    it('should release as major even after a feature', function(done) {
      writeFileSync('test5', '');
      // fix this until https://github.com/arturadib/shelljs/issues/175 is solved
      child.exec('git add --all && git commit -m "feat(): another amazing new module" -m "Super backward compatible."', function() {
        conventionalRecommendedBump(opts, function(err, releaseAs) {
          equal(releaseAs, {
            level: 0,
            reason: 'There are 1 BREAKING CHANGES and 2 features',
            releaseAs: 'major'
          });

          done();
        });
      });
    });

    it('should ignore a reverted commit', function(done) {
      writeFileSync('test6', '');
      child.exec('git rev-parse HEAD~1', function(err, hash) {
        // fix this until https://github.com/arturadib/shelljs/issues/175 is solved
        child.exec('git add --all && git commit -m "revert: feat(): amazing new module" -m "This reverts commit ' + hash.trim() + '."', function() {
          conventionalRecommendedBump(opts, function(err, releaseAs) {
            equal(releaseAs, {
              level: 1,
              reason: 'There are 0 BREAKING CHANGES and 2 features',
              releaseAs: 'minor'
            });

            done();
          });
        });
      });
    });

    it('should not ignore a reverted commit', function(done) {
      conventionalRecommendedBump({
        preset: 'angular',
        ignoreReverted: false
      }, function(err, releaseAs) {
        equal(releaseAs, {
          level: 0,
          reason: 'There are 1 BREAKING CHANGES and 2 features',
          releaseAs: 'major'
        });

        done();
      });
    });
  });
});
