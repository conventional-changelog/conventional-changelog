'use strict'

function createParserOpts () {
  return {
    headerPattern: /^(\w*): (.*)$/,
    headerCorrespondence: [
      'component',
      'shortDesc'
    ]
  }
}

module.exports.createParserOpts = createParserOpts
