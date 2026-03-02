import { createParserOpts } from './parser.js'
import { createWriterOpts } from './writer.js'
import { whatBump } from './whatBump.js'

export default function createPreset() {
  return {
    parser: createParserOpts(),
    writer: createWriterOpts(),
    whatBump
  }
}
