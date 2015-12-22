'use strict';
var child = require('child_process');
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('presets', function() {
  describe('jshint', function() {
    before(function(done) {
      shell.cd('jshint');
      shell.exec('git init --template=../git-templates');
      writeFileSync('test1', '');
      shell.exec('git add --all && git commit -m"[[Chore]] Move scope-manager to external file"');
      writeFileSync('test2', '');
      shell.exec('git add --all && git commit -m"[[Test]] Add test for gh-985. Fixes #985"');
      writeFileSync('test3', '');
      shell.exec('git add --all && git commit -m"[[FIX]] catch params are scoped to the catch only"');
      shell.exec('git commit --allow-empty -m"[[Fix]] accidentally use lower-case"');
      writeFileSync('test4', '');
      child.exec('git add --all && git commit -m"[[FEAT]] Option to assume strict mode\n\nBREAKING CHANGE: Not backward compatible."', function() {
        writeFileSync('test5', '');
        shell.exec('git add --all && git commit -m"Bad commit"');

        done();
      });
    });

    after(function() {
      shell.cd('../');
    });

    it('should work if there is no semver tag', function(done) {
      conventionalChangelog({
        preset: 'jshint'
      })
        .pipe(through(function(chunk) {
          chunk = chunk.toString();

          expect(chunk).to.include('catch params are scoped to the catch only');
          expect(chunk).to.include('### Bug Fixes');
          expect(chunk).to.include('Option to assume strict mode');
          expect(chunk).to.include('accidentally use lower-case');
          expect(chunk).to.include('### Features');
          expect(chunk).to.include('BREAKING CHANGES');

          expect(chunk).to.not.include('Chore');
          expect(chunk).to.not.include('Move scope-manager to external file');
          expect(chunk).to.not.include('Add test for gh-985.');
          expect(chunk).to.not.include('Bad');

          done();
        }));
    });
  });
});
