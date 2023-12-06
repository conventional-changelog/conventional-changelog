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

const JSON_STREAM_OPEN = '[\n'
const JSON_STREAM_SEPARATOR = '\n,\n'
const JSON_STREAM_CLOSE = '\n]\n'

export async function* stringify(commits: AsyncIterable<Record<string, unknown>>) {
  let jsonStreamOpened = false

  yield JSON_STREAM_OPEN

  for await (const commit of commits) {
    if (jsonStreamOpened) {
      yield JSON_STREAM_SEPARATOR
    }

    yield JSON.stringify(commit)
    jsonStreamOpened = true
  }

  yield JSON_STREAM_CLOSE
}
