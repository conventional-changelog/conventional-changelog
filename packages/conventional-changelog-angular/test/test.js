'use strict';
var child = require('child_process');
var conventionalChangelogCore = require('conventional-changelog-core');
var preset = require('../');
var expect = require('chai').expect;
var gitDummyCommit = require('git-dummy-commit');
var shell = require('shelljs');
var through = require('through2');

describe('angular preset', function() {
  before(function(done) {
    shell.config.silent = true;
    shell.rm('-rf', 'tmp');
    shell.mkdir('tmp');
    shell.cd('tmp');
    shell.mkdir('git-templates');
    shell.exec('git init --template=./git-templates');

    gitDummyCommit('chore: first commit');
    // fix this once https://github.com/arturadib/shelljs/issues/175 is solved
    child.exec('git commit -m"feat: amazing new module\n\nBREAKING CHANGE: Not backward compatible." --allow-empty', function() {
      gitDummyCommit(['fix(compile): avoid a bug', 'BREAKING CHANGE: The Change is huge.']);
      gitDummyCommit('perf(ngOptions): make it faster closes #1, #2');
      gitDummyCommit('revert(ngOptions): bad commit');
      gitDummyCommit('fix(*): oops');

      done();
    });
  });

  it('should work if there is no semver tag', function(done) {
    conventionalChangelogCore({
      config: preset
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('amazing new module');
        expect(chunk).to.include('avoid a bug');
        expect(chunk).to.include('make it faster');
        expect(chunk).to.include(', closes [#1](https://github.com/conventional-changelog/conventional-changelog-angular/issues/1) [#2](https://github.com/conventional-changelog/conventional-changelog-angular/issues/2)');
        expect(chunk).to.include('Not backward compatible.');
        expect(chunk).to.include('compile: The Change is huge.');
        expect(chunk).to.include('Features');
        expect(chunk).to.include('Bug Fixes');
        expect(chunk).to.include('Performance Improvements');
        expect(chunk).to.include('Reverts');
        expect(chunk).to.include('bad commit');
        expect(chunk).to.include('BREAKING CHANGES');

        expect(chunk).to.not.include('first commit');
        expect(chunk).to.not.include('feat');
        expect(chunk).to.not.include('fix');
        expect(chunk).to.not.include('perf');
        expect(chunk).to.not.include('revert');
        expect(chunk).to.not.include('***:**');
        expect(chunk).to.not.include(': Not backward compatible.');

        done();
      }));
  });

  it('should replace #[0-9]+ with GitHub issue URL', function(done) {
    gitDummyCommit(['feat(awesome): addresses the issue brought up in #133']);

    conventionalChangelogCore({
      config: preset
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();
        expect(chunk).to.include('[#133](https://github.com/conventional-changelog/conventional-changelog-angular/issues/133)');
        done();
      }));
  });

  it('should replace @username with GitHub user URL', function(done) {
    gitDummyCommit(['feat(awesome): issue brought up by @bcoe! on Friday']);

    conventionalChangelogCore({
      config: preset
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();
        expect(chunk).to.include('[@bcoe](https://github.com/bcoe)');
        done();
      }));
  });

  it('should not discard commit if there is BREAKING CHANGE', function(done) {
    gitDummyCommit(['docs(readme): make it clear', 'BREAKING CHANGE: The Change is huge.']);
    gitDummyCommit(['style(whitespace): make it easier to read', 'BREAKING CHANGE: The Change is huge.']);
    gitDummyCommit(['refactor(code): change a lot of code', 'BREAKING CHANGE: The Change is huge.']);
    gitDummyCommit(['test(*): more tests', 'BREAKING CHANGE: The Change is huge.']);
    gitDummyCommit(['chore(deps): bump', 'BREAKING CHANGE: The Change is huge.']);

    conventionalChangelogCore({
      config: preset
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('Documentation');
        expect(chunk).to.include('Styles');
        expect(chunk).to.include('Code Refactoring');
        expect(chunk).to.include('Tests');
        expect(chunk).to.include('Chores');

        done();
      }));
  });

  it('should work if there is a semver tag', function(done) {
    var i = 0;

    shell.exec('git tag v1.0.0');
    gitDummyCommit('feat: some more features');

    conventionalChangelogCore({
      config: preset,
      outputUnreleased: true
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        expect(chunk).to.include('some more features');
        expect(chunk).to.not.include('BREAKING');

        i++;
        cb();
      }, function() {
        expect(i).to.equal(1);
        done();
      }));
  });

  it('should work with unknown host', function(done) {
    var i = 0;

    conventionalChangelogCore({
      config: preset,
      pkg: {
        path: __dirname + '/fixtures/_unknown-host.json'
      }
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        expect(chunk).to.include('(http://unknown/compare');
        expect(chunk).to.include('](http://unknown/commits/');

        i++;
        cb();
      }, function() {
        expect(i).to.equal(1);
        done();
      }));
  });

});
