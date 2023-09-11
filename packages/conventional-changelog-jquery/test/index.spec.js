import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from '../../../tools/test-tools.js'
import preset from '../index.js'

let testTools

describe('conventional-changelog-jquery', () => {
  beforeEach(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.writeFileSync('package.json', JSON.stringify({
      name: 'conventional-changelog-core',
      repository: {
        type: 'git',
        url: 'https://github.com/conventional-changelog/conventional-changelog.git'
      }
    }))
    testTools.gitDummyCommit(['Core: Make jQuery objects iterable'])
    testTools.gitDummyCommit(["CSS: Don't name the anonymous swap function"])
    testTools.gitDummyCommit([
      'Event: Remove an internal argument to the on method',
      'Fixes #2, #4, gh-200'
    ])
    testTools.gitDummyCommit([
      'Manipulation: Remove an internal argument to the remove method',
      'Closes #22'
    ])
    testTools.gitDummyCommit('Bad commit')
    testTools.gitDummyCommit(['Core: Create jQuery.ajax', 'Closes gh-100'])
  })

  afterEach(() => {
    testTools?.cleanup()
  })

  it('should generate a changelog', async () => {
    for await (let chunk of conventionalChangelogCore(
      {
        cwd: testTools.cwd,
        config: preset
      }
    )) {
      chunk = chunk.toString()

      expect(chunk).toContain('Create jQuery.ajax')
      expect(chunk).toContain(', closes [gh-100](https://github.com/conventional-changelog/conventional-changelog/issues/100)')
      expect(chunk).toContain(')\n* Make jQuery objects iterable')
      expect(chunk).toContain('### CSS')
      expect(chunk).toContain('Remove an internal argument to the on method')
      expect(chunk).toContain(', closes [#2](https://bugs.jquery.com/ticket/2) [#4](https://bugs.jquery.com/ticket/4) [gh-200](https://github.com/conventional-changelog/conventional-changelog/issues/200)')
      expect(chunk).toContain('### Manipulation')

      expect(chunk).not.toContain('Bad')
    }
  })
})
