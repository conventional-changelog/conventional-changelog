'use strict';
var expect = require('chai').expect;
var parser = require('../lib/parser');

describe('parser', function() {
  var options;
  var regex;
  var msg;
  var simpleMsg;
  var longNoteMsg;
  var headerOnlyMsg;

  beforeEach(function() {
    regex = {
      hash: /\b[0-9a-f]{5,40}\b/,
      referenceParts: /(?:.*?)??\s*(\S*?)??(?:gh-|#)(\d+)/gi,
      notes: /(BREAKING AMEND)[:\s]*(.*)/,
      references: /(kill|kills|killed|handle|handles|handled)(?:\s+(.*?))(?=(?:kill|kills|killed|handle|handles|handled)|$)/gi
    };

    options = {
      headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject']
    };

    msg = parser(
      '9b1aff905b638aa274a5fc8f88662df446d374bd\n' +
      'feat(scope): broadcast $destroy event on scope destruction\n' +
      'perf testing shows that in chrome this change adds 5-15% overhead\n' +
      'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
      'BREAKING AMEND: some breaking change\n' +
      'Kills #1, #123\n' +
      'killed #25\n' +
      'handle #33, Closes #100, Handled #3 kills repo#77',
      options,
      regex
    );

    longNoteMsg = parser(
      '9b1aff905b638aa274a5fc8f88662df446d374bd\n' +
      'feat(scope): broadcast $destroy event on scope destruction\n' +
      'perf testing shows that in chrome this change adds 5-15% overhead\n' +
      'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
      'BREAKING AMEND:\n' +
      'some breaking change\n' +
      'some other breaking change\n' +
      'Kills #1, #123\n' +
      'killed #25\n' +
      'handle #33, Closes #100, Handled #3',
      options,
      regex
    );

    simpleMsg = parser(
      'chore: some chore\n',
      options,
      regex
    );

    headerOnlyMsg = parser('header', options, regex);
  });

  it('should throw if nothing to parse', function() {
    expect(function() {
      parser();
    }).to.throw('Expected a raw commit');
    expect(function() {
      parser('\n');
    }).to.throw('Expected a raw commit');
    expect(function() {
      parser(' ');
    }).to.throw('Expected a raw commit');
  });

  it('should parse hash', function() {
    expect(msg.hash).to.equal('9b1aff905b638aa274a5fc8f88662df446d374bd');
  });

  it('should trim extra newlines', function() {
    expect(msg).to.eql(parser(
      '\n\n\n\n9b1aff905b638aa274a5fc8f88662df446d374bd\n\n' +
      '\n\n\n\n\n\n\nfeat(scope): broadcast $destroy event on scope destruction\n\n\n' +
      '\n\n\nperf testing shows that in chrome this change adds 5-15% overhead\n' +
      '\n\n\nwhen destroying 10k nested scopes where each scope has a $destroy listener\n\n' +
      '\n\n\n\nBREAKING AMEND: some breaking change\n' +
      '\n\nKills #1, #123\n' +
      '\n\n\nkilled #25\n\n\n\n\n' +
      '\nhandle #33, Closes #100, Handled #3 kills repo#77\n',
      options,
      regex
    ));
  });

  describe('header', function() {
    it('should throw if it does not contain a header', function() {
      expect(function() {
        parser('9b1aff905b638aa274a5fc8f88662df446d374bd', options, regex);
      }).to.throw('"9b1aff905b638aa274a5fc8f88662df446d374bd" does not contain a header');
    });

    it('should throw if `options` is empty', function() {
      expect(function() {
        parser('bla bla');
      }).to.throw('Expected options');
    });

    it('type should be null if not found', function() {
      expect(headerOnlyMsg.type).to.equal(null);
    });

    it('scope should be null if not found', function() {
      expect(headerOnlyMsg.scope).to.equal(null);
    });

    it('subject should be null if not found', function() {
      expect(headerOnlyMsg.subject).to.equal(null);
    });

    it('should parse header', function() {
      expect(msg.header).to.equal('feat(scope): broadcast $destroy event on scope destruction');
    });

    it('should parse header without a hash', function() {
      expect(simpleMsg.hash).to.equal(null);
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

    it('should parse header without a scope', function() {
      expect(simpleMsg.header).to.equal('chore: some chore');
      expect(simpleMsg.type).to.equal('chore');
      expect(simpleMsg.scope).to.equal(null);
      expect(simpleMsg.subject).to.equal('some chore');
    });

    it('should allow ":" in scope', function() {
      var msg = parser('feat(ng:list): Allow custom separator', {
        headerPattern: /^(\w*)(?:\(([:\w\$\.\-\* ]*)\))?\: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject']
      }, regex);
      expect(msg.scope).to.equal('ng:list');
    });

    it('should allow type and subject to be null', function() {
      var msg = parser('(scope): ', {
        headerPattern: /^(\w*)?(?:\(([\w\$\.\-\* ]*)\))?\: (.*)?$/,
        headerCorrespondence: ['type', 'scope', 'subject']
      }, regex);

      expect(msg.type).to.equal(null);
      expect(msg.scope).to.equal('scope');
      expect(msg.subject).to.equal(null);
    });

    it('should allow correspondence to be changed', function() {
      var msg = parser('scope(my subject): fix this', {
        headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
        headerCorrespondence: ['scope', 'subject', 'type']
      }, regex);

      expect(msg.type).to.equal('fix this');
      expect(msg.scope).to.equal('scope');
      expect(msg.subject).to.equal('my subject');
    });

    it('should throw if headerCorrespondence contains illegal value', function() {
      expect(function() {
        parser('scope(my subject): fix this', {
          headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
          headerCorrespondence: ['scop', 'subject', 'type']
        }, regex);
      }).to.throw('Expected options.headerCorrespondence to only contain "type" "scope" or "subject"');
    });

    it('should reference an issue', function() {
      var msg = parser('handled #1', options, regex);
      expect(msg.references).to.eql([{
        action: 'handled',
        issue: '1',
        raw: '#1',
        repository: null
      }]);
    });
  });

  describe('body', function() {
    it('should parse body', function() {
      expect(msg.body).to.equal(
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener');
    });

    it('should be null if not found', function() {
      expect(headerOnlyMsg.body).to.equal(null);
    });
  });

  describe('footer', function() {
    it('should be null if not found', function() {
      expect(headerOnlyMsg.footer).to.equal(null);
    });

    it('should parse footer', function() {
      expect(msg.footer).to.equal(
        'BREAKING AMEND: some breaking change\n' +
        'Kills #1, #123\n' +
        'killed #25\n' +
        'handle #33, Closes #100, Handled #3 kills repo#77'
      );
    });

    it('important notes should be an empty string if not found', function() {
      expect(simpleMsg.notes).to.eql([]);
    });

    it('should parse important notes', function() {
      expect(msg.notes[0]).to.eql({
        title: 'BREAKING AMEND',
        text: 'some breaking change'
      });
    });

    it('should parse important notes with more than one paragraphs', function() {
      expect(longNoteMsg.notes[0]).to.eql({
        title: 'BREAKING AMEND',
        text: 'some breaking change\nsome other breaking change'
      });
    });

    it('references should be an empty string if not found', function() {
      expect(simpleMsg.references).to.eql([]);
    });

    it('should parse references', function() {
      expect(msg.references).to.eql([{
        action: 'Kills',
        issue: '1',
        raw: '#1',
        repository: null
      }, {
        action: 'Kills',
        issue: '123',
        raw: ', #123',
        repository: null
      }, {
        action: 'killed',
        issue: '25',
        raw: '#25',
        repository: null
      }, {
        action: 'handle',
        issue: '33',
        raw: '#33',
        repository: null
      }, {
        action: 'handle',
        issue: '100',
        raw: ', Closes #100',
        repository: null
      }, {
        action: 'Handled',
        issue: '3',
        raw: '#3',
        repository: null
      }, {
        action: 'kills',
        issue: '77',
        raw: 'repo#77',
        repository: 'repo'
      }]);
    });

    it('should put everything after references in footer', function() {
      var msg = parser(
        '9b1aff905b638aa274a5fc8f88662df446d374bd\n' +
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'Kills #1, #123\n' +
        'what\n' +
        'killed #25\n' +
        'handle #33, Closes #100, Handled #3\n' +
        'other',
        options,
        regex
      );

      expect(msg.footer).to.equal('Kills #1, #123\nwhat\nkilled #25\nhandle #33, Closes #100, Handled #3\nother');
    });

    it('shoudl parse properly if important notes comes after references', function() {
      var msg = parser(
        '9b1aff905b638aa274a5fc8f88662df446d374bd\n' +
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'Kills #1, #123\n' +
        'BREAKING AMEND: some breaking change\n',
        options,
        regex
      );
      expect(msg.notes[0]).to.eql({
        title: 'BREAKING AMEND',
        text: 'some breaking change'
      });
      expect(msg.references).to.eql([{
        action: 'Kills',
        issue: '1',
        raw: '#1',
        repository: null
      }, {
        action: 'Kills',
        issue: '123',
        raw: ', #123',
        repository: null
      }]);
      expect(msg.footer).to.equal('Kills #1, #123\nBREAKING AMEND: some breaking change');
    });

    it('shoudl parse properly if important notes comes with more than one paragraphs after references', function() {
      var msg = parser(
        '9b1aff905b638aa274a5fc8f88662df446d374bd\n' +
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'Kills #1, #123\n' +
        'BREAKING AMEND: some breaking change\nsome other breaking change',
        options,
        regex
      );
      expect(msg.notes[0]).to.eql({
        title: 'BREAKING AMEND',
        text: 'some breaking change\nsome other breaking change'
      });
      expect(msg.references).to.eql([{
        action: 'Kills',
        issue: '1',
        raw: '#1',
        repository: null
      }, {
        action: 'Kills',
        issue: '123',
        raw: ', #123',
        repository: null
      }]);
      expect(msg.footer).to.equal('Kills #1, #123\nBREAKING AMEND: some breaking change\nsome other breaking change');
    });

    it('shoudl parse properly if important notes comes after references with something after references', function() {
      var msg = parser(
        '9b1aff905b638aa274a5fc8f88662df446d374bd\n' +
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'Kills #1, #123\n' +
        'other\n' +
        'BREAKING AMEND: some breaking change\n',
        options,
        regex
      );
      expect(msg.notes[0]).to.eql({
        title: 'BREAKING AMEND',
        text: 'some breaking change'
      });
      expect(msg.references).to.eql([{
        action: 'Kills',
        issue: '1',
        raw: '#1',
        repository: null
      }, {
        action: 'Kills',
        issue: '123',
        raw: ', #123',
        repository: null
      }]);
      expect(msg.footer).to.equal('Kills #1, #123\nother\nBREAKING AMEND: some breaking change');
    });
  });
});
