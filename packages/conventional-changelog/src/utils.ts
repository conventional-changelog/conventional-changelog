import {
  type Context,
  defaultCommitTransform as defaultWriterCommitTransform
} from 'conventional-changelog-writer'
import { hostsOptions } from './hosts/index.js'
import type {
  Logger,
  HostedGitInfo,
  Params,
  Commit,
  Options
} from './types.js'

export function getHostOptions(
  repository: Partial<HostedGitInfo> | null | undefined,
  context: Context | null | undefined
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

export const versionTagRegex = /tag:\s*(.*)[,)]/i
export const defaultVersionRegex = /tag:\s*[v=]?(.*)[,)]/i

export function defaultCommitTransform(commit: Commit, params: Params) {
  const { tags, options } = params
  const prefix = tags?.prefix
  const versionRegex = prefix
    ? new RegExp(`tag:\\s*[v=]?${prefix}(.*)[,)]`, 'i')
    : defaultVersionRegex
  const patch = defaultWriterCommitTransform(commit, null, options as Required<Options>)

  if (typeof commit.gitTags === 'string') {
    const matches = commit.gitTags.match(versionRegex)

    if (matches) {
      // eslint-disable-next-line prefer-destructuring
      patch.version = matches[1]
    }
  }

  return patch
}

export function bindLogNamespace(
  namespace: string,
  log: Logger
) {
  return (messages: string | string[]) => log(namespace, messages)
}
