'use strict'
const _ = require('lodash')

const defaultConfig = {
  issuePrefixes: ['#']
}

module.exports = function (config) {
  const readyConfig = _.defaults(config, defaultConfig)

  return {
    headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
    breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
    headerCorrespondence: [
      'type',
      'scope',
      'subject'
    ],
    noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
    revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash'],
    issuePrefixes: readyConfig.issuePrefixes
  }
}
