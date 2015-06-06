'use strict';
var expect = require('chai').expect;
var fs = require('fs');
var Handlebars = require('handlebars');

var template;
var templateContext;

before(function(done) {
  fs.readFile('templates/commit.hbs', function(err, data) {
    template = data.toString();
    done();
  });
});

beforeEach(function() {
  templateContext = {
    scope: 'my scope',
    subject: 'my subject',
    host: 'www.myhost.com',
    repository: 'a/b',
    commit: 'my commits',
    issue: 'my issue',
    hash: 'hash'
  };
});

describe('partial.commit', function() {
  it('should generate commit if `linkReferences` is falsy', function() {
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('* **my scope:** my subject hash\n');
  });

  it('should generate commit if `linkReferences` is thuthy', function() {
    templateContext.linkReferences = true;
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('* **my scope:** my subject ([hash](www.myhost.com/a/b/my commits/hash))\n');
  });

  it('should generate commit if `references` is truthy and `linkReferences` is falsy', function() {
    templateContext.references = [{
      issue: 1
    }, {
      issue: 2
    }, {
      issue: 3
    }];
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('* **my scope:** my subject hash, closes #1 #2 #3\n');
  });

  it('should generate commit if `references` is truthy and `linkReferences` is truthy', function() {
    templateContext.linkReferences = true;
    templateContext.references = [{
      issue: 1
    }, {
      issue: 2
    }, {
      issue: 3
    }];
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('* **my scope:** my subject ([hash](www.myhost.com/a/b/my commits/hash)), closes [#1](www.myhost.com/a/b/my issue/1) [#2](www.myhost.com/a/b/my issue/2) [#3](www.myhost.com/a/b/my issue/3)\n');
  });

  it('should reference an issue in a different repository', function() {
    templateContext.linkReferences = true;
    templateContext.references = [{
      repository: 'c/d',
      issue: 1
    }];
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('* **my scope:** my subject ([hash](www.myhost.com/a/b/my commits/hash)), closes [c/d#1](www.myhost.com/c/d/my issue/1)\n');
  });

  it('should generate commit if `scope` is missing', function() {
    templateContext = {
      subject: 'my subject'
    };
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('* my subject \n');
  });

  it('should use `header` if `subject` is missing', function() {
    templateContext = {
      header: 'my header'
    };
    var log = Handlebars.compile(template)(templateContext);

    expect(log).to.equal('* my header \n');
  });
});
