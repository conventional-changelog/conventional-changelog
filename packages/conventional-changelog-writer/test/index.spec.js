'use strict';
var conventionalcommitsWriter = require('../');
var dateFormat = require('dateformat');
var expect = require('chai').expect;
var through = require('through2');

describe('conventionalCommitsWriter', function() {
  function getStream() {
    var upstream = through.obj();
    upstream.write({
      hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
      header: 'feat(scope): broadcast $destroy event on scope destruction',
      type: 'feat',
      scope: 'scope',
      subject: 'broadcast $destroy event on scope destruction',
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
      type: 'fix',
      scope: 'ng-list',
      subject: 'Allow custom separator',
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
      type: 'perf',
      scope: 'template',
      subject: 'tweak',
      body: 'My body.',
      footer: '',
      notes: [],
      references: []
    });
    upstream.write({
      hash: '5f241416b79994096527d319395f654a8972591a',
      header: 'refactor(name): rename this module to conventional-commits-writer',
      type: 'refactor',
      scope: 'name',
      subject: 'rename this module to conventional-commits-writer',
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
          expect(chunk.toString()).to.equal('<a name=""></a>\n#  (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n\n\n');

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(1);
          done();
        }));
    });
  });

  describe('host', function() {
    it('should work if there is a "/" at the end of host', function(done) {
      var i = 0;

      getStream()
        .pipe(conventionalcommitsWriter({
          version: '0.0.1',
          title: 'this is a title',
          host: 'https://github.com/',
          repository: 'a/b'
        }))
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.equal('<a name="0.0.1"></a>\n## 0.0.1 "this is a title" (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator ([13f3160](https://github.com/a/b/commits/13f3160))\n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction ([9b1aff9](https://github.com/a/b/commits/9b1aff9)), closes [#1](https://github.com/a/b/issues/1) [#2](https://github.com/a/b/issues/2) [#3](https://github.com/a/b/issues/3)\n\n### Performance Improvements\n\n* **template:** tweak ([2064a93](https://github.com/a/b/commits/2064a93))\n\n* **name:** rename this module to conventional-commits-writer ([5f24141](https://github.com/a/b/commits/5f24141))\n\n\n### BREAKING CHANGES\n\n* some breaking change\n\n### BREAKING NEWS\n\n* breaking news\n\n\n\n');

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
          expect(chunk.toString()).to.equal('<a name="0.5.0"></a>\n# 0.5.0 "this is a title" (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator ([13f3160](https://github.com/a/b/commits/13f3160))\n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction ([9b1aff9](https://github.com/a/b/commits/9b1aff9)), closes [#1](https://github.com/a/b/issues/1) [#2](https://github.com/a/b/issues/2) [#3](https://github.com/a/b/issues/3)\n\n### Performance Improvements\n\n* **template:** tweak ([2064a93](https://github.com/a/b/commits/2064a93))\n\n* **name:** rename this module to conventional-commits-writer ([5f24141](https://github.com/a/b/commits/5f24141))\n\n\n### BREAKING CHANGES\n\n* some breaking change\n\n### BREAKING NEWS\n\n* breaking news\n\n\n\n');

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
          expect(chunk.toString()).to.equal('<a name=""></a>\n#  (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator 13f3160\n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction 9b1aff9, closes #1 #2 #3\n\n### Performance Improvements\n\n* **template:** tweak 2064a93\n\n* **name:** rename this module to conventional-commits-writer 5f24141\n\n\n### BREAKING CHANGES\n\n* some breaking change\n\n### BREAKING NEWS\n\n* breaking news\n\n\n\n');

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
          expect(chunk.toString()).to.equal('<a name=""></a>\n#  (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n* bla \n\n\n\n');

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
          expect(chunk.toString()).to.equal('<a name="1.0.0"></a>\n# 1.0.0 (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n* bla \n\n\n\n');

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(1);
          done();
        }));
    });

    it('should change "BREAKING CHANGE" to "BREAKING CHANGES"', function(done) {
      var i = 0;

      getStream()
        .pipe(conventionalcommitsWriter())
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.equal('<a name=""></a>\n#  (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator 13f3160\n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction 9b1aff9, closes #1 #2 #3\n\n### Performance Improvements\n\n* **template:** tweak 2064a93\n\n* **name:** rename this module to conventional-commits-writer 5f24141\n\n\n### BREAKING CHANGES\n\n* some breaking change\n\n### BREAKING NEWS\n\n* breaking news\n\n\n\n');

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
          expect(chunk.toString()).to.equal('<a name=\"\"></a>\n#  (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n\n\n');

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(1);
          done();
        }));
    });
  });

  describe('generate', function() {
    it('should generate on `\'version\'` if it\'s a valid semver by default', function(done) {
      var i = 0;

      var upstream = through.obj();
      upstream.write({
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        type: 'feat',
        scope: 'scope',
        subject: 'broadcast $destroy event on scope destruction',
        body: null,
        footer: null,
        notes: [],
        references: [],
        authorDate: '2015-04-07 14:17:05 +1000'
      });
      upstream.write({
        header: 'fix(ng-list): Allow custom separator',
        type: 'fix',
        scope: 'ng-list',
        subject: 'Allow custom separator',
        body: 'bla bla bla',
        footer: null,
        notes: [],
        references: [],
        version: '1.0.1',
        authorDate: '2015-04-07 15:00:44 +1000'
      });
      upstream.write({
        header: 'perf(template): tweak',
        type: 'perf',
        scope: 'template',
        subject: 'tweak',
        body: 'My body.',
        footer: null,
        notes: [],
        references: [],
        authorDate: '2015-04-07 15:01:30 +1000'
      });
      upstream.write({
        header: 'refactor(name): rename this module to conventional-commits-writer',
        type: 'refactor',
        scope: 'name',
        subject: 'rename this module to conventional-commits-writer',
        body: null,
        footer: null,
        notes: [],
        references: [],
        authorDate: '2015-04-08 09:43:59 +1000'
      });
      upstream.end();

      upstream
        .pipe(conventionalcommitsWriter())
        .pipe(through(function(chunk, enc, cb) {
          if (i === 0) {
            expect(chunk.toString()).to.equal('<a name="1.0.1"></a>\n## 1.0.1 (2015-04-07)\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator \n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction \n\n\n\n');
          } else {
            expect(chunk.toString()).to.equal('<a name=""></a>\n#  (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Performance Improvements\n\n* **template:** tweak \n\n* **name:** rename this module to conventional-commits-writer \n\n\n\n');
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

      var upstream = through.obj();
      upstream.write({
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        type: 'feat',
        scope: 'scope',
        subject: 'broadcast $destroy event on scope destruction',
        body: null,
        footer: null,
        notes: [],
        references: []
      });
      upstream.write({
        header: 'fix(ng-list): Allow custom separator',
        type: 'fix',
        scope: 'ng-list',
        subject: 'Allow custom separator',
        body: 'bla bla bla',
        footer: null,
        notes: [],
        references: [],
        version: 'v1.0.1'
      });
      upstream.write({
        header: 'perf(template): tweak',
        type: 'perf',
        scope: 'template',
        subject: 'tweak',
        body: 'My body.',
        footer: null,
        notes: [],
        references: []
      });
      upstream.write({
        header: 'refactor(name): rename this module to conventional-commits-writer',
        type: 'refactor',
        scope: 'name',
        subject: 'rename this module to conventional-commits-writer',
        body: null,
        footer: null,
        notes: [],
        references: []
      });
      upstream.end();

      upstream
        .pipe(conventionalcommitsWriter({}, {
          generateOn: 'version'
        }))
        .pipe(through(function(chunk, enc, cb) {
          if (i === 0) {
            expect(chunk.toString()).to.equal('<a name="1.0.1"></a>\n## 1.0.1 (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator \n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction \n\n\n\n');
          } else {
            expect(chunk.toString()).to.equal('<a name=""></a>\n#  (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Performance Improvements\n\n* **template:** tweak \n\n* **name:** rename this module to conventional-commits-writer \n\n\n\n');
          }

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(2);
          done();
        }));
    });

    it('version should fall back on `context.version`', function(done) {
      var i = 0;

      var upstream = through.obj();
      upstream.write({
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        type: 'feat',
        scope: 'scope',
        subject: 'broadcast $destroy event on scope destruction',
        body: null,
        footer: null,
        notes: [],
        references: []
      });
      upstream.write({
        header: 'fix(ng-list): Allow custom separator',
        type: 'fix',
        scope: 'ng-list',
        subject: 'Allow custom separator',
        body: 'bla bla bla',
        footer: null,
        notes: [],
        references: [],
        version: '1.0.1'
      });
      upstream.write({
        header: 'perf(template): tweak',
        type: 'perf',
        scope: 'template',
        subject: 'tweak',
        body: 'My body.',
        footer: null,
        notes: [],
        references: []
      });
      upstream.write({
        header: 'refactor(name): rename this module to conventional-commits-writer',
        type: 'refactor',
        scope: 'name',
        subject: 'rename this module to conventional-commits-writer',
        body: null,
        footer: null,
        notes: [],
        references: []
      });
      upstream.end();

      upstream
        .pipe(conventionalcommitsWriter({
          version: '0.0.1'
        }))
        .pipe(through(function(chunk, enc, cb) {
          if (i === 0) {
            expect(chunk.toString()).to.equal('<a name="1.0.1"></a>\n## 1.0.1 (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator \n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction \n\n\n\n');
          } else {
            expect(chunk.toString()).to.equal('<a name="0.0.1"></a>\n## 0.0.1 (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Performance Improvements\n\n* **template:** tweak \n\n* **name:** rename this module to conventional-commits-writer \n\n\n\n');
          }

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(2);
          done();
        }));
    });

    it('date should fall back on `context.date`', function(done) {
      var i = 0;

      var upstream = through.obj();
      upstream.write({
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        type: 'feat',
        scope: 'scope',
        subject: 'broadcast $destroy event on scope destruction',
        body: null,
        footer: null,
        notes: [],
        references: []
      });
      upstream.write({
        header: 'fix(ng-list): Allow custom separator',
        type: 'fix',
        scope: 'ng-list',
        subject: 'Allow custom separator',
        body: 'bla bla bla',
        footer: null,
        notes: [],
        references: [],
        version: '1.0.1',
        authorDate: '2015-04-07 15:01:30 +1000'
      });
      upstream.write({
        header: 'perf(template): tweak',
        type: 'perf',
        scope: 'template',
        subject: 'tweak',
        body: 'My body.',
        footer: null,
        notes: [],
        references: []
      });
      upstream.write({
        header: 'refactor(name): rename this module to conventional-commits-writer',
        type: 'refactor',
        scope: 'name',
        subject: 'rename this module to conventional-commits-writer',
        body: null,
        footer: null,
        notes: [],
        references: []
      });
      upstream.end();

      upstream
        .pipe(conventionalcommitsWriter({
          date: '2015-01-01'
        }))
        .pipe(through(function(chunk, enc, cb) {
          if (i === 0) {
            expect(chunk.toString()).to.equal('<a name="1.0.1"></a>\n## 1.0.1 (2015-04-07)\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator \n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction \n\n\n\n');
          } else {
            expect(chunk.toString()).to.equal('<a name=""></a>\n#  (2015-01-01)\n\n\n### Performance Improvements\n\n* **template:** tweak \n\n* **name:** rename this module to conventional-commits-writer \n\n\n\n');
          }

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(2);
          done();
        }));
    });

    it('`context.version` should be overwritten by `commit.version`', function(done) {
      var i = 0;

      var upstream = through.obj();
      upstream.write({
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        type: 'feat',
        scope: 'scope',
        subject: 'broadcast $destroy event on scope destruction',
        body: null,
        footer: null,
        notes: [],
        references: []
      });
      upstream.write({
        header: 'fix(ng-list): Allow custom separator',
        type: 'fix',
        scope: 'ng-list',
        subject: 'Allow custom separator',
        body: 'bla bla bla',
        footer: null,
        notes: [],
        references: [],
        version: '1.0.1'
      });
      upstream.write({
        header: 'perf(template): tweak',
        type: 'perf',
        scope: 'template',
        subject: 'tweak',
        body: 'My body.',
        footer: null,
        notes: [],
        references: []
      });
      upstream.write({
        header: 'refactor(name): rename this module to conventional-commits-writer',
        type: 'refactor',
        scope: 'name',
        subject: 'rename this module to conventional-commits-writer',
        body: null,
        footer: null,
        notes: [],
        references: [],
        version: '2.0.0'
      });
      upstream.end();

      upstream
        .pipe(conventionalcommitsWriter({
          version: '0.0.1'
        }))
        .pipe(through(function(chunk, enc, cb) {
          if (i === 0) {
            expect(chunk.toString()).to.equal('<a name="1.0.1"></a>\n## 1.0.1 (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator \n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction \n\n\n\n');
          } else {
            expect(chunk.toString()).to.equal('<a name="2.0.0"></a>\n# 2.0.0 (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Performance Improvements\n\n* **template:** tweak \n\n* **name:** rename this module to conventional-commits-writer \n\n\n\n');
          }

          i++;
          cb(null);
        }, function() {
          expect(i).to.equal(2);
          done();
        }));
    });

    it('`context.date` should be overwritten by `commit.authorDate`', function(done) {
      var i = 0;

      var upstream = through.obj();
      upstream.write({
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        type: 'feat',
        scope: 'scope',
        subject: 'broadcast $destroy event on scope destruction',
        body: null,
        footer: null,
        notes: [],
        references: []
      });
      upstream.write({
        header: 'fix(ng-list): Allow custom separator',
        type: 'fix',
        scope: 'ng-list',
        subject: 'Allow custom separator',
        body: 'bla bla bla',
        footer: null,
        notes: [],
        references: [],
        version: '1.0.1',
        authorDate: '2015-04-07 15:01:30 +1000'
      });
      upstream.write({
        header: 'perf(template): tweak',
        type: 'perf',
        scope: 'template',
        subject: 'tweak',
        body: 'My body.',
        footer: null,
        notes: [],
        references: []
      });
      upstream.write({
        header: 'refactor(name): rename this module to conventional-commits-writer',
        type: 'refactor',
        scope: 'name',
        subject: 'rename this module to conventional-commits-writer',
        body: null,
        footer: null,
        notes: [],
        references: [],
        version: '2.0.0',
        authorDate: '2015-02-07 15:01:30 +1000'
      });
      upstream.end();

      upstream
        .pipe(conventionalcommitsWriter({
          date: '2015-03-07'
        }))
        .pipe(through(function(chunk, enc, cb) {
          if (i === 0) {
            expect(chunk.toString()).to.equal('<a name="1.0.1"></a>\n## 1.0.1 (2015-04-07)\n\n\n### Bug Fixes\n\n* **ng-list:** Allow custom separator \n\n### Features\n\n* **scope:** broadcast $destroy event on scope destruction \n\n\n\n');
          } else {
            expect(chunk.toString()).to.equal('<a name="2.0.0"></a>\n# 2.0.0 (2015-02-07)\n\n\n### Performance Improvements\n\n* **template:** tweak \n\n* **name:** rename this module to conventional-commits-writer \n\n\n\n');
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
