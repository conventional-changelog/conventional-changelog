'use strict';
var concat = require('concat-stream');
var conventionalChangelog = require('./');
var expect = require('chai').expect;
var gutil = require('gulp-util');
var join = require('path').join;
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

shell.config.silent = true;
shell.rm('-rf', 'tmp');
shell.mkdir('tmp');
shell.cd('tmp');
shell.exec('git init');

describe('error', function() {
  it('should emit error if any', function(cb) {
    var stream = conventionalChangelog({
      preset: 'angular'
    });

    stream.on('error', function(err) {
      expect(err.plugin).to.equal('gulp-conventional-changelog');
      cb();
    });

    stream.on('data', function(file) {
      cb(file);
    });

    stream.write(new gutil.File({
      cwd: __dirname,
      base: join(__dirname, 'fixtures'),
      path: join(__dirname, 'fixtures/CHANGELOG.md'),
      contents: new Buffer('')
    }));

    stream.end();
  });
});

describe('stream', function() {
  before(function(done) {
    writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m"feat(module): amazing new module"');

    done();
  });

  it('should prepend the log', function(cb) {
    var stream = conventionalChangelog({
      preset: 'angular'
    });

    var fakeStream = through();
    fakeStream.write(new Buffer('CHANGELOG'));
    fakeStream.end();

    stream.on('data', function(file) {
      file.contents
        .pipe(concat(function(data) {
          expect(data.toString()).to.match(/### Features[\w\W]*module:[\w\W]*amazing new module.[\w\W]*CHANGELOG$/);
          cb();
        }));
    });

    stream.write(new gutil.File({
      cwd: __dirname,
      base: join(__dirname, 'fixtures'),
      path: join(__dirname, 'fixtures/CHANGELOG.md'),
      contents: fakeStream
    }));

    stream.end();
  });

  it('should append the log', function(cb) {
    var stream = conventionalChangelog({
      preset: 'angular',
      append: true
    });

    var fakeStream = through();
    fakeStream.write(new Buffer('CHANGELOG'));
    fakeStream.end();

    stream.on('data', function(file) {
      file.contents
        .pipe(concat(function(data) {
          expect(data.toString()).to.match(/CHANGELOG[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/);
          cb();
        }));
    });

    stream.write(new gutil.File({
      cwd: __dirname,
      base: join(__dirname, 'fixtures'),
      path: join(__dirname, 'fixtures/CHANGELOG.md'),
      contents: fakeStream
    }));

    stream.end();
  });

  it('should generate all blocks', function(cb) {
    var stream = conventionalChangelog({
      preset: 'angular',
      releaseCount: 0
    });

    var fakeStream = through();

    stream.on('data', function(file) {
      file.contents
        .pipe(concat(function(data) {
          expect(data.toString()).to.match(/[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/);
          cb();
        }));
    });

    stream.write(new gutil.File({
      cwd: __dirname,
      base: join(__dirname, 'fixtures'),
      path: join(__dirname, 'fixtures/CHANGELOG.md'),
      contents: fakeStream
    }));

    stream.end();
  });
});

describe('buffer', function() {
  it('should prepend the log', function(cb) {
    var stream = conventionalChangelog({
      preset: 'angular'
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.match(/### Features[\w\W]*module:[\w\W]*amazing new module.[\w\W]*CHANGELOG$/);
    });

    stream.on('end', cb);

    stream.write(new gutil.File({
      cwd: __dirname,
      base: join(__dirname, 'fixtures'),
      path: join(__dirname, 'fixtures/CHANGELOG.md'),
      contents: new Buffer('CHANGELOG')
    }));

    stream.end();
  });

  it('should append the log', function(cb) {
    var stream = conventionalChangelog({
      preset: 'angular',
      append: true
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.match(/CHANGELOG[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/);
    });

    stream.on('end', cb);

    stream.write(new gutil.File({
      cwd: __dirname,
      base: join(__dirname, 'fixtures'),
      path: join(__dirname, 'fixtures/CHANGELOG.md'),
      contents: new Buffer('CHANGELOG')
    }));

    stream.end();
  });

  it('should generate all blocks', function(cb) {
    var stream = conventionalChangelog({
      preset: 'angular',
      releaseCount: 0
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.match(/[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/);
    });

    stream.on('end', cb);

    stream.write(new gutil.File({
      cwd: __dirname,
      base: join(__dirname, 'fixtures'),
      path: join(__dirname, 'fixtures/CHANGELOG.md'),
      contents: new Buffer('CHANGELOG')
    }));

    stream.end();
  });

  it('output encoding should always be buffer', function(cb) {
    shell.exec('git tag v0.0.0');
    var stream = conventionalChangelog({
      preset: 'angular'
    }, {
      version: '0.0.0'
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.equal('CHANGELOG');
    });

    stream.on('end', cb);

    stream.write(new gutil.File({
      cwd: __dirname,
      base: join(__dirname, 'fixtures'),
      path: join(__dirname, 'fixtures/CHANGELOG.md'),
      contents: new Buffer('CHANGELOG')
    }));

    stream.end();
  });
});

describe('null', function() {
  it('should let null files pass through', function(done) {
    var stream = conventionalChangelog();
    var n = 0;

    stream.pipe(through.obj(function(file, enc, cb) {
      expect(file.path).to.equal('null.md');
      expect(file.contents).to.equal(null);
      n++;

      cb();
    }, function() {
      expect(n).to.equal(1);
      done();
    }));

    stream.write(new gutil.File({
      path: 'null.md',
      contents: null
    }));

    stream.end();
  });
});

it('should verbose', function(cb) {
  var stream = conventionalChangelog({
    verbose: true
  });

  stream.on('error', function() {
    console.log('You should see your git-log command');
    cb();
  });

  stream.write(new gutil.File({
    cwd: __dirname,
    base: join(__dirname, 'fixtures'),
    path: join(__dirname, 'fixtures/CHANGELOG.md'),
    contents: new Buffer('CHANGELOG')
  }));

  stream.end();
});
