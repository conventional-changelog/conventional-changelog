import { mainTemplate, headerPartial, commitPartial } from './templates.js'

const COMMIT_HASH_LENGTH = 7

export function createWriterOpts() {
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = mainTemplate
  writerOpts.headerPartial = headerPartial
  writerOpts.commitPartial = commitPartial

  return writerOpts
}

function getWriterOpts() {
  return {
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
