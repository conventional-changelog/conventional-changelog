import { createReferencesFormatter } from '@conventional-changelog/template'
import { DEFAULT_COMMIT_TYPES } from './constants.js'
import {
  findTypeEntry,
  getNotes,
  isTypeEffect,
  matchScope
} from './utils.js'
import {
  template,
  headerPartial,
  preamblePartial,
  commitPartial,
  footerPartial
} from './templates.js'
import * as format from './format.js'

const COMMIT_HASH_LENGTH = 7
const releaseAsRegex = /release-as:\s*\w*@?([0-9]+\.[0-9]+\.[0-9a-z]+(-[0-9a-z.]+)?)\s*/i

function compareNotes(a, b) {
  return (a.title || '').localeCompare(b.title || '')
    || (a.text || '').localeCompare(b.text || '')
}

export function createWriterOpts(config) {
  const finalConfig = {
    types: DEFAULT_COMMIT_TYPES,
    issuePrefixes: ['#'],
    ...format,
    ...config
  }
  const commitGroupOrder = finalConfig.types.map(t => t.section).filter(Boolean)
  const formatReferences = createReferencesFormatter(finalConfig)

  return {
    template: template.bind(finalConfig),
    headerPartial: headerPartial.bind(finalConfig),
    preamblePartial: preamblePartial.bind(finalConfig),
    commitPartial: commitPartial.bind(finalConfig),
    footerPartial: footerPartial.bind(finalConfig),
    transform: (commit, context) => {
      let discard = true
      const issues = []
      const entry = findTypeEntry(finalConfig.types, commit)

      // Add an entry in the CHANGELOG if special Release-As footer
      // is used:
      if ((commit.footer && releaseAsRegex.test(commit.footer))
        || (commit.body && releaseAsRegex.test(commit.body))) {
        discard = false
      }

      const notes = getNotes(commit).map((note) => {
        discard = false

        return {
          ...note,
          title: finalConfig.formatNoteTitle(context, note.title),
          text: formatReferences(note.text, context)
        }
      })

      if (
        // notes attached to any type are still displayed.
        discard && (entry === undefined || isTypeEffect(entry, 'hidden'))
        || !matchScope(finalConfig, commit)
      ) {
        return undefined
      }

      const type = entry
        ? entry.section
        : commit.type
      const scope = commit.scope === '*' || finalConfig.scope
        ? ''
        : commit.scope
      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash
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
    // the groupings of commit messages, e.g., Features vs., Bug Fixes, are
    // sorted based on their probable importance:
    commitGroupsSort: (a, b) => {
      const gRankA = commitGroupOrder.indexOf(a.title)
      const gRankB = commitGroupOrder.indexOf(b.title)

      return gRankA - gRankB
    },
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareNotes
  }
}
