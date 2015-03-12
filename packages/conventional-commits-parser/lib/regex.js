'use strict';
var forEach = require('lodash').forEach;

function getNotesRegex(noteKeywords) {
  var re = '(';
  var maxIndex = noteKeywords.length - 1;
  forEach(noteKeywords, function(val, index) {
    if (val) {
      re += val.trim();
      if (index < maxIndex) {
        re += '|';
      }
    }
  });
  re += '):\\s([\\s\\S]*)';
  return new RegExp(re);
}

function getClosesRegex(closeKeywords) {
  var re = '(?:';
  var maxIndex = closeKeywords.length - 1;
  forEach(closeKeywords, function(val, index) {
    if (val) {
      re += val.trim();
      if (index < maxIndex) {
        re += '|';
      }
    }
  });
  re += ')\\s((?:#\\d+(?:\\,\\s)?)+)';
  return new RegExp(re, 'ig');
}

module.exports = {
  getNotesRegex: getNotesRegex,
  getClosesRegex: getClosesRegex
};
