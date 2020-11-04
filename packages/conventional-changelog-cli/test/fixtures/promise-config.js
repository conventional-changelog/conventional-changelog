'use strict'
const Q = require('q')

module.exports = Q.resolve({
  writerOpts: {
    mainTemplate: '{{commitGroups.[0].commits.[0].type}}{{testContext}}template'
  }
})
