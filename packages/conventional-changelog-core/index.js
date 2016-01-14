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
  var configPromise;
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
      if (_.isString(commit.gitTags)) {
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

  if (options.config) {
    if (_.isFunction(options.config)) {
      configPromise = Q.nfcall(options.config);
    } else {
      configPromise = Q(options.config); // jshint ignore:line
    }
  }

  if (options.pkg) {
    if (options.pkg.path) {
      pkgPromise = Q(readPkg(options.pkg.path)); // jshint ignore:line
    } else {
      pkgPromise = Q(readPkgUp()); // jshint ignore:line
    }
  }

  // todo: if `context.gitSemverTags` already exists, resolve it straight away.
  semverTagsPromise = Q.nfcall(gitSemverTags);

  Q.allSettled([configPromise, pkgPromise, semverTagsPromise])
    .spread(function(configObj, pkgObj, tagsObj) {
      var config;
      var pkg;
      var tag;
      var repo;

      var hostOpts;

      if (configPromise) {
        if (configObj.state === 'fulfilled') {
          config = configObj.value;
        } else {
          options.warn('Error in config' + configObj.reason.toString());
          config = {};
        }
      } else {
        config = {};
      }

      context = _.assign(context, config.context);

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
        config.gitRawCommitsOpts,
        gitRawCommitsOpts
      );

      if (options.append) {
        gitRawCommitsOpts.reverse = gitRawCommitsOpts.reverse || true;
      }

      parserOpts = _.assign(
        {}, config.parserOpts, {
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

            if (!_.isBoolean(context.linkCompare) && context.previousTag && context.currentTag) {
              context.linkCompare = true;
            }

            return context;
          }
        },
        config.writerOpts, {
          reverse: options.append
        },
        writerOpts
      );

      gitRawCommits(gitRawCommitsOpts)
        .on('error', function(err) {
          err.message = 'Error in git-raw-commits: ' + err.message;
          setImmediate(readable.emit.bind(readable), 'error', err);
        })
        .pipe(conventionalCommitsParser(parserOpts))
        .on('error', function(err) {
          err.message = 'Error in conventional-commits-parser: ' + err.message;
          setImmediate(readable.emit.bind(readable), 'error', err);
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
          setImmediate(readable.emit.bind(readable), 'error', err);
        })
        .pipe(conventionalChangelogWriter(context, writerOpts))
        .on('error', function(err) {
          err.message = 'Error in conventional-changelog-writer: ' + err.message;
          setImmediate(readable.emit.bind(readable), 'error', err);
        })
        .pipe(through({
          objectMode: writerOpts.includeDetails
        }, function(chunk, enc, cb) {
          try {
            readable.push(chunk);
          } catch (err) {
            setImmediate(function() {
              throw err;
            });
          }

          cb();
        }, function(cb) {
          readable.push(null);

          cb();
        }));
    })
    .catch(function(err) {
      readable.emit('error', err);
    });

  return readable;
}

module.exports = conventionalChangelog;
