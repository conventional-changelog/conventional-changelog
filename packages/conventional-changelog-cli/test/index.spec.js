import concat from 'concat-stream'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { spawn } from 'child_process'
import path from 'path'
import { TestTools } from '../../../tools/test-tools'

const CLI_PATH = path.join(__dirname, '../cli.js')
const FIXTURE_CHANGELOG_PATH = path.join(__dirname, 'fixtures/_CHANGELOG.md')
let testTools

function originalChangelog () {
  testTools.writeFileSync(FIXTURE_CHANGELOG_PATH, 'Some previous changelog.\n')
}

describe('conventional-changelog-cli', () => {
  beforeAll(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.writeFileSync('test1', '')
    testTools.exec('git add --all && git commit -m"First commit"')
  })

  afterAll(() => {
    originalChangelog()
    testTools?.cleanup()
  })

  it('should work without any arguments', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toContain('First commit')

          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('should output to the same file if `-s` presents when appending', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH, '-s', '--append'],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.on('close', (code) => {
        expect(code).toEqual(0)
        const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')
        expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)

        originalChangelog()
        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('should output to the same file if `-s` presents when not appending', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH, '-s'],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.on('close', (code) => {
        expect(code).toEqual(0)
        const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')
        expect(modified).toMatch(/First commit(\s|.)*Some previous changelog./)

        originalChangelog()
        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('should output to the same file if `infile` and `outfile` are the same', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [
          CLI_PATH,
          '-i',
          FIXTURE_CHANGELOG_PATH,
          '-o',
          FIXTURE_CHANGELOG_PATH
        ],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.on('close', (code) => {
        expect(code).toEqual(0)
        const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')
        expect(modified).toContain('First commit')
        expect(modified).toContain('Some previous changelog.\n')

        originalChangelog()
        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('should work if `infile` is missing but `outfile` presets', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '-o', path.join(testTools.cwd, '_CHANGELOG.md')], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.on('close', (code) => {
        expect(code).toEqual(0)
        const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')
        expect(modified).toContain('First commit')

        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('should work if both `infile` and `outfile` presets when not appending', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [
          CLI_PATH,
          '-i',
          FIXTURE_CHANGELOG_PATH,
          '-o',
          path.join(testTools.cwd, '_CHANGELOG.md')
        ],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.on('close', (code) => {
        expect(code).toEqual(0)
        const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')
        expect(modified).toMatch(/First commit(\s|.)*Some previous changelog./)

        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('should work if both `infile` and `outfile` presets when appending', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [
          CLI_PATH,
          '-i',
          FIXTURE_CHANGELOG_PATH,
          '-o',
          path.join(testTools.cwd, '_CHANGELOG.md'),
          '--append'
        ],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.on('close', (code) => {
        expect(code).toEqual(0)
        const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')
        expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)

        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('should work if `infile` presets but `outfile` is missing when not appending', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toMatch(/First commit(\s|.)*Some previous changelog./)

          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('should work if `infile` presets but `outfile` is missing when appending', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH, '--append'],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toMatch(/Some previous changelog.(\s|.)*First commit/)

          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('should ignore `infile` if `releaseCount` is `0` (stdout)', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH, '--release-count', 0],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.stdout.pipe(
        concat((chunk) => {
          chunk = chunk.toString()

          expect(chunk).toContain('First commit')
          expect(chunk).not.toContain('previous')

          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('should ignore `infile` if `releaseCount` is `0` (file)', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH, '--release-count', 0, '-s'],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.on('close', (code) => {
        expect(code).toEqual(0)
        const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')
        expect(modified).toContain('First commit')
        expect(modified).not.toContain('previous')

        originalChangelog()
        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('should ignore `infile` if `infile` is ENOENT', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '-i', 'no-such-file.md'], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stdout.pipe(
        concat((chunk) => {
          chunk = chunk.toString()

          expect(chunk).toContain('First commit')
          expect(chunk).not.toContain('previous')
          expect(chunk).not.toMatch(/First commit[\w\W]*First commit/)

          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('should warn if `infile` is ENOENT', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '-i', 'no-such-file.md', '-v'], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stderr.pipe(
        concat((chunk) => {
          chunk = chunk.toString()

          expect(chunk).toContain('infile does not exist.')

          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('should create `infile` if `infile` is ENOENT and output to the same file', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [CLI_PATH, '-i', path.join(testTools.cwd, 'no-such-file.md'), '-s'],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.on('close', (code) => {
        expect(code).toEqual(0)
        const modified = testTools.readFileSync(path.join(testTools.cwd, 'no-such-file.md'), 'utf8')
        expect(modified).toContain('First commit')
        expect(modified).not.toContain('previous')

        originalChangelog()
        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('should error if `-s` presents but `-i` is missing', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '-s'], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stderr.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toContain('infile must be provided if same-file flag presents.\n')
        })
      )

      cp.on('close', (code) => {
        expect(code).toEqual(1)

        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('should error if it fails to get any options file', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '--config', 'no'], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stderr.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toContain('Failed to get file. ')
        })
      )

      cp.on('close', (code) => {
        expect(code).toEqual(1)

        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('-k should work', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '-k', path.join(__dirname, 'fixtures/_package.json')], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toContain('0.0.17')
        })
      )

      cp.on('close', (code) => {
        expect(code).toEqual(0)

        resolve()
      })

      cp.on('error', reject)
    })
  })

  it('--context should work with relative path', () => {
    const context = path.relative(testTools.cwd, path.join(__dirname, 'fixtures/context.json'))
    const config = path.relative(testTools.cwd, path.join(__dirname, 'fixtures/config.js'))

    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [CLI_PATH, '--context', context, '--config', config],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toEqual('unicorn template')
          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('--context should work with absolute path', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [CLI_PATH, '--context', path.join(__dirname, 'fixtures/context.json'), '--config', path.join(__dirname, 'fixtures/config.js')],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toEqual('unicorn template')
          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('--config should work with a return promise', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '--config', path.join(__dirname, 'fixtures/promise-config.js')], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toEqual('template')
          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('--config should work with relative path', () => {
    const config = path.relative(testTools.cwd, path.join(__dirname, 'fixtures/config.js'))

    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '--config', config], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toEqual('template')
          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('--config should work with absolute path', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '--config', path.join(__dirname, 'fixtures/config.js')], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toEqual('template')
          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('--preset should work', () => {
    testTools.writeFileSync('angular', '')
    testTools.exec('git add --all && git commit -m"fix: fix it!"')

    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '--preset', 'angular'], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toContain('Bug Fixes')
          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('--preset "conventionalcommits" should work', () => {
    testTools.writeFileSync('angular', '2')
    testTools.exec('git add --all && git commit -m"fix: fix it!"')

    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '--preset', 'conventionalcommits'], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toContain('Bug Fixes')
          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('--config should work with --preset', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(
        process.execPath,
        [CLI_PATH, '--preset', 'angular', '--config', path.join(__dirname, 'fixtures/config.js')],
        {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        }
      )

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toEqual('Bug Fixestemplate')
          resolve()
        })
      )

      cp.on('error', reject)
    })
  })

  it('should be verbose', () => {
    return new Promise((resolve, reject) => {
      const cp = spawn(process.execPath, [CLI_PATH, '-v', '-p', 'no'], {
        cwd: testTools.cwd,
        stdio: [null, null, null]
      })

      cp.stdout.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toContain('Your git-log command is')
        })
      )

      cp.stderr.pipe(
        concat((chunk) => {
          expect(chunk.toString()).toContain('Unable to load the "no" preset.')
        })
      )

      cp.on('close', (code) => {
        expect(code).toEqual(0)
        resolve()
      })

      cp.on('error', reject)
    })
  })
})
