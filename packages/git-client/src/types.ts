export interface GitLogParams {
  /**
   * Read commits from specific path.
   */
  path?: string
  /**
   * Start commits range.
   */
  from?: string
  /**
   * End commits range.
   */
  to?: string
  /**
   * Commits format.
   */
  format?: string
}

export interface ConventionalGitLogParams extends GitLogParams {
  /**
   * Enable revert commits filter.
   */
  filterReverts?: boolean
}

export interface GitCommitParams {
  verify?: boolean
  sign?: boolean
  files?: string[]
  message: string
}

export interface GitTagParams {
  sign?: boolean
  name: string
  message?: string
}

export interface GitTagsLogParams {
  /**
   * Get semver tags with specific prefix.
   */
  prefix?: string
  /**
   * Skip semver tags with unstable versions.
   */
  skipUnstable?: boolean
  /**
   * Clean version from prefix and trash.
   */
  clean?: boolean
}
