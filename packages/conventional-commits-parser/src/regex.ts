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
  issuePrefixesCaseSensitive: boolean | undefined
) {
  if (!issuePrefixes) {
    return nomatchRegex
  }

  const flags = issuePrefixesCaseSensitive ? 'g' : 'gi'
  const repositoryChar = '[\\w-\\.\\/]'

  // A reference starts a word, and its repository is the whole word before the prefix,
  // so `gh-` is not a prefix inside of `tough-cookie` or `high-5`.
  // An issue has a digit, so `#general` is not a reference.
  return new RegExp(`(?:.*?)??\\s*(?<!${repositoryChar})(?:(${repositoryChar}+)(?!${repositoryChar}))?(${joinOr(issuePrefixes)})((?=[\\w-]*\\d)[\\w-]+)(?=\\s|$|[,;.)\\]])`, flags)
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
  options: Pick<ParserOptions, 'noteKeywords' | 'notesPattern' | 'issuePrefixes' | 'issuePrefixesCaseSensitive' | 'referenceActions'> = {}
): ParserRegexes {
  const notes = getNotesRegex(options.noteKeywords, options.notesPattern)
  const referenceParts = getReferencePartsRegex(options.issuePrefixes, options.issuePrefixesCaseSensitive)
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
