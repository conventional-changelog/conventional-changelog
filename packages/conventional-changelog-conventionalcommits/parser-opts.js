'use strict'

module.exports = function (config) {
  config = defaultConfig(config)
  return {
    headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
    breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
    headerCorrespondence: [
      'type',
      'scope',
      'subject'
    ],
    noteKeywords: ['BREAKING CHANGE'],
    revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash'],
    issuePrefixes: config.issuePrefixes,
    referenceActions: config.referenceActions
  }
}

// merge user set configuration with default configuration.
function defaultConfig (config) {
  config = config || {}
  config.issuePrefixes = config.issuePrefixes || ['#']
  config.referenceActions = config.issuePrefixes || ['close', 'closes', 'closed', 'fix', 'fixes', 'fixed', 'resolve', 'resolves', 'resolved']
  return config
}
