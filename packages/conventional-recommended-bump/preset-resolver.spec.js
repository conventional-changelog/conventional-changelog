'use strict'

const assert = require(`core-assert`)
const presetResolver = require(`./preset-resolver`)
const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it

describe(`preset-resolver`, () => {
  it(`rejects if preset package is not a promise, function, or object`, done => {
    const result = presetResolver(`invalid preset package`)

    result.catch(error => {
      assert.equal(error.message, `preset package must be a promise, funciton, or object`)
      done()
    })
  })

  it(`resolves a promise as a promise`, done => {
    const result = presetResolver(Promise.resolve(true))
    result.then(value => {
      assert.equal(value, true)
      done()
    })
  })

  it(`resolves an object as a promise`, done => {
    const result = presetResolver({answer: 42})
    result.then(value => {
      assert.deepEqual(value, {answer: 42})
      done()
    })
  })

  it(`resolves a callback function as a promise`, done => {
    const presetPackage = cb => cb(null, {answer: 42})
    const result = presetResolver(presetPackage)

    result.then(value => {
      assert.deepEqual(value, {answer: 42})
      done()
    })
  })

  it(`fails promise if callback function returns error`, done => {
    const presetPackage = cb => cb(new Error(`an error happened`))
    const result = presetResolver(presetPackage)

    result.catch(error => {
      assert.deepEqual(error.message, `an error happened`)
      done()
    })
  })
})
