'use strict';
var conventionalCommitsParser = require('conventional-commits-parser');
var conventionalChangelogWriter = require('conventional-changelog-writer');
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

function conventinalChangelog(options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  var presetPromise;
  var pkgPromise;
  var semverPromise;

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
    versionRange: {
      start: -1,
      count: 1
    },
    warn: function() {},
  }, options);

  options.pkg = options.pkg || {};
  var loadPreset = options.preset;
  var loadPkg = (!context.host || !context.repository || !context.version) && options.pkg.path;
  var loadSemver = (!gitRawCommitsOpts.from || !gitRawCommitsOpts.to) && options.versionRange.start !== 0;

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

  if (loadSemver) {
    semverPromise = Q.nfcall(gitSemverTags);
  }

  Q.allSettled([presetPromise, pkgPromise, semverPromise])
    .spread(function(presetObj, pkgObj, tagObj) {
      var preset;
      var pkg;
      var tags;
      var repo;

      var from;
      var to;

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

      if (loadSemver && tagObj.state === 'fulfilled') {
        tags = tagObj.value;
        var start = options.versionRange.start;
        var end;
        var length = tags.length;
        var count = options.versionRange.count;

        tags.reverse();

        if (start > 0) {
          if (start > length + 1) {
            start = length + 1;
            options.warn('Start is too big. Genrating from the last version');
          }
        } else {
          start = length + start + 2;
          if (start < 1) {
            start = 1;
            options.warn('Start is too small. Genrating from the first commit');
          }
        }

        from = tags[start - 2];

        if (count < 0) {
          count = 1;
          options.warn('Count is too small. Genrating 1 version');
        }

        end = start + count;

        if (end > length + 2) {
          end = length + 2;
          options.warn('Count is too big. Genrating to the last version');
        }

        to = tags[end - 2];
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
          from: from,
          to: to
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
