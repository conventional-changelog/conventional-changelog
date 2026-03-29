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
    return new RegExp(`^[\\s|*]*(${noteKeywordsSelection})[:\\s]+(.*)`, 'i')
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

  return new RegExp(`(?:.*?)??\\s*([\\w-\\.\\/]*?)??(${joinOr(issuePrefixes)})([\\w-]+)(?=\\s|$|[,;)\\]])`, flags)
}

function getReferencesRegex(
  referenceActions: (string | RegExp)[] | undefined
) {
  if (!referenceActions) {
    // matches everything
    return /()(.+)/gi
  }

  const joinedKeywords = joinOr(referenceActions)

  return new RegExp(`(${joinedKeywords})(?:\\s+(.*?))(?=(?:${joinedKeywords})|$)`, 'gi')
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

  return {
    notes,
    referenceParts,
    references,
    mentions: /@([\w-]+)/g,
    url: /\b(?:https?):\/\/(?:www\.)?([-a-zA-Z0-9@:%_+.~#?&//=])+\b/
  }
}
