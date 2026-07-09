#!/usr/bin/env node
import { readFile } from 'fs/promises'
import {
  readOptions,
  option,
  flag,
  alias,
  autocase
} from 'argue-cli'
import {
  type Preset,
  type BumperRecommendationResult,
  WHAT_BUMP_ERROR_MESSAGE,
  Bumper
} from '../index.js'
import {
  parseCommitsOptions,
  parseTagsOptions,
  parseParserOptions
} from './options.js'
import { loadDataFile } from './utils.js'

const HELP = `
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
    --from                         Start commit range from a specific tag or sha
    --to                           End commit range at a specific tag or sha
    --skip-unstable                If given, unstable tags will be skipped, e.g., x.x.x-alpha.1, x.x.x-rc.2
`
const flags = readOptions(
  option(alias('preset', 'p'), String),
  option(alias('config', 'g'), String),
  flag(alias('verbose', 'v')),
  // tags `prefix` param
  option(autocase(alias('lernaPackage', 'l')), String),
  // tags `prefix` param
  option(autocase(alias('tagPrefix', 't')), String),
  // tags `skipUnstable` param
  flag(autocase('skipUnstable')),
  // commits `path` param
  option(autocase('commitPath'), String),
  // commits `from` param
  option('from', String),
  // commits `to` param
  option('to', String),
  // parser options
  option(autocase(alias('headerPattern', 'h')), String),
  option(autocase(alias('headerCorrespondence', 'c')), String),
  option(autocase(alias('referenceActions', 'r')), String),
  option(autocase(alias('issuePrefixes', 'i')), String),
  option(autocase(alias('noteKeywords', 'n')), String),
  option(autocase(alias('fieldPattern', 'f')), String),
  option(autocase('revertPattern'), String),
  option(autocase('revertCorrespondence'), String),
  option(autocase('mergePattern'), String),
  flag('help'),
  flag('version')
)

if (flags.help || flags.version) {
  const pkg = JSON.parse(
    await readFile(new URL('../../package.json', import.meta.url), 'utf8')
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

const {
  preset,
  config
} = flags
const bumper = new Bumper(process.cwd())
let whatBump: Preset['whatBump'] | undefined

if (preset) {
  bumper.loadPreset(preset)
}

if (config) {
  const configOptions = await loadDataFile(config) as Preset

  if (configOptions.tags) {
    bumper.tag(configOptions.tags)
  }

  if (configOptions.commits || configOptions.parser) {
    bumper.commits(configOptions.commits || {}, configOptions.parser)
  }

  whatBump ||= configOptions.whatBump
}

const tagsOptions = parseTagsOptions(flags)

if (tagsOptions) {
  bumper.tag(tagsOptions)
}

const commitsOptions = parseCommitsOptions(flags)
const parserOptions = parseParserOptions(flags)

if (commitsOptions) {
  bumper.commits(commitsOptions, parserOptions || undefined)
}

let data: BumperRecommendationResult

try {
  data = await bumper.bump(whatBump)
} catch (error) {
  if (error instanceof Error && error.message === WHAT_BUMP_ERROR_MESSAGE) {
    throw Error(
      `${WHAT_BUMP_ERROR_MESSAGE}. Please specify a preset with --preset or a config file with --config.`,
      {
        cause: error
      }
    )
  }

  throw error
}

if ('releaseType' in data) {
  console.log(data.releaseType)
}

if (flags.verbose && 'reason' in data) {
  console.log(`Reason: ${data.reason}`)
}
