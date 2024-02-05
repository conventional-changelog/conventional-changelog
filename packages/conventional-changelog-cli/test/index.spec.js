import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import path from 'path'
import { TestTools } from '../../../tools/index.ts'

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

  it('should work without any arguments', async () => {
    const { stdout } = await testTools.fork(CLI_PATH)

    expect(stdout).toContain('First commit')
  })

  it('should output to the same file if `-s` presents when appending', async () => {
    const { exitCode } = await testTools.fork(
      CLI_PATH,
      ['-i', FIXTURE_CHANGELOG_PATH, '-s', '--append']
    )

    expect(exitCode).toBe(0)

    const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')

    expect(modified).toMatch(/Some previous changelog.(\s|.)*First commit/)

    originalChangelog()
  })

  it('should output to the same file if `-s` presents when not appending', async () => {
    const { exitCode } = await testTools.fork(
      CLI_PATH,
      ['-i', FIXTURE_CHANGELOG_PATH, '-s']
    )

    expect(exitCode).toBe(0)

    const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')

    expect(modified).toMatch(/First commit(\s|.)*Some previous changelog./)

    originalChangelog()
  })

  it('should output to the same file if `infile` and `outfile` are the same', async () => {
    const { exitCode } = await testTools.fork(
      CLI_PATH,
      ['-i', FIXTURE_CHANGELOG_PATH, '-o', FIXTURE_CHANGELOG_PATH]
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
    const { stdout } = await testTools.fork(CLI_PATH, ['-i', FIXTURE_CHANGELOG_PATH])

    expect(stdout).toMatch(/First commit(\s|.)*Some previous changelog./)
  })

  it('should work if `infile` presets but `outfile` is missing when appending', async () => {
    const { stdout } = await testTools.fork(
      CLI_PATH,
      ['-i', FIXTURE_CHANGELOG_PATH, '--append']
    )

    expect(stdout).toMatch(/Some previous changelog.(\s|.)*First commit/)
  })

  it('should ignore `infile` if `releaseCount` is `0` (stdout)', async () => {
    const { stdout } = await testTools.fork(
      CLI_PATH,
      ['-i', FIXTURE_CHANGELOG_PATH, '--release-count', 0]
    )

    expect(stdout).toContain('First commit')
    expect(stdout).not.toContain('previous')
  })

  it('should ignore `infile` if `releaseCount` is `0` (file)', async () => {
    const { exitCode } = await testTools.fork(
      CLI_PATH,
      ['-i', FIXTURE_CHANGELOG_PATH, '--release-count', 0, '-s']
    )

    expect(exitCode).toBe(0)

    const modified = testTools.readFileSync(FIXTURE_CHANGELOG_PATH, 'utf8')

    expect(modified).toContain('First commit')
    expect(modified).not.toContain('previous')

    originalChangelog()
  })

  it('should ignore `infile` if `infile` is ENOENT', async () => {
    const { stdout } = await testTools.fork(CLI_PATH, ['-i', 'no-such-file.md'])

    expect(stdout).toContain('First commit')
    expect(stdout).not.toContain('previous')
    expect(stdout).not.toMatch(/First commit[\w\W]*First commit/)
  })

  it('should warn if `infile` is ENOENT', async () => {
    const { stderr } = await testTools.fork(CLI_PATH, ['-i', 'no-such-file.md', '-v'])

    expect(stderr).toContain('infile does not exist.')
  })

  it('should create `infile` if `infile` is ENOENT and output to the same file', async () => {
    const { exitCode } = await testTools.fork(
      CLI_PATH,
      ['-i', path.join(testTools.cwd, 'no-such-file.md'), '-s']
    )

    expect(exitCode).toBe(0)

    const modified = testTools.readFileSync(path.join(testTools.cwd, 'no-such-file.md'), 'utf8')

    expect(modified).toContain('First commit')
    expect(modified).not.toContain('previous')

    originalChangelog()
  })

  it('should error if `-s` presents but `-i` is missing', async () => {
    const { stderr, exitCode } = await testTools.fork(CLI_PATH, ['-s'])

    expect(stderr).toContain('infile must be provided if same-file flag presents.\n')
    expect(exitCode).toBe(1)
  })

  it('should error if it fails to get any options file', async () => {
    const { stderr, exitCode } = await testTools.fork(CLI_PATH, ['--config', 'no'])

    expect(stderr).toContain('Failed to get file. ')
    expect(exitCode).toBe(1)
  })

  it('-k should work', async () => {
    const { stdout, exitCode } = await testTools.fork(CLI_PATH, ['-k', path.join(__dirname, 'fixtures/_package.json')])

    expect(stdout).toContain('0.0.17')
    expect(exitCode).toBe(0)
  })

  it('--context should work with relative path', async () => {
    const context = path.relative(testTools.cwd, path.join(__dirname, 'fixtures/context.json'))
    const config = path.relative(testTools.cwd, path.join(__dirname, 'fixtures/config.cjs'))

    const { stdout } = await testTools.fork(
      CLI_PATH,
      ['--context', context, '--config', config]
    )

    expect(stdout).toBe('unicorn template')
  })

  it('--context should work with absolute path', async () => {
    const { stdout } = await testTools.fork(
      CLI_PATH,
      ['--context', path.join(__dirname, 'fixtures/context.json'), '--config', path.join(__dirname, 'fixtures/config.cjs')]
    )

    expect(stdout).toBe('unicorn template')
  })

  it('--config should work with a return promise', async () => {
    const { stdout } = await testTools.fork(CLI_PATH, ['--config', path.join(__dirname, 'fixtures/promise-config.cjs')])

    expect(stdout).toBe('template')
  })

  it('--config should work with relative path', async () => {
    const config = path.relative(testTools.cwd, path.join(__dirname, 'fixtures/config.cjs'))

    const { stdout } = await testTools.fork(CLI_PATH, ['--config', config])

    expect(stdout).toBe('template')
  })

  it('--config should work with absolute path', async () => {
    const { stdout } = await testTools.fork(CLI_PATH, ['--config', path.join(__dirname, 'fixtures/config.cjs')])

    expect(stdout).toBe('template')
  })

  it('--preset should work', async () => {
    testTools.writeFileSync('angular', '')
    testTools.exec('git add --all && git commit -m"fix: fix it!"')

    const { stdout } = await testTools.fork(CLI_PATH, ['--preset', 'angular'])

    expect(stdout).toContain('Bug Fixes')
  })

  it('--preset "conventionalcommits" should work', async () => {
    testTools.writeFileSync('angular', '2')
    testTools.exec('git add --all && git commit -m"fix: fix it!"')

    const { stdout } = await testTools.fork(CLI_PATH, ['--preset', 'conventionalcommits'])

    expect(stdout).toContain('Bug Fixes')
  })

  it('--config should work with --preset', async () => {
    const { stdout } = await testTools.fork(
      CLI_PATH,
      ['--preset', 'angular', '--config', path.join(__dirname, 'fixtures/config.cjs')]
    )

    expect(stdout).toBe('Bug Fixestemplate')
  })

  it('should be verbose', async () => {
    const { stdout, stderr, exitCode } = await testTools.fork(CLI_PATH, ['-v', '-p', 'no'])

    expect(stdout).toContain('Your git-log command is')
    expect(stderr).toContain('Unable to load the "no" preset.')
    expect(exitCode).toBe(0)
  })
})
