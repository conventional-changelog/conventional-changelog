'use strict';
var forEach = require('lodash').forEach;

function getBreaksRegex(breakKeywords) {
  var re = '(';
  var maxIndex = breakKeywords.length - 1;
  forEach(breakKeywords, function(val, index) {
    re += val;
    if (index < maxIndex) {
      re += '|';
    }
  });
  re += '):\\s([\\s\\S]*)';
  return new RegExp(re);
}

function getClosesRegex(closeKeywords) {
  var re = '(?:';
  var maxIndex = closeKeywords.length - 1;
  forEach(closeKeywords, function(val, index) {
    re += val;
    if (index < maxIndex) {
      re += '|';
    }
  });
  re += ')\\s((?:#\\d+(?:\\,\\s)?)+)';
  return new RegExp(re, 'ig');
}

module.exports = {
  getBreaksRegex: getBreaksRegex,
  getClosesRegex: getClosesRegex
};
