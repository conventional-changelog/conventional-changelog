'use strict';
var isSubset = require('is-subset');
var modifyValues = require('modify-values');

function modifyValue(val) {
  if (typeof val === 'string') {
    return val.trim();
  }

  return val;
}

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

    commit = commit.raw ? modifyValues(commit.raw, modifyValue) : modifyValues(commit, modifyValue);

    ignores.some(function (ignore) {
      ignore = modifyValues(ignore, modifyValue);

      ignoreThis = isSubset(commit, ignore);
      return ignoreThis;
    });

    return !ignoreThis;
  });

  return ret;
}

module.exports = conventionalCommitsFilter;
