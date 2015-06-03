'use strict';
var compareFunc = require('compare-func');
var dateFormat = require('dateformat');
var fs = require('fs');
var through = require('through2');
var util = require('./lib/util');
var _ = require('lodash');

function conventionalcommitsWriter(context, options) {
  var commits = [];
  var notes = [];
  var generated = false;

  context = _.extend({
    title: '',
    commit: 'commits',
    issue: 'issues',
    date: dateFormat(new Date(), 'yyyy-mm-dd', true)
  }, context);

  var host = context.host;

  if (host && context.repository && context.commit && context.issue) {
    context.linkReferences = context.linkReferences || true;
  }

  if (host && host[host.length - 1] === '/') {
    context.host = host.slice(0, -1);
  }

  options = _.extend({
    transform: {
      hash: function(hash) {
        if (typeof hash === 'string') {
          return hash.substring(0, 7);
        }
      },
      subject: function(subject) {
        if (typeof subject === 'string') {
          return subject.substring(0, 80);
        }
      },
      type: function(type) {
        if (type === 'fix') {
          return 'Bug Fixes';
        } else if (type === 'feat') {
          return 'Features';
        } else if (type === 'perf') {
          return 'Performance Improvements';
        }
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
    noteGroups: {
      'BREAKING CHANGE': 'BREAKING CHANGES'
    },
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc(),
    generateOn: 'version',
    mainTemplate: fs.readFileSync(__dirname + '/templates/template.hbs', 'utf-8'),
    headerPartial: fs.readFileSync(__dirname + '/templates/header.hbs', 'utf-8'),
    commitPartial: fs.readFileSync(__dirname + '/templates/commit.hbs', 'utf-8'),
    footerPartial: fs.readFileSync(__dirname + '/templates/footer.hbs', 'utf-8')
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

    commits.push(commit);
    notes = notes.concat(commit.notes);

    if (generateOn(chunk)) {
      this.push(util.generate(options, commits, notes, context));
      generated = true;
    }

    cb();
  }, function(cb) {
    if (!generated || commits.length > 0) {
      this.push(util.generate(options, commits, notes, context));
    }

    cb();
  });
}

module.exports = conventionalcommitsWriter;
