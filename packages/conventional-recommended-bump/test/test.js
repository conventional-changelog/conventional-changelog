'use strict';
var assert = require('assert');
var conventionalRecommendedBump = require('../');
var equal = assert.strictEqual;
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
        shell.exec('git add --all && git commit -m"First commit"');
        done();
      }
    });
  });

  it('should return `""` if no `whatBump` is found', function(done) {
    conventionalRecommendedBump({}, function(err, releaseAs) {
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
