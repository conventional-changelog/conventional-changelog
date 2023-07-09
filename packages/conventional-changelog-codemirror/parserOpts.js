'use strict'

function createParserOpts () {
  return {
    headerPattern: /^\[(.*?)(?: (.*))?] (.*)$/,
    headerCorrespondence: [
      'language',
      'type',
      'message'
    ]
  }
}

module.exports.createParserOpts = createParserOpts
