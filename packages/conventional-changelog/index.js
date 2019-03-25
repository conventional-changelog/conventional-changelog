'use strict'

var conventionalChangelogCore = require('conventional-changelog-core')
var conventionalChangelogPresetLoader = require('conventional-changelog-preset-loader')

function conventionalChangelog (options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  options.warn = options.warn || function () {}

  if (options.preset) {
    try {
      let presetConfig = null
      if (typeof options.preset === 'object' && options.preset.name) {
        // Rather than a string preset name, options.preset can be an object
        // with a "name" key indicating the preset to load; additinoal key/value
        // pairs are assumed to be configuration for the preset. See the documentation
        // for a given preset for configuration available.
        presetConfig = options.preset
        options.config = conventionalChangelogPresetLoader(options.preset.name.toLowerCase())
      } else {
        options.config = conventionalChangelogPresetLoader(options.preset.toLowerCase())
      }
      // rather than returning a promise, presets can return a builder function
      // which accepts a config object (allowing for customization) and returns
      // a promise.
      if (!options.config.then && presetConfig) {
        options.config = options.config(presetConfig)
      }
    } catch (err) {
      options.warn('Preset: "' + options.preset + '" does not exist')
    }
  }

  return conventionalChangelogCore(options, context, gitRawCommitsOpts, parserOpts, writerOpts)
}

module.exports = conventionalChangelog
