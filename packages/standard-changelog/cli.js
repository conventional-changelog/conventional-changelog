#!/usr/bin/env node
'use strict'
var addStream = require('add-stream')
var chalk = require('chalk')
var standardChangelog = require('./')
var fs = require('fs')
var meow = require('meow')
var tempfile = require('tempfile')
var _ = require('lodash')
var resolve = require('path').resolve
var Readable = require('stream').Readable
var rimraf = require('rimraf')

var cli = meow(`
  Usage
    standard-changelog

  Options
    -i, --infile              Read the CHANGELOG from this file
    -f, --first-release       Generate the CHANGELOG for the first time
    -o, --outfile             Write the CHANGELOG to this file. If unspecified (default: CHANGELOG.md)
    -s, --same-file           Overwrite the infile (default: true)
    -p, --preset              Name of the preset you want to use (default: angular)
    -k, --pkg                 A filepath of where your package.json is located
    -a, --append              Should the generated block be appended
    -r, --release-count       How many releases to be generated from the latest
    -v, --verbose             Verbose output
    -c, --context             A filepath of a json that is used to define template variables
    -l, --lerna-package       Generate a changelog for a specific lerna package (:pkg-name@1.0.0)
    --commit-path             Generate a changelog scoped to a specific directory
`, {
  booleanDefault: undefined,
  flags: {
    'infile': {
      alias: 'i',
      default: 'CHANGELOG.md',
      type: 'string'
    },
    'help': {
      alias: 'h'
    },
    'outfile': {
      alias: 'o',
      type: 'string'
    },
    'same-file': {
      alias: 's',
      default: true,
      type: 'boolean'
    },
    'preset': {
      alias: 'p',
      type: 'string'
    },
    'pkg': {
      alias: 'k',
      type: 'string'
    },
    'append': {
      alias: 'a',
      type: 'boolean'
    },
    'release-count': {
      alias: 'r',
      type: 'number'
    },
    'verbose': {
      alias: 'v',
      type: 'boolean'
    },
    'context': {
      alias: 'c',
      type: 'string'
    },
    'first-release': {
      alias: `f`,
      type: 'boolean'
    },
    'lerna-package': {
      alias: 'l',
      type: 'string'
    }
  }
})

var flags = cli.flags
var infile = flags.infile
var sameFile = flags.sameFile
var outfile = sameFile ? (flags.outfile || infile) : flags.outfile
var append = flags.append
var releaseCount = flags.firstRelease ? 0 : flags.releaseCount

var options = _.omitBy({
  preset: flags.preset,
  pkg: {
    path: flags.pkg
  },
  append: append,
  releaseCount: releaseCount,
  lernaPackage: flags.lernaPackage
}, _.isUndefined)

if (flags.verbose) {
  options.warn = console.warn.bind(console)
}

var templateContext

function outputError (err) {
  if (flags.verbose) {
    console.error(chalk.grey(err.stack))
  } else {
    console.error(chalk.red(err.toString()))
  }
  process.exit(1)
}

try {
  if (flags.context) {
    templateContext = require(resolve(process.cwd(), flags.context))
  }
} catch (err) {
  outputError(err)
}

var changelogStream = standardChangelog(options, templateContext, flags.commitPath ? { path: flags.commitPath } : {})
  .on('error', function (err) {
    outputError(err)
  })

standardChangelog.createIfMissing(infile)

var readStream = null
if (releaseCount !== 0) {
  readStream = fs.createReadStream(infile)
    .on('error', function (err) {
      outputError(err)
    })
} else {
  readStream = new Readable()
  readStream.push(null)
}

if (options.append) {
  changelogStream
    .pipe(fs.createWriteStream(outfile, {
      flags: 'a'
    }))
    .on('finish', function () {
      standardChangelog.checkpoint('appended changes to %s', [outfile])
    })
} else {
  var tmp = tempfile()

  changelogStream
    .pipe(addStream(readStream))
    .pipe(fs.createWriteStream(tmp))
    .on('finish', function () {
      fs.createReadStream(tmp)
        .pipe(fs.createWriteStream(outfile))
        .on('finish', function () {
          standardChangelog.checkpoint('output changes to %s', [outfile])
          rimraf.sync(tmp)
        })
    })
}
