const { Transform } = require('stream')
const addStream = require('add-stream')
const concat = require('concat-stream')
const PluginError = require('plugin-error')
const fancyLog = require('fancy-log')

module.exports = function (opts, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  opts = {
    // TODO: remove this when gulp get's a real logger with levels
    verbose: process.argv.indexOf('--verbose') !== -1,
    ...opts
  }

  if (opts.verbose) {
    opts.debug = fancyLog
  }

  const conventionalChangelogPromise = import('conventional-changelog')

  return new Transform({
    objectMode: true,
    highWaterMark: 16,
    // `transform` option should not return Promises.
    // It cause a bug in Node.js 16, because it interprets the Promise resolve as a callback call.
    // In Node 20 it handle only callback call, Promises is not handled.
    transform  (file, enc, cb) {
      (async () => {
        if (file.isNull()) {
          cb(null, file)
          return
        }

        const { default: conventionalChangelog } = await conventionalChangelogPromise
        const stream = conventionalChangelog(opts, context, gitRawCommitsOpts, parserOpts, writerOpts)
          .on('error', function (err) {
            cb(new PluginError('gulp-conventional-changelog', err))
          })

        if (file.isStream()) {
          if (opts.releaseCount === 0) {
            file.contents = stream
          } else if (opts.append) {
            file.contents = file.contents
              .pipe(addStream(stream))
          } else {
            file.contents = stream
              .pipe(addStream(file.contents))
          }

          cb(null, file)
          return
        }

        stream
          .pipe(concat({
            encoding: 'buffer'
          }, function (data) {
            if (opts.releaseCount === 0) {
              file.contents = data
            } else if (opts.append) {
              file.contents = Buffer.concat([file.contents, data])
            } else {
              file.contents = Buffer.concat([data, file.contents])
            }

            cb(null, file)
          }))
      })()
    }
  })
}
