const { execSync } = require('child_process')
const { Transform } = require('stream')
const path = require('path')
const fs = require('fs')
const tmp = require('tmp')
const conventionalChangelogCore = require('conventional-changelog-core')

function delay (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function fixMessage (msg) {
  if (!msg || typeof msg !== 'string') {
    msg = 'Test commit'
  }
  // we need to escape backtick for bash but not for windows
  // probably this should be done in git-dummy-commit or shelljs
  if (process.platform !== 'win32') {
    msg = msg.replace(/`/g, '\\`')
  }
  return `"${msg}"`
}

function prepareMessageArgs (msg) {
  const args = []
  if (Array.isArray(msg)) {
    if (msg.length > 0) {
      for (const m of msg) {
        args.push('-m', fixMessage(m))
      }
    } else {
      args.push('-m', fixMessage())
    }
  } else {
    args.push('-m', fixMessage(msg))
  }
  return args
}

function through (
  transform = (chunk, enc, cb) => cb(null, chunk),
  flush
) {
  return new Transform({
    transform,
    flush
  })
}

function throughObj (
  transform = (chunk, enc, cb) => cb(null, chunk),
  flush
) {
  return new Transform({
    objectMode: true,
    highWaterMark: 16,
    transform,
    flush
  })
}

class TestTools {
  constructor (cwd) {
    this.cwd = cwd

    if (!cwd) {
      this.cwd = fs.realpathSync(tmp.dirSync().name)
      tmp.setGracefulCleanup()
    }
  }

  cleanup () {
    try {
      this.rmSync(this.cwd, { recursive: true })
    } catch (err) {
      // ignore
    }
  }

  mkdirSync (dir, options) {
    return fs.mkdirSync(path.resolve(this.cwd, dir), options)
  }

  writeFileSync (file, content) {
    return fs.writeFileSync(path.resolve(this.cwd, file), content)
  }

  readFileSync (file, options) {
    return fs.readFileSync(path.resolve(this.cwd, file), options)
  }

  rmSync (target, options) {
    return fs.rmSync(path.resolve(this.cwd, target), options)
  }

  exec (command) {
    return execSync(command, {
      cwd: this.cwd,
      stdio: 'pipe',
      encoding: 'utf-8'
    })
  }

  gitInit () {
    this.mkdirSync('git-templates')
    return this.exec('git init --template=./git-templates  --initial-branch=master')
  }

  gitDummyCommit (msg) {
    const args = prepareMessageArgs(msg)

    args.push(
      '--allow-empty',
      '--no-gpg-sign'
    )

    return this.exec(`git commit ${args.join(' ')}`)
  }

  gitTails () {
    const data = execSync('git rev-list --parents HEAD', {
      cwd: this.cwd
    })

    return data.toString().match(/^[a-f0-9]{40}$/gm)
  }
}

function createRunConventionalChangelog (conventionalChangelogCore, options) {
  return function runConventionalChangelog (options, ...args) {
    const chunks = []
    const onChunk = typeof args[args.length - 1] === 'function'
      ? args.pop()
      : undefined
    const includeDetails = args.some(arg => arg.includeDetails)
    const throughToUse = includeDetails ? throughObj : through

    return new Promise((resolve, reject) => {
      conventionalChangelogCore({
        warn: options?.rejectOnWarn ? reject : undefined,
        ...options
      }, ...args)
        .on('error', reject)
        .pipe(
          throughToUse((chunk, _, next) => {
            try {
              const str = Buffer.isBuffer(chunk)
                ? chunk.toString()
                : chunk

              chunks.push(str)
              onChunk?.(str)
              next()
            } catch (err) {
              reject(err)
            }
          }, (done) => {
            try {
              resolve(chunks)
              done()
            } catch (err) {
              reject(err)
            }
          })
        )
    })
  }
}

const runConventionalChangelog = createRunConventionalChangelog(conventionalChangelogCore)

module.exports = {
  TestTools,
  createRunConventionalChangelog,
  runConventionalChangelog,
  through,
  throughObj,
  delay
}
