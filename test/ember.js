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
      shell.exec('git init --template=../git-templates');
      writeFileSync('test1', '');
      child.exec('git add --all && git commit -m"Merge pull request #12001 from rwjblue/remove-with-controller\n\n[CLEANUP beta] Remove {{with}} keyword\'s controller option. Closes #1"', function() {
        writeFileSync('test2', '');
        child.exec('git add --all && git commit -m"Merge pull request #11984 from emberjs/fix-each\n\n[PERF beta] `@each` should remain a stable node for chains."', function() {
          writeFileSync('test3', '');
          child.exec('git add --all && git commit -m"Merge pull request #11970 from pixelhandler/ember-rfc-80\n\n[DOC Release] Make ArrayProxy public"', function() {
            writeFileSync('test4', '');
            child.exec('git add --all && git commit -m"Merge pull request #12010 from duggiefresh/12004-doc-array-methods\n\n[DOC release] Mark `Ember.Array` methods as public"', function() {
              writeFileSync('test5', '');
              child.exec('git add --all && git commit -m"Merge pull request #12017 from rwjblue/deprecate-render-function\n\n[BUGFIX release] Deprecate specifying `.render` to views/components."', function() {
                writeFileSync('test6', '');
                child.exec('git add --all && git commit -m"Merge pull request #11968 from jayphelps/remove-ember-views-component-block-info\n\n[FEATURE ember-views-component-block-param-info] remove feature info and unflag tests"', function() {
                  writeFileSync('test7', '');
                  child.exec('git add --all && git commit -m"Merge pull request #1000 from jayphelps/remove-ember-views-component-block-info\n\n[SECURITY CVE-2014-0013] Ensure primitive value contexts are escaped."', function() {
                    writeFileSync('test8', '');
                    shell.exec('git add --all && git commit -m"Bad commit"');
                    writeFileSync('test9', '');
                    shell.exec('git add --all && git commit -m"Merge pull request #2000000 from jayphelps/remove-ember-views-component-block-info"');

                    done();
                  });
                });
              });
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
          expect(chunk).to.include('Release');
          expect(chunk).to.include('### Bug Fixes');
          expect(chunk).to.include('### Cleanup');
          expect(chunk).to.include('### Features');
          expect(chunk).to.include('### Documentation');
          expect(chunk).to.include('### Security');

          expect(chunk).to.not.include('CLEANUP');
          expect(chunk).to.not.include('FEATURE');
          expect(chunk).to.not.include('Bad');

          done();
        }));
    });
  });
});
