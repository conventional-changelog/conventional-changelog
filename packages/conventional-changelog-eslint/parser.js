export function createParserOpts () {
  return {
    headerPattern: /^(\w*):\s*(.*)$/,
    headerCorrespondence: [
      'tag',
      'message'
    ]
  }
}
