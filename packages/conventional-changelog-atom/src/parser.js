export function createParserOpts () {
  return {
    headerPattern: /^(:.*?:) (.*)$/,
    headerCorrespondence: [
      'emoji',
      'shortDesc'
    ]
  }
}
