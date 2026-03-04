import {
  mainTemplate,
  headerPartial,
  commitPartial
} from './templates.js'

const COMMIT_HASH_LENGTH = 7
const EMOJI_LENGTH = 72

export function createWriterOpts() {
  return {
    mainTemplate,
    headerPartial,
    commitPartial,
    transform: (commit) => {
      if (!commit.emoji || typeof commit.emoji !== 'string') {
        return undefined
      }

      const emoji = commit.emoji.substring(0, EMOJI_LENGTH)
      const emojiLength = emoji.length
      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash
      const shortDesc = typeof commit.shortDesc === 'string'
        ? commit.shortDesc.substring(0, EMOJI_LENGTH - emojiLength)
        : undefined

      return {
        emoji,
        shortHash,
        shortDesc
      }
    },
    groupBy: 'emoji',
    commitGroupsSort: 'title',
    commitsSort: ['emoji', 'shortDesc']
  }
}
