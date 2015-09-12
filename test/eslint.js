'use strict';
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('presets', function() {
  describe('eslint', function() {
    before(function() {
      shell.cd('eslint');
      shell.exec('git init --template=../git-templates');
      writeFileSync('test1', '');
      shell.exec('git add --all && git commit -m\'Fix: the `no-class-assign` rule (fixes #2718)\'');
      writeFileSync('test2', '');
      shell.exec('git add --all && git commit -m"Update: Handle CRLF line endings in spaced-comment rule - 2 (fixes #3005)"');
      writeFileSync('test3', '');
      shell.exec('git add --all && git commit -m"Fix: indent rule should recognize single line statements with ASI (fixes #3001, fixes #3000)"');
      writeFileSync('test4', '');
      shell.exec('git add --all && git commit -m"Docs: Fix unmatched paren in rule description"');
      writeFileSync('test5', '');
      shell.exec('git add --all && git commit -m"Merge pull request #3033 from gcochard/patch-3 "');
    });

    after(function() {
      shell.cd('../');
    });

    it('should work if there is no semver tag', function(done) {
      conventionalChangelog({
        preset: 'eslint'
      })
        .pipe(through(function(chunk) {
          chunk = chunk.toString();

          expect(chunk).to.include('the `no-class-assign` rule');
          expect(chunk).to.include('### Fix');
          expect(chunk).to.include('indent rule should recognize single line statements with ASI');
          expect(chunk).to.include('### Docs');

          expect(chunk).to.not.include('3033');

          done();
        }));
    });
  });
});
