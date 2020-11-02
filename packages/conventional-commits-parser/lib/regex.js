'use strict'

var reNomatch = /(?!.*)/

function join (array, joiner) {
  return array
    .map(function (val) {
      return val.trim()
    })
    .filter(function (val) {
      return val.length
    })
    .join(joiner)
}

function getNotesRegex (noteKeywords, notesPattern) {
  if (!noteKeywords) {
    return reNomatch
  }

  const noteKeywordsSelection = join(noteKeywords, '|')

  if (!notesPattern) {
    return new RegExp('^[\\s|*]*(' + noteKeywordsSelection + ')[:\\s]+(.*)', 'i')
  }

  return notesPattern(noteKeywordsSelection)
}

function getReferencePartsRegex (issuePrefixes, issuePrefixesCaseSensitive) {
  if (!issuePrefixes) {
    return reNomatch
  }

  var flags = issuePrefixesCaseSensitive ? 'g' : 'gi'
  return new RegExp('(?:.*?)??\\s*([\\w-\\.\\/]*?)??(' + join(issuePrefixes, '|') + ')([\\w-]*\\d+)', flags)
}

function getReferencesRegex (referenceActions) {
  if (!referenceActions) {
    // matches everything
    return /()(.+)/gi
  }

  var joinedKeywords = join(referenceActions, '|')
  return new RegExp('(' + joinedKeywords + ')(?:\\s+(.*?))(?=(?:' + joinedKeywords + ')|$)', 'gi')
}

module.exports = function (options) {
  options = options || {}
  var reNotes = getNotesRegex(options.noteKeywords, options.notesPattern)
  var reReferenceParts = getReferencePartsRegex(options.issuePrefixes, options.issuePrefixesCaseSensitive)
  var reReferences = getReferencesRegex(options.referenceActions)

  return {
    notes: reNotes,
    referenceParts: reReferenceParts,
    references: reReferences,
    mentions: /@([\w-]+)/g
  }
}
