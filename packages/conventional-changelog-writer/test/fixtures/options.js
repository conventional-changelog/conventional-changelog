module.exports = {
  "groupBy": "type",
  "hashLength": 10,
  "replacements": {
    "type": {
      "fix": "Bug Fixes",
      "feat": "Features",
      "perf": "Performance Improvements"
    }
  },
  "noteGroups": {
    "BREAKING CHANGE": "BREAKING CHANGES"
  },
  "commitGroupsCompareFn": function(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  },
  "commitsCompareFn": function(a, b) {
    if (a.scope < b.scope) {
      return -1;
    }
    if (a.scope > b.scope) {
      return 1;
    }
    return 0;
  },
  "noteGroupsCompareFn": function(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  },
  "notesCompareFn": function(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  },
  "mainTemplate": "{{date2}}template"
};
