#!/usr/bin/env node
import { pipeline } from 'stream/promises'
import meow from 'meow'
import { getRawCommits } from '../index.js'
import type { GitRawCommitsOptions } from '../types.js'

const cli = meow(`
  Usage
    git-raw-commits [<git-log(1)-options>]

  Example
    git-raw-commits --from HEAD~2 --to HEAD^
`, {
  importMeta: import.meta,
  flags: {
    ignore: {
      type: 'string'
    },
    path: {
      type: 'string',
      isMultiple: true
    },
    from: {
      type: 'string'
    },
    to: {
      type: 'string'
    },
    format: {
      type: 'string'
    }
  }
})
const options = {
  ignore: cli.flags.ignore,
  path: cli.flags.path,
  from: cli.flags.from,
  to: cli.flags.to,
  format: cli.flags.format
} as GitRawCommitsOptions

await pipeline(
  getRawCommits(options),
  process.stdout
)
