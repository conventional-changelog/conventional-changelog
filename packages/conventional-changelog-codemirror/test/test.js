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

function gitCommitAdd (msg) {
  // we need to escape backtick for bash but not for windows
  // probably this should be done in git-dummy-commit or shelljs
  if (process.platform !== 'win32') {
    msg = msg.replace(/`/g, '\\`')
  }
  execSync(`git add --all && git commit -m "${msg}" --no-gpg-sign`, {
    stdio: 'ignore'
  })
}

describe('codemirror preset', function () {
  beforeEach(() => {
    const tmpDir = tmp.dirSync()
    process.chdir(tmpDir.name)
    fs.mkdirSync('git-templates')
    execSync('git init --template=./git-templates', {
      stdio: 'ignore'
    })

    fs.writeFileSync('test1', '')
    gitCommitAdd('[tern addon] Use correct primary when selecting variables')
    fs.writeFileSync('test2', '')
    gitCommitAdd('[tern addon] Fix patch bc026f1 ')
    fs.writeFileSync('test3', '')
    gitCommitAdd('[css mode] Add values for property flex-direction')
    fs.writeFileSync('test4', '')
    gitCommitAdd('[stylus mode] Fix highlight class after a $var')
    fs.writeFileSync('test5', '')
    gitCommitAdd('Bad commit')
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

        expect(chunk).to.include('### tern')
        expect(chunk).to.include('Use correct primary when selecting variables')
        expect(chunk).to.include('**addon**')
        expect(chunk).to.include('Add values for property flex-direction')
        expect(chunk).to.include('### stylus')

        expect(chunk).to.not.include('Bad')

        done()
      }))
  })
})
