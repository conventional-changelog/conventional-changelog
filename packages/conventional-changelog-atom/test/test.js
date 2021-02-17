'use strict'
const conventionalChangelogCore = require('conventional-changelog-core')
const config = require('../')
const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it
const beforeEach = mocha.beforeEach
const afterEach = mocha.afterEach
const expect = require('chai').expect
const through = require('through2')
const fs = require('fs')
const tmp = require('tmp')
const { execSync } = require('child_process')

tmp.setGracefulCleanup()

const oldDir = process.cwd()

function gitDummyCommit (msg) {
  // we need to escape backtick for bash but not for windows
  // probably this should be done in git-dummy-commit or shelljs
  if (process.platform !== 'win32') {
    msg = msg.replace(/`/g, '\\`')
  }
  execSync(`git commit -m "${msg}" --allow-empty --no-gpg-sign`, {
    stdio: 'ignore'
  })
}

describe('atom preset', function () {
  beforeEach(() => {
    const tmpDir = tmp.dirSync()
    process.chdir(tmpDir.name)
    fs.mkdirSync('git-templates')
    execSync('git init --template=./git-templates', {
      stdio: 'ignore'
    })
    gitDummyCommit(':arrow_down: exception-reporting')
    gitDummyCommit(':bug: `updateContentDimensions` when model changes')
    gitDummyCommit('Merge pull request #7881 from atom/bf-upgrade-babel-to-5.6.17')
    gitDummyCommit(':arrow_up: language-gfm@0.79.0')
    gitDummyCommit(':arrow_up: one-dark/light-ui@v1.0.1')
  })

  afterEach(() => {
    process.chdir(oldDir)
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

        expect(chunk).to.include(':arrow_down:')
        expect(chunk).to.include('`updateContentDimensions` when model changes')
        expect(chunk).to.include(':arrow_up:')
        expect(chunk).to.include('one-dark/light-ui@v1.0.1')

        expect(chunk).to.not.include('7881')

        done()
      }))
  })
})
