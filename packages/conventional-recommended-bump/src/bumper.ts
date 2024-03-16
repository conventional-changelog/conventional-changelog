import type {
  ParserStreamOptions,
  Commit
} from 'conventional-commits-parser'
import type {
  GetSemverTagsParams,
  GetCommitsParams,
  Params
} from '@conventional-changelog/git-client'
import type {
  UnknownPresetCreatorParams,
  PresetParams
} from 'conventional-changelog-preset-loader'
import {
  ConventionalGitClient,
  packagePrefix
} from '@conventional-changelog/git-client'
import { loadPreset } from 'conventional-changelog-preset-loader'
import type { Preset } from './types.js'
import { isIterable } from './utils.js'

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
  private preset: Promise<Preset> | null
  private whatBump: Preset['whatBump'] | null
  private tagGetter: () => Promise<string | null> | string
  private commitsGetter: () => Iterable<Commit> | AsyncIterable<Commit>

  constructor(cwdOrGitClient: string | ConventionalGitClient = process.cwd()) {
    this.gitClient = typeof cwdOrGitClient === 'string'
      ? new ConventionalGitClient(cwdOrGitClient)
      : cwdOrGitClient

    this.preset = null
    this.whatBump = null
    this.tagGetter = () => this.getLastSemverTag()
    this.commitsGetter = () => this.getCommits()
  }

  private getLastSemverTag(params?: GetSemverTagsParams & Params) {
    return this.gitClient.getLastSemverTag(params)
  }

  private async* getCommits(
    params?: GetCommitsParams & Params,
    parserOptions?: ParserStreamOptions
  ) {
    yield* this.gitClient.getCommits({
      format: '%B%n-hash-%n%H',
      from: await this.tagGetter() || '',
      filterReverts: true,
      ...params
    }, parserOptions)
  }

  private async getPreset() {
    const result = await this.preset

    if (!result) {
      throw Error('Preset is not loaded or have incorrect exports')
    }

    return result
  }

  /**
   * Load configs from a preset
   * @param preset
   * @returns this
   */
  loadPreset<PresetCreatorParams extends UnknownPresetCreatorParams = UnknownPresetCreatorParams>(
    preset: PresetParams<PresetCreatorParams>
  ) {
    this.preset = loadPreset<Preset, PresetCreatorParams>(preset)

    this.whatBump = async (commits) => {
      const { whatBump } = await this.getPreset()

      return whatBump(commits)
    }

    this.tagGetter = async () => {
      const { tags } = await this.getPreset()

      return this.getLastSemverTag(tags)
    }

    this.commitsGetter = async function* commitsGetter() {
      const { commits, parser } = await this.getPreset()

      yield* this.getCommits(commits, parser)
    }

    return this
  }

  /**
   * Set params to get the last semver tag
   * @param paramsOrTag - Params to get the last semver tag or a tag name
   * @returns this
   */
  tag(paramsOrTag: GetSemverTagsParams & Params | string) {
    if (typeof paramsOrTag === 'string') {
      this.tagGetter = () => paramsOrTag
    } else {
      this.tagGetter = () => this.getLastSemverTag(paramsOrTag)
    }

    return this
  }

  /**
   * Set params to get commits since last release
   * @param params - Params to get commits since last release
   * @param parserOptions - Parser options
   * @returns this
   */
  commits(params: GetCommitsParams & Params, parserOptions?: ParserStreamOptions): this
  /**
   * Set commits since last release
   * @param commits - Iterable or async iterable of commits
   * @returns this
   */
  commits(commits: Iterable<Commit> | AsyncIterable<Commit>): this
  commits(
    paramsOrCommits: GetCommitsParams & Params | Iterable<Commit> | AsyncIterable<Commit>,
    parserOptions?: ParserStreamOptions
  ) {
    if (isIterable(paramsOrCommits)) {
      this.commitsGetter = () => paramsOrCommits
    } else {
      this.commitsGetter = () => this.getCommits(paramsOrCommits, parserOptions)
    }

    return this
  }

  /**
   * Recommend a bump by `whatBump` function
   * @param whatBump - Function to recommend a bump from commits
   * @returns Bump recommendation
   */
  async bump(whatBump = this.whatBump) {
    if (typeof whatBump !== 'function') {
      throw Error('`whatBump` must be a function')
    }

    const commitsStream = this.commitsGetter()
    const commits: Commit[] = []
    let commit: Commit

    for await (commit of commitsStream) {
      commits.push(commit)
    }

    let result = await whatBump(commits)

    if (result && typeof result.level === 'number') {
      result.releaseType = VERSIONS[result.level]
    } else if (!result) {
      result = {}
    }

    return result
  }
}
