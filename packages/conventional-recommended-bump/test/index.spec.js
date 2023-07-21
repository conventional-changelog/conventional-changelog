import { describe, it, expect } from 'vitest'
import BetterThanBefore from 'better-than-before'
import { TestTools } from '../../../tools/test-tools'
import conventionalRecommendedBump from '..'

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
    it('should throw an error if an \'options\' object is not provided', () => {
      expect(() => conventionalRecommendedBump()).toThrow()
      expect(() => conventionalRecommendedBump('invalid options object')).toThrow()
    })
  })

  describe('callback', () => {
    it('should throw an error if no, or an invalid, callback function is provided', () => {
      expect(() => conventionalRecommendedBump({ cwd: testTools.cwd })).toThrow()
      expect(() => conventionalRecommendedBump({ cwd: testTools.cwd }, {})).toThrow()
      expect(() => conventionalRecommendedBump({ cwd: testTools.cwd }, {}, {})).toThrow()
    })

    it('should allow callback function in the \'parserOpts\' argument spot', () => {
      preparing(1)

      return new Promise((resolve) => {
        conventionalRecommendedBump({ cwd: testTools.cwd }, (err) => {
          expect(err).toBeTruthy()
          resolve()
        })
      })
    })
  })

  it('should return an error if there are no commits in the repository', () => {
    preparing(1)

    return new Promise((resolve) => {
      conventionalRecommendedBump({
        cwd: testTools.cwd
      }, {}, (err) => {
        expect(err).toBeTruthy()
        resolve()
      })
    })
  })

  describe('conventionalcommits ! in isolation', () => {
    it('recommends major if ! is used in isolation', () => {
      preparing(2)

      return new Promise((resolve, reject) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          preset: {
            name: 'conventionalcommits'
          }
        }, {}, (err, recommendation) => {
          if (err) reject(err)
          expect(recommendation.reason).toContain('1 BREAKING')
          expect(recommendation.releaseType).toEqual('major')
          resolve()
        })
      })
    })
  })

  describe('optional \'whatBump\'', () => {
    it('should throw an error if \'whatBump\' is defined but not a function', () => {
      preparing(2)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          whatBump: 'invalid'
        }, {}, (err) => {
          expect(err).toBeTruthy()
          expect(err.message).toEqual('whatBump must be a function')
          resolve()
        })
      })
    })

    it('should return \'{}\' if no \'whatBump\'', () => {
      preparing(2)

      return new Promise((resolve, reject) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd
        }, {}, (err, recommendation) => {
          if (err) reject(err)
          expect(recommendation).toEqual({})
          resolve()
        })
      })
    })

    it('should return \'{}\' if \'whatBump\' returns \'null\'', () => {
      preparing(2)

      return new Promise((resolve, reject) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          whatBump: () => null
        }, (err, recommendation) => {
          if (err) reject(err)
          expect(recommendation).toEqual({})
          resolve()
        })
      })
    })

    it('should return \'{}\' if \'whatBump\' returns \'undefined\'', () => {
      preparing(2)

      return new Promise((resolve, reject) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          whatBump: () => undefined
        }, (err, recommendation) => {
          if (err) reject(err)
          expect(recommendation).toEqual({})
          resolve()
        })
      })
    })

    it('should return what is returned by \'whatBump\'', () => {
      preparing(2)

      return new Promise((resolve, reject) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          whatBump: () => ({ test: 'test' })
        }, (err, recommendation) => {
          if (err) reject(err)
          expect(recommendation).toEqual({ test: 'test' })
          resolve()
        })
      })
    })

    it('should send options to \'whatBump\'', () => {
      preparing(2)

      return new Promise((resolve, reject) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          lernaPackage: 'test',
          whatBump: (commits, options) => options.lernaPackage
        }, (err, recommendation) => {
          if (err) reject(err)
          expect(recommendation).toEqual('test')
          resolve()
        })
      })
    })

    it('should return \'releaseType\' as undefined if \'level\' is not valid', () => {
      preparing(2)

      return new Promise((resolve, reject) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          whatBump: () => ({ level: 'test' })
        }, (err, recommendation) => {
          if (err) reject(err)
          expect(recommendation).toEqual({ level: 'test', releaseType: undefined })
          resolve()
        })
      })
    })
  })

  describe('warn logging', () => {
    it('will ignore \'warn\' option if it\'s not a function', () => {
      preparing(3)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd
        }, { warn: 'invalid' }, resolve)
      })
    })

    it('should warn if there is no new commits since last release', () => {
      preparing(3)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd
        }, {
          warn: warning => {
            expect(warning).toEqual('No commits since last release')
            resolve()
          }
        }, () => {})
      })
    })
  })

  describe('loading a preset package', () => {
    it('recommends a patch release for a feature when preMajor=true', () => {
      preparing(4)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          preset: {
            name: 'conventionalcommits',
            preMajor: true
          }
        }, {}, (_, recommendation) => {
          expect(recommendation.reason).toContain('1 features')
          expect(recommendation.releaseType).toEqual('patch')
          resolve()
        })
      })
    })

    it('recommends a minor release for a feature when preMajor=false', () => {
      preparing(4)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          preset: {
            name: 'conventionalcommits'
          }
        }, {}, (_, recommendation) => {
          expect(recommendation.reason).toContain('1 features')
          expect(recommendation.releaseType).toEqual('minor')
          resolve()
        })
      })
    })

    it('should ignore reverted commits', () => {
      preparing(5)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          whatBump: commits => {
            expect(commits.length).toEqual(0)
            resolve()
          }
        }, () => {})
      })
    })

    it('should include reverted commits', () => {
      preparing(5)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          ignoreReverted: false,
          whatBump: commits => {
            expect(commits.length).toEqual(2)
            resolve()
          }
        }, () => {})
      })
    })

    it('throws an error if unable to load a preset package', () => {
      preparing(6)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          preset: 'does-not-exist'
        }, {}, err => {
          expect(err).toBeTruthy()
          expect(err.message).toEqual('Unable to load the "does-not-exist" preset. Please make sure it\'s installed.')
          resolve()
        })
      })
    })

    it('recommends a minor release for a breaking change when preMajor=true', () => {
      preparing(6)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          preset: {
            name: 'conventionalcommits',
            preMajor: true
          }
        }, {}, (_, recommendation) => {
          expect(recommendation.reason).toContain('1 BREAKING')
          expect(recommendation.releaseType).toEqual('minor')
          resolve()
        })
      })
    })

    it('recommends a major release for a breaking change when preMajor=false', () => {
      preparing(6)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          preset: {
            name: 'conventionalcommits'
          }
        }, {}, (_, recommendation) => {
          expect(recommendation.reason).toContain('1 BREAKING')
          expect(recommendation.releaseType).toEqual('major')
          resolve()
        })
      })
    })
  })

  describe('repository with custom tag prefix', () => {
    it('should recommends a minor release if appropriate', () => {
      preparing(6)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          tagPrefix: 'ms/',
          whatBump: commits => {
            expect(commits.length).toEqual(1)
            expect(commits[0].type).toEqual('feat')
            resolve()
          }
        }, () => {})
      })
    })
  })

  describe('repository with lerna tags', () => {
    it('should recommend \'major\' version bump when not using lerna tags', () => {
      preparing(7)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          whatBump: commits => {
            expect(commits.length).toEqual(3)
            resolve()
          }
        }, () => {})
      })
    })

    it('should recommend \'minor\' version bump when lerna tag option is enabled', () => {
      preparing(7)

      return new Promise((resolve) => {
        conventionalRecommendedBump({
          cwd: testTools.cwd,
          lernaPackage: 'my-package',
          whatBump: commits => {
            expect(commits.length).toEqual(1)
            expect(commits[0].type).toEqual('feat')
            resolve()
          }
        }, () => {})
      })
    })
  })
})
