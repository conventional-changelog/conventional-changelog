'use strict';
var conventionalChangelogCore = require('conventional-changelog-core');
var config = require('./');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('codemirror preset', function() {
  before(function() {
    shell.config.silent = true;
    shell.rm('-rf', 'tmp');
    shell.mkdir('tmp');
    shell.cd('tmp');
    shell.mkdir('git-templates');
    shell.exec('git init --template=./git-templates');

    writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m"[tern addon] Use correct primary when selecting variables"');
    writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m"[tern addon] Fix patch bc026f1 "');
    writeFileSync('test3', '');
    shell.exec('git add --all && git commit -m"[css mode] Add values for property flex-direction"');
    writeFileSync('test4', '');
    shell.exec('git add --all && git commit -m"[stylus mode] Fix highlight class after a $var"');
    writeFileSync('test5', '');
    shell.exec('git add --all && git commit -m"Bad commit"');
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

        expect(chunk).to.include('### tern');
        expect(chunk).to.include('Use correct primary when selecting variables');
        expect(chunk).to.include('**addon**');
        expect(chunk).to.include('Add values for property flex-direction');
        expect(chunk).to.include('### stylus');

        expect(chunk).to.not.include('Bad');

        done();
      }));
  });
});
