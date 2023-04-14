'use strict'

const { readFile } = require('fs').promises
const { resolve } = require('path')

module.exports = Promise.all([
  readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
  readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8')
])
  .then(([template, header, commit]) => {
    const writerOpts = getWriterOpts()

    writerOpts.mainTemplate = template
    writerOpts.headerPartial = header
    writerOpts.commitPartial = commit

    return writerOpts
  })

function getWriterOpts () {
  return {
    transform: (commit) => {
      if (!commit.pr) {
        return
      }

      if (commit.tag === 'BUGFIX') {
        commit.tag = 'Bug Fixes'
      } else if (commit.tag === 'CLEANUP') {
        commit.tag = 'Cleanup'
      } else if (commit.tag === 'FEATURE') {
        commit.tag = 'Features'
      } else if (commit.tag === 'DOC') {
        commit.tag = 'Documentation'
      } else if (commit.tag === 'SECURITY') {
        commit.tag = 'Security'
      } else {
        return
      }

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      return commit
    },
    groupBy: 'tag',
    commitGroupsSort: 'title',
    commitsSort: ['tag', 'taggedAs', 'message']
  }
}
