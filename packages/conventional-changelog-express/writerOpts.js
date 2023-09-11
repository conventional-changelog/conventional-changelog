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
      let component = commit.component

      if (commit.component === 'perf') {
        component = 'Performance'
      } else if (commit.component === 'deps') {
        component = 'Dependencies'
      } else {
        return
      }

      return {
        component
      }
    },
    groupBy: 'component',
    commitGroupsSort: 'title',
    commitsSort: ['component', 'shortDesc']
  }
}
