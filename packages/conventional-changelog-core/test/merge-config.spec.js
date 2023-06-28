'use strict'
const mergeConfig = require('../lib/merge-config')
const expect = require('chai').expect
const describe = require('mocha').describe

const defaultOptions = {
  append: false,
  releaseCount: 1,
  skipUnstable: false,
  lernaPackage: null,
  outputUnreleased: true
}

describe('merge-config', function () {
  it('should return passed options', async function () {
    const options = {
      append: true,
      releaseCount: 0,
      skipUnstable: true,
      debug: function () {},
      warn: function () {},
      transform: function () {},
      lernaPackage: 'foo',
      tagPrefix: 'bar',
      outputUnreleased: true,
      pkg: {
        path: 'baz',
        transform: function () {}
      }
    }
    const config = await mergeConfig(options)
    expect(config.options).to.deep.include(options)
  })

  it('should return default options if empty options is passed', async function () {
    const { options } = await mergeConfig({})
    expect(options).to.include(defaultOptions)
  })

  it('should return default options when no options is passed', async function () {
    const { options } = await mergeConfig()
    expect(options).to.include(defaultOptions)
  })

  it('should return default options when null is passed', async function () {
    const { options } = await mergeConfig(null)
    expect(options).to.include(defaultOptions)
  })

  it('should return default options when undefined value is passed', async function () {
    const options = {
      append: undefined,
      releaseCount: undefined,
      skipUnstable: undefined,
      lernaPackage: undefined,
      outputUnreleased: undefined
    }
    const config = await mergeConfig(options)
    expect(config.options).to.include(defaultOptions)
  })
})
