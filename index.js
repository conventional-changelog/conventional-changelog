'use strict';
var conventionalCommitsParser = require('conventional-commits-parser');
var conventionalcommitsWriter = require('conventional-commits-writer');
var fs = require('fs');
var getPkgRepo = require('get-pkg-repo');
var gitLatestSemverTag = require('git-latest-semver-tag');
var gitRawCommits = require('git-raw-commits');
var Q = require('q');
var stream = require('stream');
var through = require('through2');
var url = require('url');
var _ = require('lodash');

var rhosts = /github|butbucket/i;

function changelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  var presetPromise;
  var pkgPromise;
  var latestSemverPromise;

  var readable = new stream.Readable();
  readable._read = function() {};

  context = context || {};
  gitRawCommitsOpts = gitRawCommitsOpts || {};

  options = _.assign({
    pkg: 'package.json',
    append: false,
    allBlocks: false,
    warn: function() {},
    transform: through.obj()
  }, options);

  var loadPreset = options.preset;
  var loadPkg = (!context.host || !context.repository || !context.version) && options.pkg;

  if (loadPreset) {
    try {
      var presetFn = require('./presets/' + options.preset);
      presetPromise = Q.nfcall(presetFn);
    } catch (err) {
      options.warn('Preset: "' + options.preset + '" does not exist');
    }
  }

  if (loadPkg) {
    pkgPromise = Q.nfcall(fs.readFile, options.pkg, 'utf8');
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

            var repositoryUrl = url.parse(getPkgRepo(pkg));
            context.host = context.host || repositoryUrl.protocol + (repositoryUrl.slashes ? '//' : '') + repositoryUrl.host;
            context.version = context.version || pkg.version;
            context.repository = context.repository || repositoryUrl.pathname.replace('/', '');
          } catch (err) {
            options.warn('package.json: "' + options.pkg + '" cannot be parsed');
            pkg = {};
          }
        } else {
          options.warn('package.json: "' + options.pkg + '" does not exist');
          pkg = {};
        }
      } else {
        pkg = {};
      }

      if (tagObj.state === 'fulfilled') {
        tag = tagObj.value;
      }

      if (context.host && (!context.issue || !context.commit || !parserOpts || !parserOpts.referenceKeywords)) {
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

      parserOpts = _.assign(
        preset.parserOpts || {}, {
          referenceKeywords: hostOpts.referenceKeywords,
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
        .pipe(conventionalCommitsParser(parserOpts))
        // it would be better to if `gitRawCommits` could spit out better formatted data
        // so we don't need to transform here
        .pipe(preset.transform || options.transform)
        .pipe(conventionalcommitsWriter(context, writerOpts))
        .pipe(through(function(chunk, enc, cb) {
          readable.push(chunk);

          cb();
        }, function(cb) {
          readable.push(null);

          cb();
        }));
    });

  return readable;
}

module.exports = changelog;
