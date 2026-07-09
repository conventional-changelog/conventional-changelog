#!/usr/bin/env node
import {
  type WriteStream,
  createReadStream,
  createWriteStream
} from 'fs'
import {
  readOptions,
  option,
  flag,
  alias,
  autocase
} from 'argue-cli'
import type {
  Preset,
  ConventionalChangelog
} from '../index.js'
import {
  parseOptions,
  parseCommitsOptions,
  parseTagsOptions
} from './options.js'
import {
  loadDataFile,
  isFileExists
} from './utils.js'

export function readFlags() {
  return readOptions(
    option(alias('infile', 'i'), String),
    option(alias('outfile', 'o'), String),
    flag('stdout'),
    option(alias('preset', 'p'), String),
    option(alias('pkg', 'k'), String),
    flag(alias('append', 'a')),
    option(autocase(alias('releaseCount', 'r')), Number),
    flag(autocase('skipUnstable')),
    flag(autocase(alias('outputUnreleased', 'u'))),
    flag(alias('verbose', 'v')),
    option(alias('config', 'n'), String),
    option(alias('context', 'c'), String),
    flag(autocase(alias('firstRelease', 'f'))),
    option(autocase(alias('lernaPackage', 'l')), String),
    option(autocase(alias('tagPrefix', 't')), String),
    option(autocase('commitPath'), String),
    option('from', String),
    option('to', String),
    flag('help'),
    flag('version')
  )
}

export type Flags = ReturnType<typeof readFlags>

export async function runProgram(
  generator: ConventionalChangelog,
  flags: Flags
) {
  let {
    infile = 'CHANGELOG.md',
    outfile,
    stdout,
    verbose,
    pkg,
    preset,
    config,
    context
  } = flags

  generator.readPackage(pkg)

  if (preset) {
    generator.loadPreset(preset)
  }

  if (config) {
    const configOptions = await loadDataFile(config) as Preset

    if (configOptions.tags) {
      generator.tags(configOptions.tags)
    }

    if (configOptions.commits || configOptions.parser) {
      generator.commits(configOptions.commits || {}, configOptions.parser)
    }

    if (configOptions.writer) {
      generator.writer(configOptions.writer)
    }
  }

  if (context) {
    const writerContext = await loadDataFile(context)

    if (writerContext) {
      generator.context(writerContext)
    }
  }

  const options = parseOptions(flags as Record<string, unknown>)

  if (options) {
    generator.options(options)
  }

  const tagsOptions = parseTagsOptions(flags as Record<string, unknown>)

  if (tagsOptions) {
    generator.tags(tagsOptions)
  }

  const commitsOptions = parseCommitsOptions(flags as Record<string, unknown>)

  if (commitsOptions) {
    generator.commits(commitsOptions)
  }

  if (verbose) {
    generator.options({
      debug(namespace, payload) {
        console.info(`[${namespace}]:`, payload)
      },
      warn(namespace, payload) {
        console.warn(`[${namespace}]:`, payload)
      }
    })
  }

  outfile ||= infile

  const sameFile = !stdout && infile === outfile
  const changelog = generator.write()
  const streams = []

  if (infile && options?.releaseCount !== 0) {
    const isInfileExists = await isFileExists(infile)
    const input = isInfileExists
      ? createReadStream(infile)
      : []

    if (!isInfileExists && verbose) {
      console.warn(`"${infile}" does not exist.`)
    }

    if (sameFile) {
      if (options?.append) {
        streams.push(changelog)
      } else {
        const buffer = []

        for await (const chunk of changelog) {
          buffer.push(chunk)
        }

        let newline = true

        for await (const chunk of input) {
          if (newline) {
            newline = false

            if (!String(chunk).startsWith('\n')) {
              buffer.push('\n')
            }
          }

          buffer.push(chunk)
        }

        streams.push(buffer)
      }
    } else
      if (options?.append) {
        streams.push(input, changelog)
      } else {
        streams.push(changelog, input)
      }
  } else {
    streams.push(changelog)
  }

  const output = (
    outfile && !stdout
      ? createWriteStream(outfile, {
        flags: sameFile && options?.append ? 'a' : 'w'
      })
      : process.stdout
  ) as WriteStream

  for (let i = 0, stream, newline; i < streams.length; i++) {
    stream = streams[i]
    newline = i > 0

    for await (const chunk of stream) {
      if (newline) {
        newline = false

        if (!String(chunk).startsWith('\n')) {
          output.write('\n')
        }
      }

      output.write(chunk)
    }
  }
}
