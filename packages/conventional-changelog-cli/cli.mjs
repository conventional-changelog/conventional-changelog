#!/usr/bin/env node
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import {
  createReadStream,
  createWriteStream
} from 'fs'
import { readFile } from 'fs/promises'
import addStream from 'add-stream'
import tempfile from 'tempfile'
import meow from 'meow'
import conventionalChangelog from 'conventional-changelog'

function relativeResolve (filePath) {
  return pathToFileURL(resolve(process.cwd(), filePath))
}

const cli = meow(`
    Usage
      conventional-changelog

    Example
      conventional-changelog -i CHANGELOG.md --same-file

    Options
      -i, --infile              Read the CHANGELOG from this file

      -o, --outfile             Write the CHANGELOG to this file
                                If unspecified, it prints to stdout

      -s, --same-file           Outputting to the infile so you don't need to specify the same file as outfile

      -p, --preset              Name of the preset you want to use. Must be one of the following:
                                angular, atom, codemirror, conventionalcommits, ember, eslint, express, jquery or jshint

      -k, --pkg                 A filepath of where your package.json is located
                                Default is the closest package.json from cwd

      -a, --append              Should the newer release be appended to the older release
                                Default: false

      -r, --release-count       How many releases to be generated from the latest
                                If 0, the whole changelog will be regenerated and the outfile will be overwritten
                                Default: 1

      --skip-unstable           If given, unstable tags will be skipped, e.g., x.x.x-alpha.1, x.x.x-rc.2

      -u, --output-unreleased   Output unreleased changelog

      -v, --verbose             Verbose output. Use this for debugging
                                Default: false

      -n, --config              A filepath of your config script
                                Example of a config script: https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-cli/test/fixtures/config.js

      -c, --context             A filepath of a json that is used to define template variables
      -l, --lerna-package       Generate a changelog for a specific lerna package (:pkg-name@1.0.0)
      -t, --tag-prefix          Tag prefix to consider when reading the tags
      --commit-path             Generate a changelog scoped to a specific directory
`, {
  importMeta: import.meta,
  booleanDefault: undefined,
  flags: {
    infile: {
      shortFlag: 'i',
      type: 'string'
    },
    outfile: {
      shortFlag: 'o',
      type: 'string'
    },
    sameFile: {
      shortFlag: 's',
      type: 'boolean'
    },
    preset: {
      shortFlag: 'p',
      type: 'string'
    },
    pkg: {
      shortFlag: 'k',
      type: 'string'
    },
    append: {
      shortFlag: 'a',
      type: 'boolean'
    },
    releaseCount: {
      shortFlag: 'r',
      type: 'number'
    },
    skipUnstable: {
      type: 'boolean'
    },
    outputUnreleased: {
      shortFlag: 'u',
      type: 'boolean'
    },
    verbose: {
      shortFlag: 'v',
      type: 'boolean'
    },
    config: {
      shortFlag: 'n',
      type: 'string'
    },
    context: {
      shortFlag: 'c',
      type: 'string'
    },
    lernaPackage: {
      shortFlag: 'l',
      type: 'string'
    },
    tagPrefix: {
      shortFlag: 't',
      type: 'string'
    }
  }
})

let config
const flags = cli.flags
const infile = flags.infile
let outfile = flags.outfile
let sameFile = flags.sameFile
const append = flags.append
const releaseCount = flags.releaseCount
const skipUnstable = flags.skipUnstable

if (infile && infile === outfile) {
  sameFile = true
} else if (sameFile) {
  if (infile) {
    outfile = infile
  } else {
    console.error('infile must be provided if same-file flag presents.')
    process.exit(1)
  }
}

let options = {
  preset: flags.preset,
  pkg: {
    path: flags.pkg
  },
  append,
  releaseCount,
  skipUnstable,
  outputUnreleased: flags.outputUnreleased,
  lernaPackage: flags.lernaPackage,
  tagPrefix: flags.tagPrefix
}

if (flags.verbose) {
  options.debug = console.info.bind(console)
  options.warn = console.warn.bind(console)
}

let templateContext

let outStream

try {
  if (flags.context) {
    templateContext = JSON.parse(await readFile(relativeResolve(flags.context), 'utf8'))
  }

  if (flags.config) {
    config = (await import(relativeResolve(flags.config))).default
    options.config = config

    if (config.options) {
      options = {
        ...options,
        ...config.options,
        pkg: {
          ...options.pkg,
          ...config.options.pkg
        }
      }
    }
  } else {
    config = {}
  }
} catch (err) {
  console.error('Failed to get file. ' + err)
  process.exit(1)
}

const gitRawCommitsOpts = {
  ...config.gitRawCommitsOpts
}
if (flags.commitPath) gitRawCommitsOpts.path = flags.commitPath

const changelogStream = conventionalChangelog(options, templateContext, gitRawCommitsOpts, config.parserOpts, config.writerOpts)
  .on('error', (err) => {
    if (flags.verbose) {
      console.error(err.stack)
    } else {
      console.error(err.toString())
    }
    process.exit(1)
  })

function noInputFile () {
  if (outfile) {
    outStream = createWriteStream(outfile)
  } else {
    outStream = process.stdout
  }

  changelogStream
    .pipe(outStream)
}

if (infile && releaseCount !== 0) {
  const readStream = createReadStream(infile)
    .on('error', () => {
      if (flags.verbose) {
        console.warn('infile does not exist.')
      }

      if (sameFile) {
        noInputFile()
      }
    })

  if (sameFile) {
    if (options.append) {
      changelogStream
        .pipe(createWriteStream(outfile, {
          flags: 'a'
        }))
    } else {
      const tmp = tempfile()

      changelogStream
        .pipe(addStream(readStream))
        .pipe(createWriteStream(tmp))
        .on('finish', () => {
          createReadStream(tmp)
            .pipe(createWriteStream(outfile))
        })
    }
  } else {
    if (outfile) {
      outStream = createWriteStream(outfile)
    } else {
      outStream = process.stdout
    }

    let stream

    if (options.append) {
      stream = readStream
        .pipe(addStream(changelogStream))
    } else {
      stream = changelogStream
        .pipe(addStream(readStream))
    }

    stream
      .pipe(outStream)
  }
} else {
  noInputFile()
}
