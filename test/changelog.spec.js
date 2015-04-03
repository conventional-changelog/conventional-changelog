'use strict';
var changelog = require('../');
var expect = require('chai').expect;

describe('changelog', function() {
  it('should generate a changelog', function(done) {
    changelog({
      log: function() {}
    }, function(err, log) {
      expect(err).to.be.a('null');
      expect(log).to.include('create conventional-changelog module');
      done();
    });
  });
});
