import { Buffer } from 'safe-buffer'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { join } from 'path'
import Vinyl from 'vinyl'
import { TestTools, through } from '../../../tools/test-tools.ts'
import conventionalChangelog from '../index.js'

let testTools

describe('gulp-conventional-changelog', () => {
  beforeAll(() => {
    testTools = new TestTools()
    testTools.gitInit()
  })

  afterAll(() => {
    testTools?.cleanup()
  })

  describe('error', () => {
    it('should emit error if any', async () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular'
      })
      let error = null

      stream.write(new Vinyl({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/CHANGELOG.md'),
        contents: Buffer.from('')
      }))
      stream.end()

      try {
        for await (const file of stream) {
          (() => file)()
        }
      } catch (err) {
        error = err
      }

      expect(error.plugin).toContain('gulp-conventional-changelog')
    })
  })

  describe('stream', () => {
    beforeAll(() => {
      testTools.writeFileSync('test1', '')
      testTools.exec('git add --all && git commit -m"feat(module): amazing new module"')
    })

    it('should prepend the log', async () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular'
      })
      const fakeStream = through()
      let i = 0

      fakeStream.write(Buffer.from('CHANGELOG'))
      fakeStream.end()

      stream.write(new Vinyl({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/CHANGELOG.md'),
        contents: fakeStream
      }))
      stream.end()

      for await (const file of stream) {
        let contents = ''

        for await (const chunk of file.contents) {
          contents += chunk.toString()
        }

        expect(contents).toMatch(/### Features[\w\W]*module:[\w\W]*amazing new module.[\w\W]*CHANGELOG$/)
        i++
      }

      expect(i).toBe(1)
    })

    it('should append the log', async () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular',
        append: true
      })
      const fakeStream = through()
      let i = 0

      fakeStream.write(Buffer.from('CHANGELOG'))
      fakeStream.end()

      stream.write(new Vinyl({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/CHANGELOG.md'),
        contents: fakeStream
      }))
      stream.end()

      for await (const file of stream) {
        let contents = ''

        for await (const chunk of file.contents) {
          contents += chunk.toString()
        }

        expect(contents).toMatch(/CHANGELOG[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/)
        i++
      }

      expect(i).toBe(1)
    })

    it('should generate all blocks', async () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular',
        releaseCount: 0
      })
      let i = 0

      const fakeStream = through()

      stream.write(new Vinyl({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/CHANGELOG.md'),
        contents: fakeStream
      }))
      stream.end()

      for await (const file of stream) {
        let contents = ''

        for await (const chunk of file.contents) {
          contents += chunk.toString()
        }

        expect(contents).toMatch(/[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/)
        i++
      }

      expect(i).toBe(1)
    })
  })

  describe('buffer', () => {
    it('should prepend the log', async () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular'
      })
      let i = 0

      stream.write(new Vinyl({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/CHANGELOG.md'),
        contents: Buffer.from('CHANGELOG')
      }))
      stream.end()

      for await (const file of stream) {
        expect(file.contents.toString()).toMatch(/### Features[\w\W]*module:[\w\W]*amazing new module.[\w\W]*CHANGELOG$/)
        i++
      }

      expect(i).toBe(1)
    })

    it('should append the log', async () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular',
        append: true
      })
      let i = 0

      stream.write(new Vinyl({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/CHANGELOG.md'),
        contents: Buffer.from('CHANGELOG')
      }))
      stream.end()

      for await (const file of stream) {
        expect(file.contents.toString()).toMatch(/CHANGELOG[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/)
        i++
      }

      expect(i).toBe(1)
    })

    it('should generate all blocks', async () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular',
        releaseCount: 0
      })
      let i = 0

      stream.write(new Vinyl({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/CHANGELOG.md'),
        contents: Buffer.from('CHANGELOG')
      }))
      stream.end()

      for await (const file of stream) {
        expect(file.contents.toString()).toMatch(/[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/)
        i++
      }

      expect(i).toBe(1)
    })

    it('output encoding should always be buffer', async () => {
      testTools.exec('git tag v0.0.0')
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular'
      }, {
        version: '0.0.0'
      })
      let i = 0

      stream.write(new Vinyl({
        cwd: __dirname,
        base: join(__dirname, 'fixtures'),
        path: join(__dirname, 'fixtures/CHANGELOG.md'),
        contents: Buffer.from('CHANGELOG')
      }))
      stream.end()

      for await (const file of stream) {
        expect(file.contents.toString()).toBe('CHANGELOG')
        i++
      }

      expect(i).toBe(1)
    })
  })

  describe('null', () => {
    it('should let null files pass through', async () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd
      })
      let i = 0

      stream.write(new Vinyl({
        path: 'null.md',
        contents: null
      }))
      stream.end()

      for await (const file of stream) {
        expect(file.path).toBe('null.md')
        expect(file.contents).toBe(null)
        i++
      }

      expect(i).toBe(1)
    })
  })

  it('should verbose', async () => {
    const stream = conventionalChangelog({
      cwd: testTools.cwd,
      verbose: true
    })

    stream.write(new Vinyl({
      cwd: __dirname,
      base: join(__dirname, 'fixtures'),
      path: join(__dirname, 'fixtures/CHANGELOG.md'),
      contents: Buffer.from('CHANGELOG')
    }))
    stream.end()

    for await (const file of stream) {
      file.contents.toString()
    }
  })
})
