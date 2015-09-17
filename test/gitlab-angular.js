'use strict';
var child = require('child_process');
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('presets', function() {
  describe('gitlab-angular', function() {
    before(function(done) {
      shell.cd('gitlab-angular');
      shell.exec('git init');
      writeFileSync('test1', '');
      child.exec('git add --all && git commit -m"Merge branch \'init/firstCommit\' into \'develop\'\n\nchore: first commit"', function() {

        writeFileSync('test2', '');
        // fix this until https://github.com/arturadib/shelljs/issues/175 is solved
        child.exec('git add --all && git commit -m"Merge branch \'feat/amazing\' into \'develop\'\n\nfeat: amazing new module\n\nBREAKING CHANGE: Not backward compatible."', function() {
          writeFileSync('test3', '');
          child.exec('git add --all && git commit -m"Merge branch \'bugfix/compile\' into \'develop\'\n\nfix($compile): avoid a bug"', function() {
            writeFileSync('test4', '');
            child.exec('git add --all && git commit -m"Merge branch \'perf/faster\' into \'develop\'\n\nperf(ngOptions): make it faster"', function() {
              writeFileSync('test5', '');
              child.exec('git add --all && git commit -m"Merge branch \'revert/faster\' into \'develop\'\n\nrevert(ngOptions): make it faster"', function() {
                writeFileSync('test6', '');
                child.exec('git add --all && git commit -m"Merge branch \'fix/everything\' into \'develop\'\n\nfix(*): oops"', function() {
                  done();
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
        preset: 'gitlab-angular'
      })
        .pipe(through(function(chunk) {
          chunk = chunk.toString();

          expect(chunk).to.include('amazing new module');
          expect(chunk).to.include('avoid a bug');
          expect(chunk).to.include('make it faster');
          expect(chunk).to.include('Not backward compatible.');
          expect(chunk).to.include('Features');
          expect(chunk).to.include('Bug Fixes');
          expect(chunk).to.include('Performance Improvements');
          expect(chunk).to.include('Reverts');
          expect(chunk).to.include('BREAKING CHANGES');

          expect(chunk).to.not.include('first commit');
          expect(chunk).to.not.include('feat');
          expect(chunk).to.not.include('fix');
          expect(chunk).to.not.include('perf');
          expect(chunk).to.not.include('revert');
          expect(chunk).to.not.include('***:**');

          done();
        }));
    });

    it('should work if there is a semver tag', function(done) {
      var i = 0;

      shell.exec('git tag v1.0.0');
      writeFileSync('test7', '');
      child.exec('git add --all && git commit -m"Merge branch \'feature/feature\' into \'develop\'\n\nfeat: some more features"', function() {
        conventionalChangelog({
          preset: 'gitlab-angular'
        })
          .pipe(through(function(chunk, enc, cb) {
            chunk = chunk.toString();

            expect(chunk).to.include('some more features');
            expect(chunk).to.not.include('BREAKING');

            i++;
            cb();
          }, function() {
            expect(i).to.equal(1);
            done();
          }));
      });

    });
  });
});
