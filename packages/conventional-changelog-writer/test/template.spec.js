'use strict'
const expect = require('chai').expect
const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it
const before = mocha.before
const beforeEach = mocha.beforeEach
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

let template
let templateContext

before(function (done) {
  fs.readFile(path.resolve(__dirname, '../templates/template.hbs'), function (err, data) {
    if (err) done(err)
    template = data.toString()
    done()
  })
})

beforeEach(function () {
  Handlebars.registerPartial('header', 'my header\n')
  Handlebars.registerPartial('commit', 'my commit\n')
  Handlebars.registerPartial('footer', 'my footer\n')
  templateContext = {}
})

describe('template', function () {
  it('should generate template', function () {
    templateContext.commitGroups = [{
      commits: [1, 2]
    }]
    const log = Handlebars.compile(template)(templateContext)

    expect(log).to.equal('my header\n\nmy commit\nmy commit\n\nmy footer\n\n\n')
  })
})
