import type { TemplateContext } from 'conventional-changelog-writer'
import { isPrereleaseVersion } from '@conventional-changelog/git-client'
import type {
  Logger,
  HostedGitInfo,
  Params,
  Commit
} from './types.js'
import { hostsOptions } from './hosts/index.js'

export function getHostOptions(
  repository: Partial<HostedGitInfo> | null | undefined,
  context: TemplateContext | null | undefined
) {
  const host = context?.host
  let type

  if (!host || host === repository?.host) {
    type = repository?.type
  } else {
    const match = host.match(/github|bitbucket|gitlab/i)

    type = match?.[0]?.toLowerCase()
  }

  if (type && (type in hostsOptions)) {
    return hostsOptions[type]
  }

  return null
}

export function guessNextTag(
  previousTag: string,
  version = ''
) {
  if (previousTag) {
    if (previousTag.startsWith('v') && !version.startsWith('v')) {
      return `v${version}`
    }

    if (!previousTag.startsWith('v') && version.startsWith('v')) {
      return version.replace(/^v/, '')
    }

    return version
  }

  if (!version.startsWith('v')) {
    return `v${version}`
  }

  return version
}

export function isUnreleasedVersion(
  semverTags: string[],
  version: string | undefined
) {
  const [lastTag] = semverTags

  return lastTag && version
    && (lastTag === version || lastTag === `v${version}`)
}

export const versionTagRegex = /tag:\s*(.*?)[,)]/gi
export const defaultVersionRegex = /tag:\s*[v=]?(.*?)[,)]/gi

export function matchSemverTag(
  gitTags: string | null | undefined,
  regex: RegExp,
  predicate: (tag: string) => boolean
) {
  if (typeof gitTags === 'string') {
    for (const [, tag] of gitTags.matchAll(regex)) {
      if (predicate(tag)) {
        return tag
      }
    }
  }

  return null
}

export function defaultCommitTransform(commit: Commit, params: Params) {
  const { tags, options: { formatDate } } = params
  const prefix = tags?.prefix
  const versionRegex = prefix
    ? new RegExp(`tag:\\s*[v=]?${prefix}(.*?)[,)]`, 'gi')
    : defaultVersionRegex
  const {
    committerDate,
    gitTags
  } = commit
  const patch: Partial<Commit> = {
    committerDate: committerDate
      ? formatDate!(committerDate)
      : committerDate
  }
  const version = matchSemverTag(
    gitTags,
    versionRegex,
    version => !(tags?.skipUnstable && isPrereleaseVersion(version))
  )

  if (version) {
    patch.version = version
  }

  return patch
}

export function bindLogNamespace(
  namespace: string,
  log: Logger
) {
  return (messages: string | string[]) => log(namespace, messages)
}
