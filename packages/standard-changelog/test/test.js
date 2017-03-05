'use strict';
var standardChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('standardChangelog', function() {
  before(function() {
    shell.config.silent = true;
    shell.rm('-rf', 'tmp');
    shell.mkdir('tmp');
    shell.cd('tmp');
    shell.mkdir('git-templates');
    shell.exec('git init --template=../git-templates');
    writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m"feat: first commit"');
  });

  after(function() {
    shell.cd('../');
  });

  it('should generate angular changelog', function(done) {
    var i = 0;

    standardChangelog()
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        expect(chunk).to.include('Features');

        i++;
        cb();
      }, function() {
        expect(i).to.equal(1);
        done();
      }));
  });
});
