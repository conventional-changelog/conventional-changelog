import fs from 'fs/promises'
import { Readable } from 'stream'
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
  type Options as WriterOptions,
  type Context,
  type Details,
  transformCommit,
  formatDate,
  writeChangelog
} from 'conventional-changelog-writer'
import {
  type UnknownPresetCreatorParams,
  type PresetParams,
  type PresetModuleLoader,
  createPresetLoader,
  loadPreset as defaultLoadPreset
} from 'conventional-changelog-preset-loader'
import normalizePackageData from 'normalize-package-data'
import { findPackage } from 'fd-package-json'
import {
  type HostedGitInfo,
  parseHostedGitUrl
} from '@simple-libs/hosted-git-info'
import type {
  HostOptions,
  Package,
  PackageTransform,
  FinalizedContext,
  Options,
  Params,
  Preset
} from './types.js'
import {
  getHostOptions,
  guessNextTag,
  isUnreleasedVersion,
  versionTagRegex,
  defaultCommitTransform,
  bindLogNamespace
} from './utils.js'

export { packagePrefix }

/**
 * Conventional changelog generator
 */
export class ConventionalChangelog {
  private readonly gitClient: ConventionalGitClient
  private params: Promise<Params>

  constructor(cwdOrGitClient: string | ConventionalGitClient = process.cwd()) {
    this.gitClient = typeof cwdOrGitClient === 'string'
      ? new ConventionalGitClient(cwdOrGitClient)
      : cwdOrGitClient

    this.params = Promise.resolve({
      options: {
        append: false,
        releaseCount: 1,
        formatDate,
        transformCommit: defaultCommitTransform
      },
      commits: {
        format: '%B%n-hash-%n%H%n-gitTags-%n%d%n-committerDate-%n%ci',
        merges: false
      }
    })
  }

  private composeParams(params: Partial<Params> | Promise<Partial<Params>>) {
    this.params = Promise.all([params, this.params]).then(([params, prevParams]) => ({
      options: {
        ...prevParams.options,
        ...params.options
      },
      context: {
        ...prevParams.context,
        ...params.context
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
      },
      writer: {
        ...prevParams.writer,
        ...params.writer
      },
      repository: {
        ...prevParams.repository,
        ...params.repository
      },
      package: prevParams.package || params.package
    }))
  }

  private async finalizeContext(semverTags: string[], hostOptions: HostOptions | null) {
    const {
      options,
      package: pkg,
      repository,
      context
    } = await this.params
    const finalContext = {
      packageData: pkg,
      version: pkg?.version,
      gitSemverTags: semverTags,
      ...context
    }

    if (repository) {
      finalContext.repoUrl = finalContext.repoUrl || repository.url
      finalContext.host = finalContext.host || repository.host
      finalContext.owner = finalContext.owner || repository.owner
      finalContext.repository = finalContext.repository || repository.project
    }

    if (hostOptions) {
      finalContext.issue = finalContext.issue || hostOptions.issue
      finalContext.commit = finalContext.commit || hostOptions.commit
    }

    if (isUnreleasedVersion(semverTags, finalContext.version) && options.outputUnreleased) {
      finalContext.version = 'Unreleased'
    }

    return finalContext
  }

  private async finalizeWriterOptions(semverTags: string[], version: string | undefined) {
    const {
      options,
      tags,
      writer
    } = await this.params
    let doFlush = options.outputUnreleased

    if (isUnreleasedVersion(semverTags, version) && !doFlush) {
      doFlush = false
    } else
      if (typeof doFlush !== 'boolean') {
        doFlush = true
      }

    const finalOptions: WriterOptions = {
      finalizeContext(
        context: FinalizedContext,
        _writerOpts,
        _filteredCommits,
        keyCommit: Commit,
        originalCommits
      ) {
        const [firstCommit] = originalCommits
        const lastCommit = originalCommits[originalCommits.length - 1]
        const firstCommitHash = firstCommit ? firstCommit.hash : null
        const lastCommitHash = lastCommit ? lastCommit.hash : null

        if ((!context.currentTag || !context.previousTag) && keyCommit) {
          const matches = keyCommit.gitTags?.match(versionTagRegex)
          const { currentTag } = context

          context.currentTag = currentTag || matches?.[1] // currentTag || matches ? matches[1] : null

          const index = context.currentTag
            ? semverTags.indexOf(context.currentTag)
            : -1

          // if `keyCommit.gitTags` is not a semver
          if (index === -1) {
            context.currentTag = currentTag || null
          } else {
            const previousTag = semverTags[index + 1]

            context.previousTag = previousTag

            if (!previousTag) {
              if (options.append) {
                context.previousTag = context.previousTag || firstCommitHash
              } else {
                context.previousTag = context.previousTag || lastCommitHash
              }
            }
          }
        } else {
          context.previousTag = context.previousTag || semverTags[0]

          if (context.version === 'Unreleased') {
            if (options.append) {
              context.currentTag = context.currentTag || lastCommitHash
            } else {
              context.currentTag = context.currentTag || firstCommitHash
            }
          } else if (!context.currentTag) {
            if (tags?.prefix) {
              context.currentTag = tags.prefix + (context.version || '')
            } else {
              context.currentTag = guessNextTag(semverTags[0], context.version)
            }
          }
        }

        if (typeof context.linkCompare !== 'boolean' && context.previousTag && context.currentTag) {
          context.linkCompare = true
        }

        return context
      },
      reverse: options.append,
      doFlush,
      ...writer
    }

    if (!finalOptions.debug && options.debug) {
      finalOptions.debug = bindLogNamespace('writer', options.debug)
    }

    return finalOptions
  }

  private async getSemverTags() {
    const { gitClient } = this
    const { tags: params } = await this.params
    const tags = []

    for await (const tag of gitClient.getSemverTags(params)) {
      tags.push(tag)
    }

    return tags
  }

  private async* getCommits(
    semverTags: string[],
    hostOptions: HostOptions | null
  ) {
    const { gitClient } = this
    const {
      options,
      commits,
      parser
    } = await this.params
    const {
      reset,
      releaseCount
    } = options
    const params = {
      from: reset
        ? undefined
        : releaseCount
          ? semverTags[releaseCount - 1]
          : undefined,
      ...commits
    }
    const parserParams = {
      ...parser
    }

    if (!parserParams.warn && options.warn) {
      parserParams.warn = bindLogNamespace('parser', options.warn)
    }

    if (options.append) {
      params.reverse = true
    }

    if (hostOptions?.referenceActions && !parserParams.referenceActions?.length) {
      parserParams.referenceActions = hostOptions.referenceActions
    }

    if (hostOptions?.issuePrefixes && !parserParams.issuePrefixes?.length) {
      parserParams.issuePrefixes = hostOptions.issuePrefixes
    }

    try {
      await gitClient.verify('HEAD')

      let reverseTags = semverTags.slice().reverse()

      reverseTags.push('HEAD')

      if (params.from) {
        if (reverseTags.includes(params.from)) {
          reverseTags = reverseTags.slice(reverseTags.indexOf(params.from))
        } else {
          reverseTags = [params.from, 'HEAD']
        }
      } else {
        reverseTags.unshift('')
      }

      const streams = []

      for (let i = 1, len = reverseTags.length; i < len; i++) {
        streams.push(gitClient.getCommits({
          ...params,
          from: reverseTags[i - 1],
          to: reverseTags[i]
        }, parserParams))
      }

      if (!params.reverse) {
        streams.reverse()
      }

      for (const stream of streams) {
        yield* stream
      }
    } catch {
      yield* gitClient.getCommits(params, parserParams)
    }
  }

  private async* transformCommits(commits: AsyncIterable<Commit>) {
    const params = await this.params
    const { transformCommit: transform } = params.options
    let transformed

    for await (const commit of commits) {
      transformed = await transformCommit(commit, transform, params)

      if (transformed) {
        yield transformed
      }
    }
  }

  private async getPackageJson(pkgPath?: string, transform?: PackageTransform) {
    const { gitClient } = this
    let pkg: Package

    if (pkgPath) {
      pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8')) as Package
    } else {
      pkg = (await findPackage(gitClient.cwd) || {}) as Package
    }

    normalizePackageData(pkg)

    if (!pkg.repository?.url) {
      try {
        const repoUrl = await gitClient.getConfig('remote.origin.url')

        if (repoUrl) {
          pkg.repository = {
            ...pkg.repository!,
            url: repoUrl
          }
        }
      } catch {}
    }

    if (transform) {
      pkg = transform(pkg)
    }

    const result: {
      package: Package
      repository?: HostedGitInfo | null
    } = {
      package: pkg
    }
    const repositoryURL = (pkg.repository?.url || pkg.repository) as string

    if (repositoryURL) {
      result.repository = parseHostedGitUrl(repositoryURL)
    }

    return result
  }

  /**
   * Load configs from a preset
   * @param preset
   * @param loader - Preset module loader, if not provided, will use default loader
   * @returns this
   */
  loadPreset<PresetCreatorParams extends UnknownPresetCreatorParams = UnknownPresetCreatorParams>(
    preset: PresetParams<PresetCreatorParams>,
    loader?: PresetModuleLoader
  ) {
    const loadPreset = loader ? createPresetLoader(loader) : defaultLoadPreset
    const config = loadPreset(preset).then((config) => {
      if (!config) {
        throw Error('Preset is not loaded or have incorrect exports')
      }

      return config
    })

    this.composeParams(config)

    return this
  }

  /**
   * Set the config directly
   * @param config - Config object
   * @returns this
   */
  config(config: Preset | Promise<Preset>) {
    this.composeParams(config)

    return this
  }

  /**
   * Find package.json and read it
   * @param transform - Optional transform function
   * @returns this
   */
  readPackage(transform?: PackageTransform): this
  /**
   * Read package.json from a specified path
   * @param path - Path to package.json
   * @param transform - Optional transform function
   * @returns this
   */
  readPackage(path?: string, transform?: PackageTransform): this
  readPackage(pathOrTransform?: string | PackageTransform, maybeTransform?: PackageTransform) {
    const [pkgPath, transform] = typeof pathOrTransform === 'string'
      ? [pathOrTransform, maybeTransform]
      : [undefined, pathOrTransform]

    this.composeParams(
      this.getPackageJson(pkgPath, transform)
    )

    return this
  }

  /**
   * Set package.json data
   * @param pkg - Package.json data
   * @returns this
   */
  package(pkg: Record<string, unknown>) {
    this.composeParams({
      package: pkg as Package
    })

    return this
  }

  /**
   * Read repository info from the current git repository
   * @returns this
   */
  readRepository() {
    this.composeParams(
      this.gitClient.getConfig('remote.origin.url').then(repository => ({
        repository: parseHostedGitUrl(repository)
      }))
    )

    return this
  }

  /**
   * Set repository info
   * @param infoOrGitUrl - Hosted git info or git url
   * @returns this
   */
  repository(infoOrGitUrl: string | Partial<HostedGitInfo>) {
    const info = typeof infoOrGitUrl === 'string'
      ? parseHostedGitUrl(infoOrGitUrl)
      : infoOrGitUrl

    this.composeParams({
      repository: info
    })

    return this
  }

  /**
   * Set conventional-changelog options
   * @param options - Generator options
   * @returns this
   */
  options(options: Options) {
    this.composeParams({
      options
    })

    return this
  }

  /**
   * Set writer context data
   * @param context - Writer context data
   * @returns this
   */
  context(context: Context) {
    this.composeParams({
      context
    })

    return this
  }

  /**
   * Set params to get semver tags
   * @param params - Params to get the last semver tag
   * @returns this
   */
  tags(params: GetSemverTagsParams) {
    this.composeParams({
      tags: params
    })

    return this
  }

  /**
   * Set params to get commits
   * @param params - Params to get commits since last release
   * @param parserOptions - Parser options
   * @returns this
   */
  commits(params: GetCommitsParams, parserOptions?: ParserStreamOptions) {
    this.composeParams({
      commits: params,
      parser: parserOptions
    })

    return this
  }

  /**
   * Set writer options
   * @param params - Writer options
   * @returns this
   */
  writer(params: WriterOptions) {
    this.composeParams({
      writer: params
    })

    return this
  }

  /**
   * Generate changelog
   * @param includeDetails - Generate data objects instead of strings
   * @returns Changelog generator
   */
  write(includeDetails?: false): AsyncGenerator<string, void>
  /**
   * Generate changelog data objects
   * @param includeDetails - Generate data objects instead of strings
   */
  write(includeDetails: true): AsyncGenerator<Details<Commit>, void>
  /**
   * Generate changelog
   * @param includeDetails - Generate data objects instead of strings
   * @returns Changelog generator
   */
  write(includeDetails?: boolean): AsyncGenerator<string | Details<Commit>, void>
  async* write(includeDetails?: boolean) {
    const { gitClient } = this
    const {
      options,
      repository,
      context
    } = await this.params
    const hostOptions = getHostOptions(repository, context)

    if (!gitClient.debug && options.debug) {
      gitClient.debug = bindLogNamespace('git-client', options.debug)
    }

    if (!hostOptions && options.warn) {
      options.warn('core', `Host is not supported: ${context?.host || repository?.host}`)
    }

    const semverTags = await this.getSemverTags()
    const finalContext = await this.finalizeContext(semverTags, hostOptions)
    const writerOptions = await this.finalizeWriterOptions(semverTags, finalContext.version)
    const commits = this.getCommits(semverTags, hostOptions)
    const transformedCommits = this.transformCommits(commits)
    const changelogWriter = writeChangelog(finalContext, writerOptions, includeDetails)

    yield* changelogWriter(transformedCommits)
  }

  /**
   * Generate changelog to stream
   * @param includeDetails - Generate data objects instead of strings
   * @returns Changelog stream
   */
  writeStream(includeDetails?: boolean) {
    return Readable.from(this.write(includeDetails))
  }
}
