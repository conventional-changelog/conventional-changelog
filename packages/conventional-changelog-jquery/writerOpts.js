import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createWriterOpts () {
  const [template, header, commit] = await Promise.all([
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

function getWriterOpts () {
  return {
    transform: (commit) => {
      if (!commit.component || typeof commit.component !== 'string') {
        return
      }

      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, 7)
        : commit.shortHash
      const references = commit.references.map((reference) => {
        return {
          ...reference,
          originalIssueTracker: reference.prefix === '#'
            ? 'https://bugs.jquery.com/ticket/'
            : reference.originalIssueTracker
        }
      })

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
