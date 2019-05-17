'use strict'
const Q = require(`q`)
const conventionalChangelog = require(`./conventional-changelog`)
const parserOpts = require(`./parser-opts`)
const recommendedBumpOpts = require(`./conventional-recommended-bump`)
const writerOpts = require(`./writer-opts`)

module.exports = function (config) {
  return Q.all([
    conventionalChangelog(config),
    parserOpts(config),
    recommendedBumpOpts(config),
    writerOpts(config)
  ]).spread((conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) => {
    return { conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts }
  })
}
