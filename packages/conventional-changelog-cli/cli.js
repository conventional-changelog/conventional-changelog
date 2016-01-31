#!/usr/bin/env node
'use strict';
var addStream = require('add-stream');
var conventionalChangelog = require('conventional-changelog');
var fs = require('fs');
var meow = require('meow');
var tempfile = require('tempfile');
var _ = require('lodash');
var resolve = require('path').resolve;

var cli = meow({
  help: [
    'Usage',
    '  conventional-changelog',
    '',
    'Example',
    '  conventional-changelog -i CHANGELOG.md --same-file',
    '',
    'Options',
    '  -i, --infile              Read the CHANGELOG from this file',
    '',
    '  -o, --outfile             Write the CHANGELOG to this file.',
    '                            If unspecified, it prints to stdout',
    '',
    '  -s, --same-file           Ouputting to the infile so you don\'t need to specify the same file as outfile',
    '',
    '  -p, --preset              Name of the preset you want to use. Must be one of the following:',
    '                            angular, atom, codemirror, ember, eslint, express, jquery, jscs or jshint',
    '',
    '  -k, --pkg                 A filepath of where your package.json is located',
    '                            Default is the closest package.json from cwd',
    '',
    '  -a, --append              Should the newer release be appended to the older release',
    '                            Default: false',
    '',
    '  -r, --release-count       How many releases to be generated from the latest',
    '                            If 0, the whole changelog will be regenerated and the outfile will be overwritten',
    '                            Default: 1',
    '',
    '  -v, --verbose             Verbose output',
    '                            Default: false',
    '',
    '  -n, --config              A filepath of your config script',
    '',
    '  -c, --context             A filepath of a json that is used to define template variables'
  ]
}, {
  alias: {
    i: 'infile',
    o: 'outfile',
    s: 'sameFile',
    p: 'preset',
    k: 'pkg',
    a: 'append',
    r: 'releaseCount',
    v: 'verbose',
    n: 'config',
    c: 'context'
  }
});

var flags = cli.flags;
var infile = flags.infile;
var outfile = flags.outfile;
var sameFile = flags.sameFile;
var append = flags.append;
var releaseCount = flags.releaseCount;

if (infile && infile === outfile) {
  sameFile = true;
} else if (sameFile) {
  if (infile) {
    outfile = infile;
  } else {
    console.error('infile must be provided if same-file flag presents.');
    process.exit(1);
  }
}

var options = _.omit({
  preset: flags.preset,
  pkg: {
    path: flags.pkg
  },
  append: append,
  releaseCount: releaseCount
}, _.isUndefined);

if (flags.verbose) {
  options.warn = console.warn.bind(console);
}

var templateContext;

var outStream;

try {
  if (flags.context) {
    templateContext = require(resolve(process.cwd(), flags.context));
  }

  if (flags.config) {
    options.config = require(resolve(process.cwd(), flags.config));
  }
} catch (err) {
  console.error('Failed to get file. ' + err);
  process.exit(1);
}

var changelogStream = conventionalChangelog (options, templateContext)
  .on('error', function (err) {
    if (flags.verbose) {
      console.error(err.stack);
    } else {
      console.error(err.toString());
    }
    process.exit(1);
  });

function noInputFile() {
  if (outfile) {
    outStream = fs.createWriteStream (outfile);
  } else {
    outStream = process.stdout;
  }

  changelogStream
    .pipe(outStream);
}

if (infile && releaseCount !== 0) {
  var readStream = fs.createReadStream(infile)
    .on('error', function () {
      noInputFile();
    });

  if (sameFile) {
    if (options.append) {
      changelogStream
        .pipe(fs.createWriteStream(outfile, {
          flags: 'a'
        }));
    } else {
      var tmp = tempfile();

      changelogStream
        .pipe(addStream(readStream))
        .pipe(fs.createWriteStream(tmp))
        .on('finish', function () {
          fs.createReadStream(tmp)
            .pipe(fs.createWriteStream(outfile));
        });
    }
  } else {
    if (outfile) {
      outStream = fs.createWriteStream(outfile);
    } else {
      outStream = process.stdout;
    }

    var stream;

    if (options.append) {
      stream = readStream
        .pipe(addStream(changelogStream));
    } else {
      stream = changelogStream
        .pipe(addStream(readStream));
    }

    stream
      .pipe(outStream);
  }
} else {
  noInputFile();
}
