import type {
  AnyObject,
  CommitKnownProps,
  CommitTransformFunction,
  FinalContext,
  FinalOptions,
  TransformedCommit
} from './types/index.js'

function preventModifications<T extends AnyObject>(object: T): T {
  return new Proxy(object, {
    get(target, prop: string) {
      const value = target[prop] as unknown

      if (typeof value === 'object' && value !== null) {
        return preventModifications(value)
      }

      return value
    },
    set() {
      throw new Error('Cannot modify immutable object.')
    },
    deleteProperty() {
      throw new Error('Cannot modify immutable object.')
    }
  })
}

/**
 * Apply transformation to commit.
 * @param commit
 * @param transform
 * @param context
 * @param options
 * @returns Transformed commit.
 */
export async function transformCommit<Commit extends CommitKnownProps = CommitKnownProps>(
  commit: Commit,
  transform: CommitTransformFunction<Commit> | null | undefined,
  context: FinalContext<Commit>,
  options: FinalOptions<Commit>
): Promise<TransformedCommit<Commit> | null> {
  let patch: Partial<Commit> | null = {}

  if (typeof transform === 'function') {
    patch = await transform(preventModifications(commit), context, options)

    if (!patch) {
      return null
    }
  }

  return {
    ...commit,
    ...patch,
    raw: commit
  }
}
