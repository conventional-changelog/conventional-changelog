import { describe, it, expect } from 'vitest'
import BetterThanBefore from 'better-than-before'
import { TestTools } from '../../../tools/test-tools.js'
import conventionalRecommendedBump from '../index.js'

const { setups, preparing, tearsWithJoy } = BetterThanBefore()
let testTools

setups([
  () => { // 1
    testTools = new TestTools()
    testTools.gitInit()
  },
  () => { // 2
    testTools.gitDummyCommit(['feat!: my first commit'])
  },
  () => { // 3
    testTools.exec('git tag v1.0.0')
  },
  () => { // 4
    // we need non-empty commit, so we can revert it
    testTools.writeFileSync('file1', '')
    testTools.exec('git add file1')
    testTools.gitDummyCommit(['feat: my second commit'])
  },
  () => { // 5
    testTools.exec('git revert HEAD')
  },
  () => { // 6
    testTools.gitDummyCommit(['feat: should not be taken into account', 'BREAKING CHANGE: I broke the API'])
    testTools.exec('git tag ms/1.0.0')
    testTools.gitDummyCommit(['feat: this should have been working'])
  },
  () => { // 7
    testTools.exec('git tag my-package@1.0.0')
    testTools.gitDummyCommit(['feat: this should have been working'])
  }
])

tearsWithJoy(() => {
  testTools?.cleanup()
})

describe('conventional-recommended-bump', () => {
  describe('options object', () => {
    it('should throw an error if an \'options\' object is not provided', async () => {
      await expect(() => conventionalRecommendedBump()).rejects.toThrow()
      await expect(() => conventionalRecommendedBump('invalid options object')).rejects.toThrow()
    })
  })

  describe('callback', () => {
    it('should throw an error if no, or an invalid, callback function is provided', async () => {
      preparing(1)

      await expect(() => conventionalRecommendedBump({ cwd: testTools.cwd })).rejects.toThrow()
      await expect(() => conventionalRecommendedBump({ cwd: testTools.cwd }, {})).rejects.toThrow()
      await expect(() => conventionalRecommendedBump({ cwd: testTools.cwd }, {}, {})).rejects.toThrow()
    })

    it('should allow callback function in the \'parserOpts\' argument spot', async () => {
      preparing(1)

      await expect(() => conventionalRecommendedBump({ cwd: testTools.cwd })).rejects.toThrow()
    })
  })

  it('should return an error if there are no commits in the repository', async () => {
    preparing(1)

    await expect(() => conventionalRecommendedBump({ cwd: testTools.cwd }, {})).rejects.toThrow()
  })

  it('should allow the string `conventionalcommits` as the preset option', async () => {
    preparing(2)

    await expect(() => conventionalRecommendedBump({
      cwd: testTools.cwd,
      preset: 'conventionalcommits'
    }, {})).not.toThrowError()
  })

  describe('conventionalcommits ! in isolation', () => {
    it('recommends major if ! is used in isolation', async () => {
      preparing(2)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        preset: {
          name: 'conventionalcommits'
        }
      }, {})

      expect(recommendation.reason).toContain('1 BREAKING')
      expect(recommendation.releaseType).toBe('major')
    })
  })

  describe('optional \'whatBump\'', () => {
    it('should throw an error if \'whatBump\' is defined but not a function', async () => {
      preparing(2)

      await expect(() => conventionalRecommendedBump({
        cwd: testTools.cwd,
        whatBump: 'invalid'
      }, {})).rejects.toThrow('whatBump must be a function')
    })

    it('should return \'{}\' if no \'whatBump\'', async () => {
      preparing(2)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd
      }, {})

      expect(recommendation).toEqual({})
    })

    it('should return \'{}\' if \'whatBump\' returns \'null\'', async () => {
      preparing(2)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        whatBump: () => null
      })

      expect(recommendation).toEqual({})
    })

    it('should return \'{}\' if \'whatBump\' returns \'undefined\'', async () => {
      preparing(2)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        whatBump: () => undefined
      })

      expect(recommendation).toEqual({})
    })

    it('should return what is returned by \'whatBump\'', async () => {
      preparing(2)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        whatBump: () => ({ test: 'test' })
      })

      expect(recommendation).toEqual({ test: 'test' })
    })

    it('should send options to \'whatBump\'', async () => {
      preparing(2)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        lernaPackage: 'test',
        whatBump: (commits, options) => options.lernaPackage
      })

      expect(recommendation).toBe('test')
    })

    it('should return \'releaseType\' as undefined if \'level\' is not valid', async () => {
      preparing(2)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        whatBump: () => ({ level: 'test' })
      })

      expect(recommendation).toEqual({ level: 'test', releaseType: undefined })
    })
  })

  describe('warn logging', () => {
    it('will ignore \'warn\' option if it\'s not a function', async () => {
      preparing(3)

      await conventionalRecommendedBump({
        cwd: testTools.cwd
      }, { warn: 'invalid' })
    })

    it('should warn if there is no new commits since last release', async () => {
      preparing(3)

      await conventionalRecommendedBump({
        cwd: testTools.cwd
      }, {
        warn: warning => {
          expect(warning).toBe('No commits since last release')
        }
      })
    })
  })

  describe('loading a preset package', () => {
    it('recommends a patch release for a feature when preMajor=true', async () => {
      preparing(4)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        preset: {
          name: 'conventionalcommits',
          preMajor: true
        }
      }, {})

      expect(recommendation.reason).toContain('1 features')
      expect(recommendation.releaseType).toBe('patch')
    })

    it('recommends a minor release for a feature when preMajor=false', async () => {
      preparing(4)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        preset: {
          name: 'conventionalcommits'
        }
      }, {})

      expect(recommendation.reason).toContain('1 features')
      expect(recommendation.releaseType).toBe('minor')
    })

    it('should ignore reverted commits', async () => {
      preparing(5)

      await conventionalRecommendedBump({
        cwd: testTools.cwd,
        whatBump: commits => {
          expect(commits.length).toBe(0)
        }
      })
    })

    it('should include reverted commits', async () => {
      preparing(5)

      await conventionalRecommendedBump({
        cwd: testTools.cwd,
        ignoreReverted: false,
        whatBump: commits => {
          expect(commits.length).toBe(2)
        }
      })
    })

    it('throws an error if unable to load a preset package', async () => {
      preparing(6)

      await expect(() => conventionalRecommendedBump({
        cwd: testTools.cwd,
        preset: 'does-not-exist'
      }, {})).rejects.toThrow('Unable to load the "does-not-exist" preset. Please make sure it\'s installed.')
    })

    it('recommends a minor release for a breaking change when preMajor=true', async () => {
      preparing(6)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        preset: {
          name: 'conventionalcommits',
          preMajor: true
        }
      }, {})

      expect(recommendation.reason).toContain('1 BREAKING')
      expect(recommendation.releaseType).toBe('minor')
    })

    it('recommends a major release for a breaking change when preMajor=false', async () => {
      preparing(6)

      const recommendation = await conventionalRecommendedBump({
        cwd: testTools.cwd,
        preset: {
          name: 'conventionalcommits'
        }
      }, {})

      expect(recommendation.reason).toContain('1 BREAKING')
      expect(recommendation.releaseType).toBe('major')
    })
  })

  describe('repository with custom tag prefix', () => {
    it('should recommends a minor release if appropriate', async () => {
      preparing(6)

      await conventionalRecommendedBump({
        cwd: testTools.cwd,
        tagPrefix: 'ms/',
        whatBump: commits => {
          expect(commits.length).toBe(1)
          expect(commits[0].type).toBe('feat')
        }
      })
    })
  })

  describe('repository with lerna tags', () => {
    it('should recommend \'major\' version bump when not using lerna tags', async () => {
      preparing(7)

      await conventionalRecommendedBump({
        cwd: testTools.cwd,
        whatBump: commits => {
          expect(commits.length).toBe(3)
        }
      })
    })

    it('should recommend \'minor\' version bump when lerna tag option is enabled', async () => {
      preparing(7)

      await conventionalRecommendedBump({
        cwd: testTools.cwd,
        lernaPackage: 'my-package',
        whatBump: commits => {
          expect(commits.length).toBe(1)
          expect(commits[0].type).toBe('feat')
        }
      })
    })
  })
})
