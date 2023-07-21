import { spawn } from 'child_process'
import path from 'path'
import { describe, beforeAll, beforeEach, afterAll, it, expect } from 'vitest'
import { TestTools } from '../../../tools/test-tools'

const CLI_PATH = path.join(__dirname, '../cli.js')
const FIXTURE_CHANGELOG_PATH = path.join(__dirname, 'fixtures/_CHANGELOG.md')
let testTools

function originalChangelog () {
  testTools.writeFileSync(FIXTURE_CHANGELOG_PATH, 'Some previous changelog.\n')
}

describe('standard-changelog', () => {
  describe('cli', () => {
    beforeAll(() => {
      testTools = new TestTools()
      testTools.gitInit()
      testTools.gitDummyCommit('feat: First commit')
    })

    beforeEach(() => {
      testTools.writeFileSync('CHANGELOG.md', '')
    })

    afterAll(() => {
      originalChangelog()
      testTools?.cleanup()
    })

    describe('without any argument', () => {
      it('appends to changelog if it exists', () => {
        testTools.writeFileSync('CHANGELOG.md', '\nold content', 'utf-8')

        return new Promise((resolve) => {
          const cp = spawn(process.execPath, [CLI_PATH], {
            cwd: testTools.cwd,
            stdio: [null, null, null]
          })

          cp.on('close', (code) => {
            expect(code).toEqual(0)
            const content = testTools.readFileSync('CHANGELOG.md', 'utf-8')
            expect(content).toMatch(/First commit/)
            expect(content).toMatch(/old content/)
            resolve()
          })
        })
      })

      it('generates changelog if it does not exist', () => {
        return new Promise((resolve) => {
          const cp = spawn(process.execPath, [CLI_PATH], {
            cwd: testTools.cwd,
            stdio: [null, null, null]
          })

          cp.on('close', (code) => {
            expect(code).toEqual(0)
            const content = testTools.readFileSync('CHANGELOG.md', 'utf-8')
            expect(content).toMatch(/First commit/)
            resolve()
          })
        })
      })
    })

    it('should overwrite if `-s` presents when appending', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH, '-s', '--append'], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')
          expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)

          originalChangelog()
          resolve()
        })
      })
    })

    it('should overwrite if `-s` presents when not appending', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH, '-s'], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')
          expect(modified).toMatch(/First commit(\s|.)*Some previous changelog./)

          originalChangelog()
          resolve()
        })
      })
    })

    it('should overwrite if `infile` and `outfile` are the same', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH, '-o', FIXTURE_CHANGELOG_PATH], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')
          expect(modified).toContain('First commit')
          expect(modified).toContain('Some previous changelog.\n')

          originalChangelog()
          resolve()
        })
      })
    })

    it('should work if `infile` is missing but `outfile` presets', () => {
      return new Promise((resolve) => {
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
      })
    })

    it('should work if both `infile` and `outfile` presets when not appending', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH, '-o', path.join(testTools.cwd, '_CHANGELOG.md')], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')
          expect(modified).toMatch(/First commit(\s|.)*Some previous changelog./)

          resolve()
        })
      })
    })

    it('should work if both `infile` and `outfile` presets when appending', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH, '-o', path.join(testTools.cwd, '_CHANGELOG.md'), '--append'], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')
          expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)
          resolve()
        })
      })
    })

    it('should work if `infile` presets but `outfile` is missing when not appending', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-i', FIXTURE_CHANGELOG_PATH], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')
          expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)

          resolve()
        })
      })
    })

    it('should work if `infile` presets but `outfile` is missing', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-i', 'no-such-file.md'], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync('no-such-file.md', 'utf8')
          expect(modified).toContain('First commit')
          expect(modified).not.toContain('previous')
          resolve()
        })
      })
    })

    it('should create `infile` if `infile` is ENOENT and overwrite infile', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-i', path.join(testTools.cwd, 'no-such-file.md'), '-s'], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync(path.join(testTools.cwd, 'no-such-file.md'), 'utf8')
          expect(modified).toContain('First commit')
          expect(modified).not.toContain('previous')

          originalChangelog()
          resolve()
        })
      })
    })

    it('should default to CHANGELOG.md if `-s` presents but `-i` is missing', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-s'], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync('CHANGELOG.md', 'utf8')
          expect(modified).toContain('First commit')
          expect(modified).not.toContain('previous')
          resolve()
        })
      })
    })

    it('-k should work', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-k', path.join(__dirname, 'fixtures/_package.json')], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync('CHANGELOG.md', 'utf8')
          expect(modified).toContain('0.0.17')
          resolve()
        })
      })
    })

    it('--context should work with relative path', () => {
      const context = path.relative(testTools.cwd, path.join(__dirname, 'fixtures/context.json'))
      const config = path.relative(testTools.cwd, path.join(__dirname, 'fixtures/config.js'))

      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '--context', context, '--config', config], {
          cwd: testTools.cwd,
          stdio: 'inherit'
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync('CHANGELOG.md', 'utf8')
          expect(modified).toContain('my-repo')
          resolve()
        })
      })
    })

    it('--context should work with absolute path', () => {
      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '--context', path.join(__dirname, 'fixtures/context.json'), '--config', path.join(__dirname, 'fixtures/config.js')], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync('CHANGELOG.md', 'utf8')
          expect(modified).toContain('my-repo')
          resolve()
        })
      })
    })

    it('generates full historical changelog on --first-release', () => {
      testTools.exec('git tag -a v0.0.17 -m "old release"')

      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '-k', path.join(__dirname, 'fixtures/_package.json'), '--first-release'], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.on('close', (code) => {
          expect(code).toEqual(0)
          const modified = testTools.readFileSync('CHANGELOG.md', 'utf8')
          expect(modified).toContain('First commit')
          testTools.exec('git tag -d v0.0.17')
          resolve()
        })
      })
    })

    it('outputs an error if context file is not found', () => {
      let output = ''

      return new Promise((resolve) => {
        const cp = spawn(process.execPath, [CLI_PATH, '--context', 'missing-file.txt'], {
          cwd: testTools.cwd,
          stdio: [null, null, null]
        })

        cp.stderr.on('data', (data) => {
          output += data.toString()
        })

        cp.on('close', (code) => {
          expect(code).toEqual(1)
          expect(output.toString()).toMatch(/Cannot find module/)
          resolve()
        })
      })
    })
  })
})
