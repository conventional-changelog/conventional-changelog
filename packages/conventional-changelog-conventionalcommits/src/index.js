import { DEFAULT_COMMIT_TYPES } from './constants.js'
import { createParserOpts } from './parser.js'
import { createWriterOpts } from './writer.js'
import { createWhatBump } from './whatBump.js'

export { DEFAULT_COMMIT_TYPES }

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
