import type {
  FinalTemplateContext,
  CommitKnownProps,
  CommitReference,
  TransformedCommit
} from './types/index.js'
import {
  each,
  link,
  list,
  small,
  heading,
  segments,
  strings,
  words,
  newline,
  url
} from './elements.js'

/**
 * Builds a repository URL from template context fields.
 * @param context - Template context.
 * @returns Repository URL.
 */
export function repositoryUrl<Commit extends CommitKnownProps = CommitKnownProps>(
  context: FinalTemplateContext<Commit>
) {
  if (context.repository) {
    return url(context.host, context.owner, context.repository)
  }

  return context.repoUrl || ''
}

/**
 * Builds a repository URL for a commit reference.
 * @param context - Template context.
 * @param reference - Commit reference.
 * @returns Reference repository URL.
 */
export function referenceRepositoryUrl<Commit extends CommitKnownProps = CommitKnownProps>(
  context: FinalTemplateContext<Commit>,
  reference: CommitReference
) {
  if (!context.repository) {
    return context.repoUrl || ''
  }

  if (reference.repository) {
    return url(context.host, reference.owner, reference.repository)
  }

  return url(context.host, context.owner, context.repository)
}

/**
 * Renders a commit reference label.
 * @param reference - Commit reference.
 * @returns Commit reference label.
 */
export function reference(reference: CommitReference) {
  return strings(
    reference.owner && `${reference.owner}/`,
    reference.repository,
    reference.issue && `${reference.prefix || '#'}${reference.issue}`
  )
}

/**
 * Renders the default changelog header.
 * @param context - Template context.
 * @returns Changelog header.
 */
export function headerPartial<Commit extends CommitKnownProps = CommitKnownProps>({
  isPatch,
  title,
  version,
  date
}: FinalTemplateContext<Commit>) {
  const versionText = words(
    version,
    title && `"${title}"`,
    date && `(${date})`
  )

  return heading(2, isPatch ? small(versionText) : versionText)
}

/**
 * Renders the default changelog footer.
 * @param context - Template context.
 * @returns Changelog footer.
 */
export function footerPartial<Commit extends CommitKnownProps = CommitKnownProps>(
  { noteGroups }: FinalTemplateContext<Commit>
) {
  return each(
    noteGroups,
    group => segments(
      heading(3, group.title),
      list(
        group.notes,
        note => note.text
      )
    ),
    newline(2)
  )
}

/**
 * Renders the default changelog commit line.
 * @param context - Template context.
 * @param commit - Transformed commit.
 * @returns Changelog commit line.
 */
export function commitPartial<Commit extends CommitKnownProps = CommitKnownProps>(
  context: FinalTemplateContext<Commit>,
  commit: TransformedCommit<Commit>
) {
  const {
    linkReferences,
    issue,
    commit: commitUrlPath
  } = context
  const {
    hash,
    references,
    header
  } = commit
  const commitLink = hash
    ? linkReferences
      ? `(${link(hash, url(repositoryUrl(context), commitUrlPath, hash))})`
      : hash
    : ''
  const renderedReferences = each(
    references,
    (linkReference) => {
      if (linkReferences) {
        return link(
          reference(linkReference),
          url(referenceRepositoryUrl(context, linkReference), issue, linkReference.issue)
        )
      }

      return reference(linkReference)
    },
    ' '
  )

  return strings(
    words(
      header,
      commitLink
    ),
    renderedReferences && `, closes ${renderedReferences}`
  )
}

/**
 * Renders the default changelog template.
 * @param context - Template context.
 * @returns Changelog text.
 */
export function template<Commit extends CommitKnownProps = CommitKnownProps>(
  context: FinalTemplateContext<Commit>
) {
  const {
    headerPartial,
    commitPartial,
    footerPartial,
    commitGroups
  } = context

  return segments(
    headerPartial(context),
    each(
      commitGroups,
      group => list(
        group.commits,
        commit => commitPartial(context, commit)
      )
    ),
    footerPartial(context)
  )
}
