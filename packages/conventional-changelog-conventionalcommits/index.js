import { DEFAULT_COMMIT_TYPES } from './constants.js'
import { createParserOpts } from './parserOpts.js'
import { createWriterOpts } from './writerOpts.js'
import { createConventionalChangelogOpts } from './conventionalChangelog.js'
import { createConventionalRecommendedBumpOpts } from './conventionalRecommendedBump.js'

export { DEFAULT_COMMIT_TYPES }

export default async function createPreset (config) {
  const parserOpts = createParserOpts(config)
  const writerOpts = await createWriterOpts(config)
  const recommendedBumpOpts = createConventionalRecommendedBumpOpts(config, parserOpts)
  const conventionalChangelog = createConventionalChangelogOpts(parserOpts, writerOpts)

  return {
    gitRawCommitsOpts: {
      ignore: config?.ignoreCommits,
      noMerges: null
    },
    parserOpts,
    writerOpts,
    recommendedBumpOpts,
    conventionalChangelog
  }
}
