'use strict';
var expect = require('chai').expect;
var readFileSync = require('fs').readFileSync;
var spawn = require('child_process').spawn;
var concat = require('concat-stream');

var cliPath = './cli.js';

describe('cli', function() {
  it('should parse commits in a file', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log.txt']);

    cp.stdout
      .pipe(concat(function(chunk) {
        var expected = readFileSync('test/expected/output1.txt', 'utf-8');

        expect(chunk.toString()).to.equal(expected);
        done();
      }));
  });

  it('should work with a separator', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log2.txt', '===']);

    cp.stdout
      .pipe(concat(function(chunk) {
        var expected = readFileSync('test/expected/output2.txt', 'utf-8');

        expect(chunk.toString()).to.equal(expected);
        done();
      }));
  });

  it('should work with two files', function(done) {
    var cp = spawn(cliPath, ['test/fixtures/log.txt', 'test/fixtures/log2.txt', '===']);

    cp.stdout
      .pipe(concat(function(chunk) {
        var expected = readFileSync('test/expected/output_both.txt', 'utf-8');

        expect(chunk.toString()).to.equal(expected);
        done();
      }));
  });
});
