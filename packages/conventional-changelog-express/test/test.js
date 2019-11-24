'use strict'
var conventionalChangelogCore = require('conventional-changelog-core')
var config = require('../')
var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var before = mocha.before
var expect = require('chai').expect
var gitDummyCommit = require('git-dummy-commit')
var shell = require('shelljs')
var through = require('through2')

describe('express preset', function () {
  before(function (done) {
    shell.config.resetForTesting()
    shell.cd(__dirname)
    shell.rm('-rf', 'tmp')
    shell.mkdir('tmp')
    shell.cd('tmp')
    shell.mkdir('git-templates')
    shell.exec('git init --template=./git-templates')
    gitDummyCommit(['deps: type-is@~1.6.3', '', ' - deps: mime-types@~2.1.1',
      ' - perf: reduce try block size',
      ' - perf: remove bitwise operations'])
    gitDummyCommit(['perf: use saved reference to http.STATUS_CODES', '', 'closes #2602'])
    gitDummyCommit(['docs: add license comments'])
    gitDummyCommit(['deps: path-to-regexp@0.1.4'])
    gitDummyCommit(['Bad commit'])
    done()
  })

  it('should work if there is no semver tag', function (done) {
    conventionalChangelogCore({
      config: config
    })
      .on('error', function (err) {
        done(err)
      })
      .pipe(through(function (chunk) {
        chunk = chunk.toString()

        expect(chunk).to.include('### Dependencies')
        expect(chunk).to.include('type-is@~1.6.3')
        expect(chunk).to.include(' - deps: mime-types@~2.1.1\n')
        expect(chunk).to.include('path-to-regexp@0.1.4')
        expect(chunk).to.include('### Performance')
        expect(chunk).to.include('use saved reference to http.STATUS_CODES')

        expect(chunk).to.not.include('license')
        expect(chunk).to.not.include('Bad')

        done()
      }))
  })
})
