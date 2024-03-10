export function createParserOpts () {
  return {
    headerPattern: /^\[\[(.*)]] (.*)$/,
    headerCorrespondence: [
      'type',
      'shortDesc'
    ],
    noteKeywords: ['BREAKING CHANGE']
  }
}
