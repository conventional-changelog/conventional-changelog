'use strict';
var crypto = require('crypto');
var expect = require('chai').expect;
var regex = require('../lib/regex');

describe('regex', function() {
  describe('getNotesRegex', function() {
    it('should match a simple note', function() {
      var re = regex.getNotesRegex(['Breaking News', 'Breaking Change']);
      var match = 'Breaking News: This is so important.'.match(re);
      expect(match[0]).to.equal('Breaking News: This is so important.');
      expect(match[1]).to.equal('Breaking News');
      expect(match[2]).to.equal('This is so important.');
    });

    it('should ignore whitespace', function() {
      var re = regex.getNotesRegex([' Breaking News', 'Breaking Change ', '', ' Breaking SOLUTION ', '  ']);
      var match = 'Breaking News: This is so important.'.match(re);
      expect(match[0]).to.equal('Breaking News: This is so important.');
      expect(match[1]).to.equal('Breaking News');
      expect(match[2]).to.equal('This is so important.');
    });
  });

  describe('getReferencesRegex', function() {
    it('should match a simple reference', function() {
      var re = regex.getReferencesRegex(['Closes']);
      var match = re.exec('closes #1');
      expect(match[0]).to.equal('closes #1');
      expect(match[1]).to.equal('closes');
    });

    it('should ignore cases', function() {
      var re = regex.getReferencesRegex(['Closes']);
      var match = re.exec('ClOsEs #1');
      expect(match[0]).to.equal('ClOsEs #1');
      expect(match[1]).to.equal('ClOsEs');
    });

    it('should not match if keywords does not present', function() {
      var re = regex.getReferencesRegex(['Close']);
      var match = re.exec('Closes #1');
      expect(match).to.equal(null);
    });

    it('should take multiple reference keywords', function() {
      var re = regex.getReferencesRegex([' Closes', 'amends', 'fixes']);
      var match = re.exec('amends #1');
      expect(match[0]).to.eql('amends #1');
      expect(match[1]).to.eql('amends');
    });

    it('should match multiple references', function() {
      var re = regex.getReferencesRegex(['Closes', 'amends']);
      var string = 'Closes #1 amends #2; closes bug #4';
      var match = re.exec(string);
      expect(match[0]).to.equal('Closes #1 ');
      expect(match[1]).to.equal('Closes');

      match = re.exec(string);
      expect(match[0]).to.equal('amends #2; ');
      expect(match[1]).to.equal('amends');

      match = re.exec(string);
      expect(match[0]).to.equal('closes bug #4');
      expect(match[1]).to.equal('closes');
    });

    it('should ignore whitespace', function() {
      var re = regex.getReferencesRegex([' Closes', 'amends ', '', ' fixes ', '   ']);
      var match = 'closes #1, amends #2, fixes #3'.match(re);
      expect(match).to.eql(['closes #1, ', 'amends #2, ', 'fixes #3']);
    });
  });

  describe('reHash', function() {
    it('should match a hash', function() {
      var hash = crypto.createHash('md5').update(Math.random().toString()).digest('hex');
      expect(hash).match(regex.reHash).to.eql(hash);
    });
  });

  describe('reReferenceParts', function() {
    var reReferenceParts = regex.reReferenceParts;

    afterEach(function() {
      reReferenceParts.lastIndex = 0;
    });

    it('should match simple reference parts', function() {
      var match = reReferenceParts.exec('#1');
      expect(match[0]).to.equal('#1');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('1');
    });

    it('should match reference parts with something else', function() {
      var match = reReferenceParts.exec('something else #1');
      expect(match[0]).to.equal('something else #1');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('1');
    });

    it('should match reference parts with a repository', function() {
      var match = reReferenceParts.exec('repo#1');
      expect(match[0]).to.equal('repo#1');
      expect(match[1]).to.equal('repo');
      expect(match[2]).to.equal('1');
    });

    it('should match reference parts with multiple references', function() {
      var string = '#1 #2, something #3; repo#4';
      var match = reReferenceParts.exec(string);
      expect(match[0]).to.equal('#1');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('1');

      match = reReferenceParts.exec(string);
      expect(match[0]).to.equal(' #2');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('2');

      match = reReferenceParts.exec(string);
      expect(match[0]).to.equal(', something #3');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('3');

      match = reReferenceParts.exec(string);
      expect(match[0]).to.equal('; repo#4');
      expect(match[1]).to.equal('repo');
      expect(match[2]).to.equal('4');
    });
  });
});
