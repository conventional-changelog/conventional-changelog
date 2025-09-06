import { createParserOpts } from './parser.js'
import { createWriterOpts } from './writer.js'
import { whatBump } from './whatBump.js'

export default async function createPreset(config) {
  return {
    commits: {
      ignore: config?.ignoreCommits,
      merges: false
    },
    parser: createParserOpts(),
    writer: await createWriterOpts(),
    whatBump
  }
}
