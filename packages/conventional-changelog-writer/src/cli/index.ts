#!/usr/bin/env node
import { pipeline } from 'stream/promises'
import { readFile } from 'fs/promises'
import type { TemplateContext } from '@conventional-changelog/template'
import {
  readOptions,
  option,
  flag,
  alias,
  rest
} from 'argue-cli'
import {
  type Options,
  type CommitKnownProps,
  writeChangelog
} from '../index.js'
import {
  loadDataFile,
  readCommitsFromFiles,
  readCommitsFromStdin
} from './utils.js'

const HELP = `
  Usage
    conventional-changelog-writer <path> [<path> ...]
    cat <path> | conventional-changelog-writer

  Example
    conventional-changelog-writer commits.ldjson
    cat commits.ldjson | conventional-changelog-writer

  Options
    -c, --context    A filepath of a json that is used to define template variables
    -o, --options    A filepath of a javascript object that is used to define options
`
const flags = readOptions(
  option(alias('context', 'c'), String),
  option(alias('options', 'o'), String),
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

const {
  context: contextPath,
  options: optionsPath
} = flags
let context: TemplateContext | undefined
let options: Options | undefined

if (contextPath) {
  try {
    context = await loadDataFile(contextPath)
  } catch (err) {
    console.error(`Failed to get context from file ${contextPath}:\n  ${err as string}`)
    process.exit(1)
  }
}

if (optionsPath) {
  try {
    options = await loadDataFile(optionsPath)
  } catch (err) {
    console.error(`Failed to get options from file ${optionsPath}:\n  ${err as string}`)
    process.exit(1)
  }
}

let inputStream: AsyncIterable<CommitKnownProps>

try {
  if (files.length) {
    inputStream = readCommitsFromFiles(files)
  } else
    if (process.stdin.isTTY) {
      console.error('You must specify at least one line delimited json file')
      process.exit(1)
    } else {
      inputStream = readCommitsFromStdin()
    }

  await pipeline(
    inputStream,
    writeChangelog(context, options),
    process.stdout
  )
} catch (err) {
  console.error(err)
  process.exit(1)
}
