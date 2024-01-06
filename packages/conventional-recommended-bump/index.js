// @todo Drop import, use git lib
import { filterRevertedCommitsSync } from 'conventional-commits-filter'
import { parseCommitsStream } from 'conventional-commits-parser'
import { loadPreset } from 'conventional-changelog-preset-loader'
import gitSemverTags from 'git-semver-tags'
import { getRawCommitsStream } from 'git-raw-commits'

const VERSIONS = ['major', 'minor', 'patch']

function noop () {}

export default async function conventionalRecommendedBump (optionsArgument, parserOptsArgument) {
  if (typeof optionsArgument !== 'object') {
    throw new Error('The \'options\' argument must be an object.')
  }

  const options = Object.assign({
    ignoreReverted: true,
    gitRawCommitsOpts: {}
  }, optionsArgument)

  let config = options.config || {}
  if (options.preset) {
    config = await loadPreset(options.preset)
  }

  const whatBump = options.whatBump ||
    ((config.recommendedBumpOpts && config.recommendedBumpOpts.whatBump)
      ? config.recommendedBumpOpts.whatBump
      : noop)

  if (typeof whatBump !== 'function') {
    throw Error('whatBump must be a function')
  }

  // TODO: For now we defer to `config.recommendedBumpOpts.parserOpts` if it exists, as our initial refactor
  // efforts created a `parserOpts` object under the `recommendedBumpOpts` object in each preset package.
  // In the future we want to merge differences found in `recommendedBumpOpts.parserOpts` into the top-level
  // `parserOpts` object and remove `recommendedBumpOpts.parserOpts` from each preset package if it exists.
  const parserOpts = Object.assign({},
    config.recommendedBumpOpts && config.recommendedBumpOpts.parserOpts
      ? config.recommendedBumpOpts.parserOpts
      : config.parserOpts,
    parserOptsArgument)

  const warn = typeof parserOpts.warn === 'function' ? parserOpts.warn : noop
  const tags = await gitSemverTags({
    lernaTags: !!options.lernaPackage,
    package: options.lernaPackage,
    tagPrefix: options.tagPrefix,
    skipUnstable: options.skipUnstable,
    cwd: options.cwd
  })
  const commitsStream = getRawCommitsStream({
    format: '%B%n-hash-%n%H',
    from: tags[0] || '',
    path: options.path,
    ...options.gitRawCommitsOpts,
    cwd: options.cwd
  })
    .pipe(parseCommitsStream(parserOpts))
  let commits = []

  for await (const commit of commitsStream) {
    commits.push(commit)
  }

  commits = options.ignoreReverted ? Array.from(filterRevertedCommitsSync(commits)) : commits

  if (!commits || !commits.length) {
    warn('No commits since last release')
  }

  let result = whatBump(commits, options)

  if (result && result.level != null) {
    result.releaseType = VERSIONS[result.level]
  } else if (result == null) {
    result = {}
  }

  return result
}
