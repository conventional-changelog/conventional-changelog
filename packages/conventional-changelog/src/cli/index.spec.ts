import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import path from 'path'
import { TestTools } from '../../../../tools/index.js'

const CLI_PATH = path.join(__dirname, './index.ts')
const FIXTURES_RELATIVE_PATH = path.join('..', '..', 'test', 'fixtures')
const FIXTURES_ABSOLUTE_PATH = path.resolve(__dirname, FIXTURES_RELATIVE_PATH)
const FIXTURE_CHANGELOG_PATH = path.join(FIXTURES_ABSOLUTE_PATH, '_CHANGELOG.md')
const FIXTURE_PACKAGE_PATH = path.join(FIXTURES_ABSOLUTE_PATH, '_package.json')
const FIXTURE_CONTEXT_PATH = path.join(FIXTURES_ABSOLUTE_PATH, 'context.json')
const FIXTURE_CONFIG_PATH = path.join(FIXTURES_ABSOLUTE_PATH, 'config.cjs')
const FIXTURE_PROMISE_CONFIG_PATH = path.join(FIXTURES_ABSOLUTE_PATH, 'promise-config.cjs')
let testTools: TestTools

function originalChangelog() {
  testTools.writeFileSync(FIXTURE_CHANGELOG_PATH, 'Some previous changelog.\n')
}

describe('conventional-changelog', () => {
  describe('cli', () => {
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

    it('should write to stdout', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, ['--stdout'])

      expect(stdout).toContain('First commit')
    })

    it('should output to the same file when appending', async () => {
      const { exitCode } = await testTools.fork(
        CLI_PATH,
        [
          '-i',
          FIXTURE_CHANGELOG_PATH,
          '--append'
        ]
      )

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')

      expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)

      originalChangelog()
    })

    it('should output to the same file when not appending', async () => {
      const { exitCode } = await testTools.fork(
        CLI_PATH,
        ['-i', FIXTURE_CHANGELOG_PATH]
      )

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')

      expect(modified).toMatch(/First commit(\s|.)*Some previous changelog./)

      originalChangelog()
    })

    it('should output to the same file if `infile` and `outfile` are the same', async () => {
      const { exitCode } = await testTools.fork(
        CLI_PATH,
        [
          '-i',
          FIXTURE_CHANGELOG_PATH,
          '-o',
          FIXTURE_CHANGELOG_PATH
        ]
      )

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')

      expect(modified).toContain('First commit')
      expect(modified).toContain('Some previous changelog.\n')

      originalChangelog()
    })

    it('should work if `infile` is missing but `outfile` presets', async () => {
      const { exitCode } = await testTools.fork(
        CLI_PATH,
        ['-o', path.join(testTools.cwd, '_CHANGELOG.md')]
      )

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')

      expect(modified).toContain('First commit')
    })

    it('should work if both `infile` and `outfile` presets when not appending', async () => {
      const { exitCode } = await testTools.fork(
        CLI_PATH,
        [
          '-i',
          FIXTURE_CHANGELOG_PATH,
          '-o',
          path.join(testTools.cwd, '_CHANGELOG.md')
        ]
      )

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')

      expect(modified).toMatch(/First commit(\s|.)*Some previous changelog./)
    })

    it('should work if both `infile` and `outfile` presets when appending', async () => {
      const { exitCode } = await testTools.fork(
        CLI_PATH,
        [
          '-i',
          FIXTURE_CHANGELOG_PATH,
          '-o',
          path.join(testTools.cwd, '_CHANGELOG.md'),
          '--append'
        ]
      )

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(path.join(testTools.cwd, '_CHANGELOG.md'), 'utf8')

      expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)
    })

    it('should work if `infile` presets but `outfile` is missing when not appending', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '-i',
        FIXTURE_CHANGELOG_PATH,
        '--stdout'
      ])

      expect(stdout).toMatch(/First commit(\s|.)*Some previous changelog./)
    })

    it('should work if `infile` presents but `outfile` is missing when appending', async () => {
      const { stdout } = await testTools.fork(
        CLI_PATH,
        [
          '-i',
          FIXTURE_CHANGELOG_PATH,
          '--append',
          '--stdout'
        ]
      )

      expect(stdout).toMatch(/Some previous changelog.(\s|.)*First commit/)
    })

    it('should ignore `infile` if `releaseCount` is `0` (stdout)', async () => {
      const { stdout } = await testTools.fork(
        CLI_PATH,
        [
          '-i',
          FIXTURE_CHANGELOG_PATH,
          '--release-count',
          '0',
          '--stdout'
        ]
      )

      expect(stdout).toContain('First commit')
      expect(stdout).not.toContain('previous')
    })

    it('should ignore `infile` if `releaseCount` is `0` (file)', async () => {
      const { exitCode } = await testTools.fork(
        CLI_PATH,
        [
          '-i',
          FIXTURE_CHANGELOG_PATH,
          '--release-count',
          '0'
        ]
      )

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')

      expect(modified).toContain('First commit')
      expect(modified).not.toContain('previous')

      originalChangelog()
    })

    it('should ignore `infile` if `infile` is ENOENT', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '-i',
        'no-such-file.md',
        '--stdout'
      ])

      expect(stdout).toContain('First commit')
      expect(stdout).not.toContain('previous')
      expect(stdout).not.toMatch(/First commit[\w\W]*First commit/)
    })

    it('should warn if `infile` is ENOENT', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, [
        '-i',
        'no-such-file.md',
        '-v'
      ])

      expect(stderr).toContain('does not exist.')
    })

    it('should create `infile` if `infile` is ENOENT and output to the same file', async () => {
      const { exitCode } = await testTools.fork(
        CLI_PATH,
        ['-i', path.join(testTools.cwd, 'no-such-file.md')]
      )

      expect(exitCode).toBe(0)

      const modified = testTools.readFileSync(path.join(testTools.cwd, 'no-such-file.md'), 'utf8')

      expect(modified).toContain('First commit')
      expect(modified).not.toContain('previous')

      originalChangelog()
    })

    it('should error if it fails to get any options file', async () => {
      const { stderr, exitCode } = await testTools.fork(CLI_PATH, ['--config', 'no'])

      expect(stderr).toContain('Cannot find module')
      expect(exitCode).toBe(1)
    })

    it('-k should work', async () => {
      const { stdout, exitCode } = await testTools.fork(CLI_PATH, [
        '-k',
        FIXTURE_PACKAGE_PATH,
        '--stdout'
      ])

      expect(stdout).toContain('0.0.17')
      expect(exitCode).toBe(0)
    })

    it('--context should work with relative path', async () => {
      const context = path.relative(testTools.cwd, FIXTURE_CONTEXT_PATH)
      const config = path.relative(testTools.cwd, FIXTURE_CONFIG_PATH)
      const { stdout } = await testTools.fork(
        CLI_PATH,
        [
          '--context',
          context,
          '--config',
          config,
          '--stdout'
        ]
      )

      expect(stdout).toBe('unicorn template\n')
    })

    it('--context should work with absolute path', async () => {
      const { stdout } = await testTools.fork(
        CLI_PATH,
        [
          '--context',
          FIXTURE_CONTEXT_PATH,
          '--config',
          FIXTURE_CONFIG_PATH,
          '--stdout'
        ]
      )

      expect(stdout).toBe('unicorn template\n')
    })

    it('--config should work with a return promise', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '--config',
        FIXTURE_PROMISE_CONFIG_PATH,
        '--stdout'
      ])

      expect(stdout).toBe('template\n')
    })

    it('--config should work with relative path', async () => {
      const config = path.relative(testTools.cwd, FIXTURE_CONFIG_PATH)
      const { stdout } = await testTools.fork(CLI_PATH, [
        '--config',
        config,
        '--stdout'
      ])

      expect(stdout).toBe('template\n')
    })

    it('--config should work with absolute path', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '--config',
        FIXTURE_CONFIG_PATH,
        '--stdout'
      ])

      expect(stdout).toBe('template\n')
    })

    it('--preset should work', async () => {
      testTools.writeFileSync('angular', '')
      testTools.exec('git add --all && git commit -m"fix: fix it!"')

      const { stdout } = await testTools.fork(CLI_PATH, [
        '--preset',
        'angular',
        '--stdout'
      ])

      expect(stdout).toContain('Bug Fixes')
    })

    it('--preset "conventionalcommits" should work', async () => {
      testTools.writeFileSync('angular', '2')
      testTools.exec('git add --all && git commit -m"fix: fix it!"')

      const { stdout } = await testTools.fork(CLI_PATH, [
        '--preset',
        'conventionalcommits',
        '--stdout'
      ])

      expect(stdout).toContain('Bug Fixes')
    })

    it('--config should work with --preset', async () => {
      const { stdout } = await testTools.fork(
        CLI_PATH,
        [
          '--preset',
          'angular',
          '--config',
          FIXTURE_CONFIG_PATH,
          '--stdout'
        ]
      )

      expect(stdout).toBe('Bug Fixestemplate\n')
    })

    it('should be verbose', async () => {
      const { stdout, exitCode } = await testTools.fork(CLI_PATH, ['-v', '--stdout'])

      expect(stdout).toContain('[git-client]: [')
      expect(exitCode).toBe(0)
    })
  }, 15_000)
})
