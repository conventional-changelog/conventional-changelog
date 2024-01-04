import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from '../../../tools/test-tools.ts'
import preset from '../index.js'

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
    for await (let chunk of conventionalChangelogCore(
      {
        cwd: testTools.cwd,
        config: preset
      }
    )) {
      chunk = chunk.toString()

      expect(chunk).toContain('### Dependencies')
      expect(chunk).toContain('type-is@~1.6.3')
      expect(chunk).toContain(' - deps: mime-types@~2.1.1\n')
      expect(chunk).toContain('path-to-regexp@0.1.4')
      expect(chunk).toContain('### Performance')
      expect(chunk).toContain('use saved reference to http.STATUS_CODES')

      expect(chunk).not.toContain('license')
      expect(chunk).not.toContain('Bad')
    }
  })
})
