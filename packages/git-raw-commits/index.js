'use strict';
var dargs = require('dargs');
var exec = require('child_process').exec;
var split = require('split2');
var stream = require('stream');
var through = require('through2');
var _ = require('lodash');

function gitRawCommits(options) {
  options = options || {};

  var cmd;

  var readable = new stream.Readable();
  readable._read = function() {}

  options = _.extend({
    from: '',
    to: 'HEAD',
    format: '%B'
  }, options);

  var args = dargs(options, {
    excludes: ['from', 'to', 'format']
  });

  cmd = _.template(
    'git log --format=\'<%= format %>%n------------------------ >8 ------------------------\' ' +
    '<%= from ? [from, to].join("..") : to %> '
  )(options) + args.join(' ');

  var child = exec(cmd);
  child.stdout
    .pipe(split('------------------------ >8 ------------------------\n'))
    .pipe(through(function(chunk, enc, cb) {
      chunk = chunk.toString();
      readable.push(chunk.toString());

      cb();
    }, function(cb) {
      readable.push(null);
      cb();
    }));

  child.stderr
    .pipe(through.obj(function(chunk) {
      readable.emit('error', chunk.toString());
      readable.push(null);
    }));

  return readable;
}

module.exports = gitRawCommits;
