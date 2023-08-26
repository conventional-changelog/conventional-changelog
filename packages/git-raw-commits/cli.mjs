#!/usr/bin/env node
import meow from 'meow'
import gitRawCommits from './index.js'

const cli = meow(`
  Usage
    git-raw-commits [<git-log(1)-options>]

  Example
    git-raw-commits --from HEAD~2 --to HEAD^
`, {
  importMeta: import.meta
})

gitRawCommits(cli.flags)
  .on('error', (err) => {
    process.stderr.write(err)
    process.exit(1)
  })
  .pipe(process.stdout)
