import compareFunc from 'compare-func'
import { mainTemplate, headerPartial, commitPartial, footerPartial } from './templates.js'

const COMMIT_HASH_LENGTH = 7

export function createWriterOpts() {
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = mainTemplate
  writerOpts.headerPartial = headerPartial
  writerOpts.commitPartial = commitPartial
  writerOpts.footerPartial = footerPartial

  return writerOpts
}

function getWriterOpts() {
  return {
    transform: (commit) => {
      let type = commit.type ? commit.type.toUpperCase() : ''

      if (type === 'FEAT') {
        type = 'Features'
      } else if (type === 'FIX') {
        type = 'Bug Fixes'
      } else {
        return undefined
      }

      const hash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.hash
      const notes = commit.notes.map(note => ({
        ...note,
        title: note.title === 'BREAKING CHANGE'
          ? 'BREAKING CHANGES'
          : note.title
      }))

      return {
        type,
        hash,
        notes
      }
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['type', 'shortDesc'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}
