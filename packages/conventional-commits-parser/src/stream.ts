import { Transform } from 'stream'
import type { ParserStreamOptions } from './types.js'
import { CommitParser } from './CommitParser.js'

/**
 * Create stream to parse commits.
 * @param options - CommitParser options.
 * @returns Stream of parsed commits.
 */
export function parseCommitsStream(options: ParserStreamOptions = {}) {
  const parser = new CommitParser(options)

  return new Transform({
    objectMode: true,
    highWaterMark: 16,
    transform(data: Buffer, _, next) {
      let commit

      try {
        commit = parser.parse(data.toString())
        next(null, commit)
      } catch (err) {
        if (err instanceof Error) {
          if (options.warn === true) {
            next(err)
          } else {
            if (options.warn) {
              options.warn(err.toString())
            }

            next(null, '')
          }
        }
      }
    }
  })
}
