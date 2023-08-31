#!/usr/bin/env node
import { createWriteStream } from 'fs'
import {
  readFile,
  writeFile
} from 'fs/promises'
import pc from 'picocolors'
import meow from 'meow'
import standardChangelog, {
  createIfMissing,
  checkpoint
} from './index.js'

function printError (err) {
  if (flags.verbose) {
    console.error(pc.gray(err.stack))
  } else {
    console.error(pc.red(err.toString()))
  }

  process.exit(1)
}

function waitStreamFinish (stream) {
  return new Promise((resolve) => {
    stream.on('finish', resolve)
    stream.on('error', printError)
  })
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

try {
  if (flags.context) {
    templateContext = JSON.parse(await readFile(flags.context, 'utf8'))
  }
} catch (err) {
  printError(err)
}

const changelogStream = standardChangelog(options, templateContext, flags.commitPath ? { path: flags.commitPath } : {})

await createIfMissing(infile)

if (options.append) {
  await waitStreamFinish(
    changelogStream
      .pipe(createWriteStream(outfile, {
        flags: 'a'
      }))
  )

  checkpoint('appended changes to %s', [outfile])
} else {
  let changelog = ''

  for await (const chunk of changelogStream) {
    changelog += chunk.toString()
  }

  if (releaseCount !== 0) {
    changelog += await readFile(infile, 'utf8')
  }

  await writeFile(outfile, changelog)

  checkpoint('output changes to %s', [outfile])
}
