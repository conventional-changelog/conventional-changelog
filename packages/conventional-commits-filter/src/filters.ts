import type { Commit } from './types.js'
import { RevertedCommitsFilter } from './RevertedCommitsFilter.js'

/**
 * Filter reverted commits
 * @param commits
 * @yields Commits without reverted commits
 */
export async function* filterRevertedCommits<
  T extends Commit = Commit
>(
  commits: Iterable<T> | AsyncIterable<T>
) {
  const filter = new RevertedCommitsFilter<T>()

  for await (const commit of commits) {
    yield* filter.process(commit)
  }

  yield* filter.flush()
}

/**
 * Filter reverted commits synchronously
 * @param commits
 * @yields Commits without reverted commits
 */
export function* filterRevertedCommitsSync<
  T extends Commit = Commit
>(
  commits: Iterable<T>
) {
  const filter = new RevertedCommitsFilter<T>()

  for (const commit of commits) {
    yield* filter.process(commit)
  }

  yield* filter.flush()
}
