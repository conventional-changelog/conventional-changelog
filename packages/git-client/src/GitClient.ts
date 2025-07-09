import { spawn } from 'child_process'
import {
  firstFromStream,
  splitStream
} from '@simple-libs/stream-utils'
import {
  output,
  outputStream
} from '@simple-libs/child-process-utils'
import {
  formatArgs,
  toArray
} from './utils.js'
import type {
  GitLogParams,
  GitLogTagsParams,
  GitCommitParams,
  GitTagParams,
  GitPushParams,
  GitFetchParams,
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
   * Raw exec method to run git commands.
   * @param args
   * @returns Stdout string output of the command.
   */
  async exec(...args: Arg[]) {
    return (
      await output(spawn('git', this.formatArgs(...args), {
        cwd: this.cwd
      }))
    ).toString().trim()
  }

  /**
   * Raw exec method to run git commands with stream output.
   * @param args
   * @returns Stdout stream of the command.
   */
  execStream(...args: Arg[]) {
    return outputStream(spawn('git', this.formatArgs(...args), {
      cwd: this.cwd
    }))
  }

  /**
   * Initialize a new git repository.
   * @returns Boolean result.
   */
  async init() {
    try {
      await this.exec('init')

      return true
    } catch {
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
    const stdout = this.execStream(
      'log',
      `--format=${format}%n${SCISSOR}`,
      since && `--since=${since instanceof Date ? since.toISOString() : since}`,
      reverse && '--reverse',
      merges && '--merges',
      merges === false && '--no-merges',
      [from, to].filter(Boolean).join('..'),
      ...path ? ['--', ...toArray(path)] : []
    )
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
   * @param params
   * @yields Tags
   */
  async* getTags(params: GitLogTagsParams = {}) {
    const {
      path,
      from = '',
      to = 'HEAD',
      since
    } = params
    const tagRegex = /tag:\s*(.+?)[,)]/gi
    const stdout = this.execStream(
      'log',
      '--decorate',
      '--no-color',
      '--date-order',
      since && `--since=${since instanceof Date ? since.toISOString() : since}`,
      [from, to].filter(Boolean).join('..'),
      ...path ? ['--', ...toArray(path)] : []
    )
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
   * @param params
   * @returns Last tag, `null` if not found.
   */
  async getLastTag(params?: GitLogTagsParams) {
    return firstFromStream(this.getTags(params))
  }

  /**
   * Check file is ignored via .gitignore.
   * @param file - Path to target file.
   * @returns Boolean value.
   */
  async checkIgnore(file: string) {
    try {
      await this.exec(
        'check-ignore',
        '--',
        file
      )

      return true
    } catch {
      return false
    }
  }

  /**
   * Add files to git index.
   * @param files - Files to stage.
   */
  async add(files: string | string[]) {
    await this.exec(
      'add',
      '--',
      ...toArray(files)
    )
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

    await this.exec(
      'commit',
      !verify && '--no-verify',
      sign && '-S',
      allowEmpty && '--allow-empty',
      '-m',
      message,
      '--',
      ...files
    )
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

    await this.exec(
      'tag',
      sign && '-s',
      message && '-a',
      ...message ? ['-m', message] : [],
      '--',
      name
    )
  }

  /**
   * Get current branch name.
   * @returns Current branch name.
   */
  async getCurrentBranch() {
    const branch = await this.exec(
      'rev-parse',
      '--abbrev-ref',
      'HEAD'
    )

    return branch
  }

  /**
   * Get default branch name.
   * @returns Default branch name.
   */
  async getDefaultBranch() {
    const branch = (
      await this.exec(
        'rev-parse',
        '--abbrev-ref',
        'origin/HEAD'
      )
    ).replace(/^origin\//, '')

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
      followTags = false,
      force = false
    } = params

    await this.exec(
      'push',
      followTags && '--follow-tags',
      tags && '--tags',
      !verify && '--no-verify',
      force && '--force',
      'origin',
      '--',
      branch
    )
  }

  /**
   * Verify rev exists.
   * @param rev
   * @param safe - If `true`, will not throw error if rev not found.
   * @returns Target hash.
   */
  async verify(rev: string, safe?: boolean) {
    let git = this.exec(
      'rev-parse',
      '--verify',
      rev
    )

    if (safe) {
      git = git.catch(() => '')
    }

    return await git
  }

  /**
   * Get config value by key.
   * @param key - Config key.
   * @returns Config value.
   */
  async getConfig(key: string) {
    return await this.exec(
      'config',
      '--get',
      '--',
      key
    )
  }

  /**
   * Set config value by key.
   * @param key - Config key.
   * @param value - Config value.
   */
  async setConfig(key: string, value: string) {
    await this.exec(
      'config',
      '--',
      key,
      value
    )
  }

  /**
   * Fetch changes from remote.
   * @param params
   */
  async fetch(params: GitFetchParams = {}) {
    const {
      prune = false,
      unshallow = false,
      tags = false,
      all = false,
      remote,
      branch
    } = params

    await this.exec(
      'fetch',
      prune && '--prune',
      unshallow && '--unshallow',
      tags && '--tags',
      all && '--all',
      ...remote && branch
        ? [
          '--',
          remote,
          branch
        ]
        : []
    )
  }

  /**
   * Create a new branch.
   * @param branch - Branch name.
   */
  async createBranch(branch: string) {
    await this.exec(
      'checkout',
      '-b',
      branch
    )
  }

  /**
   * Delete a branch.
   * @param branch - Branch name.
   */
  async deleteBranch(branch: string) {
    await this.exec(
      'branch',
      '-D',
      '--',
      branch
    )
  }

  /**
   * Checkout a branch.
   * @param branch - Branch name.
   */
  async checkout(branch: string) {
    await this.exec(
      'checkout',
      branch
    )
  }
}
