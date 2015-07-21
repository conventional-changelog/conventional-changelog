'use strict';
var conventionalCommitsParser = require('conventional-commits-parser');
var conventionalChangelogWriter = require('conventional-changelog-writer');
var fs = require('fs');
var getPkgRepo = require('get-pkg-repo');
var gitLatestSemverTag = require('git-latest-semver-tag');
var gitRawCommits = require('git-raw-commits');
var Q = require('q');
var stream = require('stream');
var through = require('through2');
var url = require('url');
var _ = require('lodash');

var rhosts = /github|bitbucket/i;

function conventinalChangelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  var presetPromise;
  var pkgPromise;
  var latestSemverPromise;

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
    allBlocks: false,
    warn: function() {},
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

  if (!options.allBlocks && !gitRawCommitsOpts.from) {
    latestSemverPromise = Q.nfcall(gitLatestSemverTag);
  }

  Q.allSettled([presetPromise, pkgPromise, latestSemverPromise])
    .spread(function(presetObj, pkgObj, tagObj) {
      var preset;
      var pkg;
      var tag;

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

            var repo = getPkgRepo(pkg);

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

      if (tagObj.state === 'fulfilled') {
        tag = tagObj.value;
      }

      if (context.host && (!context.issue || !context.commit || !parserOpts || !parserOpts.referenceActions)) {
        var match = context.host.match(rhosts);
        if (match) {
          hostOpts = require('./hosts/' + match[0]);

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

      writerOpts = _.assign(
        preset.writerOpts || {}, {
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
        .pipe(options.transform || preset.transform || through.obj())
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
