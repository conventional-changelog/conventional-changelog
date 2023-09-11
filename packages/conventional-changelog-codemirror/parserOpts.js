export function createParserOpts () {
  return {
    headerPattern: /^\[(.*?)(?: (.*))?] (.*)$/,
    headerCorrespondence: [
      'language',
      'type',
      'message'
    ]
  }
}
