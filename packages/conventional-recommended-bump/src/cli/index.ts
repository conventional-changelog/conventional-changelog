#!/usr/bin/env node
import meow from 'meow'
import type { Preset } from '../index.js'
import { Bumper } from '../index.js'
import {
  parseCommitsOptions,
  parseTagsOptions,
  parseParserOptions
} from './options.js'
import { loadDataFile } from './utils.js'

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
      shortFlag: 'p',
      type: 'string'
    },
    config: {
      shortFlag: 'g',
      type: 'string'
    },
    verbose: {
      shortFlag: 'v',
      type: 'boolean'
    },
    // tags `prefix` param
    lernaPackage: {
      shortFlag: 'l',
      type: 'string'
    },
    // tags `prefix` param
    tagPrefix: {
      shortFlag: 't',
      type: 'string'
    },
    // tags `skipUnstable` param
    skipUnstable: {
      type: 'boolean'
    },
    // commits `path` param
    commitPath: {
      type: 'string'
    },
    // parser options
    headerPattern: {
      shortFlag: 'h',
      type: 'string'
    },
    headerCorrespondence: {
      shortFlag: 'c',
      type: 'string'
    },
    referenceActions: {
      shortFlag: 'r',
      type: 'string'
    },
    issuePrefixes: {
      shortFlag: 'i',
      type: 'string'
    },
    noteKeywords: {
      shortFlag: 'n',
      type: 'string'
    },
    fieldPattern: {
      shortFlag: 'f',
      type: 'string'
    },
    revertPattern: {
      type: 'string'
    },
    revertCorrespondence: {
      type: 'string'
    },
    mergePattern: {
      type: 'string'
    }
  }
})
const { flags } = cli
let tagsOptions = parseTagsOptions(flags)
let commitsOptions = parseCommitsOptions(flags)
let parserOptions = parseParserOptions(flags)
let whatBump: Preset['whatBump'] | undefined
const { preset, config } = flags
const bumper = new Bumper(process.cwd())

if (preset) {
  bumper.loadPreset(preset)
} else if (config) {
  const configOptions = await loadDataFile(config) as Preset

  if (configOptions.tags) {
    tagsOptions = {
      ...configOptions.tags,
      ...tagsOptions
    }
  }

  if (configOptions.commits) {
    commitsOptions = {
      ...configOptions.commits,
      ...commitsOptions
    }
  }

  if (configOptions.parser) {
    parserOptions = {
      ...configOptions.parser,
      ...parserOptions
    }
  }

  whatBump ||= configOptions.whatBump
}

if (tagsOptions) {
  bumper.tag(tagsOptions)
}

if (commitsOptions) {
  bumper.commits(commitsOptions, parserOptions || undefined)
}

const data = await bumper.bump(whatBump)

if (data.releaseType) {
  console.log(data.releaseType)
}

if (flags.verbose && data.reason) {
  console.log(`Reason: ${data.reason}`)
}
