#!/usr/bin/env node
import sade from 'sade'
import { getSemverTags } from './index.js'

const cli = sade('git-semver-tags', true)

cli
  .describe('Get all git semver tags of your repository in reverse chronological order.')
  .version('stable')
  .option('--cwd', 'path to git repository to be searched')
  .option('--lerna', 'parse lerna style git tags')
  .option('--package', 'when listing lerna style tags, filter by a package')
  .option('--tag-prefix', 'prefix to remove from the tags during their processing')
  .option('--skip-unstable', 'if given, unstable tags will be skipped, e.g., x.x.x-alpha.1, x.x.x-rc.2')
  .action(async (args) => {
    const tags = await getSemverTags({
      lernaTags: args.lerna === true,
      package: args.package,
      tagPrefix: args['tag-prefix'],
      skipUnstable: args['skip-unstable'] === true
    })

    // eslint-disable-next-line no-console
    console.log(tags.join('\n'))
  })
  .parse(process.argv)
