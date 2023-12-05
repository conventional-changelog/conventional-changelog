import type {
  AnyObject,
  Commit
} from './types.js'

/**
 * Match commit with revert data
 * @param object - Commit object
 * @param source - Revert data
 * @returns `true` if commit matches revert data, otherwise `false`
 */
export function isMatch(
  object: AnyObject,
  source: AnyObject
) {
  let aValue: unknown
  let bValue: unknown

  for (const key in source) {
    aValue = object[key]
    bValue = source[key]

    if (typeof aValue === 'string') {
      aValue = aValue.trim()
    }

    if (typeof bValue === 'string') {
      bValue = bValue.trim()
    }

    if (aValue !== bValue) {
      return false
    }
  }

  return true
}

/**
 * Find revert commit in set
 * @param commit
 * @param reverts
 * @returns Revert commit if found, otherwise `null`
 */
export function findRevertCommit<T extends Commit>(commit: T, reverts: Set<T>) {
  if (!reverts.size) {
    return null
  }

  const rawCommit = commit.raw || commit

  for (const revertCommit of reverts) {
    if (revertCommit.revert && isMatch(rawCommit, revertCommit.revert)) {
      return revertCommit
    }
  }

  return null
}
