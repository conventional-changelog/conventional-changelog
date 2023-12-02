import type { Readable } from 'stream'
import { resolve, extname } from 'path'
import { pathToFileURL } from 'url'
import { readFile } from 'fs/promises'

const NEWLINE = /\r?\n/

async function* parseJsonStream<T>(stream: Readable) {
  let chunk: Buffer
  let payload: string
  let buffer = ''

  for await (chunk of stream) {
    buffer += chunk.toString()

    if (NEWLINE.test(buffer)) {
      [payload, buffer] = buffer.split(NEWLINE)

      try {
        yield JSON.parse(payload) as T
      } catch (err) {
        throw new Error('Failed to split commits', {
          cause: err
        })
      }
    }
  }

  if (buffer) {
    try {
      yield JSON.parse(buffer) as T
    } catch (err) {
      throw new Error('Failed to split commits', {
        cause: err
      })
    }
  }
}

export async function* readCommitsFromFiles<T>(files: string[]) {
  for (const file of files) {
    try {
      yield JSON.parse(await readFile(file, 'utf8')) as T
    } catch (err) {
      console.warn(`Failed to read file ${file}:\n  ${err as string}`)
    }
  }
}

export function readCommitsFromStdin<T>() {
  return parseJsonStream<T>(process.stdin)
}

function relativeResolve(filePath: string) {
  return pathToFileURL(resolve(process.cwd(), filePath))
}

export async function loadDataFile(filePath: string): Promise<object> {
  const resolvedFilePath = relativeResolve(filePath)
  const ext = extname(resolvedFilePath.toString())

  if (ext === '.json') {
    return JSON.parse(await readFile(resolvedFilePath, 'utf8')) as object
  }

  // @ts-expect-error Dynamic import actually works with file URLs
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (await import(resolvedFilePath)).default as object
}
