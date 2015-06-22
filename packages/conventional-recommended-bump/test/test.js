'use strict';
var conventionalRecommendedBump = require('../');
var equal = require('assert').strictEqual;
var fs = require('fs');
var shell = require('shelljs');

describe('conventional-recommended-bump', function() {
  before(function() {
    shell.cd('test');
    shell.exec('git init');
    fs.writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m"First commit"');
  });

  after(function() {
    shell.cd('../');
  });

  it('should return `null` if no `whatBump` is found', function(done) {
    conventionalRecommendedBump(function(err, releaseAs) {
      equal(releaseAs, '');
      done();
    });
  });

  it('should be a mojor bump', function(done) {
    conventionalRecommendedBump({
      whatBump: function() {
        return 0;
      }
    }, function(err, releaseAs) {
      equal(releaseAs, 'major');
      done();
    });
  });

  it('should not error if callback is missing', function() {
    conventionalRecommendedBump();
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
