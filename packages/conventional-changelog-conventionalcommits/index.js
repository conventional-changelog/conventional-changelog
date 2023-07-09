'use strict'

const { createParserOpts } = require('./parserOpts')
const { createWriterOpts } = require('./writerOpts')
const { createConventionalChangelogOpts } = require('./conventionalChangelog')
const { createConventionalRecommendedBumpOpts } = require('./conventionalRecommendedBump')

async function createPreset (config) {
  const parserOpts = createParserOpts(config)
  const writerOpts = await createWriterOpts(config)
  const recommendedBumpOpts = createConventionalRecommendedBumpOpts(config, parserOpts)
  const conventionalChangelog = createConventionalChangelogOpts(parserOpts, writerOpts)

  return {
    gitRawCommitsOpts: {
      noMerges: null
    },
    parserOpts,
    writerOpts,
    recommendedBumpOpts,
    conventionalChangelog
  }
}

module.exports = createPreset
