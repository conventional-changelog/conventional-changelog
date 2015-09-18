'use strict';
var trimOffNewlines = require('trim-off-newlines');
var _ = require('lodash');

function append(src, line) {
  if (src) {
    src += '\n' + line;
  } else {
    src = line;
  }

  return src;
}

function parser(raw, options, regex) {
  if (!raw || !raw.trim()) {
    throw new TypeError('Expected a raw commit');
  }

  if (_.isEmpty(options)) {
    throw new TypeError('Expected options');
  }

  if (_.isEmpty(regex)) {
    throw new TypeError('Expected regex');
  }

  var headerMatch;
  var referenceSentences;
  var referenceMatch;
  var currentProcessedField;
  var revertMatch;
  var otherFields = {};
  var lines = trimOffNewlines(raw).split('\n');
  var continueNote = false;
  var isBody = true;
  var headerCorrespondence = _.map(options.headerCorrespondence, function(part) {
    return part.trim();
  });
  var revertCorrespondence = _.map(options.revertCorrespondence, function(field) {
    return field.trim();
  });

  var reNotes = regex.notes;
  var reReferenceParts = regex.referenceParts;
  var reReferences = regex.references;

  // msg parts
  var header = lines.shift();
  var headerParts = {};
  var body = '';
  var footer = '';
  var notes = [];
  var references = [];
  var revert;

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
      var owner = null;
      var repository = referenceMatch[1];

      if (repository) {
        var ownerRepo = repository.split('/');
        if (ownerRepo.length > 1) {
          owner = ownerRepo.shift();
          repository = ownerRepo.join('/');
        }
      } else {
        repository = null;
      }

      var reference = {
        action: action,
        owner: owner,
        repository: repository,
        issue: referenceMatch[3],
        raw: referenceMatch[0],
        prefix: referenceMatch[2]
      };
      references.push(reference);
    }
  }

  // body or footer
  _.forEach(lines, function(line) {
    if (options.fieldPattern) {
      var fieldMatch = options.fieldPattern.exec(line);

      if (fieldMatch) {
        currentProcessedField = fieldMatch[1];

        return;
      }

      if (currentProcessedField) {
        otherFields[currentProcessedField] = append(otherFields[currentProcessedField], line);

        return;
      }
    }

    var referenceMatched;

    // this is a new important note
    var notesMatch = line.match(reNotes);
    if (notesMatch) {
      continueNote = true;
      isBody = false;
      footer = append(footer, line);

      var note = {
        title: notesMatch[1],
        text: notesMatch[2]
      };

      notes.push(note);

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

        var owner = null;
        var repository = referenceMatch[1];

        if (repository) {
          var ownerRepo = repository.split('/');
          if (ownerRepo.length > 1) {
            owner = ownerRepo.shift();
            repository = ownerRepo.join('/');
          }
        } else {
          repository = null;
        }

        var reference = {
          action: action,
          owner: owner,
          repository: repository,
          issue: referenceMatch[3],
          raw: referenceMatch[0],
          prefix: referenceMatch[2]
        };
        references.push(reference);
      }
    }

    if (referenceMatched) {
      footer = append(footer, line);

      return;
    }

    // this is the continued important note
    if (continueNote) {
      notes[notes.length - 1].text = append(notes[notes.length - 1].text, line);
      footer = append(footer, line);

      return;
    }

    // this is the body
    if (isBody) {
      body = append(body, line);
    }

    // this is the continued footer
    else {
      footer = append(footer, line);
    }
  });

  // does this commit revert any other commit?
  revertMatch = raw.match(options.revertPattern);

  if (revertMatch) {
    revert = {};
    _.forEach(revertCorrespondence, function(fieldName, index) {
      var fieldValue = revertMatch[index + 1] || null;
      revert[fieldName] = fieldValue;
    });
  } else {
    revert = null;
  }

  _.map(notes, function(note) {
    note.text = trimOffNewlines(note.text);

    return note;
  });

  var msg  = _.merge(headerParts, {
    header: header,
    body: body ? trimOffNewlines(body) : null,
    footer: footer ? trimOffNewlines(footer) : null,
    notes: notes,
    references: references,
    revert: revert
  }, otherFields);

  return msg;
}

module.exports = parser;
