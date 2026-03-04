import {
  mainTemplate,
  headerPartial,
  commitPartial
} from './templates.js'

const COMMIT_HASH_LENGTH = 7

export function createWriterOpts() {
  return {
    mainTemplate,
    headerPartial,
    commitPartial,
    transform: (commit) => {
      if (!commit.language) {
        return undefined
      }

      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash

      return {
        shortHash
      }
    },
    groupBy: 'language',
    commitGroupsSort: 'title',
    commitsSort: [
      'language',
      'type',
      'message'
    ]
  }
}
