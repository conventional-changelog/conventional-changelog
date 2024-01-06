#!/usr/bin/env node
import { pipeline } from 'stream/promises'
import meow from 'meow'
import { getRawCommits } from './index.js'

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

await pipeline(
  getRawCommits(cli.flags),
  process.stdout
)
