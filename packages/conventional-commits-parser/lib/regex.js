'use strict';

var reNomatch = /(?!.*)/;
var reReferenceParts = /(?:.*?)??\s*(\S*?)??(?:gh-|#)(\d+)/gi;

function join(array, joiner) {
  return array
    .map(function(val) {
      return val.trim();
    })
    .filter(function(val) {
      return val.length;
    })
    .join(joiner);
}

function getNotesRegex(noteKeywords) {
  if (!noteKeywords) {
    return reNomatch;
  }

  return new RegExp('(' + join(noteKeywords, '|') + ')[:\\s]*(.*)');
}

function getReferencesRegex(referenceKeywords) {
  if (!referenceKeywords) {
    return reNomatch;
  }

  var joinedKeywords = join(referenceKeywords, '|');
  return new RegExp('(' + joinedKeywords + ')(?:\\s+(.*?))(?=(?:' + joinedKeywords + ')|$)', 'ig');
}

module.exports = function(options) {
  options = options || {};
  var reNotes = getNotesRegex(options.noteKeywords);
  var reReferences = getReferencesRegex(options.referenceKeywords);

  return {
    notes: reNotes,
    referenceParts: reReferenceParts,
    references: reReferences
  };
};
