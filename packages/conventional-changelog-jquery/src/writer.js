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
      if (!commit.component || typeof commit.component !== 'string') {
        return undefined
      }

      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash
      const references = commit.references.map(reference => ({
        ...reference,
        originalIssueTracker: reference.prefix === '#'
          ? 'https://bugs.jquery.com/ticket/'
          : reference.originalIssueTracker
      }))

      return {
        shortHash,
        references
      }
    },
    groupBy: 'component',
    commitGroupsSort: 'title',
    commitsSort: ['component', 'shortDesc']
  }
}
