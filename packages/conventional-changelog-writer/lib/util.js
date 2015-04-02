'use strict';
var Handlebars = require('handlebars');
var _ = require('lodash');

function compileTemplates(templates) {
  var main = templates.mainTemplate;
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

  return Handlebars.compile(main);
}

function getCommitGroups(groupBy, commits, groupsCompareFn, commitsCompareFn) {
  var commitGroups = [];
  var commitGroupsObj = _.groupBy(commits, function(commit) {
    return commit[groupBy] || '';
  });

  _.forEach(commitGroupsObj, function(commits, title) {
    if (title === '') {
      title = false;
    }

    if (commitsCompareFn) {
      commits.sort(commitsCompareFn);
    }
    commitGroups.push({
      title: title,
      commits: commits
    });
  });

  if (groupsCompareFn) {
    commitGroups.sort(groupsCompareFn);
  }

  return commitGroups;
}

function getNoteGroups(notes, noteGroups, noteGroupsCompareFn, notesCompareFn) {
  noteGroups = noteGroups || {};
  var retGroups = [];

  _.forEach(notes, function(note) {
    var title = noteGroups[note.title];
    if (title) {
      var titleExists = false;
      _.forEach(retGroups, function(group) {
        if (group.title === title) {
          titleExists = true;
          group.notes.push(note.text);
          return false;
        }
      });

      if (!titleExists) {
        retGroups.push({
          title: title,
          notes: [note.text]
        });
      }
    }
  });

  retGroups.sort(noteGroupsCompareFn);
  _.forEach(retGroups, function(group) {
    group.notes.sort(notesCompareFn);
  });

  return retGroups;
}

function processCommit(chunk, hashLength, maxSubjectLength, replacements) {
  var commit;

  try {
    commit = JSON.parse(chunk);
  } catch (e) {
    commit = _.cloneDeep(chunk);
  }
  if (_.isNumber(hashLength)) {
    commit.hash = commit.hash.substring(0, hashLength);
  }

  if (commit.subject && _.isNumber(maxSubjectLength)) {
    commit.subject = commit.subject.substr(0, maxSubjectLength);
  }

  _.forEach(replacements, function(maps, component) {
    commit[component] = maps[commit[component]] || commit[component];
  });

  return commit;
}

function getExtraContext(commits, allNotes, options) {
  var context = {};

  // group `commits` by `options.groupBy`
  context.commitGroups = getCommitGroups(options.groupBy, commits, options.commitGroupsCompareFn, options.commitsCompareFn);

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
