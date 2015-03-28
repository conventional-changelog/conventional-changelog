'use strict';

var reHash = /\b[0-9a-f]{5,40}\b/;

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

// ['alpha', 'beta'] ==> new RegExp('(alpha|beta):\\s([\\s\\S]*)')
function getNotesRegex(noteKeywords) {
  return new RegExp('(' + join(noteKeywords, '|') + '):\\s([\\s\\S]*)');
}

// ['closed', 'closes'] => new RegExp('(closed|closes)\\s((?:#\\d+(?:\\,\\s)?)+)', 'gi')
function getClosesRegex(closeKeywords) {
  return new RegExp('(?:' + join(closeKeywords, '|') + ')\\s((?:#\\d+(?:\\,\\s)?)+)', 'gi');
}

module.exports = {
  getNotesRegex: getNotesRegex,
  getClosesRegex: getClosesRegex,
  reHash: reHash
};
