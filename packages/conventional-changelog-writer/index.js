'use strict';
var compareFunc = require('compare-func');
var dateFormat = require('dateformat');
var fs = require('fs');
var semver = require('semver');
var through = require('through2');
var util = require('./lib/util');
var _ = require('lodash');

function conventionalcommitsWriter(version, context, options) {
  if (!version) {
    throw new TypeError('Expected a version number');
  }

  var stream;
  var commits = [];
  var notes = [];
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
    maxSubjectLength: 80,
    map: {
      type: {
        fix: 'Bug Fixes',
        feat: 'Features',
        perf: 'Performance Improvements'
      }
    },
    noteGroups: {
      'BREAKING CHANGE': 'BREAKING CHANGES'
    },
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc(),
    mainTemplate: fs.readFileSync(__dirname + '/templates/template.hbs', 'utf-8'),
    headerPartial: fs.readFileSync(__dirname + '/templates/header.hbs', 'utf-8'),
    commitPartial: fs.readFileSync(__dirname + '/templates/commit.hbs', 'utf-8'),
    footerPartial: fs.readFileSync(__dirname + '/templates/footer.hbs', 'utf-8')
  }, options);

  options.commitGroupsSort = util.functionify(options.commitGroupsSort);
  options.commitsSort = util.functionify(options.commitsSort);
  options.noteGroupsSort = util.functionify(options.noteGroupsSort);
  options.notesSort = util.functionify(options.notesSort);

  stream = through.obj(function(chunk, enc, cb) {
    var commit = util.processCommit(chunk, options.hashLength, options.maxSubjectLength, options.map);

    commits.push(commit);
    notes = notes.concat(commit.notes);

    cb();
  }, function(cb) {
    var compiled = util.compileTemplates(options);

    context = _.merge(context, util.getExtraContext(commits, notes, options));

    this.push(compiled(context));
    cb();
  });

  return stream;
}

module.exports = conventionalcommitsWriter;
