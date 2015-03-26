'use strict';
var expect = require('chai').expect;
var parser = require('../lib/parser');

describe('parser', function() {
  var options;
  var msg;
  var simpleMsg;
  var longNoteMsg;

  beforeEach(function() {
    options = {
      maxSubjectLength: 80,
      headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
      referenceKeywords: [
        'kill',
        'kills',
        'killed',
        'handle',
        'handles',
        'handled'
      ],
      noteKeywords: [
        'BREAKING AMEND'
      ]
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
      options
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
      options
    );

    simpleMsg = parser(
      'chore: some chore\n',
      options
    );
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
      options
    ));
  });

  describe('header', function() {
    it('should throw if header cannot be parsed', function() {
      expect(function() {
        parser('bla bla', options);
      }).to.throw('Cannot parse commit type: "bla bla"');
    });

    it('should throw if `options` is empty', function() {
      expect(function() {
        parser('bla bla');
      }).to.throw('Expected options');
    });

    it('should throw if subject cannot be found', function() {
      expect(function() {
        parser('fix: ', options);
      }).to.throw('Cannot parse commit subject: "fix: "');
    });

    it('should throw if there is no header', function() {
      expect(function() {
        parser('056f5827de86cace1f282c8e3f1cccc952fcad2e', options);
      }).to.throw('Cannot parse commit header: "056f5827de86cace1f282c8e3f1cccc952fcad2e"');
    });

    it('should throw if header cannot be found', function() {
      expect(function() {
        parser('056f5827de86cace1f282c8e3f1cccc952fcad2e', options);
      }).to.throw('Cannot parse commit header: "056f5827de86cace1f282c8e3f1cccc952fcad2e"');
    });

    it('should parse header', function() {
      expect(msg.header).to.equal('feat(scope): broadcast $destroy event on scope destruction');
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
        headerPattern: /^(\w*)(?:\(([:\w\$\.\-\* ]*)\))?\: (.*)$/
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
        'handle #33, Closes #100, Handled #3 kills repo#77'
      );
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

    it('should parse referenced issues', function() {
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

    it('should put everything between or after referenced issues input footer', function() {
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
        options
      );

      expect(msg.footer).to.equal('Kills #1, #123\nwhat\nkilled #25\nhandle #33, Closes #100, Handled #3\nother');
    });
  });
});
