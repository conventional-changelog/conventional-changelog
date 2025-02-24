import path from 'path'
import { describe, beforeAll, beforeEach, afterAll, it, expect } from 'vitest'
import { TestTools } from '../../../tools/index.js'

const CLI_PATH = path.join(__dirname, './cli.ts')
const FIXTURE_CHANGELOG_PATH = path.join(__dirname, '..', 'test', 'fixtures', '_CHANGELOG.md')
const FIXTURE_PACKAGE_PATH = path.join(__dirname, '..', 'test', 'fixtures', '_package.json')
const FIXTURE_CONTEXT_PATH = path.join(__dirname, '..', 'test', 'fixtures', 'context.json')
const FIXTURE_CONFIG_PATH = path.join(__dirname, '..', 'test', 'fixtures', 'config.cjs')
let testTools: TestTools

function originalChangelog() {
  testTools.writeFileSync(FIXTURE_CHANGELOG_PATH, 'Some previous changelog.\n')
}

describe('standard-changelog', () => {
  describe('cli', () => {
    beforeAll(() => {
      testTools = new TestTools()
      testTools.gitInit()
      testTools.gitCommit('feat: First commit')
    })

    beforeEach(() => {
      testTools.writeFileSync('CHANGELOG.md', '')
    })

    afterAll(() => {
      originalChangelog()
      testTools?.cleanup()
    })

    describe('without any argument', () => {
      it('appends to changelog if it exists', async () => {
        testTools.writeFileSync('CHANGELOG.md', '\nold content')

        const { exitCode } = await testTools.fork(CLI_PATH)

        expect(exitCode).toBe(0)

        const content = testTools.readFileSync('CHANGELOG.md', 'utf-8')

        expect(content).toMatch(/First commit/)
        expect(content).toMatch(/old content/)
      })

      it('generates changelog if it does not exist', async () => {
        const { exitCode } = await testTools.fork(CLI_PATH)

        expect(exitCode).toBe(0)

        const content = testTools.readFileSync('CHANGELOG.md', 'utf-8')

        expect(content).toMatch(/First commit/)
      })
    })

    it('should overwrite when appending', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, [
        '-i',
        FIXTURE_CHANGELOG_PATH,
        '--append'
      ])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')

      expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)

      originalChangelog()
    })

    it('should overwrite when not appending', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, ['-i', FIXTURE_CHANGELOG_PATH])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')

      expect(modified).toMatch(/First commit(\s|.)*Some previous changelog./)

      originalChangelog()
    })

    it('should overwrite if `infile` and `outfile` are the same', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, [
        '-i',
        FIXTURE_CHANGELOG_PATH,
        '-o',
        FIXTURE_CHANGELOG_PATH
      ])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')

      expect(modified).toContain('First commit')
      expect(modified).toContain('Some previous changelog.\n')

      originalChangelog()
    })

    it('should work if `infile` is missing but `outfile` presets', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, ['-o', path.join(testTools.cwd, '_CHANGELOG.md')])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')

      expect(modified).toContain('First commit')
    })

    it('should work if both `infile` and `outfile` presets when not appending', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, [
        '-i',
        FIXTURE_CHANGELOG_PATH,
        '-o',
        path.join(testTools.cwd, '_CHANGELOG.md')
      ])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')

      expect(modified).toMatch(/First commit(\s|.)*Some previous changelog./)
    })

    it('should work if both `infile` and `outfile` presets when appending', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, [
        '-i',
        FIXTURE_CHANGELOG_PATH,
        '-o',
        path.join(testTools.cwd, '_CHANGELOG.md'),
        '--append'
      ])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')

      expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)
    })

    it('should work if `infile` presets but `outfile` is missing when not appending', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, ['-i', FIXTURE_CHANGELOG_PATH])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')

      expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)
    })

    it('should work if `infile` presets but `outfile` is missing', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, ['-i', 'no-such-file.md'])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync('no-such-file.md', 'utf8')

      expect(modified).toContain('First commit')
      expect(modified).not.toContain('previous')
    })

    it('should create `infile` if `infile` is ENOENT and overwrite infile', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, ['-i', path.join(testTools.cwd, 'no-such-file.md')])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(path.join(testTools.cwd, 'no-such-file.md'), 'utf8')

      expect(modified).toContain('First commit')
      expect(modified).not.toContain('previous')

      originalChangelog()
    })

    it('should default to CHANGELOG.md if `-i` is missing', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH)

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync('CHANGELOG.md', 'utf8')

      expect(modified).toContain('First commit')
      expect(modified).not.toContain('previous')
    })

    it('-k should work', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, ['-k', FIXTURE_PACKAGE_PATH])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync('CHANGELOG.md', 'utf8')

      expect(modified).toContain('0.0.17')
    })

    it('--context should work with relative path', async () => {
      const context = path.relative(testTools.cwd, FIXTURE_CONTEXT_PATH)
      const config = path.relative(testTools.cwd, FIXTURE_CONFIG_PATH)
      const { exitCode } = await testTools.fork(CLI_PATH, [
        '--context',
        context,
        '--config',
        config
      ], {
        stdio: 'inherit'
      })

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync('CHANGELOG.md', 'utf8')

      expect(modified).toContain('my-repo')
    })

    it('--context should work with absolute path', async () => {
      const { exitCode } = await testTools.fork(CLI_PATH, [
        '--context',
        FIXTURE_CONTEXT_PATH,
        '--config',
        FIXTURE_CONFIG_PATH
      ])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync('CHANGELOG.md', 'utf8')

      expect(modified).toContain('my-repo')
    })

    it('generates full historical changelog on --first-release', async () => {
      testTools.exec('git tag -a v0.0.17 -m "old release"')

      const { exitCode } = await testTools.fork(CLI_PATH, [
        '-k',
        FIXTURE_PACKAGE_PATH,
        '--first-release'
      ])

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync('CHANGELOG.md', 'utf8')

      expect(modified).toContain('First commit')
      testTools.exec('git tag -d v0.0.17')
    })

    it('outputs an error if context file is not found', async () => {
      const { stderr, exitCode } = await testTools.fork(CLI_PATH, ['--context', 'missing-file.txt'])

      expect(exitCode).toBe(1)
      expect(stderr).toMatch(/Cannot find module/)
    })
  })
})
