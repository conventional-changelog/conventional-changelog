/*global it */
'use strict';
var expect = require('chai').expect;
var getCommits = require('./');
var shell = require('shelljs');
var through = require('event-stream').through;
var writeFileSync = require('fs').writeFileSync;

shell.config.silent = true;
shell.rm('-rf', 'tmp');
shell.mkdir('tmp');
shell.cd('tmp');
shell.exec('git init');

it('should error in the callback if there is no commits', function(done) {
  getCommits(function(err) {
    expect(err.toString()).to.equal('No commits found: git log --format=%H%n%s%n%b%n==END== HEAD ');
    done();
  });
});

it('should error as a stream if there is no commits', function(done) {
  getCommits()
    .on('error', function(err) {
      expect(err.toString()).to.equal('No commits found: git log --format=%H%n%s%n%b%n==END== HEAD ');
      done();
    });
});

it('should get commits without `options` using a callback (`options.from` defaults to first commit)', function(done) {
  writeFileSync('test1', '');
  shell.exec('git add --all && git commit -m"First commit"');
  writeFileSync('test2', '');
  shell.exec('git add --all && git commit -m"Second commit"');
  writeFileSync('test3', '');
  shell.exec('git add --all && git commit -m"Third commit"');

  getCommits(function(err, commits) {
    var length = commits.length;
    expect(length).to.equal(3);
    done();
  });
});

it('should honour `options.from`', function(done) {
  getCommits({
    from: 'HEAD~1'
  }, function(err, commits) {
    var length = commits.length;
    expect(length).to.equal(1);
    expect(commits[length - 1]).to.contain('Third commit');
    done();
  });
});

it('should honour `options.to`', function(done) {
  getCommits({
    to: 'HEAD^'
  }, function(err, commits) {
    var length = commits.length;
    expect(length).to.equal(2);
    expect(commits[0]).to.contain('Second commit');
    done();
  });
});

it('should auto get `options.from` if there is a tag', function(done) {
  shell.exec('git tag testTag HEAD^');
  getCommits({}, function(err, commits) {
    var length = commits.length;
    expect(length).to.equal(1);
    expect(commits[0]).to.contain('Third commit');
    done();
  });
});

it('should return a through stream', function(done) {
  var i = 0;
  getCommits({
    from: 'HEAD~2'
  }).pipe(through(function(chunk) {
    if (i === 0) {
      expect(chunk.toString()).to.contain('Third commit');
    } else {
      expect(chunk.toString()).to.contain('Second commit');
    }
    i++;
  }, function() {
    done();
  }));
});

it('should get commits without `options` using as a stream (`options.from` defaults to latest tag)', function(done) {
  getCommits()
    .pipe(through(function(chunk) {
      expect(chunk.toString()).to.contain('Third commit');
    }, function() {
      done();
    }));
});
