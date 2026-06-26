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
