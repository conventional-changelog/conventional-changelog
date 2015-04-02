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

    it('should group but not sort', function() {
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
      title: 'A',
      text: 'this is A and its a bit longer'
    }, {
      title: 'B',
      text: 'this is B'
    }, {
      title: 'C',
      text: 'this is C'
    }, {
      title: 'A',
      text: 'this is another A'
    }, {
      title: 'B',
      text: 'this is another B'
    }];
    var noteGroupsMapping = {
      A: 'Big A',
      B: 'Big B+'
    };

    it('should group', function() {
      var noteGroups = util.getNoteGroups(notes, noteGroupsMapping);

      expect(noteGroups).to.eql([{
        title: 'Big A',
        notes: ['this is A and its a bit longer', 'this is another A']
      }, {
        title: 'Big B+',
        notes: ['this is B', 'this is another B']
      }]);
    });

    it('should lose all notes', function() {
      var noteGroups = util.getNoteGroups(notes);

      expect(noteGroups).to.eql([]);
    });

    it('should group and sort groups', function() {
      var noteGroups = util.getNoteGroups(notes, noteGroupsMapping, function(a, b) {
        if (a.title.length < b.title.length) {
          return 1;
        }
        if (a.title.length > b.title.length) {
          return -1;
        }
        return 0;
      });

      expect(noteGroups).to.eql([{
        title: 'Big B+',
        notes: ['this is B', 'this is another B']
      }, {
        title: 'Big A',
        notes: ['this is A and its a bit longer', 'this is another A']
      }]);
    });

    it('should group and sort notes', function() {
      var noteGroups = util.getNoteGroups(notes, noteGroupsMapping, false, function(a, b) {
        if (a.length < b.length) {
          return 1;
        }
        if (a.length > b.length) {
          return -1;
        }
        return 0;
      });

      expect(noteGroups).to.eql([{
        title: 'Big A',
        notes: ['this is A and its a bit longer', 'this is another A']
      }, {
        title: 'Big B+',
        notes: ['this is another B', 'this is B']
      }]);
    });
  });

  describe('processCommit', function() {
    var replacements = {
      replaceThis: {
        replacement1: 'Yes',
        replacement2: 'no',
        replacement3: 'oK'
      },
      replaceThisToo: {
        replacement: 'notOK'
      },
      pleaseReplaceThis: {
        replacement: 'sure'
      }
    };
    var commit = {
      hash: '456789uhghi',
      replaceThis: 'replacement2',
      replaceThisToo: 'replacement',
      pleaseReplaceThis: 'cantReplaceThis'
    };

    it('should process object commit', function() {
      var processed = util.processCommit(commit, 4, replacements);

      expect(processed).to.eql({
        hash: '4567',
        replaceThis: 'no',
        replaceThisToo: 'notOK',
        pleaseReplaceThis: 'cantReplaceThis'
      });
    });

    it('should not replace', function() {
      var processed = util.processCommit(commit, 4);

      expect(processed).to.eql({
        hash: '4567',
        replaceThis: 'replacement2',
        replaceThisToo: 'replacement',
        pleaseReplaceThis: 'cantReplaceThis'
      });
    });

    it('should not shorten hash', function() {
      var processed = util.processCommit(commit);

      expect(processed).to.eql({
        hash: '456789uhghi',
        replaceThis: 'replacement2',
        replaceThisToo: 'replacement',
        pleaseReplaceThis: 'cantReplaceThis'
      });
    });

    it('should process json commit', function() {
      var processed = util.processCommit(JSON.stringify(commit), 4, replacements);

      expect(processed).to.eql({
        hash: '4567',
        replaceThis: 'no',
        replaceThisToo: 'notOK',
        pleaseReplaceThis: 'cantReplaceThis'
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
      title: 'C',
      text: 'this is C'
    }, {
      title: 'A',
      text: 'this is another A'
    }, {
      title: 'B',
      text: 'this is another B'
    }];
    var noteGroupsMapping = {
      A: 'Big A',
      B: 'Big B+'
    };

    it('should process context without `options.groupBy`', function() {
      var extra = util.getExtraContext(commits, notes, {
        noteGroups: noteGroupsMapping
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
          title: 'Big A',
          notes: [
            'this is A and its a bit longer',
            'this is another A'
          ]
        }, {
          title: 'Big B+',
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
        noteGroups: []
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
        noteGroups: []
      });
    });
  });

  describe('getCompareFunction', function() {
    it('should generate a compare function if field exist', function() {
      var compareFn = util.getCompareFunction('field');
      var arr = [{
        field: 3
      }, {
        field: 1
      }, {
        field: 1
      }, {
        field: 5
      }];
      arr.sort(compareFn);

      expect(arr).to.eql([{
        field: 1
      }, {
        field: 1
      }, {
        field: 3
      }, {
        field: 5
      }]);
    });

    it('should generate a compare function if field does not exist', function() {
      var compareFn = util.getCompareFunction();
      var arr = [3, 1, 1, 5];
      arr.sort(compareFn);

      expect(arr).to.eql([1, 1, 3, 5]);
    });
  });
});
