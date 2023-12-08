/* eslint-disable @typescript-eslint/naming-convention */

export interface ESModule<T> {
  __esModule?: boolean
  default: T
}

export type UnknownModule<T> = T | ESModule<T>

export type ModuleLoader<T> = (
  (moduleName: string) => UnknownModule<T>)
| ((moduleName: string) => Promise<UnknownModule<T>>
)

export type UnknownPresetCreatorParams = Record<string, unknown>

export type UnknownPreset = Record<string, unknown>

export type PresetCreator<
  Preset extends UnknownPreset = UnknownPreset,
  Params extends UnknownPresetCreatorParams = UnknownPresetCreatorParams
> = ((params?: Params) => Preset) | ((params?: Params) => Promise<Preset>)

export type PresetModuleLoader<
  Preset extends UnknownPreset = UnknownPreset,
  Params extends UnknownPresetCreatorParams = UnknownPresetCreatorParams
> = ModuleLoader<PresetCreator<Params, Preset>>

export type PresetModule<
  Preset extends UnknownPreset = UnknownPreset,
  Params extends UnknownPresetCreatorParams = UnknownPresetCreatorParams
> = UnknownModule<PresetCreator<Params, Preset>>

export type PresetParams<
  PresetCreatorParams extends UnknownPresetCreatorParams = UnknownPresetCreatorParams
> = string | {
  name: string
} & PresetCreatorParams
