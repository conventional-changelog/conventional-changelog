'use strict';
var conventionalCommitsParser = require('conventional-commits-parser');
var conventionalChangelogWriter = require('conventional-changelog-writer');
var dateFormat = require('dateformat');
var fs = require('fs');
var getPkgRepo = require('get-pkg-repo');
var gitRawCommits = require('git-raw-commits');
var gitSemverTags = require('git-semver-tags');
var Q = require('q');
var stream = require('stream');
var through = require('through2');
var url = require('url');
var _ = require('lodash');

var rhosts = /github|bitbucket/i;
var rtag = /tag:\s*[v=]?(.+?)[,\)]/gi;

function conventinalChangelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  var presetPromise;
  var pkgPromise;
  var semverTagsPromise;

  writerOpts = writerOpts || {};

  var readable = new stream.Readable({
    objectMode: writerOpts.includeDetails
  });
  readable._read = function() {};

  context = context || {};
  gitRawCommitsOpts = gitRawCommitsOpts || {};

  options = _.merge({
    pkg: {
      path: 'package.json',
      transform: function(pkg) {
        return pkg;
      }
    },
    append: false,
    releaseCount: 1,
    warn: function() {},
    transform: through.obj(function(chunk, enc, cb) {
      if (typeof chunk.gitTags === 'string') {
        var match = rtag.exec(chunk.gitTags);
        rtag.lastIndex = 0;

        if (match) {
          chunk.version = match[1];
        }
      }

      if (chunk.committerDate) {
        chunk.committerDate = dateFormat(chunk.committerDate, 'yyyy-mm-dd', true);
      }

      cb(null, chunk);
    })
  }, options);

  options.pkg = options.pkg || {};
  var loadPreset = options.preset;
  var loadPkg = (!context.host || !context.repository || !context.version) && options.pkg.path;

  if (loadPreset) {
    try {
      var presetFn = require('./presets/' + options.preset);
      presetPromise = Q.nfcall(presetFn);
    } catch (err) {
      options.warn('Preset: "' + options.preset + '" does not exist');
    }
  }

  if (loadPkg) {
    pkgPromise = Q.nfcall(fs.readFile, options.pkg.path, 'utf8');
  }

  semverTagsPromise = Q.nfcall(gitSemverTags);

  Q.allSettled([presetPromise, pkgPromise, semverTagsPromise])
    .spread(function(presetObj, pkgObj, tagsObj) {
      var preset;
      var pkg;
      var tag;
      var repo;

      var hostOpts;

      if (loadPreset) {
        if (presetObj.state === 'fulfilled') {
          preset = presetObj.value;
        } else {
          options.warn('Internal error in preset: "' + options.preset + '"');
          preset = {};
        }
      } else {
        preset = {};
      }

      if (loadPkg) {
        if (pkgObj.state === 'fulfilled') {
          pkg = pkgObj.value;
          try {
            pkg = JSON.parse(pkg);
            pkg = options.pkg.transform(pkg);
            context.version = context.version || pkg.version;

            repo = getPkgRepo(pkg);

            if (repo.type) {
              var browse = repo.browse();
              var parsedBrowse = url.parse(browse);
              context.host = context.host || parsedBrowse.protocol + (parsedBrowse.slashes ? '//' : '') + repo.domain;
              context.owner = context.owner || repo.user;
              context.repository = context.repository || repo.project;
            }
          } catch (err) {
            options.warn('package.json: "' + options.pkg.path + '" cannot be parsed');
          }
        } else {
          options.warn('package.json: "' + options.pkg.path + '" does not exist');
        }
      }

      var gitSemverTags = context.gitSemverTags = tagsObj.value;
      if (tagsObj.state === 'fulfilled') {
        tag = tagsObj.value[options.releaseCount - 1];
      }

      if (context.host && (!context.issue || !context.commit || !parserOpts || !parserOpts.referenceActions)) {
        var type;

        if (repo && repo.type) {
          type = repo.type;
        } else {
          var match = context.host.match(rhosts);
          if (match) {
            type = match[0];
          }
        }

        if (type) {
          hostOpts = require('./hosts/' + type);

          context = _.assign({
            issue: hostOpts.issue,
            commit: hostOpts.commit
          }, context);
        } else {
          options.warn('Host: "' + context.host + '" does not exist');
          hostOpts = {};
        }
      } else {
        hostOpts = {};
      }

      gitRawCommitsOpts = _.assign({
          format: '%B%n-hash-%n%H%n-gitTags-%n%d%n-committerDate-%n%ci',
          from: tag
        },
        gitRawCommitsOpts
      );

      if (options.append) {
        gitRawCommitsOpts.reverse = gitRawCommitsOpts.reverse || true;
      }

      parserOpts = _.assign({
          referenceActions: hostOpts.referenceActions,
          issuePrefixes: hostOpts.issuePrefixes
        },
        preset.parserOpts, {
          warn: options.warn
        },
        parserOpts);

      writerOpts = _.assign({
          finalizeContext: function(context, writerOpts, commits, keyCommit) {
            if ((!context.currentTag || !context.previousTag) && keyCommit) {
              var match = /tag:\s*(.+?)[,\)]/gi.exec(keyCommit.gitTags);
              var currentTag = context.currentTag = context.currentTag || match ? match[1] : null;
              var index = gitSemverTags.indexOf(currentTag);
              var previousTag = context.previousTag = gitSemverTags[index + 1];

              if (!previousTag) {
                if (options.append) {
                  context.previousTag = context.previousTag || commits[0].hash;
                } else {
                  context.previousTag = context.previousTag || commits[commits.length - 1].hash;
                }
              }
            } else {
              context.previousTag = context.previousTag || gitSemverTags[0];
              context.currentTag = context.currentTag || 'v' + context.version;
            }

            return context;
          }
        },
        preset.writerOpts, {
          reverse: options.append
        },
        writerOpts
      );

      gitRawCommits(gitRawCommitsOpts)
        .on('error', function(err) {
          readable.emit('error', 'Error in git-raw-commits. ' + err);
        })
        .pipe(conventionalCommitsParser(parserOpts))
        .on('error', function(err) {
          readable.emit('error', 'Error in conventional-commits-parser. ' + err);
        })
        // it would be better to if `gitRawCommits` could spit out better formatted data
        // so we don't need to transform here
        .pipe(options.transform)
        .pipe(conventionalChangelogWriter(context, writerOpts))
        .pipe(through({
          objectMode: writerOpts.includeDetails
        }, function(chunk, enc, cb) {
          readable.push(chunk);

          cb();
        }, function(cb) {
          readable.push(null);

          cb();
        }));
    });

  return readable;
}

module.exports = conventinalChangelog;
