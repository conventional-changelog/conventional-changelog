'use strict';
var dateFormat = require('dateformat');
var fs = require('fs');
var semver = require('semver');
var through = require('through2');
var util = require('./lib/util');
var _ = require('lodash');

function conventionalCommitsTemplate(version, context, options) {
  if (!version) {
    throw new TypeError('Expected a version number');
  }

  var stream;
  var commits = [];
  var allNotes = [];
  var isPatch = semver.patch(version) !== 0;

  context = _.extend({
    version: version,
    title: '',
    isPatch: isPatch,
    commit: 'commits',
    issue: 'issues',
    date: dateFormat(new Date(), 'yyyy-mm-dd', true)
  }, context);

  if (context.host && context.repository && context.commit && context.issue) {
    context.linkReferences = context.linkReferences || true;
  }

  options = _.extend({
    groupBy: 'type',
    hashLength: 7,
    replacements: {
      type: {
        fix: 'Bug Fixes',
        feat: 'Features',
        perf: 'Performance Improvements'
      }
    },
    noteGroups: {
      'BREAKING CHANGE': 'BREAKING CHANGES'
    },
    commitGroupsCompareFn: util.getCompareFunction('name'),
    commitsCompareFn: util.getCompareFunction('scope'),
    noteGroupsCompareFn: util.getCompareFunction('name'),
    notesCompareFn: util.getCompareFunction(),
    mainTemplate: fs.readFileSync(__dirname + '/templates/template.hbs', 'utf-8'),
    headerPartial: fs.readFileSync(__dirname + '/templates/header.hbs', 'utf-8'),
    commitPartial: fs.readFileSync(__dirname + '/templates/commit.hbs', 'utf-8'),
    footerPartial: fs.readFileSync(__dirname + '/templates/footer.hbs', 'utf-8')
  }, options);

  stream = through.obj(function(chunk, enc, cb) {
    var commit = util.processCommit(chunk, options.hashLength, options.replacements);

    commits.push(commit);
    allNotes.push(commit.notes);
    cb();
  }, function(cb) {
    var compiled = util.compileTemplates(options);
    context = _.merge(context, util.getExtraContext(commits, allNotes, options));
    this.push(compiled(context));
    cb();
  });

  return stream;
}

module.exports = conventionalCommitsTemplate;
