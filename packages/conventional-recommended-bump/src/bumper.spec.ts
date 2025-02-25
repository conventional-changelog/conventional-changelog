import { afterAll, describe, it, expect } from 'vitest'
import BetterThanBefore from 'better-than-before'
import { TestTools } from '../../../tools/index.js'
import type { Commit } from 'conventional-commits-parser'
import {
  Bumper,
  packagePrefix
} from './bumper.js'

const {
  setups,
  preparing,
  tearsWithJoy
} = BetterThanBefore()
let testTools: TestTools

setups([
  () => { // 1
    testTools = new TestTools()
    testTools.gitInit()
  },
  () => { // 2
    testTools.gitCommit(['feat!: my first commit'])
  },
  () => { // 3
    testTools.exec('git tag v1.0.0')
  },
  () => { // 4
    // we need non-empty commit, so we can revert it
    testTools.writeFileSync('file1', '')
    testTools.exec('git add file1')
    testTools.gitCommit(['feat: my second commit'])
  },
  () => { // 5
    testTools.exec('git revert HEAD')
  },
  () => { // 6
    testTools.gitCommit(['feat: should not be taken into account', 'BREAKING CHANGE: I broke the API'])
    testTools.exec('git tag ms/1.0.0')
    testTools.gitCommit(['feat: this should have been working'])
  },
  () => { // 7
    testTools.exec('git tag my-package@1.0.0')
    testTools.gitCommit(['feat: this should have been working'])
  }
])

tearsWithJoy(() => {
  testTools?.cleanup()
})

afterAll(() => {
  testTools?.cleanup()
})

describe('conventional-recommended-bump', () => {
  it('should return an error if there are no commits in the repository', async () => {
    preparing(1)

    await expect(() => new Bumper(testTools.cwd).bump(() => Promise.resolve(undefined))).rejects.toThrow()
  })

  describe('conventionalcommits ! in isolation', () => {
    it('recommends major if ! is used in isolation', async () => {
      preparing(2)

      const bumper = new Bumper(testTools.cwd).loadPreset('conventionalcommits')
      const recommendation = await bumper.bump()

      expect(recommendation).toMatchObject({
        reason: expect.stringContaining('1 BREAKING'),
        releaseType: 'major',
        commits: [expect.any(Object)]
      })
    })
  })

  describe('optional \'whatBump\'', () => {
    it('should throw an error if \'whatBump\' is defined but not a function', async () => {
      preparing(2)

      const bumper = new Bumper(testTools.cwd)

      await expect(() => bumper.bump()).rejects.toThrow('`whatBump` must be a function')
    })

    it('should return \'{}\' if \'whatBump\' returns nothing', async () => {
      preparing(2)

      const bumper = new Bumper(testTools.cwd)
      const recommendation = await bumper.bump(() => null)

      expect(recommendation).toMatchObject({
        commits: [expect.any(Object)]
      })
    })

    it('should return what is returned by \'whatBump\'', async () => {
      preparing(2)

      const bumper = new Bumper(testTools.cwd)
      const recommendation = await bumper.bump(() => ({
        level: 2,
        reason: 'test'
      }))

      expect(recommendation).toMatchObject({
        level: 2,
        reason: 'test',
        commits: [expect.any(Object)]
      })
    })

    it('should return \'releaseType\' as undefined if \'level\' is not valid', async () => {
      preparing(2)

      const bumper = new Bumper(testTools.cwd)
      const recommendation = await bumper.bump(() => ({
        level: undefined
      } as any))

      expect(recommendation).toMatchObject({
        level: undefined,
        releaseType: undefined,
        commits: [expect.any(Object)]
      })
    })
  })

  describe('loading a preset package', () => {
    it('recommends a patch release for a feature when preMajor=true', async () => {
      preparing(4)

      const bumper = new Bumper(testTools.cwd).loadPreset({
        name: 'conventionalcommits',
        preMajor: true
      })
      const recommendation = await bumper.bump()

      expect(recommendation).toMatchObject({
        reason: expect.stringContaining('1 features'),
        releaseType: 'patch',
        commits: [expect.any(Object)]
      })
    })

    it('recommends a minor release for a feature when preMajor=false', async () => {
      preparing(4)

      const bumper = new Bumper(testTools.cwd).loadPreset('conventionalcommits')
      const recommendation = await bumper.bump()

      expect(recommendation).toMatchObject({
        reason: expect.stringContaining('1 features'),
        releaseType: 'minor',
        commits: [expect.any(Object)]
      })
    })

    it('should ignore reverted commits', async () => {
      preparing(5)

      let commits: Commit[] = []

      await new Bumper(testTools.cwd).bump((cmts) => {
        commits = cmts

        return null
      })

      expect(commits.length).toBe(0)
    })

    it('should include reverted commits', async () => {
      preparing(5)

      let commits: Commit[] = []

      await new Bumper(testTools.cwd).commits({
        filterReverts: false
      }).bump((cmts) => {
        commits = cmts

        return null
      })

      expect(commits.length).toBe(2)
    })

    it('throws an error if unable to load a preset package', async () => {
      preparing(6)

      const bumper = new Bumper(testTools.cwd).loadPreset('does-not-exist')

      await expect(() => bumper.bump()).rejects.toThrow('Unable to load the "does-not-exist" preset. Please make sure it\'s installed.')
    })

    it('recommends a minor release for a breaking change when preMajor=true', async () => {
      preparing(6)

      const bumper = new Bumper(testTools.cwd).loadPreset({
        name: 'conventionalcommits',
        preMajor: true
      })
      const recommendation = await bumper.bump()

      expect(recommendation).toMatchObject({
        reason: expect.stringContaining('1 BREAKING'),
        releaseType: 'minor',
        commits: [expect.any(Object), expect.any(Object)]
      })
    })

    it('recommends a major release for a breaking change when preMajor=false', async () => {
      preparing(6)

      const bumper = new Bumper(testTools.cwd).loadPreset('conventionalcommits')
      const recommendation = await bumper.bump()

      expect(recommendation).toMatchObject({
        reason: expect.stringContaining('1 BREAKING'),
        releaseType: 'major',
        commits: [expect.any(Object), expect.any(Object)]
      })
    })
  })

  describe('repository with custom tag prefix', () => {
    it('should recommends a minor release if appropriate', async () => {
      preparing(6)

      let commits: Commit[] = []

      await new Bumper(testTools.cwd).tag({
        prefix: 'ms/'
      }).bump((cmts) => {
        commits = cmts

        return null
      })

      expect(commits.length).toBe(1)
      expect(commits[0].type).toBe('feat')
    })
  })

  describe('repository with lerna tags', () => {
    it('should recommend \'major\' version bump when not using lerna tags', async () => {
      preparing(7)

      let commits: Commit[] = []

      await new Bumper(testTools.cwd).bump((cmts) => {
        commits = cmts

        return null
      })

      expect(commits.length).toBe(3)
    })

    it('should recommend \'minor\' version bump when lerna tag option is enabled', async () => {
      preparing(7)

      let commits: Commit[] = []

      await new Bumper(testTools.cwd).tag({
        prefix: packagePrefix('my-package')
      }).bump((cmts) => {
        commits = cmts

        return null
      })

      expect(commits.length).toBe(1)
      expect(commits[0].type).toBe('feat')
    })
  })
})
