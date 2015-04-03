'use strict';
var expect = require('chai').expect;
var dateFormat = require('dateformat');
var es = require('event-stream');
var Writer = require('../lib/Writer');

describe('Writer', function() {
  var log = '';

  function concat(str) {
    log += str;
  }

  function lines() {
    return log.split('\n').filter(function(line) {
      return line.length;
    });
  }

  function setup(mode) {
    log = '';
    var stream = es.through(concat, concat.bind(null, 'END'));

    if (mode === 'repo') {
      return new Writer(stream, {
        repository: 'github.com/user/repo'
      });
    } else if (mode === 'package.json') {
      return new Writer(stream, {});
    } else if (mode === 'pkg') {
      return new Writer(stream, {
        pkg: 'test/fixtures/_package.json'
      });
    } else if (mode === 'version') {
      return new Writer(stream, {
        version: '1.1.1'
      });
    } else if (mode === 'pkgNotFound') {
      return new Writer(stream, {
        pkg: 'no_such_package.json'
      });
    }

    return new Writer(stream, {
      subtitle: 'subby',
      issueLink: function(id) {
        return id;
      },
      commitLink: function(hash) {
        return hash;
      }
    });
  }

  describe('#header', function() {
    it('should contain version', function() {
      var writer = setup('version');
      writer.header();
      expect(log).to.contain('1.1.1');
    });
    it('should contain subtitle', function() {
      var writer = setup();
      writer.header();
      expect(log).to.contain('subby');
    });
    it('should contain current date', function() {
      var now = new Date();
      var currentDate = dateFormat(now, 'yyyy-mm-dd');
      var writer = setup();
      writer.header('1.0.3');
      expect(log).to.contain(currentDate);
    });
  });

  describe('#section', function() {
    var section = {
      foo: [{
        subject: 'added foo-ability',
        hash: '0',
        closes: ['1']
      }, {
        subject: 'made room for bam',
        hash: '2',
        closes: []
      }, ],
      bam: [{
        subject: 'removed bar and baz',
        hash: '3',
        closes: []
      }]
    };

    it('should do nothing if no components in section', function() {
      var writer = setup();

      writer.section('title', {});
      expect(log.length).to.equal(0);
    });
    it('should make a log out of components', function() {
      var writer = setup();

      writer.section('Additions', section);
      expect(lines()[0]).to.equal('#### Additions');
      expect(lines()[1]).to.equal('* **bam:** removed bar and baz (3)');
      expect(lines()[2]).to.equal('* **foo:**');
      expect(lines()[3]).to.equal('  * added foo-ability (0, closes 1)');
      expect(lines()[4]).to.equal('  * made room for bam (2)');
    });
    it('should use `options.repository` for hash and closes', function() {
      var writer = setup('repo');

      writer.section('Additions', section);
      expect(lines()[3]).to.equal('  * added foo-ability ([0](github.com/user/repo/commit/0), closes [#1](github.com/user/repo/issues/1))');
    });
    it('should find `repository` in package.json automatically', function() {
      var writer = setup('package.json');

      writer.section('Additions', section);
      expect(lines()[3]).to.equal('  * added foo-ability ([0](https://github.com/ajoslin/conventional-changelog/commit/0), closes [#1](https://github.com/ajoslin/conventional-changelog/issues/1))');
    });
    it('should find package.json and parse non github url correctly', function() {
      var writer = setup('pkg');

      writer.section('Additions', section);
      expect(lines()[3]).to.equal('  * added foo-ability ([0](http://www.bitbucket.com/user/repo/commit/0), closes [#1](http://www.bitbucket.com/user/repo/issues/1))');
    });
    it('should handle it properly if package.json cannot be found', function() {
      var writer = setup('pkgNotFound');

      writer.section('Additions', section);
      expect(lines()[3]).to.equal('  * added foo-ability (0, closes #1)');
    });
  });

  describe('#end', function() {
    it('should equal "END"', function() {
      var writer = setup();
      writer.end();
      expect(log).to.equal('END');
    });
  });
});
