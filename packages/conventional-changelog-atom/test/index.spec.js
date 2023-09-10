import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from '../../../tools/test-tools.js'
import preset from '../index.js'

let testTools

describe('conventional-changelog-atom', () => {
  beforeAll(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitDummyCommit([':arrow_down: exception-reporting'])
    testTools.gitDummyCommit([':bug: `updateContentDimensions` when model changes'])
    testTools.gitDummyCommit(['Merge pull request #7881 from atom/bf-upgrade-babel-to-5.6.17'])
    testTools.gitDummyCommit([':arrow_up: language-gfm@0.79.0'])
    testTools.gitDummyCommit([':arrow_up: one-dark/light-ui@v1.0.1'])
  })

  afterAll(() => {
    testTools?.cleanup()
  })

  it('should work if there is no semver tag', async () => {
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain(':arrow_down:')
      expect(chunk).toContain('`updateContentDimensions` when model changes')
      expect(chunk).toContain(':arrow_up:')
      expect(chunk).toContain('one-dark/light-ui@v1.0.1')

      i++
    }

    expect(i).toBe(1)
  })
})
