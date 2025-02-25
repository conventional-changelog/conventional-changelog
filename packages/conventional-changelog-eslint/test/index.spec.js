import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { ConventionalChangelog } from 'conventional-changelog'
import {
  TestTools,
  toArray
} from '../../../tools/index.ts'
import preset from '../src/index.js'

let testTools

describe('conventional-changelog-eslint', () => {
  beforeAll(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitCommit(['Fix: the `no-class-assign` rule (fixes #2718)'])
    testTools.gitCommit([])
    testTools.gitCommit(['Update: Handle CRLF line endings in spaced-comment rule - 2 (fixes #3005)'])
    testTools.gitCommit(['Fix: indent rule should recognize single line statements with ASI (fixes #3001, fixes #3000)'])
    testTools.gitCommit(['Docs: Fix unmatched paren in rule description'])
    testTools.gitCommit(['Fix:        Commit with trailing spaces in the beginning'])
    testTools.gitCommit(['Merge pull request #3033 from gcochard/patch-3 '])
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

    expect(chunks[0]).toContain('the `no-class-assign` rule')
    expect(chunks[0]).toContain('### Fix')
    expect(chunks[0]).toContain('indent rule should recognize single line statements with ASI')
    expect(chunks[0]).toContain('* Commit with trailing spaces in the beginning')
    expect(chunks[0]).toContain('### Docs')

    expect(chunks[0]).not.toContain('3033')
  })
})
