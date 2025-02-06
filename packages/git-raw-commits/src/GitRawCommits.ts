import { Readable } from 'stream'
import { GitClient } from '@conventional-changelog/git-client'
import type { GitRawCommitsOptions, GitClientOptions } from './types.js'

function getFinalOptions(options?: GitRawCommitsOptions) {
  const finalOptions = {
    ...options
  } as GitClientOptions

  if (typeof options?.debug === 'function') {
    const debugFn = options.debug

    finalOptions.debug = (args: string[]) => {
      debugFn(`Your git-log command is:\ngit ${args.join(' ')}`)
    }
  }

  return finalOptions
}

/**
 * Get raw commits from git-log.
 * @param options
 * @param options.cwd - Current working directory to run git.
 * @param options.debug - A function to get debug information.
 * @param options.ignore - Ignore commits that match provided string or RegExp.
 * @param options.path - Only commits that are modifying this path.
 * @param options.from - Starting commit reference or hash.
 * @param options.to - Ending commit reference or hash.
 * @param options.format - Format of the commit.
 * @yields Raw commit.
 */
export async function* getRawCommits(options?: GitRawCommitsOptions) {
  const { cwd, debug, ...finalOptions } = getFinalOptions(options)
  const client = new GitClient(cwd || process.cwd(), debug)
  let commit

  if (typeof finalOptions.ignore === 'string') {
    finalOptions.ignore = new RegExp(finalOptions.ignore)
  }

  for await (commit of client.getRawCommits(finalOptions)) {
    yield commit
  }
}

/**
 * Get raw commits stream from git-log.
 * @param options
 * @param options.cwd - Current working directory to run git.
 * @param options.debug - A function to get debug information.
 * @param options.ignore - Ignore commits that match provided string or RegExp.
 * @param options.path - Only commits that are modifying this path.
 * @param options.from - Starting commit reference or hash.
 * @param options.to - Ending commit reference or hash.
 * @param options.format - Format of the commit.
 * @returns Raw commits stream.
 */
export function getRawCommitsStream(options: GitRawCommitsOptions) {
  return Readable.from(getRawCommits(options))
}
