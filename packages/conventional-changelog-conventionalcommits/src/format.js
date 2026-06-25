import {
  compareUrl,
  referenceRepositoryUrl,
  repositoryUrl,
  url
} from '@conventional-changelog/template'

export function formatIssueUrl(context, reference) {
  return url(
    referenceRepositoryUrl(context, reference),
    'issues',
    reference.issue
  )
}

export function formatCommitUrl(context, commit) {
  return url(repositoryUrl(context), context.commit || 'commit', commit.hash)
}

export function formatCompareUrl(context) {
  return compareUrl(context)
}

export function formatUserUrl(context, user) {
  return url(context.host, user)
}
