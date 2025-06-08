import { DEFAULT_COMMIT_TYPES } from './constants.js'
import { matchScope } from './utils.js'

export function createWhatBump(config = {}) {
  const {
    types = DEFAULT_COMMIT_TYPES,
    bumpStrict = false
  } = config
  const hiddenTypes = bumpStrict && types.reduce((hiddenTypes, type) => {
    if (type.hidden) {
      hiddenTypes.push(type.type)
    }

    return hiddenTypes
  }, [])

  return function whatBump(commits) {
    let level = 2
    let breakings = 0
    let features = 0
    let bugfixes = 0

    commits.forEach((commit) => {
      if (!matchScope(config, commit)) {
        return
      }

      if (commit.notes.length > 0) {
        breakings += commit.notes.length
        level = 0
      } else
        if (commit.type === 'feat' || commit.type === 'feature') {
          features += 1

          if (level === 2) {
            level = 1
          }
        } else
          if (bumpStrict && !hiddenTypes.includes(commit.type)) {
            bugfixes += 1
          }
    })

    if (config?.preMajor && level < 2) {
      level++
    } else
      if (bumpStrict && level === 2 && !breakings && !features && !bugfixes) {
        return null
      }

    return {
      level,
      reason: breakings === 1
        ? `There is ${breakings} BREAKING CHANGE and ${features} features`
        : `There are ${breakings} BREAKING CHANGES and ${features} features`
    }
  }
}
