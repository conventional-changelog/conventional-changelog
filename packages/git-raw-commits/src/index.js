import { Readable } from 'stream'
import { GitClient } from '@conventional-changelog/git-client'

function getFinalOptions (options = {}) {
  const finalOptions = {
    cwd: process.cwd(),
    ...options
  }

  if (options.debug) {
    finalOptions.debug = (args) => {
      options.debug('Your git-log command is:\ngit ' + args.join(' '))
    }
  }

  return finalOptions
}

/**
 * Get raw commits from git-log.
 * @param {*} options
 * @param {string} [options.cwd=process.cwd()] - Current working directory to run git.
 * @param {false | ((log: string) => void)} [options.debug=false] - A function to get debug information.
 * @param {string | RegExp} [options.ignore] - Ignore commits that match provided string or RegExp.
 * @param {string | string[]} [options.path] - Only commits that are modifying this path.
 * @param {string} [options.from=''] - Starting commit reference or hash.
 * @param {string} [options.to='HEAD'] - Ending commit reference or hash.
 * @param {string} [options.format='%B'] - Format of the commit.
 * @yields {string} - Raw commit.
 */
export async function * getRawCommits (options) {
  const { cwd, debug, ignore, ...finalOptions } = getFinalOptions(options)
  const ignoreRegex = typeof ignore === 'string'
    ? new RegExp(ignore)
    : ignore
  const shouldNotIgnore = ignoreRegex
    ? chunk => !ignoreRegex.test(chunk.toString())
    : () => true
  const client = new GitClient(cwd, debug)
  let commit

  for await (commit of client.getRawCommits(finalOptions)) {
    if (shouldNotIgnore(commit)) {
      yield commit
    }
  }
}

/**
 * Get raw commits stream from git-log.
 * @param {*} options
 * @param {string} [options.cwd=process.cwd()] - Current working directory to run git.
 * @param {false | ((log: string) => void)} [options.debug=false] - A function to get debug information.
 * @param {string | RegExp} [options.ignore] - Ignore commits that match provided string or RegExp.
 * @param {string | string[]} [options.path] - Only commits that are modifying this path.
 * @param {string} [options.from=''] - Starting commit reference or hash.
 * @param {string} [options.to='HEAD'] - Ending commit reference or hash.
 * @param {string} [options.format='%B'] - Format of the commit.
 * @returns {Readable} - Raw commits stream.
 */
export function getRawCommitsStream (options) {
  return Readable.from(getRawCommits(options))
}
