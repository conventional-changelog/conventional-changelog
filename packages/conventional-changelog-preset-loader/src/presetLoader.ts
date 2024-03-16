import path from 'path'
import type {
  UnknownModule,
  ModuleLoader,
  PresetModuleLoader,
  UnknownPresetCreatorParams,
  UnknownPreset,
  PresetParams,
  PresetCreator
} from './types.js'

/**
 * Trying to add 'conventional-changelog-' prefix to preset name if it is a shorthand.
 * @param preset - Absolute path, package name or shorthand preset name.
 * @returns Variants of preset names.
 */
function resolvePresetNameVariants(preset: string) {
  if (path.isAbsolute(preset)) {
    return [preset]
  }

  let scope = ''
  let name = preset.toLocaleLowerCase()

  if (preset.startsWith('@')) {
    const parts = preset.split('/')

    scope = `${parts.shift()}/`

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
 * Gets default export from CommonJS or ES module.
 * @param module
 * @returns Default export.
 */
function getModuleDefaultExport<T extends object>(module: UnknownModule<T>) {
  if (('__esModule' in module || Object.getPrototypeOf(module) === null) && 'default' in module) {
    return module.default
  }

  return module as T
}

/**
 * Loads module with fallbacks.
 * @param moduleLoader - Function that loads module.
 * @param variants - Variants of module name to try.
 * @returns Loaded module.
 */
async function loadWithFallbacks<T extends object>(moduleLoader: ModuleLoader<T>, variants: string[]) {
  let error = null

  for (const variant of variants) {
    try {
      return getModuleDefaultExport(await moduleLoader(variant))
    } catch (err) {
      if (!error) {
        error = err
      }
    }
  }

  throw error
}

/**
 * Creates preset loader.
 * @param moduleLoader - Function that loads module.
 * @returns Function that loads preset.
 */
export function createPresetLoader(moduleLoader: PresetModuleLoader) {
  return async function loadPreset<
    Preset = UnknownPreset,
    PresetCreatorParams extends UnknownPresetCreatorParams = UnknownPresetCreatorParams
  >(presetOrParams: PresetParams<PresetCreatorParams>) {
    let preset = ''
    let params: PresetCreatorParams | null = null

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
    let createPreset: PresetCreator<Preset, PresetCreatorParams> | null = null

    try {
      createPreset = await loadWithFallbacks(moduleLoader, presetNameVariants) as PresetCreator<Preset, PresetCreatorParams>
    } catch (err) {
      throw new Error(`Unable to load the "${preset}" preset. Please make sure it's installed.`, {
        cause: err
      })
    }

    if (typeof createPreset !== 'function') {
      throw new Error(`The "${preset}" preset does not export a function. Maybe you are using an old version of the preset. Please upgrade.`)
    }

    return params
      ? await createPreset(params)
      : await createPreset()
  }
}

/**
 * Load and create preset.
 */
export const loadPreset = createPresetLoader(preset => import(preset))
