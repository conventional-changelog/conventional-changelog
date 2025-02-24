import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { ConventionalChangelog } from 'conventional-changelog'
import {
  TestTools,
  toArray
} from '../../../tools/index.ts'
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
    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('### tern')
    expect(chunks[0]).toContain('Use correct primary when selecting variables')
    expect(chunks[0]).toContain('**addon**')
    expect(chunks[0]).toContain('Add values for property flex-direction')
    expect(chunks[0]).toContain('### stylus')

    expect(chunks[0]).not.toContain('Bad')
  })
})
