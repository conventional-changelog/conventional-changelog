#!/usr/bin/env node
'use strict';
var conventionalCommitsParser = require('./');
var JSONStream = require('JSONStream');
var meow = require('meow');

var cli = meow({
  help: [
    'Usage',
    '  conventional-commits-parser <file>',
    '  if used without specifying a file, you can enter an interactive shell',
    '',
    'Example',
    '  conventional-commits-parser',
    '  conventional-commits-parser log.txt'
  ].join('\n')
});

if (cli.input.length > 0) {
  var fs = require('graceful-fs');

  fs.createReadStream(cli.input[0])
    .on('error', function(err) {
      console.log('Failed to read file ' + cli.input[0] + '\n' + err);
    })
    .pipe(conventionalCommitsParser(cli.flags))
    .pipe(JSONStream.stringify())
    .pipe(process.stdout);
}

else {
  var commit = '';
  var through = require('through2');
  var readline = require('readline');
  var stream = through();

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });

  stream.pipe(conventionalCommitsParser(cli.flags))
    .pipe(JSONStream.stringify(''))
    .pipe(through(function(chunk, enc, cb) {
      cb(null, 'result: ' + chunk + '\n\n');
    }))
    .pipe(process.stdout);

  rl.on('line', function(line) {
    commit += line + '\n';
    if (commit.indexOf('\n\n\n') === -1) {
      return;
    }

    stream.write(commit);
    commit = '';
  });
}
