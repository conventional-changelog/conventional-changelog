'use strict';
var expect = require('chai').expect;
var gitRawCommits = require('./');
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

shell.config.silent = true;
shell.rm('-rf', 'tmp');
shell.mkdir('tmp');
shell.cd('tmp');
shell.exec('git init');

it('should emit an error if there is no commits', function(done) {
  gitRawCommits()
    .on('error', function(err) {
      done();
    })
    .pipe(through(function() {
      done('should error');
    }));
});

it('should get commits without `options` (`options.from` defaults to first commit)', function(done) {
  writeFileSync('test1', '');
  shell.exec('git add --all && git commit -m"First commit"');
  writeFileSync('test2', '');
  shell.exec('git add --all && git commit -m"Second commit"');
  writeFileSync('test3', '');
  shell.exec('git add --all && git commit -m"Third commit"');

  var i = 0;

  gitRawCommits()
    .pipe(through(function(chunk, enc, cb) {
      chunk = chunk.toString();

      if (i === 0) {
        expect(chunk).to.contain('Third commit');
      } else if (i === 1) {
        expect(chunk).to.contain('Second commit');
      } else {
        expect(chunk).to.contain('First commit');
      }

      i++;
      cb();
    }, function() {
      if (i === 3) {
        done();
      } else {
        done(new Error('should contain three commits'));
      }
    }));
});

it('should honour `options.from`', function(done) {
  var i = 0;

  gitRawCommits({
    from: 'HEAD~1'
  })
    .pipe(through(function(chunk, enc, cb) {
      chunk = chunk.toString();

      expect(chunk).to.contain('Third commit');

      i++;
      cb();
    }, function() {
      if (i === 1) {
        done();
      } else {
        done(new Error('should contain one commits'));
      }
    }));
});

it('should honour `options.to`', function(done) {
  var i = 0;

  gitRawCommits({
    to: 'HEAD^'
  })
    .pipe(through(function(chunk, enc, cb) {
      chunk = chunk.toString();

      if (i === 0) {
        expect(chunk).to.contain('Second commit');
      } else {
        expect(chunk).to.contain('First commit');
      }

      i++;
      cb();
    }, function() {
      if (i === 2) {
        done();
      } else {
        done(new Error('should contain two commits'));
      }
    }));
});
