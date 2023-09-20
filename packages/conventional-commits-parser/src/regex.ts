import type {
  ParserOptions,
  ParserRegexes
} from './types.js'

const nomatchRegex = /(?!.*)/

function join(parts: string[], joiner: string) {
  return parts
    .map(val => val.trim())
    .filter(Boolean)
    .join(joiner)
}

function getNotesRegex(
  noteKeywords: string[] | undefined,
  notesPattern: ((text: string) => RegExp) | undefined
) {
  if (!noteKeywords) {
    return nomatchRegex
  }

  const noteKeywordsSelection = join(noteKeywords, '|')

  if (!notesPattern) {
    return new RegExp(`^[\\s|*]*(${noteKeywordsSelection})[:\\s]+(.*)`, 'i')
  }

  return notesPattern(noteKeywordsSelection)
}

function getReferencePartsRegex(
  issuePrefixes: string[] | undefined,
  issuePrefixesCaseSensitive: boolean | undefined
) {
  if (!issuePrefixes) {
    return nomatchRegex
  }

  const flags = issuePrefixesCaseSensitive ? 'g' : 'gi'

  return new RegExp(`(?:.*?)??\\s*([\\w-\\.\\/]*?)??(${join(issuePrefixes, '|')})([\\w-]*\\d+)`, flags)
}

function getReferencesRegex(
  referenceActions: string[] | undefined
) {
  if (!referenceActions) {
    // matches everything
    return /()(.+)/gi
  }

  const joinedKeywords = join(referenceActions, '|')

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
    mentions: /@([\w-]+)/g
  }
}
