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
      expect(err).to.be.ok; // jshint ignore:line
      done();
    })
    .pipe(through(function() {
      // istanbul ignore next
      done('should error');
    }));
});

it('should execute the command without error', function(done) {
  writeFileSync('test1', '');
  shell.exec('git add --all && git commit -m"First commit"');
  writeFileSync('test2', '');
  shell.exec('git add --all && git commit -m"Second commit"');
  writeFileSync('test3', '');
  shell.exec('git add --all && git commit -m"Third commit"');

  var called = false;
  var callback = function(err) {
    if (!called) {
      called = true;
      done(err);
    }
  };

  gitRawCommits()
    .on('close', callback)
    .on('error', callback);
});

it('should get commits without `options` (`options.from` defaults to first commit)', function(done) {
  var i = 0;

  gitRawCommits()
    .pipe(through(function(chunk, enc, cb) {
      chunk = chunk.toString();

      if (i === 0) {
        expect(chunk).to.equal('Third commit\n\n');
      } else if (i === 1) {
        expect(chunk).to.equal('Second commit\n\n');
      } else {
        expect(chunk).to.equal('First commit\n\n');
      }

      i++;
      cb();
    }, function() {
      expect(i).to.equal(3);
      done();
    }));
});

it('should honour `options.from`', function(done) {
  var i = 0;

  gitRawCommits({
    from: 'HEAD~1'
  })
    .pipe(through(function(chunk, enc, cb) {
      chunk = chunk.toString();

      expect(chunk).to.equal('Third commit\n\n');

      i++;
      cb();
    }, function() {
      expect(i).to.equal(1);
      done();
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
        expect(chunk).to.equal('Second commit\n\n');
      } else {
        expect(chunk).to.equal('First commit\n\n');
      }

      i++;
      cb();
    }, function() {
      expect(i).to.equal(2);
      done();
    }));
});
