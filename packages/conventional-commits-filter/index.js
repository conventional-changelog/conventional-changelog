'use strict';
var isSubset = require('is-subset');
var modifyValues = require('modify-values');

function conventionalCommitsFilter (commits) {
  if (!Array.isArray(commits)) {
    throw new TypeError('Expected an array');
  }

  var ret = [];
  var ignores = [];
  commits.forEach(function (commit) {
    if (commit.revert) {
      ignores.push(commit.revert);
    } else {
      ret.push(commit);
    }
  });

  ret = ret.filter(function (commit) {
    var ignoreThis = false;

    commit = modifyValues(commit, function (val) {
      if (typeof val === 'string') {
        return val.trim();
      }

      return val;
    });

    ignores.some(function (ignore) {
      ignore = modifyValues(ignore, function (val) {
        if (typeof val === 'string') {
          return val.trim();
        }

        return val;
      });

      ignoreThis = isSubset(commit, ignore);
      return ignoreThis;
    });

    return !ignoreThis;
  });

  return ret;
}

module.exports = conventionalCommitsFilter;
