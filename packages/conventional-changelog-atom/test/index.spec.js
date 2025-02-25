import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { ConventionalChangelog } from 'conventional-changelog'
import {
  TestTools,
  toArray
} from '../../../tools/index.ts'
import preset from '../src/index.js'

let testTools

describe('conventional-changelog-atom', () => {
  beforeAll(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitCommit([':arrow_down: exception-reporting'])
    testTools.gitCommit([':bug: `updateContentDimensions` when model changes'])
    testTools.gitCommit(['Merge pull request #7881 from atom/bf-upgrade-babel-to-5.6.17'])
    testTools.gitCommit([':arrow_up: language-gfm@0.79.0'])
    testTools.gitCommit([':arrow_up: one-dark/light-ui@v1.0.1'])
  })

  afterAll(() => {
    testTools?.cleanup()
  })

  it('should work if there is no semver tag', async () => {
    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain(':arrow_down:')
    expect(chunks[0]).toContain('`updateContentDimensions` when model changes')
    expect(chunks[0]).toContain(':arrow_up:')
    expect(chunks[0]).toContain('one-dark/light-ui@v1.0.1')

    expect(chunks.length).toBe(1)
  })
})
