'use strict'

const { Transform } = require('stream')
const { join } = require('path')
const { readFile } = require('fs/promises')
const { valid: semverValid } = require('semver')
const {
  functionify,
  processCommit,
  generate
} = require('./lib/util')

// sv-SE is used for yyyy-mm-dd format
const dateFormatter = Intl.DateTimeFormat('sv-SE', {
  timeZone: 'UTC'
})

function immediate () {
  return new Promise(resolve => setImmediate(resolve))
}

async function conventionalChangelogWriterInit (context, options) {
  context = {
    commit: 'commits',
    issue: 'issues',
    date: dateFormatter.format(new Date()),
    ...context
  }

  if (typeof context.linkReferences !== 'boolean' && (context.repository || context.repoUrl) && context.commit && context.issue) {
    context.linkReferences = true
  }

  const [
    mainTemplate,
    headerPartial,
    commitPartial,
    footerPartial
  ] = await Promise.all([
    readFile(join(__dirname, 'templates/template.hbs'), 'utf-8'),
    readFile(join(__dirname, 'templates/header.hbs'), 'utf-8'),
    readFile(join(__dirname, 'templates/commit.hbs'), 'utf-8'),
    readFile(join(__dirname, 'templates/footer.hbs'), 'utf-8')
  ])

  options = {
    groupBy: 'type',
    commitsSort: 'header',
    noteGroupsSort: 'title',
    notesSort: 'text',
    generateOn: commit => semverValid(commit.version),
    finalizeContext: context => context,
    debug: () => {},
    reverse: false,
    includeDetails: false,
    ignoreReverted: true,
    doFlush: true,
    mainTemplate,
    headerPartial,
    commitPartial,
    footerPartial,
    ...options
  }

  if (!options.transform || typeof options.transform === 'object') {
    options.transform = {
      hash: function (hash) {
        if (typeof hash === 'string') {
          return hash.substring(0, 7)
        }
      },
      header: function (header) {
        return header.substring(0, 100)
      },
      committerDate: function (date) {
        if (!date) {
          return
        }

        return dateFormatter.format(new Date(date))
      },
      ...options.transform
    }
  }

  let generateOn = options.generateOn
  if (typeof generateOn === 'string') {
    generateOn = function (commit) {
      return typeof commit[options.generateOn] !== 'undefined'
    }
  } else if (typeof generateOn !== 'function') {
    generateOn = function () {
      return false
    }
  }

  options.commitGroupsSort = functionify(options.commitGroupsSort)
  options.commitsSort = functionify(options.commitsSort)
  options.noteGroupsSort = functionify(options.noteGroupsSort)
  options.notesSort = functionify(options.notesSort)

  return { context, options, generateOn }
}

function conventionalChangelogWriterParseStream (inputContext, inputOptions) {
  const initPromise = conventionalChangelogWriterInit(inputContext, inputOptions)
  let commits = []
  let neverGenerated = true
  let savedKeyCommit
  let firstRelease = true

  return new Transform({
    objectMode: true,
    highWaterMark: 16,
    // `transform` option should not return Promises.
    // It cause a bug in Node.js 16, because it interprets the Promise resolve as a callback call.
    // In Node 20 it handle only callback call, Promises is not handled.
    transform (chunk, _enc, cb) {
      (async () => {
        try {
          const { context, options, generateOn } = await initPromise
          let result
          const commit = await processCommit(chunk, options.transform, context)
          const keyCommit = commit || chunk

          // previous blocks of logs
          if (options.reverse) {
            if (commit) {
              commits.push(commit)
            }

            if (generateOn(keyCommit, commits, context, options)) {
              neverGenerated = false
              result = await generate(options, commits, context, keyCommit)

              await immediate()

              if (options.includeDetails) {
                this.push({
                  log: result,
                  keyCommit
                })
              } else {
                this.push(result)
              }

              commits = []
            }
          } else {
            if (generateOn(keyCommit, commits, context, options)) {
              neverGenerated = false
              result = await generate(options, commits, context, savedKeyCommit)

              if (!firstRelease || options.doFlush) {
                await immediate()

                if (options.includeDetails) {
                  this.push({
                    log: result,
                    keyCommit: savedKeyCommit
                  })
                } else {
                  this.push(result)
                }
              }

              firstRelease = false
              commits = []
              savedKeyCommit = keyCommit
            }

            if (commit) {
              commits.push(commit)
            }
          }

          cb()
        } catch (err) {
          cb(err)
        }
      })()
    },
    flush (cb) {
      (async () => {
        try {
          const { context, options } = await initPromise

          if (!options.doFlush && (options.reverse || neverGenerated)) {
            cb(null)
            return
          }

          const result = await generate(options, commits, context, savedKeyCommit)

          await immediate()

          if (options.includeDetails) {
            this.push({
              log: result,
              keyCommit: savedKeyCommit
            })
          } else {
            this.push(result)
          }

          cb()
        } catch (err) {
          cb(err)
        }
      })()
    }
  })
}

/*
 * Given an array of commits, returns a string representing a CHANGELOG entry.
 */
conventionalChangelogWriterParseStream.parseArray = async (rawCommits, context, options) => {
  let generateOn
  rawCommits = [...rawCommits];
  ({ context, options, generateOn } = await conventionalChangelogWriterInit(context, options))
  let commits = []
  let savedKeyCommit
  if (options.reverse) {
    rawCommits.reverse()
  }
  const entries = []
  for (const rawCommit of rawCommits) {
    const commit = await processCommit(rawCommit, options.transform, context)
    const keyCommit = commit || rawCommit
    if (generateOn(keyCommit, commits, context, options)) {
      entries.push(await generate(options, commits, context, savedKeyCommit))
      savedKeyCommit = keyCommit
      commits = []
    }
    if (commit) {
      commits.push(commit)
    }
  }
  if (options.reverse) {
    entries.reverse()
    return await generate(options, commits, context, savedKeyCommit) + entries.join('')
  } else {
    return entries.join('') + await generate(options, commits, context, savedKeyCommit)
  }
}

module.exports = conventionalChangelogWriterParseStream
