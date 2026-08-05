import {
  describe,
  it,
  expect
} from 'vitest'
import {
  formatArgs,
  isPrereleaseVersion
} from './utils.js'

describe('git-client', () => {
  describe('utils', () => {
    describe('formatArgs', () => {
      it('should format arguments', () => {
        expect(formatArgs('git', 'add', 'file.txt')).toEqual([
          'git',
          'add',
          'file.txt'
        ])
      })

      it('should skip empty arguments', () => {
        expect(formatArgs('git', 'log', '')).toEqual(['git', 'log'])
        expect(formatArgs('git', 'log', null)).toEqual(['git', 'log'])
      })
    })

    describe('isPrereleaseVersion', () => {
      it('should detect prerelease versions', () => {
        expect(isPrereleaseVersion('1.0.0-alpha.1')).toBe(true)
        expect(isPrereleaseVersion('1.0.0-rc.2')).toBe(true)
        expect(isPrereleaseVersion('v1.0.0-rc.2')).toBe(true)
      })

      it('should not detect stable versions', () => {
        expect(isPrereleaseVersion('1.0.0')).toBe(false)
        expect(isPrereleaseVersion('v1.0.0')).toBe(false)
      })

      it('should not detect stable versions with build metadata', () => {
        expect(isPrereleaseVersion('1.0.0+build.1.2.3-foo')).toBe(false)
      })

      it('should not detect invalid versions', () => {
        expect(isPrereleaseVersion('not-semver')).toBe(false)
      })
    })
  })
})
