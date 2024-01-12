import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from '../../../tools/index.ts'
import preset from '../index.js'

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
    for await (let chunk of conventionalChangelogCore(
      {
        cwd: testTools.cwd,
        config: preset
      }
    )) {
      chunk = chunk.toString()

      expect(chunk).toContain('the `no-class-assign` rule')
      expect(chunk).toContain('### Fix')
      expect(chunk).toContain('indent rule should recognize single line statements with ASI')
      expect(chunk).toContain('* Commit with trailing spaces in the beginning')
      expect(chunk).toContain('### Docs')

      expect(chunk).not.toContain('3033')
    }
  })
})
