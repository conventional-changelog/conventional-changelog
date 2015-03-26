'use strict';
var concat = require('concat-stream');
var expect = require('chai').expect;
var fs = require('fs');
var readFileSync = require('fs').readFileSync;
var spawn = require('child_process').spawn;
var through = require('through2');

var cliPath = './cli.js';
var output1 = readFileSync('test/expected/output1.json', 'utf-8');
var output2 = readFileSync('test/expected/output2.json', 'utf-8');
var output3 = readFileSync('test/expected/output3.json', 'utf-8');

describe('cli', function() {
  it('should parse commits in a file', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log1.txt'], {
      stdio: [process.stdin, null, null]
    });
    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.equal(output1);
        done();
      }));
  });

  it('should work with a separator', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log2.txt', '==='], {
      stdio: [process.stdin, null, null]
    });
    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.equal(output2);
        done();
      }));
  });

  it('should work with two files', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log1.txt', 'test/fixtures/log2.txt', '==='], {
      stdio: [process.stdin, null, null]
    });
    cp.stdout
      .pipe(concat(function(chunk) {
        var expected = output1 + output2;
        expect(chunk.toString()).to.equal(expected);
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
        if (i === 0) {
          expect(chunk.toString()).to.contain('Failed to read file test/fixtures/log4.txt');
        } else {
          expect(chunk.toString()).to.contain('Failed to read file test/fixtures/log5.txt');
        }
        i++;
        cb();
      }, function() {
        done();
      }));
  });

  it('should work with options', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log3.txt', '--max-subject-length', '5', '-p', '^(\\w*)(?:\\(([:\\w\\$\\.\\-\\* ]*)\\))?\\: (.*)$', '--reference-keywords', 'close, fix', '-n', 'BREAKING NEWS'], {
      stdio: [process.stdin, null, null]
    });
    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.equal(output3);
        done();
      }));
  });

  it('should work if it is not a tty', function(done) {
    var cp = spawn(cliPath, [], {
      stdio: [fs.openSync('test/fixtures/log1.txt', 'r'), null, null]
    });
    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.equal(output1);
        done();
      }));
  });

  it('should error if it is not a tty and commit cannot be parsed', function(done) {
    var cp = spawn(cliPath, [], {
      stdio: [fs.openSync('test/fixtures/bad_commit.txt', 'r'), null, null]
    });
    cp.stderr
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.equal('Error: Cannot parse commit type: "bla bla\n"\n');
        done();
      }));
  });
});
