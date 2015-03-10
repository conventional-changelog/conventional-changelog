'use strict';
var regex = require('./regex');
var _ = require('lodash');

function parser(raw, options) {
  var warn;
  if (!_.isEmpty(options)) {
    warn = options.warn || function() {};
  } else {
    return null;
  }

  if (!raw || !raw.trim()) {
    warn('Cannot parse raw commit: "' + raw + '"');
    return null;
  }

  var match;
  var lines = _.compact(raw.split('\n'));
  var msg = {};

  msg.hash = lines[0];
  msg.header = lines[1];
  msg.body = '';
  msg.footer = '';
  msg.breaks = {};
  msg.closes = [];

  if (!msg.hash.match(/\b[0-9a-f]{5,40}\b/)) {
    msg.header = msg.hash;
    msg.hash = null;
    lines.shift();
  } else {
    lines.splice(0, 2);
  }

  if (!msg.header) {
    warn('Cannot parse commit header: "' + raw + '"');
    return null;
  }

  match = msg.header.match(options.headerPattern);
  if (!match || !match[1]) {
    warn('Cannot parse commit type: "' + raw + '"');
    return null;
  } else if (!match[3]) {
    warn('Cannot parse commit subject: "' + raw + '"');
    return null;
  }

  if (match[3].length > options.maxSubjectLength) {
    match[3] = match[3].substr(0, options.maxSubjectLength);
  }

  msg.type = match[1];
  msg.scope = match[2];
  msg.subject = match[3];

  _.forEach(lines, function(line) {
    var issue;
    var isBody = true;
    var reDigit = /\d+/;

    var reBreaks = regex.getBreaksRegex(options.breakKeywords);
    var reCloses = regex.getClosesRegex(options.closeKeywords);

    // this is a breaking change
    match = line.match(reBreaks);
    if (match) {
      isBody = false;
      msg.footer += line + '\n';
      msg.breaks[match[1]] = match[2];
    }

    // this closes an issue
    match = line.match(reCloses);
    if (match) {
      isBody = false;
      msg.footer += line + '\n';
      _.forEach(match, function(m) {
        _.forEach(m.split(','), function(i) {
          issue = i.match(reDigit);
          if (issue) {
            msg.closes.push(parseInt(issue[0], 10));
          }
        });
      });
    }

    // this is a body
    if (isBody) {
      msg.body += line + '\n';
    }
  });

  msg.body = msg.body.trim();
  msg.footer = msg.footer.trim();

  return msg;
}

module.exports = parser;
