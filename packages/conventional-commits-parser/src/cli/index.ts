#!/usr/bin/env node
import { pipeline } from 'stream/promises'
import meow from 'meow'
import { parseCommits } from '../index.js'
import { parseOptions } from './options.js'
import {
  readRawCommitsFromFiles,
  readRawCommitsFromLine,
  readRawCommitsFromStdin,
  stringify
} from './utils.js'

const DEFAULT_SEPARATOR = '\n\n\n'
const cli = meow(`
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
`, {
  importMeta: import.meta,
  flags: {
    separator: {
      shortFlag: 's',
      type: 'string',
      default: DEFAULT_SEPARATOR
    },
    headerPattern: {
      shortFlag: 'p',
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
    issuePrefixesCaseSensitive: {
      type: 'boolean'
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
    verbose: {
      shortFlag: 'v',
      type: 'boolean'
    }
  }
})
const { separator } = cli.flags
const options = parseOptions(cli.flags)
let inputStream: AsyncIterable<string>

try {
  if (cli.input.length) {
    inputStream = readRawCommitsFromFiles(cli.input, separator)
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
