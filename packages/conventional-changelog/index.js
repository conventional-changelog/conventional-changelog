'use strict'

const conventionalChangelogCore = require('conventional-changelog-core')
const { loadPreset } = require('conventional-changelog-preset-loader')

function conventionalChangelog (options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  options.warn = options.warn || function () {}

  if (options.preset) {
    try {
      options.config = loadPreset(options.preset)
    } catch (err) {
      if (typeof options.preset === 'object') {
        options.warn(`Preset: "${options.preset.name}" ${err.message}`)
      } else if (typeof options.preset === 'string') {
        options.warn(`Preset: "${options.preset}" ${err.message}`)
      } else {
        options.warn(`Preset: ${err.message}`)
      }
    }
  }

  return conventionalChangelogCore(options, context, gitRawCommitsOpts, parserOpts, writerOpts)
}

module.exports = conventionalChangelog
