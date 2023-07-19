import { Buffer } from 'safe-buffer'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { join } from 'path'
import concat from 'concat-stream'
import Vinyl from 'vinyl'
import { TestTools, through, throughObj } from '../../../tools/test-tools'
import conventionalChangelog from '../'

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
    it('should emit error if any', () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular'
      })

      return new Promise((resolve) => {
        stream.on('error', (err) => {
          expect(err.plugin).toEqual('gulp-conventional-changelog')
          resolve()
        })

        stream.write(new Vinyl({
          cwd: __dirname,
          base: join(__dirname, 'fixtures'),
          path: join(__dirname, 'fixtures/CHANGELOG.md'),
          contents: Buffer.from('')
        }))

        stream.end()
      })
    })
  })

  describe('stream', () => {
    beforeAll(() => {
      testTools.writeFileSync('test1', '')
      testTools.exec('git add --all && git commit -m"feat(module): amazing new module"')
    })

    it('should prepend the log', () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular'
      })

      const fakeStream = through()
      fakeStream.write(Buffer.from('CHANGELOG'))
      fakeStream.end()

      return new Promise((resolve) => {
        stream.on('data', (file) => {
          file.contents
            .pipe(concat((data) => {
              expect(data.toString()).toMatch(/### Features[\w\W]*module:[\w\W]*amazing new module.[\w\W]*CHANGELOG$/)
              resolve()
            }))
        })

        stream.write(new Vinyl({
          cwd: __dirname,
          base: join(__dirname, 'fixtures'),
          path: join(__dirname, 'fixtures/CHANGELOG.md'),
          contents: fakeStream
        }))

        stream.end()
      })
    })

    it('should append the log', () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular',
        append: true
      })

      const fakeStream = through()
      fakeStream.write(Buffer.from('CHANGELOG'))
      fakeStream.end()

      return new Promise((resolve) => {
        stream.on('data', (file) => {
          file.contents
            .pipe(concat((data) => {
              expect(data.toString()).toMatch(/CHANGELOG[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/)
              resolve()
            }))
        })

        stream.write(new Vinyl({
          cwd: __dirname,
          base: join(__dirname, 'fixtures'),
          path: join(__dirname, 'fixtures/CHANGELOG.md'),
          contents: fakeStream
        }))

        stream.end()
      })
    })

    it('should generate all blocks', () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular',
        releaseCount: 0
      })

      const fakeStream = through()

      return new Promise((resolve) => {
        stream.on('data', (file) => {
          file.contents
            .pipe(concat((data) => {
              expect(data.toString()).toMatch(/[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/)
              resolve()
            }))
        })

        stream.write(new Vinyl({
          cwd: __dirname,
          base: join(__dirname, 'fixtures'),
          path: join(__dirname, 'fixtures/CHANGELOG.md'),
          contents: fakeStream
        }))

        stream.end()
      })
    })
  })

  describe('buffer', () => {
    it('should prepend the log', () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular'
      })

      return new Promise((resolve) => {
        stream.on('data', (file) => {
          expect(file.contents.toString()).toMatch(/### Features[\w\W]*module:[\w\W]*amazing new module.[\w\W]*CHANGELOG$/)
        })

        stream.on('end', resolve)

        stream.write(new Vinyl({
          cwd: __dirname,
          base: join(__dirname, 'fixtures'),
          path: join(__dirname, 'fixtures/CHANGELOG.md'),
          contents: Buffer.from('CHANGELOG')
        }))

        stream.end()
      })
    })

    it('should append the log', () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular',
        append: true
      })

      return new Promise((resolve) => {
        stream.on('data', (file) => {
          expect(file.contents.toString()).toMatch(/CHANGELOG[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/)
        })

        stream.on('end', resolve)

        stream.write(new Vinyl({
          cwd: __dirname,
          base: join(__dirname, 'fixtures'),
          path: join(__dirname, 'fixtures/CHANGELOG.md'),
          contents: Buffer.from('CHANGELOG')
        }))

        stream.end()
      })
    })

    it('should generate all blocks', () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular',
        releaseCount: 0
      })

      return new Promise((resolve) => {
        stream.on('data', (file) => {
          expect(file.contents.toString()).toMatch(/[\w\W]*### Features[\w\W]*module:[\w\W]*amazing new module/)
        })

        stream.on('end', resolve)

        stream.write(new Vinyl({
          cwd: __dirname,
          base: join(__dirname, 'fixtures'),
          path: join(__dirname, 'fixtures/CHANGELOG.md'),
          contents: Buffer.from('CHANGELOG')
        }))

        stream.end()
      })
    })

    it('output encoding should always be buffer', () => {
      testTools.exec('git tag v0.0.0')
      const stream = conventionalChangelog({
        cwd: testTools.cwd,
        preset: 'angular'
      }, {
        version: '0.0.0'
      })

      return new Promise((resolve) => {
        stream.on('data', (file) => {
          expect(file.contents.toString()).toEqual('CHANGELOG')
        })

        stream.on('end', resolve)

        stream.write(new Vinyl({
          cwd: __dirname,
          base: join(__dirname, 'fixtures'),
          path: join(__dirname, 'fixtures/CHANGELOG.md'),
          contents: Buffer.from('CHANGELOG')
        }))

        stream.end()
      })
    })
  })

  describe('null', () => {
    it('should let null files pass through', () => {
      const stream = conventionalChangelog({
        cwd: testTools.cwd
      })

      let n = 0

      return new Promise((resolve) => {
        stream.pipe(throughObj((file, enc, cb) => {
          expect(file.path).toEqual('null.md')
          expect(file.contents).toEqual(null)
          n++

          cb()
        }, () => {
          expect(n).toEqual(1)
          resolve()
        }))

        stream.write(new Vinyl({
          path: 'null.md',
          contents: null
        }))

        stream.end()
      })
    })
  })

  it('should verbose', () => {
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
  })
})
