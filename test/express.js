'use strict';
var child = require('child_process');
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('presets', function() {
  describe('express', function() {
    before(function(done) {
      shell.cd('express');
      shell.exec('git init');
      writeFileSync('test1', '');
      child.exec('git add --all && git commit -m"deps: type-is@~1.6.3\n\n - deps: mime-types@~2.1.1\n - perf: reduce try block size\n - perf: remove bitwise operations"', function() {
        writeFileSync('test2', '');
        child.exec('git add --all && git commit -m"perf: use saved reference to http.STATUS_CODES\n\ncloses #2602"', function() {
          writeFileSync('test3', '');
          shell.exec('git add --all && git commit -m"docs: add license comments"');
          writeFileSync('test4', '');
          child.exec('git add --all && git commit -m"deps: path-to-regexp@0.1.4"', function() {
            writeFileSync('test5', '');
            shell.exec('git add --all && git commit -m"Bad commit"');

            done();
          });
        });
      });
    });

    after(function() {
      shell.cd('../');
    });

    it('should work if there is no semver tag', function(done) {
      conventionalChangelog({
        preset: 'express',
        pkg: {
          path: __dirname + '/fixtures/_express.json'
        }
      })
        .pipe(through(function(chunk) {
          chunk = chunk.toString();

          expect(chunk).to.include('### Dependencies');
          expect(chunk).to.include('type-is@~1.6.3');
          expect(chunk).to.include(' - deps: mime-types@~2.1.1\n');
          expect(chunk).to.include('path-to-regexp@0.1.4');
          expect(chunk).to.include('### Performance');
          expect(chunk).to.include('use saved reference to http.STATUS_CODES');

          expect(chunk).to.not.include('license');
          expect(chunk).to.not.include('Bad');

          done();
        }));
    });
  });
});
