import {
  createReferencesFormatter,
  noteTitle,
  referenceRepositoryUrl,
  url
} from '@conventional-changelog/template'
import {
  template,
  headerPartial,
  preamblePartial,
  commitPartial,
  footerPartial
} from './templates.js'

const COMMIT_HASH_LENGTH = 7
const formatReferences = createReferencesFormatter({
  issuePrefixes: ['#'],
  issuePattern: /[0-9]+/,
  formatIssueUrl: (context, reference) => {
    const repositoryUrl = referenceRepositoryUrl(context, reference)

    // without a repository url there is nothing to link to
    return repositoryUrl
      ? url(repositoryUrl, context.issue || 'issues', reference.issue)
      : ''
  },
  formatUserUrl: (context, user) => (context.host
    ? url(context.host, user)
    : '')
})

function compareNotes(a, b) {
  return (a.title || '').localeCompare(b.title || '')
    || (a.text || '').localeCompare(b.text || '')
}

export function createWriterOpts() {
  return {
    template,
    headerPartial,
    preamblePartial,
    commitPartial,
    footerPartial,
    transform: (commit, context) => {
      let discard = true
      const notes = commit.notes.map((note) => {
        discard = false

        return {
          ...note,
          title: noteTitle(note.title),
          text: formatReferences(note.text, context)
        }
      })
      let { type } = commit

      if (commit.type === 'feat') {
        type = 'Features'
      } else if (commit.type === 'fix') {
        type = 'Bug Fixes'
      } else if (commit.type === 'perf') {
        type = 'Performance Improvements'
      } else if (commit.type === 'revert' || commit.revert) {
        type = 'Reverts'
      } else if (discard) {
        return undefined
      } else if (commit.type === 'docs') {
        type = 'Documentation'
      } else if (commit.type === 'style') {
        type = 'Styles'
      } else if (commit.type === 'refactor') {
        type = 'Code Refactoring'
      } else if (commit.type === 'test') {
        type = 'Tests'
      } else if (commit.type === 'build') {
        type = 'Build System'
      } else if (commit.type === 'ci') {
        type = 'Continuous Integration'
      }

      const scope = commit.scope === '*' ? '' : commit.scope
      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash
      const issues = []
      let { subject } = commit

      if (typeof subject === 'string') {
        // Issue and user URLs.
        subject = formatReferences(subject, context, issues)
      }

      // remove references that already appear in the subject
      const references = commit.references.filter(reference => !issues.includes(reference.prefix + reference.issue))

      return {
        notes,
        type,
        scope,
        shortHash,
        subject,
        references
      }
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareNotes
  }
}
