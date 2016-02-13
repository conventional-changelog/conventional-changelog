'use strict';
var addStream = require('add-stream');
var assign = require('object-assign');
var concat = require('concat-stream');
var conventionalChangelog = require('conventional-changelog');
var gutil = require('gulp-util');
var through = require('through2');

module.exports = function(opts, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  opts = assign({
    // TODO: remove this when gulp get's a real logger with levels
    verbose: process.argv.indexOf('--verbose') !== -1
  }, opts);

  if (opts.verbose) {
    opts.debug = gutil.log;
  }

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    var stream = conventionalChangelog(opts, context, gitRawCommitsOpts, parserOpts, writerOpts)
      .on('error', function(err) {
        cb(new gutil.PluginError('gulp-conventional-changelog', err));
      });

    if (file.isStream()) {
      if (opts.releaseCount === 0) {
        file.contents = stream;
      } else if (opts.append) {
        file.contents = file.contents
          .pipe(addStream(stream));
      } else {
        file.contents = stream
          .pipe(addStream(file.contents));
      }

      cb(null, file);
      return;
    }

    stream
      .pipe(concat({
        encoding: 'buffer'
      }, function(data) {
        if (opts.releaseCount === 0) {
          file.contents = data;
        } else if (opts.append) {
          file.contents = Buffer.concat([file.contents, data]);
        } else {
          file.contents = Buffer.concat([data, file.contents]);
        }

        cb(null, file);
      }));
  });
};
