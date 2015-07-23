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

  it('should generate the changelog for the upcoming release', function(done) {
    shell.exec('git tag v0.1.0');
    writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m"Second commit"');
    writeFileSync('test3', '');
    shell.exec('git add --all && git commit -m"Third commit closes #1"');

    conventionalChangelog()
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('Second commit');
        expect(chunk).to.include('Third commit');

        expect(chunk).to.not.include('First commit');

        done();
      }));
  });

  it('should generate the changelog last two releases', function(done) {
    conventionalChangelog({
      releaseCount: 2
    })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('First commit');
        expect(chunk).to.include('Second commit');
        expect(chunk).to.include('Third commit');

        done();
      }));
  });

  it('should generate the changelog last two releases even if release count exceeds the limit', function(done) {
    conventionalChangelog({
      releaseCount: 100
    })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('First commit');
        expect(chunk).to.include('Second commit');
        expect(chunk).to.include('Third commit');

        done();
      }));
  });

  it('should honour `gitRawCommitsOpts.from`', function(done) {
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
      pkg: {
        path: __dirname + '/fixtures/_package.json'
      }
    })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('## 0.0.17');
        expect(chunk).to.include('Second commit');
        expect(chunk).to.include('closes [#1](https://github.com/ajoslin/conventional-changelog/issues/1)');

        done();
      }));
  });

  it('should load package.json for data even if repository field is missing', function(done) {
    conventionalChangelog({
      pkg: {
        path: __dirname + '/fixtures/_version-only.json'
      }
    })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('## 0.0.17');
        expect(chunk).to.include('Second commit');

        done();
      }));
  });

  it('should transform package.json data', function(done) {
    conventionalChangelog({
      pkg: {
        path: __dirname + '/fixtures/_short.json',
        transform: function(pkg) {
          pkg.version = 'v' + pkg.version;
          pkg.repository = 'a/b';
          return pkg;
        }
      }
    })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('## v0.0.17');
        expect(chunk).to.include('Second commit');
        expect(chunk).to.include('closes [#1](https://github.com/a/b/issues/1)');

        done();
      }));
  });

  it('should work in append mode', function(done) {
    conventionalChangelog({
      append: true,
    })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.match(/Second commit\n.*?\n\* Third commit/);

        done();
      }));
  });

  it('should read package.json if only `context.version` is missing', function(done) {
    conventionalChangelog({
      pkg: {
        path: __dirname + '/fixtures/_package.json'
      }
    }, {
      host: 'github',
      owner: 'a',
      repository: 'b'
    }).pipe(through(function(chunk) {
      chunk = chunk.toString();

      expect(chunk).to.include('## 0.0.17');
      expect(chunk).to.include('closes [#1](github/a/b/issues/1)');

      done();
    }));
  });

  it('should read host configs if only `parserOpts.referenceActions` is missing', function(done) {
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

  it('should read github\'s host configs', function(done) {
    conventionalChangelog({}, {
      host: 'github',
      repository: 'b/a'
    }, {}, {}).pipe(through(function(chunk) {
      chunk = chunk.toString();

      expect(chunk).to.include('](github/b/a/commit/');
      expect(chunk).to.include('closes [#1](github/b/a/issues/1)');

      done();
    }));
  });

  it('should read bitbucket\'s host configs', function(done) {
    conventionalChangelog({}, {
      host: 'bitbucket',
      repository: 'b/a'
    }, {}, {}).pipe(through(function(chunk) {
      chunk = chunk.toString();

      expect(chunk).to.include('](bitbucket/b/a/commits/');
      expect(chunk).to.include('closes [#1](bitbucket/b/a/issue/1)');

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
      pkg: {
        path: 'no'
      },
      warn: function(warning) {
        expect(warning).to.equal('package.json: "no" does not exist');

        done();
      }
    });
  });

  it('should warn if package.json cannot be parsed', function(done) {
    conventionalChangelog({
      pkg: {
        path: __dirname + '/fixtures/_malformation.json'
      },
      warn: function(warning) {
        expect(warning).to.equal('package.json: "' + __dirname + '/fixtures/_malformation.json" cannot be parsed');

        done();
      }
    });
  });

  it('should error if it errors in git-raw-commits', function(done) {
    conventionalChangelog({}, {}, {
      unknowOptions: false
    })
      .on('error', function(err) {
        expect(err).to.include('Error in git-raw-commits.');

        done();
      });
  });

  it('should error if it errors in `options.transform`', function(done) {
    conventionalChangelog({
      transform: through.obj(function(chunk, enc, cb) {
        cb('error');
      })
    })
      .on('error', function(err) {
        expect(err).to.include('Error in conventional-commits-parser.');

        done();
      });
  });

  it('should be object mode if `writerOpts.includeDetails` is `true`', function(done) {
    conventionalChangelog({}, {}, {}, {}, {
      includeDetails: true
    })
      .pipe(through.obj(function() {
        done();
      }));
  });
});
