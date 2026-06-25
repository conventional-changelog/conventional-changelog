import {
  bold,
  each,
  link,
  list,
  reference,
  heading,
  newline,
  segments,
  strings,
  words
} from '@conventional-changelog/template'

export function headerPartial(context) {
  const {
    linkCompare,
    version,
    title,
    date
  } = context
  const versionText = linkCompare
    ? link(version, this.formatCompareUrl(context))
    : version

  return heading(
    2,
    words(
      versionText,
      title && `"${title}"`,
      date && `(${date})`
    )
  )
}

function renderReferences(context, references, filter) {
  return each(
    references?.filter(filter),
    (commitReference) => {
      if (context.linkReferences) {
        return link(
          reference(commitReference),
          this.formatIssueUrl(context, commitReference)
        )
      }

      return reference(commitReference)
    },
    ' '
  )
}

export function commitPartial(context, commit) {
  const { linkReferences } = context
  const {
    scope,
    subject,
    header,
    shortHash,
    hash,
    references
  } = commit
  const commitLink = hash
    ? linkReferences
      ? `(${link(shortHash, this.formatCommitUrl(context, commit))})`
      : shortHash
    : ''
  const closingReferences = renderReferences.call(
    this,
    context,
    references,
    commitReference => commitReference.action
  )
  const otherReferences = renderReferences.call(
    this,
    context,
    references,
    commitReference => !commitReference.action
  )

  return strings(
    words(
      scope && bold(`${scope}:`),
      subject || header || '',
      commitLink
    ),
    closingReferences && `, closes ${closingReferences}`,
    otherReferences && `, references ${otherReferences}`
  )
}

export function footerPartial() {
  return ''
}

export function template(context) {
  const {
    headerPartial,
    commitPartial,
    footerPartial,
    noteGroups,
    commitGroups
  } = context

  return segments(
    headerPartial(context),
    each(
      noteGroups,
      group => segments(
        heading(3, words('⚠', group.title)),
        list(
          group.notes,
          note => words(
            note.commit.scope && bold(`${note.commit.scope}:`),
            note.text
          )
        )
      ),
      newline(2)
    ),
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
