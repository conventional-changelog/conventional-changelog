import {
  describe,
  it,
  expect
} from 'vitest'
import { writeChangelogString } from 'conventional-changelog-writer'
import { writeChangelogString as writeChangelogStringLegacy } from 'conventional-changelog-writer-8'
import createPreset from '../src/index.js'

const commits = [
  {
    hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
    header: 'feat(awesome): add cool feature',
    type: 'feat',
    scope: 'awesome',
    subject: 'add cool feature',
    body: null,
    footer: null,
    notes: [],
    references: [],
    mentions: [],
    revert: null
  }
]
const context = {
  version: '2.0.0',
  host: 'https://github.com',
  owner: 'conventional-changelog',
  repository: 'conventional-changelog',
  linkReferences: true,
  commit: 'commit',
  issue: 'issues',
  date: '2026-08-18'
}

// downstream tooling spreads preset writer options into a new object,
// e.g. @semantic-release/release-notes-generator, so the guard must
// survive cloning
function createWriterOptsClone() {
  const { writer } = createPreset()

  return {
    ...writer
  }
}

describe('conventional-changelog-conventionalcommits', () => {
  describe('legacy writer guard', () => {
    it('should fail loudly when rendered by conventional-changelog-writer@8', async () => {
      await expect(
        writeChangelogStringLegacy(commits, context, createWriterOptsClone())
      ).rejects.toThrow(
        'conventional-changelog-conventionalcommits requires conventional-changelog-writer@9 or newer'
      )
    })

    it('should not affect conventional-changelog-writer@9', async () => {
      const changelog = await writeChangelogString(commits, context, createWriterOptsClone())

      expect(changelog).toContain('add cool feature')
      expect(changelog).not.toContain('Missing helper')
    })
  })
})
