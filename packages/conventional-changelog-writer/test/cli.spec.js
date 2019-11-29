'use strict'
var concat = require('concat-stream')
var expect = require('chai').expect
var mocha = require('mocha')
var describe = mocha.describe
var before = mocha.before
var it = mocha.it
var fs = require('fs')
var spawn = require('child_process').spawn
var path = require('path')

var cliPath = path.join(__dirname, '../cli.js')
var commitsPath = path.join(__dirname, './fixtures/commits.ldjson')
var optionsPath = path.join(__dirname, './fixtures/options.js')
var contextPath = path.join(__dirname, './fixtures/context.json')

describe('changelog-writer cli', function () {
  before(function () {
    process.chdir(__dirname)
    process.stdin.isTTY = true
  })

  it('should work without context and options', function (done) {
    var cp = spawn(process.execPath, [cliPath, commitsPath], {
      stdio: [process.stdin, null, null]
    })
    cp.stdout
      .pipe(concat(function (chunk) {
        expect(chunk.toString()).to.not.be.empty // eslint-disable-line no-unused-expressions
        done()
      }))
  })

  it('should take context', function (done) {
    var cp = spawn(process.execPath, [cliPath, '-c', contextPath, commitsPath], {
      stdio: [process.stdin, null, null]
    })
    cp.stdout
      .pipe(concat(function (chunk) {
        var log = chunk.toString()
        expect(log).to.contain('This is a title')
        expect(log).to.contain('2015 March 14')
        done()
      }))
  })

  it('should take absolute context path', function (done) {
    var cp = spawn(process.execPath, [cliPath, '-c', path.join(__dirname, 'fixtures/context.json'), commitsPath], {
      stdio: [process.stdin, null, null]
    })
    cp.stdout
      .pipe(concat(function (chunk) {
        var log = chunk.toString()
        expect(log).to.contain('This is a title')
        expect(log).to.contain('2015 March 14')
        done()
      }))
  })

  it('should take options', function (done) {
    var cp = spawn(process.execPath, [cliPath, '-o', optionsPath, commitsPath], {
      stdio: [process.stdin, null, null]
    })
    cp.stdout
      .pipe(concat(function (chunk) {
        expect(chunk.toString()).to.equal('template')
        done()
      }))
  })

  it('should take absolute options path', function (done) {
    var cp = spawn(process.execPath, [cliPath, '-o', path.join(__dirname, 'fixtures/options.js'), commitsPath], {
      stdio: [process.stdin, null, null]
    })
    cp.stdout
      .pipe(concat(function (chunk) {
        expect(chunk.toString()).to.equal('template')
        done()
      }))
  })

  it('should take both context and options', function (done) {
    var cp = spawn(process.execPath, [cliPath, '-o', optionsPath, '-c', contextPath, commitsPath], {
      stdio: [process.stdin, null, null]
    })
    cp.stdout
      .pipe(concat(function (chunk) {
        expect(chunk.toString()).to.equal('dodge date :D\ntemplate')
        done()
      }))
  })

  it('should work if it is not tty', function (done) {
    var cp = spawn(process.execPath, [cliPath, '-o', optionsPath, '-c', contextPath], {
      stdio: [fs.openSync(commitsPath, 'r'), null, null]
    })
    cp.stdout
      .pipe(concat(function (chunk) {
        expect(chunk.toString()).to.equal('dodge date :D\ntemplate')
        done()
      }))
  })

  it('should error when there is no commit input', function (done) {
    console.log('DEBUG: ' + process.stdin.isTTY)
    var cp = spawn(process.execPath, [cliPath], {
      stdio: [process.stdin, null, null]
    })
    cp.stderr
      .pipe(concat(function (err) {
        expect(err.toString()).to.equal('You must specify at least one line delimited json file\n')
        done()
      }))
  })

  it('should error when options file doesnt exist', function (done) {
    var cp = spawn(process.execPath, [cliPath, '-o', 'nofile'], {
      stdio: [process.stdin, null, null]
    })
    cp.stderr
      .pipe(concat(function (err) {
        expect(err.toString()).to.contain('Failed to get options from file nofile\n')
        done()
      }))
  })

  it('should error when context file doesnt exist', function (done) {
    var cp = spawn(process.execPath, [cliPath, '--context', 'nofile'], {
      stdio: [process.stdin, null, null]
    })
    cp.stderr
      .pipe(concat(function (err) {
        expect(err.toString()).to.contain('Failed to get context from file nofile\n')
        done()
      }))
  })

  it('should error when commit input files dont exist', function (done) {
    var cp = spawn(process.execPath, [cliPath, 'nofile', 'fakefile'], {
      stdio: [process.stdin, null, null]
    })
    cp.stderr
      .pipe(concat(function (err) {
        err = err.toString()
        expect(err).to.contain('Failed to read file nofile\n')
        expect(err).to.contain('Failed to read file fakefile\n')
        done()
      }))
  })

  it('should error when commit input file is invalid line delimited json', function (done) {
    var cp = spawn(process.execPath, [cliPath, 'fixtures/invalid_line_delimited.json'], {
      stdio: [process.stdin, null, null]
    })
    cp.stderr
      .pipe(concat(function (err) {
        expect(err.toString()).to.contain('Failed to split commits in file fixtures/invalid_line_delimited.json\n')
        done()
      }))
  })

  it('should error when commit input file is invalid line delimited json if it is not tty', function (done) {
    var cp = spawn(process.execPath, [cliPath], {
      stdio: [fs.openSync(path.join(__dirname, 'fixtures/invalid_line_delimited.json'), 'r'), null, null]
    })
    cp.stderr
      .pipe(concat(function (err) {
        expect(err.toString()).to.contain('Failed to split commits\n')
        done()
      }))
  })
})
