import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import compareFunc from 'compare-func'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createWriterOpts () {
  const [template, header, commit, footer] = await Promise.all([
    readFile(resolve(dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/commit.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/footer.hbs'), 'utf-8')
  ])
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = template
  writerOpts.headerPartial = header
  writerOpts.commitPartial = commit
  writerOpts.footerPartial = footer

  return writerOpts
}

function getWriterOpts () {
  return {
    transform: (commit) => {
      const type = commit.type ? commit.type.toUpperCase() : ''

      if (type === 'FEAT') {
        commit.type = 'Features'
      } else if (type === 'FIX') {
        commit.type = 'Bug Fixes'
      } else {
        return
      }

      if (typeof commit.hash === 'string') {
        commit.hash = commit.hash.substring(0, 7)
      }

      commit.notes.forEach(note => {
        if (note.title === 'BREAKING CHANGE') {
          note.title = 'BREAKING CHANGES'
        }
      })

      return commit
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['type', 'shortDesc'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}
