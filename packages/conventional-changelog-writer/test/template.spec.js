'use strict'
var expect = require('chai').expect
var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var before = mocha.before
var beforeEach = mocha.beforeEach
var fs = require('fs')
var Handlebars = require('handlebars')

var template
var templateContext

before(function (done) {
  fs.readFile('templates/template.hbs', function (err, data) {
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
    var log = Handlebars.compile(template)(templateContext)

    expect(log).to.equal('my header\n\nmy commit\nmy commit\n\nmy footer\n\n\n')
  })
})
