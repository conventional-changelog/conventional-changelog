#!/usr/bin/env node
import { readFile } from 'fs/promises'
import {
  readFlags,
  runProgram
} from 'conventional-changelog'
import { StandardChangelog } from './index.js'

const HELP = `
  Usage
    standard-changelog

  Example
    standard-changelog -i changelog -o CHANGELOG.md

  Options
    -i, --infile              Read the CHANGELOG from this file (default: CHANGELOG.md)
    -o, --outfile             Write the CHANGELOG to this file (default: infile)
    --stdout                  Output the result to stdout
    -p, --preset              Name of the preset you want to use (default: angular)
    -k, --pkg                 A filepath of where your package.json is located (default: closest package.json)
    -a, --append              Should the newer release be appended to the older release (default: false)
    -f, --first-release       Generate the CHANGELOG for the first time
    -r, --release-count       How many releases to be generated from the latest (default: 1)
                              If 0, the whole changelog will be regenerated and the outfile will be overwritten
    --skip-unstable           If given, unstable tags will be skipped, e.g., x.x.x-alpha.1, x.x.x-rc.2
    -u, --output-unreleased   Output unreleased changelog
    -v, --verbose             Verbose output. Use this for debugging (default: false)
    -n, --config              A filepath of your config script
    -c, --context             A filepath of a json that is used to define template variables
    -l, --lerna-package       Generate a changelog for a specific lerna package (:pkg-name@1.0.0)
    -t, --tag-prefix          Tag prefix to consider when reading the tags
    --commit-path             Generate a changelog scoped to a specific directory
    --from                    Start commit range from a specific tag or sha
    --to                      End commit range at a specific tag or sha
`
const flags = readFlags()

if (flags.help || flags.version) {
  const pkg = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8')
  ) as {
    version: string
    description: string
  }

  console.log(
    flags.help
      ? `\n  ${pkg.description}\n${HELP}`
      : pkg.version
  )
  process.exit(0)
}

await runProgram(
  new StandardChangelog(process.cwd()),
  flags
)
