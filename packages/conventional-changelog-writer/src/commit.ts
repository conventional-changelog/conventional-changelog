import type {
  AnyObject,
  TransformedCommit
} from './types/index.js'

function preventModifications<T extends AnyObject>(object: T): T {
  return new Proxy(object, {
    get(target, prop: string) {
      const value = target[prop] as unknown

      // https://github.com/conventional-changelog/conventional-changelog/pull/1285
      if (value instanceof Date) {
        return value
      }

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
 * @param args - Additional arguments for transformation function.
 * @returns Transformed commit.
 */
export async function transformCommit<Commit extends AnyObject, Args extends unknown[]>(
  commit: Commit,
  transform: ((commit: Commit, ...args: Args) => Partial<Commit> | null | Promise<Partial<Commit> | null>) | null | undefined,
  ...args: Args
): Promise<TransformedCommit<Commit> | null> {
  if (typeof transform === 'function') {
    const patch = await transform(preventModifications(commit), ...args)

    if (patch) {
      return {
        ...commit,
        ...patch,
        raw: commit
      }
    }

    return null
  }

  return commit
}
