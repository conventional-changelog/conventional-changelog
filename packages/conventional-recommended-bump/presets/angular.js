var presetOpts = {
  whatBump: function(commits) {
    var level = 2;
    var breakings = 0;
    var features = 0;
    var fixes = 0;

    commits.forEach(function(commit) {
      if (commit.notes.length > 0) {
        breakings += commit.notes.length;
        level = 0;
      } else if (commit.type === 'feat') {
        features += 1;
        if (level === 2) {
          level = 1;
        }
      } else if (commit.type === 'fix') {
        // no need to reset `level` since it is
        // inherently a patch and it would be
        // preferable to take the highest level bump
        fixes += 1;
      }
    });

    return {
      level: level,
      reason: 'There are ' + breakings + ' BREAKING CHANGES, ' + features + ' features, and ' + fixes + ' fixes',
      changes: {
        breaking: breakings,
        features: features,
        fixes: fixes
      }
    };
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
