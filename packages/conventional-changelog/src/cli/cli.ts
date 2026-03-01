#!/usr/bin/env node
import {
  type WriteStream,
  createReadStream,
  createWriteStream
} from 'fs'
import {
  type Preset,
  type ConventionalChangelog
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

export interface Flags {
  infile?: string
  outfile?: string
  stdout?: boolean
  preset?: string
  pkg?: string
  append?: boolean
  releaseCount?: number
  skipUnstable?: boolean
  outputUnreleased?: boolean
  verbose?: boolean
  config?: string
  context?: string
  firstRelease?: boolean
  lernaPackage?: string
  tagPrefix?: string
}

export const flags = {
  infile: {
    shortFlag: 'i',
    default: 'CHANGELOG.md',
    type: 'string'
  },
  outfile: {
    shortFlag: 'o',
    type: 'string'
  },
  stdout: {
    type: 'boolean'
  },
  preset: {
    shortFlag: 'p',
    type: 'string'
  },
  pkg: {
    shortFlag: 'k',
    type: 'string'
  },
  append: {
    shortFlag: 'a',
    type: 'boolean'
  },
  releaseCount: {
    shortFlag: 'r',
    type: 'number'
  },
  skipUnstable: {
    type: 'boolean'
  },
  outputUnreleased: {
    shortFlag: 'u',
    type: 'boolean'
  },
  verbose: {
    shortFlag: 'v',
    type: 'boolean'
  },
  config: {
    shortFlag: 'n',
    type: 'string'
  },
  context: {
    shortFlag: 'c',
    type: 'string'
  },
  firstRelease: {
    shortFlag: 'f',
    type: 'boolean'
  },
  lernaPackage: {
    shortFlag: 'l',
    type: 'string'
  },
  tagPrefix: {
    shortFlag: 't',
    type: 'string'
  }
} as const

export async function runProgram(
  generator: ConventionalChangelog,
  flags: Flags
) {
  let {
    infile,
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
