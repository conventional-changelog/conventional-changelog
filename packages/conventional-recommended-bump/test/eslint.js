'use strict';
var execSync = require('child_process').execSync;
var conventionalRecommendedBump = require('../');
var equal = require('core-assert').deepStrictEqual;
var shell = require('shelljs');
var writeFileSync = require('fs').writeFileSync;
var betterThanBefore = require('better-than-before')();
var preparing = betterThanBefore.preparing;

betterThanBefore.setups([
  function() { // 1
    shell.mkdir('eslint');
    shell.cd('eslint');
    shell.exec('git init');
    writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m "First commit"');
    writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m "New: new feature"');
    writeFileSync('test3', '');
    shell.exec('git add --all && git commit -m "Update: make it faster"');
  },
  function() { // 2
    writeFileSync('test4', '');
    execSync('git add --all && git commit -m "Breaking: amazing new module"');
  },
  function() { // 3
    writeFileSync('test5', '');
    execSync('git add --all && git commit -m "New: another amazing new module" -m "Super backward compatible."');
  },
  function() { // 4
    writeFileSync('test6', '');
    var hash = execSync('git rev-parse HEAD~1').toString();
    execSync('git add --all && git commit -m "Revert: Breaking: amazing new module" -m "This reverts commit ' + hash.trim() + '."');
  }
]);

betterThanBefore.tearsWithJoy(function() {
  shell.cd('../');
  shell.rm('-rf', 'enlint');
});

describe('preset', function() {
  describe('eslint', function() {
    var opts = {
      preset: 'eslint'
    };

    it('should release as minor', function(done) {
      preparing(1);

      conventionalRecommendedBump(opts, function(err, releaseType) {
        equal(releaseType, {
          level: 1,
          reason: 'There are 0 breaking changes and 1 features',
          releaseType: 'minor'
        });

        done();
      });
    });

    it('should merge parserOpts', function(done) {
      preparing(1);

      conventionalRecommendedBump(opts, {
        headerPattern: /(.*)$/,
      }, function(err, releaseType) {
        equal(releaseType, {
          level: 2,
          reason: 'There are 0 breaking changes and 0 features',
          releaseType: 'patch'
        });

        done();
      });
    });

    it('should release as major', function(done) {
      preparing(2);

      conventionalRecommendedBump(opts, function(err, releaseType) {
        equal(releaseType, {
          level: 0,
          reason: 'There are 1 breaking changes and 1 features',
          releaseType: 'major'
        });

        done();
      });
    });

    it('should release as major even after a feature', function(done) {
      preparing(3);

      conventionalRecommendedBump(opts, function(err, releaseType) {
        equal(releaseType, {
          level: 0,
          reason: 'There are 1 breaking changes and 2 features',
          releaseType: 'major'
        });

        done();
      });
    });

    it('should ignore a reverted commit', function(done) {
      preparing(4);

      conventionalRecommendedBump(opts, function(err, releaseType) {
        equal(releaseType, {
          level: 1,
          reason: 'There are 0 breaking changes and 2 features',
          releaseType: 'minor'
        });

        done();
      });
    });

    it('should not ignore a reverted commit', function(done) {
      preparing(4);

      conventionalRecommendedBump({
        preset: 'eslint',
        ignoreReverted: false
      }, function(err, releaseType) {
        equal(releaseType, {
          level: 0,
          reason: 'There are 1 breaking changes and 2 features',
          releaseType: 'major'
        });

        done();
      });
    });
  });
});
