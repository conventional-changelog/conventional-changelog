#!/usr/bin/env node
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import meow from 'meow'
import conventionalRecommendedBump from './index.js'

function relativeResolve (filePath) {
  return pathToFileURL(resolve(process.cwd(), filePath))
}

const cli = meow(`
    Usage
      conventional-recommended-bump

    Example
      conventional-recommended-bump

    Options
      -p, --preset                   Name of the preset you want to use
      -g, --config                   A filepath of your config script
      -h, --header-pattern           Regex to match header pattern
      -c, --header-correspondence    Comma separated parts used to define what capturing group of 'headerPattern' captures what
      -r, --reference-actions        Comma separated keywords that used to reference issues
      -i, --issue-prefixes           Comma separated prefixes of an issue
      -n, --note-keywords            Comma separated keywords for important notes
      -f, --field-pattern            Regex to match other fields
      -v, --verbose                  Verbose output
      -l, --lerna-package            Recommend a bump for a specific lerna package (:pkg-name@1.0.0)
      -t, --tag-prefix               Tag prefix to consider when reading the tags
      --commit-path                  Recommend a bump scoped to a specific directory
      --skip-unstable                If given, unstable tags will be skipped, e.g., x.x.x-alpha.1, x.x.x-rc.2
`, {
  importMeta: import.meta,
  flags: {
    preset: {
      shortFlag: 'p'
    },
    config: {
      shortFlag: 'g'
    },
    headerPattern: {
      shortFlag: 'h'
    },
    headerCorrespondence: {
      shortFlag: 'c'
    },
    referenceActions: {
      shortFlag: 'r'
    },
    issuePrefixes: {
      shortFlag: 'i'
    },
    noteKeywords: {
      shortFlag: 'n'
    },
    fieldPattern: {
      shortFlag: 'f'
    },
    verbose: {
      shortFlag: 'v'
    },
    lernaPackage: {
      shortFlag: 'l'
    },
    tagPrefix: {
      shortFlag: 't'
    },
    skipUnstable: {
      type: 'boolean'
    }
  }
})

const options = {
  path: cli.flags.commitPath,
  lernaPackage: cli.flags.lernaPackage,
  tagPrefix: cli.flags.tagPrefix,
  skipUnstable: cli.flags.skipUnstable
}
const flags = cli.flags
const preset = flags.preset
const config = flags.config

if (preset) {
  options.preset = preset
  delete flags.preset
} else if (config) {
  options.config = (await import(relativeResolve(config))).default
  delete flags.config
}

if (flags.verbose) {
  options.warn = console.warn.bind(console)
}

const data = await conventionalRecommendedBump(options, flags)

if (data.releaseType) {
  console.log(data.releaseType)
}

if (flags.verbose && data.reason) {
  console.log(`Reason: ${data.reason}`)
}
