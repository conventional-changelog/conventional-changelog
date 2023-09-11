import fs from 'fs/promises'
import pc from 'picocolors'
import conventionalChangelogCore from 'conventional-changelog-core'
import angular from 'conventional-changelog-angular'
import { tick } from './figures.js'

export default function conventionalChangelog (options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  options = options || {}
  options.config = angular

  return conventionalChangelogCore(options, context, gitRawCommitsOpts, parserOpts, writerOpts)
}

export async function createIfMissing (infile) {
  try {
    await fs.access(infile, fs.F_OK)
  } catch (err) {
    if (err.code === 'ENOENT') {
      checkpoint('created %s', [infile])
      await fs.writeFile(infile, '\n', 'utf-8')
    }
  }
}

export function checkpoint (msg, args) {
  console.info(`${pc.green(tick)} ${msg}`, ...args.map(arg => pc.bold(arg)))
}
