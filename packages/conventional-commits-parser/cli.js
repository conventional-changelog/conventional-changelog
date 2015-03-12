#!/usr/bin/env node
'use strict';
var conventionalCommitsParser = require('./');
var forEach = require('lodash').forEach;
var fs = require('graceful-fs');
var isTextPath = require('is-text-path');
var JSONStream = require('JSONStream');
var meow = require('meow');
var readline = require('readline');
var split = require('split');
var through = require('through2');

var filePaths = [];
var separator = '\n\n\n';

var cli = meow({
  help: [
    'Practice writing commit messages or test from a file.',
    'If used without specifying a text file path, you will enter an interactive shell.',
    'Parsed results are printed to stdout',
    'By default, commits will be split by three newlines (`\\n\\n\\n`) or you can specify a separator.',
    '',
    'Usage',
    '  conventional-commits-parser [<commit-separator>] [<path>...]',
    '',
    'Example',
    '  conventional-commits-parser',
    '  conventional-commits-parser log.txt',
    '  conventional-commits-parser log2.txt \'===\' >> output.txt',
    '',
    'Options',
    '-m, --max-subject-length    Maximum subject length',
    '-p, --header-pattern        Regex to match header pattern',
    '-c, --close-keywords        Comma separated keywords that used to close issues',
    '-n, --note-keywords         Comma separated keywords for important notes'
  ].join('\n')
}, {
  alias: {
    m: 'maxSubjectLength',
    p: 'headerPattern',
    c: 'closeKeywords',
    n: 'noteKeywords'
  }
});

forEach(cli.input, function(arg) {
  if (isTextPath(arg)) {
    filePaths.push(arg);
  } else {
    separator = arg;
  }
});

var length = filePaths.length;

function processFile(fileIndex) {
  var filePath = filePaths[fileIndex];
  fs.createReadStream(filePath)
    .on('error', function(err) {
      console.warn('Failed to read file ' + filePath + '\n' + err);
      if (++fileIndex < length) {
        processFile(fileIndex);
      }
    })
    .pipe(split(separator))
    .pipe(conventionalCommitsParser(cli.flags))
    .pipe(JSONStream.stringify())
    .on('end', function() {
      if (++fileIndex < length) {
        processFile(fileIndex);
      }
    })
    .pipe(process.stdout);
}

if (length > 0) {
  processFile(0);
} else {
  var commit = '';
  var stream = through();
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });
  cli.flags.warn = console.log.bind(console);

  stream.pipe(conventionalCommitsParser(cli.flags))
    .pipe(JSONStream.stringify('', '', ''))
    .pipe(through(function(chunk, enc, cb) {
      if (chunk.toString() === '""') {
        cb(null, 'Commit cannot be parsed\n\n');
      } else {
        cb(null, 'Result: ' + chunk + '\n\n');
      }
    }))
    .pipe(process.stdout);

  rl.on('line', function(line) {
    commit += line + '\n';
    if (commit.indexOf(separator) === -1) {
      return;
    }

    stream.write(commit);
    commit = '';
  });
}
