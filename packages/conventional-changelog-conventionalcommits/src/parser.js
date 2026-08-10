import { BREAKING_CHANGE_KEYWORDS } from '@conventional-changelog/template'
import { BREAKING_HEADER_PATTERN } from './constants.js'

export function createParserOpts(config) {
  return {
    headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
    breakingHeaderPattern: BREAKING_HEADER_PATTERN,
    headerCorrespondence: [
      'type',
      'scope',
      'subject'
    ],
    noteKeywords: BREAKING_CHANGE_KEYWORDS,
    revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash'],
    issuePrefixes: config?.issuePrefixes || ['#']
  }
}
