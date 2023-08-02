import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from '../../../tools/test-tools'
import preset from '../'

let testTools

describe('conventional-changelog-jshint', () => {
  beforeAll(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitDummyCommit(['[[Chore]] Move scope-manager to external file'])
    testTools.gitDummyCommit(['[[Test]] Add test for gh-985. Fixes #985'])
    testTools.gitDummyCommit(['[[FIX]] catch params are scoped to the catch only'])
    testTools.gitDummyCommit(['[[Fix]] accidentally use lower-case'])
    testTools.gitDummyCommit(['[[FEAT]] Option to assume strict mode', '', 'BREAKING CHANGE: Not backward compatible.'])
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

      expect(chunk).toContain('catch params are scoped to the catch only')
      expect(chunk).toContain('### Bug Fixes')
      expect(chunk).toContain('Option to assume strict mode')
      expect(chunk).toContain('accidentally use lower-case')
      expect(chunk).toContain('### Features')
      expect(chunk).toContain('BREAKING CHANGES')

      expect(chunk).not.toContain('Chore')
      expect(chunk).not.toContain('Move scope-manager to external file')
      expect(chunk).not.toContain('Add test for gh-985.')
      expect(chunk).not.toContain('Bad')
    }
  })
})
