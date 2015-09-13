'use strict';
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('presets', function() {
  describe('codemirror', function() {
    before(function() {
      shell.cd('codemirror');
      shell.exec('git init --template=../git-templates');
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

    after(function() {
      shell.cd('../');
    });

    it('should work if there is no semver tag', function(done) {
      conventionalChangelog({
        preset: 'codemirror'
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
});
