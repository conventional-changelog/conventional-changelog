import conventionalChangelogCore from 'conventional-changelog-core'
import { loadPreset } from 'conventional-changelog-preset-loader'

export default function conventionalChangelog (options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
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
