function fixMessage(message?: string) {
  let msg = message

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

export function formatMessageArgs(msg: string | string[]) {
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

const commitTypes = [
  'chore',
  'test',
  'ci',
  'feat',
  'refactor',
  'style',
  'docs'
]

export function createRandomCommitMessage(index: number) {
  const type = commitTypes[Math.round(Math.random() * (commitTypes.length - 1))]

  return `${type}: commit message for ${type} #${index}`
}
