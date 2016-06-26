'use strict';
var dargs = require('dargs');
var execFile = require('child_process').execFile;
var split = require('split2');
var stream = require('stream');
var template = require('lodash.template');
var through = require('through2');

function gitRawCommits(options) {
  var readable = new stream.Readable();
  readable._read = function() {};

  options = options || {};
  options.format = options.format || '%B';
  options.from = options.from || '';
  options.to = options.to || 'HEAD';

  var gitFormat = template('--format=<%= format %>%n' +
    '------------------------ >8 ------------------------'
  )(options);
  var gitFromTo = template('<%- from ? [from, to].join("..") : to %>')(options);

  var args = dargs(options, {
    excludes: ['from', 'to', 'format']
  });

  args = [
    'log',
    gitFormat,
    gitFromTo
  ].concat(args);

  if (options.debug) {
    options.debug('Your git-log command is:\ngit ' + args.join(' '));
  }

  var isError = false;

  var child = execFile('git', args, {
    maxBuffer: Infinity
  });

  child.stdout
    .pipe(split('------------------------ >8 ------------------------\n'))
    .pipe(through(function(chunk, enc, cb) {
      readable.push(chunk);
      isError = false;

      cb();
    }, function(cb) {
      setImmediate(function() {
        if (!isError) {
          readable.push(null);
          readable.emit('close');
        }

        cb();
      });
    }));

  child.stderr
    .pipe(through.obj(function(chunk) {
      isError = true;
      readable.emit('error', new Error(chunk));
      readable.emit('close');
    }));

  return readable;
}

module.exports = gitRawCommits;
