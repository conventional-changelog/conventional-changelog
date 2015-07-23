'use strict';
var assert = require('assert');
var equal = assert.deepEqual;
var gitSemverTags = require('./');
var shell = require('shelljs');
var writeFileSync = require('fs').writeFileSync;

shell.config.silent = true;
shell.rm('-rf', 'tmp');
shell.mkdir('tmp');
shell.cd('tmp');
shell.exec('git init');

it('should error if no commits found', function(done) {
  gitSemverTags(function(err) {
    assert(err);

    writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m"First commit"');
    shell.exec('git tag foo');

    done();
  });
});

it('should get no semver tags', function(done) {
  gitSemverTags(function(err, tags) {
    equal(tags, []);

    writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m"Second commit"');
    shell.exec('git tag v2.0.0');
    writeFileSync('test3', '');
    shell.exec('git add --all && git commit -m"Third commit"');
    shell.exec('git tag va.b.c');

    done();
  });
});

it('should get the semver tag', function(done) {
  gitSemverTags(function(err, tags) {
    equal(tags, ['v2.0.0']);
    shell.exec('git tag v3.0.0');

    done();
  });
});

it('should get both semver tags', function(done) {
  gitSemverTags(function(err, tags) {
    equal(tags, ['v3.0.0', 'v2.0.0']);
    shell.exec('git tag v4.0.0');

    done();
  });
});

it('should get all semver tags if two tags on the same commit', function(done) {
  gitSemverTags(function(err, tags) {
    equal(tags, ['v4.0.0', 'v3.0.0', 'v2.0.0']);

    done();
  });
});

it('should still work if I run it again', function(done) {
  gitSemverTags(function(err, tags) {
    equal(tags, ['v4.0.0', 'v3.0.0', 'v2.0.0']);

    done();
  });
});
