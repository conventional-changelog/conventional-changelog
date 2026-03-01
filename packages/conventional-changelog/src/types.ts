import type { Package as NormalizedPackage } from 'normalize-package-data'
import type {
  GetSemverTagsParams,
  GetCommitsParams
} from '@conventional-changelog/git-client'
import type {
  ParserStreamOptions,
  Commit
} from 'conventional-commits-parser'
import type {
  Options as WriterOptions,
  Context,
  FinalContext
} from 'conventional-changelog-writer'
import type {
  HostType,
  HostedGitInfo
} from '@simple-libs/hosted-git-info'

export type {
  Commit,
  HostType,
  HostedGitInfo
}

export type Package = Partial<NormalizedPackage>

export type Logger = (source: string, messages: string | string[]) => void

export type PackageTransform = (pkg: Package) => Package

export type CommitTransformFunction = (commit: Commit, params: Params) => Partial<Commit> | null | Promise<Partial<Commit> | null>

export interface HostOptions {
  issue: string
  commit: string
  referenceActions: string[]
  issuePrefixes: string[]
}

export interface FinalizedContext extends FinalContext {
  currentTag?: string | null
  previousTag?: string | null
  linkCompare?: boolean
}

export interface Preset {
  tags?: GetSemverTagsParams
  commits?: GetCommitsParams
  parser?: ParserStreamOptions
  writer?: WriterOptions
}

export interface Options {
  /**
   * Whether to reset the changelog or not.
   * @default false
   */
  reset?: boolean
  /**
   * Should the log be appended to existing data.
   * @default false
   */
  append?: boolean
  /**
   * How many releases of changelog you want to generate.
   * It counts from the upcoming release.
   * Useful when you forgot to generate any previous changelog.
   * Set to `0` to regenerate all.
   * @default 1
   */
  releaseCount?: number
  /**
   * If this value is `true` and `context.version` equals last release then `context.version` will be changed to `'Unreleased'`.
   */
  outputUnreleased?: boolean
  /**
   * A transform function that applies after the parser and before the writer.
   */
  transformCommit?: CommitTransformFunction
  /**
   * Logger for warnings.
   */
  warn?: Logger
  /**
   * Logger for debug messages.
   */
  debug?: Logger
  /**
   * A function to format date.
   * @param date - Date string or Date object.
   * @returns Final date string.
   */
  formatDate?(date: string | Date): string
}

export interface Params extends Preset {
  commits: GetCommitsParams
  options: Options
  context?: Context
  repository?: Partial<HostedGitInfo> | null
  package?: Package
}
