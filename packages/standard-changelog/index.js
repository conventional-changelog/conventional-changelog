'use strict'

const conventionalChangelogCore = require('conventional-changelog-core')
const angular = require('conventional-changelog-angular')
const fs = require('fs')
const accessSync = require('fs-access').sync
const pc = require('picocolors')
const figures = require('figures')
const sprintf = require('sprintf-js').sprintf

function conventionalChangelog (options, context, gitRawCommitsOpts, parserOpts, writerOpts) {
  options = options || {}
  options.config = angular
  return conventionalChangelogCore(options, context, gitRawCommitsOpts, parserOpts, writerOpts)
}

conventionalChangelog.createIfMissing = function (infile) {
  try {
    accessSync(infile, fs.F_OK)
  } catch (err) {
    if (err.code === 'ENOENT') {
      conventionalChangelog.checkpoint('created %s', [infile])
      fs.writeFileSync(infile, '\n', 'utf-8')
    }
  }
}

conventionalChangelog.checkpoint = function (msg, args) {
  console.info(pc.green(figures.tick) + ' ' + sprintf(msg, args.map(function (arg) {
    return pc.bold(arg)
  })))
}

module.exports = conventionalChangelog
