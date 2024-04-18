import { describe, it, expect } from 'vitest'
import mergeConfig from '../lib/merge-config.js'

const defaultOptions = {
  append: false,
  releaseCount: 1,
  skipUnstable: false,
  lernaPackage: null,
  outputUnreleased: true
}

describe('conventional-changelog-core', () => {
  describe('mergeConfig', () => {
    it('should return passed options', async () => {
      const options = {
        append: true,
        releaseCount: 0,
        skipUnstable: true,
        debug: () => {},
        warn: () => {},
        transform: () => {},
        lernaPackage: 'foo',
        tagPrefix: 'bar',
        outputUnreleased: true,
        pkg: {
          path: 'baz',
          transform: () => {}
        }
      }
      const config = await mergeConfig(options)
      expect(config.options).toMatchObject(options)
    })

    it('should return default options if empty options is passed', async () => {
      const { options } = await mergeConfig({})
      expect(options).toMatchObject(defaultOptions)
    })

    it('should return default options when no options is passed', async () => {
      const { options } = await mergeConfig()
      expect(options).toMatchObject(defaultOptions)
    })

    it('should return default options when null is passed', async () => {
      const { options } = await mergeConfig(null)
      expect(options).toMatchObject(defaultOptions)
    })

    it('should return default options when undefined value is passed', async () => {
      const options = {
        append: undefined,
        releaseCount: undefined,
        skipUnstable: undefined,
        lernaPackage: undefined,
        outputUnreleased: undefined
      }
      const config = await mergeConfig(options)
      expect(config.options).toMatchObject(defaultOptions)
    })
  })
})
