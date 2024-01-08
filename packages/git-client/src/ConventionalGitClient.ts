import type {
  ParserStreamOptions,
  Commit,
  parseCommits
} from 'conventional-commits-parser'
import type { filterRevertedCommits } from 'conventional-commits-filter'
import semver from 'semver'
import type {
  GetCommitsParams,
  GetSemverTagsParams,
  Arg
} from './types.js'
import { GitClient } from './GitClient.js'

/**
 * Helper to get package tag prefix.
 * @param packageName
 * @returns Tag prefix.
 */
export function packagePrefix(packageName?: string) {
  if (!packageName) {
    return /^.+@/
  }

  return `${packageName}@`
}

/**
 * Wrapper around Git CLI with conventional commits support.
 */
export class ConventionalGitClient extends GitClient {
  private deps: Promise<[typeof parseCommits, typeof filterRevertedCommits]> | null = null

  private loadDeps() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (this.deps) {
      return this.deps
    }

    this.deps = Promise.all([
      import('conventional-commits-parser')
        .then(({ parseCommits }) => parseCommits),
      import('conventional-commits-filter')
        .then(({ filterRevertedCommits }) => filterRevertedCommits)
    ])

    return this.deps
  }

  /**
   * Get parsed commits stream.
   * @param params
   * @param params.path - Read commits from specific path.
   * @param params.from - Start commits range.
   * @param params.to - End commits range.
   * @param params.format - Commits format.
   * @param parserOptions - Commit parser options.
   * @param restRawArgs - Additional raw git arguments.
   * @yields Raw commits data.
   */
  async* getCommits(
    params: GetCommitsParams = {},
    parserOptions: ParserStreamOptions = {},
    restRawArgs: Arg[] = []
  ): AsyncIterable<Commit> {
    const [parseCommits, filterRevertedCommits] = await this.loadDeps()

    if (params.filterReverts) {
      yield* filterRevertedCommits(this.getCommits({
        filterReverts: false,
        ...params
      }, parserOptions, restRawArgs))
      return
    }

    const parse = parseCommits(parserOptions)
    const commitsStream = this.getRawCommits(params, restRawArgs)

    yield* parse(commitsStream)
  }

  /**
   * Get semver tags stream.
   * @param params
   * @param params.prefix - Get semver tags with specific prefix.
   * @param params.skipUnstable - Skip semver tags with unstable versions.
   * @param params.clean - Clean version from prefix and trash.
   * @param restRawArgs - Additional raw git arguments.
   * @yields Semver tags.
   */
  async* getSemverTags(params: GetSemverTagsParams = {}, restRawArgs: Arg[] = []) {
    const { prefix, skipUnstable, clean } = params
    const tagsStream = this.getTags(restRawArgs)
    const unstableTagRegex = /.+-\w+\.\d+$/
    const cleanTag = clean
      ? (tag: string, unprefixed?: string) => semver.clean(unprefixed || tag)
      : (tag: string) => tag
    let unprefixed: string
    let tag: string | null

    for await (tag of tagsStream) {
      if (skipUnstable && unstableTagRegex.test(tag)) {
        continue
      }

      if (prefix) {
        const isPrefixed = typeof prefix === 'string'
          ? tag.startsWith(prefix)
          : prefix.test(tag)

        if (isPrefixed) {
          unprefixed = tag.replace(prefix, '')

          if (semver.valid(unprefixed)) {
            tag = cleanTag(tag, unprefixed)

            if (tag) {
              yield tag
            }
          }
        }
      } else if (semver.valid(tag)) {
        tag = cleanTag(tag)

        if (tag) {
          yield tag
        }
      }
    }
  }

  /**
   * Get current sematic version from git tags.
   * @param prefix - Tag prefix to match.
   * @param restRawArgs - Additional raw git arguments.
   * @returns Current sematic version, `null` if not found.
   */
  async getVersionFromTags(prefix?: string, restRawArgs: Arg[] = []) {
    const semverTagsStream = this.getSemverTags({
      prefix,
      clean: true
    }, restRawArgs)
    const semverTags: string[] = []

    for await (const tag of semverTagsStream) {
      semverTags.push(tag)
    }

    if (!semverTags.length) {
      return null
    }

    return semverTags.sort(semver.rcompare)[0] || null
  }
}
