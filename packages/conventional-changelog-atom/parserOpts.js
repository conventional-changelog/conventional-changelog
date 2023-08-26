'use strict'

function createParserOpts () {
  return {
    headerPattern: /^(:.*?:) (.*)$/,
    headerCorrespondence: [
      'emoji',
      'shortDesc'
    ]
  }
}

module.exports.createParserOpts = createParserOpts
