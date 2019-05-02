const { breakingHeaderPattern } = require('./parser-opts')()

module.exports = (commit) => {
  const match = commit.header.match(breakingHeaderPattern)
  if (match) {
    const noteText = match[3] // the description of the change.
    commit.notes.push({
      text: noteText
    })
  }
}
