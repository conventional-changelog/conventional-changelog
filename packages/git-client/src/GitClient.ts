import {
  spawn,
  stdoutSpawn,
  splitStream,
  formatArgs
} from './utils.js'
import type {
  GitLogParams,
  GitCommitParams,
  GitTagParams,
  Params,
  Arg
} from './types.js'

const SCISSOR = '------------------------ >8 ------------------------'

/**
 * Wrapper around Git CLI.
 */
export class GitClient {
  constructor(
    readonly cwd: string,
    private readonly debug: ((log: string[]) => void) | false = false
  ) {}

  private formatArgs(...args: Arg[]) {
    const finalArgs = formatArgs(...args)

    if (this.debug) {
      this.debug(finalArgs)
    }

    return finalArgs
  }

  /**
   * Get raw commits stream.
   * @param params
   * @param params.path - Read commits from specific path.
   * @param params.from - Start commits range.
   * @param params.to - End commits range.
   * @param params.format - Commits format.
   * @yields Raw commits data.
   */
  async* getRawCommits(params: GitLogParams & Params = {}) {
    const {
      path,
      from = '',
      to = 'HEAD',
      format = '%B',
      ...restParams
    } = params
    const args = this.formatArgs(
      'log',
      `--format=${format}%n${SCISSOR}`,
      [from, to].filter(Boolean).join('..'),
      restParams,
      path && ['--', path]
    )
    const stdout = stdoutSpawn('git', args, {
      cwd: this.cwd
    })
    const commitsStream = splitStream(stdout, `${SCISSOR}\n`)
    let chunk: string

    for await (chunk of commitsStream) {
      yield chunk
    }
  }

  /**
   * Get tags stream.
   * @param params - Additional git params.
   * @yields Tags
   */
  async* getTags(params: Params = {}) {
    const tagRegex = /tag:\s*(.+?)[,)]/gi
    const args = this.formatArgs(
      'log',
      '--decorate',
      '--no-color',
      '--date-order',
      params
    )
    const stdout = stdoutSpawn('git', args, {
      cwd: this.cwd
    })
    let chunk: Buffer
    let matches: IterableIterator<RegExpMatchArray>
    let tag: string

    for await (chunk of stdout) {
      matches = chunk.toString().trim().matchAll(tagRegex)

      for ([, tag] of matches) {
        yield tag
      }
    }
  }

  /**
   * Check file is ignored via .gitignore.
   * @param file - Path to target file.
   * @param params - Additional git params.
   * @returns Boolean value.
   */
  async checkIgnore(file: string, params: Params = {}) {
    const args = this.formatArgs(
      'check-ignore',
      file,
      params
    )

    try {
      await spawn('git', args, {
        cwd: this.cwd
      })

      return true
    } catch (err) {
      return false
    }
  }

  /**
   * Add files to git index.
   * @param files - Files to stage.
   * @param params - Additional git params.
   */
  async add(files: string | string[], params: Params = {}) {
    const args = this.formatArgs(
      'add',
      files,
      params
    )

    await spawn('git', args, {
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
   */
  async commit(params: GitCommitParams & Params) {
    const {
      verify = true,
      sign = false,
      files = [],
      message,
      ...restParams
    } = params
    const args = this.formatArgs(
      'commit',
      !verify && '--no-verify',
      sign && '-S',
      files,
      '-m',
      message,
      restParams
    )

    await spawn('git', args, {
      cwd: this.cwd
    })
  }

  /**
   * Create a tag for the current commit.
   * @param params
   * @param params.sign
   * @param params.name
   * @param params.message
   */
  async tag(params: GitTagParams & Params) {
    let {
      sign = false,
      name,
      message,
      ...restParams
    } = params

    if (sign) {
      message = ''
    }

    const args = this.formatArgs(
      'tag',
      sign && '-s',
      message && '-a',
      name,
      message && ['-m', message],
      restParams
    )

    await spawn('git', args, {
      cwd: this.cwd
    })
  }

  /**
   * Get current branch name.
   * @param params - Additional git params.
   * @returns Current branch name.
   */
  async getCurrentBranch(params: Params = {}) {
    const args = this.formatArgs(
      'rev-parse',
      '--abbrev-ref',
      'HEAD',
      params
    )
    const branch = (
      await spawn('git', args, {
        cwd: this.cwd
      })
    ).toString().trim()

    return branch
  }

  /**
   * Push changes to remote.
   * @param branch
   * @param params - Additional git params.
   */
  async push(branch: string, params: Params = {}) {
    const args = this.formatArgs(
      'push',
      '--follow-tags',
      'origin',
      branch,
      params
    )

    await spawn('git', args, {
      cwd: this.cwd
    })
  }
}
