describe('git', function() {
  
  var git = require('../lib/git');

  describe('parseRawCommit', function() {

    it('should parse raw commit', function() {
      var msg;
      msg = git.parseRawCommit(
        '9b1aff905b638aa274a5fc8f88662df446d374bd\n' +
        'feat(scope): broadcast $destroy event on scope destruction\n' + 
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n'
      );
      expect(msg.type).to.equal('feat');
      expect(msg.component).to.equal('scope');
      expect(msg.hash).to.equal('9b1aff905b638aa274a5fc8f88662df446d374bd');
      expect(msg.subject).to.equal('broadcast $destroy event on scope destruction');
      expect(msg.body).to.equal(
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n');
    });
    it('should parse closed issues', function() {
      var msg = git.parseRawCommit(
        '13f31602f396bc269076ab4d389cfd8ca94b20ba\n' +
        'feat(ng-list): Allow custom separator\n' +
        'bla bla bla\n\n' +
        'Closes #123\nCloses #25\nFixes #33\n'
      );
      expect(msg.closes).to.deep.equal([123, 25, 33]);
    });
    it('should parse breaking changes', function() {
      var msg = git.parseRawCommit(
        '13f31602f396bc269076ab4d389cfd8ca94b20ba\n' +
        'feat(ng-list): Allow custom separator\n' +
        'bla bla bla\n\n' +
        'BREAKING CHANGE: some breaking change\n'
      );
      expect(msg.breaks).to.deep.equal(['some breaking change\n']);
    });
    it('should parse Closes in the subject (and remove it)', function() {
      var msg = git.parseRawCommit(
        '13f31602f396bc269076ab4d389cfd8ca94b20ba\n' +
        'feat(xxx): Whatever Closes #24\n' +
        'bla bla bla\n\n' +
        'What not ?\n'
      );
      expect(msg.closes).to.deep.equal([24]);
      expect(msg.subject).to.equal('Whatever');
    });
    it('should parse Fixes in the subject (and remove it)', function() {
      var msg = git.parseRawCommit(
        '13f31602f396bc269076ab4d389cfd8ca94b20ba\n' +
        'feat(xxx): Whatever Fixes #25\n' +
        'bla bla bla\n\n' +
        'What not ?\n'
      );
      expect(msg.closes).to.deep.equal([25]);
      expect(msg.subject).to.equal('Whatever');
    });
    it('should parse multiple issues closed with Closes #1, #2', function() {
      var msg = git.parseRawCommit(
        '13f31602f396bc269076ab4d389cfd8ca94b20ba\n' +
        'feat(xxx): Very cool commit\n' +
        'bla bla bla\n\n' + 
        'Closes #1, #22, #33\n' +
        'What not ?\n'
      );
      expect(msg.closes).to.deep.equal([1, 22, 33]);
    });
    it('should parse a msg without scope', function() {
      var msg = git.parseRawCommit(
        '13f31602f396bc269076ab4d389cfd8ca94b20ba\n' +
        'chore: some chore bullshit\n' +
        'bla bla bla\n\n' + 
        'BREAKING CHANGE: some breaking change\n'
      );
      expect(msg.type).to.equal('chore');
    });
  });
});
