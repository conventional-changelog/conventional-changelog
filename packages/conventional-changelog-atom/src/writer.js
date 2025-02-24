import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(new URL('.', import.meta.url))
const COMMIT_HASH_LENGTH = 7
const EMOJI_LENGTH = 72

function getWriterOpts() {
  return {
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

export async function createWriterOpts() {
  const [
    template,
    header,
    commit
  ] = await Promise.all([
    readFile(resolve(dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/commit.hbs'), 'utf-8')
  ])
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = template
  writerOpts.headerPartial = header
  writerOpts.commitPartial = commit

  return writerOpts
}
