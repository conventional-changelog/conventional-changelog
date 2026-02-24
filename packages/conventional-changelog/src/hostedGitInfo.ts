
import type {
  HostType,
  HostedGitInfo
} from './types.js'

function getType(domain: string): HostType {
  if (domain.includes('github')) {
    return 'github'
  }

  if (domain.includes('gitlab')) {
    return 'gitlab'
  }

  if (domain.includes('bitbucket')) {
    return 'bitbucket'
  }

  if (domain.includes('git.sr.ht')) {
    return 'sourcehut'
  }

  return ''
}

function getHost(type: string) {
  switch (type) {
    case 'github':
      return 'https://github.com'
    case 'gitlab':
      return 'https://gitlab.com'
    case 'bitbucket':
      return 'https://bitbucket.org'
    case 'sourcehut':
      return 'https://git.sr.ht'
    default:
      return ''
  }
}

function getRepositoryUrl(
  type: HostType,
  host: string,
  owner: string,
  project: string,
  branch: string
) {
  if (!host) {
    return ''
  }

  let treepath = ''

  if (branch) {
    if (type === 'bitbucket') {
      treepath = `/src/${encodeURIComponent(branch)}`
    } else {
      treepath = `/tree/${encodeURIComponent(branch)}`
    }
  }

  return `${host}/${owner}/${project}${treepath}`
}

export function parseHostedGitUrl(input: string): HostedGitInfo | null {
  // github edge case with branch in the url
  let matches = input.match(/^(?:https:\/\/)?github\.com\/([^/]+)\/([^/.#]+)(?:\/tree\/[^/]+)?$/)

  if (matches) {
    return {
      url: input,
      type: 'github',
      host: 'https://github.com',
      owner: matches[1],
      project: matches[2]
    }
  }

  let type
  let host
  let owner
  let project

  // git+ssh and ssh urls
  matches = input.match(/^(?:(?:git\+)?ssh:\/\/(?:[^@]+@)?|[^@]+@)(?:www\.)?([^@:]+):([^/]+(?:\/[^/]+)?)\/([^/.#]+)(?:\.git)?(?:#(.+))?/)

  if (matches) {
    type = getType(matches[1])
    host = `https://${matches[1]}`
    owner = matches[2]
    project = matches[3]

    return {
      url: getRepositoryUrl(type, host, owner, project, matches[4]),
      type,
      host,
      owner,
      project
    }
  }

  // git+https and https urls
  matches = input.match(/^(?:(?:git\+)?https|git):\/\/(?:[^@]+@)?(?:www\.)?([^@/]+)\/([^/]+(?:\/[^/]+)*)\/([^/.#]+)(?:\.git)?(?:#(.+))?$/)

  if (matches) {
    type = getType(matches[1])
    host = `http${type || input.includes('https://') ? 's' : ''}://${matches[1]}`
    owner = matches[2]
    project = matches[3]

    return {
      url: getRepositoryUrl(type, host, owner, project, matches[4]),
      type,
      host,
      owner,
      project
    }
  }

  // shortcuts
  matches = input.match(/^(?:([^@:]+):)?(?:[^@:]+@|[^@:]*:[^@:]+@)?([^/#]+(?:\/[^/]+)?)\/([^/.#]+)(?:\.git)?(?:#(.+))?/)

  if (matches) {
    type = matches[1] as HostType || 'github'
    host = getHost(type)
    owner = matches[2]
    project = matches[3]

    return {
      url: getRepositoryUrl(type, host, owner, project, matches[4]),
      type,
      host,
      owner,
      project
    }
  }

  matches = input.match(/^\w+:\/\/([^/]+)(\/[^#]+)?/)

  if (matches) {
    type = getType(matches[1])
    host = `http${type || input.includes('https://') ? 's' : ''}://${matches[1]}`

    return {
      url: `${host}${matches[2]?.replace(/\/?\.git.*/, '') || ''}`,
      type,
      host
    }
  }

  return null
}
