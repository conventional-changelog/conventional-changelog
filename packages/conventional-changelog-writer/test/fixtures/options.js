module.exports = {
  "groupBy": "type",
  "hashLength": 10,
  "map": {
    "type": {
      "fix": "Bug Fixes",
      "feat": "Features",
      "perf": "Performance Improvements"
    }
  },
  "noteGroups": {
    "BREAKING CHANGE": "BREAKING CHANGES"
  },
  "commitGroupsSort": function(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  },
  "commitsSort": function(a, b) {
    if (a.scope < b.scope) {
      return -1;
    }
    if (a.scope > b.scope) {
      return 1;
    }
    return 0;
  },
  "noteGroupsSort": function(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  },
  "notesSort": function(a, b) {
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
