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
      if (!commit.tag || typeof commit.tag !== 'string') {
        return undefined
      }

      const shortHash = commit.hash.substring(0, COMMIT_HASH_LENGTH)

      return {
        shortHash
      }
    },
    groupBy: 'tag',
    commitGroupsSort: 'title',
    commitsSort: ['tag', 'message']
  }
}
