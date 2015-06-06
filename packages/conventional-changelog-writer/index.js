'use strict';
var compareFunc = require('compare-func');
var dateFormat = require('dateformat');
var join = require('path').join;
var readFileSync = require('fs').readFileSync;
var semverValid = require('semver').valid;
var through = require('through2');
var util = require('./lib/util');
var _ = require('lodash');

function conventionalcommitsWriter(context, options) {
  var commits = [];
  var notes = [];

  context = _.extend({
    commit: 'commits',
    issue: 'issues',
    date: dateFormat(new Date(), 'yyyy-mm-dd', true)
  }, context);

  var host = context.host;

  if (host && context.repository && context.commit && context.issue) {
    context.linkReferences = context.linkReferences || true;
  }

  options = _.merge({
    transform: {
      hash: function(hash) {
        if (typeof hash === 'string') {
          return hash.substring(0, 7);
        }
      },
      header: function(header) {
        return header.substring(0, 100);
      },
      version: function(version) {
        if (typeof version === 'string') {
          return version.replace(/^[v=]/i, '');
        }
      },
      authorDate: function(date) {
        if (!date) {
          return;
        }

        return dateFormat(date, 'yyyy-mm-dd', true);
      }
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: 'header',
    noteGroupsSort: 'title',
    notesSort: compareFunc(),
    generateOn: function(commit) {
      return semverValid(commit.version);
    },
    reverse: true,
    mainTemplate: readFileSync(join(__dirname, 'templates/template.hbs'), 'utf-8'),
    headerPartial: readFileSync(join(__dirname, 'templates/header.hbs'), 'utf-8'),
    commitPartial: readFileSync(join(__dirname, 'templates/commit.hbs'), 'utf-8'),
    footerPartial: readFileSync(join(__dirname, 'templates/footer.hbs'), 'utf-8')
  }, options);

  var generateOn = options.generateOn;
  if (typeof generateOn === 'string') {
    generateOn = function(chunk) {
      return chunk[options.generateOn];
    };
  }

  options.commitGroupsSort = util.functionify(options.commitGroupsSort);
  options.commitsSort = util.functionify(options.commitsSort);
  options.noteGroupsSort = util.functionify(options.noteGroupsSort);
  options.notesSort = util.functionify(options.notesSort);

  return through.obj(function(chunk, enc, cb) {
    var commit = util.processCommit(chunk, options.transform);

    if (commit && !options.reverse) {
      commits.push(commit);
      notes = notes.concat(commit.notes);
    }

    // previous blocks of logs
    if (generateOn(commit)) {
      this.push(util.generate(options, commits, notes, context));
    }

    if (commit && options.reverse) {
      commits.push(commit);
      notes = notes.concat(commit.notes);
    }

    cb();
  }, function(cb) {
    // latest (this) block of logs
    this.push(util.generate(options, commits, notes, context));

    cb();
  });
}

module.exports = conventionalcommitsWriter;
