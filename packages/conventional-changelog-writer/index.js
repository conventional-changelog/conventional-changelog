'use strict'

const { Transform } = require('stream')
const { join } = require('path')
const { readFileSync } = require('fs')
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

function conventionalChangelogWriterInit (context, options) {
  context = {
    commit: 'commits',
    issue: 'issues',
    date: dateFormatter.format(new Date()),
    ...context
  }

  if (typeof context.linkReferences !== 'boolean' && (context.repository || context.repoUrl) && context.commit && context.issue) {
    context.linkReferences = true
  }

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
    mainTemplate: readFileSync(join(__dirname, 'templates/template.hbs'), 'utf-8'),
    headerPartial: readFileSync(join(__dirname, 'templates/header.hbs'), 'utf-8'),
    commitPartial: readFileSync(join(__dirname, 'templates/commit.hbs'), 'utf-8'),
    footerPartial: readFileSync(join(__dirname, 'templates/footer.hbs'), 'utf-8'),
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

function conventionalChangelogWriterParseStream (context, options) {
  let generateOn
  ({ context, options, generateOn } = conventionalChangelogWriterInit(context, options))
  let commits = []
  let neverGenerated = true
  let savedKeyCommit
  let firstRelease = true

  return new Transform({
    objectMode: true,
    highWaterMark: 16,
    async transform (chunk, _enc, cb) {
      try {
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
    },
    async flush (cb) {
      if (!options.doFlush && (options.reverse || neverGenerated)) {
        cb(null)
        return
      }

      try {
        const result = await generate(options, commits, context, savedKeyCommit)

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
    }
  })
}

/*
 * Given an array of commits, returns a string representing a CHANGELOG entry.
 */
conventionalChangelogWriterParseStream.parseArray = async (rawCommits, context, options) => {
  let generateOn
  rawCommits = [...rawCommits];
  ({ context, options, generateOn } = conventionalChangelogWriterInit(context, options))
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
