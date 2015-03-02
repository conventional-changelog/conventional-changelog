'use strict';
var Handlebars = require('handlebars');
var _ = require('lodash');

function compileTemplates(templates) {
  var partials = templates.partials;
  if (_.isEmpty(partials)) {
    Handlebars.registerPartial('header', templates.headerPartial);
    Handlebars.registerPartial('commit', templates.commitPartial);
    Handlebars.registerPartial('footer', templates.footerPartial);
  } else {
    _.forEach(partials, function(partial, name) {
      Handlebars.registerPartial(name, partial);
    });
  }

  var main = templates.mainTemplate;
  return Handlebars.compile(main);
}

function getCommitGroups(groupBy, commits, groupsCompareFn, commitsCompareFn) {
  var commitGroups = [];
  var commitGroupsObj = _.groupBy(commits, function(commit) {
    return commit[groupBy] || '';
  });

  _.forEach(commitGroupsObj, function(commits, name) {
    if (name === '') {
      name = false;
    }

    if (commitsCompareFn) {
      commits.sort(commitsCompareFn);
    }
    commitGroups.push({
      name: name,
      commits: commits
    });
  });

  if (groupsCompareFn) {
    commitGroups.sort(groupsCompareFn);
  }

  return commitGroups;
}

function getNoteGroups(allNotes, noteGroups, noteGroupsCompareFn, notesCompareFn) {
  noteGroups = noteGroups || {};
  var reGroups = [];
  _.forEach(allNotes, function(notes) {
    _.forEach(notes, function(note, name) {
      name = noteGroups[name];
      if (name) {
        var titleExists = false;
        _.forEach(reGroups, function(group) {
          if (group.name === name) {
            titleExists = true;
            group.notes.push(note);
            return false;
          }
        });

        if (!titleExists) {
          reGroups.push({
            name: name,
            notes: [note]
          });
        }
      }
    });
  });

  reGroups.sort(noteGroupsCompareFn);
  _.forEach(reGroups, function(group) {
    group.notes.sort(notesCompareFn);
  });

  return reGroups;
}

function processCommit(chunk, hashLength, replacements) {
  var commit;
  try {
    commit = JSON.parse(chunk);
  } catch (e) {
    commit = _.cloneDeep(chunk);
  }
  if (_.isNumber(hashLength)) {
    commit.hash = commit.hash.substring(0, hashLength);
  }
  _.forEach(replacements, function(maps, component) {
    commit[component] = maps[commit[component]] || commit[component];
  });

  return commit;
}

function getExtraContext(commits, allNotes, options) {
  var context = {};
  var groupBy = options.groupBy;
  var commitGroupsCompareFn = options.commitGroupsCompareFn;

  // group `commits` by `options.groupBy`
  context.commitGroups = getCommitGroups(groupBy, commits, commitGroupsCompareFn, options.commitsCompareFn);

  // group `notes` for footer
  context.noteGroups = getNoteGroups(allNotes, options.noteGroups, options.noteGroupsCompareFn, options.notesCompareFn);

  return context;
}

function getCompareFunction(field) {
  if (field) {
    return function(a, b) {
      if (a[field] < b[field]) {
        return -1;
      }
      if (a[field] > b[field]) {
        return 1;
      }
      return 0;
    };
  }
  return function(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };
}

module.exports = {
  compileTemplates: compileTemplates,
  getCommitGroups: getCommitGroups,
  getNoteGroups: getNoteGroups,
  processCommit: processCommit,
  getExtraContext: getExtraContext,
  getCompareFunction: getCompareFunction
};
