'use strict';
var expect = require('chai').expect;
var parser = require('../lib/parser');

describe('parseRawCommit', function() {
  var options = {
    maxSubjectLength: 80,
    headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
    closeKeywords: [
      'kill',
      'kills',
      'killed',
      'handle',
      'handles',
      'handled'
    ],
    breakKeywords: [
      'BREAKING AMEND'
    ]
  };

  var msg = parser(
    '9b1aff905b638aa274a5fc8f88662df446d374bd\n' +
    'feat(scope): broadcast $destroy event on scope destruction\n' +
    'perf testing shows that in chrome this change adds 5-15% overhead\n' +
    'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
    'BREAKING AMEND: some breaking change\n' +
    'Kills #1, #123\n' +
    'killed #25\n' +
    'handle #33, Closes #100, Handled #3',
    options
  );

  var simpleMsg = parser(
    'chore: some chore\n',
    options
  );

  it('should returns null if nothing to parse', function() {
    expect(parser()).to.equal(null);
    expect(parser('\n')).to.equal(null);
    expect(parser(' ')).to.equal(null);
  });

  it('should parse hash', function() {
    expect(msg.hash).to.equal('9b1aff905b638aa274a5fc8f88662df446d374bd');
  });

  describe('header', function() {
    it('should returns null if header cannot be parsed', function() {
      expect(parser('bla bla', options)).to.equal(null);
    });

    it('should returns null if there is no header', function() {
      expect(parser('056f5827de86cace1f282c8e3f1cccc952fcad2e', options)).to.equal(null);
    });

    it('should parse header', function() {
      expect(msg.header).to.equal('feat(scope): broadcast $destroy event on scope destruction');
    });

    it('should parse header after trimed', function() {
      expect(parser('\n\n\n\n\nchore: some chore\n\n\n\n', options).header).to.equal('chore: some chore');
    });

    it('should parse header without a hash', function() {
      expect(simpleMsg.header).to.equal('chore: some chore');
    });

    it('should parse type', function() {
      expect(msg.type).to.equal('feat');
    });

    it('should parse scope', function() {
      expect(msg.scope).to.equal('scope');
    });

    it('should parse subject', function() {
      expect(msg.subject).to.equal('broadcast $destroy event on scope destruction');
    });

    it('should trim if subject is too long', function() {
      var msg = parser('feat(ng-list): Allow custom separator', {
        maxSubjectLength: 10,
        headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/
      });
      expect(msg.subject).to.equal('Allow cust');
    });

    it('should parse header without a scope', function() {
      expect(simpleMsg.header).to.equal('chore: some chore');
      expect(simpleMsg.type).to.equal('chore');
      expect(simpleMsg.scope).to.equal(undefined);
      expect(simpleMsg.subject).to.equal('some chore');
    });

    it('should allow ":" in scope', function() {
      var msg = parser('feat(ng:list): Allow custom separator', {
        headerPattern: /^(\w*)(?:\(([:\w\$\.\-\* ]*)\))?\: (.*)$/,
      });
      expect(msg.scope).to.equal('ng:list');
    });
  });

  describe('body', function() {
    it('should parse body', function() {
      expect(msg.body).to.equal(
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener');
    });
  });

  describe('footer', function() {
    it('should parse footer', function() {
      expect(msg.footer).to.equal(
        'BREAKING AMEND: some breaking change\n' +
        'Kills #1, #123\n' +
        'killed #25\n' +
        'handle #33, Closes #100, Handled #3'
      );
    });

    it('should parse breaking change', function() {
      expect(msg.breaks['BREAKING AMEND']).to.deep.equal('some breaking change');
    });

    it('should parse closed issues', function() {
      expect(msg.closes).to.eql([1, 123, 25, 33, 3]);
    });
  });
});
