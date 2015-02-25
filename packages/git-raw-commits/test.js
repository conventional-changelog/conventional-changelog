/*global it */
'use strict';
var expect = require('chai').expect;
var writeFileSync = require('fs').writeFileSync;
var getCommits = require('./');
var shell = require('shelljs');
var through = require('event-stream').through;

shell.config.silent = true;
shell.rm('-rf', 'tmp');
shell.mkdir('tmp');
shell.cd('tmp');
writeFileSync('test1', '');
shell.exec('git init && git add --all && git commit -m"First commit"');
writeFileSync('test2', '');
shell.exec('git add --all && git commit -m"Second commit"');
writeFileSync('test3', '');
shell.exec('git add --all && git commit -m"Third commit"');

it('should get commits', function(done) {
  getCommits(function(err, commits) {
    var length = commits.length;
    expect(length).to.equal(3);
    done();
  });
});

it('should honour from', function(done) {
  getCommits({
    from: 'HEAD~1'
  }, function(err, commits) {
    var length = commits.length;
    expect(length).to.equal(1);

    expect(commits[length - 1]).to.contain('Third commit');
    done();
  });
});

it('should honour to', function(done) {
  getCommits({
    from: 'HEAD~2',
    to: 'HEAD^'
  }, function(err, commits) {
    var length = commits.length;
    expect(length).to.equal(1);
    expect(commits[0]).to.contain('Second commit');
    done();
  });
});

it('should auto get `from` if there is no tag', function(done) {
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
    }
    else {
      expect(chunk.toString()).to.contain('Second commit');
    }
    i++;
  }, function() {
    done();
  }));
});
