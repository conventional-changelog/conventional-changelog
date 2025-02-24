import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { ConventionalChangelog } from 'conventional-changelog'
import {
  TestTools,
  toArray
} from '../../../tools/index.ts'
import preset from '../src/index.js'

let testTools

describe('conventional-changelog-jshint', () => {
  beforeAll(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitCommit(['[[Chore]] Move scope-manager to external file'])
    testTools.gitCommit(['[[Test]] Add test for gh-985. Fixes #985'])
    testTools.gitCommit(['[[FIX]] catch params are scoped to the catch only'])
    testTools.gitCommit(['[[Fix]] accidentally use lower-case'])
    testTools.gitCommit(['[[FEAT]] Option to assume strict mode', '', 'BREAKING CHANGE: Not backward compatible.'])
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

    expect(chunks[0]).toContain('catch params are scoped to the catch only')
    expect(chunks[0]).toContain('### Bug Fixes')
    expect(chunks[0]).toContain('Option to assume strict mode')
    expect(chunks[0]).toContain('accidentally use lower-case')
    expect(chunks[0]).toContain('### Features')
    expect(chunks[0]).toContain('BREAKING CHANGES')

    expect(chunks[0]).not.toContain('Chore')
    expect(chunks[0]).not.toContain('Move scope-manager to external file')
    expect(chunks[0]).not.toContain('Add test for gh-985.')
    expect(chunks[0]).not.toContain('Bad')
  })
})
