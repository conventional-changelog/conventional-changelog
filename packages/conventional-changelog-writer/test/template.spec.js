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
  it('should generate template', function() {
    templateContext.commitGroups = [{
      commits: [1, 2]
    }];
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('my header\n\n\nmy commit\nmy commit\n\nmy footer\n\n\n');
  });

  it('should generate template if `title` is truthy', function() {
    templateContext.commitGroups = [{
      title: 'my title',
      commits: [1, 2]
    }];
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('my header\n\n\n### my title\n\nmy commit\nmy commit\n\nmy footer\n\n\n');
  });
});
