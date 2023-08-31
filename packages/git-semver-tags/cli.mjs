#!/usr/bin/env node
import meow from 'meow'
import gitSemverTags from './index.js'

const args = meow(`
  Usage
    git-semver-tags
  Options
    --cwd                  path to git repository to be searched
    --lerna                parse lerna style git tags
    --package <name>       when listing lerna style tags, filter by a package
    --tag-prefix <prefix>  prefix to remove from the tags during their processing
    --skip-unstable        if given, unstable tags will be skipped, e.g., x.x.x-alpha.1, x.x.x-rc.2`,
{
  importMeta: import.meta,
  booleanDefault: undefined,
  flags: {
    cwd: {
      type: 'string'
    },
    lerna: {
      type: 'boolean'
    },
    package: {
      type: 'string'
    },
    tagPrefix: {
      type: 'string'
    },
    skipUnstable: {
      type: 'boolean'
    }
  }
})

const tags = await gitSemverTags({
  lernaTags: args.flags.lerna,
  package: args.flags.package,
  tagPrefix: args.flags.tagPrefix,
  skipUnstable: args.flags.skipUnstable
})

console.log(tags.join('\n'))
