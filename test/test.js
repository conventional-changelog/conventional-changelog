'use strict';
var conventionalChangelog = require('../');
var expect = require('chai').expect;
var gitTails = require('git-tails');
var shell = require('shelljs');
var through = require('through2');
var writeFileSync = require('fs').writeFileSync;

describe('conventionalChangelog', function() {
  before(function() {
    shell.cd('test');
    shell.exec('git init --template=../git-templates');
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

  it('should generate the changelog of the last two releases', function(done) {
    var i = 0;

    conventionalChangelog({
      releaseCount: 2
    })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        if (i === 0) {
          expect(chunk).to.include('Second commit');
          expect(chunk).to.include('Third commit');
        } else if (i === 1) {
          expect(chunk).to.include('First commit');
        }

        i++;
        cb();
      }, function() {
        expect(i).to.equal(2);
        done();
      }));
  });

  it('should generate the changelog of the last two releases even if release count exceeds the limit', function(done) {
    var i = 0;

    conventionalChangelog({
      releaseCount: 100
    })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        if (i === 0) {
          expect(chunk).to.include('Second commit');
          expect(chunk).to.include('Third commit');
        } else if (i === 1) {
          expect(chunk).to.include('First commit');
        }

        i++;
        cb();
      }, function() {
        expect(i).to.equal(2);
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
        expect(chunk).to.match(/Third commit closes #1[\w\W]*?\* Second commit/);

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

  it('should fallback to use the url if repo is unknown', function(done) {
    conventionalChangelog({
      pkg: {
        path: __dirname + '/fixtures/_unknown-host.json'
      }
    }, {
      linkReferences: true
    }).pipe(through(function(chunk) {
      chunk = chunk.toString();

      expect(chunk).to.include('](https://unknown-host/a/b/commits/');
      expect(chunk).to.include('closes [#1](https://unknown-host/a/b/issues/1)');

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

        expect(chunk).to.match(/Second commit[\w\W]*?\* Third commit/);

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

  it('should read the closest package.json by default', function(done) {
    conventionalChangelog()
      .pipe(through(function(chunk) {
        expect(chunk.toString()).to.include('closes [#1](https://github.com/ajoslin/conventional-changelog/issues/1)');

        done();
      }));
  });

  it('should read host configs if only `parserOpts.referenceActions` is missing', function(done) {
    conventionalChangelog({}, {
      host: 'github',
      owner: 'b',
      repository: 'a',
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
      owner: 'b',
      repository: 'a'
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
      owner: 'b',
      repository: 'a'
    }, {}, {}).pipe(through(function(chunk) {
      chunk = chunk.toString();

      expect(chunk).to.include('](bitbucket/b/a/commits/');
      expect(chunk).to.include('closes [#1](bitbucket/b/a/issue/1)');

      done();
    }));
  });

  it('should read gitlab\'s host configs', function(done) {
    conventionalChangelog({}, {
      host: 'gitlab',
      owner: 'b',
      repository: 'a'
    }, {}, {}).pipe(through(function(chunk) {
      chunk = chunk.toString();

      expect(chunk).to.include('](gitlab/b/a/commit/');
      expect(chunk).to.include('closes [#1](gitlab/b/a/issues/1)');

      done();
    }));
  });

  it('should transform the commit', function(done) {
    conventionalChangelog({
      transform: function(chunk, cb) {
        chunk.header = 'A tiny header';
        cb(null, chunk);
      }
    })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('A tiny header');
        expect(chunk).to.not.include('Third');

        done();
      }));
  });

  it('should generate all log blocks', function(done) {
    var i = 0;

    conventionalChangelog({
      releaseCount: 0
    })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        if (i === 0) {
          expect(chunk).to.include('Second commit');
          expect(chunk).to.include('Third commit closes #1');
        } else {
          expect(chunk).to.include('First commit');
        }

        i++;
        cb();
      }, function() {
        expect(i).to.equal(2);
        done();
      }));
  });

  it('should work if there are two semver tags', function(done) {
    writeFileSync('test7', '');
    shell.exec('git add --all && git commit -m"some more features"');
    shell.exec('git tag v2.0.0');

    var i = 0;

    conventionalChangelog({
      releaseCount: 0
    })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        if (i === 1) {
          expect(chunk).to.include('# 2.0.0');
        } else if (i === 2) {
          expect(chunk).to.include('# 0.1.0');
        }

        i++;
        cb();
      }, function() {
        expect(i).to.equal(3);
        done();
      }));
  });

  it('semverTags should be attached to the `context` object', function(done) {
    var i = 0;

    conventionalChangelog({
      releaseCount: 0
    }, {}, {}, {}, {
      mainTemplate: '{{gitSemverTags}} or {{gitSemverTags.[0]}}'
    })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        expect(chunk).to.equal('v2.0.0,v0.1.0 or v2.0.0');

        i++;
        cb();
      }, function() {
        expect(i).to.equal(3);
        done();
      }));
  });

  describe('finalizeContext', function() {
    var tail;

    before(function(done) {
      shell.exec('git tag -d v0.1.0');
      gitTails(function(err, data) {
        tail = data[data.length - 1].substring(0, 7);
        done();
      });
    });

    it('should make `context.previousTag` default to a previous version of generated log (prepend)', function(done) {
      var i = 0;

      conventionalChangelog({
        releaseCount: 0
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}'
      })
        .pipe(through(function(chunk, enc, cb) {
          chunk = chunk.toString();

          if (i === 0) {
            expect(chunk).to.equal('v2.0.0...v3.0.0');
          } else if (i === 1) {
            expect(chunk).to.equal(tail + '...v2.0.0');
          }

          i++;
          cb();
        }, function() {
          expect(i).to.equal(2);
          done();
        }));
    });

    it('should make `context.previousTag` default to a previous version of generated log (append)', function(done) {
      var i = 0;

      conventionalChangelog({
        releaseCount: 0,
        append: true
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}'
      })
        .pipe(through(function(chunk, enc, cb) {
          chunk = chunk.toString();

          if (i === 0) {
            expect(chunk).to.equal(tail + '...v2.0.0');
          } else if (i === 1) {
            expect(chunk).to.equal('v2.0.0...v3.0.0');
          }

          i++;
          cb();
        }, function() {
          expect(i).to.equal(2);
          done();
        }));
    });

    it('should still work if first release has no commits (prepend)', function(done) {
      shell.exec('git tag v0.0.1 ' + tail);
      var i = 0;

      conventionalChangelog({
        releaseCount: 0
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}',
        transform: function() {
          return null;
        }
      })
        .pipe(through(function(chunk, enc, cb) {
          chunk = chunk.toString();

          if (i === 0) {
            expect(chunk).to.equal('v2.0.0...v3.0.0');
          } else if (i === 1) {
            expect(chunk).to.equal('v0.0.1...v2.0.0');
          } else if (i === 2) {
            expect(chunk).to.equal('...v0.0.1');
          }

          i++;
          cb();
        }, function() {
          expect(i).to.equal(3);
          done();
        }));
    });

    it('should still work if first release has no commits (append)', function(done) {
      var i = 0;

      conventionalChangelog({
        releaseCount: 0,
        append: true
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}',
        transform: function() {
          return null;
        }
      })
        .pipe(through(function(chunk, enc, cb) {
          chunk = chunk.toString();

          if (i === 0) {
            expect(chunk).to.equal('...v0.0.1');
          } else if (i === 1) {
            expect(chunk).to.equal('v0.0.1...v2.0.0');
          } else if (i === 2) {
            expect(chunk).to.equal('v2.0.0...v3.0.0');
          }

          i++;
          cb();
        }, function() {
          expect(i).to.equal(3);
          done();
        }));
    });

    it('should not link compare if previousTag is not truthy', function(done) {
      var i = 0;

      conventionalChangelog({
        releaseCount: 0,
        append: true
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{#if linkCompare}}{{previousTag}}...{{currentTag}}{{else}}Not linked{{/if}}',
        transform: function() {
          return null;
        }
      })
        .pipe(through(function(chunk, enc, cb) {
          chunk = chunk.toString();

          if (i === 0) {
            expect(chunk).to.equal('Not linked');
          } else if (i === 1) {
            expect(chunk).to.equal('v0.0.1...v2.0.0');
          } else if (i === 2) {
            expect(chunk).to.equal('v2.0.0...v3.0.0');
          }

          i++;
          cb();
        }, function() {
          expect(i).to.equal(3);
          done();
        }));
    });
  });

  it('should not link compare', function(done) {
    var i = 0;

    conventionalChangelog({
      releaseCount: 0,
      append: true
    }, {
      version: '3.0.0',
      linkCompare: false
    }, {}, {}, {
      mainTemplate: '{{#if linkCompare}}{{previousTag}}...{{currentTag}}{{else}}Not linked{{/if}}',
      transform: function() {
        return null;
      }
    })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        expect(chunk).to.equal('Not linked');

        i++;
        cb();
      }, function() {
        expect(i).to.equal(3);
        done();
      }));
  });

  it('should warn if preset is not found', function(done) {
    var i = 0;

    conventionalChangelog({
      preset: 'no',
      warn: function(warning) {
        if (i > 0) {
          return;
        }

        expect(warning).to.equal('Preset: "no" does not exist');

        i++;
        done();
      }
    });
  });

  it('should still work if preset is not found', function(done) {
    var i = 0;

    conventionalChangelog({
      preset: 'no'
    })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        expect(chunk).to.include('#');

        i++;
        cb();
      }, function() {
        expect(i).to.equal(1);
        done();
      }));
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
        expect(warning).to.include('Error');

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
        expect(warning).to.include('Error');

        done();
      }
    });
  });

  it('should error if anything throws', function(done) {
    conventionalChangelog({
      pkg: {
        path: __dirname + '/fixtures/_malformation.json'
      },
      warn: function() {
        undefined.a = 10;
      }
    }).on('error', function(err) {
      expect(err).to.be.ok; // jshint ignore:line
      done();
    });
  });

  it('should error if there is an error in `options.pkg.transform`', function(done) {
    conventionalChangelog({
      pkg: {
        path: __dirname + '/fixtures/_short.json',
        transform: function() {
          undefined.a = 10;
        }
      }
    })
      .on('error', function(err) {
        expect(err.message).to.include('undefined');

        done();
      });
  });

  it('should error if it errors in git-raw-commits', function(done) {
    conventionalChangelog({}, {}, {
      unknowOptions: false
    })
      .on('error', function(err) {
        expect(err.message).to.include('Error in git-raw-commits:');

        done();
      });
  });

  it('should error if it emits an error in `options.transform`', function(done) {
    writeFileSync('test8', '');
    shell.exec('git add --all && git commit -m"test8"');

    conventionalChangelog({
      transform: function(commit, cb) {
        cb('error');
      }
    })
      .on('error', function(err) {
        expect(err.message).to.include('Error in options.transform:');

        done();
      });
  });

  it('should error if there is an error in `options.transform`', function(done) {
    writeFileSync('test8', '');
    shell.exec('git add --all && git commit -m"test8"');

    conventionalChangelog({
      transform: function() {
        undefined.a = 10;
      }
    })
      .on('error', function(err) {
        expect(err.message).to.include('Error in options.transform:');

        done();
      });
  });

  it('should error if it errors in conventional-changelog-writer', function(done) {
    conventionalChangelog({}, {}, {}, {}, {
      finalizeContext: function() {
        return undefined.a;
      }
    })
      .on('error', function(err) {
        expect(err.message).to.include('Error in conventional-changelog-writer:');

        done();
      });
  });

  it('should be object mode if `writerOpts.includeDetails` is `true`', function(done) {
    conventionalChangelog({}, {}, {}, {}, {
      includeDetails: true
    })
      .pipe(through.obj(function(chunk) {
        expect(chunk).to.be.an('object');
        done();
      }));
  });

  it('should pass `parserOpts` to conventional-commits-parser', function(done) {
    writeFileSync('test9', '');
    shell.exec('git add --all && git commit -m"test9" -m"Release note: super release!"');

    conventionalChangelog({}, {}, {}, {
      noteKeywords: [
        'Release note'
      ]
    })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        expect(chunk).to.include('* test9');
        expect(chunk).to.include('### Release note\n\n* super release!');

        cb();
      }, function() {
        done();
      }));
  });
});
