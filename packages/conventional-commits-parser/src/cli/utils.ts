import type { Readable } from 'stream'
import fs from 'fs'
import readline from 'readline'

async function* splitStream(stream: Readable, separator: string) {
  let chunk: Buffer
  let payload: string
  let buffer = ''

  for await (chunk of stream) {
    buffer += chunk.toString()

    if (buffer.includes(separator)) {
      [payload, buffer] = buffer.split(separator)
      yield payload
    }
  }

  if (buffer) {
    yield buffer
  }
}

export async function* readRawCommitsFromFiles(files: string[], separator: string) {
  for (const file of files) {
    try {
      yield* splitStream(fs.createReadStream(file), separator)
    } catch (err) {
      console.warn(`Failed to read file ${file}:\n  ${err as string}`)
    }
  }
}

export async function* readRawCommitsFromLine(separator: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  })
  let line = ''
  let commit = ''

  for await (line of rl) {
    commit += `${line}\n`

    if (!commit.includes(separator)) {
      return
    }

    yield commit
    commit = ''
  }
}

export function readRawCommitsFromStdin(separator: string) {
  return splitStream(process.stdin, separator)
}
