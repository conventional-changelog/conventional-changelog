'use strict'
const fs = require('fs/promises')
const { exec } = require('child_process')
const hostedGitInfo = require('hosted-git-info')
const parseRepositoryUrl = require('@hutson/parse-repository-url')
const gitSemverTags = require('git-semver-tags')
const normalizePackageData = require('normalize-package-data')

const { URL } = require('url')

const rhosts = /github|bitbucket|gitlab/i
// sv-SEis used for yyyy-mm-dd format
const dateFormatter = Intl.DateTimeFormat('sv-SE', {
  timeZone: 'UTC'
})

function guessNextTag (previousTag, version) {
  if (previousTag) {
    if (previousTag[0] === 'v' && version[0] !== 'v') {
      return 'v' + version
    }

    if (previousTag[0] !== 'v' && version[0] === 'v') {
      return version.replace(/^v/, '')
    }

    return version
  }

  if (version[0] !== 'v') {
    return 'v' + version
  }

  return version
}

function omitUndefinedValueProps (obj) {
  if (!obj) {
    return {}
  }

  const omittedObj = {}

  for (const key in obj) {
    if (obj[key] !== undefined) {
      omittedObj[key] = obj[key]
    }
  }

  return omittedObj
}

function getRemoteOriginUrl (cwd) {
  return new Promise((resolve, reject) => {
    exec('git config --get remote.origin.url', { cwd }, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout.trim())
      }
    })
  })
}

async function mergeConfig (options, context, gitRawCommitsOpts, parserOpts, writerOpts, gitRawExecOpts) {
  let pkgPromise

  options = omitUndefinedValueProps(options)
  context = context || {}
  gitRawCommitsOpts = gitRawCommitsOpts || {}
  gitRawExecOpts = {
    cwd: options?.cwd,
    ...gitRawExecOpts || {}
  }

  const rtag = options && options.tagPrefix ? new RegExp(`tag:\\s*[=]?${options.tagPrefix}(.+?)[,)]`, 'gi') : /tag:\s*[v=]?(.+?)[,)]/gi

  options = {
    append: false,
    releaseCount: 1,
    skipUnstable: false,
    debug: function () {},
    transform: function (commit, cb) {
      if (typeof commit.gitTags === 'string') {
        const match = rtag.exec(commit.gitTags)
        rtag.lastIndex = 0

        if (match) {
          commit.version = match[1]
        }
      }

      if (commit.committerDate) {
        commit.committerDate = dateFormatter.format(new Date(commit.committerDate))
      }

      cb(null, commit)
    },
    lernaPackage: null,
    ...options,
    pkg: {
      transform: function (pkg) {
        return pkg
      },
      ...options?.pkg
    }
  }

  options.warn = options.warn || options.debug

  if (options.pkg) {
    if (options.pkg.path) {
      pkgPromise = import('read-pkg').then(async ({ parsePackage }) => {
        const json = await fs.readFile(options.pkg.path, 'utf-8')

        return parsePackage(json)
      })
    } else {
      pkgPromise = import('read-pkg-up').then(async ({ readPackageUp }) => {
        const { packageJson } = await readPackageUp({ cwd: options.cwd })

        return packageJson
      })
    }
  }

  const presetConfig = typeof options.config === 'function' ? options.config() : options.config
  const [
    configObj,
    pkgObj,
    tagsObj,
    gitRemoteOriginUrlObj
  ] = await Promise.allSettled([
    presetConfig,
    pkgPromise,
    gitSemverTags({
      lernaTags: !!options.lernaPackage,
      package: options.lernaPackage,
      tagPrefix: options.tagPrefix,
      skipUnstable: options.skipUnstable,
      cwd: options.cwd
    }),
    getRemoteOriginUrl(options.cwd)
  ])
  let config
  let pkg
  let fromTag
  let repo

  let hostOpts

  let semverTags = []

  if (options.config) {
    if (configObj.status === 'fulfilled') {
      config = configObj.value
    } else {
      options.warn(configObj.reason.toString())
      config = {}
    }
  } else {
    config = {}
  }

  context = {
    ...context,
    ...config.context
  }

  if (options.pkg) {
    if (pkgObj.status === 'fulfilled') {
      pkg = pkgObj.value || {}
      pkg = options.pkg.transform(pkg)
    } else if (options.pkg.path) {
      options.warn(pkgObj.reason.toString())
    }
  }

  if ((!pkg || !pkg.repository || !pkg.repository.url) && gitRemoteOriginUrlObj.status === 'fulfilled') {
    pkg = pkg || {}
    pkg.repository = pkg.repository || {}
    pkg.repository.url = gitRemoteOriginUrlObj.value
    normalizePackageData(pkg)
  }

  if (pkg) {
    context.version = context.version || pkg.version

    try {
      const repositoryURL = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository.url
      if (repositoryURL) {
        // Remove parseRepositoryUrl when https://github.com/npm/hosted-git-info/issues/39 is fixed
        repo = hostedGitInfo.fromUrl(repositoryURL) || parseRepositoryUrl(repositoryURL)
      }
    } catch (err) {
      repo = {}
    }

    if (repo.browse) {
      const browse = repo.browse()
      if (!context.host) {
        if (repo.domain) {
          const parsedBrowse = new URL(browse)
          if (parsedBrowse.origin.indexOf('//') !== -1) {
            context.host = parsedBrowse.protocol + '//' + repo.domain
          } else {
            context.host = parsedBrowse.protocol + repo.domain
          }
        } else {
          context.host = null
        }
      }
      context.owner = context.owner || repo.user || ''
      context.repository = context.repository || repo.project
      if (repo.host && repo.project && repo.user) {
        context.repoUrl = browse
      } else {
        context.repoUrl = context.host
      }
    }

    context.packageData = pkg
  }

  context.version = context.version || ''

  if (tagsObj.status === 'fulfilled') {
    semverTags = context.gitSemverTags = tagsObj.value
    fromTag = semverTags[options.releaseCount - 1]
    const lastTag = semverTags[0]

    if (lastTag === context.version || lastTag === 'v' + context.version) {
      if (options.outputUnreleased) {
        context.version = 'Unreleased'
      } else {
        options.outputUnreleased = false
      }
    }
  }

  if (typeof options.outputUnreleased !== 'boolean') {
    options.outputUnreleased = true
  }

  if (context.host && (!context.issue || !context.commit || !parserOpts || !parserOpts.referenceActions)) {
    let type

    if (context.host) {
      const match = context.host.match(rhosts)
      if (match) {
        type = match[0]
      }
    } else if (repo && repo.type) {
      type = repo.type
    }

    if (type) {
      hostOpts = require('../hosts/' + type)

      context = {
        issue: hostOpts.issue,
        commit: hostOpts.commit,
        ...context
      }
    } else {
      options.warn('Host: "' + context.host + '" does not exist')
      hostOpts = {}
    }
  } else {
    hostOpts = {}
  }

  if (context.resetChangelog) {
    fromTag = null
  }

  gitRawCommitsOpts = {
    format: '%B%n-hash-%n%H%n-gitTags-%n%d%n-committerDate-%n%ci',
    from: fromTag,
    merges: false,
    debug: options.debug,
    ...config.gitRawCommitsOpts,
    ...gitRawCommitsOpts
  }

  if (options.append) {
    gitRawCommitsOpts.reverse = gitRawCommitsOpts.reverse || true
  }

  parserOpts = {
    ...config.parserOpts,
    warn: options.warn,
    ...parserOpts
  }

  if (hostOpts.referenceActions && parserOpts) {
    parserOpts.referenceActions = hostOpts.referenceActions
  }

  if (!parserOpts.issuePrefixes?.length && hostOpts.issuePrefixes) {
    parserOpts.issuePrefixes = hostOpts.issuePrefixes
  }

  writerOpts = {
    finalizeContext: function (context, writerOpts, filteredCommits, keyCommit, originalCommits) {
      const firstCommit = originalCommits[0]
      const lastCommit = originalCommits[originalCommits.length - 1]
      const firstCommitHash = firstCommit ? firstCommit.hash : null
      const lastCommitHash = lastCommit ? lastCommit.hash : null

      if ((!context.currentTag || !context.previousTag) && keyCommit) {
        const match = /tag:\s*(.+?)[,)]/gi.exec(keyCommit.gitTags)
        const currentTag = context.currentTag
        context.currentTag = currentTag || match ? match[1] : null
        const index = semverTags.indexOf(context.currentTag)

        // if `keyCommit.gitTags` is not a semver
        if (index === -1) {
          context.currentTag = currentTag || null
        } else {
          const previousTag = context.previousTag = semverTags[index + 1]

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
          if (options.lernaPackage) {
            context.currentTag = options.lernaPackage + '@' + context.version
          } else if (options.tagPrefix) {
            context.currentTag = options.tagPrefix + context.version
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
    debug: options.debug,
    ...config.writerOpts,
    reverse: options.append,
    doFlush: options.outputUnreleased,
    ...writerOpts
  }

  return {
    options,
    context,
    gitRawCommitsOpts,
    parserOpts,
    writerOpts,
    gitRawExecOpts
  }
}

module.exports = mergeConfig
