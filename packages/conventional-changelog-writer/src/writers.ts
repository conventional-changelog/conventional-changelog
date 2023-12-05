import { Transform } from 'stream'
import type {
  CommitKnownProps,
  TransformedCommit,
  Context,
  Options,
  Details
} from './types/index.js'
import {
  loadTemplates,
  createTemplateRenderer
} from './template.js'
import { getFinalContext } from './context.js'
import {
  getFinalOptions,
  getGenerateOnFunction
} from './options.js'
import { transformCommit } from './commit.js'

/**
 * Creates an async generator of changelog entries from commits.
 * @param commits - Commits to generate changelog from.
 * @param context - Context for changelog template.
 * @param options - Options for changelog template.
 * @param includeDetails - Whether to yield details object instead of changelog entry.
 * @yields Changelog entry.
 */
export function createChangelogAsyncGeneratorFromCommits<Commit extends CommitKnownProps = CommitKnownProps>(
  commits: Iterable<Commit> | AsyncIterable<Commit>,
  context?: Context<Commit>,
  options?: Options<Commit>,
  includeDetails?: false
): AsyncGenerator<string, void>
export function createChangelogAsyncGeneratorFromCommits<Commit extends CommitKnownProps = CommitKnownProps>(
  commits: Iterable<Commit> | AsyncIterable<Commit>,
  context: Context<Commit>,
  options: Options<Commit>,
  includeDetails: true
): AsyncGenerator<Details<Commit>, void>
export function createChangelogAsyncGeneratorFromCommits<Commit extends CommitKnownProps = CommitKnownProps>(
  commits: Iterable<Commit> | AsyncIterable<Commit>,
  context?: Context<Commit>,
  options?: Options<Commit>,
  includeDetails?: boolean
): AsyncGenerator<string | Details<Commit>, void>

export async function* createChangelogAsyncGeneratorFromCommits<Commit extends CommitKnownProps = CommitKnownProps>(
  commits: Iterable<Commit> | AsyncIterable<Commit>,
  context: Context<Commit> = {},
  options: Options<Commit> = {},
  includeDetails = false
): AsyncGenerator<string | Details<Commit>, void> {
  const templates = await loadTemplates(options)
  const finalContext = getFinalContext(context, options)
  const finalOptions = getFinalOptions(options, templates)
  const generateOn = getGenerateOnFunction(finalContext, finalOptions)
  const renderTemplate = createTemplateRenderer(finalContext, finalOptions)
  const {
    transform,
    reverse,
    doFlush
  } = finalOptions
  const prepResult = includeDetails
    ? (log: string, keyCommit: Commit | null) => ({
      log,
      keyCommit
    })
    : (log: string) => log
  let chunk: Commit
  let commit: TransformedCommit<Commit> | null
  let keyCommit: Commit | null
  let commitsGroup: TransformedCommit<Commit>[] = []
  let neverGenerated = true
  let result: string
  let savedKeyCommit: Commit | null = null
  let firstRelease = true

  for await (chunk of commits) {
    commit = await transformCommit(chunk, transform, finalContext, finalOptions)
    keyCommit = commit || chunk

    // previous blocks of logs
    if (reverse) {
      if (commit) {
        commitsGroup.push(commit)
      }

      if (generateOn(keyCommit, commitsGroup)) {
        neverGenerated = false
        result = await renderTemplate(commitsGroup, keyCommit)
        commitsGroup = []

        yield prepResult(result, keyCommit)
      }
    } else {
      if (generateOn(keyCommit, commitsGroup)) {
        neverGenerated = false
        result = await renderTemplate(commitsGroup, savedKeyCommit)
        commitsGroup = []

        if (!firstRelease || doFlush) {
          yield prepResult(result, savedKeyCommit)
        }

        firstRelease = false
        savedKeyCommit = keyCommit
      }

      if (commit) {
        commitsGroup.push(commit)
      }
    }
  }

  if (!doFlush && (reverse || neverGenerated)) {
    return
  }

  result = await renderTemplate(commitsGroup, savedKeyCommit)

  yield prepResult(result, savedKeyCommit)
}

/**
 * Creates a transform stream which takes commits and outputs changelog entries.
 * @param context - Context for changelog template.
 * @param options - Options for changelog template.
 * @param includeDetails - Whether to emit details object instead of changelog entry.
 * @returns Transform stream which takes commits and outputs changelog entries.
 */
export function createChangelogWriterStream<Commit extends CommitKnownProps = CommitKnownProps>(
  context?: Context<Commit>,
  options?: Options<Commit>,
  includeDetails = false
) {
  return Transform.from(
    (commits: AsyncIterable<Commit>) => createChangelogAsyncGeneratorFromCommits(commits, context, options, includeDetails)
  )
}

/**
 * Create a changelog from commits.
 * @param commits - Commits to generate changelog from.
 * @param context - Context for changelog template.
 * @param options - Options for changelog template.
 * @returns Changelog string.
 */
export async function createChangelogFromCommits<Commit extends CommitKnownProps = CommitKnownProps>(
  commits: Iterable<Commit> | AsyncIterable<Commit>,
  context?: Context<Commit>,
  options?: Options<Commit>
) {
  const changelogAsyncGenerator = createChangelogAsyncGeneratorFromCommits(commits, context, options)
  let changelog = ''
  let chunk: string

  for await (chunk of changelogAsyncGenerator) {
    changelog += chunk
  }

  return changelog
}
