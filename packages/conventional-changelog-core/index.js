'use strict'

const addStream = require('add-stream')
const gitRawCommits = require('git-raw-commits')
const conventionalCommitsParser = require('conventional-commits-parser')
const conventionalChangelogWriter = require('conventional-changelog-writer')
const _ = require('lodash')
const stream = require('stream')
const through = require('through2')
const mergeConfig = require('./lib/merge-config')
function conventionalChangelog (options, context, gitRawCommitsOpts, parserOpts, writerOpts, gitRawExecOpts) {
  writerOpts = writerOpts || {}

  var readable = new stream.Readable({
    objectMode: writerOpts.includeDetails
  })
  readable._read = function () { }

  mergeConfig(options, context, gitRawCommitsOpts, parserOpts, writerOpts, gitRawExecOpts)
    .then(function (data) {
      options = data.options
      context = data.context
      gitRawCommitsOpts = data.gitRawCommitsOpts
      parserOpts = data.parserOpts
      writerOpts = data.writerOpts
      gitRawExecOpts = data.gitRawExecOpts

      var from = gitRawCommitsOpts.from || ''
      var partialStream
      var commitsStream
      for (var to of context.gitSemverTags.reverse()) {
        partialStream = gitRawCommits(_.merge({}, gitRawCommitsOpts, {
          from: from,
          to: to
        }), gitRawExecOpts)

        if (!commitsStream) {
          commitsStream = partialStream
        } else {
          if (gitRawCommitsOpts.reverse) {
            commitsStream = commitsStream
              .pipe(addStream(partialStream))
          } else {
            commitsStream = partialStream
              .pipe(addStream(commitsStream))
          }
        }
        from = to
      }

      partialStream = gitRawCommits(_.merge({}, gitRawCommitsOpts, {
        from: from,
        to: 'HEAD'
      }), gitRawExecOpts)

      if (!commitsStream) {
        commitsStream = partialStream
      } else {
        if (gitRawCommitsOpts.reverse) {
          commitsStream = commitsStream
            .pipe(addStream(partialStream))
        } else {
          commitsStream = partialStream
            .pipe(addStream(commitsStream))
        }
      }

      commitsStream
        .on('error', function (err) {
          err.message = 'Error in git-raw-commits: ' + err.message
          setImmediate(readable.emit.bind(readable), 'error', err)
        })
        .pipe(conventionalCommitsParser(parserOpts))
        .on('error', function (err) {
          err.message = 'Error in conventional-commits-parser: ' + err.message
          setImmediate(readable.emit.bind(readable), 'error', err)
        })
        // it would be better if `gitRawCommits` could spit out better formatted data
        // so we don't need to transform here
        .pipe(through.obj(function (chunk, enc, cb) {
          try {
            options.transform.call(this, chunk, cb)
          } catch (err) {
            cb(err)
          }
        }))
        .on('error', function (err) {
          err.message = 'Error in options.transform: ' + err.message
          setImmediate(readable.emit.bind(readable), 'error', err)
        })
        .pipe(conventionalChangelogWriter(context, writerOpts))
        .on('error', function (err) {
          err.message = 'Error in conventional-changelog-writer: ' + err.message
          setImmediate(readable.emit.bind(readable), 'error', err)
        })
        .pipe(through({
          objectMode: writerOpts.includeDetails
        }, function (chunk, enc, cb) {
          try {
            readable.push(chunk)
          } catch (err) {
            setImmediate(function () {
              throw err
            })
          }

          cb()
        }, function (cb) {
          readable.push(null)

          cb()
        }))
    })
    .catch(function (err) {
      setImmediate(readable.emit.bind(readable), 'error', err)
    })

  return readable
}

module.exports = conventionalChangelog
