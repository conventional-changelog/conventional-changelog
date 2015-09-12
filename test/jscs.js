'use strict';
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('presets', function() {
  describe('jscs', function() {
    before(function() {
      shell.cd('jscs');
      shell.exec('git init --template=../git-templates');
      writeFileSync('test1', '');
      shell.exec('git add --all && git commit -m"disallowKeywordsOnNewLine: Allow comments before keywords"');
      writeFileSync('test2', '');
      shell.exec('git add --all && git commit -m"CLI: set \\"maxErrors\\" to Infinity with enabled \\"fix\\" option"');
      writeFileSync('test3', '');
      shell.exec('git add --all && git commit -m"Preset: requireSemicolons = true for google preset"');
      writeFileSync('test4', '');
      shell.exec('git add --all && git commit -m"Preset: add jsDoc rules to relevant presets"');
      writeFileSync('test5', '');
      shell.exec('git add --all && git commit -m"Bad commit"');
    });

    after(function() {
      shell.cd('../');
    });

    it('should work if there is no semver tag', function(done) {
      conventionalChangelog({
        preset: 'jscs',
        pkg: {
          path: __dirname + '/fixtures/_package.json'
        }
      })
        .pipe(through(function(chunk) {
          chunk = chunk.toString();

          expect(chunk).to.include('### disallowKeywordsOnNewLine');
          expect(chunk).to.include('set \"maxErrors\" to Infinity with enabled \"fix\" option');
          expect(chunk).to.include('requireSemicolons = true for google preset');
          expect(chunk).to.include('### Preset');
          expect(chunk).to.include('add jsDoc rules to relevant presets');

          if (process.env.TRAVIS) {
            expect(chunk).to.include(' (Travis-CI)');
          }

          expect(chunk).to.not.include('Bad');

          done();
        }));
    });
  });
});
