const fs = require('fs/promises')
const pc = require('picocolors')
const conventionalChangelogCore = require('conventional-changelog-core')
const angular = require('conventional-changelog-angular')
const { tick } = require('./figures')

function conventionalChangelog (options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  options = options || {}
  options.config = angular

  return conventionalChangelogCore(options, context, gitRawCommitsOpts, parserOpts, writerOpts)
}

async function createIfMissing (infile) {
  try {
    await fs.access(infile, fs.F_OK)
  } catch (err) {
    if (err.code === 'ENOENT') {
      checkpoint('created %s', [infile])
      await fs.writeFile(infile, '\n', 'utf-8')
    }
  }
}

function checkpoint (msg, args) {
  console.info(`${pc.green(tick)} ${msg}`, ...args.map(arg => pc.bold(arg)))
}

module.exports = conventionalChangelog
module.exports.createIfMissing = createIfMissing
module.exports.checkpoint = checkpoint
