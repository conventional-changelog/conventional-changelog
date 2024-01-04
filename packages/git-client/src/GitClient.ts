import {
  spawn,
  stdoutSpawn,
  splitStream
} from './utils.js'
import type {
  GitLogParams,
  GitCommitParams,
  GitTagParams
} from './types.js'

const SCISSOR = '------------------------ >8 ------------------------'

/**
 * Wrapper around Git CLI.
 */
export class GitClient {
  constructor(readonly cwd: string) {}

  /**
   * Get raw commits stream.
   * @param params
   * @param params.path - Read commits from specific path.
   * @param params.from - Start commits range.
   * @param params.to - End commits range.
   * @param params.format - Commits format.
   * @param restRawArgs - Additional raw git arguments.
   * @yields Raw commits data.
   */
  async* getRawCommits(params: GitLogParams = {}, restRawArgs: string[] = []) {
    const {
      path,
      from = '',
      to = 'HEAD',
      format = '%B'
    } = params
    const stdout = stdoutSpawn('git', ['log'].concat(
      `--format=${format}%n${SCISSOR}`,
      [from, to].filter(Boolean).join('..'),
      restRawArgs,
      path ? ['--', path] : ''
    ).filter(Boolean), {
      cwd: this.cwd
    })
    const commitsStream = splitStream(stdout, `${SCISSOR}\n`)
    let chunk: string

    for await (chunk of commitsStream) {
      chunk = chunk.trim()

      if (chunk) {
        yield chunk
      }
    }
  }

  /**
   * Get tags stream.
   * @param restRawArgs - Additional raw git arguments.
   * @yields Tags
   */
  async* getTags(restRawArgs: string[] = []) {
    const tagRegex = /tag:\s*(.+?)[,)]/gi
    const stdout = stdoutSpawn('git', [
      'log',
      '--decorate',
      '--no-color',
      '--date-order',
      ...restRawArgs
    ], {
      cwd: this.cwd
    })
    const tagsStream = splitStream(stdout, `${SCISSOR}\n`)
    let chunk: string
    let matches: IterableIterator<RegExpMatchArray>
    let tag: string

    for await (chunk of tagsStream) {
      matches = chunk.trim().matchAll(tagRegex)

      for ([, tag] of matches) {
        yield tag
      }
    }
  }

  /**
   * Check file is ignored via .gitignore.
   * @param file - Path to target file.
   * @param restRawArgs - Additional raw git arguments.
   * @returns Boolean value.
   */
  async checkIgnore(file: string, restRawArgs: string[] = []) {
    const output = await spawn('git', [
      'check-ignore',
      file,
      ...restRawArgs
    ], {
      cwd: this.cwd
    })

    return Boolean(output)
  }

  /**
   * Add files to git index.
   * @param files - Files to stage.
   * @param restRawArgs - Additional raw git arguments.
   */
  async add(files: string | string[], restRawArgs: string[] = []) {
    await spawn('git', ['add'].concat(files, restRawArgs), {
      cwd: this.cwd
    })
  }

  /**
   * Commit changes.
   * @param params
   * @param params.verify
   * @param params.sign
   * @param params.files
   * @param params.message
   * @param restRawArgs - Additional raw git arguments.
   */
  async commit(params: GitCommitParams, restRawArgs: string[] = []) {
    const {
      verify = true,
      sign = false,
      files = [],
      message
    } = params

    await spawn('git', ['commit'].concat(
      verify ? '' : '--no-verify',
      sign ? '-S' : '',
      files,
      '-m',
      message,
      restRawArgs
    ).filter(Boolean), {
      cwd: this.cwd
    })
  }

  /**
   * Create a tag for the current commit.
   * @param params
   * @param params.sign
   * @param params.name
   * @param params.message
   * @param restRawArgs - Additional raw git arguments.
   */
  async tag(params: GitTagParams, restRawArgs: string[] = []) {
    let {
      sign = false,
      name,
      message
    } = params

    if (sign) {
      message = ''
    }

    await spawn('git', ['tag'].concat(
      sign ? ['-s'] : [],
      message ? ['-a'] : [],
      name,
      message ? ['-m', message] : [],
      restRawArgs
    ), {
      cwd: this.cwd
    })
  }

  /**
   * Get current branch name.
   * @param restRawArgs - Additional raw git arguments.
   * @returns Current branch name.
   */
  async getCurrentBranch(restRawArgs: string[] = []) {
    const branch = await spawn('git', [
      'rev-parse',
      '--abbrev-ref',
      'HEAD',
      ...restRawArgs
    ], {
      cwd: this.cwd
    })

    return branch.trim()
  }

  /**
   * Push changes to remote.
   * @param branch
   * @param restRawArgs - Additional raw git arguments.
   */
  async push(branch: string, restRawArgs: string[] = []) {
    await spawn('git', [
      'push',
      '--follow-tags',
      'origin',
      branch,
      ...restRawArgs
    ], {
      cwd: this.cwd
    })
  }
}
