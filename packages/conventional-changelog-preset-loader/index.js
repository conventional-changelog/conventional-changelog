'use strict'

const path = require('path')

module.exports.loadPreset = createPresetLoader((preset) => import(preset))
module.exports.createPresetLoader = createPresetLoader

/**
 * @typedef {((moduleName: string) => any) | ((moduleName: string) => Promise<any>)} ModuleLoader
 */

/**
 * @typedef {{ name: string }} PresetParams
 */

/**
 * Trying to add 'conventional-changelog-' prefix to preset name if it is a shorthand.
 * @param {string} preset - Absolute path, package name or shorthand preset name.
 * @returns Variants of preset names.
 */
function resolvePresetNameVariants (preset) {
  if (path.isAbsolute(preset)) {
    return [preset]
  }

  let scope = ''
  let name = preset.toLocaleLowerCase()

  if (preset[0] === '@') {
    const parts = preset.split('/')

    scope = parts.shift() + '/'

    if (scope === '@conventional-changelog/') {
      return [preset]
    }

    name = parts.join('/')
  }

  if (!name.startsWith('conventional-changelog-')) {
    name = `conventional-changelog-${name}`
  }

  const altPreset = `${scope}${name}`

  if (altPreset !== preset) {
    return [altPreset, preset]
  }

  return [preset]
}

/**
 * Loads module with fallbacks.
 * @param {ModuleLoader} moduleLoader - Function that loads module.
 * @param {string[]} variants - Variants of module name to try.
 * @returns {Promise<any>} Loaded module.
 */
async function loadWithFallbacks (moduleLoader, variants) {
  let error = null

  for (const variant of variants) {
    try {
      return await moduleLoader(variant)
    } catch (err) {
      if (!error) {
        error = err
      }
    }
  }

  throw error
}

/**
 * Gets default export from CommonJS or ES module.
 * @param {object} module
 * @returns {object}
 */
function getModuleDefaultExport (module) {
  if ((module.__esModule || Object.getPrototypeOf(module) === null) && module.default) {
    return module.default
  }

  return module
}

/**
 * Creates preset loader.
 * @param {ModuleLoader} moduleLoader - Function that loads module.
 * @returns {(presetOrParams: string | PresetParams) => Promise<any>} Function that loads preset.
 */
function createPresetLoader (moduleLoader) {
  return async function loadPreset (presetOrParams) {
    let preset = ''
    let params = null

    if (typeof presetOrParams === 'string') {
      preset = presetOrParams
    } else
      if (typeof presetOrParams === 'object' && typeof presetOrParams.name === 'string') {
        preset = presetOrParams.name
        params = presetOrParams
      } else {
        throw Error('Preset must be string or object with property `name`')
      }

    const presetNameVariants = resolvePresetNameVariants(preset)
    let createPreset = null

    try {
      createPreset = getModuleDefaultExport(await loadWithFallbacks(moduleLoader, presetNameVariants))
    } catch (err) {
      throw Error(`Unable to load the "${preset}" preset. Please make sure it's installed.`, { cause: err })
    }

    if (typeof createPreset !== 'function') {
      throw Error(`The "${preset}" preset does not export a function. Maybe you are using an old version of the preset. Please upgrade.`)
    }

    return params
      ? await createPreset(params)
      : await createPreset()
  }
}
