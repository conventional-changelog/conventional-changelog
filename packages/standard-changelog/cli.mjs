#!/usr/bin/env node
import {
  createReadStream,
  createWriteStream
} from 'fs'
import {
  readFile,
  rm
} from 'fs/promises'
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { Readable } from 'stream'
import addStream from 'add-stream'
import pc from 'picocolors'
import tempfile from 'tempfile'
import meow from 'meow'
import standardChangelog from './index.js'

function relativeResolve (filePath) {
  return pathToFileURL(resolve(process.cwd(), filePath))
}

const cli = meow(`
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
  importMeta: import.meta,
  booleanDefault: undefined,
  flags: {
    infile: {
      shortFlag: 'i',
      default: 'CHANGELOG.md',
      type: 'string'
    },
    help: {
      shortFlag: 'h'
    },
    outfile: {
      shortFlag: 'o',
      type: 'string'
    },
    sameFile: {
      shortFlag: 's',
      default: true,
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
    verbose: {
      shortFlag: 'v',
      type: 'boolean'
    },
    context: {
      shortFlag: 'c',
      type: 'string'
    },
    firstRelease: {
      shortFlag: 'f',
      type: 'boolean'
    },
    lernaPackage: {
      shortFlag: 'l',
      type: 'string'
    }
  }
})

const flags = cli.flags
const infile = flags.infile
const sameFile = flags.sameFile
const outfile = sameFile ? (flags.outfile || infile) : flags.outfile
const append = flags.append
const releaseCount = flags.firstRelease ? 0 : flags.releaseCount

const options = {
  preset: flags.preset,
  pkg: {
    path: flags.pkg
  },
  append,
  releaseCount,
  lernaPackage: flags.lernaPackage
}

if (flags.verbose) {
  options.warn = console.warn.bind(console)
}

let templateContext

function outputError (err) {
  if (flags.verbose) {
    console.error(pc.gray(err.stack))
  } else {
    console.error(pc.red(err.toString()))
  }
  process.exit(1)
}

try {
  if (flags.context) {
    templateContext = JSON.parse(await readFile(relativeResolve(flags.context), 'utf8'))
  }
} catch (err) {
  outputError(err)
}

const changelogStream = standardChangelog(options, templateContext, flags.commitPath ? { path: flags.commitPath } : {})
  .on('error', (err) => {
    outputError(err)
  })

standardChangelog.createIfMissing(infile)

let readStream = null
if (releaseCount !== 0) {
  readStream = createReadStream(infile)
    .on('error', (err) => {
      outputError(err)
    })
} else {
  readStream = new Readable()
  readStream.push(null)
}

if (options.append) {
  changelogStream
    .pipe(createWriteStream(outfile, {
      flags: 'a'
    }))
    .on('finish', () => {
      standardChangelog.checkpoint('appended changes to %s', [outfile])
    })
} else {
  const tmp = tempfile()

  changelogStream
    .pipe(addStream(readStream))
    .pipe(createWriteStream(tmp))
    .on('finish', () => {
      createReadStream(tmp)
        .pipe(createWriteStream(outfile))
        .on('finish', () => {
          standardChangelog.checkpoint('output changes to %s', [outfile])
          rm(tmp, { recursive: true })
        })
    })
}
