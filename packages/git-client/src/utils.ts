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
