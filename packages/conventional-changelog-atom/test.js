'use strict';
var conventionalChangelogCore = require('conventional-changelog-core');
var config = require('./');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('atom preset', function() {
  before(function() {
    shell.config.silent = true;
    shell.rm('-rf', 'tmp');
    shell.mkdir('tmp');
    shell.cd('tmp');
    shell.mkdir('git-templates');
    shell.exec('git init --template=./git-templates');

    writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m":arrow_down: exception-reporting"');
    writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m\':bug: `updateContentDimensions` when model changes\'');
    writeFileSync('test3', '');
    shell.exec('git add --all && git commit -m"Merge pull request #7881 from atom/bf-upgrade-babel-to-5.6.17"');
    writeFileSync('test4', '');
    shell.exec('git add --all && git commit -m":arrow_up: language-gfm@0.79.0"');
    writeFileSync('test5', '');
    shell.exec('git add --all && git commit -m":arrow_up: one-dark/light-ui@v1.0.1"');
  });

  it('should work if there is no semver tag', function(done) {
    conventionalChangelogCore({
      config: config
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include(':arrow_down:');
        expect(chunk).to.include('`updateContentDimensions` when model changes');
        expect(chunk).to.include(':arrow_up:');
        expect(chunk).to.include('one-dark/light-ui@v1.0.1');

        expect(chunk).to.not.include('7881');

        done();
      }));
  });
});
