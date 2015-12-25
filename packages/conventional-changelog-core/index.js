'use strict';
var conventionalCommitsParser = require('conventional-commits-parser');
var conventionalChangelogWriter = require('conventional-changelog-writer');
var dateFormat = require('dateformat');
var getPkgRepo = require('get-pkg-repo');
var gitRawCommits = require('git-raw-commits');
var gitSemverTags = require('git-semver-tags');
var Q = require('q');
var readPkg = require('read-pkg');
var readPkgUp = require('read-pkg-up');
var stream = require('stream');
var through = require('through2');
var url = require('url');
var _ = require('lodash');

var rhosts = /github|bitbucket|gitlab/i;
var rtag = /tag:\s*[v=]?(.+?)[,\)]/gi;

function conventionalChangelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
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
      transform: function(pkg) {
        return pkg;
      }
    },
    append: false,
    releaseCount: 1,
    warn: function() {},
    transform: function(commit, cb) {
      if (typeof commit.gitTags === 'string') {
        var match = rtag.exec(commit.gitTags);
        rtag.lastIndex = 0;

        if (match) {
          commit.version = match[1];
        }
      }

      if (commit.committerDate) {
        commit.committerDate = dateFormat(commit.committerDate, 'yyyy-mm-dd', true);
      }

      cb(null, commit);
    }
  }, options);

  var loadPreset = options.preset;

  if (loadPreset) {
    try {
      var presetFn = require('./presets/' + options.preset);
      presetPromise = Q.nfcall(presetFn);
    } catch (err) {
      loadPreset = false;
      options.warn('Preset: "' + options.preset + '" does not exist');
    }
  }

  if (options.pkg) {
    if (options.pkg.path) {
      pkgPromise = Q(readPkg(options.pkg.path)); // jshint ignore:line
    } else {
      pkgPromise = Q(readPkgUp()); // jshint ignore:line
    }
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

      if (options.pkg) {
        if (pkgObj.state === 'fulfilled') {
          if (options.pkg.path) {
            pkg = pkgObj.value;
          } else {
            pkg = pkgObj.value.pkg || {};
          }

          pkg = options.pkg.transform(pkg);
          context.version = context.version || pkg.version;
          context.packageData = pkg;

          try {
            repo = getPkgRepo(pkg);
          } catch (err) {
            repo = {};
          }

          if (repo.browse) {
            var browse = repo.browse();
            var parsedBrowse = url.parse(browse);
            context.host = context.host || (repo.domain ? (parsedBrowse.protocol + (parsedBrowse.slashes ? '//' : '') + repo.domain) : null);
            context.owner = context.owner || repo.user || '';
            context.repository = context.repository || repo.project || browse;
          }
        } else if (options.pkg.path) {
          options.warn(pkgObj.reason.toString());
        }
      }

      var gitSemverTags = context.gitSemverTags = tagsObj.value;
      if (tagsObj.state === 'fulfilled') {
        tag = tagsObj.value[options.releaseCount - 1];
      }

      if (context.host && (!context.issue || !context.commit || !parserOpts || !parserOpts.referenceActions)) {
        var type;

        if (context.host) {
          var match = context.host.match(rhosts);
          if (match) {
            type = match[0];
          }
        } else if (repo && repo.type) {
          type = repo.type;
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
        preset.gitRawCommitsOpts,
        gitRawCommitsOpts
      );

      if (options.append) {
        gitRawCommitsOpts.reverse = gitRawCommitsOpts.reverse || true;
      }

      parserOpts = _.assign(
        {}, preset.parserOpts, {
          warn: options.warn
        },
        parserOpts);

      if (hostOpts.referenceActions && parserOpts) {
        parserOpts.referenceActions = hostOpts.referenceActions;
      }

      if (hostOpts.issuePrefixes && parserOpts) {
        parserOpts.issuePrefixes = hostOpts.issuePrefixes;
      }

      writerOpts = _.assign({
          finalizeContext: function(context, writerOpts, commits, keyCommit) {
            if ((!context.currentTag || !context.previousTag) && keyCommit) {
              var match = /tag:\s*(.+?)[,\)]/gi.exec(keyCommit.gitTags);
              var currentTag = context.currentTag = context.currentTag || match ? match[1] : null;
              var index = gitSemverTags.indexOf(currentTag);
              var previousTag = context.previousTag = gitSemverTags[index + 1];

              if (!previousTag) {
                if (options.append) {
                  context.previousTag = context.previousTag || commits[0] ? commits[0].hash : null;
                } else {
                  context.previousTag = context.previousTag || commits[commits.length - 1] ? commits[commits.length - 1].hash : null;
                }
              }
            } else {
              context.previousTag = context.previousTag || gitSemverTags[0];
              context.currentTag = context.currentTag || 'v' + context.version;
            }

            if (typeof context.linkCompare !== 'boolean' && context.previousTag && context.currentTag) {
              context.linkCompare = true;
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
          err.message = 'Error in git-raw-commits: ' + err.message;
          readable.emit('error', err);
        })
        .pipe(conventionalCommitsParser(parserOpts))
        .on('error', function(err) {
          err.message = 'Error in conventional-commits-parser: ' + err.message;
          readable.emit('error', err);
        })
        // it would be better to if `gitRawCommits` could spit out better formatted data
        // so we don't need to transform here
        .pipe(through.obj(function(chunk, enc, cb) {
          try {
            options.transform.call(this, chunk, cb);
          } catch (err) {
            cb(err);
          }
        }))
        .on('error', function(err) {
          err.message = 'Error in options.transform: ' + err.message;
          readable.emit('error', err);
        })
        .pipe(conventionalChangelogWriter(context, writerOpts))
        .on('error', function(err) {
          err.message = 'Error in conventional-changelog-writer: ' + err.message;
          readable.emit('error', err);
        })
        .pipe(through({
          objectMode: writerOpts.includeDetails
        }, function(chunk, enc, cb) {
          readable.push(chunk);

          cb();
        }, function(cb) {
          readable.push(null);

          cb();
        }));
    })
    .catch(function(err) {
      setImmediate(readable.emit.bind(readable), 'error', err);
    });

  return readable;
}

module.exports = conventionalChangelog;
