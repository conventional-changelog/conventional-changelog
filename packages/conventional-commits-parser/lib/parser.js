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

  // msg parts
  var hash = lines[0];
  var header = lines[1];
  var type = null;
  var scope = null;
  var subject = null;
  var body = '';
  var footer = '';
  var notes = [];
  var references = [];

  if (!hash.match(regex.hash)) {
    header = hash;
    hash = null;
    lines.shift();
  } else {
    lines.splice(0, 2);
  }

  if (!header) {
    throw new Error('"' + raw + '" does not contain a header');
  }

  headerMatch = header.match(options.headerPattern);

  if (headerMatch) {
    if (headerMatch[typeIndex]) {
      type = headerMatch[typeIndex];
    }
    if (headerMatch[scopeIndex]) {
      scope = headerMatch[scopeIndex];
    }
    if (headerMatch[subjectIndex]) {
      subject = headerMatch[subjectIndex];
    }
  }

  // incase people reference an issue in the header
  while (referenceSentences = reReferences.exec(header)) {
    var action = referenceSentences[1];
    var sentence = referenceSentences[2];
    while (referenceMatch = reReferenceParts.exec(sentence)) {
      var reference = {
        action: action.trim(),
        repository: referenceMatch[1] || null,
        issue: referenceMatch[2],
        raw: referenceMatch[0]
      };
      references.push(reference);
    }
  }

  // body or footer
  _.forEach(lines, function(line) {
    // this is a new important note
    var notesMatch = line.match(reNotes);
    if (notesMatch) {
      continueNote = true;
      isBody = false;
      footer += line + '\n';
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
        references.push(reference);
      }
    }

    if (referenceMatched) {
      footer += line + '\n';

      return;
    }

    // this is a continued important note
    if (continueNote) {
      var text = notes[notes.length - 1].text;
      notes[notes.length - 1].text = text + (text ? '\n' : '') + line;
      footer += line + '\n';

      return;
    }

    // this is a body
    if (isBody) {
      body += line + '\n';
    } else {
      footer += line + '\n';
    }
  });

  body = body.trim();
  footer = footer.trim();
  if (!body) {
    body = null;
  }
  if (!footer) {
    footer = null;
  }

  return {
    hash: hash,
    header: header,
    type: type,
    scope: scope,
    subject: subject,
    body: body,
    footer: footer,
    notes: notes,
    references: references
  };
}

module.exports = parser;
