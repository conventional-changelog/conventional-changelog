'use strict';
var compareFunc = require('compare-func');
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

function functionify(strOrArr) {
  if (!_.isFunction(strOrArr)) {
    return compareFunc(strOrArr);
  }
  return strOrArr;
}

function getCommitGroups(groupBy, commits, groupsSort, commitsSort) {
  var commitGroups = [];
  var commitGroupsObj = _.groupBy(commits, function(commit) {
    return commit[groupBy] || '';
  });

  _.forEach(commitGroupsObj, function(commits, title) {
    if (title === '') {
      title = false;
    }

    commits.sort(commitsSort);
    commitGroups.push({
      title: title,
      commits: commits
    });
  });

  commitGroups.sort(groupsSort);

  return commitGroups;
}

function getNoteGroups(notes, noteGroups, noteGroupsSort, notesSort) {
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

  retGroups.sort(noteGroupsSort);
  _.forEach(retGroups, function(group) {
    group.notes.sort(notesSort);
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

function getExtraContext(commits, notes, options) {
  var context = {};

  // group `commits` by `options.groupBy`
  context.commitGroups = getCommitGroups(options.groupBy, commits, options.commitGroupsSort, options.commitsSort);

  // group `notes` for footer
  context.noteGroups = getNoteGroups(notes, options.noteGroups, options.noteGroupsSort, options.notesSort);

  return context;
}

module.exports = {
  compileTemplates: compileTemplates,
  functionify: functionify,
  getCommitGroups: getCommitGroups,
  getNoteGroups: getNoteGroups,
  processCommit: processCommit,
  getExtraContext: getExtraContext
};
