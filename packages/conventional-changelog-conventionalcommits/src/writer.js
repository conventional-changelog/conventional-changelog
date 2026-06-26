import compareFunc from 'compare-func'
import { link } from '@conventional-changelog/template'
import { DEFAULT_COMMIT_TYPES } from './constants.js'
import {
  findTypeEntry,
  isTypeEffect,
  matchScope
} from './utils.js'
import {
  template,
  headerPartial,
  commitPartial,
  footerPartial
} from './templates.js'
import * as format from './format.js'

const COMMIT_HASH_LENGTH = 7
const releaseAsRegex = /release-as:\s*\w*@?([0-9]+\.[0-9]+\.[0-9a-z]+(-[0-9a-z.]+)?)\s*/i

export function createWriterOpts(config) {
  const finalConfig = {
    types: DEFAULT_COMMIT_TYPES,
    issuePrefixes: ['#'],
    ...format,
    ...config
  }
  const commitGroupOrder = finalConfig.types.map(t => t.section).filter(Boolean)

  return {
    template,
    headerPartial: headerPartial.bind(finalConfig),
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

      const notes = commit.notes.map((note) => {
        discard = false

        return {
          ...note,
          title: 'BREAKING CHANGES'
        }
      })

      if (
        // breaking changes attached to any type are still displayed.
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
        // Issue URLs.
        const issueRegEx = `(${finalConfig.issuePrefixes.join('|')})([a-z0-9]+)`
        const re = new RegExp(issueRegEx, 'g')

        subject = subject.replace(re, (_, prefix, issue) => {
          issues.push(prefix + issue)

          const issueUrl = finalConfig.formatIssueUrl(context, {
            issue,
            prefix
          })

          return link(`${prefix}${issue}`, issueUrl)
        })
        // User URLs.
        subject = subject.replace(/`[^`]*`|\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (match, user) => {
          if (!user) {
            return match
          }

          // TODO: investigate why this code exists.
          if (user.includes('/')) {
            return `@${user}`
          }

          const usernameUrl = finalConfig.formatUserUrl(context, user)

          return link(`@${user}`, usernameUrl)
        })
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
    notesSort: compareFunc
  }
}
