'use strict';
var child = require('child_process');
var conventionalRecommendedBump = require('../');
var equal = require('assert').strictEqual;
var shell = require('shelljs');
var writeFileSync = require('fs').writeFileSync;

describe('preset', function() {
  describe('angular', function() {
    before(function() {
      shell.cd('angular');
      shell.exec('git init');
      writeFileSync('test1', '');
      shell.exec('git add --all && git commit -m"chore: first commit"');
      writeFileSync('test2', '');
      shell.exec('git add --all && git commit -m"feat($compile): new feature"');
      writeFileSync('test3', '');
      shell.exec('git add --all && git commit -m"perf(ngOptions): make it faster"');
    });

    after(function() {
      shell.cd('../');
    });

    it('should release as minor', function(done) {
      conventionalRecommendedBump({
        preset: 'angular'
      }, function(err, releaseAs) {
        equal(releaseAs, 'minor');
        done();
      });
    });

    it('should merge parserOpts', function(done) {
      conventionalRecommendedBump({
        preset: 'angular'
      }, {
        headerPattern: /^(\w*)\: (.*)$/,
      }, function(err, releaseAs) {
        equal(releaseAs, 'patch');
        done();
      });
    });

    it('should release as major', function(done) {
      writeFileSync('test4', '');
      // fix this until https://github.com/arturadib/shelljs/issues/175 is solved
      child.exec('git add --all && git commit -m"feat(): amazing new module\n\nBREAKING CHANGE: Not backward compatible."', function() {
        conventionalRecommendedBump({
          preset: 'angular'
        }, function(err, releaseAs) {
          equal(releaseAs, 'major');
          done();
        });
      });
    });
  });
});
