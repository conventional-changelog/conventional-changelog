#!/usr/bin/env node
import { pipeline } from 'stream/promises'
import meow from 'meow'
import type {
  Context,
  Options,
  CommitKnownProps
} from '../index.js'
import { writeChangelog } from '../index.js'
import {
  loadDataFile,
  readCommitsFromFiles,
  readCommitsFromStdin
} from './utils.js'

const cli = meow(`
    Usage
      conventional-changelog-writer <path> [<path> ...]
      cat <path> | conventional-changelog-writer
    ,
    Example
      conventional-changelog-writer commits.ldjson
      cat commits.ldjson | conventional-changelog-writer
    ,
    Options
      -c, --context    A filepath of a json that is used to define template variables
      -o, --options    A filepath of a javascript object that is used to define options
`, {
  importMeta: import.meta,
  flags: {
    context: {
      shortFlag: 'c',
      type: 'string'
    },
    options: {
      shortFlag: 'o',
      type: 'string'
    }
  }
})
const {
  context: contextPath,
  options: optionsPath
} = cli.flags
let context: Context | undefined
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
  if (cli.input.length) {
    inputStream = readCommitsFromFiles(cli.input)
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
