'use strict';
var expect = require('chai').expect;
var parser = require('../lib/parser');
var regex = require('../lib/regex');

describe('parser', function() {
  var options;
  var reg;
  var msg;
  var simpleMsg;
  var longNoteMsg;
  var headerOnlyMsg;

  beforeEach(function() {
    options = {
      revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (.*)\.$/,
      revertCorrespondence: ['header', 'hash'],
      fieldPattern: /^-(.*?)-$/,
      headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      noteKeywords: ['BREAKING AMEND'],
      issuePrefixes: ['#', 'gh-'],
      referenceActions: [
        'kill',
        'kills',
        'killed',
        'handle',
        'handles',
        'handled'
      ]
    };

    reg = regex(options);

    msg = parser(
      'feat(scope): broadcast $destroy event on scope destruction\n' +
      'perf testing shows that in chrome this change adds 5-15% overhead\n' +
      'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
      'BREAKING AMEND: some breaking change\n' +
      'Kills #1, #123\n' +
      'killed #25\n' +
      'handle #33, Closes #100, Handled #3 kills repo#77\n' +
      'kills stevemao/conventional-commits-parser#1',
      options,
      reg
    );

    longNoteMsg = parser(
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
      reg
    );

    simpleMsg = parser(
      'chore: some chore\n',
      options,
      reg
    );

    headerOnlyMsg = parser('header', options, reg);
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

  it('should throw if `options` is empty', function() {
    expect(function() {
      parser('bla bla');
    }).to.throw('Expected options');
  });

  it('should throw if `regex` is empty', function() {
    expect(function() {
      parser('bla bla', {
        headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/
      });
    }).to.throw('Expected regex');
  });

  it('should trim extra newlines', function() {
    expect(parser(
      '\n\n\n\n\n\n\nfeat(scope): broadcast $destroy event on scope destruction\n\n\n' +
      '\n\n\nperf testing shows that in chrome this change adds 5-15% overhead\n' +
      '\n\n\nwhen destroying 10k nested scopes where each scope has a $destroy listener\n\n' +
      '\n\n\n\nBREAKING AMEND: some breaking change\n' +
      '\n\n\n\nBREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```' +
      '\n\nKills #1\n' +
      '\n\n\nkilled #25\n\n\n\n\n',
      options,
      reg
    )).to.eql({
      merge: null,
      header: 'feat(scope): broadcast $destroy event on scope destruction',
      body: 'perf testing shows that in chrome this change adds 5-15% overhead\n\n\n\nwhen destroying 10k nested scopes where each scope has a $destroy listener',
      footer: 'BREAKING AMEND: some breaking change\n\n\n\n\nBREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```\n\nKills #1\n\n\n\nkilled #25',
      notes: [{
        title: 'BREAKING AMEND',
        text: 'some breaking change'
      }, {
        title: 'BREAKING AMEND',
        text: 'An awesome breaking change\n\n\n```\ncode here\n```'
      }],
      references: [{
        action: 'Kills',
        owner: null,
        repository: null,
        issue: '1',
        raw: '#1',
        prefix: '#'
      }, {
        action: 'killed',
        owner: null,
        repository: null,
        issue: '25',
        raw: '#25',
        prefix: '#'
      }],
      mentions: [],
      revert: null,
      scope: 'scope',
      subject: 'broadcast $destroy event on scope destruction',
      type: 'feat'
    });
  });

  it('should keep spaces', function() {
    expect(parser(
      ' feat(scope): broadcast $destroy event on scope destruction \n' +
      ' perf testing shows that in chrome this change adds 5-15% overhead \n\n' +
      ' when destroying 10k nested scopes where each scope has a $destroy listener \n' +
      '         BREAKING AMEND: some breaking change         \n\n' +
      '   BREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```' +
      '\n\n    Kills   #1\n',
      options,
      reg
    )).to.eql({
      merge: null,
      header: ' feat(scope): broadcast $destroy event on scope destruction ',
      body: ' perf testing shows that in chrome this change adds 5-15% overhead \n\n when destroying 10k nested scopes where each scope has a $destroy listener ',
      footer: '         BREAKING AMEND: some breaking change         \n\n   BREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```\n\n    Kills   #1',
      notes: [{
        title: 'BREAKING AMEND',
        text: 'some breaking change         '
      }, {
        title: 'BREAKING AMEND',
        text: 'An awesome breaking change\n\n\n```\ncode here\n```'
      }],
      references: [{
        action: 'Kills',
        owner: null,
        repository: null,
        issue: '1',
        raw: '#1',
        prefix: '#'
      }],
      mentions: [],
      revert: null,
      scope: null,
      subject: null,
      type: null
    });
  });

  describe('mentions', function() {
    it('should mention someone in the commit', function() {
      var options = {
        headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
        mergePattern: /^Merge pull request #(\d+) from (.*)$/,
        mergeCorrespondence: ['issueId', 'source']
      };

      var reg = regex(options);

      var msg = parser(
        '@Steve\n' +
        '@conventional-changelog @someone' +
        '\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        '@this is',
        options,
        reg
      );

      expect(msg.mentions).to.eql([
        'Steve',
        'conventional-changelog',
        'someone',
        'this'
      ]);
    });
  });

  describe('merge commits', function() {
    var mergeOptions = {
      headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      mergePattern: /^Merge branch \'(\w+)\'$/,
      mergeCorrespondence: ['source', 'issueId']
    };

    var mergeRegex = regex(mergeOptions);

    var mergeMsg = parser(
      'Merge branch \'feature\'\nHEADER',
      mergeOptions,
      mergeRegex
    );

    it('should parse merge header in merge commit', function() {
      expect(mergeMsg.source).to.equal('feature');
      expect(mergeMsg.issueId).to.equal(null);
    });

    var githubOptions = {
      headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      mergePattern: /^Merge pull request #(\d+) from (.*)$/,
      mergeCorrespondence: ['issueId', 'source']
    };

    var githubRegex = regex(githubOptions);

    var githubMsg = parser(
      'Merge pull request #1 from user/feature/feature-name\n' +
      '\n' +
      'feat(scope): broadcast $destroy event on scope destruction\n' +
      '\n' +
      'perf testing shows that in chrome this change adds 5-15% overhead\n' +
      'when destroying 10k nested scopes where each scope has a $destroy listener',
      githubOptions,
      githubRegex
    );

    it('should parse header in GitHub like pull request', function() {
      expect(githubMsg.header).to.equal('feat(scope): broadcast $destroy event on scope destruction');
    });

    it('should understand header parts in GitHub like pull request', function() {
      expect(githubMsg.type).to.equal('feat');
      expect(githubMsg.scope).to.equal('scope');
      expect(githubMsg.subject).to.equal('broadcast $destroy event on scope destruction');
    });

    it('should understand merge parts in GitHub like pull request', function() {
      expect(githubMsg.merge).to.equal('Merge pull request #1 from user/feature/feature-name');
      expect(githubMsg.issueId).to.equal('1');
      expect(githubMsg.source).to.equal('user/feature/feature-name');
    });

    var gitLabOptions = {
      headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      mergePattern: /^Merge branch '([^']+)' into '[^']+'$/,
      mergeCorrespondence: ['source']
    };

    var gitLabRegex = regex(gitLabOptions);

    var gitlabMsg = parser(
      'Merge branch \'feature/feature-name\' into \'master\'\r\n' +
      '\r\n' +
      'feat(scope): broadcast $destroy event on scope destruction\r\n' +
      '\r\n' +
      'perf testing shows that in chrome this change adds 5-15% overhead\r\n' +
      'when destroying 10k nested scopes where each scope has a $destroy listener\r\n' +
      '\r\n' +
      'See merge request !1',
      gitLabOptions,
      gitLabRegex
    );

    it('should parse header in GitLab like merge request', function() {
      expect(gitlabMsg.header).to.equal('feat(scope): broadcast $destroy event on scope destruction');
    });

    it('should understand header parts in GitLab like merge request', function() {
      expect(gitlabMsg.type).to.equal('feat');
      expect(gitlabMsg.scope).to.equal('scope');
      expect(gitlabMsg.subject).to.equal('broadcast $destroy event on scope destruction');
    });

    it('should understand merge parts in GitLab like merge request', function() {
      expect(gitlabMsg.merge).to.equal('Merge branch \'feature/feature-name\' into \'master\'');
      expect(gitlabMsg.source).to.equal('feature/feature-name');
    });

    it('Should parse header if merge header is missing', function() {
      var msgWithoutmergeHeader = parser(
        'feat(scope): broadcast $destroy event on scope destruction',
        githubOptions,
        githubRegex
      );

      expect(msgWithoutmergeHeader.merge).to.equal(null);
    });

    it('merge should be null if options.mergePattern is not defined', function() {
      expect(msg.merge).to.equal(null);
    });

    it('Should not parse conventional header if pull request header present and mergePattern is not set', function() {
      var msgWithmergeHeaderWithoutmergePattern = parser(
        'Merge pull request #1 from user/feature/feature-name\n' +
        'feat(scope): broadcast $destroy event on scope destruction',
        options,
        reg
      );
      expect(msgWithmergeHeaderWithoutmergePattern.type).to.equal(null);
      expect(msgWithmergeHeaderWithoutmergePattern.scope).to.equal(null);
      expect(msgWithmergeHeaderWithoutmergePattern.subject).to.equal(null);
    });
  });

  describe('header', function() {
    it('should allow ":" in scope', function() {
      var msg = parser('feat(ng:list): Allow custom separator', {
        headerPattern: /^(\w*)(?:\(([:\w\$\.\-\* ]*)\))?\: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject']
      }, reg);
      expect(msg.scope).to.equal('ng:list');
    });

    it('header part should be null if not captured', function() {
      expect(headerOnlyMsg.type).to.equal(null);
      expect(headerOnlyMsg.scope).to.equal(null);
      expect(headerOnlyMsg.subject).to.equal(null);
    });

    it('should parse header', function() {
      expect(msg.header).to.equal('feat(scope): broadcast $destroy event on scope destruction');
    });

    it('should understand header parts', function() {
      expect(msg.type).to.equal('feat');
      expect(msg.scope).to.equal('scope');
      expect(msg.subject).to.equal('broadcast $destroy event on scope destruction');
    });

    it('should allow correspondence to be changed', function() {
      var msg = parser('scope(my subject): fix this', {
        headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
        headerCorrespondence: ['scope', 'subject', 'type']
      }, reg);

      expect(msg.type).to.equal('fix this');
      expect(msg.scope).to.equal('scope');
      expect(msg.subject).to.equal('my subject');
    });

    it('should be `undefined` if it is missing in `options.headerCorrespondence`', function() {
      msg = parser('scope(my subject): fix this', {
        headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
        headerCorrespondence: ['scop', 'subject']
      }, reg);

      expect(msg.scope).to.equal(undefined);
    });

    it('should reference an issue with an owner', function() {
      var msg = parser('handled angular/angular.js#1', options, reg);
      expect(msg.references).to.eql([{
        action: 'handled',
        owner: 'angular',
        repository: 'angular.js',
        issue: '1',
        raw: 'angular/angular.js#1',
        prefix: '#'
      }]);
    });

    it('should reference an issue with a repository', function() {
      var msg = parser('handled angular.js#1', options, reg);
      expect(msg.references).to.eql([{
        action: 'handled',
        owner: null,
        repository: 'angular.js',
        issue: '1',
        raw: 'angular.js#1',
        prefix: '#'
      }]);
    });

    it('should reference an issue without both', function() {
      var msg = parser('handled gh-1', options, reg);
      expect(msg.references).to.eql([{
        action: 'handled',
        owner: null,
        repository: null,
        issue: '1',
        raw: 'gh-1',
        prefix: 'gh-'
      }]);
    });

    it('should reference an issue without an action', function() {
      var options = {
        revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (.*)\.$/,
        revertCorrespondence: ['header', 'hash'],
        fieldPattern: /^-(.*?)-$/,
        headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
        noteKeywords: ['BREAKING AMEND'],
        issuePrefixes: ['#', 'gh-']
      };

      var reg = regex(options);

      var msg = parser('This is gh-1', options, reg);
      expect(msg.references).to.eql([{
        action: null,
        owner: null,
        repository: null,
        issue: '1',
        raw: 'This is gh-1',
        prefix: 'gh-'
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
        'handle #33, Closes #100, Handled #3 kills repo#77\n' +
        'kills stevemao/conventional-commits-parser#1'
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

    it('references should be empty if not found', function() {
      expect(simpleMsg.references).to.eql([]);
    });

    it('should parse references', function() {
      expect(msg.references).to.eql([{
        action: 'Kills',
        owner: null,
        repository: null,
        issue: '1',
        raw: '#1',
        prefix: '#'
      }, {
        action: 'Kills',
        owner: null,
        repository: null,
        issue: '123',
        raw: ', #123',
        prefix: '#'
      }, {
        action: 'killed',
        owner: null,
        repository: null,
        issue: '25',
        raw: '#25',
        prefix: '#'
      }, {
        action: 'handle',
        owner: null,
        repository: null,
        issue: '33',
        raw: '#33',
        prefix: '#'
      }, {
        action: 'handle',
        owner: null,
        repository: null,
        issue: '100',
        raw: ', Closes #100',
        prefix: '#'
      }, {
        action: 'Handled',
        owner: null,
        repository: null,
        issue: '3',
        raw: '#3',
        prefix: '#'
      }, {
        action: 'kills',
        owner: null,
        repository: 'repo',
        issue: '77',
        raw: 'repo#77',
        prefix: '#'
      }, {
        action: 'kills',
        owner: 'stevemao',
        repository: 'conventional-commits-parser',
        issue: '1',
        raw: 'stevemao/conventional-commits-parser#1',
        prefix: '#'
      }]);
    });

    it('should reference an issue without an action', function() {
      var options = {
        revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (.*)\.$/,
        revertCorrespondence: ['header', 'hash'],
        fieldPattern: /^-(.*?)-$/,
        headerPattern: /^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
        noteKeywords: ['BREAKING AMEND'],
        issuePrefixes: ['#', 'gh-']
      };

      var reg = regex(options);

      var msg = parser(
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'Kills #1, gh-123\n' +
        'what\n' +
        '#25\n' +
        '#33, maybe gh-100, not sure about #3\n',
        options, reg
      );

      expect(msg.references).to.eql([{
        action: null,
        owner: null,
        repository: null,
        issue: '1',
        raw: 'Kills #1',
        prefix: '#'
      }, {
        action: null,
        owner: null,
        repository: null,
        issue: '123',
        raw: ', gh-123',
        prefix: 'gh-'
      }, {
        action: null,
        owner: null,
        repository: null,
        issue: '25',
        raw: '#25',
        prefix: '#'
      }, {
        action: null,
        owner: null,
        repository: null,
        issue: '33',
        raw: '#33',
        prefix: '#'
      }, {
        action: null,
        owner: null,
        repository: null,
        issue: '100',
        raw: ', maybe gh-100',
        prefix: 'gh-'
      }, {
        action: null,
        owner: null,
        repository: null,
        issue: '3',
        raw: ', not sure about #3',
        prefix: '#'
      }]);
    });

    it('should put everything after references in footer', function() {
      var msg = parser(
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'Kills #1, #123\n' +
        'what\n' +
        'killed #25\n' +
        'handle #33, Closes #100, Handled #3\n' +
        'other',
        options,
        reg
      );

      expect(msg.footer).to.equal('Kills #1, #123\nwhat\nkilled #25\nhandle #33, Closes #100, Handled #3\nother');
    });

    it('should parse properly if important notes comes after references', function() {
      var msg = parser(
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'Kills #1, #123\n' +
        'BREAKING AMEND: some breaking change\n',
        options,
        reg
      );
      expect(msg.notes[0]).to.eql({
        title: 'BREAKING AMEND',
        text: 'some breaking change'
      });
      expect(msg.references).to.eql([{
        action: 'Kills',
        owner: null,
        repository: null,
        issue: '1',
        raw: '#1',
        prefix: '#'
      }, {
        action: 'Kills',
        owner: null,
        repository: null,
        issue: '123',
        raw: ', #123',
        prefix: '#'
      }]);
      expect(msg.footer).to.equal('Kills #1, #123\nBREAKING AMEND: some breaking change');
    });

    it('should parse properly if important notes comes with more than one paragraphs after references', function() {
      var msg = parser(
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'Kills #1, #123\n' +
        'BREAKING AMEND: some breaking change\nsome other breaking change',
        options,
        reg
      );
      expect(msg.notes[0]).to.eql({
        title: 'BREAKING AMEND',
        text: 'some breaking change\nsome other breaking change'
      });
      expect(msg.references).to.eql([{
        action: 'Kills',
        owner: null,
        repository: null,
        issue: '1',
        raw: '#1',
        prefix: '#'
      }, {
        action: 'Kills',
        owner: null,
        repository: null,
        issue: '123',
        raw: ', #123',
        prefix: '#'
      }]);
      expect(msg.footer).to.equal('Kills #1, #123\nBREAKING AMEND: some breaking change\nsome other breaking change');
    });

    it('should parse properly if important notes comes after references', function() {
      var msg = parser(
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'Kills gh-1, #123\n' +
        'other\n' +
        'BREAKING AMEND: some breaking change\n',
        options,
        reg
      );
      expect(msg.notes[0]).to.eql({
        title: 'BREAKING AMEND',
        text: 'some breaking change'
      });
      expect(msg.references).to.eql([{
        action: 'Kills',
        owner: null,
        repository: null,
        issue: '1',
        raw: 'gh-1',
        prefix: 'gh-'
      }, {
        action: 'Kills',
        owner: null,
        repository: null,
        issue: '123',
        raw: ', #123',
        prefix: '#'
      }]);
      expect(msg.footer).to.equal('Kills gh-1, #123\nother\nBREAKING AMEND: some breaking change');
    });
  });

  describe('others', function() {
    it('should parse hash', function() {
      msg = parser(
        'My commit message\n' +
        '-hash-\n' +
        '9b1aff905b638aa274a5fc8f88662df446d374bd',
        options,
        reg
      );

      expect(msg.hash).to.equal('9b1aff905b638aa274a5fc8f88662df446d374bd');
    });

    it('should parse sideNotes', function() {
      msg = parser(
        'My commit message\n' +
        '-sideNotes-\n' +
        'It should warn the correct unfound file names.\n' +
        'Also it should continue if one file cannot be found.\n' +
        'Tests are added for these',
        options,
        reg
      );

      expect(msg.sideNotes).to.equal('It should warn the correct unfound file names.\n' +
        'Also it should continue if one file cannot be found.\n' +
        'Tests are added for these');
    });

    it('should parse committer name and email', function() {
      msg = parser(
        'My commit message\n' +
        '-committerName-\n' +
        'Steve Mao\n' +
        '- committerEmail-\n' +
        'test@github.com',
        options,
        reg
      );

      expect(msg.committerName).to.equal('Steve Mao');
      expect(msg[' committerEmail']).to.equal('test@github.com');
    });
  });

  describe('revert', function() {
    it('should parse revert', function() {
      msg = parser(
        'Revert "throw an error if a callback is passed to animate methods"\n\n' +
        'This reverts commit 9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca.',
        options,
        reg
      );

      expect(msg.revert).to.eql({
        header: 'throw an error if a callback is passed to animate methods',
        hash: '9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca'
      });
    });

    it('should parse revert even if a field is missing', function() {
      msg = parser(
        'Revert ""\n\n' +
        'This reverts commit .',
        options,
        reg
      );

      expect(msg.revert).to.eql({
        header: null,
        hash: null
      });
    });
  });
});
