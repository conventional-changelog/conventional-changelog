'use strict';
var dateFormat = require('dateformat');
var join = require('path').join;
var readFileSync = require('fs').readFileSync;
var semverValid = require('semver').valid;
var through = require('through2');
var util = require('./lib/util');
var _ = require('lodash');

function conventionalChangelogWriter(context, options) {
  var savedKeyCommit;
  var commits = [];

  context = _.extend({
    commit: 'commits',
    issue: 'issues',
    date: dateFormat(new Date(), 'yyyy-mm-dd', true)
  }, context);

  if (!_.isBoolean(context.linkReferences) && context.repository && context.commit && context.issue) {
    context.linkReferences = true;
  }

  options = _.assign({
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: 'header',
    noteGroupsSort: 'title',
    notesSort: 'text',
    generateOn: function(commit) {
      return semverValid(commit.version);
    },
    finalizeContext: function(context) {
      return context;
    },
    reverse: false,
    includeDetails: false,
    ignoreReverted: true,
    mainTemplate: readFileSync(join(__dirname, 'templates/template.hbs'), 'utf-8'),
    headerPartial: readFileSync(join(__dirname, 'templates/header.hbs'), 'utf-8'),
    commitPartial: readFileSync(join(__dirname, 'templates/commit.hbs'), 'utf-8'),
    footerPartial: readFileSync(join(__dirname, 'templates/footer.hbs'), 'utf-8')
  }, options);

  if (!_.isFunction(options.transform) && _.isObject(options.transform) || _.isUndefined(options.transform)) {
    options.transform = _.assign({
      hash: function(hash) {
        if (_.isString(hash)) {
          return hash.substring(0, 7);
        }
      },
      header: function(header) {
        return header.substring(0, 100);
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
  if (_.isString(generateOn)) {
    generateOn = function(chunk) {
      return !_.isUndefined(chunk[options.generateOn]);
    };
  } else if (!_.isFunction(generateOn)) {
    generateOn = function() {
      return false;
    };
  }

  options.commitGroupsSort = util.functionify(options.commitGroupsSort);
  options.commitsSort = util.functionify(options.commitsSort);
  options.noteGroupsSort = util.functionify(options.noteGroupsSort);
  options.notesSort = util.functionify(options.notesSort);

  return through.obj(function(chunk, enc, cb) {
    try {
      var result;
      var commit = util.processCommit(chunk, options.transform);
      var keyCommit = commit || chunk;

      // previous blocks of logs
      if (options.reverse) {
        if (commit) {
          commits.push(commit);
        }

        if (generateOn(keyCommit)) {
          result = util.generate(options, commits, context, keyCommit);
          if (options.includeDetails) {
            this.push({
              log: result,
              keyCommit: keyCommit
            });
          } else {
            this.push(result);
          }

          commits = [];
        }
      } else {
        if (generateOn(keyCommit)) {
          result = util.generate(options, commits, context, savedKeyCommit);
          if (options.includeDetails) {
            this.push({
              log: result,
              keyCommit: savedKeyCommit
            });
          } else {
            this.push(result);
          }

          commits = [];
          savedKeyCommit = keyCommit;
        }

        if (commit) {
          commits.push(commit);
        }
      }

      cb();
    } catch (err) {
      cb(err);
    }
  }, function(cb) {
    try {
      var result;
      var keyCommit;

      // latest (this) block of logs
      if (!options.reverse) {
        keyCommit = savedKeyCommit;
      }

      result = util.generate(options, commits, context, savedKeyCommit);

      if (options.includeDetails) {
        this.push({
          log: result,
          keyCommit: savedKeyCommit
        });
      } else {
        this.push(result);
      }

      cb();
    } catch (err) {
      cb(err);
    }
  });
}

module.exports = conventionalChangelogWriter;
