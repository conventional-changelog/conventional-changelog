
const { Readable, Transform } = require('stream')
const { execFile } = require('child_process')
const split = require('split2')

const DELIMITER = '------------------------ >8 ------------------------'

function normalizeExecOpts (execOpts) {
  execOpts = execOpts || {}
  execOpts.cwd = execOpts.cwd || process.cwd()

  return execOpts
}

function normalizeGitOpts (gitOpts) {
  gitOpts = gitOpts || {}
  gitOpts.format = gitOpts.format || '%B'
  gitOpts.from = gitOpts.from || ''
  gitOpts.to = gitOpts.to || 'HEAD'

  return gitOpts
}

async function getGitArgs (gitOpts) {
  const { default: dargs } = await import('dargs')
  const gitFormat = `--format=${gitOpts.format || ''}%n${DELIMITER}`
  const gitFromTo = [gitOpts.from, gitOpts.to].filter(Boolean).join('..')
  const gitArgs = ['log', gitFormat, gitFromTo]
    .concat(dargs(gitOpts, {
      excludes: ['debug', 'from', 'to', 'format', 'path', 'ignore']
    }))

  // allow commits to focus on specific directories.
  // this is useful for monorepos.
  if (gitOpts.path) {
    gitArgs.push('--', ...Array.isArray(gitOpts.path) ? gitOpts.path : [gitOpts.path])
  }

  return gitArgs
}

function gitRawCommits (rawGitOpts, rawExecOpts) {
  const readable = new Readable()
  readable._read = () => {}

  const gitOpts = normalizeGitOpts(rawGitOpts)
  const execOpts = normalizeExecOpts(rawExecOpts)
  let isError = false

  getGitArgs(gitOpts).then((args) => {
    if (gitOpts.debug) {
      gitOpts.debug('Your git-log command is:\ngit ' + args.join(' '))
    }

    const ignoreRegex = typeof gitOpts.ignore === 'string'
      ? new RegExp(gitOpts.ignore)
      : gitOpts.ignore
    const shouldNotIgnore = ignoreRegex
      ? chunk => !ignoreRegex.test(chunk.toString())
      : () => true

    const child = execFile('git', args, {
      cwd: execOpts.cwd,
      maxBuffer: Infinity
    })

    child.stdout
      .pipe(split(DELIMITER + '\n'))
      .pipe(
        new Transform({
          transform (chunk, enc, cb) {
            isError = false
            setImmediate(() => {
              if (shouldNotIgnore(chunk)) {
                readable.push(chunk)
              }
              cb()
            })
          },
          flush (cb) {
            setImmediate(() => {
              if (!isError) {
                readable.push(null)
                readable.emit('close')
              }

              cb()
            })
          }
        })
      )

    child.stderr
      .pipe(
        new Transform({
          objectMode: true,
          highWaterMark: 16,
          transform (chunk) {
            isError = true
            readable.emit('error', new Error(chunk))
            readable.emit('close')
          }
        })
      )
  })

  return readable
}

module.exports = gitRawCommits
