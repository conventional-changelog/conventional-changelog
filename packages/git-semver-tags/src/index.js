import {
  ConventionalGitClient,
  packagePrefix
} from '@conventional-changelog/git-client'

function getFinalOptions (options = {}) {
  if (options.package && !options.lernaTags) {
    throw new Error('opts.package should only be used when running in lerna mode')
  }

  const finalOptions = {
    cwd: options.cwd || process.cwd(),
    prefix: options.lernaTags ? packagePrefix(options.package) : options.tagPrefix,
    skipUnstable: options.skipUnstable
  }

  return finalOptions
}

/**
 * Get semver tags from git.
 * @param {*} options
 * @param {string} [options.cwd=process.cwd()] - Current working directory to run git.
 * @param {boolean} [options.lernaTags=false] - Extract lerna style tags.
 * @param {string} [options.package] - Filter lerna style tags by package.
 * @param {string} [options.tagPrefix] - Filter semver tags by prefix.
 * @returns Semver tags.
 */
export async function getSemverTags (options = {}) {
  const {
    cwd,
    ...finalOptions
  } = getFinalOptions(options)
  const client = new ConventionalGitClient(cwd)
  const tags = []

  for await (const tag of client.getSemverTags(finalOptions)) {
    tags.push(tag)
  }

  return tags
}
