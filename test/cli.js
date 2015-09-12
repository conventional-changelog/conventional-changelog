'use strict';
var concat = require('concat-stream');
var expect = require('chai').expect;
var shell = require('shelljs');
var spawn = require('child_process').spawn;
var fs = require('fs');
var readFileSync = fs.readFileSync;
var writeFileSync = fs.writeFileSync;

var cliPath = __dirname + '/../cli.js';

function originalChangelog() {
  writeFileSync(__dirname + '/fixtures/_CHANGELOG.md', 'Some previous changelog.\n');
}

describe('cli', function() {
  before(function() {
    shell.cd('cli');
    shell.exec('git init --template=../git-templates');
    writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m"First commit"');
  });

  after(function() {
    shell.cd('../');
    originalChangelog();
  });

  it('should work without any arguments', function(done) {
    var cp = spawn(cliPath, {
      stdio: [process.stdin, null, null]
    });

    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.include('First commit');

        done();
      }));
  });

  it('should overwrite if `-w` presents when appending', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '-w', '--append'], {
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

  it('should overwrite if `-w` presents when not appending', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '-w'], {
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

    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.match(/First commit(\s|.)*Some previous changelog./);

        done();
      }));
  });

  it('should work if `infile` presets but `outfile` is missing when appending', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '--append'], {
      stdio: [process.stdin, null, null]
    });

    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.match(/Some previous changelog.(\s|.)*First commit/);

        done();
      }));
  });

  it('should ignore `infile` if `releaseCount` is `0` (stdout)', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '--release-count', 0], {
      stdio: [process.stdin, null, null]
    });

    cp.stdout
      .pipe(concat(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('First commit');
        expect(chunk).to.not.include('previous');

        done();
      }));
  });

  it('should ignore `infile` if `releaseCount` is `0` (file)', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/fixtures/_CHANGELOG.md', '--releaseCount', 0, '-w'], {
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

  it('should ignore `infile` if `infile` is ENOENT', function(done) {
    var cp = spawn(cliPath, ['-i', 'no-such-file.md'], {
      stdio: [process.stdin, null, null]
    });

    cp.stdout
      .pipe(concat(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('First commit');
        expect(chunk).to.not.include('previous');

        done();
      }));
  });

  it('should create `infile` if `infile` is ENOENT and overwrite infile', function(done) {
    var cp = spawn(cliPath, ['-i', __dirname + '/../tmp/no-such-file.md', '-w'], {
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

  it('should error if `-w` presents but `-i` is missing', function(done) {
    var cp = spawn(cliPath, ['-w'], {
      stdio: [process.stdin, null, null]
    });

    cp.stderr
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.equal('Nothing to overwrite\n');
      }));

    cp.on('close', function(code) {
      expect(code).to.equal(1);

      done();
    });
  });

  it('should error if it fails to get any options file', function(done) {
    var cp = spawn(cliPath, ['--parser-opts', 'no'], {
      stdio: [process.stdin, null, null]
    });

    cp.stderr
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.include('Failed to get file. ');
      }));

    cp.on('close', function(code) {
      expect(code).to.equal(1);

      done();
    });
  });

  it('-k should work', function(done) {
    var cp = spawn(cliPath, ['-k', __dirname + '/fixtures/_package.json'], {
      stdio: [process.stdin, null, null]
    });

    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.include('0.0.17');
      }));

    cp.on('close', function(code) {
      expect(code).to.equal(0);

      done();
    });
  });

  it('--writer-opts should work with relative path', function(done) {
    var cp = spawn(cliPath, ['--writer-opts', '../../test/fixtures/writer-opts.js'], {
      stdio: [process.stdin, null, null]
    });

    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.equal('template');
        done();
      }));
  });

  it('--writer-opts should work with absolute path', function(done) {
    var cp = spawn(cliPath, ['--writer-opts', __dirname + '/fixtures/writer-opts.js'], {
      stdio: [process.stdin, null, null]
    });

    cp.stdout
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.equal('template');
        done();
      }));
  });

  it('should be verbose', function(done) {
    var cp = spawn(cliPath, ['-v', '-p', 'no'], {
      stdio: [process.stdin, null, null]
    });

    cp.stderr
      .pipe(concat(function(chunk) {
        expect(chunk.toString()).to.include('Preset: "no" does not exist\n');

        done();
      }));
  });
});
