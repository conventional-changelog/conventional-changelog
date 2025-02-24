import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import { ConventionalChangelog } from 'conventional-changelog'
import {
  TestTools,
  toArray
} from '../../../tools/index.ts'
import preset from '../src/index.js'

let testTools

describe('conventional-changelog-express', () => {
  beforeEach(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitCommit([
      'deps: type-is@~1.6.3',
      '',
      ' - deps: mime-types@~2.1.1',
      ' - perf: reduce try block size',
      ' - perf: remove bitwise operations'
    ])
    testTools.gitCommit(['perf: use saved reference to http.STATUS_CODES', '', 'closes #2602'])
    testTools.gitCommit(['docs: add license comments'])
    testTools.gitCommit(['deps: path-to-regexp@0.1.4'])
    testTools.gitCommit('Bad commit')
  })

  afterEach(() => {
    testTools?.cleanup()
  })

  it('should work if there is no semver tag', async () => {
    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('### Dependencies')
    expect(chunks[0]).toContain('type-is@~1.6.3')
    expect(chunks[0]).toContain(' - deps: mime-types@~2.1.1\n')
    expect(chunks[0]).toContain('path-to-regexp@0.1.4')
    expect(chunks[0]).toContain('### Performance')
    expect(chunks[0]).toContain('use saved reference to http.STATUS_CODES')

    expect(chunks[0]).not.toContain('license')
    expect(chunks[0]).not.toContain('Bad')
  })
})
