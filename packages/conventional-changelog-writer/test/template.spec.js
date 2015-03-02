'use strict';
var expect = require('chai').expect;
var fs = require('fs');
var Handlebars = require('handlebars');

var template;
var templateContext;

before(function(done) {
  fs.readFile('templates/template.hbs', function(err, data) {
    template = data.toString();
    done();
  });
});

beforeEach(function() {
  Handlebars.registerPartial('header', 'my header\n');
  Handlebars.registerPartial('commit', 'my commit\n');
  Handlebars.registerPartial('footer', 'my footer\n');
  templateContext = {};
});

describe('template', function() {
  it('should generate template if `commitGroups` is falsy', function() {
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('my header\n\n\n\n\nmy footer\n');
  });

  it('should generate template if `commitGroups` is truthy', function() {
    templateContext.commitGroups = [{
      commits: [1, 2]
    }];
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('my header\n\n\nmy commit\nmy commit\n\n\nmy footer\n');
  });

  it('should generate template if `commitGroups` is truthy and `name` is truthy', function() {
    templateContext.commitGroups = [{
      name: 'my name',
      commits: [1, 2]
    }];
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('my header\n\n\n### my name\n\nmy commit\nmy commit\n\n\nmy footer\n');
  });
});
