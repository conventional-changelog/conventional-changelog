/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  type SpawnOptionsWithoutStdio,
  spawn as spawnChild
} from 'child_process'
import type { Arg } from './types.js'

/**
 * Read output stream to string.
 * @param stream
 * @returns Stream output string.
 */
async function readOutput(stream: AsyncIterable<string | Buffer>) {
  let chunk: string | Buffer
  let buffer = ''

  for await (chunk of stream) {
    buffer += chunk.toString()
  }

  return buffer
}

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
    const stdoutPromise = readOutput(child.stdout)
    const stderrPromise = readOutput(child.stderr)
    const onDone = async (codeOrError: Error | number | null) => {
      if (codeOrError === 0) {
        resolve(await stdoutPromise)
      } else if (codeOrError instanceof Error) {
        reject(codeOrError)
      } else {
        reject(new Error(await stderrPromise))
      }
    }

    child.on('close', onDone)
    child.on('error', onDone)
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
  const { stdout, stderr } = child
  const errorPromise = readOutput(stderr)

  yield* stdout

  const error = await errorPromise

  if (error) {
    throw new Error(error)
  }
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
