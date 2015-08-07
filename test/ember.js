'use strict';
var child = require('child_process');
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('presets', function() {
  describe('ember', function() {
    before(function(done) {
      shell.cd('ember');
      shell.exec('git init');
      writeFileSync('test1', '');
      child.exec('git add --all && git commit -m"Merge pull request #12001 from rwjblue/remove-with-controller\n\n[CLEANUP beta] Remove {{with}} keyword\'s controller option."', function() {
        writeFileSync('test2', '');
        child.exec('git add --all && git commit -m"Merge pull request #11984 from emberjs/fix-each\n\n[PERF beta] `@each` should remain a stable node for chains."', function() {
          writeFileSync('test3', '');
          child.exec('git add --all && git commit -m"Merge pull request #11970 from pixelhandler/ember-rfc-80\n\n[DOC Release] Make ArrayProxy public"', function() {
            writeFileSync('test4', '');
            child.exec('git add --all && git commit -m"Merge pull request #12010 from duggiefresh/12004-doc-array-methods\n\n[DOC release] Mark `Ember.Array` methods as public"', function() {
              writeFileSync('test5', '');
              shell.exec('git add --all && git commit -m"Bad commit"');

              done();
            });
          });
        });
      });
    });

    after(function() {
      shell.cd('../');
    });

    it('should work if there is no semver tag', function(done) {
      conventionalChangelog({
        preset: 'ember'
      })
        .pipe(through(function(chunk) {
          chunk = chunk.toString();

          expect(chunk).to.include('[12001]');
          expect(chunk).to.include('Remove {{with}} keyword\'s controller option.');
          expect(chunk).to.include('### Documentation');
          expect(chunk).to.include('Release');

          expect(chunk).to.not.include('Bad');

          done();
        }));
    });
  });
});
