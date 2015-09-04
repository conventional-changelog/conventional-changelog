#!/usr/bin/env node
'use strict';
var addStream = require('add-stream');
var conventionalChangelog = require('./');
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
    '  conventional-changelog -i CHANGELOG.md --overwrite',
    '',
    'Options',
    '  -i, --infile              Read the CHANGELOG from this file',
    '  -o, --outfile             Write the CHANGELOG to this file. If unspecified, it prints to stdout',
    '  -w, --overwrite           Overwrite the infile',
    '  -p, --preset              Name of the preset you want to use',
    '  -k, --pkg                 A filepath of where your package.json is located',
    '  -a, --append              Should the generated block be appended',
    '  -r, --release-count       How many releases to be generated from the latest',
    '  -v, --verbose             Verbose output',
    '  -c, --context             A filepath of a javascript that is used to define template variables',
    '  --git-raw-commits-opts    A filepath of a javascript that is used to define git-raw-commits options',
    '  --parser-opts             A filepath of a javascript that is used to define conventional-commits-parser options',
    '  --writer-opts             A filepath of a javascript that is used to define conventional-changelog-writer options'
  ]
}, {
  alias: {
    i: 'infile',
    o: 'outfile',
    w: 'overwrite',
    p: 'preset',
    k: 'pkg',
    a: 'append',
    r: 'releaseCount',
    v: 'verbose',
    c: 'context'
  }
});

var flags = cli.flags;
var infile = flags.infile;
var outfile = flags.outfile;
var overwrite = flags.overwrite;
var append = flags.append;
var releaseCount = flags.releaseCount;

if (infile && infile === outfile) {
  overwrite = true;
} else if (overwrite) {
  if (infile) {
    outfile = infile;
  } else {
    console.error('Nothing to overwrite');
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
var gitRawCommitsOpts;
var parserOpts;
var writerOpts;

var outStream;

try {
  if (flags.context) {
    templateContext = require(resolve(process.cwd(), flags.context));
  }

  if (flags.gitRawCommitsOpts) {
    gitRawCommitsOpts = require(resolve(process.cwd(), flags.gitRawCommitsOpts));
  }

  if (flags.parserOpts) {
    parserOpts = require(resolve(process.cwd(), flags.parserOpts));
  }

  if (flags.writerOpts) {
    writerOpts = require(resolve(process.cwd(), flags.writerOpts));
  }
} catch (err) {
  console.error('Failed to get file. ' + err);
  process.exit(1);
}

var changelogStream = conventionalChangelog(options, templateContext, gitRawCommitsOpts, parserOpts, writerOpts)
  .on('error', function(err) {
    console.error(err.toString());
    process.exit(1);
  });

function noInputFile() {
  if (outfile) {
    outStream = fs.createWriteStream(outfile);
  } else {
    outStream = process.stdout;
  }

  changelogStream
    .pipe(outStream);
}

if (infile && releaseCount !== 0) {
  var readStream = fs.createReadStream(infile)
    .on('error', function() {
      noInputFile();
    });

  if (overwrite) {
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
        .on('finish', function() {
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
