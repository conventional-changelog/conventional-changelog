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
  var savedKeyCommit;
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

  options = _.assign({
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: 'header',
    noteGroupsSort: 'title',
    notesSort: compareFunc(),
    generateOn: function(commit) {
      return semverValid(commit.version);
    },
    reverse: false,
    mainTemplate: readFileSync(join(__dirname, 'templates/template.hbs'), 'utf-8'),
    headerPartial: readFileSync(join(__dirname, 'templates/header.hbs'), 'utf-8'),
    commitPartial: readFileSync(join(__dirname, 'templates/commit.hbs'), 'utf-8'),
    footerPartial: readFileSync(join(__dirname, 'templates/footer.hbs'), 'utf-8')
  }, options);

  if (!_.isFunction(options.transform) && _.isObject(options.transform) || _.isUndefined(options.transform)) {
    options.transform = _.assign({
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
      committerDate: function(date) {
        if (!date) {
          return;
        }

        return dateFormat(date, 'yyyy-mm-dd', true);
      }
    }, options.transform);
  }

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
    var keyCommit = commit || chunk;

    // previous blocks of logs
    if (options.reverse) {
      if (commit) {
        commits.push(commit);
        notes = notes.concat(commit.notes);
      }

      if (generateOn(keyCommit)) {
        this.push(util.generate(options, commits, notes, context, keyCommit));
      }
    } else {
      if (generateOn(keyCommit)) {
        this.push(util.generate(options, commits, notes, context, savedKeyCommit));
        savedKeyCommit = keyCommit;
      }

      if (commit) {
        commits.push(commit);
        notes = notes.concat(commit.notes);
      }
    }

    cb();
  }, function(cb) {
    // latest (this) block of logs
    if (!options.reverse) {
      this.push(util.generate(options, commits, notes, context, savedKeyCommit));
    } else {
      this.push(util.generate(options, commits, notes, context));
    }

    cb();
  });
}

module.exports = conventionalcommitsWriter;
