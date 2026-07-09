#!/usr/bin/env node
import { pipeline } from 'stream/promises'
import { readFile } from 'fs/promises'
import {
  readOptions,
  option,
  flag,
  alias,
  autocase,
  rest
} from 'argue-cli'
import { parseCommits } from '../index.js'
import { parseOptions } from './options.js'
import {
  readRawCommitsFromFiles,
  readRawCommitsFromLine,
  readRawCommitsFromStdin,
  stringify
} from './utils.js'

const DEFAULT_SEPARATOR = '\n\n\n'
const HELP = `
  Practice writing commit messages or parse messages from files.
  If used without specifying a text file path, you will enter an interactive shell.
  Otherwise the commit messages in the files are parsed and printed
  By default, commits will be split by three newlines ('\\n\\n\\n') or you can specify a separator.

  Usage
    conventional-commits-parser [-s <commit-separator>]
    conventional-commits-parser [-s <commit-separator>] <path> [<path> ...]
    cat <path> | conventional-commits-parser [-s <commit-separator>]

  Example
    conventional-commits-parser
    conventional-commits-parser log.txt
    cat log.txt | conventional-commits-parser
    conventional-commits-parser log2.txt -s '===' >> parsed.txt

  Options
    -s, --separator                   Commit separator
    -p, --header-pattern              Regex to match header pattern
    -c, --header-correspondence       Comma separated parts used to define what capturing group of 'headerPattern' captures what
    -r, --reference-actions           Comma separated keywords that used to reference issues
    -i, --issue-prefixes              Comma separated prefixes of an issue
    --issue-prefixes-case-sensitive   Treat issue prefixes as case sensitive
    -n, --note-keywords               Comma separated keywords for important notes
    -f, --field-pattern               Regex to match other fields
    --revert-pattern                  Regex to match revert pattern
    --revert-correspondence           Comma separated fields used to define what the commit reverts
    -v, --verbose                     Verbose output
`
const flags = readOptions(
  option(alias('separator', 's'), String),
  option(autocase(alias('headerPattern', 'p')), String),
  option(autocase(alias('headerCorrespondence', 'c')), String),
  option(autocase(alias('referenceActions', 'r')), String),
  option(autocase(alias('issuePrefixes', 'i')), String),
  flag(autocase('issuePrefixesCaseSensitive')),
  option(autocase(alias('noteKeywords', 'n')), String),
  option(autocase(alias('fieldPattern', 'f')), String),
  option(autocase('revertPattern'), String),
  option(autocase('revertCorrespondence'), String),
  flag(alias('verbose', 'v')),
  flag('help'),
  flag('version')
)
const files = rest()

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

const separator = flags.separator ?? DEFAULT_SEPARATOR
const options = parseOptions(flags)
let inputStream: AsyncIterable<string>

try {
  if (files.length) {
    inputStream = readRawCommitsFromFiles(files, separator)
  } else
    if (process.stdin.isTTY) {
      inputStream = readRawCommitsFromLine(separator)
    } else {
      inputStream = readRawCommitsFromStdin(separator)
    }

  await pipeline(
    inputStream,
    parseCommits(options),
    stringify,
    process.stdout
  )
} catch (err) {
  console.error(err)
  process.exit(1)
}
