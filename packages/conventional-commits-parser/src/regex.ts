import type {
  ParserOptions,
  ParserRegexes
} from './types.js'

const nomatchRegex = /(?!.*)/

function escape(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function joinOr(parts: (string | RegExp)[]) {
  return parts
    .map(val => (typeof val === 'string' ? escape(val.trim()) : val.source))
    .filter(Boolean)
    .join('|')
}

function getNotesRegex(
  noteKeywords: (string | RegExp)[] | undefined,
  notesPattern: ((text: string) => RegExp) | undefined
) {
  if (!noteKeywords) {
    return nomatchRegex
  }

  const noteKeywordsSelection = joinOr(noteKeywords)

  if (!notesPattern) {
    return new RegExp(`^(?:\\*\\s+)?(${noteKeywordsSelection}):\\s*(.*)`, 'i')
  }

  return notesPattern(noteKeywordsSelection)
}

function getReferencePartsRegex(
  issuePrefixes: (string | RegExp)[] | undefined,
  issuePrefixesCaseSensitive: boolean | undefined,
  issueIdPattern = '\\d+'
) {
  if (!issuePrefixes) {
    return nomatchRegex
  }

  const flags = issuePrefixesCaseSensitive ? 'g' : 'gi'

  // Require a word boundary before the optional repository + prefix so letter-based
  // prefixes like `gh-` cannot match inside words (`tough-cookie`). Issue ids default
  // to digits to mirror GitHub autolinks (`#general` is not an issue reference).
  return new RegExp(`(?:.*?)??\\s*(?<![\\w-])(?:([\\w.-]+(?:/[\\w.-]+)?))?(${joinOr(issuePrefixes)})(${issueIdPattern})(?=\\s|$|[,;.)\\]])`, flags)
}

function getReferencesRegex(
  referenceActions: (string | RegExp)[] | undefined,
  separator = ''
) {
  if (!referenceActions) {
    // matches everything
    return /()(.+)/gi
  }

  const joinedKeywords = joinOr(referenceActions)
  // Keywords are whole words: `prefix #1` has no `fix` action,
  // and `fixups` does not end the references of the previous keyword.
  const nextKeyword = `(?<!\\w)(?:${joinedKeywords})(?!\\w)`

  return new RegExp(`(?<!\\w)(${joinedKeywords})${separator}(?:\\s+(.*?))(?=${nextKeyword}|$)`, 'gi')
}

function getFooterTokenRegex(
  issuePrefixes: (string | RegExp)[] | undefined
) {
  const issuePrefixSeparator = issuePrefixes
    ? `|\\s+(?:${joinOr(issuePrefixes)})`
    : ''

  // Footers follow the git trailer convention: the token starts at the
  // beginning of the line, indented `key: value` lines are not footers.
  return new RegExp(`^(?:BREAKING CHANGE|[\\w-]+)(?::\\s+${issuePrefixSeparator}).+`, 'i')
}

/**
 * Make the regexes used to parse a commit.
 * @param options
 * @returns Regexes.
 */
export function getParserRegexes(
  options: Pick<ParserOptions, 'noteKeywords' | 'notesPattern' | 'issuePrefixes' | 'issuePrefixesCaseSensitive' | 'issueIdPattern' | 'referenceActions'> = {}
): ParserRegexes {
  const notes = getNotesRegex(options.noteKeywords, options.notesPattern)
  const referenceParts = getReferencePartsRegex(options.issuePrefixes, options.issuePrefixesCaseSensitive, options.issueIdPattern)
  const references = getReferencesRegex(options.referenceActions)
  // In a footer the keyword is a token, which may be followed by a colon: `Closes: #1`
  const footerReferences = getReferencesRegex(options.referenceActions, ':?')
  const footerToken = getFooterTokenRegex(options.issuePrefixes)

  return {
    notes,
    referenceParts,
    references,
    footerReferences,
    footerToken,
    mentions: /@([\w-]+)/g,
    url: /\b(?:https?):\/\/(?:www\.)?([-a-zA-Z0-9@:%_+.~#?&//=])+\b/
  }
}
