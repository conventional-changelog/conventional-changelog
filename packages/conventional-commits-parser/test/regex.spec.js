'use strict';
var expect = require('chai').expect;
var regex = require('../lib/regex');

describe('regex', function() {
  describe('notes', function() {
    it('should match a simple note', function() {
      var reNotes = regex({
        noteKeywords: ['Breaking News', 'Breaking Change']
      }).notes;
      var match = 'Breaking News: This is so important.'.match(reNotes);
      expect(match[0]).to.equal('Breaking News: This is so important.');
      expect(match[1]).to.equal('Breaking News');
      expect(match[2]).to.equal('This is so important.');
    });

    it('should be case insensitive', function() {
      var reNotes = regex({
        noteKeywords: ['Breaking News', 'Breaking Change']
      }).notes;
      var match = 'BREAKING NEWS: This is so important.'.match(reNotes);
      expect(match[0]).to.equal('BREAKING NEWS: This is so important.');
      expect(match[1]).to.equal('BREAKING NEWS');
      expect(match[2]).to.equal('This is so important.');
    });

    it('should ignore whitespace', function() {
      var reNotes = regex({
        noteKeywords: [' Breaking News', 'Breaking Change ', '', ' Breaking SOLUTION ', '  '],
        issuePrefixes: ['#']
      }).notes;
      var match = 'Breaking News: This is so important.'.match(reNotes);
      expect(match[0]).to.equal('Breaking News: This is so important.');
      expect(match[1]).to.equal('Breaking News');
      expect(match[2]).to.equal('This is so important.');
    });

    it('should not accidentally match in a sentence', function() {
      var reNotes = regex({
        noteKeywords: [' Breaking News'],
        issuePrefixes: ['#']
      }).notes;
      var match = 'This is a breaking news: So important.'.match(reNotes);
      expect(match).to.equal(null);
    });
  });

  describe('references', function() {
    it('should match a simple reference', function() {
      var reReferences = regex({
        referenceActions: ['Closes']
      }).references;
      var match = reReferences.exec('closes #1');
      expect(match[0]).to.equal('closes #1');
      expect(match[1]).to.equal('closes');
      expect(match[2]).to.equal('#1');
    });

    it('should be case insensitive', function() {
      var reReferences = regex({
        referenceActions: ['Closes']
      }).references;
      var match = reReferences.exec('ClOsEs #1');
      expect(match[0]).to.equal('ClOsEs #1');
      expect(match[1]).to.equal('ClOsEs');
      expect(match[2]).to.equal('#1');
    });

    it('should not match if keywords does not present', function() {
      var reReferences = regex({
        referenceActions: ['Close']
      }).references;
      var match = reReferences.exec('Closes #1');
      expect(match).to.equal(null);
    });

    it('should take multiple reference keywords', function() {
      var reReferences = regex({
        referenceActions: [' Closes', 'amends', 'fixes']
      }).references;
      var match = reReferences.exec('amends #1');
      expect(match[0]).to.eql('amends #1');
      expect(match[1]).to.eql('amends');
      expect(match[2]).to.equal('#1');
    });

    it('should match multiple references', function() {
      var reReferences = regex({
        referenceActions: ['Closes', 'amends']
      }).references;
      var string = 'Closes #1 amends #2; closes bug #4';
      var match = reReferences.exec(string);
      expect(match[0]).to.equal('Closes #1 ');
      expect(match[1]).to.equal('Closes');
      expect(match[2]).to.equal('#1 ');

      match = reReferences.exec(string);
      expect(match[0]).to.equal('amends #2; ');
      expect(match[1]).to.equal('amends');
      expect(match[2]).to.equal('#2; ');

      match = reReferences.exec(string);
      expect(match[0]).to.equal('closes bug #4');
      expect(match[1]).to.equal('closes');
      expect(match[2]).to.equal('bug #4');
    });

    it('should match references with mixed content, like JIRA tickets', function() {
      var reReferences = regex({
        referenceActions: ['Closes', 'amends']
      }).references;
      var string = 'Closes #JIRA-123 amends #MY-OTHER-PROJECT-123; closes bug #4';
      var match = reReferences.exec(string);
      expect(match[0]).to.equal('Closes #JIRA-123 ');
      expect(match[1]).to.equal('Closes');
      expect(match[2]).to.equal('#JIRA-123 ');

      match = reReferences.exec(string);
      expect(match[0]).to.equal('amends #MY-OTHER-PROJECT-123; ');
      expect(match[1]).to.equal('amends');
      expect(match[2]).to.equal('#MY-OTHER-PROJECT-123; ');

      match = reReferences.exec(string);
      expect(match[0]).to.equal('closes bug #4');
      expect(match[1]).to.equal('closes');
      expect(match[2]).to.equal('bug #4');
    });

    it('should reference an issue without an action', function() {
      var string = 'gh-1, prefix-3, Closes gh-6';
      var reReferences = regex().references;

      var match = reReferences.exec(string);
      expect(match[0]).to.equal('gh-1, prefix-3, Closes gh-6');
      expect(match[1]).to.equal('');
      expect(match[2]).to.equal('gh-1, prefix-3, Closes gh-6');
    });

    it('should ignore whitespace', function() {
      var reReferences = regex({
        referenceActions: [' Closes', 'amends ', '', ' fixes ', '   ']
      }).references;
      var match = 'closes #1, amends #2, fixes #3'.match(reReferences);
      expect(match).to.eql(['closes #1, ', 'amends #2, ', 'fixes #3']);
    });
  });

  describe('referenceParts', function() {
    var reReferenceParts = regex({
      issuePrefixes: ['#']
    }).referenceParts;

    afterEach(function() {
      reReferenceParts.lastIndex = 0;
    });

    it('should match simple reference parts', function() {
      var match = reReferenceParts.exec('#1');
      expect(match[0]).to.equal('#1');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('#');
      expect(match[3]).to.equal('1');
    });

    it('should reference an issue in parenthesis', function() {
      var string = '#27), pinned shelljs to version that works with nyc (#30)';
      var match = reReferenceParts.exec(string);
      expect(match[0]).to.equal('#27');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('#');
      expect(match[3]).to.equal('27');

      match = reReferenceParts.exec(string);
      expect(match[0]).to.equal('), pinned shelljs to version that works with nyc (#30');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('#');
      expect(match[3]).to.equal('30');
    });

    it('should match reference parts with something else', function() {
      var match = reReferenceParts.exec('something else #1');
      expect(match[0]).to.equal('something else #1');
      expect(match[1]).to.equal(undefined);
      expect(match[3]).to.equal('1');
    });

    it('should match reference parts with a repository', function() {
      var match = reReferenceParts.exec('repo#1');
      expect(match[0]).to.equal('repo#1');
      expect(match[1]).to.equal('repo');
      expect(match[3]).to.equal('1');
    });

    it('should match JIRA-123 like reference parts', function() {
      var match = reReferenceParts.exec('#JIRA-123');
      expect(match[0]).to.equal('#JIRA-123');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('#');
      expect(match[3]).to.equal('JIRA-123');
    });

    it('should not match MY-€#%#&-123 mixed symbol reference parts', function() {
      var match = reReferenceParts.exec('#MY-€#%#&-123');
      expect(match).to.equal(null);
    });

    it('should match reference parts with multiple references', function() {
      var string = '#1 #2, something #3; repo#4';
      var match = reReferenceParts.exec(string);
      expect(match[0]).to.equal('#1');
      expect(match[1]).to.equal(undefined);
      expect(match[3]).to.equal('1');

      match = reReferenceParts.exec(string);
      expect(match[0]).to.equal(' #2');
      expect(match[1]).to.equal(undefined);
      expect(match[3]).to.equal('2');

      match = reReferenceParts.exec(string);
      expect(match[0]).to.equal(', something #3');
      expect(match[1]).to.equal(undefined);
      expect(match[3]).to.equal('3');

      match = reReferenceParts.exec(string);
      expect(match[0]).to.equal('; repo#4');
      expect(match[1]).to.equal('repo');
      expect(match[3]).to.equal('4');
    });

    it('should match issues with customized prefix', function() {
      var string = 'closes gh-1, amends #2, fixes prefix-3';
      reReferenceParts = regex({
        issuePrefixes: ['gh-', 'prefix-']
      }).referenceParts;

      var match = reReferenceParts.exec(string);
      expect(match[0]).to.equal('closes gh-1');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('gh-');
      expect(match[3]).to.equal('1');

      match = reReferenceParts.exec(string);
      expect(match[0]).to.equal(', amends #2, fixes prefix-3');
      expect(match[1]).to.equal(undefined);
      expect(match[2]).to.equal('prefix-');
      expect(match[3]).to.equal('3');
    });

    it('should match nothing if there is no customized prefix', function() {
      var string = 'closes gh-1, amends #2, fixes prefix-3';
      reReferenceParts = regex().referenceParts;

      var match = reReferenceParts.exec(string);
      expect(match).to.equal(null);
    });
  });

  describe('mentions', function() {
    it('should match basically mention', function() {
      var string = 'Thanks!! @someone';
      var mentions = regex().mentions;

      var match = mentions.exec(string);
      expect(match[0]).to.equal('@someone');
      expect(match[1]).to.equal('someone');
    });

    it('should match mention with hyphen', function() {
      var string = 'Thanks!! @some-one';
      var mentions = regex().mentions;

      var match = mentions.exec(string);
      expect(match[0]).to.equal('@some-one');
      expect(match[1]).to.equal('some-one');
    });

    it('should match mention with underscore', function() {
      var string = 'Thanks!! @some_one';
      var mentions = regex().mentions;

      var match = mentions.exec(string);
      expect(match[0]).to.equal('@some_one');
      expect(match[1]).to.equal('some_one');
    });

    it('should match mention with parentheses', function() {
      var string = 'Fix feature1 (by @someone)';
      var mentions = regex().mentions;

      var match = mentions.exec(string);
      expect(match[0]).to.equal('@someone');
      expect(match[1]).to.equal('someone');
    });

    it('should match mention with brackets', function() {
      var string = 'Fix feature1 [by @someone]';
      var mentions = regex().mentions;

      var match = mentions.exec(string);
      expect(match[0]).to.equal('@someone');
      expect(match[1]).to.equal('someone');
    });

    it('should match mention with braces', function() {
      var string = 'Fix feature1 {by @someone}';
      var mentions = regex().mentions;

      var match = mentions.exec(string);
      expect(match[0]).to.equal('@someone');
      expect(match[1]).to.equal('someone');
    });

    it('should match mention with angle brackets', function() {
      var string = 'Fix feature1 by <@someone>';
      var mentions = regex().mentions;

      var match = mentions.exec(string);
      expect(match[0]).to.equal('@someone');
      expect(match[1]).to.equal('someone');
    });
  });
});
