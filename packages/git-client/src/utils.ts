import semver from 'semver'
import type { Arg } from './types.js'

/**
 * Format arguments.
 * @param args
 * @returns Formatted arguments.
 */
export function formatArgs(...args: Arg[]): string[] {
  return args.reduce<string[]>((finalArgs, arg) => {
    if (arg) {
      finalArgs.push(String(arg))
    }

    return finalArgs
  }, [])
}

/**
 * Convert value to array.
 * @param value
 * @returns Array.
 */
export function toArray<T>(value: T | T[]) {
  return Array.isArray(value) ? value : [value]
}

/**
 * Check if version is a prerelease, e.g. 1.0.0-alpha.1, 1.0.0-rc.2.
 * @param version
 * @returns True if version is a prerelease.
 */
export function isPrereleaseVersion(version: string) {
  return semver.prerelease(version) !== null
}
