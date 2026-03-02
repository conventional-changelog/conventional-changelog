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
      if (!commit.pr) {
        return undefined
      }

      let { tag } = commit

      if (commit.tag === 'BUGFIX') {
        tag = 'Bug Fixes'
      } else if (commit.tag === 'CLEANUP') {
        tag = 'Cleanup'
      } else if (commit.tag === 'FEATURE') {
        tag = 'Features'
      } else if (commit.tag === 'DOC') {
        tag = 'Documentation'
      } else if (commit.tag === 'SECURITY') {
        tag = 'Security'
      } else {
        return undefined
      }

      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash

      return {
        tag,
        shortHash
      }
    },
    groupBy: 'tag',
    commitGroupsSort: 'title',
    commitsSort: [
      'tag',
      'taggedAs',
      'message'
    ]
  }
}
