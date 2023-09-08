import type { ParserOptions } from './types.js'

export const defaultOptions: ParserOptions = {
  noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
  issuePrefixes: ['#'],
  referenceActions: [
    'close',
    'closes',
    'closed',
    'fix',
    'fixes',
    'fixed',
    'resolve',
    'resolves',
    'resolved'
  ],
  headerPattern: /^(\w*)(?:\(([\w$.\-*/ ]*)\))?: (.*)$/,
  headerCorrespondence: [
    'type',
    'scope',
    'subject'
  ],
  revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash'],
  fieldPattern: /^-(.*?)-$/
}
