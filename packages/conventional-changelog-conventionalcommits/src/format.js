import {
  BREAKING_CHANGES_TITLE,
  compareUrl,
  noteTitle,
  referenceRepositoryUrl,
  repositoryUrl,
  url
} from '@conventional-changelog/template'

export function formatNoteTitle(context, title) {
  return noteTitle(title)
}

export function formatNoteIcon(context, title) {
  return title === BREAKING_CHANGES_TITLE ? '⚠' : ''
}

export function formatIssueUrl(context, reference) {
  return url(
    referenceRepositoryUrl(context, reference),
    context.issue || 'issues',
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
