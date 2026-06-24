import { createParserOpts } from './parser.js'
import { createWriterOpts } from './writer.js'
import { createWhatBump } from './whatBump.js'

export { DEFAULT_COMMIT_TYPES } from './constants.js'
export * from './format.js'

export default function createPreset(config) {
  return {
    commits: {
      ignore: config?.ignoreCommits,
      merges: false
    },
    parser: createParserOpts(config),
    writer: createWriterOpts(config),
    whatBump: createWhatBump(config)
  }
}
