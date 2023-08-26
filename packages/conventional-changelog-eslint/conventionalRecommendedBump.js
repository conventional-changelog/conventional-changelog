'use strict'

function createConventionalRecommendedBumpOpts (parserOpts) {
  return {
    parserOpts,

    whatBump (commits) {
      let level = 2
      let breakings = 0
      let features = 0

      commits.forEach(commit => {
        if (!commit.tag) return

        if (commit.tag.toLowerCase() === 'breaking') {
          breakings += 1
          level = 0
        } else if (commit.tag.toLowerCase() === 'new') {
          features += 1
          if (level === 2) {
            level = 1
          }
        }
      })

      return {
        level,
        reason: `There are ${breakings} breaking changes and ${features} features`
      }
    }
  }
}

module.exports.createConventionalRecommendedBumpOpts = createConventionalRecommendedBumpOpts
