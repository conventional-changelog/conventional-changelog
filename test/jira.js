'use strict';
var child = require('child_process');
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('presets', function() {
  describe('jira', function() {
    before(function(done) {
      shell.cd('jira');
      shell.exec('git init --template=../git-templates');
      writeFileSync('test1', '');
      shell.exec('git add --all && git commit -m"[JIRA-123: CHORE] Move scope-manager to external file"');
      writeFileSync('test2', '');
      shell.exec('git add --all && git commit -m"[JIRA-123: TEST] Add test for #JIRA-122. Fixes #OHTER-985"');
      writeFileSync('test3', '');
      shell.exec('git add --all && git commit -m"[JIRA-123: FIX] catch params are scoped to the catch only"');
      writeFileSync('test4', '');
      child.exec('git add --all && git commit -m"[JIRA-123: FEAT] Option to assume strict mode\n\nBREAKING CHANGE: Not backward compatible.\n\nResolves #PROJECT-123"', function() {
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
        preset: 'jira'
      })
        .pipe(through(function(chunk) {
          chunk = chunk.toString();

          expect(chunk).to.include('JIRA-123 - catch params are scoped to the catch only');
          expect(chunk).to.include('### Bug Fixes');
          expect(chunk).to.include('JIRA-123 - Option to assume strict mode');
          expect(chunk).to.include('### Features');
          expect(chunk).to.include('BREAKING CHANGES');
          expect(chunk).to.include('closes PROJECT-123');

          expect(chunk).to.not.include('Chore');
          expect(chunk).to.not.include('Move scope-manager to external file');
          expect(chunk).to.not.include('Add test for #JIRA-122.');
          expect(chunk).to.not.include('Bad');

          done();
        }));
    });
  });
});
