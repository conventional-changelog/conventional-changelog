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
    shell.mkdir('angular');
    shell.cd('angular');
    shell.exec('git init');
    writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m "chore: first commit"');
    writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m "feat($compile): new feature"');
    writeFileSync('test3', '');
    shell.exec('git add --all && git commit -m "perf(ngOptions): make it faster"');
  },
  function() { // 2
    writeFileSync('test4', '');
    execSync('git add --all && git commit -m "feat(): amazing new module" -m "BREAKING CHANGE: Not backward compatible."');
  },
  function() { // 3
    writeFileSync('test5', '');
    execSync('git add --all && git commit -m "feat(): another amazing new module" -m "Super backward compatible."');
  },
  function() { // 4
    writeFileSync('test6', '');
    var hash = execSync('git rev-parse HEAD~1').toString();
    execSync('git add --all && git commit -m "revert: feat(): amazing new module" -m "This reverts commit ' + hash.trim() + '."');
  },
  function() { // 5
    writeFileSync('test7', '');
    execSync('git add --all && git commit -m "feat(noteKeywords): make BREAKING CHANGE more forgiving\n\nPeople might type BREAKING CHANGES unintentionally. EG: https://github.com/angular/angular/commit/098b461"');
  }
]);

betterThanBefore.tearsWithJoy(function() {
  shell.cd('../');
  shell.rm('-rf', 'angular');
});

describe('preset', function() {
  describe('angular', function() {
    var opts = {
      preset: 'angular'
    };

    it('should release as minor', function(done) {
      preparing(1);

      conventionalRecommendedBump(opts, function(err, releaseType) {
        equal(releaseType, {
          level: 1,
          reason: 'There are 0 BREAKING CHANGES and 1 features',
          releaseType: 'minor'
        });

        done();
      });
    });

    it('should merge parserOpts', function(done) {
      preparing(1);

      conventionalRecommendedBump(opts, {
        headerPattern: /^(\w*)\: (.*)$/,
      }, function(err, releaseType) {
        equal(releaseType, {
          level: 2,
          reason: 'There are 0 BREAKING CHANGES and 0 features',
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
          reason: 'There are 1 BREAKING CHANGES and 1 features',
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
          reason: 'There are 1 BREAKING CHANGES and 2 features',
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
          reason: 'There are 0 BREAKING CHANGES and 2 features',
          releaseType: 'minor'
        });

        done();
      });
    });

    it('should not ignore a reverted commit', function(done) {
      preparing(4);

      conventionalRecommendedBump({
        preset: 'angular',
        ignoreReverted: false
      }, function(err, releaseType) {
        equal(releaseType, {
          level: 0,
          reason: 'There are 1 BREAKING CHANGES and 2 features',
          releaseType: 'major'
        });

        done();
      });
    });

    it('should not be major', function(done) {
      preparing(5);

      conventionalRecommendedBump(opts, function(err, releaseType) {
        equal(releaseType, {
          level: 1,
          reason: 'There are 0 BREAKING CHANGES and 3 features',
          releaseType: 'minor'
        });

        done();
      });
    });
  });
});
