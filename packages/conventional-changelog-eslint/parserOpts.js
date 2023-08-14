'use strict'

function createParserOpts () {
  return {
    headerPattern: /^(\w*):\s*(.*)$/,
    headerCorrespondence: [
      'tag',
      'message'
    ]
  }
}

module.exports.createParserOpts = createParserOpts
