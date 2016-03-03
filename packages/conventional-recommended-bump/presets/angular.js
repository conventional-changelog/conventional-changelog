var presetOpts = {
  whatBump: function(commits) {
    var level = 2;

    commits.some(function(commit) {
      if (commit.notes.length > 0) {
        level = 0;
        return true;
      } else if (commit.type === 'feat') {
        level = 1;
      }
    });

    return level;
  },
  parserOpts: {
    headerPattern: /^(\w*)(?:\((.*)\))?\: (.*)$/,
    headerCorrespondence: [
      'type',
      'scope',
      'subject'
    ],
    noteKeywords: 'BREAKING CHANGE',
    revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
    revertCorrespondence: ['header', 'hash']
  }
};

module.exports = presetOpts;
