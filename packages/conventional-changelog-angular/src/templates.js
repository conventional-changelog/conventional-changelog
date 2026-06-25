import {
  bold,
  compareUrl,
  each,
  link,
  list,
  reference,
  referenceRepositoryUrl,
  repositoryUrl,
  heading,
  url,
  newline,
  segments,
  strings,
  words
} from '@conventional-changelog/template'

export function headerPartial(context) {
  const {
    isPatch,
    linkCompare,
    version,
    title,
    date
  } = context
  const versionText = linkCompare
    ? link(version, compareUrl(context))
    : version

  return heading(
    Boolean(isPatch) + 1,
    words(
      versionText,
      title && `"${title}"`,
      date && `(${date})`
    )
  )
}

export function commitPartial(context, commit) {
  const {
    linkReferences,
    issue,
    commit: commitUrlPath
  } = context
  const {
    scope,
    subject,
    header,
    shortHash,
    hash,
    references
  } = commit
  const commitLink =
    hash
      ? linkReferences
        ? `(${link(shortHash, url(repositoryUrl(context), commitUrlPath, hash))})`
        : shortHash
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
      scope && bold(`${scope}:`),
      subject || header || '',
      commitLink
    ),
    renderedReferences && `, closes ${renderedReferences}`
  )
}

export function footerPartial({ noteGroups }) {
  return each(
    noteGroups,
    group => segments(
      heading(3, group.title),
      list(
        group.notes,
        note => words(
          note.commit.scope && bold(`${note.commit.scope}:`),
          note.text
        )
      )
    ),
    newline(2)
  )
}

export function template(context) {
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
      group => segments(
        group.title && heading(3, group.title),
        list(
          group.commits,
          commit => commitPartial(context, commit)
        )
      ),
      newline(2)
    ),
    footerPartial(context)
  )
}
