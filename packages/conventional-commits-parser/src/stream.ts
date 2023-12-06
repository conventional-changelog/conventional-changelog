import { Transform } from 'stream'
import type { ParserStreamOptions } from './types.js'
import { CommitParser } from './CommitParser.js'

/**
 * Create async generator function to parse async iterable of raw commits.
 * @param options - CommitParser options.
 * @returns Async generator function to parse async iterable of raw commits.
 */
export function parseCommits(
  options: ParserStreamOptions = {}
) {
  const warnOption = options.warn
  const warn = warnOption === true
    ? (err: Error) => {
      throw err
    }
    : warnOption
      ? (err: Error) => warnOption(err.toString())
      : () => { /* noop */ }

  return async function* parse(
    rawCommits: Iterable<string | Buffer> | AsyncIterable<string | Buffer>
  ) {
    const parser = new CommitParser(options)
    let rawCommit: string | Buffer

    for await (rawCommit of rawCommits) {
      try {
        yield parser.parse(rawCommit.toString())
      } catch (err) {
        warn(err as Error)
      }
    }
  }
}

/**
 * Create stream to parse commits.
 * @param options - CommitParser options.
 * @returns Stream of parsed commits.
 */
export function parseCommitsStream(options: ParserStreamOptions = {}) {
  return Transform.from(parseCommits(options))
}
