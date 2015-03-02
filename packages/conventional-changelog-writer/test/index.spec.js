'use strict';
var conventionalCommitsTemplate = require('../');
var dateFormat = require('dateformat');
var expect = require('chai').expect;
var through = require('through2');

describe('conventionalCommitsTemplate', function() {
  function getStream() {
    var upstream = through.obj();
    upstream.write({
      hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
      header: 'feat(scope): broadcast $destroy event on scope destruction',
      body: 'BREAKING NEWS: breaking news',
      footer: 'Closes #1',
      notes: {
        'BREAKING NEWS': 'breaking news'
      },
      closes: [1, 2, 3],
      type: 'feat',
      scope: 'scope',
      subject: 'broadcast $destroy event on scope destruction'
    });
    upstream.write({
      hash: '13f31602f396bc269076ab4d389cfd8ca94b20ba',
      header: 'feat(ng-list): Allow custom separator',
      body: 'bla bla bla',
      footer: 'BREAKING CHANGE: some breaking change',
      notes: {
        'BREAKING CHANGE': 'some breaking change'
      },
      closes: [],
      type: 'feat',
      scope: 'ng-list',
      subject: 'Allow custom separator'
    });
    upstream.end();

    return upstream;
  }

  describe('link', function() {
    it('should link if host, repository, commit and issue are not truthy', function(done) {
      var upstream = getStream();

      upstream
        .pipe(conventionalCommitsTemplate('0.0.1', {
          title: 'this is a title',
          host: 'https://github.com',
          repository: 'a/b'
        }))
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.equal('<a name=0.0.1></a>\n### 0.0.1 "this is a title" (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Features\n\n* **ng-list:** Allow custom separator ([13f3160][https://github.com/a/b/commits/13f3160])\n* **scope:** broadcast $destroy event on scope destruction ([9b1aff9][https://github.com/a/b/commits/9b1aff9]), closes [#1](https://github.com/a/b/issues/1) [#2](https://github.com/a/b/issues/2) [#3](https://github.com/a/b/issues/3)\n\n\n### BREAKING CHANGES\n* some breaking change\n\n');
          cb(null);
        }, function() {
          done();
        }));
    });
  });

  describe('version', function() {
    it('should not error with a valid version', function(done) {
      var upstream = getStream();

      upstream
        .pipe(conventionalCommitsTemplate('0.0.1'))
        .on('error', function(err) {
          done(err);
        })
        .on('finish', function() {
          done();
        });
    });

    it('should error if no version specified', function(done) {
      var upstream = getStream();

      upstream
        .pipe(conventionalCommitsTemplate())
        .on('error', function(err) {
          expect(err).to.equal('No version specified');
          done();
        });
    });

    it('should error if version is invalid', function(done) {
      var upstream = getStream();

      upstream
        .pipe(conventionalCommitsTemplate({
          version: 'fake version'
        }))
        .on('error', function(err) {
          expect(err.toString()).to.contain('TypeError: Invalid Version:');
          done();
        });
    });
  });
});
