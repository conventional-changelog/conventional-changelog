'use strict';
var compareFunc = require('compare-func');
var gufg = require('github-url-from-git');
var Q = require('q');
var readFile = Q.denodeify(require('fs').readFile);
var resolve = require('path').resolve;

var parserOpts = {
  headerPattern: /^(\w*)(?:\((.*)\))?\: (.*)$/,
  headerCorrespondence: [
    'type',
    'scope',
    'subject'
  ],
  noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash']
};

function issueUrl(context) {
  var pkg = context.packageData;

  if (pkg && pkg.repository && pkg.repository.url && ~pkg.repository.url.indexOf('github.com')) {
    var gitUrl = gufg(pkg.repository.url);

    if (gitUrl) {
      return gitUrl + '/issues/';
    }
  }
}

var writerOpts = {
  transform: function(commit, context) {
    var discard = true;
    var issues = [];

    commit.notes.forEach(function(note) {
      note.title = 'BREAKING CHANGES';
      discard = false;
    });

    if (commit.type === 'feat') {
      commit.type = 'Features';
    } else if (commit.type === 'fix') {
      commit.type = 'Bug Fixes';
    } else if (commit.type === 'perf') {
      commit.type = 'Performance Improvements';
    } else if (commit.type === 'revert') {
      commit.type = 'Reverts';
    } else if (discard) {
      return;
    } else if (commit.type === 'docs') {
      commit.type = 'Documentation';
    } else if (commit.type === 'style') {
      commit.type = 'Styles';
    } else if (commit.type === 'refactor') {
      commit.type = 'Code Refactoring';
    } else if (commit.type === 'test') {
      commit.type = 'Tests';
    } else if (commit.type === 'chore') {
      commit.type = 'Chores';
    }

    if (commit.scope === '*') {
      commit.scope = '';
    }

    if (typeof commit.hash === 'string') {
      commit.hash = commit.hash.substring(0, 7);
    }

    if (typeof commit.subject === 'string') {
      var url = issueUrl(context);
      if (url) {
        // GitHub issue URLs.
        commit.subject = commit.subject.replace(/#([0-9]+)/g, function(_, issue) {
          issues.push(issue);
          return '[#' + issue + '](' + url + issue + ')';
        });
      }
      // GitHub user URLs.
      commit.subject = commit.subject.replace(/@([a-zA-Z0-9_]+)/g, '[@$1](https://github.com/$1)');
      commit.subject = commit.subject;
    }

    // remove references that already appear in the subject
    commit.references = commit.references.filter(function(reference) {
      if (issues.indexOf(reference.issue) === -1) {
        return true;
      }

      return false;
    });

    return commit;
  },
  groupBy: 'type',
  commitGroupsSort: 'title',
  commitsSort: ['scope', 'subject'],
  noteGroupsSort: 'title',
  notesSort: compareFunc
};

module.exports = Q.all([
  readFile(resolve(__dirname, 'templates/template.hbs'), 'utf-8'),
  readFile(resolve(__dirname, 'templates/header.hbs'), 'utf-8'),
  readFile(resolve(__dirname, 'templates/commit.hbs'), 'utf-8'),
  readFile(resolve(__dirname, 'templates/footer.hbs'), 'utf-8')
])
  .spread(function(template, header, commit, footer) {

    writerOpts.mainTemplate = template;
    writerOpts.headerPartial = header;
    writerOpts.commitPartial = commit;
    writerOpts.footerPartial = footer;

    return {
      parserOpts: parserOpts,
      writerOpts: writerOpts
    };
  });
