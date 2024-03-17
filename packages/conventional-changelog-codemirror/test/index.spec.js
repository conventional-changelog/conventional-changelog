import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from '../../../tools/index.ts'
import preset from '../src/index.js'

let testTools

describe('conventional-changelog-codemirror', () => {
  beforeAll(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.writeFileSync('test1', '')
    testTools.exec('git add --all && git commit -m"[tern addon] Use correct primary when selecting variables"]')
    testTools.writeFileSync('test2', '')
    testTools.exec('git add --all && git commit -m"[tern addon] Fix patch bc026f1"')
    testTools.writeFileSync('test3', '')
    testTools.exec('git add --all && git commit -m"[css mode] Add values for property flex-direction"]')
    testTools.writeFileSync('test4', '')
    testTools.exec('git add --all && git commit -m"[stylus mode] Fix highlight class after a $var"]')
    testTools.writeFileSync('test5', '')
    testTools.exec('git add --all && git commit -m"Bad commit"')
  })

  afterAll(() => {
    testTools?.cleanup()
  })

  it('should work if there is no semver tag', async () => {
    for await (let chunk of conventionalChangelogCore({
      config: preset,
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('### tern')
      expect(chunk).toContain('Use correct primary when selecting variables')
      expect(chunk).toContain('**addon**')
      expect(chunk).toContain('Add values for property flex-direction')
      expect(chunk).toContain('### stylus')

      expect(chunk).not.toContain('Bad')
    }
  })
})
