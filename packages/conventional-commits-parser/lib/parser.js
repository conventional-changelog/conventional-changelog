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
  var lines = _.compact(raw.split('\n'));
  var continueNote = false;
  var isBody = true;
  var headerCorrespondence = _.map(options.headerCorrespondence, function(part) {
    return part.trim();
  });
  var reNotes = regex.notes;
  var reReferenceParts = regex.referenceParts;
  var reReferences = regex.references;

  // msg parts
  var hash = lines[0];
  var header = lines[1];
  var headerParts = {};
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
    _.forEach(headerCorrespondence, function(partName, index) {
      var partValue = headerMatch[index + 1] || null;
      headerParts[partName] = partValue;
    });
  } else {
    _.forEach(headerCorrespondence, function(partName) {
      headerParts[partName] = null;
    });
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
    var referenceMatched;

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

  // don't change the order of fields
  var msg = {
    hash: hash,
    header: header
  };
  msg = _.merge(msg, headerParts, {
    body: body,
    footer: footer,
    notes: notes,
    references: references
  });

  return msg;
}

module.exports = parser;
