'use strict';
var expect = require('chai').expect;
var fs = require('fs');
var Handlebars = require('handlebars');

var template;
var templateContext;

before(function(done) {
  fs.readFile('templates/header.hbs', function(err, data) {
    template = data.toString();
    done();
  });
});

beforeEach(function() {
  templateContext = {
    version: 'my version'
  };
});

describe('partial.header', function() {
  it('should generate header if `isPatch` is truthy', function() {
    templateContext.isPatch = true;
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('<a name="my version"></a>\n## my version\n');
  });

  it('should generate header if `isPatch` is falsy', function() {
    templateContext.isPatch = false;
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('<a name="my version"></a>\n# my version\n');
  });

  it('should generate header if `title` is truthy', function() {
    templateContext.title = 'my title';
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('<a name="my version"></a>\n# my version "my title"\n');
  });

  it('should generate header if `date` is truthy', function() {
    templateContext.date = 'my date';
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('<a name="my version"></a>\n# my version (my date)\n');
  });
});
