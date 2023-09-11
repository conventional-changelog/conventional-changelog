import { createParserOpts } from './parserOpts.js'
import { createWriterOpts } from './writerOpts.js'
import { createConventionalChangelogOpts } from './conventionalChangelog.js'
import { createConventionalRecommendedBumpOpts } from './conventionalRecommendedBump.js'

export default async function createPreset () {
  const parserOpts = createParserOpts()
  const writerOpts = await createWriterOpts()
  const recommendedBumpOpts = createConventionalRecommendedBumpOpts(parserOpts)
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
