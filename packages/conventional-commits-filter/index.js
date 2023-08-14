'use strict'

function isMatch (object, source) {
  let aValue
  let bValue

  return Object.keys(source).every((key) => {
    aValue = object[key]
    bValue = source[key]

    if (typeof aValue === 'string') {
      aValue = aValue.trim()
    }

    if (typeof bValue === 'string') {
      bValue = bValue.trim()
    }

    return aValue === bValue
  })
}

function findRevertCommit (commit, reverts) {
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

function conventionalCommitsFilter (commits) {
  if (!Array.isArray(commits)) {
    throw new TypeError('Expected an array')
  }

  const result = []
  const hold = new Set()
  let holdRevertsCount = 0
  let revertCommit

  // loop is prepared for streams/iterators
  for (const commit of commits) {
    revertCommit = findRevertCommit(commit, hold)

    if (revertCommit) {
      hold.delete(revertCommit)
      holdRevertsCount--
      continue
    }

    if (commit.revert) {
      hold.add(commit)
      holdRevertsCount++
      continue
    }

    if (holdRevertsCount > 0) {
      hold.add(commit)
    } else {
      result.push(commit)
    }
  }

  if (hold.size) {
    for (const commit of hold) {
      result.push(commit)
    }
  }

  return result
}

module.exports = conventionalCommitsFilter
