'use strict';
var conventionalcommitsWriter = require('../');
var expect = require('chai').expect;
var map = require('lodash').map;
var through = require('through2');
var today = require('dateformat')(new Date(), 'yyyy-mm-dd', true);

describe('conventionalCommitsWriter', function() {
  function getStream() {
    var upstream = through.obj();
    upstream.write({
      hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
      header: 'feat(scope): broadcast $destroy event on scope destruction',
      body: null,
      footer: 'Closes #1',
      notes: [{
        title: 'BREAKING NEWS',
        text: 'breaking news'
      }],
      references: [{
        action: 'Closes',
        repository: null,
        issue: '1',
        raw: '#1'
      }, {
        action: 'Closes',
        repository: null,
        issue: '2',
        raw: '#2'
      }, {
        action: 'Closes',
        repository: null,
        issue: '3',
        raw: '#3'
      }]
    });
    upstream.write({
      hash: '13f31602f396bc269076ab4d389cfd8ca94b20ba',
      header: 'fix(ng-list): Allow custom separator',
      body: 'bla bla bla',
      footer: 'BREAKING CHANGE: some breaking change',
      notes: [{
        title: 'BREAKING CHANGE',
        text: 'some breaking change'
      }],
      references: []
    });
    upstream.write({
      hash: '2064a9346c550c9b5dbd17eee7f0b7dd2cde9cf7',
      header: 'perf(template): tweak',
      body: 'My body.',
      footer: '',
      notes: [],
      references: []
    });
    upstream.write({
      hash: '5f241416b79994096527d319395f654a8972591a',
      header: 'refactor(name): rename this module to conventional-commits-writer',
      body: '',
      footer: '',
      notes: [],
      references: []
    });
    upstream.end();

    return upstream;
  }

  describe('no commits', function() {
    it('should still work if there is no commits', function(done) {
      var i = 0;

      var upstream = through.obj();
      upstream.end();
      upstream
        .pipe(conventionalcommitsWriter())
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.equal('<a name=""></a>\n#  (' + today + ')\n\n\n\n\n');

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(1);
          done();
        }));
    });
  });

  describe('link', function() {
    it('should link if host, repository, commit and issue are truthy', function(done) {
      var i = 0;

      getStream()
        .pipe(conventionalcommitsWriter({
          version: '0.5.0',
          title: 'this is a title',
          host: 'https://github.com',
          repository: 'a/b'
        }))
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.include('https://github.com/a/b/commits/13f3160');

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(1);
          done();
        }));
    });

    it ('should not link otherwise', function(done) {
      var i = 0;

      getStream()
        .pipe(conventionalcommitsWriter())
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.not.include('https://github.com/a/b/commits/13f3160');

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(1);
          done();
        }));
    });
  });

  describe('transform', function() {
    it('should ignore the field if it doesn\'t exist', function(done) {
      var i = 0;

      var upstream = through.obj();
      upstream.write({
        header: 'bla',
        body: null,
        footer: null,
        notes: []
      });
      upstream.end();
      upstream
        .pipe(conventionalcommitsWriter())
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.equal('<a name=""></a>\n#  (' + today + ')\n\n\n* bla \n\n\n\n');

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(1);
          done();
        }));
    });

    it('should strip the leading v', function(done) {
      var i = 0;

      var upstream = through.obj();
      upstream.write({
        header: 'bla',
        body: null,
        footer: null,
        notes: [],
        version: 'v1.0.0'
      });
      upstream.end();
      upstream
        .pipe(conventionalcommitsWriter())
        .pipe(through(function(chunk, enc, cb) {
          if (i === 1) {
            expect(chunk.toString()).to.equal('<a name="1.0.0"></a>\n# 1.0.0 (' + today + ')\n\n\n* bla \n\n\n\n');
          }

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(2);
          done();
        }));
    });

    it('should merge with the provided transform object', function(done) {
      var i = 0;

      getStream()
        .pipe(conventionalcommitsWriter({}, {
          transform: {
            notes: function(notes) {
              map(notes, function(note) {
                if (note.title === 'BREAKING CHANGE') {
                  note.title = 'BREAKING CHANGES';
                }

                return note;
              });

              return notes;
            }
          }
        }))
        .pipe(through(function(chunk, enc, cb) {
          chunk = chunk.toString();

          expect(chunk).to.include('13f3160');
          expect(chunk).to.include('BREAKING CHANGES');
          expect(chunk).to.not.include('13f31602f396bc269076ab4d389cfd8ca94b20ba');

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(1);
          done();
        }));
    });

    it('should ignore the commit if tranform returns `null`', function(done) {
      var i = 0;

      getStream()
        .pipe(conventionalcommitsWriter({}, {
          transform: function() {
            return false;
          }
        }))
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.equal('<a name=\"\"></a>\n#  (' + today + ')\n\n\n\n\n');

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(1);
          done();
        }));
    });
  });

  describe('generate', function() {
    function getStream() {
      var upstream = through.obj();
      upstream.write({
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        body: null,
        footer: null,
        notes: [],
        references: [],
        authorDate: '2015-04-07 14:17:05 +1000'
      });
      upstream.write({
        header: 'fix(ng-list): Allow custom separator',
        body: 'bla bla bla',
        footer: null,
        notes: [],
        references: [],
        version: '1.0.1',
        authorDate: '2015-04-07 15:00:44 +1000'
      });
      upstream.write({
        header: 'perf(template): tweak',
        body: 'My body.',
        footer: null,
        notes: [],
        references: [],
        authorDate: '2015-04-07 15:01:30 +1000'
      });
      upstream.write({
        header: 'refactor(name): rename this module to conventional-commits-writer',
        body: null,
        footer: null,
        notes: [],
        references: [],
        authorDate: '2015-04-08 09:43:59 +1000'
      });
      upstream.end();

      return upstream;
    }

    it('should generate on the transformed commit', function(done) {
      var i = 0;

      getStream()
        .pipe(conventionalcommitsWriter({
          version: '1.0.0'
        }, {
          transform: function(commit) {
            commit.version = '1.0.0';
            return commit;
          }
        }))
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.contain('# 1.0.0 ');

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(5);
          done();
        }));
    });

    describe('when commits are reversed', function() {
      it('should generate on `\'version\'` if it\'s a valid semver', function(done) {
        var i = 0;

        getStream()
          .pipe(conventionalcommitsWriter())
          .pipe(through(function(chunk, enc, cb) {
            chunk = chunk.toString();

            if (i === 0) {
              expect(chunk).to.include('<a name=""></a>\n#  (' + today);
              expect(chunk).to.include('feat(scope): ');

              expect(chunk).to.not.include('<a name="1.0.1"></a>');
              expect(chunk).to.not.include('fix(ng-list): ');
              expect(chunk).to.not.include('perf(template): ');
              expect(chunk).to.not.include('refactor(name): ');
            } else {
              expect(chunk).to.include('<a name="1.0.1"></a>\n## 1.0.1 (2015-04-07)');
              expect(chunk).to.include('fix(ng-list): ');
              expect(chunk).to.include('perf(template): ');
              expect(chunk).to.include('refactor(name): ');

              expect(chunk).to.not.include('<a name=""></a>');
              expect(chunk).to.not.include('feat(scope): ');
            }

            i++;
            cb(null);
          }, function() {
            expect(i).to.equal(2);
            done();
          }));
      });

      it('`generateOn` could be a string', function(done) {
        var i = 0;

        getStream()
          .pipe(conventionalcommitsWriter({}, {
            generateOn: 'version'
          }))
          .pipe(through(function(chunk, enc, cb) {
            chunk = chunk.toString();

            if (i === 0) {
              expect(chunk).to.include('<a name=""></a>\n#  (' + today);
              expect(chunk).to.not.include('<a name="1.0.1"></a>\n## 1.0.1 (2015-04-07)');
            } else {
              expect(chunk).to.include('<a name="1.0.1"></a>');
              expect(chunk).to.not.include('<a name=""></a>');
            }

            i++;
            cb(null);
          }, function() {
            expect(i).to.equal(2);
            done();
          }));
      });

      it('version should fall back on `context.version` and `context.date`', function(done) {
        var i = 0;

        getStream()
          .pipe(conventionalcommitsWriter({
            version: '0.0.1',
            date: '2015-01-01'
          }))
          .pipe(through(function(chunk, enc, cb) {
            chunk = chunk.toString();

            if (i === 0) {
              expect(chunk).to.include('<a name="0.0.1"></a>\n## 0.0.1 (2015-01-01)');
              expect(chunk).to.not.include('<a name="1.0.1"></a>');
            } else {
              expect(chunk).to.include('<a name="1.0.1"></a>\n## 1.0.1 (2015-04-07)');
              expect(chunk).to.not.include('<a name="0.0.1"></a>');
            }

            i++;
            cb(null);
          }, function() {
            expect(i).to.equal(2);
            done();
          }));
      });
    });

    describe('when commits are not reversed', function() {
      it('should generate on `\'version\'` if it\'s a valid semver', function(done) {
        var i = 0;

        getStream()
          .pipe(conventionalcommitsWriter({}, {
            reverse: false
          }))
          .pipe(through(function(chunk, enc, cb) {
            chunk = chunk.toString();

            if (i === 0) {
              expect(chunk).to.include('<a name="1.0.1"></a>\n## 1.0.1 (2015-04-07)');
              expect(chunk).to.include('feat(scope): ');
              expect(chunk).to.include('fix(ng-list): ');

              expect(chunk).to.not.include('<a name=""></a>');
              expect(chunk).to.not.include('perf(template): ');
              expect(chunk).to.not.include('refactor(name): ');
            } else {
              expect(chunk).to.include('<a name=""></a>\n#  (' + today);
              expect(chunk).to.include('perf(template): ');
              expect(chunk).to.include('refactor(name): ');

              expect(chunk).to.not.include('<a name="1.0.1"></a>');
              expect(chunk).to.not.include('feat(scope): ');
              expect(chunk).to.not.include('fix(ng-list): ');
            }

            i++;
            cb(null);
          }, function() {
            expect(i).to.equal(2);
            done();
          }));
      });
    });
  });
});
