import type {
  ParserStreamOptions,
  Commit
} from 'conventional-commits-parser'
import {
  type GetSemverTagsParams,
  type GetCommitsParams,
  ConventionalGitClient,
  packagePrefix
} from '@conventional-changelog/git-client'
import {
  type UnknownPresetCreatorParams,
  type PresetParams,
  loadPreset
} from 'conventional-changelog-preset-loader'
import type {
  Options,
  Preset,
  Params,
  BumperRecommendationResult
} from './types.js'
import {
  isIterable,
  bindLogNamespace
} from './utils.js'

export { packagePrefix }

const VERSIONS = [
  'major',
  'minor',
  'patch'
] as const

/**
 * Bump suggester for conventional commits
 */
export class Bumper {
  private readonly gitClient: ConventionalGitClient
  private params: Promise<Params>
  private whatBump: Preset['whatBump'] | null
  private tagGetter: () => Promise<string | null> | string
  private commitsGetter: () => Iterable<Commit> | AsyncIterable<Commit>

  constructor(cwdOrGitClient: string | ConventionalGitClient = process.cwd()) {
    this.gitClient = typeof cwdOrGitClient === 'string'
      ? new ConventionalGitClient(cwdOrGitClient)
      : cwdOrGitClient

    this.whatBump = null
    this.params = Promise.resolve({
      commits: {
        format: '%B%n-hash-%n%H',
        filterReverts: true
      }
    })
    this.tagGetter = () => this.getLastSemverTag()
    this.commitsGetter = () => this.getCommits()
  }

  private composeParams(params: Params | Promise<Params>) {
    this.params = Promise.all([params, this.params]).then(([params, prevParams]) => ({
      options: {
        ...prevParams.options,
        ...params.options
      },
      tags: {
        ...prevParams.tags,
        ...params.tags
      },
      commits: {
        ...prevParams.commits,
        ...params.commits
      },
      parser: {
        ...prevParams.parser,
        ...params.parser
      }
    }))
  }

  private async getLastSemverTag() {
    const { tags } = await this.params

    return await this.gitClient.getLastSemverTag(tags)
  }

  private async* getCommits() {
    const {
      options,
      commits,
      parser
    } = await this.params
    const parserParams = {
      ...parser
    }

    if (!parserParams.warn && options?.warn) {
      parserParams.warn = bindLogNamespace('parser', options.warn)
    }

    yield* this.gitClient.getCommits({
      from: await this.tagGetter() || '',
      ...commits
    }, parserParams)
  }

  /**
   * Load configs from a preset
   * @param preset
   * @returns this
   */
  loadPreset<PresetCreatorParams extends UnknownPresetCreatorParams = UnknownPresetCreatorParams>(
    preset: PresetParams<PresetCreatorParams>
  ) {
    const config = loadPreset<Preset, PresetCreatorParams>(preset).then((config) => {
      if (!config) {
        throw Error('Preset is not loaded or have incorrect exports')
      }

      return config
    })

    this.whatBump = async (commits) => {
      const { whatBump } = await config

      return whatBump(commits)
    }

    this.composeParams(config)

    return this
  }

  /**
   * Set config directly
   * @param config - Config object
   * @returns this
   */
  config(config: Preset | Promise<Preset>) {
    this.composeParams(config)

    return this
  }

  /**
   * Set bumper options
   * @param options - Bumper options
   * @returns this
   */
  options(options: Options) {
    this.composeParams({
      options
    })

    return this
  }

  /**
   * Set params to get the last semver tag
   * @param paramsOrTag - Params to get the last semver tag or a tag name
   * @returns this
   */
  tag(paramsOrTag: GetSemverTagsParams | string) {
    if (typeof paramsOrTag === 'string') {
      this.tagGetter = () => paramsOrTag
    } else {
      this.tagGetter = () => this.getLastSemverTag()

      this.composeParams({
        tags: paramsOrTag
      })
    }

    return this
  }

  /**
   * Set params to get commits since last release
   * @param params - Params to get commits since last release
   * @param parserOptions - Parser options
   * @returns this
   */
  commits(params: GetCommitsParams, parserOptions?: ParserStreamOptions): this
  /**
   * Set commits since last release
   * @param commits - Iterable or async iterable of commits
   * @returns this
   */
  commits(commits: Iterable<Commit> | AsyncIterable<Commit>): this
  commits(
    paramsOrCommits: GetCommitsParams | Iterable<Commit> | AsyncIterable<Commit>,
    parserOptions?: ParserStreamOptions
  ) {
    if (isIterable(paramsOrCommits)) {
      this.commitsGetter = () => paramsOrCommits
    } else {
      this.commitsGetter = () => this.getCommits()

      this.composeParams({
        commits: paramsOrCommits,
        parser: parserOptions
      })
    }

    return this
  }

  /**
   * Recommend a bump by `whatBump` function
   * @param whatBump - Function to recommend a bump from commits
   * @returns Bump recommendation
   */
  async bump(whatBump = this.whatBump): Promise<BumperRecommendationResult> {
    if (typeof whatBump !== 'function') {
      throw Error('`whatBump` must be a function')
    }

    const { gitClient } = this
    const { options } = await this.params

    if (!gitClient.debug && options?.debug) {
      gitClient.debug = bindLogNamespace('git-client', options.debug)
    }

    const commitsStream = this.commitsGetter()
    const commits: Commit[] = []
    let commit: Commit

    for await (commit of commitsStream) {
      commits.push(commit)
    }

    const result = await whatBump(commits)

    if (result && 'level' in result) {
      return {
        ...result,
        releaseType: VERSIONS[result.level],
        commits
      }
    }

    return {
      commits
    }
  }
}
