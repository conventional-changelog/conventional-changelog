'use strict';
var conventionalcommitsWriter = require('../');
var dateFormat = require('dateformat');
var expect = require('chai').expect;
var through = require('through2');

describe('conventionalcommitsWriter', function() {
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
      header: 'feat(ng-list): Allow custom separator',
      type: 'feat',
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
    upstream.end();

    return upstream;
  }

  describe('link', function() {
    it('should link if host, repository, commit and issue are not truthy', function(done) {
      getStream()
        .pipe(conventionalcommitsWriter('0.0.1', {
          title: 'this is a title',
          host: 'https://github.com',
          repository: 'a/b'
        }))
        .pipe(through(function(chunk, enc, cb) {
          expect(chunk.toString()).to.equal('<a name="0.0.1"></a>\n## 0.0.1 "this is a title" (' + dateFormat(new Date(), 'yyyy-mm-dd', true) + ')\n\n\n### Features\n\n* **ng-list:** Allow custom separator ([13f3160][https://github.com/a/b/commits/13f3160])\n* **scope:** broadcast $destroy event on scope destruction ([9b1aff9][https://github.com/a/b/commits/9b1aff9]), closes [#1](https://github.com/a/b/issues/1) [#2](https://github.com/a/b/issues/2) [#3](https://github.com/a/b/issues/3)\n\n\n### BREAKING CHANGES\n\n* some breaking change\n\n\n\n');
          cb(null);
        }, function() {
          done();
        }));
    });
  });

  describe('version', function() {
    it('should not error with a valid version', function(done) {
      getStream()
        .pipe(conventionalcommitsWriter('0.0.1'))
        .on('error', function(err) {
          done(err);
        })
        .on('finish', function() {
          done();
        });
    });

    it('should error if no version specified', function() {
      expect(conventionalcommitsWriter).to.throw('Expected a version number');
    });

    it('should error if version is invalid', function() {
      expect(function() {
        conventionalcommitsWriter({
          version: 'fake version'
        });
      }).to.throw('Invalid Version');
    });
  });
});
