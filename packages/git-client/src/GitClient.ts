import {
  spawn,
  stdoutSpawn,
  splitStream,
  getFirstFromStream,
  formatArgs,
  toArray
} from './utils.js'
import type {
  GitLogParams,
  GitCommitParams,
  GitTagParams,
  GitPushParams,
  Arg
} from './types.js'

const SCISSOR = '------------------------ >8 ------------------------'

/**
 * Wrapper around Git CLI.
 */
export class GitClient {
  constructor(
    readonly cwd: string,
    public debug?: ((log: string[]) => void) | undefined
  ) {}

  private formatArgs(...args: Arg[]) {
    const finalArgs = formatArgs(...args)

    if (this.debug) {
      this.debug(finalArgs)
    }

    return finalArgs
  }

  /**
   * Initialize a new git repository.
   * @returns Boolean result.
   */
  async init() {
    try {
      await spawn('git', ['init'], {
        cwd: this.cwd
      })

      return true
    } catch (err) {
      return false
    }
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
  async* getRawCommits(params: GitLogParams = {}) {
    const {
      path,
      from = '',
      to = 'HEAD',
      format = '%B',
      ignore,
      reverse,
      merges,
      since
    } = params
    const shouldNotIgnore = ignore
      ? (chunk: string) => !ignore.test(chunk)
      : () => true
    const args = this.formatArgs(
      'log',
      `--format=${format}%n${SCISSOR}`,
      since && `--since=${since instanceof Date ? since.toISOString() : since}`,
      reverse && '--reverse',
      merges && '--merges',
      merges === false && '--no-merges',
      [from, to].filter(Boolean).join('..'),
      ...path ? ['--', ...toArray(path)] : []
    )
    const stdout = stdoutSpawn('git', args, {
      cwd: this.cwd
    })
    const commitsStream = splitStream(stdout, `${SCISSOR}\n`)
    let chunk: string

    for await (chunk of commitsStream) {
      if (shouldNotIgnore(chunk)) {
        yield chunk
      }
    }
  }

  /**
   * Get tags stream.
   * @yields Tags
   */
  async* getTags() {
    const tagRegex = /tag:\s*(.+?)[,)]/gi
    const args = this.formatArgs(
      'log',
      '--decorate',
      '--no-color',
      '--date-order'
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
   * Get last tag.
   * @returns Last tag, `null` if not found.
   */
  async getLastTag() {
    return getFirstFromStream(this.getTags())
  }

  /**
   * Check file is ignored via .gitignore.
   * @param file - Path to target file.
   * @returns Boolean value.
   */
  async checkIgnore(file: string) {
    const args = this.formatArgs(
      'check-ignore',
      '--',
      file
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
   */
  async add(files: string | string[]) {
    const args = this.formatArgs(
      'add',
      '--',
      ...toArray(files)
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
   * @param params.allowEmpty
   * @param params.message
   */
  async commit(params: GitCommitParams) {
    const {
      verify = true,
      sign = false,
      files = [],
      allowEmpty = false,
      message
    } = params
    const args = this.formatArgs(
      'commit',
      !verify && '--no-verify',
      sign && '-S',
      allowEmpty && '--allow-empty',
      '-m',
      message,
      '--',
      ...files
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
  async tag(params: GitTagParams) {
    let {
      sign = false,
      name,
      message
    } = params

    if (sign) {
      message = ''
    }

    const args = this.formatArgs(
      'tag',
      sign && '-s',
      message && '-a',
      ...message ? ['-m', message] : [],
      '--',
      name
    )

    await spawn('git', args, {
      cwd: this.cwd
    })
  }

  /**
   * Get current branch name.
   * @returns Current branch name.
   */
  async getCurrentBranch() {
    const args = this.formatArgs(
      'rev-parse',
      '--abbrev-ref',
      'HEAD'
    )
    const branch = (
      await spawn('git', args, {
        cwd: this.cwd
      })
    ).toString().trim()

    return branch
  }

  /**
   * Get default branch name.
   * @returns Default branch name.
   */
  async getDefaultBranch() {
    const args = this.formatArgs(
      'rev-parse',
      '--abbrev-ref',
      'origin/HEAD'
    )
    const branch = (
      await spawn('git', args, {
        cwd: this.cwd
      })
    ).toString().trim().replace(/^origin\//, '')

    return branch
  }

  /**
   * Push changes to remote.
   * @param branch
   * @param params
   * @param params.verify
   */
  async push(
    branch: string,
    params: GitPushParams = {}
  ) {
    const {
      verify = true,
      tags = false,
      followTags = false
    } = params
    const args = this.formatArgs(
      'push',
      followTags && '--follow-tags',
      tags && '--tags',
      !verify && '--no-verify',
      'origin',
      '--',
      branch
    )

    await spawn('git', args, {
      cwd: this.cwd
    })
  }

  /**
   * Verify rev exists.
   * @param rev
   * @param safe - If `true`, will not throw error if rev not found.
   * @returns Target hash.
   */
  async verify(rev: string, safe?: boolean) {
    const args = this.formatArgs(
      'rev-parse',
      '--verify',
      rev
    )
    let git = spawn('git', args, {
      cwd: this.cwd
    })

    if (safe) {
      git = git.catch(() => Buffer.from(''))
    }

    return (
      await git
    ).toString().trim()
  }

  /**
   * Get config value by key.
   * @param key - Config key.
   * @returns Config value.
   */
  async getConfig(key: string) {
    const args = this.formatArgs(
      'config',
      '--get',
      '--',
      key
    )

    return (
      await spawn('git', args, {
        cwd: this.cwd
      })
    ).toString().trim()
  }
}
