'use strict';
var _ = require('lodash');

function parser(raw, options, regex) {
  if (!raw || !raw.trim()) {
    throw new TypeError('Expected a raw commit');
  }

  if (_.isEmpty(options)) {
    throw new TypeError('Expected options');
  }

  var headerMatch;
  var referenceSentences;
  var referenceMatch;
  var referenceMatched;
  var lines = _.compact(raw.split('\n'));
  var msg = {};
  var continueNote = false;
  var isBody = true;
  var reNotes = regex.notes;
  var reReferenceParts = regex.referenceParts;
  var reReferences = regex.references;

  function getHeadCorrespondence(part) {
    var headerCorrespondence = options.headerCorrespondence
      .map(function(val) {
        return val.trim();
      })
      .filter(function(val) {
        return val.length;
      });
    var index = _.indexOf(headerCorrespondence, part) + 1;
    if (index === 0) {
      throw new TypeError('Expected options.headerCorrespondence to only contain "type" "scope" or "subject"');
    }

    return index;
  }

  var typeIndex = getHeadCorrespondence('type');
  var scopeIndex = getHeadCorrespondence('scope');
  var subjectIndex = getHeadCorrespondence('subject');

  msg.hash = lines[0];
  msg.header = lines[1];
  msg.type = null;
  msg.scope = null;
  msg.subject = null;
  msg.body = '';
  msg.footer = '';
  msg.notes = [];
  msg.references = [];

  if (!msg.hash.match(regex.hash)) {
    msg.header = msg.hash;
    msg.hash = null;
    lines.shift();
  } else {
    lines.splice(0, 2);
  }

  if (!msg.header) {
    throw new Error('"' + raw + '" does not contain a header');
  }

  headerMatch = msg.header.match(options.headerPattern);

  if (headerMatch) {
    if (headerMatch[typeIndex]) {
      msg.type = headerMatch[typeIndex];
    }
    if (headerMatch[scopeIndex]) {
      msg.scope = headerMatch[scopeIndex];
    }
    if (headerMatch[subjectIndex]) {
      msg.subject = headerMatch[subjectIndex];
    }
  }

  // incase people reference an issue in the header
  while (referenceSentences = reReferences.exec(msg.header)) {
    var action = referenceSentences[1];
    var sentence = referenceSentences[2];
    while (referenceMatch = reReferenceParts.exec(sentence)) {
      var reference = {
        action: action.trim(),
        repository: referenceMatch[1] || null,
        issue: referenceMatch[2],
        raw: referenceMatch[0]
      };
      msg.references.push(reference);
    }
  }

  // body or footer
  _.forEach(lines, function(line) {
    var notes = msg.notes;

    // this is a new important note
    var notesMatch = line.match(reNotes);
    if (notesMatch) {
      continueNote = true;
      isBody = false;
      msg.footer += line + '\n';
      notes.push({
        title: notesMatch[1],
        text: notesMatch[2]
      });

      return;
    }

    // this references an issue
    while (referenceSentences = reReferences.exec(line)) {
      var action = referenceSentences[1];
      var sentence = referenceSentences[2];
      while (referenceMatch = reReferenceParts.exec(sentence)) {
        referenceMatched = true;
        continueNote = false;
        isBody = false;
        var reference = {
          action: action.trim(),
          repository: referenceMatch[1] || null,
          issue: referenceMatch[2],
          raw: referenceMatch[0]
        };
        msg.references.push(reference);
      }
    }

    if (referenceMatched) {
      msg.footer += line + '\n';

      return;
    }

    // this is a continued important note
    if (continueNote) {
      var text = notes[notes.length - 1].text;
      notes[notes.length - 1].text = text + (text ? '\n' : '') + line;
      msg.footer += line + '\n';

      return;
    }

    // this is a body
    if (isBody) {
      msg.body += line + '\n';
    } else {
      msg.footer += line + '\n';
    }
  });

  msg.body = msg.body.trim();
  msg.footer = msg.footer.trim();
  if (!msg.body) {
    msg.body = null;
  }
  if (!msg.footer) {
    msg.footer = null;
  }

  return msg;
}

module.exports = parser;
