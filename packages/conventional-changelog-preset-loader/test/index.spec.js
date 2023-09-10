import { vitest, describe, it, expect } from 'vitest'
import { createPresetLoader } from '../index.js'

const mockModuleLoader = () => () => ({})
const mockUnprefixedModuleLoader = (moduleName) => {
  if (/(^|\/)conventional-changelog-/.test(moduleName)) {
    throw new Error('Module not found')
  }

  return () => ({})
}

describe('conventional-changelog-preset-loader', () => {
  describe('createPresetLoader', () => {
    it('should load unscoped package', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('angular')

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith('conventional-changelog-angular')
    })

    it('should load unscoped package containing path', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('angular/preset/path')

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith('conventional-changelog-angular/preset/path')
    })

    it('should load unscoped package with full package name', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('conventional-changelog-angular')

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith('conventional-changelog-angular')
    })

    it('should load unscoped package with full package name containing path', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('conventional-changelog-angular/preset/path')

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith('conventional-changelog-angular/preset/path')
    })

    it('should load scoped package', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('@scope/angular')

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith('@scope/conventional-changelog-angular')
    })

    it('should load scoped package containing path', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('@scope/angular/preset/path')

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith('@scope/conventional-changelog-angular/preset/path')
    })

    it('should load scoped package with full package name', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('@scope/conventional-changelog-angular')

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith('@scope/conventional-changelog-angular')
    })

    it('should load scoped package with full package name containing path', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('@scope/conventional-changelog-angular/preset/path')

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith('@scope/conventional-changelog-angular/preset/path')
    })

    it('should load package with an absolute file path', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)
      const filePath = require.resolve('conventional-changelog-angular')

      await load(filePath)

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith(filePath)
    })

    it('should load package with an absolute file path name', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)
      const filePath = require.resolve('conventional-changelog-angular')

      await load({ name: filePath })

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith(filePath)
    })

    it('should load package in @conventional-changelog scope', async () => {
      const requireMethod = vitest.fn(mockModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('@conventional-changelog/preset-angular')

      expect(requireMethod).toHaveBeenCalledTimes(1)
      expect(requireMethod).toHaveBeenCalledWith('@conventional-changelog/preset-angular')
    })

    it('should load package without adding prefix', async () => {
      const requireMethod = vitest.fn(mockUnprefixedModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('trigen-conventional-changelog-angular')

      expect(requireMethod).toHaveBeenCalledWith('conventional-changelog-trigen-conventional-changelog-angular')
      expect(requireMethod).toHaveBeenLastCalledWith('trigen-conventional-changelog-angular')
    })

    it('should load scoped package without adding prefix', async () => {
      const requireMethod = vitest.fn(mockUnprefixedModuleLoader)
      const load = createPresetLoader(requireMethod)

      await load('@trigen/cc-preset-angular')

      expect(requireMethod).toHaveBeenCalledWith('@trigen/conventional-changelog-cc-preset-angular')
      expect(requireMethod).toHaveBeenLastCalledWith('@trigen/cc-preset-angular')
    })
  })
})
