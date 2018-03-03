'use strict'

const Q = require(`q`)

module.exports = presetPackage => (typeof presetPackage === `function` || typeof presetPackage === `object`)
  ? (typeof presetPackage === `function` ? Q.nfcall(presetPackage) : new Q(presetPackage))
  : Promise.reject(new Error(`preset package must be a promise, funciton, or object`))
