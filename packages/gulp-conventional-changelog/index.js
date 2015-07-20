'use strict';
var addStream = require('add-stream');
var concat = require('concat-stream');
var conventionalChangelog = require('conventional-changelog');
var gutil = require('gulp-util');
var through = require('through2');

module.exports = function(opts, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  opts = opts || {};
  opts.warn = gutil.log;

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    var stream = conventionalChangelog(opts, context, gitRawCommitsOpts, parserOpts, writerOpts);

    if (file.isStream()) {
      if (opts.allBlocks) {
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
      .pipe(concat(function(data) {
        if (opts.allBlocks) {
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
