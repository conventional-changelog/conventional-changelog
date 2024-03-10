export function createParserOpts () {
  return {
    mergePattern: /^Merge pull request #(.*) from .*$/,
    mergeCorrespondence: ['pr'],
    headerPattern: /^\[(.*) (.*)] (.*)$/,
    headerCorrespondence: [
      'tag',
      'taggedAs',
      'message'
    ]
  }
}
