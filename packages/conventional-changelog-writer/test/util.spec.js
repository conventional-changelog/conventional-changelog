'use strict';
var util = require('../lib/util');
var expect = require('chai').expect;

describe('util', function() {
  describe('compileTemplates', function() {
    it('should compile templates with default partials', function() {
      var templates = {
        mainTemplate: '{{> header}}{{> commit}}{{> footer}}',
        headerPartial: 'header\n',
        commitPartial: 'commit\n',
        footerPartial: 'footer\n'
      };
      var compiled = util.compileTemplates(templates);

      expect(compiled()).to.equal('header\ncommit\nfooter\n');
    });

    it('should compile templates with customized partials', function() {
      var templates = {
        mainTemplate: '{{> partial1}}{{> partial2}}{{> partial3}}',
        partials: {
          partial1: 'partial1\n',
          partial2: 'partial2\n',
          partial3: 'partial3\n'
        }
      };
      var compiled = util.compileTemplates(templates);

      expect(compiled()).to.equal('partial1\npartial2\npartial3\n');
    });
  });

  describe('functionify', function() {
    it('should turn any truthy value into a function', function() {
      var func = util.functionify('a');

      expect(func).to.be.a('function');
    });

    it('should not change falsy value', function() {
      var func = util.functionify(null);

      expect(func).to.equal(null);
    });
  });

  describe('getCommitGroups', function() {
    var commits = [{
      groupBy: 'A',
      content: 'this is A'
    }, {
      groupBy: 'A',
      content: 'this is another A'
    }, {
      groupBy: 'Big B',
      content: 'this is B and its a bit longer'
    }];

    it('should group but not sort groups', function() {
      var commitGroups = util.getCommitGroups('groupBy', commits);

      expect(commitGroups).to.eql([{
        title: 'A',
        commits: [{
          groupBy: 'A',
          content: 'this is A'
        }, {
          groupBy: 'A',
          content: 'this is another A'
        }]
      }, {
        title: 'Big B',
        commits: [{
          groupBy: 'Big B',
          content: 'this is B and its a bit longer'
        }]
      }]);
    });

    it('should group if `groupBy` is undefined', function() {
      var commits = [{
        content: 'this is A'
      }, {
        content: 'this is another A'
      }, {
        groupBy: 'Big B',
        content: 'this is B and its a bit longer'
      }];
      var commitGroups = util.getCommitGroups('groupBy', commits);

      expect(commitGroups).to.eql([{
        title: false,
        commits: [{
          content: 'this is A'
        }, {
          content: 'this is another A'
        }]
      }, {
        title: 'Big B',
        commits: [{
          groupBy: 'Big B',
          content: 'this is B and its a bit longer'
        }]
      }]);
    });

    it('should group and sort groups', function() {
      var commitGroups = util.getCommitGroups('groupBy', commits, function(a, b) {
        if (a.title.length < b.title.length) {
          return 1;
        }
        if (a.title.length > b.title.length) {
          return -1;
        }
        return 0;
      });

      expect(commitGroups).to.eql([{
        title: 'Big B',
        commits: [{
          groupBy: 'Big B',
          content: 'this is B and its a bit longer'
        }]
      }, {
        title: 'A',
        commits: [{
          groupBy: 'A',
          content: 'this is A'
        }, {
          groupBy: 'A',
          content: 'this is another A'
        }]
      }]);
    });

    it('should group and but not sort commits', function() {
      var commitGroups = util.getCommitGroups('groupBy', commits);

      expect(commitGroups).to.eql([{
        title: 'A',
        commits: [{
          groupBy: 'A',
          content: 'this is A'
        }, {
          groupBy: 'A',
          content: 'this is another A'
        }]
      }, {
        title: 'Big B',
        commits: [{
          groupBy: 'Big B',
          content: 'this is B and its a bit longer'
        }]
      }]);
    });

    it('should group and sort commits', function() {
      var commitGroups = util.getCommitGroups('groupBy', commits, false, function(a, b) {
        if (a.content.length < b.content.length) {
          return 1;
        }
        if (a.content.length > b.content.length) {
          return -1;
        }
        return 0;
      });

      expect(commitGroups).to.eql([{
        title: 'A',
        commits: [{
          groupBy: 'A',
          content: 'this is another A'
        }, {
          groupBy: 'A',
          content: 'this is A'
        }]
      }, {
        title: 'Big B',
        commits: [{
          groupBy: 'Big B',
          content: 'this is B and its a bit longer'
        }]
      }]);
    });
  });

  describe('getNoteGroups', function() {
    var notes = [{
      title: 'A title',
      text: 'this is A and its a bit longer'
    }, {
      title: 'B+',
      text: 'this is B'
    }, {
      title: 'C',
      text: 'this is C'
    }, {
      title: 'A title',
      text: 'this is another A'
    }, {
      title: 'B+',
      text: 'this is another B'
    }];

    it('should group', function() {
      var noteGroups = util.getNoteGroups(notes);

      expect(noteGroups).to.eql([{
        title: 'A title',
        notes: ['this is A and its a bit longer', 'this is another A']
      }, {
        title: 'B+',
        notes: ['this is B', 'this is another B']
      }, {
        title: 'C',
        notes: ['this is C']
      }]);
    });

    it('should group and sort groups', function() {
      var noteGroups = util.getNoteGroups(notes, function(a, b) {
        if (a.title.length > b.title.length) {
          return 1;
        }
        if (a.title.length < b.title.length) {
          return -1;
        }
        return 0;
      });

      expect(noteGroups).to.eql([{
        title: 'C',
        notes: ['this is C']
      }, {
        title: 'B+',
        notes: ['this is B', 'this is another B']
      }, {
        title: 'A title',
        notes: ['this is A and its a bit longer', 'this is another A']
      }]);
    });

    it('should group and sort notes', function() {
      var noteGroups = util.getNoteGroups(notes, false, function(a, b) {
        if (a.length < b.length) {
          return 1;
        }
        if (a.length > b.length) {
          return -1;
        }
        return 0;
      });

      expect(noteGroups).to.eql([{
        title: 'A title',
        notes: ['this is A and its a bit longer', 'this is another A']
      }, {
        title: 'B+',
        notes: ['this is another B', 'this is B']
      }, {
        title: 'C',
        notes: ['this is C']
      }]);
    });

    it('should work if title does not exist', function() {
      var notes = [{
        title: '',
        text: 'this is A and its a bit longer'
      }, {
        title: 'B+',
        text: 'this is B'
      }, {
        title: '',
        text: 'this is another A'
      }, {
        title: 'B+',
        text: 'this is another B'
      }];

      var noteGroups = util.getNoteGroups(notes);

      expect(noteGroups).to.eql([{
        title: '',
        notes: ['this is A and its a bit longer', 'this is another A']
      }, {
        title: 'B+',
        notes: ['this is B', 'this is another B']
      }]);
    });
  });

  describe('processCommit', function() {
    var commit = {
      hash: '456789uhghi',
      subject: 'my subject!!!',
      replaceThis: 'bad',
      doNothing: 'nothing'
    };

    it('should process object commit', function() {
      var processed = util.processCommit(commit);

      expect(processed).to.eql({
        hash: '456789uhghi',
        subject: 'my subject!!!',
        replaceThis: 'bad',
        doNothing: 'nothing',
        raw: {
          hash: '456789uhghi',
          subject: 'my subject!!!',
          replaceThis: 'bad',
          doNothing: 'nothing',
        }
      });
    });

    it('should process json commit', function() {
      var processed = util.processCommit(JSON.stringify(commit));

      expect(processed).to.eql({
        hash: '456789uhghi',
        subject: 'my subject!!!',
        replaceThis: 'bad',
        doNothing: 'nothing',
        raw: {
          hash: '456789uhghi',
          subject: 'my subject!!!',
          replaceThis: 'bad',
          doNothing: 'nothing',
        }
      });
    });

    it('should transform by a function', function() {
      var processed = util.processCommit(commit, function(commit) {
        commit.hash = commit.hash.substring(0, 4);
        commit.subject = commit.subject.substring(0, 5);
        commit.replaceThis = 'replaced';
        return commit;
      });

      expect(processed).to.eql({
        hash: '4567',
        subject: 'my su',
        replaceThis: 'replaced',
        doNothing: 'nothing',
        raw: {
          hash: '456789uhghi',
          subject: 'my subject!!!',
          replaceThis: 'bad',
          doNothing: 'nothing',
        }
      });
    });

    it('should transform by an object', function() {
      var processed = util.processCommit(commit, {
        hash: function(hash) {
          return hash.substring(0, 4);
        },
        subject: function(subject) {
          return subject.substring(0, 5);
        },
        replaceThis: 'replaced'
      });

      expect(processed).to.eql({
        hash: '4567',
        subject: 'my su',
        replaceThis: 'replaced',
        doNothing: 'nothing',
        raw: {
          hash: '456789uhghi',
          subject: 'my subject!!!',
          replaceThis: 'bad',
          doNothing: 'nothing',
        }
      });
    });

    it('should transform by an object using dot path', function() {
      var processed = util.processCommit({
        header: {
          subject: 'my subject'
        }
      }, {
        'header.subject': function(subject) {
          return subject.substring(0, 5);
        }
      });

      expect(processed).to.eql({
        header: {
          subject: 'my su'
        },
        raw: {
          header: {
            subject: 'my subject'
          }
        }
      });
    });
  });

  describe('processContext', function() {
    var commits = [{
      content: 'this is A'
    }, {
      content: 'this is another A'
    }, {
      groupBy: 'Big B',
      content: 'this is B and its a bit longer'
    }];

    var notes = [{
      title: 'A',
      text: 'this is A and its a bit longer'
    }, {
      title: 'B',
      text: 'this is B'
    }, {
      title: 'A',
      text: 'this is another A'
    }, {
      title: 'B',
      text: 'this is another B'
    }];

    it('should process context without `options.groupBy`', function() {
      var extra = util.getExtraContext(commits, notes, {});

      expect(extra).to.eql({
        commitGroups: [{
          title: false,
          commits: [{
            content: 'this is A'
          }, {
            content: 'this is another A'
          }, {
            content: 'this is B and its a bit longer',
            groupBy: 'Big B'
          }]
        }],
        noteGroups: [{
          title: 'A',
          notes: [
            'this is A and its a bit longer',
            'this is another A'
          ]
        }, {
          title: 'B',
          notes: [
            'this is B',
            'this is another B'
          ]
        }]
      });
    });

    it('should process context with `options.groupBy` found', function() {
      var extra = util.getExtraContext(commits, notes, {
        groupBy: 'groupBy'
      });

      expect(extra).to.eql({
        commitGroups: [{
          title: false,
          commits: [{
            content: 'this is A'
          }, {
            content: 'this is another A'
          }]
        }, {
          title: 'Big B',
          commits: [{
            content: 'this is B and its a bit longer',
            groupBy: 'Big B'
          }]
        }],
        noteGroups: [{
          title: 'A',
          notes: [
            'this is A and its a bit longer',
            'this is another A'
          ]
        }, {
          title: 'B',
          notes: [
            'this is B',
            'this is another B'
          ]
        }]
      });
    });

    it('should process context with `options.groupBy` not found', function() {
      var extra = util.getExtraContext(commits, notes, {
        groupBy: 'what?'
      });

      expect(extra).to.eql({
        commitGroups: [{
          title: false,
          commits: [{
            content: 'this is A'
          }, {
            content: 'this is another A'
          }, {
            content: 'this is B and its a bit longer',
            groupBy: 'Big B'
          }]
        }],
        noteGroups: [{
          title: 'A',
          notes: [
            'this is A and its a bit longer',
            'this is another A'
          ]
        }, {
          title: 'B',
          notes: [
            'this is B',
            'this is another B'
          ]
        }]
      });
    });
  });

  describe('generate', function() {
    it('should merge with the key commit', function() {
      var log = util.generate({
        mainTemplate: '{{whatever}}'
      }, [], [], {
        whatever: 'a'
      }, {
        whatever: 'b'
      });

      expect(log).to.equal('b');
    });
  });
});
