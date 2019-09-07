'use strict'
const Q = require(`q`)
const conventionalChangelog = require(`./conventional-changelog`)
const parserOpts = require(`./parser-opts`)
const recommendedBumpOpts = require(`./conventional-recommended-bump`)
const writerOpts = require(`./writer-opts`)

module.exports = function (parameter) {
  // parameter passed can be either a config object or a callback function
  if (typeof parameter === 'object') {
    // parameter is a config object
    return presetOpts(parameter)
  } else {
    // parameter is a callback object
    const config = {}
    // FIXME: use presetOpts(config) for callback
    Q.all([
      conventionalChangelog(config),
      parserOpts(config),
      recommendedBumpOpts(config),
      writerOpts(config)
    ]).spread((conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) => {
      parameter(null, { gitRawCommitsOpts: { noMerges: null }, conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts })
    })
  }
}

function presetOpts (config) {
  return Q.all([
    conventionalChangelog(config),
    parserOpts(config),
    recommendedBumpOpts(config),
    writerOpts(config)
  ]).spread((conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) => {
    return { conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts }
  })
}
