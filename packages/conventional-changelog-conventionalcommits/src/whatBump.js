import { DEFAULT_COMMIT_TYPES } from './constants.js'
import {
  findTypeEntry,
  isTypeEffect,
  matchScope
} from './utils.js'

export function createWhatBump(config = {}) {
  const { types = DEFAULT_COMMIT_TYPES } = config

  return function whatBump(commits) {
    let level = null
    let breakings = 0
    let features = 0

    commits.forEach((commit) => {
      if (!matchScope(config, commit)) {
        return
      }

      const entry = findTypeEntry(types, commit)

      if (commit.notes.length > 0) {
        breakings += commit.notes.length
        level = 0
      } else
        if (entry && isTypeEffect(entry, 'bump')) {
          if (level === null) {
            level = 2
          }

          if (commit.type === 'feat' || commit.type === 'feature') {
            features += 1

            if (level > 1) {
              level = 1
            }
          }
        }
    })

    if (level === null) {
      return null
    }

    if (config?.preMajor && level < 2) {
      level++
    }

    return {
      level,
      reason: breakings === 1
        ? `There is ${breakings} BREAKING CHANGE and ${features} features`
        : `There are ${breakings} BREAKING CHANGES and ${features} features`
    }
  }
}
