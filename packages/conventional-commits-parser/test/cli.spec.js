'use strict';
var concat = require('concat-stream');
var expect = require('chai').expect;
var fs = require('fs');
var spawn = require('child_process').spawn;
var through = require('through2');

var cliPath = './cli.js';

describe('cli', function() {
  it('should parse commits in a file', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log1.txt'], {
      stdio: [process.stdin, null, null]
    });
    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.include('"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"');

        done();
      }));
  });

  it('should work with a separator', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log2.txt', '==='], {
      stdio: [process.stdin, null, null]
    });
    cp.stdout
      .pipe(concat(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('"type":"docs","scope":"ngMessageExp","subject":"split ngMessage docs up to show its alias more clearly"');
        expect(chunk).to.include('"type":"fix","scope":"$animate","subject":"applyStyles from options on leave"');

        done();
      }));
  });

  it('should work with two files', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log1.txt', 'test/fixtures/log2.txt', '==='], {
      stdio: [process.stdin, null, null]
    });
    cp.stdout
      .pipe(concat(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"');
        expect(chunk).to.include('"type":"docs","scope":"ngMessageExp","subject":"split ngMessage docs up to show its alias more clearly"');
        expect(chunk).to.include('"type":"fix","scope":"$animate","subject":"applyStyles from options on leave"');

        done();
      }));
  });

  it('should error if files cannot be found', function(done) {
    var i = 0;
    var cp = spawn(cliPath, ['test/fixtures/log1.txt', 'test/fixtures/log4.txt', 'test/fixtures/log2.txt', 'test/fixtures/log5.txt', '==='], {
      stdio: [process.stdin, null, null]
    });
    cp.stderr
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        if (i === 0) {
          expect(chunk).to.contain('Failed to read file test/fixtures/log4.txt');
        } else {
          expect(chunk).to.contain('Failed to read file test/fixtures/log5.txt');
        }

        i++;
        cb();
      }, function() {
        done();
      }));
  });

  it('should work with options', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log3.txt', '-p', '^(\\w*)(?:\\(([:\\w\\$\\.\\-\\* ]*)\\))?\\: (.*)$', '--reference-actions', 'close, fix', '-n', 'BREAKING NEWS', '--headerCorrespondence', 'scope, type,subject '], {
      stdio: [process.stdin, null, null]
    });
    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.include('"scope":"category","type":"fix:subcategory","subject":"My subject"');
        expect(chunk.toString()).to.include('"references":[{"action":"Close","owner":null,"repository":null,"issue":"10036","raw":"#10036","prefix":"#"},{"action":"fix","owner":null,"repository":null,"issue":"9338","raw":"#9338","prefix":"#"}]');
        expect(chunk.toString()).to.include('"notes":[{"title":"BREAKING NEWS","text":"A lot of changes!"}]');

        done();
      }));
  });

  it('should work if it is not a tty', function(done) {
    var cp = spawn(cliPath, [], {
      stdio: [fs.openSync('test/fixtures/log1.txt', 'r'), null, null]
    });
    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.include('"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"');

        done();
      }));
  });

  it('should error if it is not a tty and commit cannot be parsed', function(done) {
    var cp = spawn(cliPath, [], {
      stdio: [fs.openSync('test/fixtures/bad_commit.txt', 'r'), null, null]
    });
    cp.stderr
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.equal('TypeError: Expected a raw commit\n');

        done();
      }));
  });
});
