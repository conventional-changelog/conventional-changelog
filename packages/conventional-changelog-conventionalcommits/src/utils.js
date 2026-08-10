import {
  BREAKING_CHANGE_KEYWORDS,
  isBreakingNote
} from '@conventional-changelog/template'
import { BREAKING_HEADER_PATTERN } from './constants.js'

/**
 * Get commit notes with the breaking change declared by `!` in the header.
 * The parser adds that note only if the commit has no notes at all,
 * so a footer of any other keyword hides the breaking change.
 * @param commit
 * @returns Commit notes.
 */
export function getNotes(commit) {
  if (commit.notes.some(isBreakingNote) || !BREAKING_HEADER_PATTERN.test(commit.header || '')) {
    return commit.notes
  }

  return [
    {
      title: BREAKING_CHANGE_KEYWORDS[0],
      text: commit.subject || ''
    },
    ...commit.notes
  ]
}

function hasIntersection(a, b) {
  if (!a || !b) {
    return false
  }

  let listA = a
  let listB = b

  if (!Array.isArray(listA)) {
    listA = [listA]
  }

  if (!Array.isArray(listB)) {
    listB = [listB]
  }

  return listA.some(item => listB.includes(item))
}

export function matchScope(config = {}, commit) {
  const {
    scope: targetScope,
    scopeOnly = false
  } = config
  const includesScope = hasIntersection(
    commit.scope?.split(','),
    targetScope
  )

  return !targetScope
    || (scopeOnly && includesScope)
    || (!scopeOnly && (!commit.scope || includesScope))
}

export function findTypeEntry(types, commit) {
  const typeKey = (commit.revert ? 'revert' : commit.type || '').toLowerCase()

  return types.find((entry) => {
    if (entry.type !== typeKey) {
      return false
    }

    if (entry.scope && entry.scope !== commit.scope) {
      return false
    }

    return true
  })
}

export function isTypeEffect(type, effect) {
  return (type.effect || 'bump') === effect
}
