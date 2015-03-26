'use strict';

var reHash = /\b[0-9a-f]{5,40}\b/;
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
  return new RegExp('(' + join(noteKeywords, '|') + ')[:\\s]*(.*)');
}

function getReferencesRegex(referenceKeywords) {
  var joinedKeywords = join(referenceKeywords, '|');
  return new RegExp('(' + joinedKeywords + ')(?:\\s+(.*?))(?=(?:' + joinedKeywords + ')|$)', 'ig');
}

module.exports = {
  getNotesRegex: getNotesRegex,
  getReferencesRegex: getReferencesRegex,
  reHash: reHash,
  reReferenceParts: reReferenceParts
};
