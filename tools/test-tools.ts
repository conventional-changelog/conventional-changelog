import { execSync, spawn } from 'child_process'
import { Transform } from 'stream'
import { pathToFileURL } from 'url'
import path from 'path'
import fs from 'fs'
// @ts-expect-error 'tmp' has no types
import tmp from 'tmp'

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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

function prepareMessageArgs(msg: string | string[]) {
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

function createRandomCommitMessage(index: number) {
  const type = commitTypes[Math.round(Math.random() * (commitTypes.length - 1))]

  return `${type}: commit message for ${type} #${index}`
}

export function through(
  transform = (
    chunk: string | Buffer,
    _enc: string,
    cb: (err: Error | null, chunk: string | Buffer) => void
  ) => cb(null, chunk),
  flush?: () => void
) {
  return new Transform({
    transform,
    flush
  })
}

export function throughObj(
  transform = (
    chunk: string | Buffer,
    _enc: string,
    cb: (err: Error | null, chunk: string | Buffer) => void
  ) => cb(null, chunk),
  flush?: () => void
) {
  return new Transform({
    objectMode: true,
    highWaterMark: 16,
    transform,
    flush
  })
}

export async function toArray<T>(iterable: Iterable<T> | AsyncIterable<T>): Promise<T[]> {
  const array = []

  for await (const item of iterable) {
    array.push(item)
  }

  return array
}

export async function toString(iterable: Iterable<string | Buffer> | AsyncIterable<string | Buffer>) {
  let string = ''

  for await (const chunk of iterable) {
    string += chunk.toString()
  }

  return string
}

export class TestTools {
  cwd: string

  constructor(cwd?: string) {
    if (cwd) {
      this.cwd = cwd
    } else {
      /* eslint-disable */
      this.cwd = fs.realpathSync(tmp.dirSync().name)
      tmp.setGracefulCleanup()
      /* eslint-enable */
    }
  }

  cleanup() {
    try {
      this.rmSync(this.cwd, {
        recursive: true
      })
    } catch (err) {
      // ignore
    }
  }

  mkdirSync(dir: string, options?: Parameters<typeof fs.mkdirSync>[1]) {
    return fs.mkdirSync(path.resolve(this.cwd, dir), options)
  }

  writeFileSync(file: string, content: string) {
    return fs.writeFileSync(path.resolve(this.cwd, file), content)
  }

  readFileSync(file: string, options: Parameters<typeof fs.readFileSync>[1]) {
    return fs.readFileSync(path.resolve(this.cwd, file), options)
  }

  rmSync(target: string, options?: Parameters<typeof fs.rmSync>[1]) {
    return fs.rmSync(path.resolve(this.cwd, target), options)
  }

  exec(command: string) {
    return execSync(command, {
      cwd: this.cwd,
      stdio: 'pipe',
      encoding: 'utf-8'
    })
  }

  fork(script: string, args: string[] = [], options: Parameters<typeof spawn>[2] = {}) {
    return new Promise<{stdout: string, stderr: string, exitCode: number | null}>((resolve, reject) => {
      const finalOptions = {
        cwd: this.cwd,
        stdio: [
          null,
          null,
          null
        ],
        ...options
      }
      const nodeArgs = [
        '--no-warnings',
        '--loader',
        pathToFileURL(path.resolve(__dirname, '..', 'node_modules', 'tsm', 'loader.mjs')).toString()
      ]
      const child = spawn(process.execPath, [
        ...nodeArgs,
        script,
        ...args
      ], finalOptions)
      let stdout = ''
      let stderr = ''
      let exitCode = null

      child.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString()
      })
      child.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString()
      })
      child.on('close', (code) => {
        exitCode = code
        resolve({
          stdout,
          stderr,
          exitCode
        })
      })
      child.on('error', reject)
    })
  }

  gitInit() {
    this.mkdirSync('git-templates')
    return this.exec('git init --template=./git-templates  --initial-branch=master')
  }

  gitInitSimpleRepository() {
    this.gitInit()

    for (let i = 0; i < 20; i++) {
      this.gitCommit(createRandomCommitMessage(i))

      if (i % 3 === 0) {
        this.exec(`git tag v${i}.0.0`)
      }
    }
  }

  gitCommit(msg: string | string[]) {
    const args = prepareMessageArgs(msg)

    args.push(
      '--allow-empty',
      '--no-gpg-sign'
    )

    return this.exec(`git commit ${args.join(' ')}`)
  }

  gitTails() {
    const data = execSync('git rev-list --parents HEAD', {
      cwd: this.cwd
    })

    return data.toString().match(/^[a-f0-9]{40}$/gm)
  }
}
