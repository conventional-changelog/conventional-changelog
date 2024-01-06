import type { Readable } from 'stream'
import {
  type SpawnOptionsWithoutStdio,
  spawn as spawnChild
} from 'child_process'
import type { Arg } from './types.js'

/**
 * Spawn child process.
 * @param cmd
 * @param args
 * @param options
 * @returns Process output.
 */
export function spawn(cmd: string, args: string[], options?: SpawnOptionsWithoutStdio) {
  return new Promise<string>((resolve, reject) => {
    const child = spawnChild(cmd, args, options)
    let output = ''
    const onData = (data: Buffer) => {
      output += data.toString()
    }
    const onDone = (codeOrError: Error | number | null) => {
      if (codeOrError === 0) {
        resolve(output)
      } else if (codeOrError instanceof Error) {
        reject(codeOrError)
      } else {
        reject(new Error(output))
      }
    }

    child.stdout?.on('data', onData)
    child.stderr?.on('data', onData)
    child.on('close', onDone)
    child.on('error', onDone)
  })
}

/**
 * Spawn child process and return stdout stream.
 * @param cmd
 * @param args
 * @param options
 * @returns Readable stdout stream.
 */
export function stdoutSpawn(cmd: string, args: string[], options?: SpawnOptionsWithoutStdio) {
  const child = spawnChild(cmd, args, options)
  const { stdout } = child

  child.stderr.on('data', (chunk: Buffer) => {
    stdout.emit('error', new Error(chunk.toString()))
    stdout.emit('close')
  })

  return stdout
}

/**
 * Split stream by separator.
 * @param stream
 * @param separator
 * @yields String chunks.
 */
export async function* splitStream(stream: Readable, separator: string) {
  let chunk: Buffer
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
    } else {
      finalArgs.push(arg)
    }
  }

  return finalArgs
}
