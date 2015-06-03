'use strict';
var compareFunc = require('compare-func');
var dotProp = require('dot-prop');
var Handlebars = require('handlebars');
var semver = require('semver');
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

function processCommit(chunk, transform) {
  var commit;

  try {
    commit = JSON.parse(chunk);
  } catch (e) {
    commit = _.cloneDeep(chunk);
  }

  if (_.isFunction(transform)) {
    return transform(commit);
  }

  _.forEach(transform, function(el, path) {
    var value = dotProp.get(commit, path);

    if (typeof el === 'function') {
      value = el(value, path);
    } else {
      value = el;
    }

    dotProp.set(commit, path, value);
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

function generate(options, commits, notes, context) {
  var lastCommit = commits[commits.length - 1];

  var compiled = compileTemplates(options);

  var mergedContext = _.merge({}, context, getExtraContext(commits, notes, options));

  if (commits.length > 0 && lastCommit.version) {
    mergedContext.version = lastCommit.version;
    mergedContext.date = lastCommit.authorDate || context.date;
  }

  if (mergedContext.version) {
    mergedContext.isPatch = context.isPatch || semver.patch(mergedContext.version) !== 0;
  }

  commits.length = 0;
  notes.length = 0;

  return compiled(mergedContext);
}

module.exports = {
  compileTemplates: compileTemplates,
  functionify: functionify,
  getCommitGroups: getCommitGroups,
  getNoteGroups: getNoteGroups,
  processCommit: processCommit,
  getExtraContext: getExtraContext,
  generate: generate
};
