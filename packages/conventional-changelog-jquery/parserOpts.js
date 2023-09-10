export function createParserOpts () {
  return {
    headerPattern: /^(\w*): (.*)$/,
    headerCorrespondence: [
      'component',
      'shortDesc'
    ]
  }
}
