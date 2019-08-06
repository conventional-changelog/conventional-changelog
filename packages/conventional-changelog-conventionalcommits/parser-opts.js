'use strict'

module.exports = function (config) {
  config = defaultConfig(config)
  return {
    headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
    breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
    headerCorrespondence: [
      `type`,
      `scope`,
      `subject`
    ],
    noteKeywords: [`BREAKING CHANGE`],
    revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
    revertCorrespondence: [`header`, `hash`],
    issuePrefixes: config.issuePrefixes
  }
}

// merge user set configuration with default configuration.
function defaultConfig (config) {
  config = config || {}
  config.issuePrefixes = config.issuePrefixes || ['#']
  return config
}
