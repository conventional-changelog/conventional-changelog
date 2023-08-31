#!/usr/bin/env node
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { createReadStream } from 'fs'
import { readFile } from 'fs/promises'
import { Transform } from 'stream'
import meow from 'meow'
import conventionalChangelogWriter from './index.js'

function relativeResolve (filePath) {
  return pathToFileURL(resolve(process.cwd(), filePath))
}

const cli = meow(`
    Usage
      conventional-changelog-writer <path> [<path> ...]
      cat <path> | conventional-changelog-writer
    ,
    Example
      conventional-changelog-writer commits.ldjson
      cat commits.ldjson | conventional-changelog-writer
    ,
    Options
      -c, --context    A filepath of a json that is used to define template variables
      -o, --options    A filepath of a javascript object that is used to define options
`, {
  importMeta: import.meta,
  flags: {
    context: {
      shortFlag: 'c',
      type: 'string'
    },
    options: {
      shortFlag: 'o',
      type: 'string'
    }
  }
})

const flags = cli.flags
const filePaths = cli.input
const length = filePaths.length

let templateContext
const contextPath = flags.context
if (contextPath) {
  try {
    templateContext = JSON.parse(await readFile(relativeResolve(contextPath), 'utf8'))
  } catch (err) {
    console.error('Failed to get context from file ' + contextPath + '\n' + err)
    process.exit(1)
  }
}

let options
const optionsPath = flags.options
if (optionsPath) {
  try {
    options = (await import(relativeResolve(optionsPath))).default
  } catch (err) {
    console.error('Failed to get options from file ' + optionsPath + '\n' + err)
    process.exit(1)
  }
}

let stream
try {
  stream = conventionalChangelogWriter(templateContext, options)
} catch (err) {
  console.error(err.toString())
  process.exit(1)
}

function splitAndParseJSONStream () {
  return new Transform({
    readableObjectMode: true,
    transform (chunk, enc, cb) {
      try {
        for (const line of chunk.toString().split(/\r?\n/)) {
          this.push(JSON.parse(line))
        }
        cb()
      } catch (err) {
        cb(err)
      }
    }
  })
}

function processFile (fileIndex) {
  const filePath = filePaths[fileIndex]
  createReadStream(filePath)
    .on('error', (err) => {
      console.warn('Failed to read file ' + filePath + '\n' + err)
      if (++fileIndex < length) {
        processFile(fileIndex)
      }
    })
    .pipe(splitAndParseJSONStream())
    .on('error', (err) => {
      console.warn('Failed to split commits in file ' + filePath + '\n' + err)
    })
    .pipe(stream)
    .on('error', (err) => {
      console.warn('Failed to process file ' + filePath + '\n' + err)
      if (++fileIndex < length) {
        processFile(fileIndex)
      }
    })
    .on('end', () => {
      if (++fileIndex < length) {
        processFile(fileIndex)
      }
    })
    .pipe(process.stdout)
}

if (!process.stdin.isTTY) {
  process.stdin
    .pipe(splitAndParseJSONStream())
    .on('error', (err) => {
      console.error('Failed to split commits\n' + err)
      process.exit(1)
    })
    .pipe(stream)
    .on('error', (err) => {
      console.error('Failed to process file\n' + err)
      process.exit(1)
    })
    .pipe(process.stdout)
} else if (length === 0) {
  console.error('You must specify at least one line delimited json file')
  process.exit(1)
} else {
  processFile(0)
}
