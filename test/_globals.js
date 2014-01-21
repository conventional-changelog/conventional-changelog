var sinon = require('sinon');
var chai = require('chai');

global.expect = chai.expect;

global.sinon = null;

beforeEach(function() {
  global.sinon = sinon.sandbox.create();
});

afterEach(function() {
  global.sinon.restore();
});
