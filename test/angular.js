'use strict';
var child = require('child_process');
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('presets', function() {
  describe('angular', function() {
    before(function(done) {
      shell.cd('angular');
      shell.exec('git init');
      writeFileSync('test1', '');
      shell.exec('git add --all && git commit -m"chore: first commit"');
      writeFileSync('test2', '');
      // fix this until https://github.com/arturadib/shelljs/issues/175 is solved
      child.exec('git add --all && git commit -m"feat: amazing new module\n\nBREAKING CHANGE: Not backward compatible."', function() {
        writeFileSync('test3', '');
        shell.exec('git add --all && git commit -m"fix($compile): avoid a bug"');
        writeFileSync('test4', '');
        shell.exec('git add --all && git commit -m"perf(ngOptions): make it faster"');
        writeFileSync('test5', '');
        shell.exec('git add --all && git commit -m"revert(ngOptions): make it faster"');

        done();
      });
    });

    after(function() {
      shell.cd('../');
    });

    it('should work if there is no semver tag', function(done) {
      conventionalChangelog({
        preset: 'angular'
      })
        .pipe(through(function(chunk) {
          chunk = chunk.toString();

          expect(chunk).to.include('amazing new module');
          expect(chunk).to.include('avoid a bug');
          expect(chunk).to.include('make it faster');
          expect(chunk).to.include('Not backward compatible.');
          expect(chunk).to.include('Features');
          expect(chunk).to.include('Bug Fixes');
          expect(chunk).to.include('Performance Improvements');
          expect(chunk).to.include('Reverts');
          expect(chunk).to.include('BREAKING CHANGES');

          expect(chunk).to.not.include('first commit');
          expect(chunk).to.not.include('feat');
          expect(chunk).to.not.include('fix');
          expect(chunk).to.not.include('perf');
          expect(chunk).to.not.include('revert');

          done();
        }));
    });

    it('should work if there is a semver tag', function(done) {
      var i = 0;

      shell.exec('git tag v1.0.0');
      writeFileSync('test6', '');
      shell.exec('git add --all && git commit -m"feat: some more features"');

      conventionalChangelog({
        preset: 'angular'
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

    it('should generate all log blocks', function(done) {
      var i = 0;

      conventionalChangelog({
        preset: 'angular',
        allBlocks: true
      })
        .pipe(through(function(chunk, enc, cb) {
          chunk = chunk.toString();

          if (i === 0) {
            expect(chunk).to.include('some more features');
            expect(chunk).to.not.include('BREAKING');
          } else {
            expect(chunk).to.include('BREAKING CHANGES');
            expect(chunk).to.include('# 1.0.0');
            expect(chunk).to.not.include('some more features');
          }

          i++;
          cb();
        }, function() {
          expect(i).to.equal(2);
          done();
        }));
    });

    it('should work if there are two semver tags', function(done) {
      var i = 0;

      writeFileSync('test7', '');
      shell.exec('git add --all && git commit -m"feat: some more features"');
      shell.exec('git tag v2.0.0');

      conventionalChangelog({
        preset: 'angular',
        allBlocks: true
      })
        .pipe(through(function(chunk, enc, cb) {
          chunk = chunk.toString();

          if (i === 1) {
            expect(chunk).to.include('# 2.0.0');
          } else if (i === 2) {
            expect(chunk).to.include('# 1.0.0');
          }

          i++;
          cb();
        }, function() {
          expect(i).to.equal(3);
          done();
        }));
    });
  });
});
