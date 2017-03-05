'use strict';
var expect = require('chai').expect;
var shell = require('shelljs');
var spawn = require('child_process').spawn;
var fs = require('fs');
var readFileSync = fs.readFileSync;
var writeFileSync = fs.writeFileSync;

var cliPath = __dirname + '/../cli.js';

require('chai').should();

function originalChangelog() {
  writeFileSync(__dirname + '/fixtures/_CHANGELOG.md', 'Some previous changelog.\n');
}

describe('cli', function() {
  before(function() {
    shell.config.silent = true;
    shell.rm('-rf', 'tmp');
    shell.mkdir('tmp');
    shell.cd('tmp');
    shell.exec('git init');
    shell.exec('git add --all && git commit --allow-empty -m"feat: First commit"');
  });

  beforeEach(function() {
    shell.rm('-rf', 'CHANGELOG.md');
  });

  after(function() {
    shell.cd('../');
    originalChangelog();
  });

  describe('without any argument', function() {
    it('appends to changelog if it exists', function(done) {
      writeFileSync('CHANGELOG.md', '\nold content', 'utf-8');

      var cp = spawn(cliPath, {
        stdio: [process.stdin, null, null]
      });

      cp.on('close', function(code) {
        code.should.equal(0);
        var content = readFileSync('CHANGELOG.md', 'utf-8');
        content.should.match(/First commit/);
        content.should.match(/old content/);
        return done();
      });
    });

    it('generates changelog if it does not exist', function(done) {
      var cp = spawn(cliPath, {
        stdio: [process.stdin, null, null]
      });

      cp.on('close', function(code) {
        code.should.equal(0);
        var content = readFileSync('CHANGELOG.md', 'utf-8');
        content.should.match(/First commit/);
        return done();
      });
    });
  });

  it('should overwrite if `-s` presents when appending', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '-s', '--append'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync(__dirname + '/fixtures/_CHANGELOG.md', 'utf8');
      expect(modified).to.match(/Some previous changelog.(\s|.)*First commit/);

      originalChangelog();
      done();
    });
  });

  it('should overwrite if `-s` presents when not appending', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '-s'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync(__dirname + '/fixtures/_CHANGELOG.md', 'utf8');
      expect(modified).to.match(/First commit(\s|.)*Some previous changelog./);

      originalChangelog();
      done();
    });
  });

  it('should overwrite if `infile` and `outfile` are the same', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '-o', __dirname + '/fixtures/_CHANGELOG.md'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync(__dirname + '/fixtures/_CHANGELOG.md', 'utf8');
      expect(modified).to.include('First commit');
      expect(modified).to.include('Some previous changelog.\n');

      originalChangelog();
      done();
    });
  });

  it('should work if `infile` is missing but `outfile` presets', function(done) {
    var cp = spawn(cliPath, ['-o', __dirname + '/../tmp/_CHANGELOG.md'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);

      var modified = readFileSync(__dirname + '/../tmp/_CHANGELOG.md', 'utf8');
      expect(modified).to.include('First commit');
      done();
    });
  });

  it('should work if both `infile` and `outfile` presets when not appending', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '-o', __dirname + '/../tmp/_CHANGELOG.md'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync(__dirname + '/../tmp/_CHANGELOG.md', 'utf8');
      expect(modified).to.match(/First commit(\s|.)*Some previous changelog./);

      done();
    });
  });

  it('should work if both `infile` and `outfile` presets when appending', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '-o', __dirname + '/../tmp/_CHANGELOG.md', '--append'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync(__dirname + '/../tmp/_CHANGELOG.md', 'utf8');
      expect(modified).to.match(/Some previous changelog.(\s|.)*First commit/);
      done();
    });
  });

  it('should work if `infile` presets but `outfile` is missing when not appending', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync(__dirname + '/../tmp/_CHANGELOG.md', 'utf8');
      expect(modified).to.match(/Some previous changelog.(\s|.)*First commit/);

      done();
    });
  });

  it('should work if `infile` presets but `outfile` is missing when appending', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '--append'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync(__dirname + '/../tmp/_CHANGELOG.md', 'utf8');
      expect(modified).to.match(/Some previous changelog.(\s|.)*First commit/);

      done();
    });
  });

  it('should ignore `infile` if `releaseCount` is `0` (file)', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '--releaseCount', 0], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync(__dirname + '/fixtures/_CHANGELOG.md', 'utf8');
      expect(modified).to.include('First commit');
      expect(modified).to.not.include('previous');

      originalChangelog();
      done();
    });
  });

  it('should create `infile` if `infile` is ENOENT', function(done) {
    var cp = spawn(cliPath, ['-i', 'no-such-file.md'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync('no-such-file.md', 'utf8');
      expect(modified).to.include('First commit');
      expect(modified).to.not.include('previous');
      done();
    });
  });

  it('should create `infile` if `infile` is ENOENT and overwrite infile', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/../tmp/no-such-file.md', '-s'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync(__dirname + '/../tmp/no-such-file.md', 'utf8');
      expect(modified).to.include('First commit');
      expect(modified).to.not.include('previous');

      originalChangelog();
      done();
    });
  });

  it('should default to CHANGELOG.md if `-s` presents but `-i` is missing', function(done) {
    var cp = spawn(cliPath, ['-s'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync('CHANGELOG.md', 'utf8');
      expect(modified).to.include('First commit');
      expect(modified).to.not.include('previous');
      done();
    });
  });

  it('-k should work', function(done) {
    var cp = spawn(cliPath, ['-k', __dirname + '/fixtures/_package.json'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync('CHANGELOG.md', 'utf8');
      expect(modified).to.include('0.0.17');
      done();
    });
  });

  it('--context should work with relative path', function(done) {
    var cp = spawn(cliPath, ['--context', '../test/fixtures/context.json', '--config', '../test/fixtures/config.js'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync('CHANGELOG.md', 'utf8');
      expect(modified).to.include('my-repo');
      done();
    });
  });

  it('--context should work with absolute path', function(done) {
    var cp = spawn(cliPath, ['--context', '../test/fixtures/context.json', '--config', __dirname + '/fixtures/config.js'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync('CHANGELOG.md', 'utf8');
      expect(modified).to.include('my-repo');
      done();
    });
  });

  it('generates full historical changelog on --first-release', function(done) {
    shell.exec('git tag -a v0.0.17 -m "old release"');

    var cp = spawn(cliPath, ['-k', __dirname + '/fixtures/_package.json', '--first-release'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);
      var modified = readFileSync('CHANGELOG.md', 'utf8');
      expect(modified).to.include('First commit');
      shell.exec('git tag -d v0.0.17');
      done();
    });
  });

  it('outputs an error if context file is not found', function(done) {
    var output = '';

    var cp = spawn(cliPath, ['--context', 'missing-file.txt'], {
      stdio: [process.stdin, null, null]
    });

    cp.stderr.on('data', function(data) {
      output += data.toString();
    });

    cp.on('close', function(code) {
      expect(code).to.equal(1);
      output.toString().should.match(/Cannot find module/);
      return done();
    });
  });
});
