import { mainTemplate, headerPartial, commitPartial } from './templates.js'

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
      let { component } = commit

      if (commit.component === 'perf') {
        component = 'Performance'
      } else if (commit.component === 'deps') {
        component = 'Dependencies'
      } else {
        return undefined
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
