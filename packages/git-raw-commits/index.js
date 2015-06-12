'use strict';
var dargs = require('dargs');
var exec = require('child_process').exec;
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

  var args = dargs(options, {
    excludes: ['from', 'to', 'format']
  });

  var cmd = template(
    'git log --format=\'<%= format %>%n------------------------ >8 ------------------------\' ' +
    '<%= from ? [from, to].join("..") : to %> '
  )(options) + args.join(' ');

  var anything = false;

  var child = exec(cmd);
  child.stdout
    .pipe(split('------------------------ >8 ------------------------\n'))
    .pipe(through(function(chunk, enc, cb) {
      readable.push(chunk);
      anything = true;

      cb();
    }, function(cb) {
      if (anything) {
        readable.push(null);
        readable.emit('close');
      }

      cb();
    }));

  child.stderr
    .pipe(through.obj(function(chunk) {
      readable.emit('error', chunk);
      readable.emit('close');
    }));

  return readable;
}

module.exports = gitRawCommits;
