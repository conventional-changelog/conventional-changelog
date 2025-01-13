export interface GitLogParams {
  /**
   * Read commits from specific path.
   */
  path?: string | string[]
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
  /**
   * Pattern to filter commits.
   */
  ignore?: RegExp
  /**
   * Get commits since specific date.
   */
  since?: Date | string
  /**
   * Get commits in reverse order.
   */
  reverse?: boolean
  /**
   * Get merge commits or not.
   */
  merges?: boolean
}

export interface GetCommitsParams extends GitLogParams {
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

export interface GetSemverTagsParams {
  /**
   * Get semver tags with specific prefix.
   */
  prefix?: string | RegExp
  /**
   * Skip semver tags with unstable versions.
   */
  skipUnstable?: boolean
  /**
   * Clean version from prefix and trash.
   */
  clean?: boolean
}

export type Arg = string | false | null | undefined
