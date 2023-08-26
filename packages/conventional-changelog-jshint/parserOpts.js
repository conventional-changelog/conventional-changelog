'use strict'

function createParserOpts () {
  return {
    headerPattern: /^\[\[(.*)]] (.*)$/,
    headerCorrespondence: [
      'type',
      'shortDesc'
    ],
    noteKeywords: 'BREAKING CHANGE'
  }
}

module.exports.createParserOpts = createParserOpts
