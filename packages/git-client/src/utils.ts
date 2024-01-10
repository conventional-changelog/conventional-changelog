/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  type ChildProcessWithoutNullStreams,
  type SpawnOptionsWithoutStdio,
  spawn as spawnChild
} from 'child_process'
import type {
  Value,
  Param,
  Params,
  Arg
} from './types.js'

/**
 * Catch process error.
 * @param child
 * @returns Process error.
 */
function catchProcessError(child: ChildProcessWithoutNullStreams) {
  return new Promise<Error | null>((resolve) => {
    let stderr = ''
    let error: Error | null = null

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString()
    })
    child.on('error', (err: Error) => {
      error = err
    })
    child.on('close', () => {
      if (stderr) {
        error = new Error(stderr)
      }

      resolve(error)
    })
  })
}

/**
 * Spawn child process and return stdout stream.
 * @param cmd
 * @param args
 * @param options
 * @yields Stdout chunks.
 */
export async function* stdoutSpawn(cmd: string, args: string[], options?: SpawnOptionsWithoutStdio) {
  const child = spawnChild(cmd, args, options)
  const errorPromise = catchProcessError(child)

  yield* child.stdout as AsyncIterable<Buffer>

  const error = await errorPromise

  if (error) {
    throw error
  }
}

/**
 * Spawn child process.
 * @param cmd
 * @param args
 * @param options
 * @returns Process output.
 */
export async function spawn(cmd: string, args: string[], options?: SpawnOptionsWithoutStdio) {
  const stdout = stdoutSpawn(cmd, args, options)
  let chunk: Buffer
  const output: Buffer[] = []

  for await (chunk of stdout) {
    output.push(chunk)
  }

  return Buffer.concat(output)
}

/**
 * Split stream by separator.
 * @param stream
 * @param separator
 * @yields String chunks.
 */
export async function* splitStream(stream: AsyncIterable<string | Buffer>, separator: string) {
  let chunk: string | Buffer
  let payload: string[]
  let buffer = ''

  for await (chunk of stream) {
    buffer += chunk.toString()

    if (buffer.includes(separator)) {
      payload = buffer.split(separator)
      buffer = payload.pop() || ''

      yield* payload
    }
  }

  if (buffer) {
    yield buffer
  }
}

/**
 * Format key-value pair for cli arguments.
 * @param key
 * @param value
 * @returns Formatted key-value pair.
 */
function formatKeyValue(key: string, value?: Value) {
  return `${
    key.length === 1 ? '-' : '--'
  }${
    key.replace(/[A-Z]/g, '-$&').toLowerCase()
  }${
    value ? `=${value}` : ''
  }`
}

/**
 * Format object params for cli arguments.
 * @param params
 * @returns Formatted params.
 */
function formatParams(params: Params) {
  const args: string[] = []
  let key: string
  let value: Param
  let arrayValue: Param

  for (key in params) {
    value = params[key]

    if (value === true) {
      args.push(formatKeyValue(key))
    } else
      if (value === false) {
        args.push(formatKeyValue(`no-${key}`))
      } else
        if (Array.isArray(value)) {
          for (arrayValue of value) {
            args.push(formatKeyValue(key, arrayValue))
          }
        } else {
          args.push(formatKeyValue(key, value))
        }
  }

  return args
}

/**
 * Format arguments.
 * @param args
 * @returns Formatted arguments.
 */
export function formatArgs(...args: Arg[]): string[] {
  const finalArgs: string[] = []

  for (const arg of args) {
    if (!arg) {
      continue
    }

    if (Array.isArray(arg)) {
      finalArgs.push(...formatArgs(...arg))
    } else
      if (typeof arg === 'object' && !(arg instanceof RegExp)) {
        finalArgs.push(...formatParams(arg))
      } else {
        finalArgs.push(String(arg))
      }
  }

  return finalArgs
}
