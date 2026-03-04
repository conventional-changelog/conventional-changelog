import {
  mainTemplate,
  headerPartial,
  commitPartial
} from './templates.js'

export function createWriterOpts() {
  return {
    mainTemplate,
    headerPartial,
    commitPartial,
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
