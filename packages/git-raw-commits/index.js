import { Readable } from 'stream'
import { execFile } from 'child_process'
import split from 'split2'

const DELIMITER = '------------------------ >8 ------------------------'

function immediate () {
  return new Promise(resolve => setImmediate(resolve))
}

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

async function streamRawCommits (readable, gitOpts, execOpts) {
  const args = await getGitArgs(gitOpts)
  let isError = false

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

  ;(async () => {
    for await (const chunk of child.stdout.pipe(split(DELIMITER + '\n'))) {
      isError = false

      await immediate()

      if (!isError && shouldNotIgnore(chunk)) {
        readable.push(chunk)
      }
    }

    await immediate()

    if (!isError) {
      readable.push(null)
      readable.emit('close')
    }
  })()

  child.stderr.on('data', (chunk) => {
    isError = true
    readable.emit('error', new Error(chunk.toString()))
    readable.emit('close')
  })
}

export default function gitRawCommits (rawGitOpts, rawExecOpts) {
  const readable = new Readable()
  readable._read = () => {}

  const gitOpts = normalizeGitOpts(rawGitOpts)
  const execOpts = normalizeExecOpts(rawExecOpts)

  streamRawCommits(readable, gitOpts, execOpts)

  return readable
}
