'use strict';
var child = require('child_process');
var conventionalChangelogCore = require('conventional-changelog-core');
var config = require('./');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('express preset', function() {
  before(function(done) {
    shell.config.silent = true;
    shell.rm('-rf', 'tmp');
    shell.mkdir('tmp');
    shell.cd('tmp');
    shell.mkdir('git-templates');
    shell.exec('git init --template=./git-templates');

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

  it('should work if there is no semver tag', function(done) {
    conventionalChangelogCore({
      config: config
    })
      .on('error', function(err) {
        done(err);
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
