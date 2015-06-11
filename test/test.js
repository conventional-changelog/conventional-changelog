'use strict';
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('conventionalChangelog', function() {
  before(function() {
    shell.cd('test');
    shell.exec('git init');
    writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m"First commit"');
  });

  after(function() {
    shell.cd('../');
  });

  it('should work if there is no tag', function(done) {
    conventionalChangelog()
      .pipe(through(function(chunk) {
        expect(chunk.toString()).to.include('First commit');

        done();
      }));
  });

  it('should honour `gitRawCommitsOpts.from`', function(done) {
    writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m"Second commit"');
    writeFileSync('test3', '');
    shell.exec('git add --all && git commit -m"Third commit closes #1"');

    conventionalChangelog({}, {}, {
      from: 'HEAD~2'
    }, {}, {
      commitsSort: null
    })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('Second commit');
        expect(chunk).to.include('Third commit');
        expect(chunk).to.match(/Third commit closes #1\n.*?\n\* Second commit/);

        expect(chunk).to.not.include('First commit');

        done();
      }));
  });

  it('should load package.json for data', function(done) {
    conventionalChangelog({
      pkg: __dirname + '/fixtures/_package.json'
    })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('## 0.0.17');
        expect(chunk).to.include('First commit');
        expect(chunk).to.include('closes [#1](https://github.com/ajoslin/conventional-changelog/issues/1)');

        done();
      }));
  });

  it('should work in append mode', function(done) {
    conventionalChangelog({
      append: true,
    })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.match(/First commit\n.*?\n\* Second commit/);

        done();
      }));
  });

  it('should read package.json if only `context.version` is missing', function(done) {
    conventionalChangelog({
      pkg: __dirname + '/fixtures/_package.json'
    }, {
      host: 'github',
      repository: 'a/b'
    }).pipe(through(function(chunk) {
      chunk = chunk.toString();

      expect(chunk).to.include('## 0.0.17');
      expect(chunk).to.include('closes [#1](github/a/b/issues/1)');

      done();
    }));
  });

  it('should read host configs if only `parserOpts.referenceKeywords` is missing', function(done) {
    conventionalChangelog({}, {
      host: 'github',
      repository: 'b/a',
      issue: 'issue',
      commit: 'commits'
    }, {}, {}).pipe(through(function(chunk) {
      chunk = chunk.toString();

      expect(chunk).to.include('](github/b/a/commits/');
      expect(chunk).to.include('closes [#1](github/b/a/issue/1)');

      done();
    }));
  });

  it('should warn if preset is not found', function(done) {
    conventionalChangelog({
      preset: 'no',
      warn: function(warning) {
        expect(warning).to.equal('Preset: "no" does not exist');

        done();
      }
    });
  });

  it('should warn if host is not found', function(done) {
    conventionalChangelog({
      pkg: null,
      warn: function(warning) {
        expect(warning).to.equal('Host: "no" does not exist');

        done();
      }
    }, {
      host: 'no'
    });
  });

  it('should warn if package.json is not found', function(done) {
    conventionalChangelog({
      pkg: 'no',
      warn: function(warning) {
        expect(warning).to.equal('package.json: "no" does not exist');

        done();
      }
    });
  });

  it('should warn if package.json cannot be parsed', function(done) {
    conventionalChangelog({
      pkg: __dirname + '/fixtures/_malformation.json',
      warn: function(warning) {
        expect(warning).to.equal('package.json: "' + __dirname + '/fixtures/_malformation.json" cannot be parsed');

        done();
      }
    });
  });
});
