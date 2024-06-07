import type {
  AnyObject,
  CommitKnownProps,
  CommitTransformFunction,
  FinalContext,
  FinalOptions,
  TransformedCommit
} from './types/index.js'

function preventModifications<T extends AnyObject>(object: T): T {
  // This condition checks if the object is an instance of Date. The issue with Date objects arises when JavaScript tries to convert a Date object to a string (like when you're using template literals or calling toISOString). 
  // JavaScript internally tries to access and modify some properties of the Date object during this conversion. However, if the Date object is made immutable by a function like preventModifications, these operations throw an error. 
  // The error thrown is: "semantic-release: TypeError: Method Date.prototype.toString called on incompatible receiver [object Date]". 
  // By returning the object if it's an instance of Date, we avoid this error.
  if (object instanceof Date) {
    return object;
  }
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
