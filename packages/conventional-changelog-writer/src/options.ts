import { valid as semverValid } from 'semver'
import type {
  Options,
  FinalTemplatesOptions,
  FinalOptions,
  FinalContext,
  CommitKnownProps,
  SortBy,
  PickStrings
} from './types/index.js'
import {
  formatDate,
  createComparator
} from './utils.js'

const HASH_SHORT_LENGTH = 7
const HEADER_MAX_LENGTH = 100

/**
 * Default commit transform function.
 * @param commit
 * @param _context
 * @param options
 * @param options.timeZone - Time zone for date formatting.
 * @returns Patch object for commit.
 */
export function defaultCommitTransform<Commit extends CommitKnownProps = CommitKnownProps>(
  commit: Commit,
  _context?: unknown,
  options?: { timeZone?: string }
) {
  const {
    hash,
    header,
    committerDate
  } = commit

  return {
    hash: typeof hash === 'string'
      ? hash.substring(0, HASH_SHORT_LENGTH)
      : hash,
    header: typeof header === 'string'
      ? header.substring(0, HEADER_MAX_LENGTH)
      : header,
    committerDate: committerDate
      ? formatDate(committerDate, options?.timeZone)
      : committerDate
  } as Partial<Commit>
}

/**
 * Get final options object.
 * @param options
 * @param templates
 * @returns Final options object.
 */
export function getFinalOptions<Commit extends CommitKnownProps = CommitKnownProps>(
  options: Options<Commit>,
  templates: FinalTemplatesOptions
) {
  const prefinalOptions = {
    groupBy: 'type' as const,
    commitsSort: 'header' as const,
    noteGroupsSort: 'title' as const,
    notesSort: 'text' as const,
    transform: defaultCommitTransform,
    generateOn: (commit: Commit) => Boolean(semverValid(commit.version)),
    finalizeContext: (context: FinalContext<Commit>) => context,
    debug: () => { /* noop */ },
    reverse: false,
    ignoreReverted: true,
    doFlush: true,
    ...templates,
    ...options
  }
  const finalOptions = {
    ...prefinalOptions,
    commitGroupsSort: createComparator(prefinalOptions.commitGroupsSort),
    commitsSort: createComparator(prefinalOptions.commitsSort as SortBy<PickStrings<Commit>>),
    noteGroupsSort: createComparator(prefinalOptions.noteGroupsSort),
    notesSort: createComparator(prefinalOptions.notesSort)
  } as FinalOptions<Commit>

  return finalOptions
}

/**
 * Get final context object.
 * @param context
 * @param options
 * @returns Final context object.
 */
export function getGenerateOnFunction<Commit extends CommitKnownProps = CommitKnownProps>(
  context: FinalContext<Commit>,
  options: FinalOptions<Commit>
) {
  const { generateOn } = options

  if (typeof generateOn === 'string') {
    return (commit: Commit) => typeof commit[generateOn] !== 'undefined'
  } else if (typeof generateOn !== 'function') {
    return () => false
  }

  return (keyCommit: Commit, commitsGroup: Commit[]) => generateOn(keyCommit, commitsGroup, context, options)
}
